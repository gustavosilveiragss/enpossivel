export async function genLoginCookie() {
    if (document.cookie.indexOf("accountId") != -1) {
        return;
    }

    const response = await fetch("/php/insert_new_account.php", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    if (!response || !response.ok) {
        return;
    }

    const data = await response.json();
    document.cookie = `accountId=${data.new_account_id};path=/;`;
}

export function getAccountToken() {
    console.assert(document.cookie.length != 0);
    // this relies on the fact that we only have 1 cookie!
    return document.cookie.split("=")[1];
}

export async function getAccountRole() {
    const accId = getAccountToken();
    if (!accId) return null;

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
        return null;
    }

    const data = await response.json();
    return data.role;
}
