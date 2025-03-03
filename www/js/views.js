function loadView(viewName, IdElement = null, isAppend = false) {
  $.ajax({
    url: 'views/' + viewName + '.html',
    type: "GET",
    success: function (response) {
      IdElement === null ?
        console.error('Elemento contenedor (IdElement) no definido')
        : (isAppend ?
          $('#' + IdElement).append(response)
          : $('#' + IdElement).html(response))
    },
    error: function (xhr, status, error) {
      generateAlert("Un error inesperado ha sucedido.<br>Por favor vuelve a intentarlo.", false);
      console.error('Error al cargar la vista parcial: ', error);
    }
  });
}