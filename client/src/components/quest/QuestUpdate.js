import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Dropdown, Icon, Segment, Form, Grid, TextArea } from 'semantic-ui-react';
import DashboardMenu from '../DashboardMenu.js';
import QuestScenarioUpdate from './QuestScenarioUpdate.js';
import retrieveItems from '../retrieveItems.js';
// import axios from 'axios';
// import { host } from '../../common.js';
// import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class QuestUpdate extends React.Component {
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
            return <Redirect to="/quests" />;
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

        // let questObj = {
        //     title: this.state.questTitle,
        //     desc: this.state.questDesc,
        //     categoryId: this.state.questCategory,
        //     fiqPoints: this.state.questPoints,
        //     scenarios: scenario,
        // };

        // const result = axios.post(`${host}/quests/createNew`, { quest: questObj });
        // result
        //     .then((response) => {
        //         if (response.status === 200) {
        //             new Noty({
        //                 text: `Quest Created: ${this.state.questTitle}`,
        //                 type: 'success',
        //                 theme: 'semanticui',
        //             }).show();

        //             setTimeout(() => {
        //                 window.location.reload();
        //             }, 1000);
        //         } else {
        //             new Noty({
        //                 text: 'Something went wrong.',
        //                 type: 'error',
        //                 theme: 'semanticui',
        //             }).show();
        //         }
        //     })
        //     .catch((err) => {
        //         new Noty({
        //             text: `${err}`,
        //             type: 'error',
        //             theme: 'semanticui',
        //         }).show();
        //     });
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
        if (this.props.location.quest !== undefined) {
            this.generateItems();
            retrieveItems(`quests/${this.props.location.quest.insertId}`).then((data) => {
                let scenarios = [];
                let counter = 1;

                let quest = data.data[0];

                data.data.forEach((element) => {
                    scenarios.push({
                        scenarioId: element.scenarioId,
                        scenario: JSON.parse(element.options),
                    });
                });

                this.setState(
                    {
                        questId: quest.insertId,
                        questTitle: quest.title,
                        questDesc: quest.description,
                        questCategory: quest.categoryId,
                        questPoints: quest.fiqPoint,
                        options: scenarios,
                    },
                    () => {
                        // Initialize the default state of all questions and their related properties
                        // If this is not done, all question-related input fields will not have their values stored in state
                        // despite defaultValue displaying the correct values
                        // for (let i = 1; i < this.state.questions.length + 1; i++) {
                        //     let question = this.state.options[i - 1];
                        //     this.setState({
                        //         ['question' + i + 'name']: question.name,
                        //         ['question' + i + 'points']: question.points,
                        //         ['question' + i + 'time']: question.time,
                        //         ['question' + i + 'explanation']: question.explanation,
                        //         ['question' + i + 'name']: question.name,
                        //     });
                        //     for (let j = 1; j < this.state.options + 1; j++) {
                        //         this.setState({
                        //             ['option-' + i + '-' + j]: question.options[j - 1].name,
                        //         });
                        //     }
                        // }
                        do {
                            for (let i = 1; i < this.state.options + 1; i++) {
                                let option = this.state.options;
                                console.log('this is option', option);
                            }

                            counter++;
                        } while (counter < this.state.scenario + 1);
                    },
                );
            });
        } else {
            this.setState({ redirect: '/quests' });
        }
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
                <QuestScenarioUpdate
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
                                            defaultValue={this.state.questTitle}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h3>Quest Description</h3>
                                        <TextArea
                                            name="questDesc"
                                            placeholder="Description"
                                            onChange={this.handleChange}
                                            defaultValue={this.state.questDesc}
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
                                            defaultValue={this.state.questCategory}
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h3>Overall FIQ Points</h3>
                                        <input
                                            type="text"
                                            name="questPoints"
                                            placeholder="Points"
                                            onChange={this.handleChange}
                                            defaultValue={this.state.questPoints}
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
                            Update Quest
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuestUpdate;
