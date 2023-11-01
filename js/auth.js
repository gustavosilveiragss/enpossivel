export async function genLoginCookie() {
    if (document.cookie.indexOf("accountId") >= 0) {
        return;
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
