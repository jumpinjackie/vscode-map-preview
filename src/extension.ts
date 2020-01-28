'use strict';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import fileUrl = require('file-url');

enum SourceType {
    SCRIPT,
    STYLE
}

const EPSG_REGEX = /^EPSG:\d+$/g;
const SCHEME = "map-preview";
const WEBVIEW_TYPE = "mapPreview";
const PREVIEW_COMMAND_ID = "map.preview";
const PREVIEW_PROJ_COMMAND_ID = "map.preview-with-proj";

function makePreviewUri(doc: vscode.TextDocument): vscode.Uri {
    return vscode.Uri.parse(`${SCHEME}://map-preview/map-preview: ${doc.fileName}`);
}

class PreviewDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _projections = new Map<string, string>();
    private _subscriptions: vscode.Disposable;

    constructor(private extensionPath: string) {
        this._subscriptions = vscode.Disposable.from(
            vscode.workspace.onDidOpenTextDocument(this.onDocumentOpened.bind(this))
        );
    }

    dispose() {
        this._projections.clear();
        this._subscriptions.dispose();
        this._onDidChange.dispose();
    }

    onDocumentOpened(e: vscode.TextDocument): void {
        //console.log(`Document opened ${e.uri}`);
        const uri = makePreviewUri(e);
        this._onDidChange.fire(uri);
    }

    public triggerVirtualDocumentChange(uri: vscode.Uri): void {
        this._onDidChange.fire(uri);
    }

    public clearPreviewProjection(uri: vscode.Uri): void {
        this._projections.delete(uri.toString());
    }

    public setPreviewProjection(uri: vscode.Uri, projection: string): void {
        this._projections.set(uri.toString(), projection);
    }

    private resolveDocument(uri: vscode.Uri): vscode.TextDocument {
        const matches = vscode.window.visibleTextEditors.filter(ed => {
            return makePreviewUri(ed.document).toString() == uri.toString(); 
        });
        if (matches.length >= 1) { //If we get more than one match, it's probably because the same document has been opened more than once (eg. split view)
            return matches[0].document;
        } else {
            return null;
        }
    }

    private generateDocumentContent(uri: vscode.Uri): string {
        const doc = this.resolveDocument(uri);
        if (doc) {
            let proj = null;
            const sUri = uri.toString();
            if (this._projections.has(sUri)) {
                proj = this._projections.get(sUri);
            }
            const content = this.createMapPreview(doc, proj);
            const debugSettings = vscode.workspace.getConfiguration("map.preview.debug");
            if (debugSettings.has("dumpContentPath")) {
                const dumpPath = debugSettings.get<string>("dumpContentPath");
                if (dumpPath) {
                    try {
                        fs.writeFileSync(dumpPath, content);
                    } catch (e) {
                        vscode.window.showErrorMessage(`Error dumping preview content: ${e.message}`);
                    }
                }
            }
            return content;
        } else {
            return this.errorSnippet(`<h1>Error preparing preview</h1><p>Cannot resolve document for virtual document URI: ${uri.toString()}</p>`);
        }
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const content = this.generateDocumentContent(uri);
        const sUri = uri.toString();
        return content;
    }

    private errorSnippet(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }

    /**
     * Expose an event to signal changes of _virtual_ documents
     * to the editor
     */
    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    private createLocalSource(file: string, type: SourceType) {
        const onDiskPath = vscode.Uri.file(
            path.join(this.extensionPath, 'static', file)
        );
    
        const source_path = onDiskPath.with({ scheme: "vscode-resource" });
        switch (type) {
            case SourceType.SCRIPT:
                return `<script src="${source_path}" type="text/javascript"></script>`;
            case SourceType.STYLE:
                return `<link href="${source_path}" rel="stylesheet" />`;
        }
    }

    private cleanText(text: string): string {
        const scrubRegexes = [
            { regex: /\\(?!\\|\/|\})/g, replace: "\\\\" },        //Existing backslashes
            { regex: /(<\!\[CDATA\[[\s\S]*?]]>)/g, replace: "" }, //CDATA blocks in XML
            { regex: /`/g, replace: "\\`" },                      //Backticks
            { regex: /\${/g, replace: "\\${" }                    //Start of ES6 template string placeholder
        ];
        for (const r of scrubRegexes) {
            text = text.replace(r.regex, r.replace);
        }
        return text;
    }

    private createMapPreview(doc: vscode.TextDocument, projection: string = null) {
        //Should we languageId check here?
        const text = this.cleanText(doc.getText());
        const config = vscode.workspace.getConfiguration("map.preview");
        return `<body>
            <div id="map" style="width: 100%; height: 100%">
                <div id="format" style="position: absolute; left: 40; top: 5; z-index: 100; padding: 5px; background: yellow; color: black"></div>
            </div>` +
            this.createLocalSource("ol.css", SourceType.STYLE) +
            this.createLocalSource("ol-layerswitcher.css", SourceType.STYLE) +
            this.createLocalSource("ol-popup.css", SourceType.STYLE) +
            this.createLocalSource("proj4.js", SourceType.SCRIPT) +
            this.createLocalSource("ol.js", SourceType.SCRIPT) +
            this.createLocalSource("ol-layerswitcher.js", SourceType.SCRIPT) +
            this.createLocalSource("ol-popup.js", SourceType.SCRIPT) +
            this.createLocalSource("preview.js", SourceType.SCRIPT) +
            this.createLocalSource("preview.css", SourceType.STYLE) +
            `<script type="text/javascript">

                function setError(e) {
                    var mapEl = document.getElementById("map");
                    var errHtml = "<h1>An error occurred rendering preview</h1>";
                    //errHtml += "<p>" + e.name + ": " + e.message + "</p>";
                    errHtml += "<pre>" + e.stack + "</pre>";
                    mapEl.innerHTML = errHtml;
                }

                try {
                    var previewProj = ${projection ? ('"' + projection + '"') : "null"};
                    var previewConfig = ${JSON.stringify(config)};
                    previewConfig.sourceProjection = previewProj;
                    var content = \`${text}\`;
                    var formatOptions = { featureProjection: 'EPSG:3857' };
                    if (previewProj != null) {
                        formatOptions.dataProjection = previewProj; 
                    }
                    createPreviewSource(content, formatOptions, previewConfig, function (preview) {
                        document.getElementById("format").innerHTML = "Format: " + preview.driver;
                        initPreviewMap('map', preview, previewConfig);
                    });
                } catch (e) {
                    setError(e);
                }
            </script>
        </body>`;
    }
}

function loadWebView(content: PreviewDocumentContentProvider, previewUri: vscode.Uri, fileName: string, extensionPath: string) {
    //const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    const panel = vscode.window.createWebviewPanel(WEBVIEW_TYPE, `Map Preview: ${fileName}`, vscode.ViewColumn.Two, {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `static` directory.
        localResourceRoots: [
            vscode.Uri.file(path.join(extensionPath, 'static'))
        ]
    });
    panel.webview.html = content.provideTextDocumentContent(previewUri);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const extensionPath = context.extensionPath;
    const provider = new PreviewDocumentContentProvider(extensionPath);
    const registration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, provider);
    const previewCommand = vscode.commands.registerCommand(PREVIEW_COMMAND_ID, () => {
        const doc = vscode.window.activeTextEditor.document;
        const docName = path.basename(doc.fileName);
        const previewUri = makePreviewUri(doc);
        provider.clearPreviewProjection(previewUri);
        provider.triggerVirtualDocumentChange(previewUri);
        loadWebView(provider, previewUri, docName, extensionPath);
    });

    const previewWithProjCommand = vscode.commands.registerCommand(PREVIEW_PROJ_COMMAND_ID, () => {
        const opts: vscode.InputBoxOptions = {
            prompt: "Enter the EPSG code for your projection",
            placeHolder: "EPSG:XXXX",
            validateInput: (val) => {
                if (!val.match(EPSG_REGEX)) {
                    return "The projection is not of the form 'EPSG:XXXX', where XXXX is a number";
                }
                return null;
            }
        };
        vscode.window.showInputBox(opts).then(val => {
            if (val) {
                const doc = vscode.window.activeTextEditor.document;
                const docName = path.basename(doc.fileName);
                const previewUri = makePreviewUri(doc);
                provider.setPreviewProjection(previewUri, val);
                provider.triggerVirtualDocumentChange(previewUri);
                loadWebView(provider, previewUri, docName, extensionPath);
            }
        });
    });

    context.subscriptions.push(previewCommand, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}