import React from 'react';
import { Link } from "react-router-dom";

class LoginForm extends React.Component {
    render() {
        const containerStyle = {
            container: {
                backgroundColor: '#DADADA',
                height: '100%'
            }
        };

        let adminDialogBox = '';
        if (window.location.pathname !== '/admin') {
            adminDialogBox = <div className="ui message"><Link to="/admin">Login as an Administrator</Link></div>;
        } else {
            adminDialogBox = <div className="ui message"><Link to="/">Login as a User</Link></div>;
        }

        return (
            <div className="container" style={{containerStyle}}>
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
                                        <input type="text" name="username" placeholder="Username" />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="lock icon"></i>
                                        <input type="password" name="password" placeholder="Password" />
                                    </div>
                                </div>
                                <div className="ui fluid large teal submit button">Login</div>
                            </div>
                        </form>
                        <div className="ui message">
                            New to us? <Link to="/register">Sign up</Link>
                        </div>
                        {adminDialogBox}
                    </div>
                </div>
            </div>
        );
    }
}


export default LoginForm;