import React from 'react';
import { Button } from 'semantic-ui-react'
import DashboardMenu from '../DashboardMenu.js'

// TO-DO - Make component more dynamic by appending the name of the previous button clicked before the /categories
// E.g. if 'quizzes' was clicked, URL should be /quizzes/categories
// Then append the category name onto the back of the URL when a category is chosen
// E.g. User clicked on 'technology' -> URl should be /quizzes/technology

class QuestCategorySelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'Gabriel'
        };
    }

    handleClick = (event, { name }) => {
        event.preventDefault();
        const lowercaseName = name.toLowerCase();

        // Routing is hardcoded for now
        window.location.href = `/quests/${lowercaseName}`;
    }

    render() {
        // Array of categories
        const categories = ['Technology', 'Lifestyle', 'Finance'];

        // TO-DO - Front-end logic to populate categories array dynamically
        // axios.get{ ... }

        return (
            <div className="container">
                <DashboardMenu page='quests'></DashboardMenu>
                <div className="ui middle aligned center aligned grid">
                    <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                        <h1 className="ui header">
                            <div className="content">
                                Select a category!
                        </div>
                        </h1>
                        <form className="ui large form">
                            <div className="ui stacked segment">
                                {categories.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <Button icon labelPosition='left' className='fluid large teal' name={value} onClick={this.handleClick}>{value}</Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default QuestCategorySelection;