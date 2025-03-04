let signup = new URLSearchParams(window.location.search).get("signup");
if (signup) {
  generateAlert("Cuenta creada exitosamente.<br>Por favor inicia sesión.")
}

$("#form-login").on("submit", e => {
  $("#charging-spinner").fadeIn();

  e.preventDefault();

  let inputs = e.currentTarget.elements;

  let data = {
    "Email": inputs.Email.value,
    "Password": inputs.Password.value
  }

  $.ajax({
    url: LOGIN,
    type: "POST",
    headers: HEADER_API_KEY,
    data: data,
    success: function (response) {
      if (!response.Success) {
        generateAlert(response.Message, false)
        console.error(response);
        return;
      }

      // Successful login
      localStorage.setItem("IdUser", response.Value.IdUser);
      localStorage.setItem("SessionToken", response.Value.SessionToken);
      window.location.href = "general.html";
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to login: ', { xhr, status, error });
    }
  }).always(function () {
    $("#charging-spinner").fadeOut();
  });
});



$("#charging-spinner").fadeOut();