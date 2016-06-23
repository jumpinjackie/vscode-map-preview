'use strict';
import * as vscode from 'vscode';

export const EPSG_REGEX = /^EPSG:\d+$/g;
export const PREVIEW_URI_SCHEME = "map-preview";
export const PREVIEW_COMMAND_ID = "map.preview";
export const PREVIEW_PROJ_COMMAND_ID = "map.preview-with-proj";

export function makePreviewUri(doc: vscode.TextDocument): vscode.Uri {
    return vscode.Uri.parse(`${PREVIEW_URI_SCHEME}://map-preview/map-preview: ${doc.fileName}`);
}