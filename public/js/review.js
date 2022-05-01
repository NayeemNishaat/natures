import { showAlert } from "./alert";
import { deleteReview } from ".";

export const submitReview = async (tourId, review, rating) => {
    try {
        const res = await fetch(`/api/v1/tours/${tourId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review, rating })
        });

        const data = await res.json();

        if (data.status === "success") {
            showAlert("success", "Your review was submitted successfully.");

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else throw new Error(data.message);
    } catch (err) {
        showAlert("error", err.message);
    }
};

export const showReviews = async (selectedTour) => {
    try {
        const res = await fetch(
            selectedTour
                ? `/api/v1/tours/${selectedTour}/reviews`
                : `/api/v1/reviews`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
        );

        const data = await res.json();

        if (data.status === "success") {
            // showAlert("success", "Your review was submitted successfully.");
            // setTimeout(() => {
            //     location.reload();
            // }, 2000);

            const markup = data.data.doc.reduce((markup, d) => {
                return (markup =
                    markup +
                    `<div class="card" data-review-id=${d.id}><button class="button">X</button><input class="onlycb checkbox" type="checkbox"><div class="card__header"><div class="card__picture"><div class="card__picture-overlay">&nbsp;</div><img class="card__picture-img" src="/img/tours/${d.tour.imageCover}" alt=${d.tour.name}></div><h3 class="heading-tertirary"><span>${d.tour.name}</span></h3></div><div class="card__details"><h4 class="card__sub-heading">Review</h4><p class="card__text">${d.review}</p></div><div class="card__footer"><p><span class="card__footer-text">User -</span> <span class="card__footer-value">${d.user.name}</span></p><p class="card__ratings"><span class="card__footer-text">Rating -</span> <span class="card__footer-value">${d.rating}</span></p></div></div>`);
            }, "");

            document.querySelector(".card-container").innerHTML =
                markup ||
                `""<h1 style="text-align:center;">No Reviews Found!</h1>`;

            deleteReview();
        } else throw new Error(data.message);
    } catch (err) {
        showAlert("error", err.message);
    }
};
