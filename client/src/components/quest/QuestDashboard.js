import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button, Segment, Grid, Accordion, Label, Message, Input, Select } from 'semantic-ui-react';
import { containerStyle, inProduction, defaultAccountType, adminAccountType } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems.js';
import QuestDelete from './QuestDelete.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class QuestDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questItems: [],
            categoryItems: [],
            items: [],
            functions: [
                { icon: 'edit', color: 'blue', path: 'update' },
                { icon: 'play', color: 'green', path: 'play' },
            ],
            redirect: null,
            filter: '',
            filterType: null,
            filterOptions: [{ key: 'name', text: 'Quest Title', value: 'name' }],
            accountType: !inProduction
                ? JSON.parse(sessionStorage.getItem('user')).accountType
                    ? JSON.parse(sessionStorage.getItem('user')).accountType
                    : defaultAccountType
                : adminAccountType,
        };
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
        retrieveItems('quest').then((data) => {
            if (JSON.stringify(data) !== JSON.stringify(this.state.questItems)) {
                this.setState({ questItems: data });
            }
        });
    }

    componentDidMount() {
        retrieveItems('quest')
            .then((data) => {
                if (data.length <= 0) {
                    new Noty({
                        text: 'There are no quests to be retrieved from the database.',
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
                    return item.title.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1;
            }
        });

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else {
            return (
                <div className="container" style={{ textAlign: 'left' }}>
                    <DashboardMenu page="quests"></DashboardMenu>
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
                            <h1>All Quests</h1>
                            {this.state.accountType === adminAccountType ? (
                                <Link to={{ pathname: 'quests/creation' }}>
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
                                                    {this.state.accountType === adminAccountType ? (
                                                        <Grid.Column>
                                                            <QuestDelete
                                                                trigger={<Button circular icon="trash" color="red" />}
                                                                quest={value}
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
                                                                                .pop()}/${button.path}/${
                                                                                value.questId
                                                                            }`,
                                                                            quest: value,
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
                                                                        .pop()}/play/${value.questId}`,
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
                    </div>
                </div>
            );
        }
    }
}

export default QuestDashboard;
