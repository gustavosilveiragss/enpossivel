import * as auth from "./auth.js";
import * as utils from "./utils.js";
import * as globals from "./globals.js";

globals.push_on_load_hook(genCheckoutPage);

async function genCheckoutPage() {
    let response = await fetch("/php/select_newest_order_from_account.php", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
            account_id: auth.getAccountToken(),
        }),
    });

    if (!response || !response.ok) {
        return;
    }

    const order = await response.json();
    const totalPrice = document.querySelector("#total-price");
    totalPrice.innerText = `${Number(order.total_price).toFixed(2)}`;

    response = await fetch("/php/select_order_products.php", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
            order_id: order.order_id,
        }),
    });

    if (!response || !response.ok) {
        return;
    }

    const products = await response.json();

    const cartTable = document.querySelector(".product-table");
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
    products.forEach(product => {
        const cartRow = document.createElement("tr");
        const name = document.createElement("td");
        const price = document.createElement("td");
        const quantity = document.createElement("td");
        const deleteProduct = document.createElement("td");

        name.innerText = product.title;
        price.innerText = product.price;
        quantity.innerText = product.quantity;

        cartRow.appendChild(name);
        cartRow.appendChild(price);
        cartRow.appendChild(quantity);
        cartRow.appendChild(deleteProduct);

        cartTable.appendChild(cartRow);
    });

    const paymentMethodData = document.querySelector(".payment-method-data");

    const paymentMethod = document.querySelector("[name=payment-method]");
    paymentMethod.onchange = () => {
        function makeHeading(label) {
            const paymentMethodDataHeading = document.createElement("h2");
            paymentMethodDataHeading.textContent = label;
            paymentMethodData.appendChild(paymentMethodDataHeading);
        }
        paymentMethodData.innerHTML = "";
        switch (paymentMethod.value) {
            case "pix":
                makeHeading("QR Code:");
                paymentMethodData.style.justifyContent = "center";

                const pixImageWrapper = document.createElement("div");
                pixImageWrapper.style.display = "flex";
                pixImageWrapper.style.justifyContent = "center";

                const pixImage = document.createElement("img");
                pixImage.src = "/res/images/pix.png";
                pixImage.style.width = "240px";
                pixImage.style.height = "240px";

                pixImageWrapper.appendChild(pixImage);
                paymentMethodData.appendChild(pixImageWrapper);
                break;
            case "credit":
            case "debit":
                function makeFormInput(label, name, type, customizationCallback = null) {
                    const formGroup = document.createElement("div");
                    formGroup.classList.add("form-group");

                    const formLabel = document.createElement("label");
                    formLabel.htmlFor = name;
                    formLabel.textContent = label;

                    const formInput = document.createElement("input");
                    formInput.id = name;
                    formInput.name = name;
                    formInput.required = true;
                    formInput.type = type;
                    if (customizationCallback)
                        customizationCallback(formInput);

                    formGroup.appendChild(formLabel);
                    formGroup.appendChild(formInput);

                    paymentMethodData.appendChild(formGroup);
                }

                makeHeading("Dados do cartão:");
                makeFormInput("Dono do cartão:", "card-owner", "text");
                makeFormInput("Número do cartão:", "card-number", "text");
                makeFormInput("Data de validade:", "card-expiration-date", "date");
                makeFormInput("Código de segurança:", "card-cvv", "text");
                break;
        }
    };
}
