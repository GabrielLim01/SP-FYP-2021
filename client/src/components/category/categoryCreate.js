import React from 'react';
// import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
// import { Form, Button } from "semantic-ui-react";
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';

class CategoryCreate extends React.Component {
    state = {
        redirect: false,
    };
    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/category/all" />;
        }
    };

    render() {
        if (!verifyLogin()) {
            return <h1>403 Forbidden</h1>;
        } else {
            return (
                <div className="container" style={{ textAlign: 'left' }}>
                    <DashboardMenu page="quizzes"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1>Create New Category</h1>
                        </div>
                        <div className="ui stacked segment">
                            <form className="ui form">
                                <div className="field">
                                    <div className="required field">
                                        <label>Category Name</label>
                                        <input placeholder="Category Name" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Category Description</label>
                                    <textarea placeholder="Category Description.." rows="3"></textarea>
                                </div>
                                <div className="field" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <button type="submit" className="ui primary button">
                                        Create<i aria-hidden="true" className="right pencil icon"></i>
                                    </button>
                                    <button type="submit" className="ui button" onClick={this.redirectHandler}>
                                        Back
                                    </button>
                                    {this.renderRedirect()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default CategoryCreate;
