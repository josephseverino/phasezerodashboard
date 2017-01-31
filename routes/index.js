var Auth = require('./auth'),
    User = require('../models/user'),
    Acled = require('../models/ACLED');

module.exports = (app) => {
    app.get('/', (req,res) => { // if needed, break this out into a controller!
        res.render('home.html');
    });
    app.get('/sample', (req,res) => {
      res.render('nigeria_trends.html');
    });
    app.get('/color_bars', (req,res) => {
      res.render('nigeria_colorbars.html');
    });
    app.get('/data', (req,res) => {
      res.render('brief_data.html');
    });
    app.get('/dash', (req,res) => {
      res.render('dashboard2.html');
    });
    // Consume ACLED API
    app.get('/api/ACLED', Auth.grabAcledData);
    app.post('/ACLEDData', Auth.ingestAcled);
    app.get('/login', Auth.render);        // login page
    app.get('/logout', Auth.logout);        // logout route + redirect
    app.post('/login', Auth.login);         // login form submission
    app.post('/register', Auth.register);   // register form submission

    app.get('/api/me',  (req, res) => {
        // Send down the logged in user
        res.send({user:req.session})
    });

    app.all('/dashboard', Auth.middlewares.session);
    app.get('/dashboard', (req, res) => { // if needed, break this out into a controller!
        res.render('dashboard.html', req.session);
    });
};
