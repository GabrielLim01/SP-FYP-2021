import React, { Component } from 'react'
import { Dropdown, Input, Menu } from 'semantic-ui-react'

// BUG - Active item is hardcoded, consider implementing additional logic to make setting the active item dynamic

export default class DashboardMenu extends Component {
    state = { activeItem: this.props.page }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        if (name !== 'Home'){
            window.location.href = `/${name}`;
        } else {
            window.location.href = '/dashboard';
        }
    }

    handleLogout = (event) => {
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
                <Menu.Item
                    name='Home'
                    active={activeItem === 'dashboard'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='quizzes'
                    active={activeItem === 'quizzes'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='quests'
                    active={activeItem === 'quests'}
                    onClick={this.handleItemClick}
                />
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
