import React from 'react';
import axios from 'axios';
import { Segment, Form, Grid, TextArea, Dropdown, Button, Icon } from 'semantic-ui-react';
import { host, categories } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import QuizQuestion from './QuizQuestion.js';
import verifyLogin from '../verifyLogin.js';

// UNFINISHED
// 1. Input validation

class QuizCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: 1,
            maxQuestions: 10,
        };
    }

    onAddQuestion = () => {
        if (this.state.questions < this.state.maxQuestions) {
            this.setState({
                questions: this.state.questions + 1
            });
        } else {
            alert("Maximum number of questions reached!")
        }
    }

    handleChange = (event) => {
        // Dynamically generates a new state property for each input field based on its name
        // and also changes/saves its new value when modified in real-time
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let question = [];

        // Hardcoded 4 option input values for now
        // Supposed to iterate over a loop that references the number of options state in the child component
        // Not sure how to do loops within JSON object syntax yet
        // Append roman numerals to the end of each option to make every option name unique
        for (let i = 1; i < (this.state.questions + 1); i++) {
            question.push({
                question: this.state['question' + i],
                answers: [this.state['option' + i + 'a'], this.state['option' + i + 'b'], this.state['option' + i + 'c'], this.state['option' + i + 'd']],
                correct: this.state['correct' + i]
            });
        }

        // Construct a quiz JSON object
        let quiz = {
            name: this.state.quizName,
            category: this.state.quizCategory,
            points: this.state.points,
            questions: question
        };

        console.log(JSON.stringify(quiz))

        // Send quiz object to the back-end via axios (Incomplete API)
        // axios.post(host + '/quiz', {
        //     quiz: quiz
        // })
        //     .then((response) => {

        //         // unfinished logic

        //     })
        //     .catch((error) => {
        //         alert(error);
        //     });
    }

    render() {
        const questions = [];
        const categoryOptions = [];

        for (let i = 0; i < this.state.questions; i++) {
            questions.push(<QuizQuestion key={i} number={i + 1} handleChange={this.handleChange} />);
        };

        for (let i = 0; i < categories.length; i++) {
            let value = categories[i];
            categoryOptions.push({ key: value, text: value, value: value });
        };

        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui teal image header">Create your quiz!</h1>
                    <div className="subContainer" style={{ maxWidth: '60%', margin: 'auto', textAlign: 'left', paddingTop: '20px'}}>
                        <Segment>
                            <Form>
                                <Grid columns='equal'>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <h3>Quiz Title</h3>
                                            <input type="text" name="quizName" placeholder="Title" onChange={this.handleChange} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <h3>Quiz Description</h3>
                                            <TextArea name='quizDesc' placeholder='Description' onChange={this.handleChange} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <h3>Category</h3>
                                            <Dropdown
                                                name='quizCategory'
                                                placeholder='Select a Category'
                                                fluid
                                                selection
                                                options={categoryOptions}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <h3>FIQ per question</h3>
                                            <input type="text" name="points" placeholder="Points" onChange={this.handleChange} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <h3>Time per question</h3>
                                            <input type="text" name="time" placeholder="Time" name={"questiontime"} onChange={this.handleChange} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form >
                        </Segment>
                        {questions}
                        <div className="subContainer" style={{ padding: '25px 0px', textAlign: 'right' }}>
                            <Button icon labelPosition='left' className='teal' name='addQuestion' onClick={this.onAddQuestion}>
                                <Icon name='add' size='large' />Add Question
                        </Button>
                            <Button className='blue' name='createQuiz' onClick={this.handleSubmit}>Create Quiz</Button>
                        </div>
                    </div >
                </div >
            )
        }
    }
}

export default QuizCreation;