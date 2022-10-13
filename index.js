const cyclingRoutes = {
    C1: "C1",
    C2: "C2",
    C3: "C3",
    C4: "C4",
    C5: "C5",
    C6: "C6",
    C7: "C7",
}

const cyclingRouteColors = {
    C1: "#e9a3c9",
    C2: "#67a9cf",
    C3: "#762a83",
    C4: "#1b7837",
    C5: "#f1a340",
    C6: "#c51b7d",
    C7: "#8c510a",
}

const walkingRoutes = {
    W1: "W1",
    W2: "W2",
    W3: "W3",
    W4: "W4",
}

const walkingRouteColors = {
    W1: "#1b9e77",
    W2: "#d95f02",
    W3: "#7570b3",
    W4: "#0571b0",
}

const walkingZones = {
    Z1: "Z1",
    Z2: "Z2",
    ZO: "Other residential area"
}

const walkingZoneColors = {
    Z1: "#fdf108",
    Z2: "#f37734",
    ZO: "#9d9d9d"
}

var map = L.map('map', {
    crs: L.CRS.EPSG3857,
}).setView([50.85406, -0.55345], 13);

var defaultBase = L.tileLayer.provider('CyclOSM');
defaultBase.addTo(map);

//var defaultBase = L.tileLayer.provider('Stamen.TonerLite').addTo(map);

var baseLayers = {
    'CyclOSM': defaultBase,
    'MapBox': L.tileLayer.provider('MapBox'),
    'Stamen Toner': L.tileLayer.provider('Stamen.TonerLite'),
    'ESRI Imagery': L.tileLayer.provider('Esri.WorldImagery'),
    'CartoDB Dark': L.tileLayer.provider('CartoDB.DarkMatter'),
    'OSM Topo': L.tileLayer.provider('OpenTopoMap')
};

var cyclingLayers = {};
// add cycling routes
for (const cyclingRoute in cyclingRoutes) {
    try {
        cyclingLayers[cyclingRoute] = L.geoPackageFeatureLayer([], {
            geoPackageUrl: './assets/ACWF_LCWIP_cycling_routes.gpkg',
            noCache: true,
            layerName: cyclingRoutes[cyclingRoute],
            style: function (feature) {
                return {
                    color: cyclingRouteColors[cyclingRoute],
                    weight: 3,
                    opacity: 0.6,
                };
            },
            onEachFeature: function (feature, layer) {
                let string = '';
                for (const key in feature.properties) {
                    string +=
                        '<div class="item"><span class="label">' +
                        key +
                        ': </span><span class="value">' +
                        feature.properties[key] +
                        '</span></div>';
                }
                layer.bindPopup(string);
            }
        });
        cyclingLayers[cyclingRoute].addTo(map);
    } catch (e) {
        console.error(e);
    }
}

var walkingLayers = {};
// add walking routes
for (const walkingRoute in walkingRoutes) {
    try {
        walkingLayers[walkingRoute] = L.geoPackageFeatureLayer([], {
            geoPackageUrl: './assets/ACWF_LCWIP_walking_routes.gpkg',
            noCache: true,
            layerName: walkingRoutes[walkingRoute],
            style: function (feature) {
                return {
                    color: walkingRouteColors[walkingRoute],
                    weight: 3,
                    opacity: 0.6,
                };
            },
            onEachFeature: function (feature, layer) {
                let string = '';
                for (const key in feature.properties) {
                    string +=
                        '<div class="item"><span class="label">' +
                        key +
                        ': </span><span class="value">' +
                        feature.properties[key] +
                        '</span></div>';
                }
                layer.bindPopup(string);
            }
        });
        walkingLayers[walkingRoute].addTo(map);
    } catch (e) {
        console.error(e);
    }
}
// add walking zones
try {
    walkingLayers["Walking Zones"] = L.geoPackageFeatureLayer([], {
        geoPackageUrl: './assets/ACWF_LCWIP_walking_routes.gpkg',
        noCache: true,
        layerName: "Walking Zones",
        style: function (feature) {
            switch (feature.properties.zone_id) {
                case "Z1": return {
                    color: walkingZoneColors["Z1"],
                    weight: 1,
                    opacity: 0.8,
                }; break;
                case "Z2": return {
                    color: walkingZoneColors["Z2"],
                    weight: 1,
                    opacity: 0.8,
                }; break;
                case "Other residential area": return {
                    color: walkingZoneColors["ZO"],
                    weight: 1,
                    opacity: 0.8,
                }; break;
            }
        },
        onEachFeature: function (feature, layer) {
            let string = '';
            for (const key in feature.properties) {
                string +=
                    '<div class="item"><span class="label">' +
                    key +
                    ': </span><span class="value">' +
                    feature.properties[key] +
                    '</span></div>';
            }
            layer.bindPopup(string);
        }
    });
    walkingLayers["Walking Zones"].addTo(map);
} catch (e) {
    console.error(e);
}

var groupedOverlays = {
    "Cycling Routes": cyclingLayers,
    "Walking Routes & Zones": walkingLayers,
};

//add layer switch control
//L.control.groupedLayers(baseLayers, groupOverLays).addTo(map);
L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);


//add scale bar to map
L.control.scale({
    position: 'bottomleft'
}).addTo(map);

// Overview mini map
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var miniMap = new L.Control.MiniMap(Esri_WorldTopoMap, {
    toggleDisplay: true,
    minimized: true,
    position: 'bottomleft'
}).addTo(map);

//define Drawing toolbar options
var options = {
    position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
    drawMarker: true, // adds button to draw markers
    drawPolyline: true, // adds button to draw a polyline
    drawRectangle: true, // adds button to draw a rectangle
    drawPolygon: true, // adds button to draw a polygon
    drawCircle: true, // adds button to draw a cricle
    cutPolygon: true, // adds button to cut a hole in a polygon
    editMode: true, // adds button to toggle edit mode for all layers
    removalMode: true, // adds a button to remove layers
};

// add leaflet.pm controls to the map
map.pm.addControls(options);

//Logo position: bottomright
var credctrl = L.controlCredits({
    image: "Images/LCWIP-106x26.png",
    link: "https://www.arundeltowncouncil.gov.uk/lcwip/",
    text: "LCWIP Demo Route Map by Chris @ Arundel Cycling & Walking Infrastructure Group"
}).addTo(map);