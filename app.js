if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./modules/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/error.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./modules/review-schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");

const Db_URL = process.env.DB_URL;

const store = MongoStore.create({
    mongoUrl: Db_URL,
    crypto: {
        secret: process.env.SESSION_SECREAT,
    },
    touchAfter: 24 * 3600,
});


const expressSession = {
    store,
    secret: process.env.SESSION_SECREAT,
    resave: false,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

//flash middlevares
app.use(session(expressSession));
app.use(flash());


//authintication middlewares

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash routers / routes ke upar hi difine karna hai
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;

    next();
});


main()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));
async function main() {
    await mongoose.connect(Db_URL);
}



app.get("/", (req, res) => {
    res.send("page is working");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);





//Other Routes
app.all("*", (req, res, next) => {
    next(new ExpressError(500, "Page Not Found"));
}
);



//Error Middleware - Fixed version
app.use((err, req, res, next) => {
    // Check if response has already been sent
    if (res.headersSent) {
        console.log("Headers already sent, passing to default error handler");
        return next(err);
    }

    //console.log("Error caught by middleware:", err.message);
    const { statusCode = 500, message = "Something went Wrong" } = err;

    try {
        res.status(statusCode).render("./listings/error.ejs", { message });
    } catch (renderError) {
        console.log("Error rendering error page:", renderError.message);
        // Fallback to simple text response
        res.status(statusCode).send(`Error: ${message}`);
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});