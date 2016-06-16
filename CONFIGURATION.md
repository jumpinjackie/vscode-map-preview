# Extension Configuration

Starting with version `0.4.0`, various aspects of this extension can be configured. You can configure such aspects by adding configuration settings to your `settings.json` 

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