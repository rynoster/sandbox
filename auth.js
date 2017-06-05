
module.exports = {
    loginRequired: function(req, res, next) {
        if (!req.isAuthenticated()) {
            req.session.sourceURL = req.originalUrl;
            return res.redirect("/login");
     }
     next();
    },
    adminRequired: function(req, res, next) {
        if (!req.user.admin) {
            return res.render("403");
        }
        next();
        }
    }