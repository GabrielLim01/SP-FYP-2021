import React from 'react';
import { Segment, Grid, Divider, TextArea, Form, Accordion } from 'semantic-ui-react';

class QuestScenarioCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSelectedChange = (event, index) => {
        this.setState((previousState) => ({
            checked: {
                ...previousState.checked,
                [index]: !previousState.checked[index],
            },
        }));

        let checkbox = event.target.previousElementSibling;
        this.props.handleCheckboxChange(checkbox);
    };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };

    panels = [
        {
            key: 'details',
            title: 'Add-on Details',
            content: {
                as: Form.TextArea,
                label: 'Pros / Cons',
                placeholder: 'Description',
            },
        },
    ];

    render() {
        const number = this.props.scenarioNumber;
        const options = [];

        for (let i = 1; i < this.props.options + 1; i++) {
            options.push(i);
        }

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <Form>
                        <h2>Scenario {number}</h2>
                        <Divider></Divider>
                        <Grid columns="equal">
                            <Grid.Column>
                                <h3>Title</h3>
                                <input
                                    type="text"
                                    name={'scenario' + number + 'name'}
                                    placeholder="Title"
                                    onChange={this.props.handleChange}
                                />
                            </Grid.Column>
                        </Grid>
                        <h3>Options</h3>
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
                                                <Accordion
                                                    as={Form.Field}
                                                    style={{ padding: '20px 0px' }}
                                                    panels={this.panels}
                                                    onChange={this.props.handleChange}
                                                />
                                            </div>
                                        </Grid.Column>
                                    );
                                })}
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Segment>
            </div>
        );
    }
}

export default QuestScenarioCreation;
