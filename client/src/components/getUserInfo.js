export default function userDetails() {
    let user = sessionStorage.getItem('user');

    return user;
}
