import * as utils from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
    utils.genLoginCookie();

    const navBar = `
        <div class="nav-bar">
            <div class="logo">
            <img src="/public/logo.png" alt="Logo" />
            </div>

            <div class="search-bar">
            <input
                type="text"
                class="search-bar-input"
                placeholder="Buscar Produto"
            />
            </div>

            <div class="hamburger-menu">
            <i class="fa fa-bars"></i>
            </div>
        </div>
    `;

    const pages = [
        { name: "Produtos", url: "/pages/index.html" },
        { name: "Caldeirão", url: "/pages/cart.html" },
    ];

    const buttons = [];

    const role = await utils.getAccountRole();

    switch (role) {
        case "anon":
            buttons.push({
                name: "Bater Ponto",
                id:"login-btn",
                onclick: () => (window.location.href = "/pages/login.html"),
            });
            buttons.push({
                name: "Registrar Crachá",
                id:"register-btn",
                onclick: () => (window.location.href = "/pages/register.html"),
            });
            break;
        case "admin":
            buttons.push({
                name: "Cadastrar Produto",
                id: "register-product-btn",
                onclick: () => (window.location.href = "/pages/admin/register-product.html"),
            });
            buttons.push({
                name: "Excluir Produto",
                id: "delete-product-btn",
                onclick: () => (window.location.href = "/pages/admin/delete-product.html"),
            });
        default:
            buttons.push({ name: "Logout", id: "logout-btn", onclick: logout });
            break;
    }

    const navMenu = `
        <div class="nav-menu">
            <ul>
                ${pages
                    .map((p) => `<li><a href="${p.url}">${p.name}</a></li>`)
                    .join("")}
                <li>
                ${buttons
                    .map(
                        (b) =>
                            `<button class="green-btn" id="${b.id}">${b.name}</button>`
                    )
                    .join("")}
                </li>
            </ul>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navBar);
    document.body.insertAdjacentHTML("beforeend", navMenu);

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            const btn = buttons.find((b) => b.id === button.id);
            if (btn) {
                btn.onclick();
            }
        });
    });

    document.querySelector(".logo").addEventListener("click", () => {
        window.location.href = "/pages/";
    });

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const optionsBar = document.querySelector(".nav-menu");

    hamburgerMenu.addEventListener("click", () => {
        optionsBar.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        const clickOnBar = optionsBar.contains(event.target);
        const clickOutside = hamburgerMenu.contains(event.target);

        if (!clickOnBar && !clickOutside) {
            optionsBar.classList.remove("active");
        }
    });

    function logout() {
        utils.deleteAllCookies();
        window.location.href = "/pages/";
    }
});
