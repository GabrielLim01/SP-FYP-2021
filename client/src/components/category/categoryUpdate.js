import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import validateCat from './validation.js';
import { host } from '../../common.js';
import retrieveItems from '../retrieveItems.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class CategoryUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            redirect: false,
            categoryName: '',
            categoryDesc: '',
            errors: [],
        };
    }

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

        const errors = validateCat(category.name);
        if (errors.length > 0) {
            this.setState({ errors });
            return;
        }

        const result = axios.patch(`${host}/category/${this.state.category.categoryId}`, {
            category: category,
        });

        result
            .then((response) => {
                if (response.status === 200) {
                    new Noty({
                        text: `Category Updated: ${category.name}`,
                        type: 'success',
                        theme: 'semanticui',
                    }).show();
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

    componentDidMount() {
        if (this.props.location.category !== undefined) {
            let category = this.props.location.category;
            this.setState({ category: category }, () => {
                this.setState({
                    categoryName: this.state.category.categoryName,
                    categoryDesc: this.state.category.categoryDesc,
                });
            });
        } else {
            let categoryID = parseInt(window.location.href.split('/').pop());

            retrieveItems(`category/${categoryID}`)
                .then((data) => {
                    if (data.length !== 0) {
                        this.setState({ category: data[0] });
                    } else {
                        alert('No such category exists!');
                        this.setState({ redirect: '/dashboard' });
                    }
                })
                .catch((error) => {
                    alert(error);
                    this.setState({ redirect: '/dashboard' });
                });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        } else if (this.state.category !== undefined) {
            const { errors } = this.state;
            return (
                <div className="container">
                    <DashboardMenu page="category"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1>Category: {this.state.category.categoryName}</h1>
                        </div>

                        {errors.map((error) => (
                            <p style={{ color: 'red' }} key={error}>
                                Error: {error}
                            </p>
                        ))}
                        <div className="ui stacked segment" style={{ textAlign: 'left' }}>
                            <form className="ui form">
                                <div className="field">
                                    <div className="required field">
                                        <label>Category Name</label>
                                        <input
                                            defaultValue={this.state.category.categoryName}
                                            name="categoryName"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Category Description</label>
                                    <textarea
                                        defaultValue={this.state.category.categoryDesc}
                                        rows="3"
                                        name="categoryDesc"
                                        onChange={this.handleChange}
                                    ></textarea>
                                </div>
                                <div className="field" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <button type="submit" className="ui primary button" onClick={this.handleSubmit}>
                                        Update<i aria-hidden="true" className="right edit icon"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="ui button"
                                        onClick={() => this.setState({ redirect: '/category' })}
                                    >
                                        Back
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default CategoryUpdate;
