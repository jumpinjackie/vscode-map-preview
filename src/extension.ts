'use strict';
import * as fs from 'fs';
import * as vscode from 'vscode';
import PreviewDocumentContentProvider from './preview-document-content-provider';
import * as extension from './core';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const provider = new PreviewDocumentContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider(extension.PREVIEW_URI_SCHEME, provider);
    const previewCommand = vscode.commands.registerCommand(extension.PREVIEW_COMMAND_ID, () => {
        const doc = vscode.window.activeTextEditor.document;
        const previewUri = extension.makePreviewUri(doc);
        provider.clearPreviewProjection(previewUri);
        provider.triggerVirtualDocumentChange(previewUri);
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then((success) => {

        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    const previewWithProjCommand = vscode.commands.registerCommand(extension.PREVIEW_PROJ_COMMAND_ID, () => {
        const opts: vscode.InputBoxOptions = {
            prompt: "Enter the EPSG code for your projection",
            placeHolder: "EPSG:XXXX",
            validateInput: (val) => {
                if (!val.match(extension.EPSG_REGEX)) {
                    return "The projection is not of the form 'EPSG:XXXX', where XXXX is a number";
                }
                return null;
            }
        };
        vscode.window.showInputBox(opts).then(val => {
            if (val) {
                const doc = vscode.window.activeTextEditor.document;
                const previewUri = extension.makePreviewUri(doc);
                provider.setPreviewProjection(previewUri, val);
                provider.triggerVirtualDocumentChange(previewUri);
                vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then((success) => {
                    
                }, (reason) => {
                    vscode.window.showErrorMessage(reason);
                });
            }
        });
    });

    context.subscriptions.push(previewCommand, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
    
}