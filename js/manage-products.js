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
        const productTableWrapper = document.querySelector(
            ".product-table-wrapper"
        );
        productTableWrapper.textContent = "Sem produtos registrados";
    };

    const json = await response.json();
    if (json.length === 0) {
        noProducts();
        return;
    }

    const headerRow = document.createElement("tr");
    productTable.appendChild(headerRow);

    const titleHeader = document.createElement("th");
    titleHeader.innerText = "Título";
    const priceHeader = document.createElement("th");
    priceHeader.innerText = "Preço";
    const stockHeader = document.createElement("th");
    stockHeader.innerText = "Estoque";

    headerRow.appendChild(titleHeader);
    headerRow.appendChild(priceHeader);
    headerRow.appendChild(stockHeader);

    json.forEach((product) => {
        async function deleteProduct() {
            const response = await fetch("/php/delete_product.php", {
                method: "POST",
                body: JSON.stringify({
                    product_id: product.product_id,
                }),
            });

            if (!response || !response.ok) {
                utils.showNotification("Erro ao excluir produto");
                return;
            }

            utils.showNotification(`${product.title} foi excluído`);

            productTable.removeChild(productRow);

            // there will always be at least one row because of the headers
            if (productTable.rows.length === 1) {
                noProducts();
                return;
            }
        }

        // fill the table with the data in `product`
        const productRow = document.createElement("tr");
        const title = document.createElement("td");
        const price = document.createElement("td");
        const stock = document.createElement("td");
        const deleteProductBtn = document.createElement("td");

        const titleInput = document.createElement("input");
        titleInput.className = "table-input";
        titleInput.type = "text";
        titleInput.value = product.title;
        titleInput.onkeyup = () => {
            inputChange("title");
        };

        title.appendChild(titleInput);

        const priceInput = document.createElement("input");
        priceInput.className = "table-input";
        priceInput.type = "number";
        priceInput.value = product.price;
        priceInput.onkeyup = () => {
            inputChange("price");
        };

        price.appendChild(priceInput);

        const stockInput = document.createElement("input");
        stockInput.className = "table-input";
        stockInput.type = "number";
        stockInput.value = product.stock;
        stockInput.onkeyup = () => {
            inputChange("stock");
        };

        stock.appendChild(stockInput);

        const button = document.createElement("button");
        button.className = "remove-product-button";
        button.innerHTML = "<span class='fa fa-trash'></span>";
        deleteProductBtn.appendChild(button);
        button.onclick = deleteProduct;

        productRow.appendChild(title);
        productRow.appendChild(price);
        productRow.appendChild(stock);
        productRow.appendChild(deleteProductBtn);

        productTable.appendChild(productRow);

        let timeoutId;
        function inputChange(changed) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                updateProduct(changed);
            }, 300);
        }

        async function updateProduct(changed) {
            switch (changed) {
                case "title":
                    product.title = titleInput.value;
                    break;
                case "price":
                    product.price = parseFloat(priceInput.value);
                    break;
                case "stock":
                    product.stock = parseFloat(stockInput.value);
                    break;
            }

            const response = await fetch("/php/update_product.php", {
                method: "POST",
                body: JSON.stringify(product),
            });

            if (!response || !response.ok) {
                utils.showNotification("Erro ao atualizar produto");
                return;
            }

            utils.showNotification(`${product.title} foi atualizado`);
        }
    });
}
