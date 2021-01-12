import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Dropdown, Icon, Segment, Form, Grid, TextArea } from 'semantic-ui-react';
import DashboardMenu from '../DashboardMenu.js';
import QuestScenarioCreation from './questScenarioCreation.js';
import retrieveItems from '../quiz/retrieveItems.js';
import axios from 'axios';
import { host } from '../../common.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class QuestCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            items: [],
            scenario: 1,
            maxScenario: 10,
            options: 3,
        };
    }
    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect push to="/quests" />;
        }
    };

    onAddScenario = () => {
        if (this.state.scenario < this.state.maxScenario) {
            this.setState({
                scenario: this.state.scenario + 1,
            });
        } else {
            alert('Maximum number of scenarios reached!');
        }
    };

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

    handleSubmit = (event) => {
        event.preventDefault();
        let counter = 1;
        let scenario = [];

        do {
            const options = [];
            for (let i = 1; i < this.state.options + 1; i++) {
                options.push({
                    name: this.state[`option-${counter}-${i}`],
                    addOns: this.state[`desc-${counter}-${i}`],
                });
            }
            scenario.push({
                scenario: this.state[`scenario${counter}name`],
                options,
            });

            counter++;
        } while (counter < this.state.scenario + 1);

        let questObj = {
            title: this.state.questTitle,
            desc: this.state.questDesc,
            categoryId: this.state.questCategory,
            fiqPoints: this.state.questPoints,
            scenarios: scenario,
        };

        const result = axios.post(`${host}/quests/createNew`, { quest: questObj });
        result
            .then((response) => {
                if (response.status === 200) {
                    new Noty({
                        text: `Quest Created: ${this.state.questTitle}`,
                        type: 'success',
                        theme: 'semanticui',
                    }).show();

                    // set timeout to 2 seconds
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 1000);
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
                    text: `${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
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
        const scenarios = [];
        const categoryItems = [];

        for (let i = 0; i < this.state.items.length; i++) {
            let id = this.state.items[i].categoryId;
            let name = this.state.items[i].categoryName;
            categoryItems.push({ text: name, value: id });
        }

        for (let i = 1; i < this.state.scenario + 1; i++) {
            scenarios.push(
                <QuestScenarioCreation
                    key={'scenario' + i}
                    scenarioNumber={i}
                    options={this.state.options}
                    handleChange={this.handleChange}
                    handleDropdownChange={this.handleDropdownChange}
                />,
            );
        }
        return (
            <div className="container">
                <DashboardMenu page="quests"></DashboardMenu>
                <h1 className="ui teal image header">Create your quest!</h1>
                <div
                    className="subContainer"
                    style={{ maxWidth: '70%', margin: 'auto', textAlign: 'left', paddingTop: '20px' }}
                >
                    <Segment>
                        <Form>
                            <Grid columns="equal">
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <h3>Quest Title</h3>
                                        <input
                                            type="text"
                                            name="questTitle"
                                            placeholder="Title"
                                            onChange={this.handleChange}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h3>Quest Description</h3>
                                        <TextArea
                                            name="questDesc"
                                            placeholder="Description"
                                            onChange={this.handleChange}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={3}>
                                    <Grid.Column>
                                        <h3>Category</h3>
                                        <Dropdown
                                            name="questCategory"
                                            placeholder="Select a Category"
                                            fluid
                                            selection
                                            options={categoryItems}
                                            onChange={this.handleDropdownChange}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h3>Overall FIQ Points</h3>
                                        <input
                                            type="text"
                                            name="questPoints"
                                            placeholder="Points"
                                            onChange={this.handleChange}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Segment>
                    {scenarios}
                    <div className="subContainer" style={{ padding: '25px 0px', textAlign: 'right' }}>
                        <Button onClick={this.redirectHandler}>Back{this.renderRedirect()}</Button>
                        <Button
                            icon
                            labelPosition="left"
                            className="teal"
                            name="addScenario"
                            onClick={this.onAddScenario}
                        >
                            <Icon name="add" size="large" />
                            Add Scenarios
                        </Button>
                        <Button className="blue" name="createQuest" onClick={this.handleSubmit}>
                            Create Quest
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuestCreation;
