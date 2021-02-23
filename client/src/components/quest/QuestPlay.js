import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { host, inProduction, getRandomInt } from '../../common.js';
import QuestPlayContainer from './QuestPlayContainer.js';
import QuestScenarioPlay from './QuestScenarioPlay.js';
import retrieveItems from '../retrieveItems.js';

class QuestPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 1,
            stateTypes: {
                isStarting: 1,
                isLoadingScenario: 2,
                isLoadingChoices: 3,
                isLoadingExplanation: 4,
                isGameOver: 5,
                isFinished: 6,
            },
            quest: {},
            scenarios: [],
            currentScenario: 1,
            maxScenarios: 0,
            currentChoice: {},
            characterName: 'Error',
            startingMood: 0,
            characterMood: 0,
            eventTriggered: false,
            transitionDuration: 4,
            afterAnsweringDelay: 2,
            redirect: null,
        };

        this._isMounted = false;
    }

    handleRestart = () => {
        this.setState({
            state: this.state.stateTypes.isStarting,
            currentScenario: 1,
            currentChoice: {},
            eventTriggered: false,
            characterMood: this.state.quest.characterMood,
        });
    };

    viewScenario = () => {
        this.setState({ state: this.state.stateTypes.isLoadingScenario });
    };

    loadNextScenario = () => {
        if (this.state.characterMood !== 0) {
            if (this.state.currentScenario < this.state.maxScenarios) {
                this.setState({
                    state: this.state.stateTypes.isLoadingScenario,
                    currentScenario: this.state.currentScenario + 1,
                });
            } else {
                this.updateFIQ();
                this.setState({
                    state: this.state.stateTypes.isFinished,
                });
            }
        } else {
            this.setState({
                state: this.state.stateTypes.isGameOver,
            });
        }
    };

    loadScenarioChoices = () => {
        this.setState({ state: this.state.stateTypes.isLoadingChoices });
    };

    handleSelection = (choice) => {
        let eventTriggered = false;
        let characterMood = this.state.characterMood;

        if (choice.event) {
            let event = choice.event;

            if (getRandomInt(10) <= event.eventProcRate / 10) {
                eventTriggered = true;

                if (event.moodChange === 1) {
                    characterMood += event.moodChangeValue;
                } else {
                    characterMood -= event.moodChangeValue;
                }
            }
        }

        let FIQmodifier = characterMood / this.state.startingMood;
        let currentPoints = this.state.quest.points * FIQmodifier;

        this.setState(prevState => ({
            currentChoice: choice,
            state: this.state.stateTypes.isLoadingExplanation,
            eventTriggered: eventTriggered,
            characterMood: characterMood,
            quest: {
                ...prevState.quest,
                points: currentPoints
            }
        }));
    };

    updateFIQ() {


        if (!inProduction) {
            let user = JSON.parse(sessionStorage.getItem('user'));
            let newFIQ = user.FIQ + this.state.quest.points;

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

    componentDidMount() {
        this._isMounted = true;
        if (this.props.location.quest !== undefined) {
            retrieveItems(`quest/${this.props.location.quest.questId}`).then((data) => {
                let scenarios = [];

                data.forEach((element) => {
                    scenarios.push(element.scenario);
                });

                delete data[0].scenario;

                this.setState({ quest: data[0], scenarios: scenarios, maxScenarios: scenarios.length }, () => {
                    this.setState({ characterName: data[0].characterName, startingMood: data[0].characterMood, characterMood: data[0].characterMood });
                });
            });
        } else {
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
                        <QuestPlayContainer
                            characterName={this.state.characterName}
                            characterMood={this.state.characterMood}
                        >
                            <div
                                className="subContainer"
                                style={{
                                    maxWidth: '70%',
                                    margin: 'auto',
                                    overflowWrap: 'break-word',
                                    paddingTop: '150px',
                                }}
                            >
                                <h1>{this.state.quest.title}</h1>
                                <h3>{this.state.quest.description}</h3>
                                <Button size="big" onClick={() => this.setState({ redirect: '/quests' })}>
                                    Back
                                </Button>
                                <Button color="teal" size="big" onClick={this.viewScenario}>
                                    Begin Quest
                                </Button>
                            </div>
                        </QuestPlayContainer>
                    );
                case stateTypes.isLoadingScenario:
                    return (
                        <QuestPlayContainer
                            characterName={this.state.characterName}
                            characterMood={this.state.characterMood}
                        >
                            <div
                                className="subContainer"
                                style={{
                                    paddingTop: '150px',
                                    maxWidth: '80%',
                                    margin: 'auto',
                                }}
                            >
                                <h1>Scenario {this.state.currentScenario}</h1>
                                <h2>{JSON.parse(this.state.scenarios[this.state.currentScenario - 1]).description}</h2>
                                <Button color="teal" size="medium" onClick={this.loadScenarioChoices}>
                                    Next
                                </Button>
                            </div>
                        </QuestPlayContainer>
                    );
                case stateTypes.isLoadingChoices:
                    return (
                        <QuestPlayContainer
                            characterName={this.state.characterName}
                            characterMood={this.state.characterMood}
                        >
                            <QuestScenarioPlay
                                scenarioNumber={this.state.currentScenario}
                                scenario={this.state.scenarios[this.state.currentScenario - 1]}
                                characterName={this.state.characterName}
                                onQuestionAnswered={this.onQuestionAnswered}
                                viewScenario={this.viewScenario}
                                handleSelection={this.handleSelection}
                            ></QuestScenarioPlay>
                        </QuestPlayContainer>
                    );
                case stateTypes.isLoadingExplanation:
                    const { currentChoice } = this.state;
                    return (
                        <QuestPlayContainer
                            characterName={this.state.characterName}
                            characterMood={this.state.characterMood}
                        >
                            <div
                                className="subContainer"
                                style={{
                                    paddingTop: '120px',
                                    maxWidth: '80%',
                                    margin: 'auto',
                                }}
                            >
                                <h1>{this.state.eventTriggered ? currentChoice.event.name : currentChoice.name}</h1>
                                <h3>
                                    {this.state.eventTriggered
                                        ? currentChoice.event.description
                                        : currentChoice.description}
                                </h3>
                                <Button color="teal" size="medium" onClick={this.loadNextScenario}>
                                    Next
                                </Button>
                            </div>
                        </QuestPlayContainer>
                    );
                case stateTypes.isGameOver:
                    return (
                        <QuestPlayContainer
                            characterName={this.state.characterName}
                            characterMood={this.state.characterMood}
                        >
                            <div
                                className="subContainer"
                                style={{
                                    paddingTop: '120px',
                                    maxWidth: '80%',
                                    margin: 'auto',
                                }}
                            >
                                <h1>Game Over!</h1>
                                <h3>
                                    {this.state.characterName} is feeling way too depressed to continue! Tough luck!
                                </h3>
                                <Button color="teal" size="big" onClick={this.handleRestart}>
                                    Retry?
                                </Button>
                            </div>
                        </QuestPlayContainer>
                    );
                case stateTypes.isFinished:
                    return (
                        <QuestPlayContainer
                            style={{ height: '100%' }}
                            characterName={this.state.characterName}
                            characterMood={this.state.characterMood}
                        >
                            <div className="subContainer" style={{ paddingTop: '120px' }}>
                                <div>
                                    <h1>Quest Complete!</h1>
                                    <h3>
                                        {this.state.quest.conclusion
                                            ? this.state.quest.conclusion
                                            : 'Thanks for playing!'}
                                    </h3>
                                    <h2>You have earned {this.state.quest.points} FIQ!</h2>
                                    <Button color="teal" size="big" onClick={this.handleRestart}>
                                        Play Again?
                                    </Button>
                                    <br />
                                    <br />
                                    <Button color="teal" size="medium" onClick={() => this.setState({ redirect: '/quests' })}>
                                        Return to Quests
                        </Button>
                                </div>
                            </div>
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
