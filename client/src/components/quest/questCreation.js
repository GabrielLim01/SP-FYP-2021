import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Segment, Form, Grid, TextArea, Dropdown, Button, Popup, Icon } from 'semantic-ui-react';
import { host } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems.js';
import QuestScenarioCreation from './QuestScenarioCreation.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class QuestCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            scenarios: 1,
            maxScenarios: 10,
            choices: 3,
            fiqOptionsRange: 6,
            moodOptionsRange: 10,
            redirect: null
        };
    }

    onAddScenario = () => {
        if (this.state.scenarios < this.state.maxScenarios) {
            this.setState({ scenarios: this.state.scenarios + 1 });
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

    handleCheckboxChange = (checkbox) => {
        this.setState({
            [checkbox.name]: !checkbox.checked,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let scenarios = [];

        for (let i = 1; i < this.state.scenarios + 1; i++) {
            const choices = [];

            for (let j = 1; j < this.state.choices + 1; j++) {

                if (this.state[`choice-${i}-${j}`] !== undefined && this.state[`choice-${i}-${j}`] !== "") {
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
                            }
                        });
                    } else {
                        choices.push({
                            name: this.state[`choice-${i}-${j}`],
                            description: this.state[`choiceDesc-${i}-${j}`]
                        });
                    }
                }
            }

            scenarios.push({
                description: this.state[`scenario-${i}-desc`],
                choices
            });
        }

        let quest = {
            categoryId: this.state.questCategory,
            title: this.state.questTitle,
            description: this.state.questDesc,
            introduction: this.state.questIntro,
            conclusion: this.state.questConc,
            characterName: this.state.characterName,
            characterMood: this.state.characterMood ? this.state.characterMood : 100,
            points: this.state.questPoints,
            scenarios: scenarios,
        };

        console.log(quest)

        axios.post(`${host}/quest`, { quest: quest })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    new Noty({
                        text: `Quest Created: ${this.state.questTitle}`,
                        type: 'success',
                        theme: 'semanticui',
                    }).show();
                    this.setState({ redirect: '/quests' });
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

    componentDidMount() {
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
    }

    render() {
        const scenarios = [];
        const categories = [];
        const FIQoptions = [];
        const moodOptions = [];

        for (let i = 1; i < this.state.scenarios + 1; i++) {
            scenarios.push(
                <QuestScenarioCreation
                    key={'scenario' + i}
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

        for (let i = 0; i < (this.state.moodOptionsRange + 1); i++) {
            let value = 10 * i;
            moodOptions.push({ text: value, value: value });
        }

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        } else {
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
                                            <Popup content="The name of your quest!" trigger={<h3>Quest Title</h3>} />
                                            <input
                                                type="text"
                                                name="questTitle"
                                                placeholder="Title"
                                                onChange={this.handleChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="Tell us what your quest is about!"
                                                trigger={<h3>Quest Description</h3>}
                                            />
                                            <TextArea
                                                name="questDesc"
                                                placeholder="Description"
                                                onChange={this.handleChange}
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
                                                name="questCategory"
                                                placeholder="Select a Category"
                                                fluid
                                                selection
                                                options={categories}
                                                onChange={this.handleDropdownChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How much FIQ (Financial IQ) points will the players earn upon completing the quest?"
                                                trigger={<h3>Overall FIQ Points</h3>}
                                            />
                                            <Dropdown
                                                name="questPoints"
                                                placeholder="Select overall FIQ awarded"
                                                fluid
                                                selection
                                                clearable
                                                options={FIQoptions}
                                                onChange={this.handleDropdownChange}
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
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How happy or sad will your character be at the start of the quest? (0 = Griefstricken, 100 = Happy)"
                                                trigger={<h3>Character Starting Mood</h3>}
                                            />
                                            <Dropdown
                                                name="characterMood"
                                                defaultValue={100}
                                                fluid
                                                selection
                                                clearable
                                                options={moodOptions}
                                                onChange={this.handleDropdownChange}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Popup
                                                content="How will your quest begin?"
                                                trigger={<h3>Quest Introduction</h3>}
                                            />
                                            <TextArea
                                                name="questIntro"
                                                placeholder="Introduction"
                                                onChange={this.handleChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How will your quest end?"
                                                trigger={<h3>Quest Conclusion</h3>}
                                            />
                                            <TextArea
                                                name="questConc"
                                                placeholder="Conclusion"
                                                onChange={this.handleChange}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </Segment>
                        {scenarios}
                        <div className="subContainer" style={{ padding: '25px 0px', textAlign: 'right' }}>
                            <Button onClick={() => this.setState({ redirect: '/quizzes' })}>Back</Button>
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
                            <Button className="blue" name="createQuest" onClick={this.handleSubmit}>
                                Create Quest
                        </Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default QuestCreation;
