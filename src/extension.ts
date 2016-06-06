'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import fileUrl = require('file-url');

enum SourceType {
    SCRIPT,
    STYLE
}

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const content = this.createMapPreview();
        return content;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
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

    private createMapPreview() {
        const editor = vscode.window.activeTextEditor;
        //Should we languageId check here?
        const text = editor.document.getText();
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
                var previewContent = null;

                function setError(e) {
                    var mapEl = document.getElementById("map");
                    var errHtml = "<h1>An error occurred rendering preview</h1>";
                    errHtml += "<p>" + e.name + ": " + e.message + "</p>";
                    errHtml += "<pre>" + e.stack + "</pre>";
                    mapEl.innerHTML = errHtml;
                }

                try {
                    previewContent = \`${text}\`;
                    var preview = createPreviewSource({ featureProjection: 'EPSG:3857' });
                    var previewSource = preview.source;
                    document.getElementById("format").innerHTML = "Using format: " + preview.driver;
                    var previewLayer = new ol.layer.Vector({
                        source: previewSource
                    });
                    initPreviewMap('map', previewLayer);
                } catch (e) {
                    setError(e);
                }
            </script>
        </body>`;
    }

    private errorSnippet(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }
}

const SCHEME = "map-preview";
const COMMAND_ID = "map.preview";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const provider = new TextDocumentContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, provider);
    let disposable = vscode.commands.registerCommand(COMMAND_ID, () => {
        const previewUri = vscode.Uri.parse(`${SCHEME}://map-preview/map-preview: ${vscode.window.activeTextEditor.document.fileName}`);
        return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then((success) => {
            /*
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

    context.subscriptions.push(disposable, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}