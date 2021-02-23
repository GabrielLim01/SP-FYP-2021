const axios = require('axios');

module.exports.appName = 'Guru or Goondu';

module.exports.host = 'http://localhost:9000';

module.exports.inProduction = false;

module.exports.narrowContainerStyle = {
    maxWidth: '30%',
    margin: 'auto',
    paddingTop: '100px',
};

module.exports.containerStyle = {
    maxWidth: '70%',
    margin: 'auto',
    paddingTop: '100px',
};

module.exports.adminAccountType = 1;
module.exports.defaultAccountType = 2;

// module.exports.updateFIQ = (state) => {
//     if (!module.exports.inProduction) {
//         let user = JSON.parse(sessionStorage.getItem('user'));
//         let newFIQ = user.FIQ + state;

//         axios
//             .patch(`${module.exports.host}/fiq/${user.id}`, { FIQ: newFIQ })
//             .then(() => {
//                 user.FIQ = newFIQ;
//                 sessionStorage.setItem('user', JSON.stringify(user));
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }
// };

module.exports.getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
};
