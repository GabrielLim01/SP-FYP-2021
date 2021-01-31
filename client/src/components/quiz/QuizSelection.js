import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Segment, Grid, Form, Button } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems.js';
import QuizDelete from './QuizDelete.js';

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
            ],
            redirect: null,
        };
    }

    generateItems() {
        retrieveItems(`quiz/category/${this.state.category.categoryId}`)
            .then((data) => {
                if (data !== undefined) {
                    let quizzes = [];

                    data.forEach((element) => {
                        quizzes.push(element);
                    });

                    this.setState({ items: quizzes });
                } else {
                    this.setState({ hasItems: false });
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    componentDidMount() {
        if (this.props.location.category !== undefined) {
            this.setState({ category: this.props.location.category }, () => {
                this.generateItems();
            });
        } else {
            this.setState({ redirect: '/quizzes' });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else if (!this.state.hasItems) {
            return (
                <div className="container">
                    <DashboardMenu page="quizzes"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Sorry, no quizzes available!</h1>
                        <div className="field">
                            <Link to={{ pathname: 'creation' }}>
                                <Button icon className="fluid large blue">
                                    Create a quiz!
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <DashboardMenu page="quizzes"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Select a quiz!</h1>
                        <div className="ui stacked segment">
                            <Form>
                                {this.state.items.map((element, index) => {
                                    return (
                                        <Segment inverted color="black" key={index}>
                                            <Grid>
                                                <Grid.Row columns="equal">
                                                    <Grid.Column width={8}>
                                                        <h3>{element.quizName}</h3>
                                                    </Grid.Column>
                                                    {this.state.functions.map((value, index2) => {
                                                        return (
                                                            <Grid.Column key={index2}>
                                                                <Link
                                                                    to={{
                                                                        pathname: `${window.location.href
                                                                            .split('/')
                                                                            .pop()}/${value.path}/${element.quizId}`,
                                                                        quiz: element,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        circular
                                                                        icon={value.icon}
                                                                        color={value.color}
                                                                    />
                                                                </Link>
                                                            </Grid.Column>
                                                        );
                                                    })}
                                                    <Grid.Column>
                                                        <QuizDelete
                                                            trigger={<Button circular icon="trash" color="red" />}
                                                            quiz={element}
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Segment>
                                    );
                                })}
                                <h2>Or...</h2>
                                <div className="field">
                                    <Link
                                        to={{
                                            pathname: 'creation',
                                        }}
                                    >
                                        <Button icon className="fluid large blue">
                                            Create a quiz!
                                        </Button>
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default QuizSelection;
