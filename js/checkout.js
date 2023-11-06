import * as auth from "./auth.js";
import * as utils from "./utils.js";
import * as globals from "./globals.js";

globals.push_on_load_hook(genCheckoutPage);
function makeMonthFormInput() {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const formLabel = document.createElement("label");
    formLabel.htmlFor = "card-expiration-date";
    formLabel.textContent = "Data de Validade";

    const dateContainer = document.createElement("div");
    dateContainer.id = "date-container";
    dateContainer.name = "date-container";

    const formInputMonth = document.createElement("input");
    formInputMonth.id = "card-expiration-date-month";
    formInputMonth.name = "card-expiration-date-month";
    formInputMonth.required = true;
    formInputMonth.type = "number";
    formInputMonth.min = 1;
    formInputMonth.max = 12;
    formInputMonth.maxLength = 2;
    formInputMonth.placeholder = "MM";

    const formInputYear = document.createElement("input");
    formInputYear.id = "card-expiration-date-year";
    formInputYear.name = "card-expiration-date-year";
    formInputYear.required = true;
    formInputYear.type = "number";
    formInputMonth.maxLength = 2;
    formInputYear.min = 23;
    formInputYear.placeholder = "YY";

    dateContainer.appendChild(formInputMonth);
    dateContainer.appendChild(formInputYear);

    dateContainer.childNodes.forEach(e => {
        e.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, '').trim().slice(0, 2);
        });
    });

    formGroup.appendChild(formLabel);
    formGroup.appendChild(dateContainer);

    return formGroup;
}

function makeFormInput(label, name, type) {
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

    formGroup.appendChild(formLabel);
    formGroup.appendChild(formInput);

    if (type === "text" && (name === "card-number" || name === "card-cvv")) {
        formInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, '').trim();
            if (name === "card-number") {
                this.value = this.value.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
            } else if (name === "card-cvv") {
                this.value = this.value.slice(0, 3);
            }
        });
    }

    return formGroup;
}

function makeHeading(label) {
    const heading = document.createElement("h2");
    heading.textContent = label;
    return heading;
}

function makeCardInfo() {
    return [
        makeHeading("Dados do cartão:"),
        makeFormInput("Dono do cartão:", "card-owner-name", "text"),
        makeFormInput("Número do cartão:", "card-number", "text"),
        makeMonthFormInput(),
        makeFormInput("Código de segurança:", "card-cvv", "text")
    ];
}


async function genCheckoutPage() {
    let response = await fetch("/php/select_newest_order_from_account.php", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
            account_id: auth.getAccountToken(),
        }),
    });

    if (!response || !response.ok) {
        const formWrapper = document.querySelector(".form-wrapper");
        formWrapper.innerHTML = "";
        formWrapper.textContent = "Não há pedidos pendentes";
        return;
    }

    const json = await response.json();
    const order = json.order;
    const order_id = order.order_id;
    const totalPrice = document.querySelector("#total-price");
    totalPrice.innerText = `${Number(order.total_price).toFixed(2)}`;

    response = await fetch("/php/select_order_products.php", {
        headers: { "Content-Type": "application/json", },
        method: "POST",
        body: JSON.stringify({
            order_id: order_id,
        }),
    });

    if (!response || !response.ok) {
        return;
    }

    const form = document.querySelector("form");
    form.addEventListener("submit", async event => {
        event.preventDefault();

        const formData = new FormData(form);

        formData.set("order_id", order_id);
        // this is not really necessary but it saves some work on the backend
        formData.set("account_id", auth.getAccountToken());

        const response = await fetch("/php/update_order.php", {
            method: "POST",
            body: formData,
        });

        if (!response || !response.ok) {
            utils.showNotification("Finalização do pedido deu errado :(");
            return;
        }

        utils.showNotification("Pedido finalizado com sucesso!");
        setTimeout(() => {
            window.location.href = "/pages/";
        }, 2000);
    });

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

    const cpfInput = document.querySelector("#cpf");
    cpfInput.oninput = () => {
        //https://pt.stackoverflow.com/a/290510
        const v = cpfInput.value;

        if (isNaN(v[v.length - 1])) {
            // allow only numbers
            cpfInput.value = v.substring(0, v.length - 1);
            return;
        }

        cpfInput.setAttribute("maxlength", "14");
        if (v.length == 3 || v.length == 7) cpfInput.value += ".";
        else if (v.length == 11) cpfInput.value += "-";
    };

    const paymentMethodData = document.querySelector(".payment-method-data");
    const paymentMethod = document.querySelector("[name=payment-method]");
    paymentMethod.onchange = () => {
        paymentMethodData.innerHTML = "";
        switch (paymentMethod.value) {
            case "pix":
                paymentMethodData.appendChild(makeHeading("QR Code:"));
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
                makeCardInfo().forEach(node => paymentMethodData.appendChild(node));
                break;
        }
    };

    const last_order_info = json.last_order_info;
    if (last_order_info) {
        const cpf = document.querySelector("#cpf");
        cpf.value = last_order_info.cpf;

        paymentMethod.value = last_order_info.payment_method;
        paymentMethod.dispatchEvent(new Event("change"));

        const card_info = json.last_order_card_info;
        if (card_info) {
            const cardOwnerName = document.querySelector("#card-owner-name");
            cardOwnerName.value = card_info.card_owner_name;

            const cardNumber = document.querySelector("#card-number");
            cardNumber.value = card_info.card_number;

            const cardExpirationDateMonth = document.querySelector("#card-expiration-date-month");
            cardExpirationDateMonth.value = card_info.card_expiration_date_month;

            const cardExpirationDateYear = document.querySelector("#card-expiration-date-year");
            cardExpirationDateYear.value = card_info.card_expiration_date_year;

            const cardCvv = document.querySelector("#card-cvv");
            cardCvv.value = card_info.card_cvv;
        }
    }
}
