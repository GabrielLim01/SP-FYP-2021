import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Grid, Table, Icon, Label, Input, Popup, Button, Checkbox } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems';
import AccountUpdate from './AccountUpdate.js';
import AccountDelete from './AccountDelete.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class AccountOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayItems: [],
            defaultAccounts: [],
            adminAccounts: [],
            roles: [],
            filter: '',
            isChecked: false,
            accountType: '',
        };
        this.handleChecked = this.handleChecked.bind(this);
    }

    redirectHandler = () => {
        this.setState({ redirect: true });
        this.renderRedirect();
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/account" />;
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleChecked() {
        this.setState({ isChecked: !this.state.isChecked }, () => {
            if (this.state.isChecked) {
                this.setState({ displayItems: this.state.adminAccounts, accountType: 'Administrative Accounts' });
            } else {
                this.setState({ displayItems: this.state.defaultAccounts, accountType: 'Default Accounts' });
            }
        });
    }

    onLoad() {
        retrieveItems('roles')
            .then((data) => {
                this.setState({
                    roles: data,
                    displayItems: this.state.defaultAccounts,
                    accountType: 'Default Accounts',
                });
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong when retrieving roles. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    componentDidMount() {
        retrieveItems('user/2')
            .then((data) => {
                if (data !== undefined) {
                    this.setState({ defaultAccounts: data });
                }
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
        retrieveItems('user/1')
            .then((data) => {
                if (data !== undefined) {
                    this.setState({ adminAccounts: data });
                }
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
        this.onLoad();
    }

    render() {
        let filteredContent = [];
        let accountType = this.state.accountType;

        filteredContent = this.state.displayItems.filter((account) => {
            return account.name.toLowerCase().indexOf(this.state.filter) !== -1;
        });

        return (
            <div className="container" style={{ textAlign: 'left' }}>
                <DashboardMenu></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1>List of available {`${accountType}`}</h1>
                        <Popup
                            content="Search users by their username!"
                            trigger={
                                <Input
                                    icon="search"
                                    name="filter"
                                    onChange={this.handleChange}
                                    placeholder="Search Username.."
                                />
                            }
                        />
                    </div>
                    <Checkbox
                        toggle
                        name="toggle"
                        label="Switch View"
                        defaultChecked={this.state.isChecked}
                        onChange={this.handleChecked}
                    />
                    <div className="field" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <Link to={{ pathname: '/admin/registration' }}>
                            <button type="submit" className="ui primary button">
                                Create Account<i aria-hidden="true" className="right pencil icon"></i>
                            </button>
                        </Link>
                        <button type="button" className="ui button" onClick={this.redirectHandler}>
                            Back {this.renderRedirect()}
                        </button>
                    </div>
                    <div className="ui stacked segment">
                        {filteredContent.length > 0 ? (
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <Icon name="user" />
                                                Username
                                            </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            <Icon name="tag" />
                                                Account Type
                                            </Table.HeaderCell>
                                        <Table.HeaderCell>Management</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                {filteredContent.map((value, index) => {
                                    return (
                                        <Table.Body key={index}>
                                            <Table.Row>
                                                <Table.Cell>{value.name}</Table.Cell>
                                                <Table.Cell>
                                                    <Label horizontal>
                                                        {this.state.roles.map((role, index) => {
                                                            return role.roleId === value.accountType
                                                                ? role.accountType
                                                                : '';
                                                        })}
                                                    </Label>
                                                </Table.Cell>
                                                <Table.Cell
                                                    style={{ display: 'flex', flexDirection: 'row-reverse' }}
                                                >
                                                    <Grid.Column>
                                                        <AccountUpdate
                                                            key={value.insertId + '-update'}
                                                            trigger={<Button circular icon="edit" color="blue" />}
                                                            user={value}
                                                        />
                                                        <AccountDelete
                                                            key={value.insertId + '-delete'}
                                                            trigger={<Button circular icon="trash" color="red" />}
                                                            user={value}
                                                        />
                                                    </Grid.Column>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    );
                                })}
                            </Table>
                        ) : (
                                <h2>No Results..</h2>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}


export default AccountOverview;
