import React from 'react';
import { Redirect } from 'react-router-dom';
//import { Form, Button, Segment, Grid } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';

class QuestCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            items: [],
        };
    }

    componentDidMount() {}

    render() {
        return (
            <div className="container" style={{ textAlign: 'left' }}>
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1>Redirected</h1>
                    </div>
                    <div className="ui stacked segment"></div>
                </div>
            </div>
        );
    }
}

export default QuestCreation;
