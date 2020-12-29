import React from 'react';
import { Segment, Form, Grid, Divider, Popup, TextArea, Dropdown, Checkbox } from 'semantic-ui-react'

class QuizQuestionCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: {}
        };
    }

    onSelectedChange = (event, index) => {
        this.setState(previousState => ({
            checked: {
                ...previousState.checked,
                [index]: !previousState.checked[index]
            }
        }));

        // event.target retrieves the label element instead of the checkbox element
        // the checkbox element is directly before the label element in the DOM hierarchy, 
        // so attach .previousElementSibling to access it
        let checkbox = event.target.previousElementSibling;
        this.props.handleCheckboxChange(checkbox)
    };

    render() {
        const number = this.props.questionNumber;
        const options = [];
        const FIQoptions = [];
        const timeOptions = [];

        // Dynamically generate an array of option indices
        for (let i = 1; i < (this.props.options + 1); i++) {
            options.push(i)
        }

        for (let i = 1; i < this.props.fiqOptionsRange; i++) {
            let value = 25 * i
            FIQoptions.push({ text: value, value: value });
        };

        for (let i = 1; i < this.props.timeOptionsRange; i++) {
            let value = 5 * i
            timeOptions.push({ text: value, value: value });
        };

        // Prevents more than 1 checkbox from being checked at any point in time (customisable)
        const { checked } = this.state;
        const checkedCount = Object.keys(checked).filter(key => checked[key]).length;
        const disabled = checkedCount > 0;

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <Form>
                        <h2>Question {number}</h2>
                        <Divider></Divider>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <Popup content='Input your question here!' trigger={<h3>Question</h3>} />
                                <input type="text" name={"question" + number + "name"} placeholder="Question" onChange={this.props.handleChange} />
                            </Grid.Column>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Popup content='How much FIQ (Financial IQ) points should players earn upon correctly answering this question?' trigger={<h3>FIQ awarded</h3>} />
                                    <Dropdown
                                        name='quizPoints'
                                        placeholder='Select FIQ for this question'
                                        fluid
                                        selection
                                        clearable
                                        options={FIQoptions}
                                        onChange={this.props.handleDropdownChange}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Popup content='How much time (in seconds) will the player have to answer this question?' trigger={<h3>Time</h3>} />
                                    <Dropdown
                                        name='quizTime'
                                        placeholder='Select time (seconds) to answer this question'
                                        fluid
                                        selection
                                        clearable
                                        options={timeOptions}
                                        onChange={this.props.handleDropdownChange}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <h3>Options</h3>
                        <Grid>
                            <Grid.Row columns={2}>
                                {options.map((value, index) => {
                                    return (
                                        <Grid.Column key={"options-" + number + "-" + value}>
                                            <div className="field">
                                                <input type="text" name={"option-" + number + "-" + value} placeholder={"Option " + value} onChange={this.props.handleChange} />
                                                <Checkbox
                                                    label='Correct Answer?'
                                                    name={"isCorrect-" + number + "-" + value}
                                                    style={{ padding: '20px 0px' }}
                                                    onChange={(event) => this.onSelectedChange(event, index)}
                                                    checked={checked[index] || false}
                                                    disabled={!checked[index] && disabled}
                                                />
                                            </div>
                                        </Grid.Column>
                                    )
                                })}
                            </Grid.Row>
                        </Grid>
                        <Grid>
                            <Grid.Column>
                                <Popup content='Let your players know why their selected answer was correct/incorrect!' trigger={<h3>Answer Explanation</h3>} />
                                <TextArea name={"question" + number + "desc"} placeholder='Description' onChange={this.props.handleChange} />
                            </Grid.Column>
                        </Grid>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestionCreation;