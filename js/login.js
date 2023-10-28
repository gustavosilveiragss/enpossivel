import * as utils from "./utils.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const response = await fetch("/php/select_account_with_credentials.php", {
        method: "POST",
        body: formData,
    });

    if (!response || !response.ok) {
        utils.showNotification("Não existe crachá com essas credenciais aí!");
        return;
    }

    const account = await response.json();

    if (account.account_id != utils.getAccountToken()) {
        utils.deleteAllCookies();
        document.cookie = "accountId=" + account.account_id;
    }

    utils.showNotification("Ponto batido com sucesso, vai preencher o caldeirão!");
    window.location.href = "/pages/";
});
