const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const router = express.Router();
const db = require("../db");
const passport = require("passport");
const auth = require("../auth");
const _ = require("lodash");

const Agenda = require("../agenda");
const User = require("../user");

const user = new User();
const agenda = new Agenda();

require("../passport");

// var app = express(); eslint not used

router
//Session initialise
    .use(session({
        store: new RedisStore(),
        resave: false,
        saveUninitialized: false,
        secret: "Singularity is the secret!!!"
    }))
    .use(passport.initialize())
    .use(passport.session())

//Website main entrance
.get("/", (req, res) => {

    res.render("skeleton", {
        user: req.user,
        partials: {
            header: "header",
            content: "index",
            footer: "footer",
            jscript: "jscript",
        }
    });

})

//Verify email links
.get("/verify/:token", (req, res, next) => {

    const { token } = req.params;

    db("users")
        .where("token", token)
        .first()
        .then((users) => {
            if (users) {

                var fullName = users.first_name + " " + users.last_name;
                var updateUser = users;

                updateUser.verified = 1;

                db("users")
                    .where("id", updateUser.id)
                    .update(updateUser)
                    .then((result) => {
                        if (result === 0) {
                            return res.send(400);
                        }
                        res.send(200);
                    }, next);

                res.render("skeleton", {
                    fullName: fullName,
                    partials: {
                        header: "header",
                        content: "verify",
                        footer: "footer",
                        jscript: "jscript"
                    }
                });

            } else {

                return res.send(400);

            }

        }, next);

})

//Delegate login
.get(
    '/login',
    function(req, res, next) {
        // Populate username and password before passing it on to Passport.
        req.query.username = req.query.email;
        req.query.password = req.query.firstLogin;
        next();
    },
    function(req, res, next) {

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }
            //   if (!user) { return res.sendStatus(400); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/myProfile');
            });
        })(req, res, next);

    }
)

.post("/login", passport.authenticate("local"), (req, res) => {

    res.send(200);
    // res.redirect("/");

})

.get("/logout", (req, res, next) => {

    req.session.destroy((err) => {
        res.redirect("/");
    });

})

// ===========================================================================
//  Admin Login ==============================================================
// ===========================================================================

.get("/admin/login", (req, res, next) => {

    if (req.isAuthenticated()) {
        res.redirect("/admin/dashboard");
    } else {
        res.render("admin/login");
    }

})

.get("/admin/logout", (req, res, next) => {

    req.session.destroy((err) => {
        res.redirect("/admin/login");
    });

})

//This is just to check if authentication has succeeded, no function
.get("/auth", (req, res, next) => {

    res.send({
        session: req.session,
        user: req.user,
        authenticated: req.isAuthenticated(),
    });

})

//Catches on pushing the Log In button and redirects based on authentication
// .post("/login", passport.authenticate("local", {
//   successRedirect: "auth",
//   failureRedirect: "login",
// }))

.post("/admin/login", passport.authenticate("local", { failureRedirect: "/admin/login" }), (req, res) => {

    if (!req.session.sourceURL) {
        res.redirect("/admin/dashboard");
    } else {
        res.redirect(req.session.sourceURL);
        req.session.sourceURL = "";
    }

})

// ===========================================================================
//  Sign up ==================================================================
// ===========================================================================
// This should be moved to register.js at a later stage
.get("/signup", (req, res, next) => {

    res.render("signup");

})

.post("/signup", passport.authenticate("local-register", {

    successRedirect: "auth",
    failureRedirect: "signup",

}))

// ===========================================================================
//  Sponsors Page  ===========================================================
// ===========================================================================

.get("/sponsors", (req, res) => {

    res.render("skeleton", {
        partials: {
            header: "header",
            content: "sponsors",
            footer: "footer",
            jscript: "jscript"
        }
    });

})

// ===========================================================================
//  Why Attend Page  =========================================================
// ===========================================================================

.get("/whyattend", (req, res) => {

    res.render("skeleton", {
        partials: {
            header: "header",
            content: "why_attend",
            footer: "footer",
            jscript: "jscript"
        }
    });

})

// ===========================================================================
//  Event Info Page  =========================================================
// ===========================================================================

.get("/eventinfo-old", (req, res) => {
    res.render("skeleton", {
        partials: {
            header: "header",
            content: "eventinfo",
            footer: "footer",
            jscript: "jscript"
        }
    });
})

// ===========================================================================
//  Agenda Page (Temporary) ==================================================
// ===========================================================================

.get("/eventinfo", (req, res) => {
    var myAgenda = new Agenda();

    myAgenda.fullDataset(function(result) {
        res.render("skeleton", {
            // fullDataset: result.slice(0, 3),
            dataSet1: result.slice(0, 5),
            dataSet2: result.slice(5, result.length),
            partials: {
                header: "header",
                content: "agenda",
                footer: "footer",
                jscript: "jscript",
                sessionBlock: "agenda-session-block"
            }
        });
    });
})

// ===========================================================================
//  Logistics ================================================================
// ===========================================================================

.get("/logistics", (req, res) => {
    res.render("skeleton", {
        partials: {
            header: "header",
            content: "logistics",
            footer: "footer",
            jscript: "jscript"
        }
    });
})

// ===========================================================================
//  Contact Us Page  =========================================================
// ===========================================================================

.get("/contactus", (req, res) => {
    res.render("skeleton", {
        partials: {
            header: "header",
            content: "contactus",
            footer: "footer",
            jscript: "jscript"
        }
    });
})

// ===========================================================================
//  Speakers Page  ===========================================================
// ===========================================================================

.get("/speakers", (req, res) => {
    res.render("skeleton", {
        partials: {
            header: "header",
            content: "speakers",
            footer: "footer",
            jscript: "jscript"
        }
    });
})

// ===========================================================================
//  Printing Page  ===========================================================
// ===========================================================================

.get("/print", auth.loginRequired, auth.adminRequired, (req, res) => {

    const recordCount = req.query.recordCount;
    const firstNameFilter = req.query.firstNameFilter;
    const eventProfileFilter = req.query.eventProfileFilter;

    // ?recordCount=10&fromRecord=5

    user.allUsersNotPrinted((result) => {

        res.render("print", {
            allUsers: result,
            firstNameFilter,
            eventProfileFilter,
        });

    }, recordCount || 20, firstNameFilter, eventProfileFilter);

})

// ===========================================================================
//  CXO Breakfast Page  ======================================================
// ===========================================================================

.get("/cxobreakfast/", (req, res) => {

    res.render("skeleton", {
        partials: {
            header: "header",
            content: "cxobreakfast",
            footer: "footer",
            jscript: "jscript"
        }
    });
})

// ===========================================================================
//  Edit my profile  =========================================================
// ===========================================================================

.get("/myProfile", auth.loginRequired, (req, res) => {

    res.render("skeleton", {
        user: req.user,
        partials: {
            header: "headerUser",
            content: "myProfile",
            footer: "footer",
            jscript: "jscript"
        }
    });
})

// ===========================================================================
//  Edit my profile  =========================================================
// ===========================================================================

.get("/mysessions", (req, res) => {

    agenda.fullDataset((result) => {
        res.render("skeleton", {
            dataSet1: result.slice(0, 5),
            dataSet2: result.slice(5, result.length),
            user: req.user,
            fnChecked: function() {
                return function(value) {
                    // console.log("********************");
                    console.log(value);

                    if (this.id === this.parentId) {
                        return "checked";
                    }
                    return "whoop";

                };
            },
            partials: {
                header: "headerUser",
                content: "mysessions",
                footer: "footer",
                jscript: "jscript",
                sessionBlock: "mySessionsBlock",
            }
        });

    }, req.user.id);

})

// ===========================================================================
//  Rate session  ============================================================
// ===========================================================================

.get("/rateSession/:sessionId", (req, res) => {

    const { sessionId } = req.params;

    agenda.getSession(sessionId, (sessionData) => {
        console.log(sessionData);

        res.render("rateSession", {
            title: "#DCxShowcase",
            session: sessionData
        });

    });
})

// ===========================================================================
//  Admin Pages ==============================================================
// ===========================================================================

.get("/admin", (req, res) => {

    res.redirect("/admin/login");

})

.get("/admin/dashboard", (req, res, next) => {

    let loginUser;

    if (req.user === undefined) {
        loginUser = "Visitor";
    } else {
        loginUser = req.user.first_name + ' ' + req.user.last_name;
    }

    res.render("admin/main", {
        users: "users",
        loginUser,
        title: "Dashboard",
        loggedIn: true,
        partials: {
            body: "admin/dashboard",
            jscript: "admin/jscript",
        }
    });

})

.get("/admin/delegateMain", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        users: "users",
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Delegate registrations - Verified",
        loggedIn: true,
        filter: "verified",
        partials: {
            // header: "admin/header", 
            body: "admin/delegateMain",
            jscript: "admin/jscript",
            // footer: "admin/footer", 
        }
    });
})

.get("/admin/delegateMain/:filter", auth.loginRequired, auth.adminRequired, (req, res) => {
    var { filter } = req.params;

    //Validate the filter provided. If it not valid, default to "verified" filter
    var validateFilter = (filter === "verified" || filter === "rejected" ||
        filter === "approved" || filter === "unverified" || filter === "all");
    if (validateFilter === false) {
        filter = "verified";
    }

    res.render("admin/main", {
        users: "users",
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Delegate registrations - " + _.startCase(filter),
        loggedIn: true,
        filter: filter,
        partials: {
            // header: "admin/header", 
            body: "admin/delegateMain",
            jscript: "admin/jscript",
            // footer: "admin/footer", 
        }
    });

})

.get("/admin/delegateAdd", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        users: "users",
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Delegate add",
        loggedIn: true,
        partials: {
            // header: "admin/header", 
            body: "admin/delegateAdd",
            jscript: "admin/jscript",
            // footer: "admin/footer", 
        }
    });

})

.get("/admin/delegateEdit/:id", auth.loginRequired, auth.adminRequired, (req, res) => {

    var { id } = req.params;

    res.render("admin/main", {
        users: "users",
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Delegate edit",
        userId: id,
        loggedIn: true,
        partials: {
            // header: "admin/header", 
            body: "admin/delegateEdit",
            jscript: "admin/jscript",
            // footer: "admin/footer", 
        }
    });

})

.get("/admin/sponsoredit", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        sponsors: "sponsors",
        title: "chirpee.io - Sponsor edit page",
        loggedIn: true,
        partials: {
            header: "admin/header",
            body: "sponsoredit",
            footer: "admin/footer",
        }
    });

})



// Walk-In Screen
.get("/admin/walkin", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/walkin", {
        title: "chirpee.io - Walking Registrations",
        loggedIn: true,

    });

})

// Walk-In Screen
.get("/admin/walkin2", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/walkin-old", {
        title: "chirpee.io - Walking Registrations",
        loggedIn: true,

    });

})

.get("/admin/sessionList", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Event Sessions - List",
        loggedIn: true,
        partials: {
            body: "admin/sessionList",
            jscript: "admin/jscript",
        }
    });

})

.get("/admin/sessionAdd", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Event Sessions - Add",
        loggedIn: true,
        partials: {
            body: "admin/sessionAdd",
            jscript: "admin/jscript",
        }
    });

})

.get("/admin/sessionEdit/:sessionId", auth.loginRequired, auth.adminRequired, (req, res) => {

    const { sessionId } = req.params;

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Event Sessions - Edit",
        sessionId,
        loggedIn: true,
        partials: {
            body: "admin/sessionEdit",
            jscript: "admin/jscript",
        }
    });

})

.get("/admin/speakerList", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Speakers - List",
        loggedIn: true,
        partials: {
            body: "admin/speakerList",
            jscript: "admin/jscript",
        }
    });

})

.get("/admin/speakerEdit/:id", auth.loginRequired, auth.adminRequired, (req, res) => {

    var { id } = req.params;

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Speaker edit",
        speakerId: id,
        loggedIn: true,
        partials: {
            body: "admin/speakerEdit",
            jscript: "admin/jscript",
        }
    });

})

.get("/admin/speakerAdd", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Add speaker",
        loggedIn: true,
        partials: {
            body: "admin/speakerAdd",
            jscript: "admin/jscript",
        }
    });

})

// .get("/admin/dashboard", auth.loginRequired, auth.adminRequired, (req, res) => {

//     res.render("admin/main", {
//         loginUser: req.user.first_name + " " + req.user.last_name,
//         title: "Event dashboard",
//         loggedIn: true,
//         partials: {
//             body: "admin/dashboard",
//             jscript: "admin/jscript",
//         }
//     });

// });

.get("/admin/delegateEmails", auth.loginRequired, auth.adminRequired, (req, res) => {

    res.render("admin/main", {
        loginUser: req.user.first_name + " " + req.user.last_name,
        title: "Batch - Email passwords",
        loggedIn: true,
        partials: {
            body: "admin/delegateEmails",
            jscript: "admin/jscript",
        }
    });

});


module.exports = router;