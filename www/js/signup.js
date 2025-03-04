$('#signupForm').submit(function (e) {
  e.preventDefault();
  var name = $('#name').val();
  var lastName = $('#lastName').val();
  var password = $('#password').val();
  var email = $('#email').val();

  $.ajax({
    url: CREATE_USER,
    type: 'POST',
    headers: HEADER_API_KEY,
    data: {
      "Name": name,
      "LastName": lastName,
      "Password": password,
      "Email": email
    },
    success: function (data) {
      if (!data.Success) {
        generateAlert(data.Message, false)
        console.error(data);
        return;
      }

      window.location.href = "login.html?signup=1";
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error while trying to signup: ', { xhr, status, error });
    }
  });
});
