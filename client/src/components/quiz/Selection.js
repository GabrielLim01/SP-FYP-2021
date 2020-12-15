import React from 'react';
import { Form, Button } from 'semantic-ui-react'
import { containerStyle } from '../../common.js'
import DashboardMenu from '../DashboardMenu.js'
import verifyLogin from '../verifyLogin.js';

// TO-DO - Make component more dynamic by appending the name of the previous button clicked before the /categories
// E.g. if 'quizzes' was clicked, URL should be /quizzes/categories
// Then append the category name onto the back of the URL when a category is chosen
// E.g. User clicked on 'technology' -> URl should be /quizzes/technology

class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: ['Technology', 'Lifestyle', 'Finance'],
            type: 'category'
        }
    }

    handleClick = (event, { name }) => {
        event.preventDefault();
        const lowercaseName = name.toLowerCase();

        // Routing is hardcoded for now
        window.location.href = `/quizzes/${lowercaseName}`;
    }

    componentDidMount() {
        if (window.location.pathname === '/quizzes/technology'){
            this.setState(
                { items: ['Test Quiz 1', 'Test Quiz 2', 'Test Quiz 3'],  type: 'quiz'}
            )
        }
    } 

    render() {
        // Array of items
        const items = this.state.items;

        // TO-DO - Front-end logic to populate items array dynamically
        // axios.get{ ... }

        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <h1>Select a {this.state.type}!</h1>
                        <div className="ui stacked segment">
                            <Form>
                                {items.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <Button icon labelPosition='left' className='fluid large teal' name={value} onClick={this.handleClick}>{value}</Button>
                                        </div>
                                    )
                                })}
                                <h2>Or...</h2>
                                <div className="field">
                                    <Button icon labelPosition='left' className='fluid large blue' name={this.state.type + 'creation'} onClick={this.handleClick}>Create a {this.state.type}!</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div >
            );
        }
    }
}

export default Selection;