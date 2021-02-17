import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { host, appName, narrowContainerStyle } from '../common.js';
import verifyLogin from './verifyLogin.js';
import GuruOrGoonduIcon from '../GuruOrGoonduIcon.jpg';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';
import Validate from './validationFile';

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

        const isEmpty = Validate.validate([this.state.username, this.state.password]);
        if (isEmpty.length > 0) {
            new Noty({
                text: `Username and password fields CANNOT be empty!`,
                type: 'error',
                theme: 'semanticui',
            }).show();
            return;
        }

        axios
            .post(host + '/authenticate', {
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
                        accountType: userData.accountType,
                    };

                    sessionStorage.setItem('user', JSON.stringify(user));
                    this.setState({ redirect: '/dashboard' });
                } else {
                    new Noty({
                        text: `Incorrect username or password!`,
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                }
            })
            .catch((error) => {
                new Noty({
                    text: `Incorrect username or password! ${error}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else if (verifyLogin()) {
            return <Redirect push to="/dashboard" />;
        } else {
            return (
                <div className="container" style={narrowContainerStyle}>
                    <div className="AppIcon">
                        <img src={GuruOrGoonduIcon} alt="AppIcon" style={{ width: '100px' }} />
                    </div>
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
