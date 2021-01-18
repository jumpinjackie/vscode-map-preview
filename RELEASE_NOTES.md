# 0.5.8

 * [#53](https://github.com/jumpinjackie/vscode-map-preview/issues/53) Set `wrapX` to `false` on the OL vector source to fix display of vectors spanning the international date line

# 0.5.7

 * [#52](https://github.com/jumpinjackie/vscode-map-preview/issues/52) Support KML icon styles
 * OpenLayers updated to `6.5.0`
 * `ol-layerswitcher` updated to `3.8.3`

# 0.5.6

 * [#51](https://github.com/jumpinjackie/vscode-map-preview/issues/51) Support opacity properties of Mapbox simple style spec
 * OpenLayers updated to `6.4.3`
 * `ol-layerswitcher` updated to `3.7.0`

# 0.5.5

 * [#50](https://github.com/jumpinjackie/vscode-map-preview/issues/50) Add vector feature label decluttering support
 * [#29](https://github.com/jumpinjackie/vscode-map-preview/issues/29) Partial support for Mapbox SimpleStyle (thanks [@vohtaski](https://github.com/vohtaski))
 * OpenLayers updated to `6.3.1`
 * `ol-layerswitcher` updated to `3.5.0`

# 0.5.2

 * [#48](https://github.com/jumpinjackie/vscode-map-preview/issues/48) Future-proof the extension by using the `asWebViewUri` API in place of `vscode-resource:` URIs.

# 0.5.1

 * [#45](https://github.com/jumpinjackie/vscode-map-preview/issues/45) Restrict showing preview UI buttons only on files types that are potentially previewable
   * `.csv` for CSV files
   * `.json` for GeoJSON files
   * `.kml` for KML files
   * `.gml` for GML files
   * `.gpx` for GPX files
   * `.igc` for IGC files
   * For any other previewable content, you can still run the underlying command.

# 0.5.0

 * [#42](https://github.com/jumpinjackie/vscode-map-preview/issues/42): Update OpenLayers to 6.1.1
 * [#43](https://github.com/jumpinjackie/vscode-map-preview/issues/43): New editor UI buttons to invoke preview commands
 * [#13](https://github.com/jumpinjackie/vscode-map-preview/issues/13): Can now preview CSV files as point data assuming point coordinate columns exist (refer to new configuration properties below)
 * [#16](https://github.com/jumpinjackie/vscode-map-preview/issues/16): Support for custom projections
    * [#44](https://github.com/jumpinjackie/vscode-map-preview/issues/44): The `Map Preview (with projection)` command now lets you pick a projection from the list of registered custom projections instead of requiring you to manually enter an EPSG code.
 * New configuration properties
    * [#41](https://github.com/jumpinjackie/vscode-map-preview/issues/41): Toggle-able vertex styles for line/polygon features
    * [#16](https://github.com/jumpinjackie/vscode-map-preview/issues/16): Defining custom projections
    * [#13](https://github.com/jumpinjackie/vscode-map-preview/issues/13): X/Y point coordinate column aliases when detecting CSV support
 * Fixes to corner cases when previewing certain content
    * [#39](https://github.com/jumpinjackie/vscode-map-preview/issues/39): Scrub out KML icon elements
    * [#37](https://github.com/jumpinjackie/vscode-map-preview/issues/37): Fix backslash escaping

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