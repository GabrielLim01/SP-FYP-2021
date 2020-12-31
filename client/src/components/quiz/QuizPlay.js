import React from 'react';
import { Redirect } from 'react-router-dom'
import { Segment, Button } from 'semantic-ui-react';
import { appName } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import QuizQuestionPlay from './QuizQuestionPlay.js';
import retrieveItems from './retrieveItems.js';
import verifyLogin from '../verifyLogin.js';

class QuizPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            questions: [],
            maxQuestions: 0,
            currentQuestion: 1,
            score: 0,
            isPlaying: false,
            isFinished: false,
            redirect: null
        };
    }

    handleStart = (event) => {
        event.preventDefault();

        this.setState({ isPlaying: true })
    }

    handleRestart = (event) => {
        event.preventDefault();

        this.setState({ isPlaying: false, isFinished: false, currentQuestion: 1, score: 0 })
    }


    onQuestionAnswered = (answer) => {
        if (answer) {
            this.setState({ score: this.state.score + 1 });
        }

        if (this.state.currentQuestion < (this.state.maxQuestions)) {
            // Wait a short while before loading the next question
            setTimeout(() => this.setState({ currentQuestion: this.state.currentQuestion + 1 }), 2000);
        } else {
            // Wait a short while before loading the results screen
            setTimeout(() => this.setState({ isPlaying: false, isFinished: true }), 2000)
        }
    }

    componentDidMount() {
        // props will be undefined if the user navigates to this component directly via the URL
        if (this.props.location.quiz !== undefined) {
            retrieveItems(`quiz/${this.props.location.quiz.quizId}`)
                .then(data => {
                    let questions = [];

                    data.forEach(element => {
                        questions.push(element.question)
                    });

                    // Since data returned by the back-end has quiz-specific data appended to the front of every question
                    // and we only need to reference that data once, simply remove the question from the 
                    // first element of the data array and store the quiz-specific data in another variable
                    delete data[0].question;
                    let quiz = data[0];

                    this.setState({ quiz: quiz, questions: questions, maxQuestions: questions.length });
                })
        } else {
            // Redirect users to /quizzes if they attempt to access this component directly via the URL
            this.setState({ redirect: "/quizzes" });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } else if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else if (!this.state.isPlaying && !this.state.isFinished) {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui purple image header">{appName}</h1>
                    <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                        <div className="subContainer" style={{ paddingTop: '150px' }}>
                            <h1>Welcome to {this.state.quiz.quizName}!</h1>
                            <Button color='teal' size='big' onClick={this.handleStart}>Start Quiz</Button>
                        </div>
                    </Segment>
                </div >
            )
        } else if (this.state.isPlaying) {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui purple image header">{appName}</h1>
                    <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                        <QuizQuestionPlay
                            questionNumber={this.state.currentQuestion}
                            question={this.state.questions[this.state.currentQuestion - 1]}
                            onQuestionAnswered={this.onQuestionAnswered}>
                        </QuizQuestionPlay>
                    </Segment>
                </div >
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui purple image header">{appName}</h1>
                    <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                        <div className="subContainer" style={{ paddingTop: '150px' }}>
                            <h1>Game has ended!</h1>
                            <h2>You scored {this.state.score} / {this.state.maxQuestions} points.</h2>
                            <Button color='teal' size='big' onClick={this.handleRestart}>Play Again?</Button>
                        </div>
                    </Segment>
                </div >
            )
        }
    }
}

export default QuizPlay; 