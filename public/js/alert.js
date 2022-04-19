import manageModel from "./manageModel";

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

// Segment: Manipulate Scroll
function preventDefault(e) {
    e.preventDefault();
}

const keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 };
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
    }
}

function disableScroll() {
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

function enableScroll() {
    window.removeEventListener("wheel", preventDefault, { passive: false });
    window.removeEventListener("touchmove", preventDefault, { passive: false });
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

// Part: Hide Modal
export const hideModal = (tourId) => {
    document.querySelectorAll(".js__btn").forEach((el) =>
        el.addEventListener("click", (e) => {
            enableScroll();
            document.querySelector(".modal").remove();
            document.querySelector(".overlay").remove();

            if (e.target.textContent !== "Confirm") return;

            tourId.constructor === Array
                ? new manageModel("tours", tourId).deleteMultiple()
                : new manageModel("tours", tourId).deleteOne();
        })
    );
};

// Part: Show Modal
export const showModal = (tourId) => {
    const markup = `<div class="modal alert--error"><p>Confirm Delete?</p><div class="btn-container"><button class="btn-small btn--white js__btn">Cancel</button><button class="btn-small btn--green js__btn">Confirm</button></div></div><div class="overlay"></div>`;

    disableScroll();
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

    hideModal(tourId);
};
