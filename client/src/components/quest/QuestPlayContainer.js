import React from 'react'
import { Segment } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js';

class QuestPlayContainer extends React.Component {
    render() {
        return (
            <div className="container">
                <DashboardMenu page="quests"></DashboardMenu>
                <Segment
                    inverted
                    raised
                    style={{
                        height: '500px',
                        maxWidth: '60%',
                        margin: 'auto',
                        background: 'linear-gradient(to bottom, #0080FF, #0000FF, #7F00FF)',
                    }}
                >
                    {this.props.children}
                </Segment>
            </div>
        )
    }
}

export default QuestPlayContainer;