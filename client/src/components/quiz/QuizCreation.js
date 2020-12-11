import React from 'react';
import { Button } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js'
import QuizQuestionCreation from './QuizQuestionCreation.js'

// TO-DO - Make component more dynamic by appending the name of the previous button clicked before the /categories
// E.g. if 'quizzes' was clicked, URL should be /quizzes/categories
// Then append the category name onto the back of the URL when a category is chosen
// E.g. User clicked on 'technology' -> URl should be /quizzes/technology

class QuizCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: 'Gabriel'
            }
        };
    }

    handleClick = (event, { name }) => {
        event.preventDefault();
        const lowercaseName = name.toLowerCase();
        // hardcoded for now
        window.location.href = `/quizzes/${lowercaseName}`;
    }

    render() {
        // COMMENTED OUT FOR DEBUGGING PURPOSES, UNCOMMENT OUT WHEN READY FOR DEPLOYMENT
        // Logic to check if user is already logged in
        // let user = {};
        // let loginStatus = false;

        // if (JSON.parse(sessionStorage.getItem("user") !== null)) {
        //     user = JSON.parse(sessionStorage.getItem("user"));
        //     loginStatus = user.user.isLoggedIn;
        // }

        // if (loginStatus) {


        // Array of quizzes
        const categories = ['1. Test Quiz', '2. Test Quiz', '3. Test Quiz'];


        // TO-DO Front-end logic to populate quizzes array dynamically
        // axios.get{ ... }

        return (
            <div className="container">
                <DashboardMenu page={'quizzes'}></DashboardMenu>
                <QuizQuestionCreation></QuizQuestionCreation>
            </div>
        );
        // } else {
        //     return (
        //             <h1>403 Forbidden</h1>
        //     )
        // }
    }
}


export default QuizCreation;