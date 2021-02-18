import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import QuizTimer from './QuizTimer.js';
import './animations.css';

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
            temporaryTime: 0,
            isAnimating: false,
            animationDelay: 2,
        };

        if (this.state.question.time) {
            this.remainingTime = question.time;
        } else {
            this.remainingTime = this.state.globalTimePerQuestion;
        }

        this.setClockRef = this.setClockRef.bind(this);
        this.pause = this.pause.bind(this);
        this._isMounted = false;
    }

    handleAnswer(option, isCorrect) {
        this.setState({ hasAnswered: true, temporaryTime: this.remainingTime });

        this.pause();

        let points = 0;

        if (isCorrect) {
            let basePoints = 0;
            let baseTime = 0;
            if (this.state.question.points) {
                basePoints = this.state.question.points;
            } else {
                basePoints = this.state.globalPointsPerQuestion;
            }

            if (this.state.question.time) {
                baseTime = this.state.question.time;
            } else {
                baseTime = this.state.globalTimePerQuestion;
            }

            points = Math.floor(basePoints * (this.remainingTime / baseTime));
        }
        this.props.onQuestionAnswered(option, isCorrect, points);
    }

    componentDidUpdate(prevState) {
        if (this.state.question.time) {
            this.remainingTime = question.time;
        } else {
            this.remainingTime = this.state.globalTimePerQuestion;
        }

        let currentQuestion = this.props.question;
        let question = JSON.parse(this.props.question).question;

        if (currentQuestion !== prevState.question) {
            this.setState({
                hasAnswered: true,
                temporaryTime: this.remainingTime,
                isAnimating: true,
                question: question,
                options: question.options,
                questionNumber: this.props.questionNumber,

            }, () => {
                setTimeout(() => {
                    if (this._isMounted) {
                        this.start();
                        this.setState({ hasAnswered: false, isAnimating: false });
                    }
                }, this.state.animationDelay * 1000);
            });
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.pause();
        this.setState({ hasAnswered: true, isAnimating: true, temporaryTime: this.remainingTime });

        setTimeout(() => {
            if (this._isMounted) {
                this.start();
                this.setState({ hasAnswered: false, isAnimating: false });
            }
        }, this.state.animationDelay * 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setClockRef(ref) {
        this.clockRef = ref;
    }

    pause() {
        this.clockRef.pause();
    }

    start() {
        this.clockRef.start();
    }

    render() {
        const question = this.state.question;
        const number = this.state.questionNumber;

        return (
            <Grid key={number} style={{ height: '100%' }}>
                <Grid.Row
                    style={{
                        margin: '0px 20px',
                        opacity: '0',
                        animation: `fadeIn 0.3s linear ${this.state.animationDelay}s forwards`,
                    }}
                >
                    <QuizTimer
                        time={
                            this.state.hasAnswered
                                ? this.state.temporaryTime
                                : question.time
                                    ? question.time
                                    : this.state.globalTimePerQuestion
                        }
                        hasAnswered={this.state.hasAnswered}
                        onTick={(remainingTime) => {
                            this.remainingTime = remainingTime;
                        }}
                        onCountdownComplete={() => this.handleAnswer(null, false)}
                        refCallback={this.setClockRef}
                    ></QuizTimer>
                </Grid.Row>
                <Grid.Row style={{ height: '50%' }}>
                    <Segment
                        raised
                        inverted
                        color="teal"
                        style={{
                            width: '100%',
                            margin: '0px 20px',
                            opacity: '0',
                            animation: `fadeIn 0.3s linear forwards`,
                        }}
                    >
                        <h1>Question {number}</h1>
                        <h2 style={{ maxWidth: '80%', margin: 'auto' }}>{question.name}</h2>
                    </Segment>
                </Grid.Row>
                <Grid.Row
                    columns={2}
                    style={{
                        height: '30%',
                        margin: '0px 5px',
                        opacity: '0',
                        animation: `fadeIn 0.3s linear ${this.state.animationDelay}s forwards`,
                    }}
                >
                    {this.state.options.map((element, index) => {
                        return (
                            <Grid.Column stretched key={index + 1}>
                                <Button
                                    color={this.state.hasAnswered ? (element.isCorrect ? 'green' : 'red') : 'teal'}
                                    name={`options-${index}`}
                                    style={
                                        this.state.hasAnswered
                                            ? { margin: '5px 0px', pointerEvents: 'none' }
                                            : { margin: '5px 0px' }
                                    }
                                    onClick={() => this.handleAnswer(element.name, element.isCorrect)}
                                >
                                    <h3>{element.name}</h3>
                                </Button>
                            </Grid.Column>
                        );
                    })}
                </Grid.Row>
                <Grid.Row style={{ height: '10%' }}>
                    <Grid.Column textAlign="right">
                        {this.state.hasAnswered && !this.state.isAnimating ? (
                            <Button color="teal" size="big" onClick={() => this.props.loadNextQuestion()}>
                                Next Question
                            </Button>
                        ) : (
                                ''
                            )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default QuizQuestionPlay;
