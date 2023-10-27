import { isLoggedIn } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
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
        { name: "Carrinho", url: "/pages/carrinho.html" },
    ];

    const buttons = [];

    console.log(await isLoggedIn());

    if (!(await isLoggedIn())) {
        buttons.push({
            name: "Login",
            id: "btn_login",
            onclick: () => window.open("/pages/login.html"),
        });
        buttons.push({
            name: "Criar conta",
            id: "btn_register",
            onclick: () => window.open("/pages/register.html"),
        });
    } else {
        buttons.push({ name: "Logout", id: "btn_logout", onclick: logout });
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
                            `<button class="nav-menu-btn" id="${b.id}">${b.name}</button>`
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
        
    }
});
