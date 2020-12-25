import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
// import { Form, Button } from "semantic-ui-react";
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import retrieveItems from '../quiz/retrieveItems';
import Modal from './deleteModal.js';

class CategoryDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            items: [],
            hasItems: true,
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

    generateItems() {
        retrieveItems(`category`)
            .then((data) => {
                if (data !== undefined) {
                    let category = [];

                    data.forEach((element) => {
                        category.push(element);
                    });

                    this.setState({ items: category });
                } else {
                    this.setState({ hasItems: false });
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    componentDidMount() {
        this.generateItems();
    }

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
                            <button className="ui primary button" onClick={this.redirectHandler}>
                                Create New<i className="right wrench icon"></i>
                            </button>
                            {this.renderRedirect()}
                        </div>
                        <div className="ui stacked segment" style={{ overflow: 'hidden' }}>
                            {this.state.items.map((value, index) => {
                                return (
                                    <div className="field" key={index} style={{ float: 'left', margin: '5px 5px' }}>
                                        <div className="ui huge label" style={{ marginLeft: '8px' }}>
                                            <Link
                                                to={{
                                                    pathname: `update/${JSON.stringify(value.categoryId)}`,
                                                    category: value,
                                                }}
                                            >
                                                {value.categoryName}
                                            </Link>
                                            <Modal category={value}></Modal>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default CategoryDashboard;
