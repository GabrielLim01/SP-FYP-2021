import React from 'react';
import { Segment, Form, Grid, Divider, TextArea, Checkbox } from 'semantic-ui-react'

class QuizQuestion extends React.Component {
    render() {
        const number = this.props.questionNumber;
        const noOfOptions = this.props.options;
        const options = [];

        for (let i = 1; i < (noOfOptions + 1); i++) {
            options.push(i)
        }

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <Form>
                        <h2>Question {number}</h2>
                        <Divider></Divider>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <h3>Title</h3>
                                <input type="text" name={"question" + number + "name"} placeholder="Title" onChange={this.props.handleChange} />
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Description</h3>
                                <TextArea name={"question" + number + "desc"} placeholder='Description' onChange={this.props.handleChange} />
                            </Grid.Column>
                        </Grid>
                        <h3>Options</h3>
                        <Grid>
                            <Grid.Row columns={2}>
                                {options.map((value, index) => {
                                    return (
                                        <Grid.Column key={"options-" + number + "-" + value}>
                                            <div className="field">
                                                <input type="text" name={"option-" + number + "-" + value} placeholder={"Option " + value} onChange={this.props.handleChange} />
                                                <Checkbox label='Correct Answer?' name={"isCorrect-" + number + "-" + value} style={{ padding: '20px 0px' }} onChange={this.props.handleChange} />
                                            </div>
                                        </Grid.Column>
                                    )
                                })}
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestion;