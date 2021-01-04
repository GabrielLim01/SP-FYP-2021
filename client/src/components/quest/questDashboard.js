import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';

class QuestDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
    }

    componentDidMount() {}

    render() {
        return (
            <div className="container">
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <h1>Select a category!</h1>
                    <div className="ui stacked segment"></div>
                </div>
            </div>
        );
    }
}

export default QuestDashboard;
