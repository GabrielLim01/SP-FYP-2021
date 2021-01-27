// ES5 import statement (this entire file is ES5, import .. from '..' is ES6 syntax)
const axios = require('axios');

// Used in Login, Registration, and DashboardMenu.js
module.exports.appName = 'Guru or Goondu';

// Used in components that make axios calls
module.exports.host = 'http://localhost:9000';

// Used in Profile,js, QuizPlay.js, DashboardMenu.js,  ProtectedRoute.js and verifyLogin.js
module.exports.inProduction = false;

// If the application is in production (i.e. set to true), the following features are available:
// -Prevents the need to login
// -Account status will be set to Admin (i.e. user will be able to access the Account Management Console)
// -FIQ will be set to 0, user can still earn FIQ (e.g. from quizzes) as per normal but FIQ gain will not be tracked

// Used in most components
module.exports.containerStyle = {
    maxWidth: '70%',
    margin: 'auto',
    paddingTop: '100px',
};

// Used in components dealing with RBAC logic
module.exports.adminAccountType = 1;
module.exports.defaultAccountType = 2;

module.exports.updateFIQ = (state) => {
    if (!module.exports.inProduction) {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let newFIQ = user.FIQ + state;

        axios.patch(`${module.exports.host}/fiq/${user.id}`, { FIQ: newFIQ })
            .then(() => {
                user.FIQ = newFIQ;
                sessionStorage.setItem("user", JSON.stringify(user));
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
