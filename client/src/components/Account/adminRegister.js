import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Form, Button, Dropdown } from 'semantic-ui-react';
import { host, appName, containerStyle } from '../../common.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';
import retrieveItems from '../quiz/retrieveItems';

class AdminRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            confirmPassword: null,
            minUsernameLength: 8,
            minPasswordLength: 8,
            roles: [],
            errors: {
                username: '',
                password: '',
                confirmPassword: '',
            },
        };
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

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post(host + '/admin/register', {
                name: this.state.username,
                password: this.state.password,
                role: this.state.role,
            })
            .then(() => {
                new Noty({
                    text: `User Created!, ${this.state.username}`,
                    type: 'success',
                    theme: 'semanticui',
                }).show();

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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
        retrieveItems('roles')
            .then((data) => {
                this.setState({ roles: data });
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong when retrieving roles. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    render() {
        const { errors } = this.state;

        const inputs = [
            { type: 'text', icon: 'user', name: 'username', placeholder: 'Username' },
            { type: 'password', icon: 'lock', name: 'password', placeholder: 'Password' },
            { type: 'password', icon: 'lock', name: 'confirmPassword', placeholder: 'Confirm Password' },
        ];

        const roleItems = [];
        for (let i = 0; i < this.state.roles.length; i++) {
            let id = this.state.roles[i].roleId;
            let name = this.state.roles[i].accountType;
            roleItems.push({ text: name, value: id });
        }

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else {
            return (
                <div className="container" style={containerStyle}>
                    <h1 className="ui teal image header">{appName}</h1>
                    <div className="ui stacked segment">
                        <Form>
                            <Dropdown
                                style={{ marginBottom: '15px' }}
                                name="role"
                                placeholder="Select a role"
                                fluid
                                selection
                                options={roleItems}
                                onChange={this.handleDropdownChange}
                            />
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
}

export default AdminRegistration;
