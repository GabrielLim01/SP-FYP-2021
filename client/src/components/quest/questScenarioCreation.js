import React from 'react';
import { Segment, Grid, Divider, Popup, TextArea } from 'semantic-ui-react';

class QuestScenarioCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: {},
        };
    }

    onSelectedChange = (event, index) => {
        this.setState((previousState) => ({
            checked: {
                ...previousState.checked,
                [index]: !previousState.checked[index],
            },
        }));

        // event.target retrieves the label element instead of the checkbox element
        // the checkbox element is directly before the label element in the DOM hierarchy,
        // so attach .previousElementSibling to access it
        let checkbox = event.target.previousElementSibling;
        this.props.handleCheckboxChange(checkbox);
    };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };

    render() {
        const number = this.props.scenarioNumber;
        const options = [];
        const FIQoptions = [];
        const timeOptions = [];

        // Dynamically generate an array of option indices
        for (let i = 1; i < this.props.options + 1; i++) {
            options.push(i);
        }

        // Prevents more than 1 checkbox from being checked at any point in time (customisable)
        const { checked } = this.state;
        const checkedCount = Object.keys(checked).filter((key) => checked[key]).length;
        const disabled = checkedCount > 0;

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <h2>Scenario {number}</h2>
                    <Divider></Divider>
                    <Grid columns="equal">
                        <Grid.Column>
                            <Popup content="Input your scenario here!" trigger={<h3>Scenario *</h3>} />
                            <input
                                type="text"
                                name={'scenario' + number + 'name'}
                                placeholder="Scenario"
                                onChange={this.props.handleChange}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid>
                        <Grid.Column>
                            <TextArea
                                name={'question' + number + 'explanation'}
                                placeholder="Description"
                                onChange={this.props.handleChange}
                            />
                            <h3>Options *</h3>
                            <Grid>
                                <Grid.Row columns={2}>
                                    {options.map((value, index) => {
                                        return (
                                            <Grid.Column key={'options-' + number + '-' + value}>
                                                <div className="field">
                                                    <input
                                                        type="text"
                                                        name={'option-' + number + '-' + value}
                                                        placeholder={'Option ' + value}
                                                        onChange={this.props.handleChange}
                                                    />
                                                </div>
                                            </Grid.Column>
                                        );
                                    })}
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

export default QuestScenarioCreation;
