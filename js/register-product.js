import * as auth from "./auth.js";
import * as utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const response = await fetch("/php/insert_new_product.php", {
            method: "POST",
            body: formData,
        });

        if (!response || !response.ok) {
            utils.showNotification("Erro ao registrar produto");
            return;
        }

        utils.showNotification("Produto registrado com sucesso");
    });
});

const role = await auth.getAccountRole();

if (role !== "admin") {
    window.location.href = "/pages/";
}
