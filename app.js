const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./lib/appError");
const globalErrorHandler = require("./controllers/errorController");

// Chapter: Global Middlewares
// Important: Using middleware (a function that can modify the incoming data)
// Important: Point: Position is very important in express. We must define the middlewares before the route handlers send the response.
// Part: Set security http headers
app.use(helmet()); // Note: Called a function but app.use() expects a function not a function call. But the called function will return a function so no worries.

// Part: Development logging
if (process.env.NODE_ENV === "development") {
    // Do development logging!
}

// Part: Request limitting
const limiter = rateLimit({
    max: 100,
    windowMs: 3600 * 1000,
    message: "Too many requests from this IP. Please try again in an hour."
});

app.use("/api", limiter);

// Part: Json body parser
app.use(express.json({ limit: "10kb" }));

// Part: Data sanitization against NoSQL query injection
// Warning: "email":{"$gt":""} -> always returns true. So when we findOne({email}) we get all the users!
app.use(mongoSanitize());

// Part: Data sanitization against XSS
app.use(xss());

// Part: Prevent parameter pollution
// Warning: /api/v1/tours?sort=duration&sort=price -> will give an error because we dont expect any array of parameters but string. (express converts multiple params with same name seperated by "&" to an array)
app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price"
        ]
    })
);

// Part: Serving static files
app.use(express.static(`${__dirname}/public`)); // Note: We don't need to include public in the url because it acts as root when no route is defined for the entered url!

// Part: Test middleware
app.use((_req, _res, next) => {
    // const ip = _req.headers["x-forwarded-for"] || _req.socket.remoteAddress;
    // console.log();
    // console.log("From Middleware");
    // Important: Must call next else the req, res cycle will stuck here.
    next();
});

app.use((req, _res, next) => {
    req.requestTime = new Date().toISOString();

    next();
});

// app.get("/", (req, res) => {
//   // res.status(200).send("Hello from the server!");
//   res.status(200).json({ message: "Hello from the server!", app: "natures" });
// });

// app.post("/", (req, res) => {
//   res.status(201).end("End!");
// });

// Chapter: Route Handlers
// const getAllTours = (req, res) => {
//     console.log(req.requestTime);

//     res.status(200).json({
//         status: "success",
//         requestedAt: req.requestTime,
//         results: tours.length,
//         data: {
//             tours
//         }
//     });
// };

// const getTour = (req, res) => {
//     console.log(req.params);

//     id = req.params.id * 1; // Point: Another trick to convert from string to number (js performs type casting to number).

//     // if (id > tours.length) {
//     //     return res.status(404).json({ status: "fail", message: "Invalid Id" });
//     // }

//     const tour = tours.find((el) => el.id === id);

//     if (!tour) {
//         return res.status(404).json({ status: "fail", message: "Invalid Id" });
//     }

//     res.status(200).json({
//         status: "success",
//         results: tours.length,
//         data: {
//             tour
//         }
//     });
// };

// const createTour = (req, res) => {
//     // console.log(req.body);

//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body);

//     tours.push(newTour);
//     fs.writeFile(
//         `${__dirname}/dev-data/data/tours-simple.json`,
//         JSON.stringify(tours),
//         (err) => {
//             res.status(201).json({
//                 status: "success",
//                 data: {
//                     tour: newTour
//                 }
//             });
//         }
//     );

//     // res.status(200).send("Done!"); // Important: We must return a response.
// };

// const updateTour = (req, res) => {
//     if (+req.params.id > tours.length) {
//         return res.status(404).json({ status: "fail", message: "Invalid Id" });
//     }

//     res.status(200).json({
//         status: "success",
//         data: { tour: "<Updated tour here!>" }
//     });
// };

// const deleteTour = (req, res) => {
//     if (+req.params.id > tours.length) {
//         return res.status(404).json({ status: "fail", message: "Invalid Id" });
//     }

//     res.status(204).json({
//         status: "success",
//         data: null
//     });
// };

// const getAllUsers = (req, res) => {
//     res.status(500).json({ status: "error", message: "Undefined route!" });
// };

// const getUser = (req, res) => {
//     res.status(500).json({ status: "error", message: "Undefined route!" });
// };

// const createUser = (req, res) => {
//     res.status(500).json({ status: "error", message: "Undefined route!" });
// };

// const updateUser = (req, res) => {
//     res.status(500).json({ status: "error", message: "Undefined route!" });
// };

// const deleteUser = (req, res) => {
//     res.status(500).json({ status: "error", message: "Undefined route!" });
// };

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// Important: If incoming req url matches this url it will not trigger rest of the urls!
// app.get("/api/v1/tours/:id/:x/:y?", (req, res) => { // Note: ? means optional
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);

// app.post("/api/v1/tours", createTour);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);

// Chapter: Routes
// const tourRouter = express.Router();
app.use("/api/v1/tours", tourRouter); // Mounting Router

// tourRouter.route("/").get(getAllTours).post(createTour);
// tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

// const userRouter = express.Router();
app.use("/api/v1/users", userRouter);

// userRouter.route("/").get(getAllUsers).post(createUser);
// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

// Part: Handle unwanted routes (Operational Error)
app.all("*", (req, _res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server.`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server.`);
    // err.status = "fail";
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404)); // Important: If next() receives an argument, express will automatically know an error occured. And it will skip all the other middlewares to the error handling middleware.
});

// Chapter: Error Handling
app.use(globalErrorHandler);

// Chapter: Start Server
// const port = 3000;
// app.listen(port, () => {
//     console.log(`App listening on port ${port}.`);
// });

module.exports = app;
