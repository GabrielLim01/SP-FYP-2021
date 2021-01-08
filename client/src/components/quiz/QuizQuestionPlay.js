import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import QuizTimer from './QuizTimer.js';

//  Subsequent loading of questions 

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

        // This will be called on the first question, but will NOT be called for subsequent questions unless onTick is called (at least 1 second has elapsed)
        // Can lead to abnormally high FIQ if people answer correctly immediately (0 seconds elapsed) 
        // Find a fix for this
        if (this.state.question.time) {
            this.remainingTime = question.time;
            console.log("Called!")
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

            console.log(basePoints)
            console.log(this.remainingTime)
            console.log(baseTime)
            // Formula to determine FIQ points awarded per correct answer
            points = Math.floor(basePoints * (this.remainingTime / baseTime))
            console.log(points)
        }
        this.props.onQuestionAnswered(answer, points)
    }

    componentDidUpdate(prevState) {
        let currentQuestion = this.props.question;

        // Both of the following are strings
        if (currentQuestion !== prevState.question) {
            let question = JSON.parse(this.props.question).question;
            this.setState({ isSelected: false, question: question, options: question.options, questionNumber: this.props.questionNumber })
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