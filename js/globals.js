import * as auth from "./auth.js";
import * as navbar from "./navbar.js";

document.addEventListener("DOMContentLoaded", async () => {
    await auth.genLoginCookie();
    await navbar.genNavbar();
});
