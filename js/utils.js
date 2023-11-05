export function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
        const name = cookie.split("=")[0];
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
}

let notificationTimeoutHandle = null;

export function showNotification(message) {
    const notificationContainer = document.querySelector(
        ".notification-container"
    );

    notificationContainer.textContent = message;
    if (notificationContainer.classList.contains("show")) {
        console.assert(notificationTimeoutHandle);
        clearTimeout(notificationTimeoutHandle);
        notificationTimeoutHandle = setTimeout(() => {
            notificationContainer.classList.remove("show");
        }, 3000);
        return;
    }

    notificationContainer.classList.add("show");

    notificationTimeoutHandle = setTimeout(() => {
        notificationContainer.classList.remove("show");
    }, 3000);
}

export function databaseIdFromElementId(element) {
    // we store ids in the format `product-1` or `deleteproduct-1`
    return element.id.split("-")[1];
}
