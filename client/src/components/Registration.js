import React from 'react';
import axios from 'axios';
import { Form } from 'semantic-ui-react';
import { host, appName, containerStyle } from '../common.js';

// BUGS 
// 1. Registration may be successful even if the confirmPassword field is not filled in
// 2. Database may not have a record inserted successfully even if registration is successful

// MISSING FEATURES
// 1. Additional input fields (Role, Age Group) and appropriate validation
// 2. Possible validation rules as follows
// Role/Age Group - Dropdown (so no client-side validation)
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
            }
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
                if (value.length < minUsernameLength) errors.username = `Username must be at least ${minUsernameLength} characters long!`;
                break;
            case 'password':
                errors.password = '';
                if (value.length < minPasswordLength) errors.password = `Password must be at least ${minPasswordLength} characters long!`;
                break;
            case 'confirmPassword':
                errors.confirmPassword = '';
                if (value !== this.state.password) errors.confirmPassword = `Passwords do not match!`;
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        axios.post(host + '/register', {
            name: this.state.username,
            password: this.state.password
        })
            .then((result) => {
                alert("Success!");
                window.location.href = "/"
            })
            .catch((error) => {
                alert(error)
            });
    }

    render() {
        const { errors } = this.state;

        const inputs = [
            { type: 'text', icon: 'user', name: 'username', placeholder: 'Username' },
            { type: 'password', icon: 'lock', name: 'password', placeholder: 'Password' },
            { type: 'password', icon: 'lock', name: 'confirmPassword', placeholder: 'Confirm Password' }
        ];

        return (
            <div className="container" style={containerStyle}>
                <h1 className="ui teal image header">{appName}</h1>
                <div className="ui stacked segment">
                    <Form>
                        {inputs.map((value, index) => {
                            return (
                                <div className="field" key={index}>
                                    <div className="ui left icon input">
                                        <i className={value.icon + " icon"}></i>
                                        <input type={value.type} name={value.name} placeholder={value.placeholder} onChange={this.handleChange} />
                                    </div>
                                    {errors[value.name].length > 0 && <span style={{ color: 'red' }}>{errors[value.name]}</span>}
                                </div>
                            )
                        })}
                        <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Register</div>
                    </Form>
                </div>
            </div>
        );
    }
}


export default Registration;