import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { host, inProduction } from '../../common.js';
import QuizPlayContainer from './QuizPlayContainer.js';
import QuizQuestionPlay from './QuizQuestionPlay.js';
import retrieveItems from '../retrieveItems.js';
import './animations.css';

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
        };

        this._isMounted = false;
    }

    handleStart = () => {
        this.setState({ state: this.state.stateTypes.isPlaying });
    };

    handleRestart = () => {
        this.setState({
            state: this.state.stateTypes.isStarting,
            currentQuestion: 1,
            answers: [],
            score: 0,
            totalPoints: 0,
        });
    };

    loadNextQuestion = () => {
        if (this.state.currentQuestion < this.state.maxQuestions) {
            this.setState({
                state: this.state.stateTypes.isPlaying,
                currentQuestion: this.state.currentQuestion + 1,
            });
        } else {
            this.setState({
                state: this.state.stateTypes.isFinished,
            });
        }
    };

    onQuestionAnswered = (option, isCorrect, points) => {
        if (this.state.currentQuestion < this.state.maxQuestions) {
            if (isCorrect) this.setState({ score: this.state.score + 1, totalPoints: this.state.totalPoints + points });

            this.setState({ answers: [...this.state.answers, { name: option, isCorrect: isCorrect }] });
        } else {
            if (isCorrect) {
                this.setState({ score: this.state.score + 1, totalPoints: this.state.totalPoints + points }, () => {
                    this.updateFIQ();
                });
            } else {
                this.updateFIQ();
            }

            this.setState({ answers: [...this.state.answers, { name: option, isCorrect: isCorrect }] });
        }
    };

    updateFIQ() {
        if (!inProduction) {
            let user = JSON.parse(sessionStorage.getItem('user'));
            let newFIQ = user.FIQ + this.state.totalPoints;

            axios
                .patch(`${host}/fiq/${user.id}`, { FIQ: newFIQ })
                .then(() => {
                    user.FIQ = newFIQ;
                    sessionStorage.setItem('user', JSON.stringify(user));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

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
                        <br />
                        <br />
                        <Button color="teal" size="medium" onClick={() => this.setState({ redirect: '/quizzes' })}>
                            Return to Quizzes
                        </Button>
                    </div>
                );
            case index:
                const question = JSON.parse(this.state.questions[index]).question;
                const { answers } = this.state;
                if (question.name && answers[index].name !== undefined) {
                    return (
                        <div>
                            <h1>{question.name}</h1>
                            <h3>
                                You answered:{' '}
                                {answers[index]
                                    ? answers[index].name !== null
                                        ? `${answers[index].name}, which was ${
                                              answers[index].isCorrect ? 'correct' : 'incorrect'
                                          }!`
                                        : 'Nothing...'
                                    : 'Nothing...'}
                            </h3>

                            {/* If there are multiple correct answers, return multiple correct answers, otherwise return a single correct answer*/}
                            {question.options.filter((element) => element.isCorrect).map((element) => element.name)
                                .length > 1 ? (
                                <h3>
                                    Other correct answers:{' '}
                                    {question.options
                                        .filter((element) => element.isCorrect)
                                        .map((element, index) => {
                                            return <div key={index}>{element.name}</div>;
                                        })}
                                </h3>
                            ) : !this.state.answers[index].isCorrect ? (
                                question.options.find((element) => element.isCorrect).name ? (
                                    <h3>
                                        The correct answer was:{' '}
                                        {question.options.find((element) => element.isCorrect).name}
                                    </h3>
                                ) : (
                                    ''
                                )
                            ) : (
                                ''
                            )}

                            <h3 style={{ width: '90%', margin: 'auto', textAlign: 'justify' }}>
                                {question.explanation
                                    ? `Explanation: ${question.explanation}`
                                    : 'No explanation available...'}
                            </h3>
                        </div>
                    );
                } else {
                    return <h1>Something went wrong!</h1>;
                }
            default:
                return <h1>Something went wrong!</h1>;
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.location.quiz !== undefined) {
            retrieveItems(`quiz/${this.props.location.quiz.quizId}`).then((data) => {
                let questions = [];

                data.forEach((element) => {
                    questions.push(element.question);
                });

                delete data[0].question;

                this.setState({ quiz: data[0], questions: questions, maxQuestions: questions.length }, () => {
                    this.setState({ explanationActiveItem: questions.length });
                });
            });
        } else {
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
                            <div
                                className="subContainer"
                                style={{ paddingTop: '200px', maxWidth: '80%', margin: 'auto' }}
                            >
                                <h1>Welcome to {this.state.quiz.quizName}!</h1>
                                <Button color="teal" size="big" onClick={this.handleStart}>
                                    Start Quiz
                                </Button>
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
                                loadNextQuestion={this.loadNextQuestion}
                            ></QuizQuestionPlay>
                        </QuizPlayContainer>
                    );
                case stateTypes.isFinished:
                    return (
                        <QuizPlayContainer style={{ height: '100%' }}>
                            {this.state.questions.map((value, index) => {
                                return (
                                    <Button
                                        key={index}
                                        circular
                                        color={
                                            index !== this.state.explanationActiveItem
                                                ? this.state.answers[index]
                                                    ? this.state.answers[index].isCorrect
                                                        ? 'green'
                                                        : 'red'
                                                    : 'red'
                                                : 'black'
                                        }
                                        onClick={() => {
                                            this.setState({ explanationActiveItem: index });
                                        }}
                                    >
                                        {index + 1}
                                    </Button>
                                );
                            })}
                            <Button
                                circular
                                color={
                                    this.state.questions.length !== this.state.explanationActiveItem
                                        ? 'yellow'
                                        : 'black'
                                }
                                onClick={() => {
                                    this.setState({ explanationActiveItem: this.state.questions.length });
                                }}
                            >
                                End
                            </Button>
                            <div className="subContainer" style={{ paddingTop: '150px' }}>
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
