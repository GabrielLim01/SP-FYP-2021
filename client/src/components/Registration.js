import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { host, appName, narrowContainerStyle } from '../common.js';
import verifyLogin from './verifyLogin.js';
import GuruOrGoonduIcon from '../GuruOrGoonduIcon.jpg'
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';
import Validate from './validationFile';

// BUGS
// 1. Registration may be successful even if the confirmPassword field is not filled in
// 2. Database may not have a record inserted successfully even if registration is successful

// TO-DO
// 1. Input validation
// Password - Alphanumeric, can consider using a regex

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            confirmPassword: null,
            minUsernameLength: 8,
            minPasswordLength: 8,
            errors: {
                username: '',
                password: '',
                confirmPassword: '',
            },
        };
        this._isMounted = false;
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        let minUsernameLength = this.state.minUsernameLength;
        let minPasswordLength = this.state.minPasswordLength;

        switch (name) {
            case 'username':
                // Add more validation rules below by chaining if...elses as necessary
                errors.username = '';
                if (value.length < minUsernameLength)
                    errors.username = `Username must be at least ${minUsernameLength} characters long!`;
                break;
            case 'password':
                errors.password = '';
                if (value.length < minPasswordLength)
                    errors.password = `Password must be at least ${minPasswordLength} characters long!`;
                break;
            case 'confirmPassword':
                errors.confirmPassword = '';
                if (value !== this.state.password) errors.confirmPassword = `Passwords do not match!`;
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const isEmpty = Validate.validate([this.state.username, this.state.password, this.state.confirmPassword]);
        if (isEmpty.length > 0) {
            new Noty({
                text: `Username, password and confirm password fields CANNOT be empty!`,
                type: 'error',
                theme: 'semanticui',
            }).show();
            return;
        }

        console.log(this.state.error);
        axios
            .post(host + '/register', {
                name: this.state.username,
                password: this.state.password,
            })
            .then((response) => {
                if (JSON.stringify(response.data).includes('ER_DUP_ENTRY')) {
                    new Noty({
                        text: `There is already an existing account called ${this.state.username}. Please choose a different name.`,
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                } else {
                    if (response.status === 200) {
                        new Noty({
                            text: `${this.state.username} created!`,
                            type: 'success',
                            theme: 'semanticui',
                        }).show();

                        setTimeout(() => {
                            if (this._isMounted) this.setState({ redirect: '/' });
                        }, 1500);
                    } else {
                        new Noty({
                            text: 'Something went wrong.',
                            type: 'error',
                            theme: 'semanticui',
                        }).show();
                    }
                }
            })
            .catch((error) => {
                new Noty({
                    text: `Something went wrong. ${error}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { errors } = this.state;

        const inputs = [
            { type: 'text', icon: 'user', name: 'username', placeholder: 'Username' },
            { type: 'password', icon: 'lock', name: 'password', placeholder: 'Password' },
            { type: 'password', icon: 'lock', name: 'confirmPassword', placeholder: 'Confirm Password' },
        ];

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else if (verifyLogin()) {
            return <Redirect push to="/dashboard" />;
        }
        return (
            <div className="container" style={narrowContainerStyle}>
                <div className="AppIcon">
                    <img src={GuruOrGoonduIcon} alt="AppIcon" style={{ width: '100px' }} />
                </div>
                <h1 className="ui teal image header">{appName}</h1>
                <div className="ui stacked segment">
                    <Form>
                        {inputs.map((value, index) => {
                            return (
                                <div className="field" key={index}>
                                    <div className="ui left icon input">
                                        <i className={value.icon + ' icon'}></i>
                                        <input
                                            type={value.type}
                                            name={value.name}
                                            placeholder={value.placeholder}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    {errors[value.name].length > 0 && (
                                        <span style={{ color: 'red' }}>{errors[value.name]}</span>
                                    )}
                                </div>
                            );
                        })}
                        <Button className="fluid large teal" onClick={this.handleSubmit}>
                            Register
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Registration;
