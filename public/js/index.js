// /* eslint-disable */ // Disabling because es-lint is configured for nodeJs only not for client side! // Note: But now I configured env for es-lint. So it works without disabling es-lint.

import "@babel/polyfill";
import { login, logout, signup } from "./loginSignup";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { showAlert } from "./alert";

// Chapter: DOM Elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const userDateForm = document.querySelector(".form-user-data");
const userPhotoForm = document.querySelector(".form-user-photo");
const userPasswordForm = document.querySelector(".form-user-password");
const logoutBtn = document.querySelector(".nav__el--logout");
const photo = document.getElementById("photo");
const bookBtn = document.getElementById("book-tour");
const alertMessage = document.querySelector("body").dataset.alert;

// Chapter: Delegation
if (alertMessage) showAlert("success", alertMessage, 20);

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

if (userDateForm) {
    userDateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.querySelector("input[name=name]").value;
        const email = document.querySelector("input[name=email]").value;
        updateSettings({ name, email }, "data");
    });
}

if (photo) {
    photo.addEventListener("change", (e) => {
        const filepath = e.target.value;
        const filenameStart = filepath.lastIndexOf("\\");
        const filename = filepath.slice(filenameStart + 1);
        document.querySelector(".label-photo").textContent = filename;
    });
}

if (userPhotoForm) {
    userPhotoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const form = new FormData();
        // form.append("name", document.querySelector("input[name=name]").value);
        // form.append("email", document.querySelector("input[name=email]").value);
        form.append("photo", document.getElementById("photo").files[0]);

        updateSettings(form, "photo");
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

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm =
            document.getElementById("passwordConfirm").value;

        signup(name, email, password, passwordConfirm);
    });
}

if (bookBtn)
    bookBtn.addEventListener("click", (e) => {
        e.target.textContent = "Processing";

        const { tourId } = e.target.dataset;

        bookTour(tourId);
    });
