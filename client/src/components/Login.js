import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Form } from 'semantic-ui-react';
import { host, appName, containerStyle } from '../common.js';
import verifyLogin from './verifyLogin.js';

// MISSING FEATURES
// 1. Input validation
// 2. RBAC logic not implemented

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            isLoggedIn: false
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        axios.post(host + '/authenticate', {
            username: this.state.username,
            password: this.state.password
        })
            .then((response) => {
                if (response.data === 'Congrats') {
                    let user = { username: this.state.username, isLoggedIn: true }
                    sessionStorage.setItem("user", JSON.stringify(user));
                    window.location.href = '/dashboard';
                } else {
                    alert("Error: " + response.data);
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    render() {
        if (verifyLogin()) {
            return (
                window.location.href = '/dashboard'
            )
        } else {
            return (
                <div className="container" style={containerStyle}>
                    <h1 className="ui teal image header">{appName}</h1>
                    <div className="ui stacked segment">
                        <Form>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon"></i>
                                    <input type="text" name="username" placeholder="Username" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Login</div>
                        </Form>
                    </div>
                    <div className="ui message">
                        New to us? <Link to="/register">Sign up</Link>
                    </div>
                </div>
            );
        }
    }
}

export default Login;