import * as utils from "./utils.js";

window.onload = create_cart_table();

async function create_cart_table() {
    const response = await fetch("/php/select_cart_item.php", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            account_id: utils.getAccountToken(),
        }),
    });

    if (!response || !response.ok) return;

    const json = await response.json();
    if (json.length === 0) {
    }

    let cartTable = document.querySelector(".cart-table");
    let headerRow = document.createElement("tr");
    cartTable.appendChild(headerRow);

    let nameHeader = document.createElement("th");
    nameHeader.innerText = "Nome";
    let priceHeader = document.createElement("th");
    priceHeader.innerText = "Preço";
    let quantityHeader = document.createElement("th");
    quantityHeader.innerText = "Quantidade";

    headerRow.appendChild(nameHeader);
    headerRow.appendChild(priceHeader);
    headerRow.appendChild(quantityHeader);
    json.forEach((product) => {
        // fill the table with the data in `product`
        let cartRow = document.createElement("tr");
        let name = document.createElement("td");
        let price = document.createElement("td");
        let quantity = document.createElement("td");
        let deleteProduct = document.createElement("td");

        name.innerText = product.title;
        price.innerText = product.price;
        quantity.innerText = product.quantity;

        const id = `deleteproduct-${product.product_id}`;

        let button = document.createElement("button");
        button.className = "remove-product-button";
        button.id = id;
        button.innerHTML = "<span class='fa fa-trash'></span>";
        deleteProduct.appendChild(button);

        button.onclick = async () => {
            const id = button.id.split("-")[1];
            const response = await fetch("/php/delete_cart_item.php", {
                method: "POST",
                body: JSON.stringify({
                    product_id: id,
                    account_id: utils.getAccountToken(),
                }),
            });

            if (!response || !response.ok) return;

            utils.showNotification("Produto removido do caldeirão!");

            const new_quantity = Number(quantity.innerText) - 1;
            if (new_quantity === 0) {
                cartTable.removeChild(cartRow);
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
