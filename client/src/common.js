
// Used in Login and Registration.js
module.exports.containerStyle = {
    container: {
        backgroundColor: '#DADADA',
        height: '100%'
    }
};

// Used in Registration.js
module.exports.minUsernameLength = 8;
module.exports.minPasswordLength = 8;

// Used in components that make axios calls
module.exports.host = 'http://localhost:9000';

// Used in verifyLogin.js
module.exports.inProduction = true;

// Used in DashboardMenu.js
module.exports.menuItems = [
    { name: 'home', path: 'dashboard'},
    { name: 'quizzes', path: 'quizzes'},
    { name: 'quests', path: 'quests'}
];