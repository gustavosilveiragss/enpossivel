import * as auth from "./auth.js";
import * as navbar from "./navbar.js";

const on_load_hooks = [];

export function push_on_load_hook(fn) {
    on_load_hooks.push(fn);
}

document.addEventListener("DOMContentLoaded", async () => {
    await auth.genLoginCookie();
    await navbar.genNavbar();
    for (const hook of on_load_hooks) {
        await hook();
    }
});
