if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

// console.log(process.env.SECRET);

// nodemon app.js ----> to start the server.
const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
// EJS MATE to create tamplete (CSS)
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
//npm i express-session
const session = require("express-session");
// npm i connect-flash
const MongoStore = require('connect-mongo');
const  flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")


//This is to connect with local mongoDb databse  that we have created i.e data.js
// const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";

// This is to connect with mondoAtlas database
const dbUrl = process.env.ATLASDB_URL;



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.use( express.static( "public" ) );

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto : {
    secret: process.env.SECRET,
  },
  touchAfter : 24 * 3600,
});

store.on("error",  () => {
  console.log("ERROE in MONGO SESSION STORE", err);
});


const sessionOptions = {
  store: store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.crrUser = req.user;
  next();
});

// Default route (root) 
app.get('/', (req, res) => { 
  res.render('/listings/index.ejs', { title: 'Welcome to Dream Stay!', listingsUrl: '/listings' });
});


// Listing.
app.use ("/listings", listingsRouter);

//Reviews 
app.use("/listings/:id/reviews", reviewsRouter );
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page will not Found "));
});

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong!"} = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});