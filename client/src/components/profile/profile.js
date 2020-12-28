import React from 'react';
//import { Redirect } from 'react-router-dom';
//import { Form, Button, Icon, Modal } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
//import verifyLogin from '../verifyLogin.js';
import { Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import { host } from '../../common.js';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            hasItems: true,
        };
    }

    getAgeGropOptions() {
        const result = axios.get(host + `agegroup`);
        result
            .then((data) => {
                console.log(data);
            })
            .catch();
    }

    componentDidMount() {
        this.getAgeGropOptions();
    }

    render() {
        return (
            <div className="container">
                <DashboardMenu page="category"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <div>
                        <i aria-hidden="true" className="massive user icon"></i>
                        <h1>Profile</h1>
                    </div>
                    <div className="ui stacked segment" style={{ overflow: 'hidden' }}>
                        <form className="ui form">
                            <div className="field">
                                <label>Username</label>
                                <input placeholder="Username goes here" readOnly={true} />
                            </div>
                            <div className="field">
                                <label>Age Group</label>
                                <Dropdown placeholder={this.getOptions} scrolling options={this.state.items} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
