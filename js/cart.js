import * as auth from "./auth.js";
import * as utils from "./utils.js";
import * as globals from "./globals.js";

globals.push_on_load_hook(genCartPage);

async function genCartPage() {
    const response = await fetch("/php/select_cart_product.php", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            account_id: auth.getAccountToken(),
        }),
    });

    if (!response || !response.ok) {
        return;
    }

    const cartTable = document.querySelector(".product-table");
    const cartTableWrapper = document.querySelector(".product-table-wrapper");
    const checkoutButton = document.querySelector("#checkout-button");
    const cartIsEmpty = () => {
        cartTable.innerHTML = "";
        cartTableWrapper.textContent = "O caldeirão está vazio!";
    };

    const json = await response.json();
    if (json.length === 0) {
        cartIsEmpty();
        return;
    }

    const headerRow = document.createElement("tr");
    cartTable.appendChild(headerRow);

    const nameHeader = document.createElement("th");
    nameHeader.innerText = "Nome";
    const priceHeader = document.createElement("th");
    priceHeader.innerText = "Preço";
    const quantityHeader = document.createElement("th");
    quantityHeader.innerText = "Quantidade";

    headerRow.appendChild(nameHeader);
    headerRow.appendChild(priceHeader);
    headerRow.appendChild(quantityHeader);
    json.forEach((product) => {
        // fill the table with the data in `product`
        const cartRow = document.createElement("tr");
        const name = document.createElement("td");
        const price = document.createElement("td");
        const quantity = document.createElement("td");
        const deleteProduct = document.createElement("td");

        name.innerText = product.title;
        price.innerText = product.price;
        quantity.innerText = product.quantity;

        const button = document.createElement("button");
        button.id = `deleteproduct-${product.product_id}`;
        button.className = "remove-product-button";
        button.innerHTML = `<span class='fa fa-trash'></span>`;
        deleteProduct.appendChild(button);

        button.onclick = async () => {
            const id = utils.databaseIdFromElementId(button);
            const response = await fetch("/php/delete_cart_product.php", {
                method: "POST",
                body: JSON.stringify({
                    product_id: id,
                    account_id: auth.getAccountToken(),
                }),
            });

            if (!response || !response.ok) {
                return;
            }

            utils.showNotification(`${name.textContent} foi removido do caldeirão`);

            const new_quantity = Number(quantity.innerText) - 1;
            if (new_quantity === 0) {
                cartTable.removeChild(cartRow);
                // there will always be at least one row because of the headers
                if (cartTable.rows.length === 1) {
                    cartIsEmpty();
                    return;
                }
            } else {
                quantity.innerText = new_quantity;
            }
        };

        cartRow.appendChild(name);
        cartRow.appendChild(price);
        cartRow.appendChild(quantity);
        cartRow.appendChild(deleteProduct);

        cartTable.appendChild(cartRow);
    });
}
