/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 14,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map", {
    maxZoom: 19
}).setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);

//Overlays definieren
let overlays = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
    hotels: L.markerClusterGroup({
        disableClusteringAtZoom : 17
    }).addTo(map)
}

//Layercontrol
L.control.layers({
    "BasemapAT ": L.tileLayer.provider('BasemapAT.basemap').addTo(map),
    "BasemapAT grau": L.tileLayer.provider('BasemapAT.grau'),
    "BasemapAT Overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT terrain": L.tileLayer.provider('BasemapAT.terrain'),
    "BasemapAT surface": L.tileLayer.provider('BasemapAT.surface'),
    "BasemapAT highdpi": L.tileLayer.provider('BasemapAT.highdpi'),
    "BasemapAT orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT standaard": L.tileLayer.provider('nlmaps.standaard'),

}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Viena sightseeing Linien": overlays.lines,
    "Vienna sightseeing Haltestellen": overlays.stops,
    "Fußgängerzonen": overlays.zones,
    "Hotels": overlays.hotels,
}).addTo(map);

//Maßstab, imperail ausschalten
L.control.scale({
    imperial: false,
}).addTo(map);

// Sehenswürdigkeiten Standorte Wien
async function loadSights(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wie</a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37]
                })
            });
        },
        onEachFeature: function(feature, layer) {
           // console.log(feature.properties);
            layer.bindPopup(`
                <img src="${feature.properties.THUMBNAIL}" alt="*">
                <h4>${feature.properties.NAME}</h4>
                <adress>${feature.properties.ADRESSE}</adress>
                <a href="${feature.properties.WEITERE_INF}" target="wien">Website</a>
                `);
        }
    }).addTo(overlays.sights);
}

//loadLines
async function loadLines(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> </a>",
        style: function (feature) {
            console.log(feature.properties.LINE_NAME);
            let lineColor;

            if (feature.properties.LINE_NAME == "Yellow Line") {
                lineColor = "#FFDC00";
            } else if (feature.properties.LINE_NAME == "Blue Line") {
                lineColor = "#0074D9";
            } else if (feature.properties.LINE_NAME == "Red Line") {
                lineColor = "#FF4136";
            } else if (feature.properties.LINE_NAME == "Grey Line") {
                lineColor = "#AAAAAA";
            } else if (feature.properties.LINE_NAME == "Orange Line") {
                lineColor = "#FF851B";
            } else {
                lineColor = "#111111"
            }
            return {
                color: lineColor
            }
        }
    }).addTo(overlays.lines);
}

//load Stops
async function loadStops(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            //console.log(feature.properties);

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupanchor: [0, -37],
                })
            });
        }
    }).addTo(overlays.stops);
}



//loadZones
async function loadZones(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wien</a>",
        style: function (feature) {
            // console.log(feature)
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.4,
                fillOpacity: 0.1,
            }
        }
    }).addTo(overlays.zones);
}

//loadHotels
async function loadHotels(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            console.log(feature.properties.KATEGORIE_TXT);
            let iconName;

            if (feature.properties.KATEGORIE_TXT == "1*") {
                iconName = "hotel_1star.png";
            } else if (feature.properties.KATEGORIE_TXT == "2*") {
                iconName = "hotel_2stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "3*") {
                iconName = "hotel_3stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "4*") {
                iconName = "hotel_4stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "5*") {
                iconName = "hotel_5stars.png";
            } else {
                iconName = "hotel_0star.png";
            }
            console.log(iconName);

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/${iconName}`,
                    iconAnchor: [16, 37],
                    popupanchor: [0, -37],
                })
            });
        }
    }).addTo(overlays.hotels);
}

//GeoJSON laden und visualisieren
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");