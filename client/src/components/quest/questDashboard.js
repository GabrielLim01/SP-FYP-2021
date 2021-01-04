import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Segment, Grid } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';

class QuestDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            functions: [
                { icon: 'trash', color: 'red', path: 'delete' },
                { icon: 'edit', color: 'blue', path: 'update' },
                { icon: 'play', color: 'green', path: 'play' },
            ],
            redirect: false,
        };
    }

    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/quests/creation" />;
        } else console.log(this.state.redirect);
    };

    //componentDidMount() {}

    render() {
        return (
            <div className="container" style={{ textAlign: 'left' }}>
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1>All Quests</h1>
                        <button className="ui primary button" onClick={this.redirectHandler}>
                            Create New<i className="right wrench icon"></i>
                        </button>
                    </div>
                    <div className="ui stacked segment">
                        <Form>
                            <Segment color="green">
                                <Grid.Row>
                                    <h2>#1232: blah blah blah</h2>
                                </Grid.Row>
                                <Grid.Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    {this.state.functions.map((value, index2) => {
                                        return (
                                            <Grid.Column key={index2} style={{ display: 'flex' }}>
                                                <Button circular icon={value.icon} color={value.color} />
                                            </Grid.Column>
                                        );
                                    })}
                                </Grid.Row>
                            </Segment>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuestDashboard;
