import React from 'react';
import { Redirect } from 'react-router-dom'
import { Segment, Button } from 'semantic-ui-react';
import { appName, containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import QuizQuestionPlay from './QuizQuestionPlay.js';
import retrieveItems from './retrieveItems.js';

class QuizPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            questions: [],
            isPlaying: false,
            currentQuestion: 1,
            maxQuestions: 0,
            redirect: null
        };
    }

    handleClick = (event) => {
        event.preventDefault();

        this.setState({ isPlaying: true })
    }

    componentDidMount() {
        // props will be undefined if the user navigates to this component directly via the URL
        if (this.props.location.quiz !== undefined) {
            retrieveItems(`quiz/${this.props.location.quiz.quizId}`)
                .then(data => {
                    let questions = [];

                    data.forEach(element => {
                        questions.push(element.questionObject)
                    });

                    delete data[0].questionObject;
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
        } else if (!this.state.isPlaying) {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui purple image header">{appName}</h1>
                    <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                        <div className="subContainer" style={{ paddingTop: '150px' }}>
                            <h1>Welcome to {this.state.quiz.quizName}!</h1>
                            <Button color='teal' size='big' onClick={this.handleClick}>Start Quiz</Button>
                        </div>
                    </Segment>
                </div >
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui purple image header">{appName}</h1>
                    <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                        <div className="subContainer">
                           <QuizQuestionPlay ></QuizQuestionPlay>
                        </div>
                    </Segment>
                </div >
            )
        }
    }
}

export default QuizPlay;