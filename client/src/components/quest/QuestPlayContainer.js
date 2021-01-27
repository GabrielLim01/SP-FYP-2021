import React from 'react'
import { Segment } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js';

class QuestPlayContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            characterMood: props.characterMood
        };
    }

    componentDidUpdate(prevState) {
        if (this.props.characterMood !== prevState.characterMood) {
            this.setState({ characterMood: this.props.characterMood });
        }
    }

    render() {
        return (
            <div className="outerContainer">
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="innerContainer" style={{ height: '100%', maxWidth: '60%', margin: 'auto', }}>
                    <div className="moodBar" style={{ float: 'right', paddingBottom: '10px' }}>
                        <h2 style={{ paddingRight: '10px', display: 'table-cell' }}>{this.props.characterName}'s Mood</h2>
                        <div style={{
                            height: '30px',
                            width: '250px',
                            paddingRight: '20px',
                            display: 'table-cell',
                            border: '2px solid black',
                            background: 'linear-gradient(to bottom, #33FF33, #00CC00, #009900)',
                        }}></div>
                        <h2 style={{ display: 'table-cell' }}>{this.state.characterMood} / 100</h2>
                    </div>
                    <Segment inverted raised style={{
                        height: '500px',
                        background: 'linear-gradient(to bottom, #0080FF, #0000FF, #7F00FF)',
                        clear: 'both',
                    }}>
                        {this.props.children}
                    </Segment>
                </div>
            </div >
        )
    }
}

export default QuestPlayContainer;