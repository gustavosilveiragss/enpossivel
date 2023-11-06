import * as auth from "./auth.js";
import * as utils from "./utils.js";
import * as globals from "./globals.js";

globals.push_on_load_hook(create_product_cards);

async function create_product_cards() {
    const searchBar = document.createElement("div");
    searchBar.classList.add("search-bar");

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("search-bar-input");
    searchInput.placeholder = "Buscar Produto";

    searchBar.appendChild(searchInput);

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    hamburgerMenu.before(searchBar);

    if (window.matchMedia("(max-width: 768px)").matches) {
        const logo = document.querySelector(".logo");
        logo.style.margin = "auto";
    }

    await searchProduct("");

    let timeoutId;
    async function inputChange(changed) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(async () => {
            await searchProduct(searchInput.value);
        }, 300);
    }

    searchInput.oninput = async () => {
        await inputChange();
    }
}

async function searchProduct(search) {
    const response = await fetch("/php/select_product_listing.php", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
            search: search
        }),
    })

    if (!response || !response.ok)
        return;

    const json = await response.json();

    const productsGrid = document.querySelector(".products-grid");

    productsGrid.innerHTML = "";

    json.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.classList.add("container");

        const productImage = document.createElement("img");
        productImage.src = product.img_path;
        productImage.alt = product.title;

        const productInfo = document.createElement("div");

        const productName = document.createElement("h3");
        productName.textContent = product.title;

        const productPrice = document.createElement("span");
        productPrice.textContent = `R$ ${Number(product.price).toFixed(2)}`;

        const productButton = document.createElement("button");
        productButton.id = `product-${product.product_id}`;
        productButton.textContent = "Adicionar ao Caldeirão";
        productButton.onclick = async () => {
            const id = utils.databaseIdFromElementId(productButton);

            const response = await fetch("/php/insert_cart_product.php", {
                headers: { "Content-Type": "application/json", },
                method: "POST",
                body: JSON.stringify({
                    account_id: auth.getAccountToken(),
                    product_id: id,
                }),
            });

            if (!response || !response.ok) {
                const data = await response.json();

                if (data && data.error) {
                    utils.showNotification(data.error);
                    return;
                }

                utils.showNotification("Erro ao adicionar ao caldeirão");
                return;
            }

            utils.showNotification(`${productName.textContent} foi adicionado ao caldeirão.`);
            await searchProduct(document.querySelector(".search-bar-input").value);
        };

        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productCard.appendChild(productButton);

        productsGrid.appendChild(productCard);
    });
}
