import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';
import retrieveItems from '../quiz/retrieveItems';
import { Dropdown } from 'semantic-ui-react';
import userDetails from '../getUserInfo.js';
import { host } from '../../common.js';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            ageGroupItems: [],
            hobbyItems: [],
            categories: [],
            userDetails: [],
            ageGroupVal: null,
            hobbyVal: null,
            ageGroup: '',
            hobby: '',
        };
    }

    userId = JSON.parse(userDetails()).id;

    handleSubmit = (event) => {
        event.preventDefault();
        let detail = {
            name: JSON.parse(userDetails()).username,
            ageGroup: this.state.ageGroup,
            hobby: this.state.hobby,
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
            .catch(
                new Noty({
                    text: 'Something went wrong.',
                    type: 'error',
                    theme: 'semanticui',
                }).show(),
            );
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

                    // Section B
                    let ageGroupId = this.state.userDetails.ageGroupId;
                    if (ageGroupId !== null) {
                        this.state.ageGroupItems.map((value) => {
                            if (value.ageGroupId === ageGroupId) {
                                return this.setState({ ageGroupVal: value.ageGroupDesc });
                            } else return null;
                        });
                    } else {
                        this.setState({ ageGroupVal: 'Select Option' });
                    }
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
                //console.log(data);
                if (data !== undefined) {
                    let tempArray = [];
                    let hobby = Array.from(this.state.userDetails.hobby);
                    let Str = '';

                    data.forEach((element) => {
                        tempArray.push(element);
                    });

                    if (hobby !== '') {
                        const hobbyId = tempArray.map((id) => id.hobbyId);
                        const hobbyName = tempArray.map((id) => id.hobbyName);

                        hobby.forEach((hobby) => {
                            let id = JSON.parse(hobby);
                            if (hobbyId.includes(id)) {
                                Str += hobbyName[hobbyId.indexOf(id)];
                            }
                        });
                    } else Str = 'Select Option';
                    this.setState({ hobbyItems: tempArray, hobbyVal: Str });
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
            .then((data) => this.setState({ userDetails: data[0] }))
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

        if (this.state.redirect) {
            return <Redirect to={{ host }} />;
        } else if (!verifyLogin()) {
            return <h1>403 Forbidden</h1>;
        } else {
            return (
                <div className="container">
                    <DashboardMenu page="category"></DashboardMenu>
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
                                        placeholder={this.state.ageGroupVal}
                                        defaultValue={this.state.ageGroupVal}
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
                                        placeholder={this.state.hobbyVal}
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
        }
    }
}

export default Profile;
