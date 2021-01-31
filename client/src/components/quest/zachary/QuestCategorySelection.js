import React from 'react';
import { Button } from 'semantic-ui-react';
import DashboardMenu from '../../DashboardMenu.js';

class QuestCategorySelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'Gabriel',
        };
    }

    handleClick = (event, { name }) => {
        event.preventDefault();
        const lowercaseName = name.toLowerCase();

        window.location.href = `/quests/${lowercaseName}`;
    };

    render() {
        const categories = ['Technology', 'Lifestyle', 'Finance'];
        return (
            <div className="container">
                <DashboardMenu page="quests"></DashboardMenu>
                <div className="ui middle aligned center aligned grid">
                    <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                        <h1 className="ui header">
                            <div className="content">Select a category!</div>
                        </h1>
                        <form className="ui large form">
                            <div className="ui stacked segment">
                                {categories.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <Button
                                                icon
                                                labelPosition="left"
                                                className="fluid large teal"
                                                name={value}
                                                onClick={this.handleClick}
                                            >
                                                {value}
                                            </Button>
                                        </div>
                                    );
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
