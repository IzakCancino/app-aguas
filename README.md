# <h1 align="center">Aguas!</h1>

**Android app to create and view reports useful for citizens.**

Project made with Apache Cordova and connection to APIs via AJAX _(require keys)_. It was made based on the organizations and their phone numbers in Reynosa, Tamaulipas, Mexico _(so all the app content is in Spanish)_.

## 📌 Characteristics

- **🚺 User accounts:** To access the report functionalities it is necessary to have an active user account, these are created with a username, email, and password.

- **🚨 Emergencies:** In case of an emergency, it is possible to access quickly to the emergency interface to start a call with the correspondent organization.

- **🔊 Reports:** The main point of the app are reports of critical situations around the city. Here are some point covered about them in the app.

    - **🎫 Creation:** To create a report is necessary to provide with information about it based on the specific type of situation (a water leak, an electricity outage, a fire, or other). It is also essentially the selection of the problem location in an interactive map. After creating successfully the report the user is redirected to, if possible, a chat with the corresponding organization, with a prefilled message with all the information.

    - **📝 History:** It is possible to visualize all the reports made by the user before, modify them, delete them, and to resend a message to the organization to know the current status of the issue _(then the user can update the report to make everyone know that new status)_.

     - **📍 Map:** One of the first screens is where a big map is shown with all the reports made by all the community. Each report is marked as a circle with certain symbology based on the type of report. When one of them is clicked, the basic information about is shown.
 
     - **🔍 Browser:** In the same map mentioned before is available the functionality to filter all the reports based on certain characteristics, as the type of report, time of creation and current status.

## 📱 Installation via APK

The `app-aguas.apk` file is available in the [latest release](https://github.com/IzakCancino/app-aguas/releases/latest) for installation in Android devices _(in version 12+)_.

## 🔩 Developer Setup

To start with the installation is required to have Node.js, Cordova CLI and Android SDK available in the machine.

1. Clone the repository files.
```
git clone https://github.com/IzakCancino/app-aguas.git
```

2. Go to the folder and install Node.js.
```
cd app-aguas
npm install
```

3. Add the Android platform to the Apache Cordova project.
```
cordova platform add android
```

4. Because API keys are not provided in the repository, it is necessary to create a file called `secret.js` in the directory `www/config/` (there is already an example called [`secret_sample.js`](https://github.com/IzakCancino/app-aguas/blob/main/www/config/secret_sample.js)). It must contain the following structures, with the API keys for [api-aguas](https://github.com/izakCancino/api-aguas) _(private API)_ and for [LocationIQ](https://locationiq.com/) _(public API)_.
```js
const API_KEYS = {
  AGUAS: "THE_API_KEY",
  LOCATION_IQ: "THE_OTHER_API_KEY"
};
```

5. Finally, to build the app is used the following Cordova command. This will generate the APK in `platforms/android/app/build/outputs/apk/debug/` ready to be [installed in an Android device](https://github.com/IzakCancino/app-aguas/new/main?filename=README.md#-installation-via-apk).
```
cordova build android
```

## 🌐 Authors

Izak Cancino

-   GitHub: [@IzakCancino](https://github.com/IzakCancino)
-   Gmail: cancinoizak@gmail.com
-   Portfolio: [izakcancino.github.io](https://izakcancino.github.io)

Jensine Velazco

-  GitHub: [@JensineVelazco](https://github.com/JensineVelazco)
