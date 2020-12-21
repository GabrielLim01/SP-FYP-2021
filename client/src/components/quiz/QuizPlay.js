import React from 'react';
import axios from 'axios';
import { host } from '../../common.js';
import { Segment, Button } from 'semantic-ui-react';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import QuizQuestionPlay from './QuizQuestionPlay.js'

class QuizPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizName: '',
            questions: [],
            isPlaying: false
        };
        this.onQuestionAnswered = this.onQuestionAnswered.bind(this);
    }

    handleClick = (event) => {
        event.preventDefault();
       
        this.setState({isPlaying: true})
        
    }

    // loadQuiz(){
        
    // }

    componentDidMount() {
        // Throws an error if no quiz questions
        axios.get(host + '/quiz/7')
            .then((response) => {
                let questions = [];
                let quizName = '';

                console.log(response.data)

                response.data.map((value) => {
                    return (
                        questions.push(value.questionObject)
                    )
                })
                quizName = JSON.stringify(response.data[0].quizName)

                this.setState({ questions: questions })
                this.setState({ quizName: quizName });
            })
            .catch((error) => {
                alert(error);
            })
            // .finally(() => { 
            //     this.setState({ questions: questions })
            //     this.setState({ quizName: quizName });
            // });
    }

    onQuestionAnswered(someInfo) {
        // do something with this info

        // udate score
        // load next question
        //this.setState((previousState) => { questionNumber: previousState.questionNumber + 1 })
        // check if it is end 
    }

    render() {
        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else if (!this.state.isPlaying) {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui purple image header">Guru or Goondu</h1>
                    <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                        <div className="subContainer" style={{ paddingTop: '150px' }}>
                            <h1>Welcome to {this.state.quizName}!</h1>
                            <Button color='teal' size='big' onClick={this.handleClick}>Start Quiz</Button>
                        </div>
                    </Segment>
                </div >             
            )
        } else {
            return (         
                <QuizQuestionPlay question={this.state.questions[0]} onAnswerQuestion={this.onQuestionAnswered}></QuizQuestionPlay>
            )
        }
    }
}

export default QuizPlay;