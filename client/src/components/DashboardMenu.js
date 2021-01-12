import React from 'react';
import { Redirect } from 'react-router-dom'
import { Dropdown, Input, Menu } from 'semantic-ui-react';
import { appName } from '../common.js';

export default class DashboardMenu extends React.Component {
    state = {
        activeItem: this.props.page,
        menuItems: [
            { name: 'home', path: 'dashboard' },
            { name: 'quizzes', path: 'quizzes' },
            { name: 'quests', path: 'quests' }
        ],
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
    }

    handleLogout = (event) => {
        event.preventDefault();
        sessionStorage.removeItem('user');
        this.setState({ redirect: '/' });
    }

    render() {
        const { activeItem } = this.state

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />
        } else {
            return (
                <Menu inverted>
                    <Menu.Item name={appName} />
                    {this.state.menuItems.map((value, index) => {
                        return (
                            <Menu.Item
                                key={index}
                                name={value.name}
                                active={activeItem === value.path}
                                onClick={this.handleItemClick}
                            />
                        )
                    })}
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Input icon='search' placeholder='Search...' />
                        </Menu.Item>

                        <Dropdown item text='Profile' className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='user' text='Account' name='account' onClick={this.handleItemClick}></Dropdown.Item>
                                <Dropdown.Item icon='info' text='About' name='about' onClick={this.handleItemClick}></Dropdown.Item>
                                <Dropdown.Item icon='log out' text='Logout' onClick={this.handleLogout}></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Menu>
            )
        }
    }
}
