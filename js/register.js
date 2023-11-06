import * as auth from "./auth.js";
import * as utils from "./utils.js";

document.querySelector("input").addEventListener("input", e => {
    e.target.value = e.target.value.trim().slice(0, 255);
});

const form = document.querySelector("form");

form.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(form);
    if (formData.get("password") !== formData.get("confirm-password")) {
        utils.showNotification("Senhas não coincidem");
        return;
    }

    formData.set("account_id", auth.getAccountToken());

    const response = await fetch("/php/update_registered_account.php", {
        method: "POST",
        body: formData,
    });

    if (!response || !response.ok) {
        utils.showNotification("Registro do crachá deu errado!");
        return;
    }

    utils.showNotification("Registro realizado com sucesso!");
    window.location.href = "/pages/";
});
