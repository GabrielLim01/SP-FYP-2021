import React from 'react';
//import { Redirect } from 'react-router-dom';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
//import verifyLogin from '../verifyLogin.js';
//import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';
import retrieveItems from '../quiz/retrieveItems';
import { Dropdown } from 'semantic-ui-react';
import userDetails from '../getUserInfo.js';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ageGroupItems: [],
            hobbyItems: [],
            hasItems: true,
            categories: [],
            userDetails: [],
            ageGroupVal: null,
        };
    }
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
                    let ageGroupId = JSON.parse(userDetails()).agId;

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
                alert(error);
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
                    // console.log(this.state.items);
                } else {
                    // use a noty here
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    getUserDetails() {
        retrieveItems(`profile/${JSON.parse(userDetails()).id}`)
            .then((data) => {
                console.log(data);
            })
            .catch();
    }

    componentDidMount() {
        this.getAgeGroupOptions();
        this.getHobbyOptions();
    }

    render() {
        const hobbyItems = [];
        const ageGroupItems = [];
        //console.log(`this is to check`, this.state.hobbyItems.length);
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
                                <input value={JSON.parse(userDetails()).username} readOnly={true} />
                            </div>
                            <div className="field">
                                <label>Age Group</label>

                                <Dropdown
                                    name="ageGroup"
                                    placeholder={this.state.ageGroupVal}
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
                                    placeholder={['Volleyball', 'Basketball', 3]}
                                    fluid
                                    multiple
                                    search
                                    selection
                                    options={hobbyItems}
                                    onChange={this.handleDropdownChange}
                                />
                            </div>
                            <div className="field">
                                <button type="submit" className="ui primary button">
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

export default Profile;
