import * as utils from "./utils.js";

window.onload = create_product_cards();

async function create_product_cards() {
    const response = await fetch("/php/select_product.php");
    if (!response || !response.ok)
        return;

    const json = await response.json();

    const productsGrid = document.querySelector(".products-grid");
    json.forEach((product) => {
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
        productButton.textContent = "Adicionar ao caldeirão";
        productButton.onclick = async () => {
            const id = productButton.id.split("-")[1];
            await fetch("/php/insert_cart_item.php", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    account_id: utils.getAccountToken(),
                    product_id: id,
                }),
            });
            alert("Produto adicionado ao caldeirão!");
        };

        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productCard.appendChild(productButton);

        productsGrid.appendChild(productCard);
    });
}
