import React from 'react';
import DashboardMenu from '../DashboardMenu.js'
import QuizQuestionCreation from './QuizQuestionCreation.js'
import verifyLogin from '../verifyLogin.js';

class QuizCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'Gabriel'
        };
    }

    render() {
        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <QuizQuestionCreation></QuizQuestionCreation>
                </div>
            )
        }
    }
}

export default QuizCreation;