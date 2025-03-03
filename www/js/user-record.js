let lastReport;

let create = new URLSearchParams(window.location.search).get("create");
if (create) {
  generateAlert("Reporte creado exitosamente.")
}
let update = new URLSearchParams(window.location.search).get("update");
if (update) {
  generateAlert("Reporte actualizado exitosamente.")
}
let del = new URLSearchParams(window.location.search).get("delete");
if (del) {
  generateAlert("Reporte eliminado exitosamente.")
}

$.ajax({
  url: GET_HISTORIAL,
  type: "POST",
  headers: HEADER_API_KEY,
  data: {
    "IdUser": localStorage.getItem("IdUser"),
    "SessionToken": localStorage.getItem("SessionToken")
  },
  success: function (response) {
    if (!("IdUser" in response)) {
      generateAlert(response.Message, false)
      console.error(response);
      return;
    }

    let divRecord = $("#user-record");

    response.Reports
      .reverse()
      .forEach(report => {
        divRecord.append(`
          <a href="#" id="${report.IdReport}" class="list-group-item list-group-item-action report-card" aria-current="true" data-bs-toggle="modal" data-bs-target="#infoModal">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1" style="width: 85%;">${report.ReportType.Name}</h5>
                <small style="width: 15%; text-align: end;">ID #${report.IdReport}</small>
            </div>
            <p class="mb-1">${report.Description}</p>
            <small class="d-flex justify-content-end">
                <i class="bi bi-arrow-right" title="Ver más"></i>
            </small>
          </a>
        `);
      });

    // API request to get information of the clicked report
    $(".report-card").on("click", e => {
      $.ajax({
        url: GET_REPORTS + '/' + e.currentTarget.attributes.id.value,
        type: "GET",
        headers: HEADER_API_KEY,
        data: {
          "IdUser": localStorage.getItem("IdUser"),
          "SessionToken": localStorage.getItem("SessionToken")
        },
        success: function (data) {
          lastReport = data;

          let status;
          switch (data.Status) {
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

          $("#IdReport").text(data.IdReport);
          $("#HouseNumber").text(data.HouseNumber);
          $("#Street").text(data.Street);
          $("#Neighborhood").text(data.Neighborhood);
          $("#ReportType").text(data.ReportType.Name);
          $("#Description").text(data.Description);
          $("#Status").text(`${status} (${data.Status}/3)`);
          $("#CreationDate").text(new Intl.DateTimeFormat("es-ES").format(new Date(data.CreationDate)));
          $("#ModificationDate").text(new Intl.DateTimeFormat("es-ES").format(new Date(data.ModificationDate)));
        },
        error: function (xhr, status, error) {
          generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
          console.error('Error while trying to get report: ', { xhr, status, error });
        }
      });
    })

  },
  error: function (xhr, status, error) {
    generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
    console.error('Error while trying to get historial: ', { xhr, status, error });
  }
});

// Executed when modal to start editing is clicked
$("#btn-report-edit").on("click", () => {
  $("#Edit-IdReport").text(lastReport.IdReport);
  $("#Edit-ReportType").text(lastReport.ReportType.Name);
  $("#Edit-CreationDate").text(new Intl.DateTimeFormat("es-ES").format(new Date(lastReport.CreationDate)));
  $("#Edit-Description").text(lastReport.Description);
  $("#Edit-Status").val(lastReport.Status);
})

// Executed when report is saved
$("#btn-report-save").on("click", () => {
  let data = {
    "IdReport": lastReport.IdReport,
    "IdReportType": lastReport.ReportType.IdReportType,
    "IdUser": localStorage.getItem("IdUser"),
    "Latitude": lastReport.Latitude,
    "Longitude": lastReport.Longitude,
    "HouseNumber": lastReport.HouseNumber,
    "Street": lastReport.Street,
    "Neighborhood": lastReport.Neighborhood,
    "Description": $("#Edit-Description").val(),
    "Status": $("#Edit-Status").val()
  }
  console.log(data);

  $.ajax({
    url: UPDATE_REPORT,
    type: "POST",
    headers: Object.assign(
      HEADER_API_KEY,
      { "Authorization": `Basic ${localStorage.getItem("IdUser")}/${localStorage.getItem("SessionToken")}` }
    ),
    data: data,
    success: function (data) {
      window.location.href = "user-record.html?update=1";
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to update report: ', { xhr, status, error });
    }
  });
});

$("#btn-report-delete").on("click", () => {
  $.ajax({
    url: DELETE_REPORT + "?id=" + lastReport.IdReport,
    type: "POST",
    headers: Object.assign(
      HEADER_API_KEY,
      { "Authorization": `Basic ${localStorage.getItem("IdUser")}/${localStorage.getItem("SessionToken")}` }
    ),
    success: function (data) {
      window.location.href = "user-record.html?delete=1";
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to delete report: ', { xhr, status, error });
    }
  });
});