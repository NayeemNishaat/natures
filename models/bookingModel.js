const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Booking must belong to a tour."]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Booking must belong to a user."]
    },
    // Note: Price is require because price can be changed i.e. discount!
    price: {
        type: Number,
        required: [true, "Booking must have a price."]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // Remark: For manual booking created by admin outside of stripe.
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/, function () {
    this.populate("user").populate("tour", "name");
});

module.exports = mongoose.model("Booking", bookingSchema);
