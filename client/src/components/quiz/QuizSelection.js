import React from 'react';
import { Link } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import { containerStyle } from '../../common.js'
import DashboardMenu from '../DashboardMenu.js'
import verifyLogin from '../verifyLogin.js';
import retrieveItems from './retrieveItems.js';

// No quizzes will be rendered (i.e. hasItems property will be set to false) under the following 2 scenarios:
// 1. Category is valid, but there are no quizzes associated with the category (e.g. newly-created category)
// 2. Category is invalid (e.g. specifying a gibberish name in the URL)

// TO-DO
// Better error handling/validation for scenario 1 above

class QuizSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            items: [],
            hasItems: true
        }
    }

    generateItems() {
        retrieveItems(`quiz/category/${this.state.category.categoryId}`)
            .then(data => {
                if (data !== undefined) {
                    let quizzes = [];

                    data.forEach(element => {
                        quizzes.push(element)
                    });

                    this.setState({ items: quizzes });
                } else {
                    this.setState({ hasItems: false });
                }
            })
            .catch((error) => {
                alert(error);
            })
    }

    componentDidMount() {
        // props will be undefined if the user navigates to this component directly via the URL
        // As a result, no items will be generated
        if (this.props.location.category !== undefined) {
            this.setState({ category: this.props.location.category }, () => {
                this.generateItems();
            })
        } else {
            // Gets the last part of the URL after the forward slash (e.g. 'technology' from '/quizzes/technology')
            let pathname = window.location.href.split("/").pop();

            // Capitalizes the category name
            let categoryName = pathname[0].toUpperCase() + pathname.slice(1)

            // If component was accessed directly via the URL, reverse lookup the category via its categoryName and set it in state 
            // Kind of bad practice especially if categoryName is not unique (well, it should be),
            // but I can't think of any better alternatives...
            retrieveItems(`category/${categoryName}`)
                .then(data => {
                    if (data.length !== 0) {
                        this.setState({ category: data[0] }, () => {
                            this.generateItems();
                        })
                    } else {
                        this.setState({ hasItems: false });
                    }
                })
                .catch((error) => {
                    alert(error);
                })
        }
    }

    render() {
        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else if (!this.state.hasItems) {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Sorry, no quizzes available!</h1>
                    </div>
                </div >
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Select a quiz!</h1>
                        <div className="ui stacked segment">
                            <Form>
                                {this.state.items.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <Link to={{
                                                // window.location.href.split("/").pop() gets the last part of the URL after the forward slash (e.g. 'quizzes')
                                                pathname: `${window.location.href.split("/").pop()}/${value.quizId}`,
                                                quiz: value
                                            }}>
                                                <Button icon className='fluid large teal'>{value.quizName}</Button>
                                            </Link>
                                        </div>
                                    )
                                })}
                                <h2>Or...</h2>
                                <div className="field">
                                    <Link to={{
                                        pathname: 'creation'
                                    }}>
                                        <Button icon className='fluid large blue'>Create a quiz!</Button>
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

export default QuizSelection;