import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { host } from '../common.js';

// MISSING FEATURES
// 1. Input Validation
// 2. Storing of user login status in a session attribute, managed by localStorage (?)
// 3. RBAC logic not implemented

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null
            //,userLoggedIn: false
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // Incomplete session state management code
        // this.state.user = { username: this.state.username, password: this.state.password };
        // alert(this.state.user.username + this.state.user.password)

        axios.post(host + '/authenticate', {
            username: this.state.username,
            password: this.state.password
        })
            .then((response) => {

                // If response.data.data has the access token string, it means the user is authenticated, so redirect them to dashboard
                // Otherwise, response.data.data will contain the error string instead, and user will be left on the login page
                // This is a temporary workaround for authentication and will need to be modified for RBAC logic later (e.g. users, admins login)
                if (response.data.data === 'Congrats') {
                    window.location.href = '/dashboard';
                }
            })

            .catch((error) => {
                alert(error);
            });

        // // set the state of the user
        // this.setState({user: response.data});

        // // store the user in localStorage
        // localStorage.setItem('user', response.data)
        // console.log(response.data)
    }

    render() {
        const containerStyle = {
            container: {
                backgroundColor: '#DADADA',
                height: '100%'
            }
        };

        // Incomplete session state management code
        // if (this.state.userLoggedIn) {
        //     return <Redirect to="/dashboard" ></Redirect>

        // } else {
        return (
            <div className="container" style={{ containerStyle }}>
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
                            </div>
                        </form>
                        <div className="ui message">
                            New to us? <Link to="/register">Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
        // }
    }
}


export default LoginForm;