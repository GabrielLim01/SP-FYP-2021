import React from 'react'
import { Segment } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js';
import ReactBotUI from '../chatbot/ReactBotUI';

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

    // Not in use, had some issues with getting it to work since React's this.setState's forced re-render messes things up
    // animateLinearGradient() {
    //     console.log(this.state.characterMood / 100);
    //     if (this.state.characterMood / 100 === 1) {
    //         return 'linear-gradient(to bottom, #33FF33, #00CC00, #009900)'
    //     } else if (this.state.characterMood / 100 === 0.5) {
    //         setTimeout(() => { }, 2000);
    //         return 'linear-gradient(to bottom, #FFFF66, #FFFF00, #999900)'
    //     }
    // }

    render() {
        return (
            <div className="outerContainer">
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="innerContainer" style={{ height: '100%', maxWidth: '60%', margin: 'auto', }}>
                    <div className="personaGUI" style={{ float: 'right', paddingBottom: '10px' }}>
                        <h2 style={{ paddingRight: '10px', display: 'table-cell' }}>{this.props.characterName}'s Mood</h2>
                        <div id="healthBarContainer"
                            style={{
                                height: '30px',
                                width: '250px',
                                display: 'table-cell',
                                border: '2px solid black',
                            }}>
                            <div id="healthBar"
                                style={{
                                    height: '30px',
                                    width: `${this.state.characterMood / 100 * 250}px`,
                                    display: 'table-cell',
                                    background: 'linear-gradient(to bottom, #33FF33, #00CC00, #009900)',
                                    transition: 'all 2s linear'
                                }}>
                            </div>
                        </div>
                        {/* <h2 style={{ display: 'table-cell' }}>{this.state.characterMood} / 100</h2> */}
                    </div>
                    <Segment inverted raised style={{
                        height: '500px',
                        background: 'linear-gradient(to bottom, #0080FF, #0000FF, #7F00FF)',
                        clear: 'both',
                    }}>
                        {this.props.children}
                        <ReactBotUI
                            dialogHeightMax={350}
                            isUserHidden={true}
                            isVisible={true}
                            ref={(el) => (this.chat = el)}
                        />
                    </Segment>
                </div>
            </div >
        )
    }
}

export default QuestPlayContainer;