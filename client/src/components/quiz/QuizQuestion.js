import React from 'react';
import { Segment, Form, Grid, Divider, TextArea, Checkbox } from 'semantic-ui-react'

class QuizQuestion extends React.Component {
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

        // Dynamically generate an array of option indices
        const options = [];

        for (let i = 1; i < (this.props.options + 1); i++) {
            options.push(i)
        }

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
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestion;