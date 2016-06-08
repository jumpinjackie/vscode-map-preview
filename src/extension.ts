'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import fileUrl = require('file-url');

enum SourceType {
    SCRIPT,
    STYLE
}

const SCHEME = "map-preview";
const COMMAND_ID = "map.preview";

function makePreviewUri(doc: vscode.TextDocument): vscode.Uri {
    return vscode.Uri.parse(`${SCHEME}://map-preview/map-preview: ${doc.fileName}`);
}

class PreviewDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private resolveDocument(uri: vscode.Uri): vscode.TextDocument {
        const matches = vscode.window.visibleTextEditors.filter(ed => {
            return makePreviewUri(ed.document).toString() == uri.toString(); 
        });
        if (matches.length == 1) {
            return matches[0].document;
        } else {
            return null;
        }
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const doc = this.resolveDocument(uri);
        if (doc) {
            const content = this.createMapPreview(doc);
            return content;
        } else {
            return this.errorSnippet(`<h1>Error preparing preview</h1><p>Cannot resolve document for virtual document URI: ${uri.toString()}</p>`);
        }
    }

    private errorSnippet(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    private createLocalSource(file: string, type: SourceType) {
        const source_path = fileUrl(
            path.join(
                __dirname,
                "..",
                "..",
                "static",
                file
            )
        );
        switch (type) {
            case SourceType.SCRIPT:
                return `<script src="${source_path}" type="text/javascript"></script>`;
            case SourceType.STYLE:
                return `<link href="${source_path}" rel="stylesheet" />`;
        }
    }

    private cleanText(text: string): string {
        const scrubRegexes = [
            /<\!\[CDATA\[([\s\S]*)]]>/
        ];
        for (const regex of scrubRegexes) {
            text = text.replace(regex, "");
        }
        return text;
    }

    private createMapPreview(doc: vscode.TextDocument) {
        //Should we languageId check here?
        const text = this.cleanText(doc.getText());
        return `<body>
            <div id="map" style="width: 100%; height: 100%">
                <div id="format" style="position: absolute; left: 40; top: 5; z-index: 100; padding: 5px; background: yellow; color: black"></div>
            </div>` +
            this.createLocalSource("ol.css", SourceType.STYLE) +
            this.createLocalSource("ol3-layerswitcher.css", SourceType.STYLE) +
            this.createLocalSource("ol3-popup.css", SourceType.STYLE) +
            this.createLocalSource("ol-debug.js", SourceType.SCRIPT) +
            this.createLocalSource("ol3-layerswitcher.js", SourceType.SCRIPT) +
            this.createLocalSource("ol3-popup.js", SourceType.SCRIPT) +
            this.createLocalSource("preview.js", SourceType.SCRIPT) +
            `<script type="text/javascript">

                function setError(e) {
                    var mapEl = document.getElementById("map");
                    var errHtml = "<h1>An error occurred rendering preview</h1>";
                    errHtml += "<p>" + e.name + ": " + e.message + "</p>";
                    errHtml += "<pre>" + e.stack + "</pre>";
                    mapEl.innerHTML = errHtml;
                }

                try {
                    var content = \`${text}\`;
                    createPreviewSource(content, { featureProjection: 'EPSG:3857' }, function(preview) {
                        var previewSource = preview.source;
                        document.getElementById("format").innerHTML = "Using format: " + preview.driver;
                        initPreviewMap('map', previewSource);
                    });
                } catch (e) {
                    setError(e);
                }
            </script>
        </body>`;
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const provider = new PreviewDocumentContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, provider);
    const command = vscode.commands.registerCommand(COMMAND_ID, () => {
        const previewUri = makePreviewUri(vscode.window.activeTextEditor.document);
        return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then((success) => {
            /*
            //There seems to be a timing problem here (need to wait a bit for the devtools to fire up?)
            //So to ensure this is such a case, stick a breakpoint somewhere in provideTextDocumentContent() method
            //of PreviewDocumentContentProvider and when it hits, wait a few moments before continuing
            console.log("Previewed: " + previewUri.toString());
            vscode.commands.executeCommand('_webview.openDevTools').then(success2 => {
                console.log("Opened webview's dev tools");
            }, fail2 => {
                vscode.window.showErrorMessage(fail2);
            });
            */
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(command, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}