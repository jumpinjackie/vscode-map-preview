# VSCode Map Preview

This extension provides the ability to preview spatial data files and snippets on a map

# Supported Formats

Support for various formats is available through the format drivers provided by the [OpenLayers](http://openlayers.org/) library

 * CSV files
 * [GPX](https://openlayers.org/en/latest/apidoc/module-ol_format_GPX.html)
 * [GeoJSON](https://openlayers.org/en/latest/apidoc/module-ol_format_GeoJSON.html)
 * [IGC](https://openlayers.org/en/latest/apidoc/module-ol_format_IGC.html)
 * [KML](https://openlayers.org/en/latest/apidoc/module-ol_format_KML.html)
 * [TopoJSON](http://openlayers.org/en/latest/apidoc/module-ol_format_TopoJSON.html)
 * [WFS](http://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html)
 * [GML](http://openlayers.org/en/latest/apidoc/module-ol_format_GML.html)
 * [GML2](http://openlayers.org/en/latest/apidoc/module-ol_format_GML2.html)
 * [GML3](http://openlayers.org/en/latest/apidoc/module-ol_format_GML3.html)
 * [WKT](http://openlayers.org/en/latest/apidoc/module-ol_format_WKT.html)

# How to use this extension

Open any plain text file (or active open document) and run the `Map Preview` command (default keybinding: `ALT+M`) from the command palette. If the 
text content checks out as any of the above supported formats, it will be parsed into vector feature data
to be shown on an interactive map in the HTML preview pane.

See attached gif for an example:

 ![](https://github.com/jumpinjackie/vscode-map-preview/raw/master/doc/map_preview.gif)

Any content not recognized by the preview command (ie. Doesn't check out as any of the above formats) will cause the following error to be shown

 ![](https://github.com/jumpinjackie/vscode-map-preview/raw/master/doc/preview_error.png)

If you believe this to be incorrect (ie. You have legitimate content that should be one of the above formats), please [report an issue on this](https://github.com/jumpinjackie/vscode-map-preview/issues)

# Configuration

Many aspects of this extension can be configurable. See [the configuration reference](https://github.com/jumpinjackie/vscode-map-preview/blob/master/CONFIGURATION.md)

# Release Notes

See [the release notes document](https://github.com/jumpinjackie/vscode-map-preview/blob/master/RELEASE_NOTES.md)

# Caveats/Limitations

 * The data you are previewing must be transformable to [EPSG:3857 (Web Mercator) coordinates](http://wiki.openstreetmap.org/wiki/EPSG:3857), in order to properly overlay against any of the provided base map layers. If that previous sentence didn't make much sense, the data you are previewing should be in latitude/longitude (known as EPSG:4326) or some other coordinate system that [has an EPSG code representation](http://epsg.io/) 
 * Will probably choke on really large data files (this extension is really meant for quick-and-dirty previews of small files and snippets)

# License

MIT