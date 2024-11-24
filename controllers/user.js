const User = require("../models/user.js");


//SINGUP Render
module.exports.renderSingUp = (req, res) => {
  res.render("user/signup.ejs");
};

//SINGUP
module.exports.singUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//LOGIN Render
module.exports.renderLogin = (req, res)=> {
  res.render("user/login.ejs");
};

// after LOGIN 
module.exports.Login = async(req, res)=> {
  req.flash("success", "welcome back to wanderlust.");
  let redirectUrl = res.locals.redirectUrl || "/listings";
 res.redirect(redirectUrl);
};

//Logout
module.exports.Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
}