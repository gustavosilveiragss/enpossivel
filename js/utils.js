export async function genLoginCookie() {
    if (document.cookie.indexOf("accountId") >= 0) {
        return document.cookie.split("=")[1];
    }

    const response = await fetch("/php/select_last_account_id.php");

    if (!response || !response.ok) {
        return;
    }

    const data = await response.json();

    const accId = ++data.account_id;

    document.cookie = "accountId=" + accId;

    await fetch("/php/insert_new_account.php", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            account_id: accId,
        }),
    });

    return accId;
}

export function getAccountToken() {
    // this relies on the fact that we only have 1 cookie!
    return document.cookie.split("=")[1];
}

export async function getAccountRole() {
    const accId = getAccountToken();
    if (!accId) return false;

    const response = await fetch("/php/is_logged_in.php", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            account_id: accId,
        }),
    });

    if (!response || !response.ok) {
        return;
    }

    const data = await response.json();
    return data.role;
}

export function deleteAllCookies() {
    const cookies = document.cookie.split(";");
  
    cookies.forEach(cookie => {
      const name = cookie.split("=")[0];
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  }

export function showNotification(message) {
    const notificationContainer = document.querySelector(
        ".notification-container"
    );

    notificationContainer.textContent = message;

    if (notificationContainer.classList.contains("show")) {
        return;
    }


    notificationContainer.classList.add("show");

    setTimeout(() => {
        notificationContainer.classList.remove("show");
    }, 3000);
}
