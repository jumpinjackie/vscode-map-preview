'use strict';
import * as vscode from 'vscode';
import { ViewManager } from './view-manager';

let viewManager: ViewManager;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    viewManager = new ViewManager();
    context.subscriptions.push(
        vscode.commands.registerCommand("map.preview", () => {
            viewManager.previewToSide();
        }),
        vscode.commands.registerCommand("map.previewToSide", () => {
            viewManager.preview();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
    viewManager.dispose();
}