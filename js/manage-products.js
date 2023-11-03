import * as auth from "./auth.js";
import * as utils from "./utils.js";

document.addEventListener("DOMContentLoaded", create_product_table);

const role = await auth.getAccountRole();

if (role !== "admin") {
    window.location.href = "/pages/";
}

async function create_product_table() {
    const response = await fetch("/php/select_product.php");

    if (!response || !response.ok) {
        return;
    }

    const productTable = document.querySelector(".product-table");
    const noProducts = () => {
        productTable.innerHTML = "";
        const productTableWrapper = document.querySelector(".product-table-wrapper");
        productTableWrapper.textContent = "Sem produtos registrados";
    };

    const json = await response.json();
    if (json.length === 0) {
        noProducts();
        return;
    }

    const headerRow = document.createElement("tr");
    productTable.appendChild(headerRow);

    const nameHeader = document.createElement("th");
    nameHeader.innerText = "Nome";
    const priceHeader = document.createElement("th");
    priceHeader.innerText = "Preço";
    const stockHeader = document.createElement("th");
    stockHeader.innerText = "Estoque";

    headerRow.appendChild(nameHeader);
    headerRow.appendChild(priceHeader);
    headerRow.appendChild(stockHeader);

    json.forEach((product) => {
        // fill the table with the data in `product`
        const productRow = document.createElement("tr");
        const name = document.createElement("td");
        const price = document.createElement("td");
        const stock = document.createElement("td");
        const deleteProduct = document.createElement("td");

        name.innerText = product.title;
        price.innerText = product.price;
        stock.innerText = product.stock;

        const id = `deleteproduct-${product.product_id}`;

        const button = document.createElement("button");
        button.className = "remove-product-button";
        button.id = id;
        button.innerHTML = "<span class='fa fa-trash'></span>";
        deleteProduct.appendChild(button);

        button.onclick = async () => {
            const id = utils.databaseIdFromElementId(button);
            const response = await fetch("/php/delete_product.php", {
                method: "POST",
                body: JSON.stringify({
                    product_id: id
                }),
            });

            if (!response || !response.ok) {
                utils.showNotification("Erro ao excluir produto");
                return;
            }

            utils.showNotification(`${name.textContent} foi excluído`);

            productTable.removeChild(productRow);

            // there will always be at least one row because of the headers
            if (productTable.rows.length === 1) {
                noProducts();
                return;
            }
        };

        productRow.appendChild(name);
        productRow.appendChild(price);
        productRow.appendChild(stock);
        productRow.appendChild(deleteProduct);

        productTable.appendChild(productRow);
    });
}
