$.ajax({
  url: GET_ORGANIZATIONS,
  type: "GET",
  headers: HEADER_API_KEY,
  success: function (organization) {
    let divOrganizations = $('#organizations');

    organization
      .sort(function (a, b) {
        var textA = a.Name.toUpperCase();
        var textB = b.Name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      .forEach(data => {
        divOrganizations.append(`
          <a href="create-report.html?type=${data.IdOrganization}" class="organizations" style="background-image: url('img/${data.Color}.png');">
            <p class="w-100">${data.Name}</p>
          </a>
        `);
      });
  },
  error: function (xhr, status, error) {
    generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
    console.error('Error while trying to get the organizations: ', { xhr, status, error });
  }
});