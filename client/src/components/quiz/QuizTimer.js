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
            <Segment raised inverted color='red' style={{ width: '100%', margin: '0px 20px' }}></Segment>
        )
    }
}

export default QuizTimer; 