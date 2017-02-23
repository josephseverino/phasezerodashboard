var User = require('../models/user'),

    request = require('request'),
    bcrypt = require('bcryptjs'),
    errors = {
        general: {
            status: 500,
            message: 'Backend Error'
        },
        login: {
            status: 403,
            message: 'Invalid username or password.'
        }
    };

module.exports = {
    render: (req, res) => { // render the login page
        res.render('auth.html', req.session);
    },
    logout: (req, res) => {
        req.session.user = null;
        res.redirect('/login');
    },
    login: (req, res) => { // form post submission
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                console.error('MongoDB error:'.red, err);
                res.status(500).json(errors.general);
            }
            if (!user) {
                // forbidden
                console.warn('No user found!'.yellow);
                res.status(403).json(errors.login);
            } else {
                console.info('auth.login.user', user);
                // at this point, user.password is hashed!
                bcrypt.compare(req.body.password, user.password, (bcryptErr, matched) => {
                    // matched will be === true || false
                    if (bcryptErr) {
                        console.error('MongoDB error:'.red, err);
                        res.status(500).json(errors.general);
                    } else if (!matched) {
                        // forbidden, bad password
                        console.warn('Password did not match!'.yellow);
                        res.status(403).json(errors.login);
                    } else {
                        req.session.user = user; // this is what keeps our user session on the backend!
                        delete user.password; // just for securty, delete the password before sending it to the front-end;
                        // res.json(user);
                        res.send({
                            message: 'Login success'
                        });
                    }
                });
            }
        });
    },
    register: (req, res) => {
        console.info('Register payload:'.cyan, req.body);

        var newUser = new User(req.body);

        newUser.save((err, user) => {
            if (err) {
                console.log('#ERROR#'.red, 'Could not save new user :(', err);
                res.status(500).send(errors.general);
            } else {
                console.log('New user created in MongoDB:', user);
                req.session.user = user;
                res.send(user);
            }
        });
    },
    grabAcledData: (req, res) => {
        var endpoint = `http://acleddata.com/api/acled/read?country=${req.query.countryName}&limit=0`;

        request(endpoint, (error, response, body) => {
            if (error) {
                res.status(500).send({
                    message: 'Something is not working with consuming the Acled API'
                })
            } else {
                res.send(body);
            }
        });
    },
    // ingestAcled: (req, res) => {
    //     console.info('Register payload:'.cyan, req.body);
    //
    //     var newAcled = new Acled(req.body);
    //
    //     newAcled.save((err, Acled) => {
    //         if (err) {
    //             console.log('#ERROR#'.red, 'Could not save new Acled :(', err);
    //             res.status(500).send(errors.general);
    //         } else {
    //             console.log('New Acled created in MongoDB:', Acled);
    //             // req.session.AcledId = Acled._id;
    //             // res.end();
    //         }
    //     });
    // },
    // Auth middleware functions, grouped
    middlewares: {
        session: (req, res, next) => {
            if (req.session.user) {
                console.info('User is logged in, proceeding to dashboard...'.green);
                next();
            } else {
                console.warn('User is not logged in!'.yellow)
                res.redirect('/login');
            }
        }
    }
}
