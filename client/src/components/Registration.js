import React from 'react';
import { Link } from "react-router-dom";

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        // if we have an error string set valid to false
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: null,
            password: null,
            confirmPassowrd: null,
            errors: {
                userName: '',
                password: '',
                confirmPassword: '',
            }
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;

        // not sure how to add more rules per case yet
        // need to add a rule to match confirmPassword to password input, and special characters validation rules
        switch (name) {
            case 'userName':
                errors.userName =
                    value.length < 3
                        ? 'Username must be at least 3 characters long!'
                        : '';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be at least 8 characters long!'
                        : '';
                break;
            case 'confirmPassword':
                errors.confirmPassword =
                    value.length < 8
                        ? 'Password must be at least 8 characters long!'
                        : '';
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm(this.state.errors)) {
            console.info('Valid Form')
        } else {
            console.error('Invalid Form')
        }
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
                                        <input type="text" name="userName" placeholder="Username" onChange={this.handleChange} noValidate />
                                    </div>
                                    {errors.userName.length > 0 && <span className='error' style={{ color: 'red' }}>{errors.userName}</span>}
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