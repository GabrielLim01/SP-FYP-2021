import axios from 'axios';
import React from 'react';
// import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import { host } from '../../common.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class CategoryCreate extends React.Component {
    state = {
        redirect: false,
        categoryName: '',
        categoryDesc: '',
    };
    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/category" />;
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let category = {
            name: this.state.categoryName,
            description: this.state.categoryDesc,
        };

        const result = axios.post(`${host}/category`, {
            category: category,
        });

        result
            .then((response) => {
                if (response.status === 200) {
                    new Noty({
                        text: `Category Created: ${category.name}`,
                        type: 'success',
                        theme: 'semanticui',
                    }).show();

                    // set timeout to 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    new Noty({
                        text: 'Something went wrong.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                }
            })
            .catch((err) => {
                new Noty({
                    text: 'Something went wrong.',
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
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
                                        <input
                                            placeholder="Category Name"
                                            name="categoryName"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Category Description</label>
                                    <textarea
                                        placeholder="Category Description.."
                                        rows="3"
                                        name="categoryDesc"
                                        onChange={this.handleChange}
                                    ></textarea>
                                </div>
                                <div className="field" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <button type="submit" className="ui primary button" onClick={this.handleSubmit}>
                                        Create<i aria-hidden="true" className="right pencil icon"></i>
                                    </button>
                                    <button type="button" className="ui button" onClick={this.redirectHandler}>
                                        Back {this.renderRedirect()}
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

export default CategoryCreate;
