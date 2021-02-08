import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import DashboardMenu from './DashboardMenu.js';
import retrieveItems from './retrieveItems';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            maxLevel: 99,
            hasMounted: false,
        };
    }

    calculateFIQToNextLevel(currentLevel) {
        // Formula to calculate FIQ to next level
        return currentLevel * (currentLevel * 250) + (currentLevel + 1) * 500;
    }

    calculateLevelDifference(FIQ) {
        let currentFIQ = FIQ;
        let baseLevel = 1;
        let currentLevel = 1;
        let levelIncrease = 0;
        let fiqToNextLevel = 100;

        while (currentFIQ >= fiqToNextLevel) {
            currentLevel++;
            levelIncrease++;
            fiqToNextLevel = this.calculateFIQToNextLevel(currentLevel);
        }

        if (baseLevel + levelIncrease >= this.state.maxLevel) {
            currentLevel = this.state.maxLevel;
        } else {
            currentLevel = baseLevel + levelIncrease;
        }

        return `Level ${currentLevel}: ${FIQ} FIQ`;
    }

    componentDidMount() {
        this.setState({ hasMounted: true });
        retrieveItems('user')
            .then((data) => {
                if (data !== undefined) {
                    this.setState({ users: data });
                }
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    render() {
        if (this.state.hasMounted) {
            return (
                <div className="container" style={{ textAlign: 'left' }}>
                    <DashboardMenu></DashboardMenu>
                    <div className="subContainer" style={{ maxWidth: '70%', margin: 'auto' }}>
                        <h1>Global Leaderboard</h1>
                        <div className="ui stacked segment">
                            {this.state.users.length > 0 ? (
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>
                                                <Icon name="trophy" /> Rank
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                <Icon name="user" /> Name
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>Level and FIQ</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    {this.state.users.map((value, index) => {
                                        return (
                                            <Table.Body key={value.insertId}>
                                                <Table.Row>
                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                    <Table.Cell>{value.name}</Table.Cell>
                                                    <Table.Cell>{this.calculateLevelDifference(value.FIQ)}</Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        );
                                    })}
                                </Table>
                            ) : (
                                    <h2>No Results...</h2>
                                )}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Leaderboard;
