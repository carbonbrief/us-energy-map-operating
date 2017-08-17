var map = L.map('mapid', {zoomControl: false}).setView([28, -100], 4)

var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);

var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// L.tileLayer('https://api.mapbox.com/styles/v1/rospearce/ciwgju4yv00cy2pmqeggx1mx8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 5,
// 	minZoom: 1,
//     id: 'mapbox://styles/rospearce/ciwgju4yv00cy2pmqeggx1mx8',
//     accessToken: 'pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA'
// }).addTo(map);

//disable scroll wheel zoom

map.scrollWheelZoom.disable();

var promise = $.getJSON("us-energy.geojson");
promise.then(function(data) {
    var allStates = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
            onEachFeature: onEachFeature,
            style: style
    }).addTo(map);
});

function getRadius(d) {
    return d > 6400  ? 22 :
            d > 3200  ? 20 :
            d > 1600  ? 18 :
            d > 800  ? 16 :
            d > 400  ? 12 :
            d > 200 ? 10 :
            d > 100  ? 8 :
            d > 50  ? 6 :
                    4;
}

var colors = {
    "Coal": "#333333",
    "Gas": "#0b4572",
    "Solar": "#EFC530",
    "Nuclear": "#A14A7B",
    "Oil": "#673b9b",
    "Hydro": "#2f8fce",
    "Wind": "#136400",
    "Biomass": "#A7B734",
    "Waste": "#dd8a3e",
    "Storage": "#ffada9",
    "Geothermal": "#C7432B",
    "Other": "#7c5641"
}

function style(feature) {
    return {
        fillColor: colors[feature.properties["Fuel type"]],
        weight: 0.3,
        opacity: 0.3,
        color: 'white',
        fillOpacity: 0.65,
		radius: getRadius(feature.properties["Capacity (MW)"])
    };
}

function onEachFeature(feature, layer) {
	// does this feature have a property named popupContent?
	if (feature.properties) {
		layer.bindPopup('<h1><b>'+feature.properties["Plant Name"]+'</h1>Capacity: </b>'+feature.properties["Capacity (MW)"]+'MW <br /><b>Type: </b>'+feature.properties["Fuel type"]+'<b>Year opened: </b>'+feature.properties["Year opened"], {closeButton: false, offset: L.point(0, -20)});
				layer.on('mouseover', function() { layer.openPopup(); });
				layer.on('mouseout', function() { layer.closePopup(); });
	};

}

// add zoom on marker double click

function onDoubleClick(e) {
    mymap.setView(e.latlng, 7);
	console.log("click-zoom");
}

//add zoomHome plugin

var zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);