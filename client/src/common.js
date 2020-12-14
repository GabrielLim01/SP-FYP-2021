// Used in Login and Registration.js
module.exports.appName = "Guru or Goondu";
module.exports.containerStyle = {
    maxWidth: '25%', 
    margin: 'auto', 
    paddingTop: '100px'
};

// Used in components that make axios calls
module.exports.host = 'http://localhost:9000';

// Used in verifyLogin.js
module.exports.inProduction = false;

// Used in DashboardMenu.js
module.exports.menuItems = [
    { name: 'home', path: 'dashboard'},
    { name: 'quizzes', path: 'quizzes'},
    { name: 'quests', path: 'quests'}
];