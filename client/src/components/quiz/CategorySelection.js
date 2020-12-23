import React from 'react';
import { Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import { containerStyle } from '../../common.js'
import DashboardMenu from '../DashboardMenu.js'
import verifyLogin from '../verifyLogin.js';
import retrieveItems from './retrieveItems.js';

class CategorySelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        retrieveItems('category')
            .then(data => {
                let categories = [];

                data.forEach(element => {
                    categories.push(element)
                });

                this.setState({ items: categories });
            })
            .catch((error) => {
                alert(error);
            })
    }

    render() {
        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Select a category!</h1>
                        <div className="ui stacked segment">
                            <Form>
                                {this.state.items.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <Link to={{
                                                // Gets the last part of the URL after the forward slash (e.g. 'quizzes')
                                                // The first letter of value.categoryName is capitalized, so format the entire string into lowercase 
                                                pathname: `${window.location.href.split("/").pop()}/${value.categoryName.toLowerCase()}`,
                                                category: value
                                            }}>
                                                <Button icon className='fluid large teal'>{value.categoryName}</Button>
                                            </Link>
                                        </div>
                                    )
                                })}
                                <h2>Or...</h2>
                                <div className="field">
                                    <Link to={{
                                        pathname: 'category/creation'
                                    }}>
                                        <Button icon className='fluid large blue'>Create a category!</Button>
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div >
            )
        }
    }
}

export default CategorySelection;