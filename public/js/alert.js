export const hideAlert = () => {
    const el = document.querySelector(".alert");

    if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg, time = 7) => {
    hideAlert();

    const markup = `<div class="alert alert--${type}">${msg}</div>`;

    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

    setTimeout(hideAlert, time * 1000);
};
