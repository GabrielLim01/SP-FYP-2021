import React from 'react';
import { Segment, Form, Grid, Divider, TextArea, Checkbox } from 'semantic-ui-react'

// UNFINISHED
// Modify options format from this
// 1 | 3
// 2 | 4
//
// into this
// 1 | 2
// 3 | 4

class QuizQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: 4
        };
    }

    render() {
        const options = ['a', 'b', 'c', 'd']

        const number = this.props.number;

        return (
            <div className="container" style={{ padding: '25px 0px' }}>
                <Segment>
                    <Form>
                        <h2>Question {number}</h2>
                        <Divider></Divider>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <h3>Title</h3>
                                <input type="text" name={"question" + number + "name"} placeholder="Title" onChange={this.handleChange} />
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Description</h3>
                                <TextArea placeholder='Description' name={"question" + number + "desc"} onChange={this.props.handleChange} />
                            </Grid.Column>
                        </Grid>
                        <h3>Options</h3>
                        <div style={{ columns: '2 auto'}}>
                            {options.map((value, index) => {
                                return (
                                    <div className="field" key={index}>
                                        <input type="text" name={"option" + number + value} placeholder={"Option " + (index + 1)} onChange={this.props.handleChange} />
                                        <Checkbox label='Correct Answer?' name={"isCorrect" + number + value} style={{ padding: '20px 0px' }} />
                                    </div>
                                )
                            })}
                        </div>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestion;