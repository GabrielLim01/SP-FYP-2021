import React from 'react';
import axios from 'axios';
import { minUsernameLength, minPasswordLength, host } from '../common.js';

// BUG - Registration will proceed even if confirmPassword field is not filled in

// MISSING FEATURES
// 1. Additional input fields (Role, Age Group, Email) and appropriate validation
// 2. Possible validation rules as follows
// Role/Age Group - Dropdown (so no client-side validation)
// Email - Some regex that validates the input to 'resemble an actual email'
// Password - Alphanumeric, can consider regex as well

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            confirmPassword: null,
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

        switch (name) {
            case 'username':
                // Add more validation rules below by chaining if...elses as necessary
                errors.username = '';
                if (value.length < minUsernameLength) errors.username = 'Username must be 8 characters long!';
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

        axios.post(host + '/user', {
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

        const containerStyle = {
            container: {
                backgroundColor: '#DADADA',
                height: '100%'
            }
        };

        return (
            <div className="container" style={containerStyle}>
                <div className="ui middle aligned center aligned grid">
                    <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                        <h1 className="ui teal image header">
                            <div className="content">
                                Guru or Goondu
                        </div>
                        </h1>
                        <form className="ui large form">
                            <div className="ui stacked segment">
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="user icon"></i>
                                        <input type="text" name="username" placeholder="Username" onChange={this.handleChange} noValidate />
                                    </div>
                                    {errors.username.length > 0 && <span className='error' style={{ color: 'red' }}>{errors.username}</span>}
                                </div>
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="lock icon"></i>
                                        <input type="password" name="password" placeholder="Password" onChange={this.handleChange} noValidate />
                                    </div>
                                    {errors.password.length > 0 && <span className='error' style={{ color: 'red' }}>{errors.password}</span>}
                                </div>
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="lock icon"></i>
                                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={this.handleChange} noValidate />
                                    </div>
                                    {errors.confirmPassword.length > 0 && <span className='error' style={{ color: 'red' }}>{errors.confirmPassword}</span>}
                                </div>
                                <div className="ui fluid large teal submit button" onClick={this.handleSubmit} noValidate>Register</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default Registration;