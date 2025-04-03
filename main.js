/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);

//Overlays definieren
let overlays={ 
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
}

//Layercontrol
L.control.layers({
"BasemapAT " : L.tileLayer.provider('BasemapAT.basemap').addTo(map),
"BasemapAT grau" : L.tileLayer.provider('BasemapAT.grau'),
"BasemapAT Overlay" : L.tileLayer.provider('BasemapAT.overlay'),
"BasemapAT terrain" : L.tileLayer.provider('BasemapAT.terrain'),
"BasemapAT surface" : L.tileLayer.provider('BasemapAT.surface'),
"BasemapAT highdpi" : L.tileLayer.provider('BasemapAT.highdpi'),
"BasemapAT orthofoto" : L.tileLayer.provider('BasemapAT.orthofoto'),
"BasemapAT standaard" : L.tileLayer.provider('nlmaps.standaard'),

}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Viena sightseeing Linien": overlays.lines,
    "Vienna sightseeing Haltestellen": overlays.stops,
    "Fußgängerzonen": overlays.zones,
}).addTo(map);

//Maßstab, imperail ausschalten
L.control.scale({
    imperial:false, 
}).addTo(map);

// Sehenswürdigkeiten Standorte Wien
async function loadSights(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
  //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wie</a>"
    }).addTo(overlays.sights);
}

//loadLines
async function loadLines(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
  //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> </a>"
    }).addTo(overlays.lines);
}

//load Stops
async function loadStops(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
  //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(overlays.stops);
}

//loadZones
async function loadZones(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
  //  console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle:<a href= 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(overlays.zones);
}

//GeoJSON laden und visualisieren
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");