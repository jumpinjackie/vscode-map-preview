# Extension Configuration

Starting with version `0.4.0`, various aspects of this extension can be configured. You can configure such aspects by adding configuration settings to your `settings.json` 

Configuration properties introduced in newer versions will be documented as such.

This document describes the various configuration settings available

## map.preview.defaultBaseLayer

Type: `string`

Valid Values:
 * `"stamen-toner"` ([Stamen Toner](http://maps.stamen.com/toner))
 * `"stamen-terrain"` ([Stamen Terrain](http://maps.stamen.com/terrain))
 * `"stamen-water"` ([Stamen Watercolor](http://maps.stamen.com/watercolor))
 * `"osm"` ([OpenStreetMap](http://www.openstreetmap.org/))

Default Value: `"stamen-toner"`

Description: The default base layer to use for map previews

## map.preview.debug.dumpContentPath

Type: `string`

Default Value: `null`

Description: A file path to dump the current preview content to. Used for debugging purposes. Disabled (`null`) by default

## map.preview.coordinateDisplay.projection

Type: `string`

Default Value: `"EPSG:4326"`

Description: The projection to use (default: [EPSG:4326](http://epsg.io/4326))

## map.preview.coordinateDisplay.format

Type: `string`

Default Value: `"Lat: {y}, Lng: {x}"`

Description: A format string describing how coordinates are to be formatted. The format string must contain the `{x}` and `{y}` coordinate placeholder tokens

## map.preview.style.line.stroke.color

Type: `string`

Default Value: `"rgba(49, 159, 211, 1)"`

Description: The default color to use for line strokes. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.line.stroke.width

Type: `number`

Default Value: `2`

Description: The default thickness of line strokes. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.polygon.stroke.color

Type: `string`

Default Value: `"rgba(49, 159, 211, 1)"`

Description: The default color to use for polygon borders. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.polygon.stroke.width

Type: `number`

Default Value: `2`

Description: The default thickness of polygon borders. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.polygon.fill.color

Type: `string`

Default Value: `"rgba(49, 159, 211, 0.1)"`

Description: The default color to use for polygon fills. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.point.radius

Type: `number`

Default Value: `5`

Description: The default point radius in screen-space. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.point.stroke.color

Type: `string`

Default Value: `"rgba(49, 159, 211, 1)"`

Description: The default color to use for point borders. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.point.stroke.width

Type: `number`

Default Value: `2`

Description: The default thickness of point borders. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.point.fill.color

Type: `string`

Default Value: `"rgba(49, 159, 211, 0.2)"`

Description: The default color to use for point fills. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.line.stroke.color

Type: `string`

Default Value: `"rgba(255, 0, 0, 1)"`

Description: The default color to use for line strokes for selected features. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.line.stroke.width

Type: `number`

Default Value: `2`

Description: The default thickness of line strokes for selected features. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.polygon.stroke.color

Type: `string`

Default Value: `"rgba(255, 0, 0, 1)"`

Description: The default color to use for polygon borders for selected features. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.polygon.stroke.width

Type: `number`

Default Value: `2`

Description: The default thickness of polygon borders for selected features. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.polygon.fill.color

Type: `string`

Default Value: `"rgba(255, 0, 0, 0.1)"`

Description: The default color to use for polygon fills for selected features. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.point.stroke.color

Type: `string`

Default Value: `"rgba(255, 0, 0, 1)"`

Description: The default color to use for point borders for selected features. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.point.stroke.width

Type: `number`

Default Value: `2`

Description: The default thickness of point borders for selected features. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.selectionStyle.point.fill.color

Type: `string`

Default Value: `"rgba(255, 0, 0, 0.2)"`

Description: The default color to use for point fills for selected features. This is an `rgba(r, g, b, a)` expression. NOTE: Doesn't affect KML if its features have been configured with inline styles

## map.preview.style.vertex.enabled (new in 0.5.0)

Type: `boolean`

Default Value: `false`

Description: Controls whether to style vertices in line/polygon features.

## map.preview.style.vertex.radius (new in 0.4.7)

Type: `number`

Default Value: `3`

Description: The default vertex radius in screen-space. Used to style vertices in lines and polygon layers. NOTE: Doesn't affect KML if its features have been configured with inline styles

> For 0.5.0 onwards: If `map.preview.style.vertex.enabled` is `false`, this setting has no effect

## map.preview.style.vertex.fill.color  (new in 0.4.7)

Type: `string`

Default Value: `"rgba(49, 159, 211, 1)"`

Description: The default vertex color. Used to style vertices in lines and polygon layers. NOTE: Doesn't affect KML if its features have been configured with inline styles

> For 0.5.0 onwards: If `map.preview.style.vertex.enabled` is `false`, this setting has no effect

## map.preview.projections (new in 0.5.0)

Type: `array (of { "epsgCode": number, "definition": string })`

Default Value: `[]`

Description: A list of additional map projections to register with this extension. Such projections can be used with the `Map Preview (with projection)` command

For example, to register the [EPSG:28355 projection](https://epsg.io/28355), you would set this property as follows:

```
"map.preview.projections": [
    { "epsgCode": 28355, "definition": "+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs" }
]
```

## map.preview.csvColumnAliases

Type: `array (of { "xColumn": string, "yColumn": string })`

Default Value: 

```
[
    { "xColumn": "x", "yColumn": "y" },
    { "xColumn": "lon", "yColumn": "lat" },
    { "xColumn": "long", "yColumn": "lat" },
    { "xColumn": "lng", "yColumn": "lat" },
    { "xColumn": "longitude", "yColumn": "latitude" },
    { "xColumn": "easting", "yColumn": "northing" }
]
```

Description: A list of case-insensitive column name pairs to look for X/Y coordinates when attempting to preview a given CSV file. If no column pair match is found, the document content is not considered as a CSV and the extension will move on to the other supported format drivers one-by-one

## map.preview.declutterLabels

Type: `boolean`

Default Value: `false`

Description: If set to `true`, the preview vector layer will have decluttering enabled, which will prevent rendering of features whose labels overlap with others. This is useful for data like point-heavy KML files where the point density is such that labels are illegible at the higher zoom levels, but as you zoom in closer, more points and labels are able to be shown.