const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  if (formData.get("password") !== formData.get("confirm-password")) {
    alert("Senhas não coincidem");
    return;
  }

  fetch("/php/insert_registered_account", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Registro realizado com sucesso!");
        // LOGIN
        // go to products page
        window.location.href = "/pages/";
      } else {
        alert("Erro ao realizar o registro");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Erro ao realizar o registro");
    });
});