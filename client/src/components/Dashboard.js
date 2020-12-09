import React from 'react';

class Dashboard extends React.Component {

    handleSubmit = (event) => {
        event.preventDefault();

        localStorage.removeItem("user")
        window.location.href = '/'
    }

    render() {
        // Logic to check if user is already logged in
        let user = {};
        let loginStatus = false;

        if (JSON.parse(localStorage.getItem("user") !== null)) {
            user = JSON.parse(localStorage.getItem("user"));
            loginStatus = user.user.isLoggedIn;
        }

        if (loginStatus) {
            return (
                <div className="container">
                    <div className="ui middle aligned center aligned grid">
                        <div className="column" style={{ maxWidth: '450px' }}>
                            <h1>Welcome, {user.user.name}!</h1>
                            <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Logout</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <h1>403 Forbidden</h1>
            )
        }
    }
}


export default Dashboard;