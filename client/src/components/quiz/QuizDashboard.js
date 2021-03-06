import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Segment, Grid, Label, Input, Select, Accordion } from 'semantic-ui-react';
import { containerStyle, inProduction, defaultAccountType, adminAccountType } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems.js';
import QuizDelete from './QuizDelete.js';
import Noty from 'noty';
import ReactBotUI from '../chatbot/ReactBotUI';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class QuizDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizItems: [],
            categoryItems: [],
            functions: [
                { icon: 'edit', color: 'blue', path: 'update' },
                { icon: 'play', color: 'green', path: 'play' },
            ],
            filter: '',
            filterType: null,
            filterOptions: [{ key: 'name', text: 'Quiz Title', value: 'name' }],
            accountType: !inProduction
                ? JSON.parse(sessionStorage.getItem('user')).accountType
                    ? JSON.parse(sessionStorage.getItem('user')).accountType
                    : defaultAccountType
                : adminAccountType,
        };

        this._isMounted = false;
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    panel(value) {
        return [
            {
                key: 'details',
                title: 'Description',
                content: {
                    as: Form.Field,
                    label: value ? `${value}` : `No description.`,
                },
            },
        ];
    }

    displayDifficulty(status) {
        if (status.toLowerCase() === 'easy') {
            return (
                <span className="ui green label" style={{ height: '25px' }}>
                    {`${status}`}
                </span>
            );
        } else if (status.toLowerCase() === 'medium') {
            return (
                <span className="ui yellow label" style={{ height: '25px' }}>
                    {`${status}`}
                </span>
            );
        } else {
            return (
                <span className="ui red label" style={{ height: '25px' }}>
                    {`${status}`}
                </span>
            );
        }
    }

    getAllCategories() {
        retrieveItems('category')
            .then((data) => {
                if (data.length <= 0) {
                    new Noty({
                        text: 'There are no categories to be retrieved from the database.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                } else this.setState({ categoryItems: data });
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    componentDidUpdate() {
        retrieveItems('quiz').then((data) => {
            if (JSON.stringify(data) !== JSON.stringify(this.state.quizItems)) {
                this.setState({ quizItems: data });
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;
        retrieveItems('quiz')
            .then((data) => {
                if (data.length <= 0) {
                    new Noty({
                        text: 'There are no quizzes to be retrieved from the database.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                } else this.setState({ quizItems: data });
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
        this.getAllCategories();
    }

    render() {
        let quizItems = this.state.quizItems.filter((item) => {
            switch (this.state.filterType) {
                default:
                    return item.quizName.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1;
            }
        });

        return (
            <div className="container" style={{ textAlign: 'left' }}>
                <DashboardMenu page="quizzes"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <div className="filter-input" style={{ marginBottom: '50px' }}>
                        <Input fluid placeholder="Search..." action>
                            <input name="filter" onChange={this.handleChange} />
                            <Select
                                name="filterType"
                                options={this.state.filterOptions}
                                onChange={this.handleDropdownChange}
                                defaultValue="name"
                            />
                        </Input>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1>All Quizzes</h1>
                        {this.state.accountType === adminAccountType ? (
                            <Link to={{ pathname: 'quizzes/creation' }}>
                                <button className="ui primary button">
                                    Create New<i className="right wrench icon"></i>
                                </button>
                            </Link>
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="ui stacked segment">
                        <Form>
                            {quizItems.length > 0 ? (
                                quizItems.map((value, index) => {
                                    return (
                                        <Segment color="green" key={index}>
                                            <Grid.Row>
                                                <div style={{ display: 'flex' }}>
                                                    <h2>{value.quizName}</h2>
                                                    {value.difficulty ? this.displayDifficulty(value.difficulty) : null}
                                                </div>

                                                <div style={{ fontStyle: 'italic' }}>
                                                    Category:
                                                    <Label style={{ margin: '0 5px' }} horizontal>
                                                        {this.state.categoryItems.map((category, index) => {
                                                            return category.categoryId === value.categoryId
                                                                ? category.categoryName
                                                                : '';
                                                        })}
                                                    </Label>
                                                    Created At: {value.createdAt}
                                                    <br />
                                                    <Accordion panels={this.panel(value.quizDesc)} />
                                                </div>
                                            </Grid.Row>
                                            <Grid.Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                                {this.state.accountType === adminAccountType ? (
                                                    <Grid.Column>
                                                        <QuizDelete
                                                            trigger={<Button circular icon="trash" color="red" />}
                                                            quiz={value}
                                                        />
                                                    </Grid.Column>
                                                ) : (
                                                    ''
                                                )}
                                                {this.state.accountType === adminAccountType ? (
                                                    this.state.functions.map((button, index2) => {
                                                        return (
                                                            <Grid.Column key={index2} style={{ display: 'flex' }}>
                                                                <Link
                                                                    to={{
                                                                        pathname: `${window.location.href
                                                                            .split('/')
                                                                            .pop()}/${button.path}/${value.quizId}`,
                                                                        quiz: value,
                                                                    }}
                                                                >
                                                                    <Button
                                                                        circular
                                                                        icon={button.icon}
                                                                        color={button.color}
                                                                    />
                                                                </Link>
                                                            </Grid.Column>
                                                        );
                                                    })
                                                ) : (
                                                    <Grid.Column style={{ display: 'flex' }}>
                                                        <Link
                                                            to={{
                                                                pathname: `${window.location.href
                                                                    .split('/')
                                                                    .pop()}/play/${value.quizId}`,
                                                                quiz: value,
                                                            }}
                                                        >
                                                            <Button circular icon="play" color="green" />
                                                        </Link>
                                                    </Grid.Column>
                                                )}
                                            </Grid.Row>
                                        </Segment>
                                    );
                                })
                            ) : (
                                <h2>No Results..</h2>
                            )}
                        </Form>
                    </div>
                    <ReactBotUI
                        dialogHeightMax={350}
                        isUserHidden={true}
                        isVisible={true}
                        ref={(el) => (this.chat = el)}
                    />
                </div>
            </div>
        );
    }
}

export default QuizDashboard;
