import React from 'react';
import { Segment, Button } from 'semantic-ui-react';
import DashboardMenu from '../DashboardMenu.js';

class QuizQuestionPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {},
            isRendered: false
        };
    }

    componentDidMount() {
        alert(this.state.question)
        // No clue why this.props.question is a string
        this.setState({ isRendered: true})
        this.setState({ question: JSON.parse(this.props.question) }, () => {
            console.log(this.state.question)
        })
    }

    onOptionSelected(){
        // do a few things....

        this.props.onAnswerQuestion({});
    }

    render() {
        return (
            <div className="container">
                <DashboardMenu page='quizzes'></DashboardMenu>
                <h1 className="ui purple image header">Guru or Goondu</h1>
                <Segment raised inverted color='blue' style={{ height: '500px', maxWidth: '60%', margin: 'auto' }}>
                    <div className="subContainer" style={{ paddingTop: '150px' }}>
                        <h1>Welcome to {this.state.isRendered ? this.state.question.question.name : 'test'}!</h1>
                        <Button color='teal' size='big' onClick={this.handleClick}>Start Quiz</Button>
                    </div>
                </Segment>
            </div >
        )
    }
}

export default QuizQuestionPlay;