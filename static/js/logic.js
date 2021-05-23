// Create map with Leaflet tile layer
function createMap(map) {
    var map_base = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    })
  
    var baseMap = {
      "map_base": map_base
    };

  // Create map overlays 
    var overlayMaps = {
      "Quake_map": map,
    }
  
    var map = L.map("map", {
      center: [14.7075,0.29306],
   
      zoom: 2,
      layers: [map_base, map]
    });
  
    L.control.layers(baseMap, overlayMaps, {
      collapsed: false
    }).addTo(map);

  // Create legend corresponding to color scale for quake magnitude 
    var legend = L.control({position: 'bottomright',});

      legend.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 10, 20, 50, 100, 200, 500, 1000],
              labels = ['Earthquake Magnitude'];

          // loop through density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML += 
                  '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                  labels.join('<br>');
          }
        return div;
      };
      legend.addTo(map);
  };

// Create function for color scale
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

// Create markers of quake occurances using information from USGS Geojson 
function createMarkers(data) {
   
    var markers_list=[]
   
         
    data.features.forEach(incident=>{
      var coords=incident

      var popupContent = {
        Text: (incident.properties.place),
      }
     console.log(popupContent)
    
      var one_marker=L.circleMarker([incident.geometry.coordinates[1],incident.geometry.coordinates[0]], {
        fillColor: getColor(incident.geometry.coordinates[2]), //replace with depth of earthquake 
        fillOpacity: 1,
        stroke: true,
        weight: .5,
        color: "black",
        radius: (incident.properties.mag)*1.1 //needs to represent magnitude of earthquake 
    }).bindPopup(`${(popupContent['Text'])}`); 
      markers_list.push(one_marker)
    })
      
    
    return L.layerGroup(markers_list)
  };

  // Get data from USGS website
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Load data and then activate createMap and createMarkers functions
d3.json(url).then(data=>{
  console.log(data)
  createMap(createMarkers(data))
});