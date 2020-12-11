import { inProduction } from '../common.js';

// Function to check if user is already logged in or not

export default function verifyLogin() {
    let loginStatus = false;

    if (inProduction) {
        loginStatus = true;
    }
    else if (sessionStorage.getItem("user") !== null) {
        loginStatus = JSON.parse(sessionStorage.getItem("user")).user.isLoggedIn;
    }

    return loginStatus;
}