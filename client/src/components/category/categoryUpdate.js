import React from 'react';
// import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
// import { Form, Button } from "semantic-ui-react";
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';

class CategoryUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            redirect: false,
        };
    }
    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/category/all" />;
        }
    };

    componentDidMount() {
        if (this.props.location.category !== null) {
            let category = this.props.location.category;
            this.setState({ category: category });
        } else {
            this.setState({ redirect: '/category/all' });
        }
    }

    render() {
        if (!verifyLogin()) {
            return <h1>403 Forbidden</h1>;
        } else {
            return (
                <div className="container">
                    <DashboardMenu page="quizzes"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Category: {this.state.category.categoryName}</h1>
                        <div className="ui stacked segment" style={{ textAlign: 'left' }}>
                            <form className="ui form">
                                <div className="field">
                                    <div className="required field">
                                        <label>Category Name</label>
                                        <input placeholder="Category Name" value={this.state.category.categoryName} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Category Description</label>
                                    <textarea
                                        placeholder="Category Description.."
                                        rows="3"
                                        value={this.state.category.categoryDesc}
                                    ></textarea>
                                </div>
                                <div className="field" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <button type="submit" className="ui primary button">
                                        Update<i aria-hidden="true" className="right edit icon"></i>
                                    </button>
                                    <button type="button" className="ui button" onClick={this.redirectHandler}>
                                        Back{this.renderRedirect()}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default CategoryUpdate;
