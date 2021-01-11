import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import QuizTimer from './QuizTimer.js';

//  This component handles loading of quiz questions 

class QuizQuestionPlay extends React.Component {
    constructor(props) {
        super(props);

        let question = JSON.parse(this.props.question).question;

        this.state = {
            question: question,
            options: question.options,
            questionNumber: props.questionNumber,
            globalPointsPerQuestion: props.globalPointsPerQuestion,
            globalTimePerQuestion: props.globalTimePerQuestion,
            isSelected: false,
        };

        if (this.state.question.time) {
            this.remainingTime = question.time;
        } else {
            this.remainingTime = this.state.globalTimePerQuestion;
        }
    }

    handleAnswer(answer) {
        this.setState({ isSelected: true })

        let points = 0;

        if (answer) {
            let basePoints = 0;
            let baseTime = 0;

            // Can probably cut down on if statements here and make the overall handling of 
            // global/customizable points/time values more robust
            if (this.state.question.points) {
                basePoints = this.state.question.points
            } else {
                basePoints = this.state.globalPointsPerQuestion
            }

            if (this.state.question.time) {
                baseTime = this.state.question.time
            } else {
                baseTime = this.state.globalTimePerQuestion
            }

            // Formula to determine FIQ points awarded per correct answer
            points = Math.floor(basePoints * (this.remainingTime / baseTime))
        }
        this.props.onQuestionAnswered(answer, points)
    }

    componentDidUpdate(prevState) {
        let currentQuestion = this.props.question;
        let question = JSON.parse(this.props.question).question;

        // Both of the following are strings
        if (currentQuestion !== prevState.question) {
            this.setState({ isSelected: false, question: question, options: question.options, questionNumber: this.props.questionNumber })
        }

        // Updates the remaining time to use the globally-set value if customizable time is not set for the question
        if (question.time) {
            this.remainingTime = question.time;
        } else {
            this.remainingTime = this.state.globalTimePerQuestion;
        }
    }

    render() {
        const question = this.state.question;
        const number = this.state.questionNumber;

        return (
            <Grid key={number} style={{ height: '100%' }}>
                <Grid.Row style={{ margin: '0px 20px' }}>
                    <QuizTimer
                        time={question.time ? question.time : this.state.globalTimePerQuestion}
                        onTick={(remainingTime) => { this.remainingTime = remainingTime }}
                        onCountdownComplete={() => this.handleAnswer(false)}
                    >
                    </QuizTimer>
                </Grid.Row>
                <Grid.Row style={{ height: '50%' }}>
                    <Segment raised inverted color='teal' style={{ width: '100%', margin: '0px 20px' }}>
                        <h1>Question {number}</h1>
                        <h2 style={{ maxWidth: '50%', margin: 'auto', overflowWrap: 'break-word' }}>{question.name}</h2>
                    </Segment>
                </Grid.Row>
                <Grid.Row columns={2} style={{ height: '35%', margin: '0px 5px' }}>
                    {this.state.options.map((element, index) => {
                        return (
                            <Grid.Column stretched key={index + 1}>
                                <Button color={this.state.isSelected ? element.isCorrect ? 'green' : 'red' : 'teal'}
                                    name={`options-${index}`}
                                    style={this.state.isSelected ? { margin: '5px 0px', opacity: '1' } : { margin: '5px 0px' }}
                                    onClick={() => this.handleAnswer(element.isCorrect)}
                                    disabled={this.state.isSelected}>
                                    <h3>{element.name}</h3>
                                </Button>
                            </Grid.Column>
                        )
                    })}
                </Grid.Row>
            </Grid>

        )
    }
}

export default QuizQuestionPlay; 