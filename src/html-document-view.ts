import * as vscode from 'vscode';
import * as path from 'path';
import fileUrl = require('file-url');

enum SourceType {
    SCRIPT,
    STYLE
}

class HtmlDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private doc: vscode.TextDocument;

    constructor(document: vscode.TextDocument) {
        this.doc = document;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const content = this.createHtmlSnippet();
        return content;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private createHtmlSnippet(): string {
        return this.preview();
    }

    private errorSnippet(error: string): string {
        return `<body>
                    ${error}
                </body>`;
    }

    private createLocalSource(file: string, type: SourceType) {
        let source_path = fileUrl(
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

    private preparePreviewMap(): string {
        return `<body>
            <div id="map" style="width: 100%; height: 100%">
                
            </div>
            <script type="text/javascript">
            var previewContent = \`${this.doc.getText()}\`;
            var map = new ol.Map({
                target: 'map'
            });
            var previewSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(previewContent, { featureProjection: 'EPSG:3857' })
            });
            var previewLayer = new ol.layer.Vector({
                source: previewSource
            });
            map.addLayer(new ol.layer.Tile({
                source: new ol.source.OSM()
            }));
            map.addLayer(previewLayer);
            var mapView = new ol.View({
                center: ol.extent.getCenter(previewSource.getExtent()),
                zoom: 4
            });
            map.setView(mapView);

            </script>
        </body>`;
    }

    private fixLinks(): string {
        return this.preparePreviewMap().replace(
            new RegExp("((?:src|href)=[\'\"])((?!http|\\/).*?)([\'\"])", "gmi"),
            (subString: string, p1: string, p2: string, p3: string): string => {
                return [
                    p1,
                    fileUrl(path.join(
                        path.dirname(this.doc.fileName),
                        p2
                    )),
                    p3
                ].join("");
            }
        );
    }

    public preview(): string {
        return this.createLocalSource("ol.css", SourceType.STYLE) +
               this.createLocalSource("ol-debug.js", SourceType.SCRIPT) +
               this.fixLinks();
    }
}

export class HtmlDocumentView {
    private provider: HtmlDocumentContentProvider;
    private registrations: vscode.Disposable[] = [];
    private title: string;
    private previewUri: vscode.Uri;
    private doc: vscode.TextDocument;

    constructor(document: vscode.TextDocument) {
        this.doc = document;
        this.title = `Preview: '${path.basename(vscode.window.activeTextEditor.document.fileName)}'`;
        this.provider = new HtmlDocumentContentProvider(this.doc);
        this.registrations.push(vscode.workspace.registerTextDocumentContentProvider("html-preview", this.provider));
        this.previewUri = vscode.Uri.parse(`html-preview://preview/${this.title}`);
        this.registerEvents();
    }
    
    public get uri(): vscode.Uri {
        return this.previewUri;
    }

    private registerEvents() {
        this.registrations.push(vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
            if (!this.visible) {
                return;
            }
            if (e.document === this.doc) {
                this.provider.update(this.previewUri);
            }
        }));
    }

    private get visible(): boolean {
        for (let i in vscode.window.visibleTextEditors) {
            if (vscode.window.visibleTextEditors[i].document.uri === this.previewUri) {
                return true;
            }
        }
        return false;
    }

    public executeToggle(column: vscode.ViewColumn) {
        if (this.visible) {
            vscode.window.showTextDocument(this.doc, column);
            this.visible = false;
        } else {
            this.execute(column);
        }
    }

    public executeSide(column: vscode.ViewColumn) {
        this.execute(column);
    }

    private execute(column: vscode.ViewColumn) {
        vscode.commands.executeCommand("vscode.previewHtml", this.previewUri, column).then((success) => {
        }, (reason) => {
            console.warn(reason);
            vscode.window.showErrorMessage(reason);
        });
    }
    
    public dispose() {
        for (let i in this.registrations) {
            this.registrations[i].dispose();
        }
    }
}