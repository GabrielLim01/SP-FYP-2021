import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Segment, Form, Grid, TextArea, Dropdown, Button, Popup, Icon } from 'semantic-ui-react';
import { host } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems.js';
import QuestScenarioUpdate from './QuestScenarioUpdate.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class QuestUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            scenarios: [],
            choices: 3,
            fiqOptionsRange: 6,
            moodOptionsRange: 10,
            redirect: null,
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

    handleCheckboxChange = (checkbox) => {
        this.setState({
            [checkbox.name]: !checkbox.checked,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let scenarios = [];

        for (let i = 1; i < this.state.scenarios.length + 1; i++) {
            const choices = [];

            for (let j = 1; j < this.state.choices + 1; j++) {
                if (this.state[`choice-${i}-${j}`] !== undefined && this.state[`choice-${i}-${j}`] !== '') {
                    if (this.state[`hasEvent-${i}-${j}`]) {
                        choices.push({
                            name: this.state[`choice-${i}-${j}`],
                            description: this.state[`choiceDesc-${i}-${j}`],
                            event: {
                                name: this.state[`event-${i}-${j}`],
                                description: this.state[`eventDesc-${i}-${j}`],
                                eventProcRate: this.state[`eventProcRate-${i}-${j}`],
                                moodChange: this.state[`moodChange-${i}-${j}`] ? this.state[`moodChange-${i}-${j}`] : 1,
                                moodChangeValue: this.state[`moodChangeValue-${i}-${j}`]
                                    ? this.state[`moodChangeValue-${i}-${j}`]
                                    : 10,
                            },
                        });
                    } else {
                        choices.push({
                            name: this.state[`choice-${i}-${j}`],
                            description: this.state[`choiceDesc-${i}-${j}`],
                        });
                    }
                }
            }

            scenarios.push({
                scenarioId: this.state.scenarios[i - 1].scenarioId,
                scenario: {
                    description: this.state[`scenario-${i}-description`],
                    choices,
                },
            });
        }

        let quest = {
            categoryId: this.state.categoryId,
            title: this.state.title,
            description: this.state.description,
            conclusion: this.state.conclusion,
            characterName: this.state.characterName,
            characterMood: this.state.characterMood ? this.state.characterMood : 100,
            points: this.state.points,
            scenarios: scenarios,
        };

        axios
            .patch(`${host}/quest/${this.state.questId}`, { quest: quest })
            .then(
                new Noty({
                    text: `Quest Updated: ${quest.title}`,
                    type: 'success',
                    theme: 'semanticui',
                }).show(),
                (window.location.href = 'quests'),
            )
            .catch((err) => {
                new Noty({
                    text: `${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    };

    initializeStates(quest, scenarios) {
        this.setState(
            {
                categoryId: quest.categoryId,
                questId: quest.questId,
                title: quest.title,
                description: quest.description,
                conclusion: quest.conclusion,
                characterName: quest.characterName,
                characterMood: quest.characterMood,
                points: quest.points,
                scenarios: scenarios,
            },
            () => {
                for (let i = 1; i < this.state.scenarios.length + 1; i++) {
                    let scenario = this.state.scenarios[i - 1].scenario;

                    this.setState({
                        [`scenario-${i}-description`]: scenario.description,
                    });

                    if (scenario.choices) {
                        for (let j = 1; j < scenario.choices.length + 1; j++) {
                            let choice = scenario.choices[j - 1];
                            let event = choice.event;

                            if (choice.name !== undefined && choice.name !== '') {
                                this.setState({
                                    [`choice-${i}-${j}`]: choice.name,
                                    [`choiceDesc-${i}-${j}`]: choice.description,
                                });

                                if (event !== undefined) {
                                    this.setState({
                                        [`hasEvent-${i}-${j}`]: true,
                                        [`event-${i}-${j}`]: event.name,
                                        [`eventDesc-${i}-${j}`]: event.description,
                                        [`eventProcRate-${i}-${j}`]: event.eventProcRate,
                                        [`moodChange-${i}-${j}`]: event.moodChange,
                                        [`moodChangeValue-${i}-${j}`]: event.moodChangeValue,
                                    });
                                }
                            }
                        }
                    }
                }
            },
        );
    }

    componentDidMount() {
        if (this.props.location.quest !== undefined) {
            retrieveItems('category')
                .then((data) => {
                    let categories = [];

                    data.forEach((element) => {
                        categories.push(element);
                    });

                    this.setState({ categories: categories });
                })
                .catch((error) => {
                    alert(error);
                });

            retrieveItems(`quest/${this.props.location.quest.questId}`).then((data) => {
                let scenarios = [];

                data.forEach((element) => {
                    scenarios.push({
                        scenarioId: element.questScenarioId,
                        scenario: JSON.parse(element.scenario),
                    });
                });

                delete data[0].scenario;
                delete data[0].questScenarioId;
                let quest = data[0];

                this.initializeStates(quest, scenarios);
            });
        } else {
            this.setState({ redirect: '/quests' });
        }
    }

    render() {
        const { scenarios } = this.state;
        const categories = [];
        const FIQoptions = [];
        const moodOptions = [];
        const displayScenarios = [];

        for (let i = 1; i < scenarios.length + 1; i++) {
            displayScenarios.push(
                <QuestScenarioUpdate
                    key={'scenario' + i}
                    scenario={scenarios[i - 1].scenario}
                    scenarioNumber={i}
                    choices={this.state.choices}
                    handleChange={this.handleChange}
                    handleDropdownChange={this.handleDropdownChange}
                    handleCheckboxChange={this.handleCheckboxChange}
                />,
            );
        }

        for (let i = 0; i < this.state.categories.length; i++) {
            let id = this.state.categories[i].categoryId;
            let name = this.state.categories[i].categoryName;
            categories.push({ text: name, value: id });
        }

        for (let i = 5; i < this.state.fiqOptionsRange + 5; i++) {
            let value = 100 * i;
            FIQoptions.push({ text: value, value: value });
        }

        for (let i = 1; i < this.state.moodOptionsRange + 1; i++) {
            let value = 10 * i;
            moodOptions.push({ text: value, value: value });
        }

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else if (this.state.questId !== undefined) {
            return (
                <div className="container">
                    <DashboardMenu page="quests"></DashboardMenu>
                    <h1 className="ui teal image header">Update your quest!</h1>
                    <div
                        className="subContainer"
                        style={{ maxWidth: '70%', margin: 'auto', textAlign: 'left', paddingTop: '20px' }}
                    >
                        <Segment>
                            <Form>
                                <Grid columns="equal">
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Popup content="The name of your quest!" trigger={<h3>Quest Title</h3>} />
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="Title"
                                                onChange={this.handleChange}
                                                defaultValue={this.state.title}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="Tell us what your quest is about!"
                                                trigger={<h3>Quest Description</h3>}
                                            />
                                            <TextArea
                                                name="description"
                                                placeholder="Description"
                                                onChange={this.handleChange}
                                                defaultValue={this.state.description}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Popup
                                                content="What category does your quest belong in?"
                                                trigger={<h3>Category</h3>}
                                            />
                                            <Dropdown
                                                name="categoryId"
                                                placeholder="Select a Category"
                                                fluid
                                                selection
                                                options={categories}
                                                onChange={this.handleDropdownChange}
                                                defaultValue={this.state.categoryId}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How much FIQ (Financial IQ) points will the players earn upon completing the quest?"
                                                trigger={<h3>Overall FIQ Points</h3>}
                                            />
                                            <Dropdown
                                                name="points"
                                                placeholder="Select overall FIQ awarded"
                                                fluid
                                                selection
                                                clearable
                                                options={FIQoptions}
                                                onChange={this.handleDropdownChange}
                                                defaultValue={this.state.points}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Popup
                                                content="The main star of your quest!"
                                                trigger={<h3>Character Name</h3>}
                                            />
                                            <input
                                                type="text"
                                                name="characterName"
                                                placeholder="Character Name"
                                                onChange={this.handleChange}
                                                defaultValue={this.state.characterName}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How happy or sad will your character be at the start of the quest? (0 = Griefstricken, 100 = Happy)"
                                                trigger={<h3>Character Starting Mood</h3>}
                                            />
                                            <Dropdown
                                                name="characterMood"
                                                fluid
                                                selection
                                                clearable
                                                options={moodOptions}
                                                onChange={this.handleDropdownChange}
                                                defaultValue={this.state.characterMood}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Popup
                                                content="How will your quest end?"
                                                trigger={<h3>Quest Conclusion</h3>}
                                            />
                                            <TextArea
                                                name="questConc"
                                                placeholder="Conclusion"
                                                onChange={this.handleChange}
                                                defaultValue={this.state.conclusion}
                                                maxLength="500"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </Segment>
                        {displayScenarios}
                        <div className="subContainer" style={{ padding: '25px 0px', textAlign: 'right' }}>
                            <Button onClick={() => this.setState({ redirect: '/quests' })}>Back</Button>
                            <Button
                                icon
                                labelPosition="left"
                                className="teal"
                                name="addScenario"
                                onClick={this.onAddScenario}
                            >
                                <Icon name="add" size="large" />
                                Add Scenario
                            </Button>
                            <Button className="blue" name="updateQuest" onClick={this.handleSubmit}>
                                Update Quest
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default QuestUpdate;
