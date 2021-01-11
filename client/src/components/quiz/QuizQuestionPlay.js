import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import QuizTimer from './QuizTimer.js';

// This component handles loading of quiz questions 

// Code for clockRef and related functions are taken from here 
// https://stackoverflow.com/questions/59130667/how-to-call-start-and-pause-functions-from-the-react-countdown-now-library

// The overall code in this component is quite a mess (but it works), and would greatly benefit off a code cleanup

class QuizQuestionPlay extends React.Component {
    clockRef = null;

    constructor(props) {
        super(props);

        let question = JSON.parse(this.props.question).question;

        this.state = {
            question: question,
            options: question.options,
            questionNumber: props.questionNumber,
            globalPointsPerQuestion: props.globalPointsPerQuestion,
            globalTimePerQuestion: props.globalTimePerQuestion,
            hasAnswered: false,
            temporaryTime: 0
        };

        if (this.state.question.time) {
            this.remainingTime = question.time;
        } else {
            this.remainingTime = this.state.globalTimePerQuestion;
        }

        this.setClockRef = this.setClockRef.bind(this);
        this.pause = this.pause.bind(this);
    }

    handleAnswer(answer) {
        // setState triggers a re-render and resets the remainingTime back to the default time value,
        // so we want to store the remainingTime value in a temporaryTime property so that the player
        // does not abruptly see the timer reset back to the default time value in the QuizTimer component
        this.setState({ hasAnswered: true, temporaryTime: this.remainingTime })

        // Pause the quiz timer when an answer has been registered
        this.pause();

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

    pause() {
        this.clockRef.pause();
    }

    setClockRef(ref) {
        // When the `Clock` (and subsequently `Countdown` mounts
        // this will give us access to the API
        this.clockRef = ref;
    }

    componentDidUpdate(prevState) {
        let currentQuestion = this.props.question;
        let question = JSON.parse(this.props.question).question;

        // Both of the following are strings
        if (currentQuestion !== prevState.question) {
            this.setState({
                hasAnswered: false,
                question: question,
                options: question.options,
                questionNumber: this.props.questionNumber
            })
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
                        time={this.state.hasAnswered ? this.state.temporaryTime : question.time ? question.time : this.state.globalTimePerQuestion}
                        hasAnswered={this.state.hasAnswered}
                        onTick={(remainingTime) => { this.remainingTime = remainingTime }}
                        onCountdownComplete={() => this.handleAnswer(false)}
                        refCallback={this.setClockRef}
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
                                <Button color={this.state.hasAnswered ? element.isCorrect ? 'green' : 'red' : 'teal'}
                                    name={`options-${index}`}
                                    style={this.state.hasAnswered ? { margin: '5px 0px' } : { margin: '5px 0px' }}
                                    onClick={() => this.handleAnswer(element.isCorrect)}
                                    disabled={this.state.hasAnswered}>
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