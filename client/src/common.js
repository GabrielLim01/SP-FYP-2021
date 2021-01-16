// Used in Login, Registration, and DashboardMenu.js
module.exports.appName = 'Guru or Goondu';

// Used in components that make axios calls
module.exports.host = 'http://localhost:9000';

// Used in DashboardMenu.js,  ProtectedRoute.js and verifyLogin.js
module.exports.inProduction = false;

// If the application is in production (i.e. set to true), the following features are available:
// -Prevents the need to login
// -Account status will be set to Admin, user will be able to access the Account Management Console
// -FIQ will be set to 0, user can still earn FIQ as per normal but FIQ will not be saved after logging out/closing the application

// Used in most components
module.exports.containerStyle = {
    maxWidth: '70%',
    margin: 'auto',
    paddingTop: '100px',
};

// Used in components dealing with RBAC logic
module.exports.adminAccountType = 1;
module.exports.defaultAccountType = 2;