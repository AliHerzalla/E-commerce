const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const passportConfig = require("./config/passport.js");
const authRoute = require("./routes/auth.js");
const productsRoute = require("./routes/products.js");
const categoriesRouter = require("./routes/categories.js");
const propertiesRouter = require("./routes/properties.js");
const connection = require("./db.js");

// Constants
const corsConfig = {
    origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
};

// Middleware's
app.use(cookieParser());
app.use(session({
    secret: process.env.COOKIE_SECTION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 90 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsConfig));
app.use(express.json());

// Requisites
app.use("/auth", authRoute);
app.use("/products", productsRoute);
app.use("/categories", categoriesRouter);
app.use("/properties", propertiesRouter);

// DataBase Connection
connection.connect((error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('Connected to MySQL database!');
});

// Server Connection
app.listen(process.env.PORT || 3000, () => {
    console.log("listening in the admin server on port " + process.env.PORT || 3000);
});