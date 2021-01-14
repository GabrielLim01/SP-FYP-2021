import React from 'react';
import { Redirect } from 'react-router-dom';
import { Dropdown, Input, Menu } from 'semantic-ui-react';
import { appName, inProduction } from '../common.js';

export default class DashboardMenu extends React.Component {
    state = {
        activeItem: this.props.page,
        menuItems: [
            { name: 'home', path: 'dashboard' },
            { name: 'quizzes', path: 'quizzes' },
            { name: 'quests', path: 'quests' },
            { name: 'category', path: 'category' },
        ],
        currentLevel: 1,
        maxLevel: 99,
        isMaxLevel: false,
        currentFIQ: !inProduction ? JSON.parse(sessionStorage.getItem("user")).FIQ ? JSON.parse(sessionStorage.getItem("user")).FIQ : 0 : 0,
        fiqToNextLevel: 100,
        isLoggingOut: false,
        redirect: null,
        inProduction: inProduction
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
        event.preventDefault();
        this.setState({ isLoggingOut: true }, () => {
            if (!this.state.inProduction) {
                sessionStorage.removeItem('user');
            }
            this.setState({ redirect: '/' });
        })
    }

    calculateFIQToNextLevel(currentLevel) {
        let fiqToNextlevel = (currentLevel * (currentLevel * 250) + ((currentLevel + 1) * 500));
        return fiqToNextlevel;
    }

    componentDidUpdate() {
        if (!this.state.inProduction) {
            if (!this.state.isLoggingOut) {
                if (this.state.currentFIQ !== JSON.parse(sessionStorage.getItem("user")).FIQ) {
                    this.setState({ currentFIQ: JSON.parse(sessionStorage.getItem("user")).FIQ }, () => {
                        if (this.state.currentFIQ >= this.state.fiqToNextLevel) {
                            let currentLevel = this.state.currentLevel;
                            let levelIncrease = 0;
                            let fiqToNextLevel = 0;

                            do {
                                fiqToNextLevel = this.calculateFIQToNextLevel(currentLevel);
                                currentLevel++;
                                levelIncrease++;
                            } while (this.state.currentFIQ >= fiqToNextLevel)

                            if ((this.state.currentLevel + levelIncrease) >= this.state.maxLevel) {
                                this.setState({ currentLevel: this.state.maxLevel, isMaxLevel: true });
                            } else {
                                this.setState({ currentLevel: this.state.currentLevel + levelIncrease }, () => {
                                    let currentLevel = this.state.currentLevel;
                                    this.setState({ fiqToNextLevel: this.calculateFIQToNextLevel(currentLevel) })
                                });
                            }
                        }
                    });
                }
            }
        }
    }

    componentDidMount() {
        if (!this.state.inProduction) {
            let currentLevel = this.state.currentLevel;
            this.setState({ fiqToNextLevel: (currentLevel * (currentLevel * 250) + ((currentLevel + 1) * 500)) }, () => {
                if (this.state.currentFIQ >= this.state.fiqToNextLevel) {
                    let currentLevel = this.state.currentLevel;
                    let levelIncrease = 0;
                    let fiqToNextLevel = 0;

                    do {
                        fiqToNextLevel = this.calculateFIQToNextLevel(currentLevel);
                        currentLevel++;
                        levelIncrease++;
                    } while (this.state.currentFIQ >= fiqToNextLevel)


                    if ((this.state.currentLevel + levelIncrease) >= this.state.maxLevel) {
                        this.setState({ currentLevel: this.state.maxLevel, isMaxLevel: true });
                    } else {
                        this.setState({ currentLevel: this.state.currentLevel + levelIncrease }, () => {
                            let currentLevel = this.state.currentLevel;
                            this.setState({ fiqToNextLevel: this.calculateFIQToNextLevel(currentLevel) })
                        });
                    }
                }
            })
        }
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