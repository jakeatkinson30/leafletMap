// Geolocation API
let map;
let border;

// Using navigator.geoLocation to capture user's current location once permission is granted.

const granted = (position) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  let mapOptions = {
    center: [lat, lng],
    zoom: 6,
  };

  // Create map.
  map = L.map("map", mapOptions);

  // Dark layer.

  let dark = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );

  dark.addTo(map);

  // Watercolour layer.
  let watercolour = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
    {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abcd",
      maxZoom: 19,
      ext: "jpg",
    }
  );

  watercolour.addTo(map);

  // OpenStreetMap layer.

  let openStreetMap = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  openStreetMap.addTo(map);

  // Layer control.

  let baseMaps = {
    dark: dark,
    watercolour: watercolour,
    openStreetMap: openStreetMap,
  };

  L.control.layers(baseMaps).addTo(map);

  L.geoJSON(bordersJSON, {
    style: {
      fillOpacity: 0,
      stroke: true,
    },
  }).addTo(map);
  console.log(bordersJSON);

  // Marker options.

  let markerOptions = {
    title: "My location",
    clickable: true,
    draggable: true,
  };

  // Add marker to map.
  let marker = L.marker([lat, lng], markerOptions);
  marker.addTo(map);

  // Bind popup
  marker.bindPopup("Hey there!").openPopup();
};

const errFunction = (error) => {
  alert("Sorry, we could not access your location.");
  console.log(error);
};

if (navigator.geolocation) {
  // console.log("Your browser supports geolocation.");
  navigator.geolocation.getCurrentPosition(granted, errFunction);
} else {
  console.log("Your browser does not support geoLocation.");
}

$(document).ready(function () {
  // Define a function to handle the change event on the country dropdown
  $("#country-list").on("change", function () {
    // Get the selected country from the dropdown
    const selectedCountry = $(this).val();

    // Use cURL to fetch the latitude and longitude for the selected country
    $.ajax({
      url:
        "https://api.opencagedata.com/geocode/v1/json?q=" +
        selectedCountry +
        "&key=3d249809aa3542d984f599b2e4a996b9",
      type: "GET",
      dataType: "json",
      success: function (result) {
        // Extract the latitude and longitude from the response
        const lat = result.results[0].geometry.lat;
        const lng = result.results[0].geometry.lng;

        // Set the center of the map to the selected country's coordinates and move the map to that location
        map.setView([lat, lng], 6);

        // Remove the existing borders from the map and add the borders of the selected country.
        if (map.hasLayer(border)) {
          map.removeLayer(border);
        }

        border = L.geoJSON(result.data.border, {
          color: "#ff7800",
          weight: 2,
          opacity: 0.65,
        });

        // bounds = border.getBounds();

        // border.addTo(map);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  // Populate drop down menu from nav bar and allow for selecting of country
  $.ajax({
    url: "main/php/geoJson.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        // console.log(result);

        // Sort alphabetically
        const sortedFeatures = result.data.border.features.sort((a, b) => {
          if (a.properties.name < b.properties.name) {
            return -1;
          }
          if (a.properties.name > b.properties.name) {
            return 1;
          }
          return 0;
        });

        for (let i = 0; i < sortedFeatures.length; i++) {
          $("#country-list").append(
            $("<option>", {
              value: sortedFeatures[i].properties.name,
              text: sortedFeatures[i].properties.name,
            })
          );
        }
      }
    },
  });
});
