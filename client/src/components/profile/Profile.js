import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { host, inProduction, defaultAccountType, adminAccountType, containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';
import retrieveItems from '../retrieveItems';
import { Button, Dropdown } from 'semantic-ui-react';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: !inProduction ? JSON.parse(sessionStorage.getItem('user')) : { username: 'John' },
            accountType: !inProduction
                ? JSON.parse(sessionStorage.getItem('user')).accountType
                    ? JSON.parse(sessionStorage.getItem('user')).accountType
                    : defaultAccountType
                : adminAccountType,
            ageGroupItems: [],
            hobbyItems: [],
            hasMounted: false,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let detail = {
            name: this.state.user.username ? this.state.user.username : this.state.username,
            ageGroup: this.state.ageGroup ? this.state.ageGroup : this.state.user.ageGroupId,
            hobby: this.state.hobby ? this.state.hobby : this.state.user.hobby ? this.state.user.hobby : {},
        };

        console.log(this.state.user);
        console.log(detail);

        axios
            .patch(`${host}/profile/${this.state.user.id}`, { detail: detail })
            .then((response) => {
                if (response.status === 200) {
                    let user = this.state.user;
                    user.username = detail.name;
                    user.ageGroupId = detail.ageGroup;
                    user.hobby = detail.hobby;
                    sessionStorage.setItem('user', JSON.stringify(user));

                    new Noty({
                        text: `Profile Updated!`,
                        type: 'success',
                        theme: 'semanticui',
                    }).show();

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch((err) => {
                new Noty({
                    text: `${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    generateItems() {
        let items = [
            { path: 'agegroup', state: 'ageGroupItems' },
            { path: 'hobby', state: 'hobbyItems' },
        ];

        for (let i = 0; i < items.length; i++) {
            retrieveItems(items[i].path)
                .then((data) => {
                    if (data !== undefined) {
                        let tempArray = [];

                        data.forEach((element) => {
                            tempArray.push(element);
                        });

                        this.setState({ [items[i].state]: tempArray });
                    } else {
                    }
                })
                .catch((error) => {
                    console.log('Error ', error);
                });
        }
    }

    componentDidMount() {
        this.setState({ hasMounted: true });
        this.generateItems();
    }

    render() {
        const hobbyItems = [];
        const ageGroupItems = [];

        for (let i = 0; i < this.state.hobbyItems.length; i++) {
            let id = this.state.hobbyItems[i].hobbyId;
            let name = this.state.hobbyItems[i].hobbyName;
            hobbyItems.push({ text: name, value: id });
        }

        for (let i = 0; i < this.state.ageGroupItems.length; i++) {
            let id = this.state.ageGroupItems[i].ageGroupId;
            let name = this.state.ageGroupItems[i].ageGroupDesc;
            ageGroupItems.push({ text: name, value: id });
        }

        if (this.state.hasMounted) {
            return (
                <div className="container">
                    <DashboardMenu></DashboardMenu>
                    {this.state.accountType === adminAccountType ? (
                        <div style={{ maxWidth: '70%', margin: 'auto' }}>
                            <Link to={{ pathname: 'admin/accountOverview' }}>
                                <Button floated="right">Account Management Console</Button>
                            </Link>
                        </div>
                    ) : (
                        ''
                    )}
                    <div className="subContainer" style={containerStyle}>
                        <div>
                            <i aria-hidden="true" className="huge user icon"></i>
                            <h1>Profile</h1>
                        </div>
                        <div className="ui stacked segment">
                            <form className="ui form">
                                <div className="field">
                                    <label>Username</label>
                                    <input
                                        value={this.state.user.username}
                                        name="username"
                                        onChange={this.handleChange}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="field">
                                    <label>Age Group</label>
                                    <Dropdown
                                        name="ageGroup"
                                        placeholder="Select an age group"
                                        defaultValue={this.state.user.ageGroupId}
                                        fluid
                                        selection
                                        options={ageGroupItems}
                                        onChange={this.handleDropdownChange}
                                    />
                                </div>
                                <div className="field">
                                    <label>Hobby</label>
                                    <Dropdown
                                        name="hobby"
                                        labeled={true}
                                        placeholder="Select a hobby"
                                        defaultValue={
                                            this.state.user.hobby ? Array.from(this.state.user.hobby).map(Number) : ''
                                        }
                                        fluid
                                        multiple
                                        search
                                        selection
                                        options={hobbyItems}
                                        onChange={this.handleDropdownChange}
                                    />
                                </div>
                                <div className="field">
                                    <button
                                        type="submit"
                                        className="ui primary button"
                                        onClick={this.handleSubmit}
                                        disabled={inProduction}
                                    >
                                        Update<i aria-hidden="true" className="right edit icon"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Profile;
