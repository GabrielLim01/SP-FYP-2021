import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import { Button } from 'semantic-ui-react';
import { host, inProduction } from '../../common.js';
import QuestPlayContainer from './QuestPlayContainer.js';
import QuestScenarioPlay from './QuestScenarioPlay.js';
import retrieveItems from '../retrieveItems.js';

class QuestPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 1,
            stateTypes: { isStarting: 1, isTransitioning: 2, isPlaying: 3, isFinished: 4 },
            quest: {},
            scenarios: [],
            responses: [],
            currentScenario: 1,
            maxScenarios: 0,
            score: 0,
            totalPoints: 0,
            //explanationActiveItem: 0,
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
        this.setState({ state: this.state.stateTypes.isStarting, currentScenario: 1, answers: [], score: 0, totalPoints: 0 });
    };

    transitionToNextQuestion() {
        setTimeout(() => { if (this._isMounted) this.setState({ state: this.state.stateTypes.isPlaying }) }, (this.state.transitionDuration * 1000));
    }

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

    componentDidMount() {
        this._isMounted = true;
        // props will be undefined if the user navigates to this component directly via the URL
        if (this.props.location.quest !== undefined) {
            retrieveItems(`quest/${this.props.location.quest.questId}`).then((data) => {
                let scenarios = [];

                data.forEach((element) => {
                    scenarios.push(element.scenario);
                });

                delete data[0].scenario;

                this.setState({ quest: data[0], scenarios: scenarios, maxScenarios: scenarios.length }, () => {
                    console.log(this.state.quest);
                    console.log(this.state.scenarios);
                });
            });
        } else {
            // Redirect users to /quests if they attempt to access this component directly via the URL
            this.setState({ redirect: '/quests' });
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
                        <QuestPlayContainer>
                            <div className="subContainer" style={{ paddingTop: '150px' }}>
                                <h1>Welcome to {this.state.quest.title}!</h1>
                                <Button color="teal" size="big" onClick={this.handleStart} disabled>
                                    Start Quiz
                            </Button>
                            </div>
                        </QuestPlayContainer>
                    );
                case stateTypes.isTransitioning:
                    return (
                        <QuestPlayContainer>
                            <div className="subContainer" style={{
                                paddingTop: '150px', maxWidth: '80%', margin: 'auto', animation: `fadeInAndOut ${this.state.transitionDuration}s linear`
                            }}>
                                <h1>Question {this.state.currentScenario}</h1>
                                <h2>{JSON.parse(this.state.scenarios[this.state.currentScenario - 1]).description}</h2>
                                {this.transitionToNextQuestion()}
                            </div>
                        </QuestPlayContainer>
                    );
                case stateTypes.isPlaying:
                    return (
                        <QuestPlayContainer>
                            {/* <QuizQuestionPlay
                                questionNumber={this.state.currentQuestion}
                                question={this.state.questions[this.state.currentQuestion - 1]}
                                globalPointsPerQuestion={this.state.quiz.pointsPerQuestion}
                                globalTimePerQuestion={this.state.quiz.timePerQuestion}
                                onQuestionAnswered={this.onQuestionAnswered}
                            ></QuizQuestionPlay> */}
                        </QuestPlayContainer>
                    );
                case stateTypes.isFinished:
                    return (
                        <QuestPlayContainer style={{ height: '100%' }}>
                            {/* {this.state.questions.map((value, index) => {
                                return (
                                    <Button key={index} circular color={index !== this.state.explanationActiveItem ? this.state.answers[index] ? this.state.answers[index].isCorrect ? 'green' : 'red' : 'red' : 'black'}
                                        onClick={() => { this.setState({ explanationActiveItem: index }) }}>{index + 1}</Button>
                                )
                            })}
                            <Button circular color={this.state.questions.length !== this.state.explanationActiveItem ? 'yellow' : 'black'}
                                onClick={() => { this.setState({ explanationActiveItem: this.state.questions.length }) }}>End</Button>
                            <div className="subContainer" style={{ paddingTop: '100px' }}>
                                {this.renderExplanation()}
                            </div> */}
                        </QuestPlayContainer>
                    );
                default:
                    return <h1>Something went wrong!</h1>;
            }
        } else {
            return null;
        }
    }
}

export default QuestPlay;
