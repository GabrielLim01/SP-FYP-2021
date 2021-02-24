import React from 'react';
import { Segment, Form, Divider, Grid, TextArea, Dropdown, Checkbox } from 'semantic-ui-react';

class QuestScenarioUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scenario: props.scenario,
            number: props.scenarioNumber,
            rateOptionsRange: 10,
        };
    }

    onSelectedChange = (event) => {
        let checkbox =
            event.target.tagName === 'LABEL' ? event.target.previousElementSibling : event.target.firstElementChild;
        this.setState({ [checkbox.name]: !checkbox.checked });
        this.props.handleCheckboxChange(checkbox);
    };

    renderEventOptions(scenario, number, value) {
        let event = {};

        if (scenario.choices[value - 1].event) {
            event = {
                title: scenario.choices[value - 1].event.name,
                desc: scenario.choices[value - 1].event.description,
                procRate: scenario.choices[value - 1].event.eventProcRate,
                moodChangeType: scenario.choices[value - 1].event.moodChange,
                moodChangeValue: scenario.choices[value - 1].event.moodChangeValue,
            };
        }

        const moodChangeOptions = [
            { text: 'Increase', value: 1 },
            { text: 'Decrease', value: 2 },
        ];
        const rateOptions = [];

        for (let i = 1; i < this.state.rateOptionsRange + 1; i++) {
            let value = 10 * i;
            rateOptions.push({ text: value, value: value });
        }

        return (
            <Grid style={{ padding: '10px 0px' }}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <h3>Event Title</h3>
                        <input
                            type="text"
                            name={`event-${number}-${value}`}
                            placeholder="Event Title"
                            onChange={this.props.handleChange}
                            defaultValue={event.title ? event.title : ''}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <h3>Chance of event occurring</h3>
                        <Dropdown
                            name={`eventProcRate-${number}-${value}`}
                            placeholder="Select chance of event occurring"
                            fluid
                            selection
                            clearable
                            options={rateOptions}
                            onChange={this.props.handleDropdownChange}
                            defaultValue={event.procRate ? event.procRate : 10}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column style={{ display: 'flex' }}>
                        <h3 style={{ width: '15%' }}>Mood Change</h3>
                        <Dropdown
                            name={`moodChange-${number}-${value}`}
                            placeholder="Select the type of mood change"
                            style={{ width: '20%' }}
                            fluid
                            selection
                            clearable
                            options={moodChangeOptions}
                            onChange={this.props.handleDropdownChange}
                            defaultValue={event.moodChangeType ? event.moodChangeType : 1}
                        />
                        <Dropdown
                            name={`moodChangeValue-${number}-${value}`}
                            placeholder="Specify the amount to modify the mood by"
                            style={{ marginLeft: '20px', width: '20%' }}
                            fluid
                            selection
                            clearable
                            options={rateOptions}
                            onChange={this.props.handleDropdownChange}
                            defaultValue={event.moodChangeValue ? event.moodChangeValue : 10}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <h3>Description</h3>
                        <TextArea
                            name={`eventDesc-${number}-${value}`}
                            placeholder="Description"
                            onChange={this.props.handleChange}
                            defaultValue={event.desc ? event.desc : ''}
                            maxLength="100"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    componentDidMount() {
        for (let i = 1; i < this.state.scenario.choices.length + 1; i++) {
            if (this.state.scenario.choices[i - 1].event) {
                this.setState({ [`hasEvent-${this.state.number}-${i}`]: true });
            }
        }
    }

    render() {
        const { scenario, number } = this.state;
        const choices = [];

        for (let i = 1; i < this.props.choices + 1; i++) {
            choices.push(i);
        }

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <Form>
                        <h2>Scenario {number}</h2>
                        <Divider></Divider>
                        <Grid columns="equal">
                            <Grid.Column>
                                <h3>Description</h3>
                                <TextArea
                                    name={`scenario-${number}-description`}
                                    placeholder="Description"
                                    onChange={this.props.handleChange}
                                    defaultValue={scenario.description}
                                    maxLength="500"
                                />
                            </Grid.Column>
                        </Grid>
                        {choices.map((value, index) => {
                            return (
                                <div key={'choices-' + number + '-' + value}>
                                    <h3 style={{ paddingTop: '20px' }}>Choice {value}</h3>
                                    <Divider></Divider>
                                    <Grid columns="equal">
                                        <Grid.Row columns={2}>
                                            <Grid.Column>
                                                <input
                                                    type="text"
                                                    name={`choice-${number}-${value}`}
                                                    placeholder={'Choice ' + value}
                                                    onChange={this.props.handleChange}
                                                    defaultValue={scenario.choices[index].name}
                                                />
                                                <Checkbox
                                                    toggle
                                                    label="Has Event?"
                                                    name={`hasEvent-${number}-${value}`}
                                                    style={{ padding: '20px 0px' }}
                                                    defaultChecked={scenario.choices[index].event ? true : false}
                                                    onClick={(event) => this.onSelectedChange(event, index)}
                                                />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <TextArea
                                                    name={`choiceDesc-${number}-${value}`}
                                                    placeholder={'Description ' + value}
                                                    onChange={this.props.handleChange}
                                                    defaultValue={scenario.choices[index].description}
                                                    maxLength="500"
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                {this.state[`hasEvent-${number}-${value}`] !== undefined &&
                                                    this.state[`hasEvent-${number}-${value}`] !== false
                                                    ? this.renderEventOptions(scenario, number, value)
                                                    : ''}
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </div>
                            );
                        })}
                    </Form>
                </Segment>
            </div>
        );
    }
}

export default QuestScenarioUpdate;
