import { inProduction } from '../common.js';

export default function verifyLogin() {
    let loginStatus = false;

    if (inProduction) {
        loginStatus = true;
    }
    else if (sessionStorage.getItem("user") !== null) {
        loginStatus = true;
    }

    return loginStatus;
}