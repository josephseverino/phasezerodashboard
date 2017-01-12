(function(){
    angular.module('app.auth', [])
        .controller('app.auth.controller', Auth)

    Auth.$inject = ['$http'];

    function Auth($http) { // window.Auth
        console.info('Auth controller loaded!');

        var auth = this,
            alertError = ['alert','alert-danger'];
        auth.payload = {};

        auth.login = {
            // happens when the user clicks submit on the login form
            submit: function($event) { // click-event
                console.info('auth.login.submit', $event);

                $http.post('/login', auth.payload)
                    .then(auth.login.success, auth.login.error);
                    console.log('it worked')
                    // brandon reminds you, that a wiffle bat will strike you if you forget your error callback!
            },
            success: function(res) { // server response callback
                location.replace('/dashboard');
                console.log('it worked')
            },
            error: function(err) {
                console.error('Login.error', err);

                // user feedback stuffs, sets up the alert box on error
                auth.login.alert = alertError;
                auth.login.message = ( err.data && err.data.message ) || 'Login failed, contact us!';
            }
        };

        auth.register = {
            submit: function () {
                // happens when the user clicks submit on the register form
                $http.post('/register', auth.payload)
                    .then(auth.register.success, auth.register.error);
            },
            success: function() {
                console.log('Auth register success')
                // when register is successful, just redirect them into the dashboard (already logged in)
                // location.href = "/dashboard";
                location.replace('/dashboard');
            },
            error: function(err) {
                console.error('auth.register.error', err);

                // user feedback stuffs, sets up the alert box on error
                auth.register.alert = alertError;
                auth.register.message = ( err.data && err.data.message ) || 'Register failed, contact us!'
            }
        };
    }
})();
