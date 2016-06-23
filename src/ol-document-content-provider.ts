'use strict';
import * as vscode from 'vscode';
import { PreviewDocumentContentProvider, SourceType } from './preview-document-content-provider';
import { PreviewKind } from './core';

export default class OpenLayersDocumentContentProvider extends PreviewDocumentContentProvider {
    constructor() {
        super();
    }

    protected getPreviewKind(): PreviewKind {
        return "map";
    }

    protected createMapPreview(doc: vscode.TextDocument, projection: string = null) {
        //Should we languageId check here?
        const text = this.cleanText(doc.getText());
        const config = vscode.workspace.getConfiguration("map.preview");
        return `<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div id="map" style="width: 100%; height: 100%">
            <div id="format" style="position: absolute; left: 40; top: 5; z-index: 100; padding: 5px; background: yellow; color: black"></div>
        </div>` +
        this.createLocalSource("ol.css", SourceType.STYLE) +
        this.createLocalSource("ol3-layerswitcher.css", SourceType.STYLE) +
        this.createLocalSource("ol3-popup.css", SourceType.STYLE) +
        this.createLocalSource("ol3cesium.js", SourceType.SCRIPT) +
        this.createLocalSource("ol3-layerswitcher.js", SourceType.SCRIPT) +
        this.createLocalSource("ol3-popup.js", SourceType.SCRIPT) +
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
                OL_createPreviewSource(content, formatOptions, function (preview) {
                    document.getElementById("format").innerHTML = "Format: " + preview.driver;
                    OL_initPreviewMap('map', preview, previewConfig);
                });
            } catch (e) {
                setError(e);
            }
        </script>
    </body>
</html>`;
    }
}