import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';

class QuizQuestionPlay extends React.Component {
    constructor(props) {
        super(props);

        let scenario = JSON.parse(this.props.scenario);

        this.state = {
            scenario: scenario,
            choices: scenario.choices,
            scenarioNumber: props.scenarioNumber
        };
    }

    componentDidUpdate(prevState) {
        let currentScenario = this.props.scenario;

        // Both of the following are strings
        if (currentScenario !== prevState.scenario) {
            this.setState({
                hasAnswered: false,
                scenario: JSON.parse(currentScenario),
                choices: JSON.parse(currentScenario).choices,
                scenarioNumber: this.props.scenarioNumber
            })
        }
    }

    render() {
        const number = this.state.scenarioNumber;

        return (
            <Grid key={number} style={{ height: '100%' }}>
                <Grid.Row style={{ height: '10%', margin: '0px 20px 20px' }}>
                    <Button color={'teal'}
                        name={`choices-${number}`}
                        style={{ margin: '10px 0px' }}
                        onClick={() => this.props.viewScenario()}
                    >
                        <h3>View Scenario</h3>
                    </Button>
                </Grid.Row>
                <Grid.Row columns={1} style={{ height: '55%', margin: '10px 20px 0px' }}>
                    {this.state.choices.map((element, index) => {
                        return (
                            <Grid.Column stretched key={index + 1}>
                                <Button color={'teal'}
                                    name={`choice-${index}`}
                                    style={{ margin: '10px 0px' }}
                                    onClick={() => this.props.handleSelection(element)}
                                >
                                    <h3>{element.name}</h3>
                                </Button>
                            </Grid.Column>
                        )
                    })}
                </Grid.Row>
                <Grid.Row style={{ height: '35%' }}>
                    <Segment raised inverted color='teal' style={{ width: '100%', margin: '0px 20px' }}>
                        <h2 style={{ textAlign: 'left' }}>{this.props.characterName}: "Hmmm...what should I do?"</h2>
                    </Segment>
                </Grid.Row>
            </Grid>
        )
    }
}

export default QuizQuestionPlay; 