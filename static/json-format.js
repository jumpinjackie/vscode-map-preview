class JSONFormat {

    constructor() {
        this.geoJson = new ol.format.GeoJSON();
        this.geometryTypes = new Set([
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
            "GeometryCollection"
        ]);
    }

    readFeatures(content, options) {
        const parsed = typeof content === "string" ? JSON.parse(content) : content;
        const normalized = this.toFeatureCollection(parsed);
        if (!normalized.features.length) {
            return [];
        }
        return this.geoJson.readFeatures(normalized, options);
    }

    toFeatureCollection(root) {
        const features = [];

        const walk = (value) => {
            if (value == null) {
                return;
            }

            if (Array.isArray(value)) {
                value.forEach(walk);
                return;
            }

            if (typeof value !== "object") {
                return;
            }

            if (this.isFeatureCollection(value)) {
                value.features.forEach(walk);
                return;
            }

            if (this.isFeature(value)) {
                features.push(value);
                return;
            }

            if (this.isGeometry(value)) {
                features.push({
                    type: "Feature",
                    geometry: value,
                    properties: {}
                });
                return;
            }

            if (this.isGeometry(value.geometry)) {
                const properties = { ...value };
                delete properties.geometry;
                features.push({
                    type: "Feature",
                    geometry: value.geometry,
                    properties: properties
                });
                return;
            }

            Object.values(value).forEach(walk);
        };

        walk(root);

        return {
            type: "FeatureCollection",
            features: features
        };
    }

    isFeatureCollection(value) {
        return value && value.type === "FeatureCollection" && Array.isArray(value.features);
    }

    isFeature(value) {
        return value && value.type === "Feature" && this.isGeometry(value.geometry);
    }

    isGeometry(value) {
        if (!value || typeof value !== "object" || !this.geometryTypes.has(value.type)) {
            return false;
        }

        if (value.type === "GeometryCollection") {
            return Array.isArray(value.geometries);
        }

        return value.coordinates !== undefined;
    }
}

window.JSONFormat = JSONFormat;
