import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Segment, Grid } from 'semantic-ui-react'
import { containerStyle } from '../../common.js'
import DashboardMenu from '../DashboardMenu.js'
import verifyLogin from '../verifyLogin.js';
import retrieveItems from './retrieveItems.js';

// No quizzes will be rendered (i.e. hasItems property will be set to false) under the following scenario:
// 1. Category is valid (i.e. recognised in the database), but there are no quizzes associated with the category (e.g. newly-created category)

// TO-DO
// 1. Better error handling/validation for scenario 1 above 

class QuizSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            items: [],
            hasItems: true,
            functions: [
                { icon: 'play', color: 'green', path: 'play' },
                { icon: 'edit', color: 'blue', path: 'update' },
                { icon: 'trash', color: 'red', path: 'delete' }
            ],
            redirect: null
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
            // Redirect users to /quizzes if they attempt to access this component directly via the URL
            this.setState({ redirect: "/quizzes" });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } else if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else if (!this.state.hasItems) {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Sorry, no quizzes available!</h1>
                        <div className="field">
                            <Link to={{ pathname: 'creation' }}>
                                <Button icon className='fluid large blue'>Create a quiz!</Button>
                            </Link>
                        </div>
                    </div>
                </div >
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <div className="subContainer" style={{
                        maxWidth: '35%',
                        margin: 'auto',
                        paddingTop: '100px'
                    }}>
                        <h1>Select a quiz!</h1>
                        <div className="ui stacked segment">
                            <Form>
                                {this.state.items.map((element, index) => {
                                    return (
                                        <Segment inverted color='black' key={index}>
                                            <Grid>
                                                <Grid.Row columns='equal'>
                                                    <Grid.Column width={8}>
                                                        <h3>{element.quizName}</h3>
                                                    </Grid.Column>
                                                    {this.state.functions.map((value, index2) => {
                                                        return (
                                                            <Grid.Column key={index2}>
                                                                <Link to={{
                                                                    // window.location.href.split("/").pop() gets the last part of the URL after the forward slash (e.g. 'quizzes')
                                                                    pathname: `${window.location.href.split("/").pop()}/${value.path}/${element.quizId}`,
                                                                    quiz: element
                                                                }}>
                                                                    <Button circular icon={value.icon} color={value.color} />
                                                                </Link>
                                                            </Grid.Column>
                                                        )
                                                    })}
                                                </Grid.Row>
                                            </Grid>
                                        </Segment>
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