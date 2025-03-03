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
                      <a href="create-report.html?type=${data.IdOrganization}" class="w-75 text-decoration-none text-black">
                        <div id="${data.IdOrganization}" class="organizations p-5 my-4 w-100 rounded-4 text-center">
                          <p class="w-100">${data.Name}</p>
                        </div>
                      </a>
        `);
      });
  },
  error: function (xhr, status, error) {
    generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
    console.error('Error while trying to get the organizations: ', { xhr, status, error });
  }
});