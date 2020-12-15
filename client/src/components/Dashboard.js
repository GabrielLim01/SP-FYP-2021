import React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { containerStyle } from '../common.js'
import DashboardMenu from './DashboardMenu.js';
import verifyLogin from './verifyLogin.js';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'John'
        };
    }

    handleClick = (event, { name }) => {
        event.preventDefault();
        window.location.href = `/${name}`;
    }

    render() {
        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='dashboard'></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Welcome, {this.state.username}!</h1>
                        <h2>What would you like to play today?</h2>

                        <div className="ui stacked segment">
                            <Form>
                                <div className="field">
                                    <Button icon labelPosition='left' className='fluid large teal' name='quizzes' onClick={this.handleClick}>
                                        <Icon name='clipboard' size='large' />Quizzes
                                    </Button>
                                </div>
                                <div className="field">
                                    <Button icon labelPosition='left' className='fluid large teal' name='quests' onClick={this.handleClick}>
                                        <Icon name='exclamation' size='large' />Quests
                                    </Button>
                                </div>
                            </Form>
                        </div>

                    </div>
                </div>
            );
        }
    }
}

export default Dashboard;