import React from 'react';
import { Segment } from 'semantic-ui-react';

class QuizTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {},
            isRendered: false
        };
    }

    render() {
        return (
            <Segment raised inverted color='red'></Segment>
        )
    }
}

export default QuizTimer; 