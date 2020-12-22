import React from 'react';
import { Button } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js'
import verifyLogin from '../verifyLogin.js';

class QuestSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'Gabriel'
        };
    }

    handleClick = (event, { name }) => {
        event.preventDefault();
        const lowercaseName = name.toLowerCase();

        // Routing is hardcoded for now
        window.location.href = `/quests/${lowercaseName}`;
    }

    render() {
        // Array of quizzes
        const types = ['1.Quest1', '2.Quest2', '3.Quest3'];

        // TO-DO - Front-end logic to populate quizzes array dynamically
        // axios.get{ ... }

        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quests'></DashboardMenu>
                    <div className="ui middle aligned center aligned grid">
                        <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                            <h1 className="ui header">
                                <div className="content">
                                    Select a quest!
                        </div>
                            </h1>
                            <form className="ui large form">
                                <div className="ui stacked segment">
                                    {types.map((value) => {
                                        return (
                                            <div className="field">
                                                <Button icon labelPosition='left' className='fluid large teal' name={value} onClick={this.handleClick}>{value}</Button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <h2>Or...</h2>
                                <div className="field">
                                    <Button icon labelPosition='left' className='fluid large blue' name="creation" onClick={this.handleClick}>Create a Quest!</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}


export default QuestSelection;