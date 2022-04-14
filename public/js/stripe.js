import { showAlert } from "./alert";

// Note: process.env is not available in frontend!
const stripe = Stripe(
    "pk_test_51KoMC0CUGtQvOzQdZv6lb3Lgbf6scxHV1uMyvHfOW47PHpSNdbzFcWyiGXdU0H1ROZx26dhwECinUtGiMpSW6mvR00p5vVUI6o"
);
// Warning: Can not use catchAsync here because that's for backend cause that requires req, res and next() which is not available in frontend.
export const bookTour = async (tourId) => {
    try {
        // Point: Get checkout session from backend API
        const res = await fetch(
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
        );

        const session = await res.json();

        // Point: Create checkout form and charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.session.id
        });
    } catch (err) {
        showAlert("error", err.message);
    }
};
