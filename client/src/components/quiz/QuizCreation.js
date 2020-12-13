import React from 'react';
import axios from 'axios';
import DashboardMenu from '../DashboardMenu.js';
import QuizQuestion from './QuizQuestion.js';
import verifyLogin from '../verifyLogin.js';
import { host } from '../../common.js';

// UNFINISHED
// 1. Overall quiz creation layout is not very good, needs a revamp
// 2. Category input field should be a dropdown consisting of categories pulled from the database, displayed in string format
// When selected, the categoryId (a number) will be saved in the quiz JSON object to be sent to the back-end instead of the string itself
// New category creation CANNOT be done in here presently, it has to be done outside in another component
// 3. Timer per question
// 4. Input validation

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
        // Dynamically generates a new state property for each input value based on its name
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
                answers: [this.state['option' + i + 'i'], this.state['option' + i + 'ii'], this.state['option' + i + 'iii'], this.state['option' + i + 'iv']],
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

        for (let i = 0; i < this.state.questions; i++) {
            questions.push(<QuizQuestion key={i} number={i + 1} handleChange={this.handleChange} />);
        };

        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui teal image header">
                        <div className="content">
                            Create your quiz!
                        </div>

                    </h1>
                    <div className="ui middle aligned center aligned grid">
                        <div className="column" style={{ maxWidth: '450px' }}>
                            <form className="ui large form">
                                <div className="field">
                                    <h2>Quiz Name</h2>
                                    <input type="text" name="quizName" placeholder="Quiz Name" onChange={this.handleChange} />
                                </div>
                                <div className="field">
                                    <h2>Quiz Category</h2>
                                    <input type="text" name="quizCategory" placeholder="Quiz Category" onChange={this.handleChange} />
                                </div>
                                <div className="field">
                                    <h2>FIQ per question</h2>
                                    <input type="text" name="points" placeholder="Points" onChange={this.handleChange} />
                                </div>
                                <div className="field">
                                    <div className="ui fluid large teal button" onClick={this.onAddQuestion}>Add Question</div>
                                </div>
                                <div className="field">
                                    <div className="ui fluid large blue button" onClick={this.handleSubmit}>Save</div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {questions}
                </div>
            )
        }
    }
}

export default QuizCreation;