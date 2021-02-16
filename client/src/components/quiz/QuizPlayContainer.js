import React from 'react'
import { Segment } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js';
import ReactBotUI from '../chatbot/ReactBotUI';

class QuizPlayContainer extends React.Component {
    render() {
        return (
            <div className="container">
                <DashboardMenu page="quizzes"></DashboardMenu>
                <Segment
                    inverted
                    raised
                    style={{
                        height: '600px',
                        maxWidth: '60%',
                        margin: 'auto',
                        background: 'linear-gradient(to bottom, #0080FF, #0000FF, #7F00FF)',
                    }}
                >
                    {this.props.children}
                    <ReactBotUI
                        dialogHeightMax={350}
                        isUserHidden={true}
                        isVisible={true}
                        ref={(el) => (this.chat = el)}
                    />
                </Segment>
            </div>
        )
    }
}

export default QuizPlayContainer;