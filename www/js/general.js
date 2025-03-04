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
let map;

let urlParams = [0, 0, 0];
let browse = new URLSearchParams(window.location.search).get("browse");
if (browse) {
  let params = new URLSearchParams(window.location.search);
  urlParams = [params.get("idOrganization"), params.get("status"), params.get("daysAgo")];
  $("#status").val(urlParams[1]);
  $("#daysAgo").val(urlParams[2]);
}

// Get organizations
$.ajax({
  url: GET_ORGANIZATIONS,
  type: "GET",
  headers: HEADER_API_KEY,
  success: function (organization) {
    let divOrganizations = $('#idOrganization');

    organization
      .sort(function (a, b) {
        var textA = a.Name.toUpperCase();
        var textB = b.Name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      .forEach(data => {
        divOrganizations.append(`
          <option value="${data.IdOrganization}">${data.Name}</option>
        `);
      });

    // Set previous browsed organization
    $("#idOrganization").val(urlParams[0]);
  },
  error: function (xhr, status, error) {
    generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
    console.error('Error while trying to get the organizations: ', { xhr, status, error });
  }
});


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

  setReports(map, urlParams[0], urlParams[1], urlParams[2]);
}

// Function with API request to get and set the reports based on certain criteria
function setReports(map, idOrganization = 0, status = 0, daysAgo = 0) {
  $.ajax({
    url: GET_REPORTS + `?idOrganization=${idOrganization}&status=${status}&daysAgo=${daysAgo}`,
    type: "GET",
    headers: HEADER_API_KEY,
    success: function (response) {
      if (response.length == 0) {
        generateAlert("No fue encontrado ningún reporte.<br>Por favor intente con otros criterios de búsqueda.", false);
      }

      response.forEach(report => {
        var icon = L.icon({
          iconUrl: `img/${report.ReportType.Organization.Code}-pin.png`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -13]
        });

        let status;
        switch (report.Status) {
          case 1:
            status = "Pendiente"
            break;
          case 2:
            status = "En proceso"
            break;
          case 3:
            status = "Resuelto"
            break;
          default:
            status = "N/A"
            break;
        }

        let info = `
          &bull; ID del Reporte: ${report.IdReport}<br>
          &bull; Tipo de Reporte: ${report.ReportType.Name}<br>
          &bull; Descripción: ${report.Description}<br>
          &bull; Estatus: ${status} (${report.Status}/3)<br>
          &bull; Fecha de Creación: ${new Intl.DateTimeFormat("es-ES").format(new Date(report.CreationDate))}<br>
          &bull; Fecha de Edición: ${new Intl.DateTimeFormat("es-ES").format(new Date(report.ModificationDate))}
        `;

        var marker = L.marker([report.Latitude, report.Longitude], { icon: icon })
          .addTo(map)
          .bindPopup(info);
      });
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to browse reports: ', { xhr, status, error });
    }
  }).always(function () {
    $("#charging-spinner").fadeOut();
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