const alertPlaceholder = document.getElementById('alert-placeholder');

function generateAlert(message, success = true) {
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${success ? "success" : "danger"} alert-dismissible fade show" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}