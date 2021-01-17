import React from 'react';
import { Redirect } from 'react-router-dom';
import { Dropdown, Input, Menu } from 'semantic-ui-react';
import { appName, inProduction, defaultAccountType, adminAccountType } from '../common.js';

export default class DashboardMenu extends React.Component {
    state = {
        activeItem: this.props.page,
        menuItems: [
            { name: 'home', path: 'dashboard' },
            { name: 'quizzes', path: 'quizzes' },
            { name: 'quests', path: 'quests' }
        ],
        currentFIQ: !inProduction ? JSON.parse(sessionStorage.getItem("user")).FIQ ? JSON.parse(sessionStorage.getItem("user")).FIQ : 0 : 0,
        accountType: !inProduction ? JSON.parse(sessionStorage.getItem("user")).accountType ? JSON.parse(sessionStorage.getItem("user")).accountType : defaultAccountType : adminAccountType,
        currentLevel: 1,
        fiqToNextLevel: 100,
        maxLevel: 99,
        isMaxLevel: false,
        isLoggingOut: false,
        redirect: null
    }

    handleItemClick = (event, { name }) => {
        // Prevents menu from disappearing when double-clicked on
        if (this.state.activeItem !== name) {
            if (name !== 'home') {
                this.setState({ redirect: `/${name}` });
            } else if (this.state.activeItem !== 'dashboard') {
                this.setState({ redirect: '/dashboard' });
            }
        }
    };

    handleLogout = (event) => {
        this.setState({ isLoggingOut: true }, () => {
            if (!inProduction) sessionStorage.removeItem('user');
            this.setState({ redirect: '/' });
        })
    }

    calculateFIQToNextLevel(currentLevel) {
        // Formula to calculate FIQ to next level
        return (currentLevel * (currentLevel * 250) + ((currentLevel + 1) * 500));
    }

    calculateLevelDifference() {
        let currentLevel = this.state.currentLevel;
        let levelIncrease = 0;
        let fiqToNextLevel = this.state.fiqToNextLevel;

        while (this.state.currentFIQ >= fiqToNextLevel) {
            currentLevel++;
            levelIncrease++;
            fiqToNextLevel = this.calculateFIQToNextLevel(currentLevel);
        }

        if ((this.state.currentLevel + levelIncrease) >= this.state.maxLevel) {
            this.setState({ currentLevel: this.state.maxLevel, isMaxLevel: true });
        } else {
            this.setState({ currentLevel: this.state.currentLevel + levelIncrease }, () => {
                this.setState({ fiqToNextLevel: this.calculateFIQToNextLevel(this.state.currentLevel) })
            });
        }
    }

    componentDidUpdate() {
        if (!inProduction) {
            if (!this.state.isLoggingOut) {
                if (this.state.currentFIQ !== JSON.parse(sessionStorage.getItem("user")).FIQ) {
                    this.setState({ currentFIQ: JSON.parse(sessionStorage.getItem("user")).FIQ }, () => {
                        this.calculateLevelDifference();
                    });
                }
            }
        }
    }

    componentDidMount() {
        // Display the Category menu item only if the user account is an administrator
        if (this.state.accountType === adminAccountType) {
            let menuItems = this.state.menuItems;
            menuItems.push({ name: 'category', path: 'category' });
            this.setState({ menuItems: menuItems });
        }

        this.setState({ fiqToNextLevel: this.calculateFIQToNextLevel(this.state.currentLevel) }, () => {
            if (this.state.currentFIQ >= this.state.fiqToNextLevel) {
                this.calculateLevelDifference();
            }
        })
    }

    render() {
        const { activeItem } = this.state;

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />
        } else {
            return (
                <Menu inverted>
                    <Menu.Item
                        name={appName}
                    />
                    <Menu.Item
                        content={!this.state.isMaxLevel ? `Level ${this.state.currentLevel}: ` + this.state.currentFIQ + '/' + this.state.fiqToNextLevel + " FIQ" : `Level ${this.state.currentLevel}: Max level reached!`}
                    />
                    {this.state.menuItems.map((value, index) => {
                        return (
                            <Menu.Item
                                key={index}
                                name={value.name}
                                active={activeItem === value.path}
                                onClick={this.handleItemClick}
                            />
                        );
                    })}
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Input icon="search" placeholder="Search..." />
                        </Menu.Item>

                        <Dropdown item text="Profile" className="icon">
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    icon="user"
                                    text="Account"
                                    name="account"
                                    onClick={this.handleItemClick}
                                    disabled={inProduction}
                                ></Dropdown.Item>
                                <Dropdown.Item
                                    icon="info"
                                    text="About"
                                    name="about"
                                    onClick={this.handleItemClick}
                                ></Dropdown.Item>
                                <Dropdown.Item icon="log out" text="Logout" onClick={this.handleLogout}></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Menu>
            );
        }
    }
}