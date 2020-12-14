import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
import { host, containerStyle } from '../common.js';
import verifyLogin from './verifyLogin.js'
=======
import { host } from '../common.js';
import GuruOrGoonduIcon from '../GuruOrGoonduIcon.jpg'


>>>>>>> Stashed changes

// MISSING FEATURES
// 1. Input validation
// 2. RBAC logic not implemented

// POSSIBLE ISSUES
// 1. Break down mutable 'user' object into immutable data types, e.g. 'username'and 'userLoggedIn'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: null,
            user: {
                name: null,
                isLoggedIn: false
            }
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log(this.state.password)

        axios.post(host + '/authenticate', {
            username: this.state.name,
            password: this.state.password
        })
            .then((response) => {

                // If response.data.data has an access token string, it means the user is authenticated
                // Otherwise, response.data.data will contain an error string instead, and the user will be left on the login page
                // This is a temporary workaround for authentication and will need to be modified for RBAC logic later (e.g. regular users, admins)
                if (response.data.data === 'Congrats') {

                    // this.setState under the handleChange() does not permanently save the state of the this.state.name value,
                    // so it has to be re-set here
                    let user = { user: { isLoggedIn: true, name: this.state.name } }

                    // sessionStorage can only save strings, so convert the JSON object into strings first
                    sessionStorage.setItem("user", JSON.stringify(user));

                    // Redirect the user to dashboard when successful
                    window.location.href = '/dashboard';
                } else {
                    alert("Error: " + response.data.data)
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    render() {
<<<<<<< Updated upstream
        // If user is already logged in, redirect them immediately, otherwise they have to fill in the login form first
        if (verifyLogin()) {
=======
        const containerStyle = {
            container: {
                
                backgroundColor: '#DADADA',
                height: '100%'
            }
        };

        // Logic to check if user is already logged in
        let user = {};
        let loginStatus = false;
    
        if (JSON.parse(sessionStorage.getItem("user") !== null)) {
            user = JSON.parse(sessionStorage.getItem("user"));
            loginStatus = user.user.isLoggedIn;
        }

        // If user is already logged in, redirect them immediately, else they have to fill out the login form first
        if (loginStatus) {
>>>>>>> Stashed changes
            return (
                window.location.href = '/dashboard'
            )
        } else {
            return (
                <div className="container" style={containerStyle}>
                    <div className="ui middle aligned center aligned grid">
                        <div className="column" style={{ maxWidth: '450px' }}>
                            <h2 className="ui teal image header">
                                
                                 <div className="AppIcon">
                                 <img src={GuruOrGoonduIcon} alt="AppIcon"/>
                                 </div>

                                <div className="content">
                                    Guru or Goondu
                        </div>
                            </h2>
                            <form className="ui large form">
                                <div className="ui stacked segment">
                                    <div className="field">
                                        <div className="ui left icon input">
                                            <i className="user icon"></i>
                                            <input type="text" name="name" placeholder="Username" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui left icon input">
                                            <i className="lock icon"></i>
                                            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Login</div>
                                </div>
                            </form>
                            <div className="ui message">
                                New to us? <Link to="/register">Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}


export default Login;