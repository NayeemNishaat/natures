// /* eslint-disable */ // Disabling because es-lint is configured for nodeJs only not for client side! // Note: But now I configured env for es-lint. So it works without disabling es-lint.

const slugify = require("slugify");
import "@babel/polyfill";
import {
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword
} from "./loginSignup";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { showAlert } from "./alert";
import { submitReview, showReviews } from "./review";
import { showModal, hideModal } from "./alert";
import { getTourData } from "./tour";
import manageModel from "./manageModel";
import handlePagination from "./paginate";

// Chapter: DOM Elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const forgotForm = document.querySelector(".form--forgot");
const resetForm = document.querySelector(".form--reset");
const signupForm = document.querySelector(".form--signup");
const userDateForm = document.querySelector(".form-user-data");
const userPhotoForm = document.querySelector(".form-user-photo");
const userPasswordForm = document.querySelector(".form-user-password");
const tourForm = document.querySelector(".tour-form");
const userForm = document.querySelector(".user-form");
const bookingForm = document.querySelector(".booking-form");
const logoutBtn = document.querySelector(".nav__el--logout");
const photoes = document.querySelectorAll(".photo");
const bookBtn = document.getElementById("book-tour");
const alertMessage = document.querySelector("body").dataset.alert;
const reviewBtn = document.querySelector(".form--review");
const addLocation = document.querySelector(".js__loc");
const addDate = document.querySelector(".js__date");
const paginate = document.querySelector(".paginate");
const select = document.querySelector("select");

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

if (photoes) {
  photoes.forEach((photo) => {
    photo.addEventListener("change", (e) => {
      const filepath = e.target.value;
      const filenameStart = filepath.lastIndexOf("\\");
      const filename = filepath.slice(filenameStart + 1);
      photo.nextElementSibling.textContent = filename;
    });
  });
}

if (userPhotoForm) {
  userPhotoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = new FormData();
    // form.append("name", document.querySelector("input[name=name]").value);
    // form.append("email", document.querySelector("input[name=email]").value);
    form.append("photo", document.getElementById("image").files[0]);

    updateSettings(form, "photo");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.querySelector(".btn--save-password").textContent = "Updating..."; // Warning: Never use innerHTML because it will lead to XSS. value is only available to input elements!

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save Password";
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
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    signup(name, email, password, passwordConfirm);
  });
}

if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing";

    const { tourId } = e.target.dataset;

    bookTour(tourId);
  });

if (reviewBtn) {
  reviewBtn.addEventListener("submit", (e) => {
    e.preventDefault();

    const tourId = location.pathname.slice(1).split("/")[0];
    const review = document.getElementById("review").value;
    const rating = +document.getElementById("rating").value;

    submitReview(tourId, review, rating);
  });
}

// Chapter: Tour
if (tourForm) {
  addLocation.addEventListener("click", () => {
    document
      .querySelector(".js__loc")
      .insertAdjacentHTML(
        "beforeBegin",
        `<input class="location form__input" type="text" placeholder="Lng,Lat|address|description|day" required>`
      );
  });

  addDate.addEventListener("click", () => {
    document
      .querySelector(".js__date")
      .insertAdjacentHTML(
        "beforeBegin",
        `<input class="form__input startDate" type="datetime-local" placeholder="Tour Starting Date" required>`
      );
  });

  tourForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = getTourData();

    if (location.pathname.startsWith("/update-tour"))
      return new manageModel("tours").createUpdate(
        formData,
        location.pathname.slice(location.pathname.lastIndexOf("/") + 1)
      );

    new manageModel("tours").createUpdate(formData);
  });
}

export const deleteTour = () => {
  const tourId = document.querySelector(".card")?.dataset.tourId;

  if (!tourId) return;

  const deleteBtns = document.querySelectorAll(".button");
  const deleteSelected = document.getElementById("delete-selected");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      showModal();
      const tourSlug = slugify(
        event.target.parentElement.querySelector(".heading-tertirary span")
          .textContent,
        {
          replacement: "",
          lower: true
        }
      );

      document.querySelectorAll(".js__btn").forEach((el) =>
        el.addEventListener("click", (e) => {
          hideModal();

          if (e.target.textContent !== "Confirm") return;

          new manageModel(
            "tours",
            event.target.parentElement.dataset.tourId,
            tourSlug
          ).delete();
        })
      );
    });
  });

  deleteSelected.addEventListener("click", () => {
    if (document.querySelectorAll(".checkbox:checked").length === 0)
      return showAlert("error", "Please Select First!", 2);

    const tourIds = [];
    const tourSlugs = [];

    document.querySelectorAll(".checkbox:checked").forEach((el) => {
      tourIds.push(el.closest(".card").dataset.tourId);
      tourSlugs.push(
        slugify(
          el.closest(".card").querySelector(".heading-tertirary span")
            .textContent,
          {
            replacement: "",
            lower: true
          }
        )
      );
    });

    showModal();

    document.querySelectorAll(".js__btn").forEach((el) =>
      el.addEventListener("click", (e) => {
        hideModal();

        if (e.target.textContent !== "Confirm") return;

        new manageModel("tours", tourIds, tourSlugs).delete();
      })
    );
  });
};
deleteTour();

// Chapter: User
if (userForm) {
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const role = document.getElementById("role").value;

    return new manageModel("users").createUpdate(
      JSON.stringify({ role }),
      location.pathname.slice(location.pathname.lastIndexOf("/") + 1)
    );
  });
}

if (paginate) {
  handlePagination();
}

// Warning: This deleteBtns only selects the initial page's buttons not the other page's buttons. So to select those buttons the logics are written inside paginate.js but now refactored with a function technically the same!
export const deleteUser = () => {
  const userId = document.querySelector(".card")?.dataset.userId;

  if (!userId) return;

  const deleteBtns = document.querySelectorAll(".button");
  const deleteSelected = document.getElementById("delete-selected");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      showModal();

      document.querySelectorAll(".js__btn").forEach((el) =>
        el.addEventListener("click", (e) => {
          hideModal();

          if (e.target.textContent !== "Confirm") return;

          new manageModel(
            "users",
            event.target.parentElement.dataset.userId
          ).delete();
        })
      );
    });
  });

  deleteSelected.addEventListener("click", () => {
    if (document.querySelectorAll(".checkbox:checked").length === 0)
      return showAlert("error", "Please Select First!", 2);
    const userIds = [];

    document.querySelectorAll(".checkbox:checked").forEach((el) => {
      userIds.push(el.closest(".card").dataset.userId);
    });

    showModal();

    document.querySelectorAll(".js__btn").forEach((el) =>
      el.addEventListener("click", (e) => {
        hideModal();

        if (e.target.textContent !== "Confirm") return;
        new manageModel("users", userIds).delete();
      })
    );
  });
};
deleteUser();

// Chapter: Review
if (select) {
  select.addEventListener("change", () => {
    const selectedTour =
      document.querySelector("select").selectedOptions[0].value;
    showReviews(selectedTour);
  });
}

export const deleteReview = () => {
  const reviewId = document.querySelector(".card")?.dataset.reviewId;

  if (!reviewId) return;

  const deleteBtns = document.querySelectorAll(".button");
  const deleteSelected = document.getElementById("delete-selected");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      showModal();

      document.querySelectorAll(".js__btn").forEach((el) =>
        el.addEventListener("click", (e) => {
          hideModal();

          if (e.target.textContent !== "Confirm") return;

          new manageModel(
            "reviews",
            event.target.parentElement.dataset.reviewId
          ).delete();
        })
      );
    });
  });

  deleteSelected?.addEventListener("click", () => {
    if (document.querySelectorAll(".checkbox:checked").length === 0)
      return showAlert("error", "Please Select First!", 2);
    const reviewIds = [];

    document.querySelectorAll(".checkbox:checked").forEach((el) => {
      reviewIds.push(el.closest(".card").dataset.reviewId);
    });

    showModal();

    document.querySelectorAll(".js__btn").forEach((el) =>
      el.addEventListener("click", (e) => {
        hideModal();

        if (e.target.textContent !== "Confirm") return;
        new manageModel("reviews", reviewIds).delete();
      })
    );
  });
};
deleteReview();

// Chapter: Booking
export const deleteBooking = () => {
  const bookingId = document.querySelector(".card")?.dataset.bookingId;

  if (!bookingId) return;

  const deleteBtns = document.querySelectorAll(".button");
  const deleteSelected = document.getElementById("delete-selected");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      showModal();

      document.querySelectorAll(".js__btn").forEach((el) =>
        el.addEventListener("click", (e) => {
          hideModal();

          if (e.target.textContent !== "Confirm") return;

          new manageModel(
            "bookings",
            event.target.parentElement.dataset.bookingId
          ).delete();
        })
      );
    });
  });

  deleteSelected.addEventListener("click", () => {
    if (document.querySelectorAll(".checkbox:checked").length === 0)
      return showAlert("error", "Please Select First!", 2);
    const bookingIds = [];

    document.querySelectorAll(".checkbox:checked").forEach((el) => {
      bookingIds.push(el.closest(".card").dataset.bookingId);
    });

    showModal();

    document.querySelectorAll(".js__btn").forEach((el) =>
      el.addEventListener("click", (e) => {
        hideModal();

        if (e.target.textContent !== "Confirm") return;
        new manageModel("bookings", bookingIds).delete();
      })
    );
  });
};
deleteBooking();

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const tourName = document.getElementById("tourName").value;
    const price = document.getElementById("price").value;
    const paid = document.getElementById("status").value === "Paid";

    const createBooking =
      document.querySelector(".heading-secondary").textContent ===
      "Create Booking";

    if (createBooking)
      return new manageModel("bookings").createUpdate(
        JSON.stringify({ email, tourName, price, paid }),
        null
      );
    else
      return new manageModel("bookings").createUpdate(
        JSON.stringify({ email, tourName, price, paid }),
        location.pathname.slice(location.pathname.lastIndexOf("/") + 1)
      );
  });
}

if (forgotForm) {
  document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();

    forgotPassword(document.getElementById("email").value);
  });
}

if (resetForm) {
  document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    if (password !== passwordConfirm)
      return showAlert("error", "Passwords didn't match!", 3);

    const token = location.search.slice(1);

    resetPassword(password, passwordConfirm, token);
  });
}
