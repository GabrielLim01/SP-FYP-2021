import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import DashboardMenu from './DashboardMenu.js'

class Quizzes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: 'Gabriel'
            }
        };
    }

    handleClick = (event, {name}) => {
        event.preventDefault();
        window.location.href = `/${name}`;
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
        return (
            <div className="container">
                <DashboardMenu page={'quizzes'}></DashboardMenu>

                <div className="ui middle aligned center aligned grid">
                    <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                        <h1 className="ui header">
                            <div className="content">
                                Select a quiz!
                        </div>
                        </h1>
                        <form className="ui large form">
                            <div className="ui stacked segment">
                                <div className="field">
                                    <Button icon labelPosition='left' className='fluid large teal' name='quizzes' onClick={this.handleClick}>
                                        <Icon name='clipboard' size='large' onClick={this.handleClick}/>Quizzes
                                    </Button>
                                </div>
                                <div className="field">
                                    <Button icon labelPosition='left' className='fluid large teal' name='quests' onClick={this.handleClick}>
                                        <Icon name='exclamation' size='large' />Quests
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
        // } else {
        //     return (
        //             <h1>403 Forbidden</h1>
        //     )
        // }
    }
}


export default Quizzes;