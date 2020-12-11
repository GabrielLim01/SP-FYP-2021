import React, { Component } from 'react';
import { Dropdown, Input, Menu } from 'semantic-ui-react';
import { menuItems } from '../common.js';

export default class DashboardMenu extends Component {
    state = { activeItem: this.props.page }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })

        if (name !== 'home') {
            window.location.href = `/${name}`;
        } else {
            window.location.href = '/dashboard';
        }
    }

    handleLogout = (event) => {
        event.preventDefault();
        sessionStorage.removeItem("user");
        window.location.href = '/';
    }

    render() {
        const { activeItem } = this.state

        return (
            <Menu inverted>
                <Menu.Item
                    name='Guru or Goondu'
                />
                {menuItems.map((value, index) => {
                    return (
                        <Menu.Item
                            key={index}
                            name={value.name}
                            active={activeItem === value.path}
                            onClick={this.handleItemClick} />
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
