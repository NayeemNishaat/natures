/* eslint-disable */
import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";

// Chapter: DOM Elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const userForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const logoutBtn = document.querySelector(".nav__el--logout");

// Chapter: Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        login(email, password);
    });
}

if (logoutBtn) logoutBtn.addEventListener("click", logout);

if (userForm) {
    userForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.querySelector("input[name=name]").value;
        const email = document.querySelector("input[name=email]").value;
        updateSettings({ name, email }, "data");
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        document.querySelector(".btn--save-password").textContent =
            "Updating..."; // Warning: Never use innerHTML because it will lead to XSS. value is only available to input elements!

        const passwordCurrent =
            document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm =
            document.getElementById("password-confirm").value;

        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            "password"
        );

        document.querySelector(".btn--save-password").textContent =
            "Save Password";
        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("password-confirm").value = "";
    });
}
