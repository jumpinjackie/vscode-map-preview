'use strict';
import * as vscode from 'vscode';
import { PreviewDocumentContentProvider, SourceType } from './preview-document-content-provider';
import { PreviewKind } from './core';

export default class CesiumDocumentContentProvider extends PreviewDocumentContentProvider {
    constructor() {
        super();
    }

    protected getPreviewKind(): PreviewKind {
        return "cesium";
    }

    protected createMapPreview(doc: vscode.TextDocument, projection: string = null) {
        //Should we languageId check here?
        const text = this.cleanText(doc.getText());
        const staticRoot = this.createStaticFileUri("");
        const config = vscode.workspace.getConfiguration("map.preview");
        let devToolsLink = config.get<boolean>("debug.insertDevToolsLink") === true ? this.createDevToolsLink(10, 10) : "";
        return `<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div id="map" style="width: 100%; height: 100%">
            ${devToolsLink}
        </div>` +
        this.createLocalSource("Cesium/Widgets/widgets.css", SourceType.STYLE) +
        this.createLocalSource("Cesium/Cesium.js", SourceType.SCRIPT) +
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
                var content = JSON.parse(\`${text}\`);
                CS_initPreviewMap('map', content, \`${staticRoot}\`);
            } catch (e) {
                setError(e);
            }
        </script>
    </body>
</html>`;
    }
}