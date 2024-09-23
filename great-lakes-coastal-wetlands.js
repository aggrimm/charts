/*global L, $, $$, Ajax, window, document, Highcharts, Prototype*/
var foo, chart1, chart2, leaflet, Logo, MTRILogo, GLRILogo, Legend, Info, Stats;

leaflet = {
    baseLayers: undefined,
    overlays: undefined
};

// Tile basemap ////////////////////////////////////////////////////////////////
leaflet.baseLayers = {
    //'MapQuest Aerial Imagery': new L.TileLayer.MapQuestOpen.Aerial(),
    //'MapQuest Aerial Imagery': new L.tileLayer.provider('MapQuestOpen.Aerial'),
    //'MapQuest OpenStreetMap': new L.tileLayer.provider('MapQuestOpen.OSM'),
    'CartoDB Dark Matter': L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
    }),
    'ESRI World Imagery':  L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '<span title="ESRI, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS User Community">Tiles &copy;Esri - Hover for sources</span>'
    }),
    'ESRI World Gray Canvas':  L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            maxZoom: 16
    })
};

// Overlay data
var field_data_layer = new L.geoJson(
    field_data, {
        style: function (feature) {
            switch (feature.properties.Class) {
                case 'Aquatic Bed': return {color: "#73DFFF"};
                case 'Schoenoplectus': return {color: "#A82484"};
                case 'Typha': return {color: "#F5387A"};
                case 'Phragmites': return {color: "#4F0054"};
                case 'Other/Mixed': return {color: "#59B200"};
            }
        },
        pointToLayer: function(feature, latlng) {
            var m = new L.CircleMarker(
                latlng, {
                    radius: 6,
                    fillOpacity: 0.85,
                    weight: 1
            })
            m.bindPopup('<table>' + 
                    '<tr class="tooltip"><td width=100>Visit date:</td><td><b>' + feature.properties.VISIT_DATE + '</b></td></tr>' + 
                    '<tr><td>Wetland class:</td><td><b>' + feature.properties.Class + '</b></td></tr>' +
                        '<tr><td>Dominant spp.:</td><td><b>' + feature.properties.SPECIE_DOM + '</b></td></tr>' + 
                    '</table>',
                    {'offset': L.point(0,-12)}
                    );
            m.on('mouseover', function(e) {
                this.openPopup();
            });
            m.on('mouseout', function(e) {
                this.closePopup();
            });
            return m;
        },

});

var greatlakes_layername = '<span title="Medium resolution (0.2 ha minimum mapping unit) classification using multi-date 2010 imagery. Imagery sources: PALSAR/Landsat-5.">Wetland Map: GL coastal/MI interior<span>';
var saginawbay_layername = '<span title="High resolution 2016 Saginaw Bay coastal classification. Imagery sources: WorldView-2/NAIP.">Wetland Map: Saginaw Bay 2016</span>';
var fieldsites_layername = 'Field site points';

leaflet.overlays = {}
leaflet.overlays[greatlakes_layername] =  L.tileLayer.wms(
//     'https://geoserver.mtri.org/CoastalWetlands/wms', {
    'https://apps2.mtri.org/cgi-bin/mapserv.fcgi', {
        layers: 'GreatLakes_MI_mosaic',
        map: '/var/www/mapfiles/coastal-wetlands.map',
        format: 'image/png',
        transparent: true,
        sld: 'https://apps2.mtri.org/static/slds/sld_interior.xml',
        width: 512,
        height: 512
    }
);

leaflet.overlays[saginawbay_layername] = L.tileLayer.wms(
//     'https://geoserver.mtri.org/CoastalWetlands/wms', {
    'https://apps2.mtri.org/cgi-bin/mapserv.fcgi?', {
        layers: 'Great_Lakes_Coastal_Wetlands_SagBay',
        map: '/var/www/mapfiles/coastal-wetlands.map',
        format: 'image/png',
        transparent: true,
        sld: 'https://apps2.mtri.org/static/slds/sld_sagbay.xml',
        width: 512,
        height: 512
    }
);

leaflet.overlays[fieldsites_layername] = field_data_layer;

// Initialize map and set which layers are shown by default
leaflet.map = L.map('leaflet', {
    zoomControl: false,
    attributionControl: false,
    layers: [
    //leaflet.baseLayers['MapQuest Aerial Imagery'],
    leaflet.baseLayers['CartoDB Dark Matter'],
    //leaflet.overlays['Field sites'],
    leaflet.overlays[greatlakes_layername]
    ]
}).setView([45.4, -85.9], 9); // this view shows a closer-up view that looks nice with aerial imagery background
//.setView([45.8, -85.5], 6); // this view shows all the lakes zoomed out

// Controls ////////////////////////////////////////////////////////////////////
Logo = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'm-logo-trans');
        // Create the control container with a particular class name
        container.innerHTML = '<span class="m-logo-text"><span class="m-logo-text-blu">Great Lakes</span><span class="m-logo-text-grn"> Coastal Wetlands</span> Mapping</span>';
        // ... Initialize other DOM elements, add listeners, etc.

        return container;
    }
});

MTRILogo = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'm-logo-flat');
        // Create the control container with a particular class name
        container.innerHTML = '<a href="https://www.mtri.org" target="_blank"><img class="m-logo-flat" src="/coastal-wetlands/media/img/mtri_logo_on_map.png" width=140px/></a>';
        // ... Initialize other DOM elements, add listeners, etc.

        return container;
    }
});

GLRILogo = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'm-logo-flat');
        // Create the control container with a particular class name
        container.innerHTML = '<a href="http://greatlakesrestoration.us/" target="_blank"><img class="m-logo-flat" src="/coastal-wetlands/media/img/glri_logo_on_map.png" width=140px/></a>';
        // ... Initialize other DOM elements, add listeners, etc.

        return container;
    }
});

Data2017Link = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'm-logo-flat text');
        // Create the control container with a particular class name
        container.innerHTML = `
            <a href="https://www.sciencebase.gov/catalog/item/5d0bb792e4b0e3d3116204c4" target="_blank" class='link'>
                *Wetland map update (circa 2017 maps)&#10138;
            </a>
        `;
        // ... Initialize other DOM elements, add listeners, etc.

        return container;
    }
});

// Legends
var MapsLegend = new L.Control({position: 'bottomleft'});
    MapsLegend.onAdd = function (map) {
        var div, format;

        div = L.DomUtil.create('div', 'm-legend');

        // Add the title
        div.innerHTML = '<div class="header" style="line-height:90%;">Wetland maps</div>';

        // Add the legend contents
        div.innerHTML += '<div class="item"><div class="bin" style="background:#73DFFF;"></div>Aquatic Bed</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#0070FF;"></div>Emergent Wetland</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#7FFF00;"></div>Shrub Wetland</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#586120;"></div>Forested Wetland</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#FFAA00;"></div>Open Peatland</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#E06E00;"></div>Shrub Peatland</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#DB3B00;"></div>Treed Peatland</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#A82484;"></div>Schoenoplectus</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#F5387A;"></div>Typha</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#4F0054;"></div>Phragmites</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#cab2d6;"></div>Mixed Phragmites</div>';
        div.innerHTML += '<div class="item"><div class="bin" style="background:#ffff99;"></div>Phragmites Detritus</div>';

        return div;
    };

var FieldSitesLegend = new L.Control({position: 'bottomleft'});
FieldSitesLegend.onAdd = function(map) {
        var div, format;

        div = L.DomUtil.create('div', 'm-legend');

        // Add the title
        div.innerHTML = '<div class="header" style="line-height:90%;">Field Sites</div>';

        // Add the legend contents
	div.innerHTML += '<div class="item"><svg height="18" width="18"><circle cx=8 cy=12 r=6 fill="#73DFFF"/></svg>Aquatic Bed</div>';
	div.innerHTML += '<div class="item"><svg height="18" width="18"><circle cx=8 cy=12 r=6 fill="#A82484"/></svg>Schoenoplectus</div>';
	div.innerHTML += '<div class="item"><svg height="18" width="18"><circle cx=8 cy=12 r=6 fill="#F5387A"/></svg>Typha</div>';
	div.innerHTML += '<div class="item"><svg height="18" width="18"><circle cx=8 cy=12 r=6 fill="#4F0054"/></svg>Phragmites</div>';
	div.innerHTML += '<div class="item"><svg height="18" width="18"><circle cx=8 cy=12 r=6 fill="#59B200"/></svg>Other/Mixed</div>';

        return div;
    };

    
///////////////////////////////////////////////////////////////////
// Functions required for data download request form functionality
// validating empty field
function check_empty(){
  if(document.getElementById('name').value == ""
     || document.getElementById('email').value == ""
     || document.getElementById('purpose').value == ""
     || document.getElementById('location').value == ""
     || document.getElementById('organization').value == ""
     || document.getElementById('title').value == "") {
	alert ("Please fill in all fields");
	}
  else if (document.getElementById('chk_erie').checked == false
	  & document.getElementById('chk_michigan').checked == false
	  & document.getElementById('chk_ontario').checked == false
	  & document.getElementById('chk_huron').checked == false
	  & document.getElementById('chk_superior').checked == false
      & document.getElementById('chk_all').checked == false
      & document.getElementById('chk_saginawbay').checked == false
    ) {
	alert("Please request at least one dataset");
  }
  else { 
    document.getElementById('form').submit(); 
    alert ("Form submitted successfully. You will recieve an email sometime in the next few days with a link to the requested data.");
    }
}

//function to display Popup
function div_show(){ 
  document.getElementById("abc").style.display = "block";
}

//function to check target element
function check(e){ 
  var target = (e && e.target) || (event && event.srcElement); 

  var obj = document.getElementById('abc'); 
  var obj2 = document.getElementById('popup'); 

  checkParent(target)?obj.style.display='none':null; 
  target==obj2?obj.style.display='block':null; 

} 

//function to check parent node and return result accordingly
function checkParent(t){ 
  while(t.parentNode){
    if(t==document.getElementById('abc')) { 
      return false
    }
    else if(t==document.getElementById('close')) {
      return true
    } 
  t=t.parentNode 
  } 
  return true
} 

Downloads = L.Control.extend({
    options: {
	position: 'bottomleft'
    },
    onAdd: function() {
	var div, format;
	
	div = L.DomUtil.create('div','m-legend');
	
	// Add the title
	var formHTML = 
	  [
	   '<div id="bdy" onclick = "check(event)" style="overflow:hidden;">',
	   '<div id="abc">',
	   '<div id="popupContact">',
	   '<form class="request" action="secure_email.php" method="post" id="form">',
	   '<table width=100%>',
	   '<tr><td><div class="header">Data download request</div></td>',
	       '<td align="right" valign="top"><div id="close">X</div></td></tr>',
	   '<tr><td><input type="text" name="name" id="name" placeholder="Name"/></td>',
	       '<td><input type="text" name="email" id="email" placeholder="Email"/></td></tr>',
	   '<tr><td><input type="text" name="organization" id="organization" placeholder="Organization"/></td>',
	       '<td><input type="text" name="title" id="title" placeholder="Title"/></td></tr>',
	   '</table>',
	   '<table width=100%>',
	   '<tr><td width=100%><input type="text" name="location" id="location" placeholder="Location (City,State/Province,Country)"/></td></tr>',
	   '<tr><td width=100%><textarea name="purpose" placeholder="Purpose and value of data to your interests" id="purpose"></textarea></td></tr>',
	   '</table>',
	   '<table width=100%>',
	   '<tr><td style="vertical-align:middle;">Requested datasets:</td><td>',
	   '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="erie" id="chk_erie" value="Lake Erie">Lake Erie coastal</div>',
	   '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="huron" id="chk_huron" value="Lake Huron">Lake Huron coastal</div>',
	   '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="michigan" id="chk_michigan" value="Lake Michigan">Lake Michigan coastal</div>',
	   '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="ontario" id="chk_ontario" value="Lake Ontario">Lake Ontario coastal</div>',
	   '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="superior" id="chk_superior" value="Lake Superior">Lake Superior coastal</div>',
            '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="all_plus_interior" id="chk_all" value="All+interiorMI">All coastal +interior Michigan</div>',
            '<div class="item" style="vertical-align:top;">',
	       '<input type="checkbox" name="saginaw_bay" id="chk_saginawbay" value="Saginaw Bay">Saginaw Bay 2016</div>',
	       '</td></tr>',
	   '</table>',
	   '<br><a id="submit" href="javascript: check_empty()"><b>Submit</b></a>',
	   '</form></div></div></div>'].join('\n');
	div.innerHTML = formHTML;
	div.innerHTML += '<a href="#" onclick="javascript: div_show();return false;"><div style="text-align:center;font-size:12px;">Request data</div></a>';
	
	return div;
    }
});


// End of functions having to do with download request form functionality

///////////////////////////////////////////////////////////////////////////////
// Start adding elements to the map

leaflet.map.addControl(new L.Control.Attribution({
    position: 'bottomleft',
    prefix: 'Powered by <a href="http://leaflet.cloudmade.com/" target="_blank">Leaflet</a> | Data Layers &copy; 2014 <a href="http://www.mtri.org/" target="_blank">MTRI</a>'
}));

//leaflet.map.addControl(new Logo());
L.control.layers(leaflet.baseLayers, leaflet.overlays, {
    position: 'topleft',
    collapsed: false
}).addTo(leaflet.map);
leaflet.map.addControl(new MTRILogo());
leaflet.map.addControl(new GLRILogo());
leaflet.map.addControl(new Data2017Link());
leaflet.map.addControl(new L.Control.Zoom({position: 'topleft'}));
leaflet.map.addControl(new Downloads());
//leaflet.map.addControl(new MapsLegend());
MapsLegend.addTo(leaflet.map);
//FieldSitesLegend.addTo(leaflet.map);

// Add listeners to show/hide legend(s) depending on which layers are selected
leaflet.map.on('overlayremove', function(eventLayer) {
//     console.log(eventLayer);
//     var loaded_layers = Object.keys(leaflet.map._layers);
//     if (eventLayer.name === greatlakes_layername || eventLayer.name === saginawbay_layername) {
//         this.removeControl(MapsLegend);
//     } else 
    if (eventLayer.name === fieldsites_layername) {
        this.removeControl(FieldSitesLegend);
    }
});
leaflet.map.on('overlayadd', function(eventLayer) {
//     if (eventLayer.name === greatlakes_layername || eventLayer.name === saginawbay_layername) {
//         if (!MapsLegend._map) {
//             MapsLegend.addTo(this);
//         }
//     } else 
    if (eventLayer.name === fieldsites_layername) {
        FieldSitesLegend.addTo(this);
    }
});

