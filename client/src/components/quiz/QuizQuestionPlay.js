import React from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import QuizTimer from './QuizTimer.js';

class QuizQuestionPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionNumber: 0,
            question: {},
            options: []
        };
    }

    componentDidUpdate(prevState) {
        let questionString = this.props.question;

        if (questionString !== prevState.question) {
            
            let question = JSON.parse(this.props.question).question;
            this.setState({ question: question, options: question.options, questionNumber: this.props.questionNumber })
        }
    }

    componentDidMount() {
        let question = JSON.parse(this.props.question).question;
        this.setState({ question: question, options: question.options, questionNumber: this.props.questionNumber })
    }

    render() {
        const question = this.state.question;
        const number = this.state.questionNumber;

        return (

            <Grid key={this.props.question}>
                <Grid.Row>
                    <QuizTimer></QuizTimer>
                </Grid.Row>
                <Grid.Row style={{ height: '300px' }}>
                    <Segment raised inverted color='teal' style={{ width: '100%', margin: '0px 20px' }}>
                        <h1>Question {number}</h1>
                        <h2 style={{ maxWidth: '500px', margin: 'auto', overflowWrap: 'break-word' }}>{question.name}</h2>
                    </Segment>
                </Grid.Row>
                <Grid.Row columns={2} style={{ height: '150px', margin: '0px 5px' }}>
                    {this.state.options.map((element, index) => {
                        return (
                            <Grid.Column stretched key={index}>
                                <Button color="teal" name={`options-${index}`} style={{ margin: '5px 0px' }}
                                    onClick={() => this.props.onQuestionAnswered(element.isCorrect)}
                                    disabled={this.state.disabled}>
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