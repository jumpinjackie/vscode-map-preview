# 0.4.8

 * [#33](https://github.com/jumpinjackie/vscode-map-preview/issues/33): Fix vertex style not displaying for certain geometry types.

# 0.4.7

 * [#34](https://github.com/jumpinjackie/vscode-map-preview/issues/34): Fix GeometryCollection instances not being styled
 * [#33](https://github.com/jumpinjackie/vscode-map-preview/issues/33): Add configuration for vertex style for lines and polygons.

# 0.4.6

This is a quick-and-dirty release to migrate away from the deprecated `vscode.previewHtml` API over to [the VSCode Webview API](https://code.visualstudio.com/api/extension-guides/webview). Everything should be as they were before the extension API migration.

 * [#32](https://github.com/jumpinjackie/vscode-map-preview/issues/32): Update to use VS Code's webview API (thanks for the heads up @sikmir)
 * [#26](https://github.com/jumpinjackie/vscode-map-preview/issues/26): Fix a possible case where "Cannot resolve document for virtual document URI" occurs
 * Updated min vscode requirement to `1.26.0`
 * OpenLayers updated to `5.3.0`
 * `ol-popup` updated to `4.0.0`
 * `ol-layerswitcher` updated to `3.0.0`

# 0.4.2
 * [#24](https://github.com/jumpinjackie/vscode-map-preview/issues/24): Zoom control cut off by format driver label (VSCode 1.4.x)
 
# 0.4.1
 * [#23](https://github.com/jumpinjackie/vscode-map-preview/issues/23): Map Preview not full height on VSCode 1.3.x onwards

# 0.4.0

 * [#2](https://github.com/jumpinjackie/vscode-map-preview/issues/2): Support for configurable styles (point/line/polygon) for preview layer
 * [#8](https://github.com/jumpinjackie/vscode-map-preview/issues/8): Support for configurable coordinate display
 * [#9](https://github.com/jumpinjackie/vscode-map-preview/issues/9): New command `Map Preview (with projection)`, allowing for data to be previewed with a declared projection (required for formats like WKT, that have no inferred geographic projection)
 * [#10](https://github.com/jumpinjackie/vscode-map-preview/issues/10): Fix subsequent previews not working properly
 * [#11](https://github.com/jumpinjackie/vscode-map-preview/issues/11): Configuration option to allow preview content to be dumped out to an external HTML file (for debugging purposes)
 * [#15](https://github.com/jumpinjackie/vscode-map-preview/issues/15): Default base layer is now configurable
 * Some small CSS updates/fixes
 * [#18](https://github.com/jumpinjackie/vscode-map-preview/issues/18): Support for configurable selection style for preview layer

# 0.2.2

 * Additional character escaping fixes

# 0.2.1

 * Clean up error message when previewing unknown content
 * Properly escape some characters that would trip up the previewer

# 0.2.0

First public release on VS marketplace

# 0.1.0

Internal release (to test extension packaging)