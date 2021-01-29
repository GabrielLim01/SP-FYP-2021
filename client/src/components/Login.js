import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { host, appName, containerStyle } from '../common.js';
import verifyLogin from './verifyLogin.js';

// TO-DO
// 1. Input validation

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            redirect: null,
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        axios.post(host + '/authenticate', {
            username: this.state.username,
            password: this.state.password,
        })
            .then((response) => {
                if (response.data.token === 'Congrats') {
                    let userData = response.data.user[0];

                    let user = {
                        id: userData.insertId,
                        username: userData.name,
                        ageGroupId: userData.ageGroupId,
                        hobby: userData.hobby,
                        FIQ: userData.FIQ,
                        accountType: userData.accountType
                    }

                    sessionStorage.setItem("user", JSON.stringify(user));
                    this.setState({ redirect: "/dashboard" });
                } else {
                    alert('Error: ' + response.data);
                }
            })
            .catch((error) => {
                alert(error);
            });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />
        } else if (verifyLogin()) {
            return (
                <Redirect push to='/dashboard' />
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
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <Button className="fluid large teal" onClick={this.handleSubmit}>
                                Login
                            </Button>
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