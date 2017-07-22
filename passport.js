const bcrypt = require("bcrypt-nodejs");
// const knex = require("knex");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

const db = require("./db");

passport.use(new LocalStrategy(authenticate));
passport.use("local-register", new LocalStrategy({ passReqToCallback: true }, register));

function authenticate(email, password, done) {
    
    db("users")
        .where("email", email)
        .first()
        .then((user) => {
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: "Invalid user and password combination" });
            }
            done(null, user);
        }, done);
}

function register(req, email, password, done) {
    db("users")
        .where("email", email)
        .first()
        .then((user) => {
            if (user) {
                return done(null, false, { message: "A user with that email address has already been registered." });
            }
            if (password !== req.body.password2) {
                return done(null, false, { message: "Passwords did not match." });
            }

            const newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: email,
                password: bcrypt.hashSync(password)
            };

            db("users")
                .insert(newUser)
                .then((ids) => {
                    newUser.id = ids[0];
                    done(null, newUser);
                });

        });
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db("users")
        .where("id", id)
        .first()
        .then((user) => {
            done(null, user);
        }, done);
});
