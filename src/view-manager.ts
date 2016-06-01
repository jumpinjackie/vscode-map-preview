import * as vscode from 'vscode';
import * as uuid from "node-uuid";
import { HtmlDocumentView } from './html-document-view';

class IDMap {
    private map: Map<[vscode.Uri, vscode.Uri], string> = new Map();

    public getByUri(uri: vscode.Uri) {
        let keys = this.map.keys()
        let key: IteratorResult<[vscode.Uri, vscode.Uri]> = keys.next();
        while (!key.done) {
            if (key.value.indexOf(uri) > -1) {
                return this.map.get(key.value);
            }
            key = keys.next();
        }
        return null;
    }

    public hasUri(uri: vscode.Uri) {
        return this.getByUri(uri) !== null;
    }

    public add(uri1: vscode.Uri, uri2: vscode.Uri) {
        let id = uuid.v4();
        this.map.set([uri1, uri2], id);
        return id;
    }
}


export class ViewManager {
    private idMap: IDMap = new IDMap();
    private fileMap: Map<string, HtmlDocumentView> = new Map();

    private sendHTMLCommand(displayColumn: vscode.ViewColumn, doc: vscode.TextDocument, toggle: boolean = false) {
        let id: string;
        let htmlDoc: HtmlDocumentView;
        if (!this.idMap.hasUri(doc.uri)) {
            htmlDoc = new HtmlDocumentView(doc);
            id = this.idMap.add(doc.uri, htmlDoc.uri);
            this.fileMap.set(id, htmlDoc);
        } else {
            id = this.idMap.getByUri(doc.uri);
            htmlDoc = this.fileMap.get(id);
        }
        if (toggle || htmlDoc.uri === doc.uri) {
            htmlDoc.executeToggle(displayColumn);
        } else {
            htmlDoc.executeSide(displayColumn);
        }
    }

    public previewToSide() {
        let displayColumn: vscode.ViewColumn;
        switch (vscode.window.activeTextEditor.viewColumn) {
            case vscode.ViewColumn.One:
                displayColumn = vscode.ViewColumn.Two;
                break;
            case vscode.ViewColumn.Two:
            case vscode.ViewColumn.Three:
                displayColumn = vscode.ViewColumn.Three;
                break;
        }
        this.sendHTMLCommand(displayColumn,
            vscode.window.activeTextEditor.document);
    }

    public preview() {
        // activeTextEditor does not exist when triggering on a html preview
        this.sendHTMLCommand(vscode.window.activeTextEditor.viewColumn,
            vscode.window.activeTextEditor.document, true);
    }
    
    public dispose() {
        let values = this.fileMap.values()
        let value: IteratorResult<HtmlDocumentView> = values.next();
        while (!value.done) {
            value.value.dispose();
            value = values.next();
        }
    }
}