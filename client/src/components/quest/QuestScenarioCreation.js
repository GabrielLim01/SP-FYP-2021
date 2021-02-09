import React from 'react';
import { Segment, Form, Divider, Grid, TextArea, Dropdown, Checkbox } from 'semantic-ui-react';

class QuestScenarioCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rateOptionsRange: 10,
        };
    }

    onSelectedChange = (event) => {
        let checkbox =
            event.target.tagName === 'LABEL' ? event.target.previousElementSibling : event.target.firstElementChild;
        this.setState({ [checkbox.name]: !checkbox.checked });
        this.props.handleCheckboxChange(checkbox);
    };

    renderEventOptions(number, value) {
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
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column style={{ display: 'flex' }}>
                        <h3 style={{ width: '15%' }}>Mood Change</h3>
                        <Dropdown
                            name={`moodChange-${number}-${value}`}
                            placeholder="Select mood change type"
                            style={{ width: '20%' }}
                            defaultValue={1}
                            fluid
                            selection
                            clearable
                            options={moodChangeOptions}
                            onChange={this.props.handleDropdownChange}
                        />
                        <Dropdown
                            name={`moodChangeValue-${number}-${value}`}
                            placeholder="Specify the amount to modify the mood by"
                            style={{ marginLeft: '20px', width: '20%' }}
                            defaultValue={10}
                            fluid
                            selection
                            clearable
                            options={rateOptions}
                            onChange={this.props.handleDropdownChange}
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
                            maxLength="500"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const number = this.props.scenarioNumber;
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
                                    name={'scenario-' + number + '-desc'}
                                    placeholder="Description"
                                    onChange={this.props.handleChange}
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
                                                />
                                                <Checkbox
                                                    toggle
                                                    label="Has Event?"
                                                    name={`hasEvent-${number}-${value}`}
                                                    style={{ padding: '20px 0px' }}
                                                    onClick={(event) => this.onSelectedChange(event, index)}
                                                />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <TextArea
                                                    name={`choiceDesc-${number}-${value}`}
                                                    placeholder={'Description ' + value}
                                                    onChange={this.props.handleChange}
                                                    maxLength="500"
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                {this.state[`hasEvent-${number}-${value}`] !== undefined &&
                                                this.state[`hasEvent-${number}-${value}`] !== false
                                                    ? this.renderEventOptions(number, value)
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

export default QuestScenarioCreation;
