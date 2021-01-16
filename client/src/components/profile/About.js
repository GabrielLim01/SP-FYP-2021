import React from 'react';
import DashboardMenu from '../DashboardMenu.js';
import { containerStyle } from '../../common.js';

class About extends React.Component {
    render() {
        return (
            <div className="container">
                <DashboardMenu page="dashboard"></DashboardMenu>
                <div className="subContainer" style={containerStyle}>
                    <h1>Welcome to our application!</h1>

                    <div className="ui stacked segment" style={{ textAlign: 'left' }}>
                        <h4>
                            Just a brief introduction, we are a team of developers from Singapore Polytechnic. This
                            application is our final year project product and we are honoured and thankful to Priority
                            Wealth Pte Ltd for giving us this opportunity!
                        </h4>
                        <h4>
                            Feel free to critic as much as possible, your responses are surely essential to the future
                            evolution of this application.
                        </h4>
                        <h4>
                            Credits to:
                            <ul>
                                <li>Lee Wei Xian</li>
                                <li>Gabriel Lim Qing En</li>
                                <li>Nicole Ooi Swee Yoke</li>
                                <li>Yap Jun Liang</li>
                                <li>Zachary Tan Chien Loong</li>
                            </ul>
                            Supervisor:
                            <ul>
                                <li>Mr Jeremiah Ang</li>
                            </ul>
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;
