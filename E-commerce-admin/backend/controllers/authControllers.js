require("dotenv").config();

const handelLoginSuccess = (req, res) => {

    if (req.cookies["connect.sid"]) {
        if (req.user) {
            res.status(200).json({
                message: "successful",
                user: req.user,
            });
        } else {
            res.status(401).redirect(process.env.LOGIN_FAILURE_REDIRECT);
        }
    } else {
        res.status(401).redirect(process.env.LOGIN_FAILURE_REDIRECT);
    }
};

const handelLogout = (req, res) => {
    req.logout(function () { });
    res.status(200).json({
        message: "Logout successfully completed"
    });
};

module.exports = { handelLoginSuccess, handelLogout };