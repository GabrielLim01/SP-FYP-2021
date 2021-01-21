import React from 'react';
import { Segment, Form, Grid, Divider, Popup, TextArea, Dropdown, Checkbox } from 'semantic-ui-react'

class QuizQuestionCreation extends React.Component {

    onSelectedChange = (event) => {
        // Depending on which part of the checkbox the user clicks, event.target will return either
        // <label>..</label> if the label of the checkbox was clicked, or...
        // <div class="ui toggle checkbox" if the exterior of the checkbox was clicked
        //
        // The input element we need to pass back to handleCheckboxChange, "hidden", is sandwiched between these two elements
        // <div class="ui toggle checkbox">
        //   <input class="hidden" name="isCorrect-1-1" readonly="" tabindex="0" type="checkbox" value=""> 
        //   <label>..</label>
        //
        // For now, in order to ensure that we pass the correct element back, we have to "hardcode" the logic for event.target
        // by attaching .previousElementSibling or .firstElementChild properties to navigate up or down the DOM hierarchy 
        // if the event.target clicked is <label> or <div class="ui toggle checkbox"> respectively

        let checkbox = event.target.tagName === "LABEL" ? event.target.previousElementSibling : event.target.firstElementChild;
        // console.log(checkbox)
        this.props.handleCheckboxChange(checkbox);
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

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <Form>
                        <h2>Question {number}</h2>
                        <Divider></Divider>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <Popup content='Input your question here!' trigger={<h3>Question *</h3>} />
                                <input type="text" name={"question" + number + "name"} placeholder="Question" onChange={this.props.handleChange} />
                            </Grid.Column>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Popup content='How much FIQ (Financial IQ) points should players earn upon correctly answering this question?' trigger={<h3>FIQ awarded</h3>} />
                                    <Dropdown
                                        name={"question" + number + "points"}
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
                                        name={"question" + number + "time"}
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
                        <h3>Options *</h3>
                        <Grid>
                            <Grid.Row columns={2}>
                                {options.map((value, index) => {
                                    return (
                                        <Grid.Column key={"options-" + number + "-" + value}>
                                            <div className="field">
                                                <input type="text" name={"option-" + number + "-" + value} placeholder={"Option " + value} onChange={this.props.handleChange} />
                                                <Checkbox
                                                    toggle
                                                    label='Correct Answer?'
                                                    name={"isCorrect-" + number + "-" + value}
                                                    style={{ padding: '20px 0px' }}
                                                    onClick={(event) => this.onSelectedChange(event)}
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
                                <TextArea name={"question" + number + "explanation"} placeholder='Description' onChange={this.props.handleChange} />
                                <h3 style={{ float: 'right', color: 'red' }}>* required</h3>
                            </Grid.Column>
                        </Grid>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestionCreation;