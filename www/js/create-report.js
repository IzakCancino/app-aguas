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
let map, selectedOrganization;
let cordovaReady = false, organizationsReady = false;
$("input").prop("disabled", true)

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  function createMap(latitude, longitude) {
    let coords = [latitude, longitude];

    map = L.map('map').setView(coords, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker(coords).addTo(map);
    map.addEventListener("move", e => {
      marker.setLatLng(map.getCenter());
    });
  }



  // Geolocation functions and usage 

  function onPositionSuccess(position) {
    createMap(position.coords.latitude, position.coords.longitude);
  };

  function onPositionError(error) {
    console.error('Geolocation error: ', error);
    createMap(26.092963, -98.277984);
  }

  //
  // Executions
  //

  // Geolocation
  navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError);

  cordovaReady = true;
  if (cordovaReady && organizationsReady) {
    $("#charging-spinner").fadeOut();
  }
}

$.ajax({
  url: GET_ORGANIZATIONS + "/" + new URLSearchParams(window.location.search).get("type"), // Gets the value `type` in the URL
  type: "GET",
  headers: HEADER_API_KEY,
  success: function (organization) {
    selectedOrganization = organization
    let selectReportType = $('#IdReportType');

    organization.ReportTypes
      .sort(function (a, b) {
        var textA = a.Name.toUpperCase();
        var textB = b.Name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      .forEach(reportType => {
        selectReportType.append(`
                      <option value=${reportType.IdReportType}>
                          ${reportType.Name}
                      </option>`
        );
      });
  },
  error: function (xhr, status, error) {
    generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
    console.error('Error while trying to get the report types: ', { xhr, status, error });
  }
}).always(function () {
  organizationsReady = true;
  if (cordovaReady && organizationsReady) {
    $("#charging-spinner").fadeOut();
  }
});

function sendWhatsAppMessage(number, message) {
  var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  console.log(url);
  window.location.href = url;
}



//
// Listeners
//

$('#btn-map-select').click(function () {
  $("#charging-spinner").fadeIn();
  let coords = map.getCenter();

  $.ajax({
    url: `https://us1.locationiq.com/v1/reverse?key=pk.0892b979f4c92709838f3cddbbef7736&lat=${coords.lat}&lon=${coords.lng}&format=json`,
    type: "GET",
    success: function (data) {
      console.log(data.display_name);

      $('#Latitude').attr("value", coords.lat);
      $('#Longitude').attr("value", coords.lng);
      $('#HouseNumber').attr("value", (data.address.house_number ?? "").substring(0, 10));
      $('#Street').attr("value", (data.address.road ?? "").substring(0, 50));
      $('#Neighborhood').attr("value", (data.address.county ?? "").substring(0, 50));

      $("input").prop("disabled", false)
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to get the address: ', error);
    }
  }).always(function () {
    $("#charging-spinner").fadeOut();
  });
});

$("#form-create-report").on("submit", e => {
  $("#charging-spinner").fadeIn();
  e.preventDefault();

  let data = {
    "IdReportType": e.target.elements.IdReportType.value,
    "IdUser": localStorage.getItem("IdUser"),
    "Latitude": e.target.elements.Latitude.value,
    "Longitude": e.target.elements.Longitude.value,
    "HouseNumber": e.target.elements.HouseNumber.value,
    "Street": e.target.elements.Street.value,
    "Neighborhood": e.target.elements.Neighborhood.value,
    "Description": e.target.elements.Description.value
  }

  // Report creation
  $.ajax({
    url: CREATE_REPORT,
    type: "POST",
    data: data,
    headers: Object.assign(
      HEADER_API_KEY,
      { "Authorization": `Basic ${data.IdUser}/${localStorage.getItem("SessionToken")}` }
    ),
    success: function (_) {
      // Send or call to report
      if (selectedOrganization.IsMessageable) {
        // User full name
        $.ajax({
          url: GET_USER + '/' + localStorage.getItem("IdUser"),
          type: "GET",
          headers: HEADER_API_KEY,
          success: function (dataUser) {
            let userName = dataUser.Name + ' ' + dataUser.LastName;
            sendWhatsAppMessage(selectedOrganization.Phone, `Mi nombre es ${userName}, me comunico con ustedes para reportar que hay una situación de tipo ${$("#IdReportType")[0].selectedOptions[0].text} y ${data.Description}, en la ubicación: Col. ${data.Neighborhood}, Calle ${data.Street}, #${data.HouseNumber}.`);

            // Success
            window.location.href = "user-record.html?create=1";
          },
          error: function (xhr, status, error) {
            generateAlert("Un error inesperado ha sucedido.<br>El reporte fue creado, pero no se pudo redirigir.", false);
            console.error('Error while trying to redirect the report: ');
            return;
          }
        });
      }
      else {
        window.location.href = `tel:${selectedOrganization.Phone}`;

        // Success
        window.location.href = "user-record.html?create=1";
      }
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to create the report: ', { xhr, status, error }, data);
    }
  }).always(function () {
    $("#charging-spinner").fadeOut();
  });
});