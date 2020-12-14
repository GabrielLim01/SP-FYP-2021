import React from 'react';
import axios from 'axios';
import { minUsernameLength, minPasswordLength, host } from '../common.js';
import GuruOrGoonduIcon from '../GuruOrGoonduIcon.jpg'

// BUGS 
// 1. Registration will proceed even if confirmPassword field is not filled in
// 2. Error messages for each input field will default to display an error for 'username' since I cannot figure out
// how to insert the dynamic value.name property in the middle of the errors object properties

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
            { type: 'text', icon: 'user icon', name: 'username', placeholder: 'Username' },
            { type: 'password', icon: 'lock icon', name: 'password', placeholder: 'Password' },
            { type: 'password', icon: 'lock icon', name: 'confirmPassword', placeholder: 'Confirm Password' }
        ];

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
                                {inputs.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <div className="ui left icon input">
                                                <i className={value.icon}></i>
                                                <input type={value.type} name={value.name} placeholder={value.placeholder} onChange={this.handleChange} />
                                            </div>
                                            {errors[value.name].length > 0 && <span className='error' style={{ color: 'red' }}>{errors[value.name]}</span>}
                                        </div>
                                    )
                                })}
                                <div className="ui fluid large teal submit button" onClick={this.handleSubmit}>Register</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default Registration;