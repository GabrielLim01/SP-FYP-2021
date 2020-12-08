import React from 'react';
import axios from 'axios';
import { minUsernameLength, minPasswordLength, host } from '../common.js';

// BUG - Registration will proceed even if confirmPassword field is not filled in

class RegistrationForm extends React.Component {
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

        // Not sure how to add more rules per case yet
        switch (name) {
            case 'userName':
                errors.username =
                    value.length < minUsernameLength
                        ? `Username must be at least ${minUsernameLength} characters long!`
                        : '';
                break;
            case 'password':
                errors.password =
                    value.length < minPasswordLength
                        ? `Password must be at least ${minPasswordLength} characters long!`
                        : '';
                break;
            case 'confirmPassword':
                errors.confirmPassword =
                    value !== this.state.password
                        ? `Passwords do not match!`
                        : '';
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
                    <div className="column" style={{ maxWidth: '450px' }}>
                        <h2 className="ui teal image header">
                            <div className="content">
                                Guru or Goondu
                        </div>
                        </h2>
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


export default RegistrationForm;