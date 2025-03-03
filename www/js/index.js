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

function onDeviceReady() {
  // Lock screen on portrait
  screen.orientation.lock('portrait');

  // Check if there is an open session in the device
  let logout = new URLSearchParams(window.location.search).get("logout");
  if (logout) {
    localStorage.clear();
  }

  if (!logout && localStorage.getItem("IdUser") && localStorage.getItem("SessionToken")) {
    let data = {
      "IdUser": localStorage.getItem("IdUser"),
      "SessionToken": localStorage.getItem("SessionToken")
    }

    $.ajax({
      url: CONFIRM_CREDENTIALS,
      type: "POST",
      headers: HEADER_API_KEY,
      data: data,
      success: function (response) {
        if (!response) {
          generateAlert("Las credenciales de inicio de sesión no son correctas.", false);
          return;
        }

        // Successful login
        window.location.href = "general.html";
      },
      error: function (xhr, status, error) {
        generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
        console.error('Error while trying to login: ', { xhr, status, error });
      }
    });
  }
}

