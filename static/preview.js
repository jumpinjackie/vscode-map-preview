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
            html += "<td><strong>" + key + "</strong></td>";
            html += "<td>" + props[key] + "</td>";
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

function createPreviewSource(formatOptions) {
    var formats = {
        "ol.format.GPX": ol.format.GPX,
        "ol.format.GeoJSON": ol.format.GeoJSON,
        "ol.format.IGC": ol.format.IGC,
        "ol.format.KML": ol.format.KML,
        "ol.format.TopoJSON": ol.format.TopoJSON,
        "ol.format.WFS": ol.format.WFS,
        "ol.format.GML": ol.format.GML,
        "ol.format.GML2": ol.format.GML2,
        "ol.format.GML3": ol.format.GML3,
        "ol.format.WKT": ol.format.WKT
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
        var attemptedFormats = ["GeoJSON", "KML", "GPX", "IGC", "TopoJSON"];
        throw new Error("Could not load preview content. Attempted the following formats:\\n\\n - " + attemptedFormats.join("\\n - "));
    }
    return {
        source: new ol.source.Vector({
            features: features
        }),
        driver: driverName 
    };
}

function initPreviewMap(domElId, previewLayer) {
    var map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        }).extend([
            new ol.control.ScaleLine(),
            new ol.control.MousePosition(),
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
                        visible: true,
                        source: new ol.source.Stamen({
                            layer: 'toner'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Stamen Watercolor',
                        type: 'base',
                        visible: false,
                        source: new ol.source.Stamen({
                            layer: 'watercolor'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Stamen Terrain',
                        type: 'base',
                        visible: false,
                        source: new ol.source.Stamen({
                            layer: 'terrain'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'OpenStreetMap',
                        type: 'base',
                        visible: false,
                        source: new ol.source.OSM()
                    }),
                    new ol.layer.Group({
                        title: 'MapQuest - Satellite and roads',
                        type: 'base',
                        combine: true,
                        visible: false,
                        layers: [
                            new ol.layer.Tile({
                                source: new ol.source.MapQuest({layer: 'sat'})
                            }),
                            new ol.layer.Tile({
                                source: new ol.source.MapQuest({layer: 'hyb'})
                            })
                        ]
                    }),
                    new ol.layer.Tile({
                        title: 'MapQuest - OSM',
                        type: 'base',
                        visible: false,
                        source: new ol.source.MapQuest({layer: 'osm'})
                    }),
                    new ol.layer.Tile({
                        title: 'MapQuest - Satellite',
                        type: 'base',
                        visible: false,
                        source: new ol.source.MapQuest({layer: 'sat'})
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
    mapView.fit(previewSource.getExtent(), map.getSize());
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