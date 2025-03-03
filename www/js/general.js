/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#
document.addEventListener('deviceready', onDeviceReady, false);

// Function to generate main map
function createMap(latitude, longitude, actualLocation = true) {
  let coords = [latitude, longitude];

  map = L.map('map').setView(coords, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  if (actualLocation) {
    var circle = L.circle(coords, {
      color: 'blue',
      fillColor: '#4287f5',
      fillOpacity: 0.8,
      radius: 50
    }).addTo(map);
    circle.bindPopup("Tu ubicación actual.")
  }

  setReports(map);
}

// Function with API request to get and set the reports based on certain criteria
function setReports(map, idReportType = 0, status = 0, daysAgo = 0) {
  $.ajax({
    url: GET_REPORTS + `?idReportType=${idReportType}&status=${status}&daysAgo=${daysAgo}`,
    type: "GET",
    headers: HEADER_API_KEY,
    success: function (response) {
      if (response.length == 0) {
        generateAlert("No fue encontrado ningún reporte.<br>Por favor intente con otros criterios de búsqueda.", false);
      }

      response.forEach(report => {
        var marker = L.marker([report.Latitude, report.Longitude])
          .addTo(map)
          .bindPopup(`#${report.IdReport}: ${report.Description}`);
      });
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to browse reports: ', { xhr, status, error });
    }
  });
}

function onDeviceReady() {
  // 
  // Geolocation
  // 

  function onPositionSuccess(position) {
    createMap(position.coords.latitude, position.coords.longitude);
  };

  function onPositionError(error) {
    generateAlert("No fue posible obtener la ubicación actual", false);
    console.error('Geolocation error: ', error);
    createMap(26.092963, -98.277984, false);
  }

  navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {
    enableHighAccuracy: true
  });
}