'use strict';
import * as vscode from 'vscode';

export const EPSG_REGEX = /^EPSG:\d+$/g;
export const MAP_PREVIEW_URI_SCHEME = "map-preview";
export const CESIUM_PREVIEW_URI_SCHEME = "cesium-preview";
export const MAP_PREVIEW_COMMAND_ID = "map.preview";
export const MAP_PREVIEW_PROJ_COMMAND_ID = "map.preview-with-proj";
export const CESIUM_PREVIEW_COMMAND_ID = "map.cs-preview";

export type PreviewKind = "map" | "cesium";

export function makePreviewUri(kind: PreviewKind, doc: vscode.TextDocument): vscode.Uri {
    return vscode.Uri.parse(`${kind}-preview://map-preview/map-preview: ${doc.fileName}`);
}