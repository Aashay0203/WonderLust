const User = require("../modules/user");

module.exports.renderSignUp = (req, res) => {
    res.render("./user/signUp.ejs");
};

module.exports.signUpRoute = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let signUpUser = await User.register(newUser, password);
        req.login(signUpUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You are Login");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", "This UserName already exist");
        res.redirect("/signup");
    }

};

module.exports.renderLogin = (req, res) => {
    res.render("./user/login.ejs");
};

module.exports.loginRoute = async (req, res) => {
    req.flash("success", "Welcome to Wonder-Land")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutRoute = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logout");
        res.redirect("/listings");
    });
};