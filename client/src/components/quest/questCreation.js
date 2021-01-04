import React from 'react';
//import { Redirect } from 'react-router-dom';
import { Button, Dropdown, Popup, Icon } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import QuestScenarioCreation from './questScenarioCreation.js';
import retrieveItems from '../quiz/retrieveItems.js';

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

    onAddScenario = () => {
        if (this.state.scenario < this.state.maxScenario) {
            this.setState({
                scenario: this.state.scenario + 1,
            });
        } else {
            alert('Maximum number of scenarios reached!');
        }
    };

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    handleSubmit = (event) => {};

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
                    //handleDropdownChange={this.handleDropdownChange}
                />,
            );
        }
        return (
            <div className="container" style={{ textAlign: 'left' }}>
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1>Create New Quest</h1>
                    </div>
                    <div className="ui stacked segment">
                        <form className="ui form">
                            <div className="equal width fields">
                                <div className="field">
                                    <h3>Title</h3>
                                    <div className="ui fluid input">
                                        <input type="text" placeholder="Title" />
                                    </div>

                                    <Popup
                                        content="How much FIQ (Financial IQ) points should players earn upon completion of the quest?"
                                        trigger={<h3>Fiq Points</h3>}
                                    />
                                    <div className="ui fluid input">
                                        <input type="text" placeholder="Fiq Points" />
                                    </div>

                                    <h3>Category</h3>
                                    <Dropdown
                                        name="Category"
                                        placeholder="Select Option"
                                        fluid
                                        selection
                                        options={categoryItems}
                                        onChange={this.handleDropdownChange}
                                    />
                                </div>
                                <div className="field">
                                    <h3>Description / Objective</h3>
                                    <div className="ui fluid input">
                                        <textarea type="text" placeholder="Description / Objective" />
                                    </div>
                                </div>
                            </div>
                            {scenarios}
                            <div className="subContainer" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button className="blue" name="createQuiz" onClick={this.handleSubmit}>
                                    Create Quest
                                </Button>
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuestCreation;
