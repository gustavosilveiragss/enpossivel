import * as auth from "./auth.js";
import * as utils from "./utils.js";
import * as globals from "./globals.js";

globals.push_on_load_hook(loaded_register_product);

const role = await auth.getAccountRole();

if (role !== "admin") {
    window.location.href = "/pages/";
}

function loaded_register_product() {
    const form = document.querySelector("form");

    const fileInput = document.querySelector("#image");
    const fileUpload = document.querySelector(".file-upload");

    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (file) {
            fileUpload.querySelector(".fa").classList.remove("fa-upload");
            fileUpload.querySelector(".fa").classList.add("fa-check");
            fileUpload.querySelector(".text").textContent = file.name;
        }
    });

    fileUpload.addEventListener("dragover", event => {
        event.preventDefault();
        fileUpload.style.borderColor = "#aaa";
    });

    fileUpload.addEventListener("dragleave", event => {
        event.preventDefault();
        fileUpload.style.borderColor = "#ccc";
    });

    fileUpload.addEventListener("drop", event => {
        event.preventDefault();
        fileUpload.style.borderColor = "#ccc";
        const file = event.dataTransfer.files[0];
        if (file) {
            fileInput.files = event.dataTransfer.files;
            fileUpload.querySelector(".fa").classList.remove("fa-upload");
            fileUpload.querySelector(".fa").classList.add("fa-check");
            fileUpload.querySelector(".text").textContent = file.name;
        }
    });

    document.querySelector("#title").addEventListener("input", e => {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 255);
    });

    document.querySelector("#price").addEventListener("input", e => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, "").trim().slice(0, 10);
    });

    document.querySelector("#stock").addEventListener("input", e => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").trim().slice(0, 10);
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const formData = new FormData(form);

        const response = await fetch("/php/insert_new_product.php", {
            method: "POST",
            body: formData,
        });

        if (!response || !response.ok) {
            const data = await response.json();

            if (data && data.error) {
                utils.showNotification(data.error);
                return;
            }

            utils.showNotification("Erro ao registrar produto");
            return;
        }

        utils.showNotification("Produto registrado com sucesso");
    });
}
