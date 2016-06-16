function renderFeaturesHtml(selFeatures) {
    var html = "<div>";
    html += "<table>";
    var showFeatureHeader = (selFeatures.length > 1);

    var noAttributeCount = 0;
    for (var i = 0; i < selFeatures.length; i++) {
        var feat = selFeatures[i];
        var names = feat.getKeys();
        if (names.length == 1 && names[0] == feat.getGeometryName()) {
            noAttributeCount++;
        }
    }

    if (noAttributeCount == selFeatures.length) {
        return null;
    }

    for (var i = 0; i < selFeatures.length; i++) {
        var feat = selFeatures[i];
        if (showFeatureHeader) {
            html += "<tr><td colspan='2'>Feature" + (i+1) + "</td></tr>";
        }
        var props = feat.getProperties();
        for (var key in props) {
            //Skip geometry
            if (key == feat.getGeometryName()) {
                continue;
            }
            html += "<tr>";
            html += "<td class='popup-attribute-key'>" + key + "</td>";
            html += "<td class='popup-attribute-value'>" + props[key] + "</td>";
            html += "</tr>";
        }
    }
    html += "</table>";
    html += "</div>";
    return html;
}

function tryReadFeatures(format, text, options) {
    try {
        return format.readFeatures(text, options);
    } catch (e) {
        return null;
    }
}

function createPreviewSource(previewContent, formatOptions, callback) {
    var formats = {
        "GPX": ol.format.GPX,
        "GeoJSON": ol.format.GeoJSON,
        "IGC": ol.format.IGC,
        "KML": ol.format.KML,
        "TopoJSON": ol.format.TopoJSON,
        "WFS": ol.format.WFS,
        "GML": ol.format.GML,
        "GML2": ol.format.GML2,
        "GML3": ol.format.GML3,
        "WKT": ol.format.WKT
    };
    var features = [];
    var driverName = null;
    for (var formatName in formats) {
        var format = formats[formatName];
        var driver = new format();
        features = tryReadFeatures(driver, previewContent, formatOptions);
        if (features && features.length > 0) {
            driverName = formatName;
            break;
        }
    }
    if (!features || features.length == 0) {
        var attemptedFormats = Object.keys(formats);
        throw new Error("Could not load preview content. Attempted the following formats:<br/><br/><ul><li>" + attemptedFormats.join("</li><li>") + "</ul></li><p>Please make sure your document content is one of the above formats</p>");
    }
    callback({
        source: new ol.source.Vector({
            features: features
        }),
        driver: driverName 
    });
}

function initPreviewMap(domElId, preview, previewSettings) {
    var polygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke(previewSettings.style.polygon.stroke),
        fill: new ol.style.Fill(previewSettings.style.polygon.fill)
    });
    var lineStyle = new ol.style.Style({
        fill: new ol.style.Stroke({
            color: previewSettings.style.line.stroke.color
        }),
        stroke: new ol.style.Stroke(previewSettings.style.line.stroke)
    });
    var pointStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: previewSettings.style.point.radius || 5,
            stroke: new ol.style.Stroke(previewSettings.style.point.stroke),
            fill: new ol.style.Fill(previewSettings.style.point.fill)
        })
    });
    var previewLayer = new ol.layer.Vector({
        source: preview.source,
        //NOTE: Has no effect for KML, which is fine because it has its own style def that OL
        //wisely steps aside
        style: function (feature, resolution) {
            var geom = feature.getGeometry();
            if (geom) {
                var geomType = geom.getType();
                if (geomType.indexOf("Polygon") >= 0) {
                    return polygonStyle;
                } else if (geomType.indexOf("Line") >= 0) {
                    return lineStyle;
                } else if (geomType.indexOf("Point") >= 0) {
                    return pointStyle;
                }
            }
            return null;
        }
    });
    var map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: true
            }
        }).extend([
            new ol.control.ScaleLine(),
            new ol.control.MousePosition({
                projection: (previewSettings.coordinateDisplay.projection || 'EPSG:4326'),
                coordinateFormat: function(coordinate) {
                    return ol.coordinate.format(coordinate, (previewSettings.coordinateDisplay.format || 'Lat: {y}, Lng: {x}'), 4);
                }
            }),
            new ol.control.ZoomSlider(),
            new ol.control.ZoomToExtent()
        ]),
        layers: [
            new ol.layer.Group({
                title: "Base Maps",
                layers: [
                    new ol.layer.Tile({
                        title: 'Stamen Toner',
                        type: 'base',
                        visible: (previewSettings.defaultBaseLayer == "stamen-toner"),
                        source: new ol.source.Stamen({
                            layer: 'toner'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Stamen Watercolor',
                        type: 'base',
                        visible: (previewSettings.defaultBaseLayer == "stamen-water"),
                        source: new ol.source.Stamen({
                            layer: 'watercolor'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Stamen Terrain',
                        type: 'base',
                        visible: (previewSettings.defaultBaseLayer == "stamen-terrain"),
                        source: new ol.source.Stamen({
                            layer: 'terrain'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'OpenStreetMap',
                        type: 'base',
                        visible: (previewSettings.defaultBaseLayer == "osm"),
                        source: new ol.source.OSM()
                    })
                ]
            }),
            new ol.layer.Group({
                title: "Map Preview",
                layers: [
                    previewLayer
                ]
            })
        ]
    });
    var mapView = new ol.View();
    mapView.fit(preview.source.getExtent(), map.getSize());
    map.setView(mapView);
    var popup = new ol.Overlay.Popup();
    map.addOverlay(popup);
    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Legend' // Optional label for button
    });
    map.addControl(layerSwitcher);

    var select = new ol.interaction.Select();
    map.addInteraction(select);

    select.on('select', function(evt) {
        var selFeatures = evt.selected;
        var html = renderFeaturesHtml(selFeatures);
        if (html)
            popup.show(evt.mapBrowserEvent.coordinate, html);
    });
}