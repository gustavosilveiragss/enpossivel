const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    if (formData.get("password") !== formData.get("confirm-password")) {
        alert("Senhas não coincidem");
        return;
    }

    formData.set("account_id", utils.getAccountToken());

    const response = await fetch("/php/insert_registered_account", {
        method: "POST",
        body: formData,
    });

    if (!response || !response.ok) {
        alert("Registro do crachá deu errado!");
        return;
    }

    alert("Registro realizado com sucesso!");
    window.location.href = "/pages/";
});
