import React from 'react';
// import { Link } from "react-router-dom";
import { Link, Redirect } from 'react-router-dom';
// import { Form, Button } from "semantic-ui-react";
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';

class CategoryDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryArray: [
                {
                    id: 1,
                    label: 'Technology',
                    desc: '',
                },
                { id: 2, label: 'Lifestyle', desc: '' },
                { id: 3, label: 'Finance', desc: '' },
            ],
            redirect: false,
        };
    }

    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/category/create" />;
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
                            <h1>Available Categories</h1>
                            <button class="ui primary button" onClick={this.redirectHandler}>
                                Create New<i class="right wrench icon"></i>
                            </button>
                            {this.renderRedirect()}
                        </div>
                        <div className="ui stacked segment">
                            {this.state.categoryArray.map((category) => (
                                <div class="ui label">
                                    <a class="ui huge label">
                                        <Link
                                            to={{
                                                pathname: `update/${category.id}`,
                                                category: category,
                                            }}
                                        >
                                            {category.label}
                                        </Link>
                                        <i class="delete icon"></i>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default CategoryDashboard;
