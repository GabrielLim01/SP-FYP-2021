import { inProduction } from '../common.js';

export default function verifyLogin() {
    let loginStatus = false;

    if (inProduction) {
        loginStatus = true;
    }
    else if (sessionStorage.getItem("user") !== null) {
        loginStatus = JSON.parse(sessionStorage.getItem("user")).isLoggedIn;
    }

    return loginStatus;
}