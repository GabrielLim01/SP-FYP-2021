import React from 'react';
import { Segment, Form, Grid, Divider, Popup, TextArea, Dropdown, Checkbox } from 'semantic-ui-react'

class QuizQuestionUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: props.question,
            number: props.questionNumber
        };
    }

    onSelectedChange = (event, index) => {
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
        const { question } = this.state.question;
        const { number } = this.state
        const FIQoptions = [];
        const timeOptions = [];

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
                                <input type="text"
                                    name={"question" + number + "name"}
                                    placeholder="Question"
                                    onChange={this.props.handleChange}
                                    defaultValue={question.name}
                                />
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
                                        defaultValue={question.points}
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
                                        defaultValue={question.time}
                                        onChange={this.props.handleDropdownChange}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <h3>Options *</h3>
                        <Grid>
                            <Grid.Row columns={2}>
                                {question.options.map((element, index) => {
                                    let questionIndex = index + 1
                                    return (
                                        <Grid.Column key={"options-" + number + "-" + questionIndex}>
                                            <div className="field">
                                                <input
                                                    type="text"
                                                    name={"option-" + number + "-" + questionIndex}
                                                    placeholder={"Option " + questionIndex}
                                                    onChange={this.props.handleChange}
                                                    defaultValue={element.name ? element.name : ""}
                                                />
                                                <Checkbox
                                                    label='Correct Answer?'
                                                    name={"isCorrect-" + number + "-" + questionIndex}
                                                    style={{ padding: '20px 0px' }}
                                                    onClick={(event) => this.onSelectedChange(event, index)}
                                                    defaultChecked={element.isCorrect ? element.isCorrect : false}
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
                                <TextArea
                                    name={"question" + number + "explanation"}
                                    placeholder='Description'
                                    onChange={this.props.handleChange}
                                    defaultValue={question.explanation}
                                />
                                <h3 style={{ float: 'right', color: 'red' }}>* required</h3>
                            </Grid.Column>
                        </Grid>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestionUpdate;