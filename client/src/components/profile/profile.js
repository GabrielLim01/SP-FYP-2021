import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';
import retrieveItems from '../quiz/retrieveItems';
import { Button, Dropdown } from 'semantic-ui-react';
import userDetails from '../getUserInfo.js';
import { host } from '../../common.js';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ageGroupItems: [],
            hobbyItems: [],
            categories: [],
            userDetails: [],
            ageGroup: '',
            hobby: '',
        };
    }

    userId = JSON.parse(userDetails()).id;

    handleSubmit = (event) => {
        event.preventDefault();

        let detail = {
            name: JSON.parse(userDetails()).username,
            ageGroup: this.state.ageGroup ? this.state.ageGroup : null,
            hobby: this.state.hobby ? this.state.hobby : null,
        };

        const result = axios.patch(`${host}/profile/${this.userId}`, { detail: detail });

        result
            .then(
                new Noty({
                    text: `Profile Updated!`,
                    type: 'success',
                    theme: 'semanticui',
                }).show(),
                setTimeout(() => {
                    window.location.reload();
                }, 1000),
            )
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

    getAgeGroupOptions() {
        retrieveItems(`agegroup`)
            .then((data) => {
                if (data !== undefined) {
                    let tempArray = [];

                    data.forEach((element) => {
                        tempArray.push(element);
                    });

                    this.setState({ ageGroupItems: tempArray });
                } else {
                    // use a noty here
                }
            })
            .catch((error) => {
                alert('ag', error);
            });
    }

    getHobbyOptions() {
        retrieveItems(`hobby`)
            .then((data) => {
                if (data !== undefined) {
                    let tempArray = [];

                    data.forEach((element) => {
                        tempArray.push(element);
                    });

                    this.setState({ hobbyItems: tempArray });
                } else {
                    // use a noty here
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    onLoad() {
        retrieveItems(`profile/${this.userId}`)
            .then((data) =>
                this.setState({ userDetails: data[0] }, () =>
                    this.setState({ ageGroup: this.state.userDetails.ageGroupId, hobby: this.state.userDetails.hobby }),
                ),
            )
            .catch((err) => console.log(err));
    }

    componentDidMount() {
        this.onLoad();
        this.getAgeGroupOptions();
        this.getHobbyOptions();
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

        if (!verifyLogin()) {
            return <h1>403 Forbidden</h1>;

            // Force the component to skip the initial render
            // Doing this allows correct initialization of dropdown defaultValues (since they are initialized on componentDidMount)
        } else if (this.state.userDetails.ageGroupId !== undefined) {
            return (
                <div className="container">
                    <DashboardMenu page="category"></DashboardMenu>
                    <div style={{ maxWidth: '70%', margin: 'auto' }}>
                        <Link push to={{ pathname: 'admin/accountOverview' }}>
                            <Button floated="right">Account Management Console</Button>
                        </Link>
                    </div>
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
                                        value={JSON.parse(userDetails()).username}
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
                                        defaultValue={this.state.userDetails.ageGroupId}
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
                                        // Converts an integer string (e.g. "123") into an array of digits (e.g. [1, 2, 3])
<<<<<<< HEAD
                                        defaultValue={
                                            this.state.userDetails.hobby
                                                ? Array.from(this.state.userDetails.hobby).map(Number)
                                                : ''
                                        }
=======
                                        defaultValue={this.state.userDetails.hobby ? Array.from(this.state.userDetails.hobby).map(Number) : ''}
>>>>>>> main
                                        fluid
                                        multiple
                                        search
                                        selection
                                        options={hobbyItems}
                                        onChange={this.handleDropdownChange}
                                    />
                                </div>
                                <div className="field">
                                    <button type="submit" className="ui primary button" onClick={this.handleSubmit}>
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
