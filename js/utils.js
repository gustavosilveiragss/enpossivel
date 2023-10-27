export async function genLoginCookie() {
    if (document.cookie.indexOf("accountId") >= 0) {
        return document.cookie.split("=")[1];
    }

    const response = await fetch("/php/select_last_account_id.php");

    if (!response || !response.ok) {
        return;
    }

    const data = await response.json();

    const accId = ++data.id;

    document.cookie = "accountId=" + accId;

    await fetch("/php/insert_new_account.php", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            account_id: accId,
        }),
    });

    return accId;
}
export async function isLoggedIn() {
    const accId = await genLoginCookie();

    const response = await fetch("/php/is_logged_in.php", {
        headers: {
            'Content-Type': 'application/json'
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

    return data && data.role !== "anon"; 
}
