import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button, Segment, Grid, Accordion, Label, Message, Input, Select } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import retrieveItems from '../quiz/retrieveItems.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class QuestDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questItems: [],
            categoryItems: [],
            items: [],
            functions: [
                { icon: 'trash', color: 'red', path: 'delete' },
                { icon: 'edit', color: 'blue', path: 'update' },
                { icon: 'play', color: 'green', path: 'play' },
            ],
            redirect: null,
            filter: '',
            filterType: null,
            filterOptions: [
                { key: 'name', text: 'Quest Title', value: 'name' },
                { key: 'category', text: 'Category', value: 'category' },
            ],
        };
    }

    redirectHandler = () => {
        this.setState({ redirect: '/quests/creation' });
    };

    // renderRedirect = () => {
    //     if (this.state.redirect) {
    //        return <Redirect to="/quests/creation" />
    //     } else console.log(this.state.redirect);
    // };
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
        const empty = 'None.';
        return [
            {
                key: 'details',
                title: 'Description',
                content: {
                    as: Form.Field,
                    label: JSON.stringify(value).length > 0 ? `${value}` : `${empty}`,
                },
            },
        ];
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

    componentDidMount() {
        retrieveItems('quest')
            .then((data) => {
                if (data.length <= 0) {
                    new Noty({
                        text: 'There are no quest to be retrieved from the database.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                } else this.setState({ questItems: data });
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
        let questItems = this.state.questItems.filter((item) => {
            switch (this.state.filterType) {
                default:
                    return item.title.toLowerCase().indexOf(this.state.filter) !== -1;
            }
        });

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else if (!verifyLogin()) {
            return <h1>403 Forbidden</h1>;
        } else {
            return (
                <div className="container" style={{ textAlign: 'left' }}>
                    <DashboardMenu page="quests"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <div className="filter-input" style={{ marginBottom: '50px' }}>
                            <Message info header="This is a filter component." />
                            <Input fluid placeholder="Search..." action>
                                <input name="filter" onChange={this.handleChange} />
                                <Select
                                    name="filterType"
                                    disabled
                                    options={this.state.filterOptions}
                                    onChange={this.handleDropdownChange}
                                    defaultValue="name"
                                />
                            </Input>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1>All Quests</h1>
                            <button className="ui primary button" onClick={this.redirectHandler}>
                                Create New<i className="right wrench icon"></i>
                            </button>
                        </div>
                        <div className="ui stacked segment">
                            <Form>
                                {questItems.length > 0 ? (
                                    questItems.map((value, index) => {
                                        return (
                                            <Segment color="green" key={index}>
                                                <Grid.Row>
                                                    <h2>{value.title}</h2>
                                                    <div style={{ fontStyle: 'italic' }}>
                                                        Category:
                                                        <Label style={{ margin: '0 5px' }} horizontal>
                                                            {this.state.categoryItems.map((category, index) => {
                                                                return category.categoryId === value.categoryId
                                                                    ? category.categoryName
                                                                    : '';
                                                            })}
                                                        </Label>
                                                        <Accordion panels={this.panel(value.description)} />
                                                    </div>
                                                </Grid.Row>
                                                <Grid.Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                                    <Grid.Column></Grid.Column>
                                                    {this.state.functions.map((button, index2) => {
                                                        return (
                                                            <Grid.Column key={index2} style={{ display: 'flex' }}>
                                                                <Link
                                                                    push
                                                                    to={{
                                                                        // window.location.href.split("/").pop() gets the last part of the URL after the forward slash (e.g. 'quizzes')
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
                                                    })}
                                                </Grid.Row>
                                            </Segment>
                                        );
                                    })
                                ) : (
                                    <h2>No Results..</h2>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default QuestDashboard;
