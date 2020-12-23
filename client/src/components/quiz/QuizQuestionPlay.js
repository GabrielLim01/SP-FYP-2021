import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import QuizTimer from './QuizTimer.js';

class QuizQuestionPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {},
            options: 4,
            isRendered: false
        };
    }

    // onOptionSelected(){
    //     // do a few things....

    //     this.props.onAnswerQuestion({});
    // }

    render() {
        const number = 1;
        const options = [];

        // Dynamically generate an array of option indices
        for (let i = 1; i < (this.state.options + 1); i++) {
            options.push(i)
        }

        return (
            <div className="container">
                <QuizTimer></QuizTimer>
                <Segment raised inverted color='teal' style={{ height: '200px' }}>
                    <div className="subContainer">
                        Test
                        </div>
                </Segment>
                <Segment raised inverted color='teal' style={{ height: '200px' }}>
                    <Grid>
                        <Grid.Row columns={2}>
                            {options.map((value) => {
                                return (
                                    <Grid.Column stretched key={"options-" + number + "-" + value}>

                                            <Button color="blue" name={"option-" + number + "-" + value} placeholder={"Option " + value} onChange={this.props.handleChange}>
                                                Test
                                                </Button>

                                    </Grid.Column>
                                )
                            })}
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}

export default QuizQuestionPlay; 