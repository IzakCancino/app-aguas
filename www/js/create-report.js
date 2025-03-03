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
let map;
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
}

$.ajax({
  url: GET_ORGANIZATIONS + "/" + new URLSearchParams(window.location.search).get("type"), // Gets the value `type` in the URL
  type: "GET",
  headers: HEADER_API_KEY,
  success: function (organization) {
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
});


//
// Listeners
//

$('#btn-map-select').click(function () {
  let coords = map.getCenter();

  $.ajax({
    url: `https://us1.locationiq.com/v1/reverse?key=pk.0892b979f4c92709838f3cddbbef7736&lat=${coords.lat}&lon=${coords.lng}&format=json`,
    type: "GET",
    success: function (data) {
      console.log(data.display_name);

      $('#Latitude').attr("value", coords.lat);
      $('#Longitude').attr("value", coords.lng);
      $('#HouseNumber').attr("value", data.address.house_number);
      $('#Street').attr("value", data.address.road);
      $('#Neighborhood').attr("value", data.address.county);

      $("input").prop("disabled", false)
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to get the address: ', error);
    }
  });
});

$("#form-create-report").on("submit", e => {
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

  $.ajax({
    url: CREATE_REPORT,
    type: "POST",
    data: data,
    headers: Object.assign(
      HEADER_API_KEY,
      { "Authorization": `Basic ${data.IdUser}/${localStorage.getItem("SessionToken")}` }
    ),
    success: function (data) {
      window.location.href = "user-record.html";
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to create the report: ', { xhr, status, error });
    }
  });
})