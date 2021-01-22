import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import { Button } from 'semantic-ui-react';
import { host, inProduction } from '../../common.js';
import QuizPlayContainer from './QuizPlayContainer.js';
import QuizQuestionPlay from './QuizQuestionPlay.js';
import retrieveItems from '../retrieveItems.js';
import './animations.css'

class QuizPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 1,
            stateTypes: { isStarting: 1, isTransitioning: 2, isPlaying: 3, isFinished: 4 },
            quiz: {},
            questions: [],
            answers: [],
            currentQuestion: 1,
            maxQuestions: 0,
            score: 0,
            totalPoints: 0,
            explanationActiveItem: 0,
            transitionDuration: 4, // The amount of time, in seconds, the player has to read the question prior to it being loaded
            afterAnsweringDelay: 2, // The amount of time, in seconds, the player has to see the correct/incorrect answers after answering, before it transitions
            redirect: null,
        };

        // Prevents the function inside setTimeout from being executed if the user abruptly leaves the quiz (i.e. component gets unmounted)
        // in two situations: 1. Leaving the quiz during a transition or 2. Leaving the quiz after answering, but not before the next question has loaded
        // Has to be a class property instead of a state property since setState will not update the variable immediately during component mounting/unmounting
        this._isMounted = false;
    }

    handleStart = () => {
        this.setState({ state: this.state.stateTypes.isTransitioning });
    };

    handleRestart = () => {
        this.setState({ state: this.state.stateTypes.isStarting, currentQuestion: 1, answers: [], score: 0, totalPoints: 0 });
    };

    transitionToNextQuestion() {
        setTimeout(() => { if (this._isMounted) this.setState({ state: this.state.stateTypes.isPlaying }) }, (this.state.transitionDuration * 1000));
    }

    onQuestionAnswered = (option, isCorrect, points) => {
        if (this.state.currentQuestion < (this.state.maxQuestions)) {

            if (isCorrect) this.setState({ score: this.state.score + 1, totalPoints: this.state.totalPoints + points });

            // Wait a short while before loading the next question 
            setTimeout(() => {
                if (this._isMounted)
                    this.setState({
                        state: this.state.stateTypes.isTransitioning,
                        currentQuestion: this.state.currentQuestion + 1,
                        answers: [...this.state.answers, { "name": option, "isCorrect": isCorrect }]
                    })
            }, (this.state.afterAnsweringDelay * 1000));

        } else {

            if (isCorrect) {
                this.setState({ score: this.state.score + 1, totalPoints: this.state.totalPoints + points }, () => {
                    this.updateFIQ();
                });
            } else {
                this.updateFIQ();
            }

            // Wait a short while before loading the results screen
            setTimeout(() => {
                if (this._isMounted)
                    this.setState({
                        state: this.state.stateTypes.isFinished,
                        answers: [...this.state.answers, { "name": option, "isCorrect": isCorrect }]
                    })
            },
                (this.state.afterAnsweringDelay * 1000));
        }
    };

    updateFIQ() {
        if (!inProduction) {
            let user = JSON.parse(sessionStorage.getItem("user"));
            let newFIQ = user.FIQ + this.state.totalPoints;

            axios.patch(`${host}/fiq/${user.id}`, { FIQ: newFIQ })
                .then(() => {
                    user.FIQ = newFIQ;
                    sessionStorage.setItem("user", JSON.stringify(user));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    // Currently only displays the first correct answer found if the player answered incorrectly
    // No support for displaying multiple correct answers yet

    // BUG - Crashes the application if NO correct answers were set during quiz creation
    // Implement input validation on quiz creation to ensure that at least one correct answer is set per question during quiz creation
    renderExplanation() {
        let index = this.state.explanationActiveItem;

        switch (index) {
            case this.state.questions.length:
                return (
                    <div>
                        <h1>Game has ended!</h1>
                        <h2>
                            You answered {this.state.score} / {this.state.maxQuestions} questions correctly.
                            </h2>
                        <h2>You have earned {this.state.totalPoints} FIQ!</h2>
                        <Button color="teal" size="big" onClick={this.handleRestart}>
                            Play Again?
                            </Button>
                    </div>
                )
            case index:
                const question = JSON.parse(this.state.questions[index]).question;
                const { answers } = this.state;
                if (question.name && answers[index].name !== undefined) {
                    // answers[index].name will be null if the user doesn't answer (i.e. ran out of time)
                    // answers[index].name will be undefined if the options text is missing (should not happen with proper input validation)
                    // on the QuizCreation component
                    return (
                        <div>
                            <h1>{question.name}</h1>
                            <h3>You answered: {answers[index] ? answers[index].name !== null ? `${answers[index].name}, which was ${answers[index].isCorrect ? 'correct' : 'incorrect'}!` : 'Nothing...' : 'Nothing...'}</h3>
                            {!this.state.answers[index].isCorrect ? question.options.find(element => element.isCorrect).name ? <h3>The correct answer was: {question.options.find(element => element.isCorrect).name}</h3> : "" : ""}
                            <h3>{question.explanation ? `Explanation: ${question.explanation}` : "No explanation available..."}</h3>
                        </div>
                    )
                } else {
                    return (
                        <h1>Something went wrong!</h1>
                    )
                }
            default:
                return (
                    <h1>Something went wrong!</h1>
                )
        }
    }

    componentDidMount() {
        this._isMounted = true;
        // props will be undefined if the user navigates to this component directly via the URL
        if (this.props.location.quiz !== undefined) {
            retrieveItems(`quiz/${this.props.location.quiz.quizId}`).then((data) => {
                let questions = [];

                data.forEach((element) => {
                    questions.push(element.question);
                });

                delete data[0].question;

                this.setState({ quiz: data[0], questions: questions, maxQuestions: questions.length }, () => {
                    console.log(this.state.quiz);
                    this.setState({ explanationActiveItem: questions.length });
                });
            });
        } else {
            // Redirect users to /quizzes if they attempt to access this component directly via the URL
            this.setState({ redirect: '/quizzes' });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { state, stateTypes } = this.state;

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        }

        if (this._isMounted) {
            switch (state) {
                case stateTypes.isStarting:
                    return (
                        <QuizPlayContainer>
                            <div className="subContainer" style={{ paddingTop: '150px' }}>
                                <h1>Welcome to {this.state.quiz.quizName}!</h1>
                                <Button color="teal" size="big" onClick={this.handleStart}>
                                    Start Quiz
                            </Button>
                            </div>
                        </QuizPlayContainer>
                    );
                case stateTypes.isTransitioning:
                    return (
                        <QuizPlayContainer>
                            <div className="subContainer" style={{
                                paddingTop: '150px', maxWidth: '80%', margin: 'auto', animation: `fadeInAndOut ${this.state.transitionDuration}s linear`
                            }}>
                                <h1>Question {this.state.currentQuestion}</h1>
                                <h2>{JSON.parse(this.state.questions[this.state.currentQuestion - 1]).question.name}</h2>
                                {this.transitionToNextQuestion()}
                            </div>
                        </QuizPlayContainer>
                    );
                case stateTypes.isPlaying:
                    return (
                        <QuizPlayContainer>
                            <QuizQuestionPlay
                                questionNumber={this.state.currentQuestion}
                                question={this.state.questions[this.state.currentQuestion - 1]}
                                globalPointsPerQuestion={this.state.quiz.pointsPerQuestion}
                                globalTimePerQuestion={this.state.quiz.timePerQuestion}
                                onQuestionAnswered={this.onQuestionAnswered}
                            ></QuizQuestionPlay>
                        </QuizPlayContainer>
                    );
                case stateTypes.isFinished:
                    return (
                        <QuizPlayContainer style={{ height: '100%' }}>
                            {this.state.questions.map((value, index) => {
                                return (
                                    <Button key={index} circular color={index !== this.state.explanationActiveItem ? this.state.answers[index] ? this.state.answers[index].isCorrect ? 'green' : 'red' : 'red' : 'black'}
                                        onClick={() => { this.setState({ explanationActiveItem: index }) }}>{index + 1}</Button>
                                )
                            })}
                            <Button circular color={this.state.questions.length !== this.state.explanationActiveItem ? 'yellow' : 'black'}
                                onClick={() => { this.setState({ explanationActiveItem: this.state.questions.length }) }}>End</Button>
                            <div className="subContainer" style={{ paddingTop: '100px' }}>
                                {this.renderExplanation()}
                            </div>
                        </QuizPlayContainer>
                    );
                default:
                    return <h1>Something went wrong!</h1>;
            }
        } else {
            return null;
        }
    }
}

export default QuizPlay;
