import React from 'react';
import { Segment } from 'semantic-ui-react';
import Countdown from 'react-countdown';

// WIP

class QuizTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {}
        };
    }

    // Renderer callback with condition
    renderer = ({ seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <h1>Test</h1>;
        } else {
            // Render a countdown
            return <h1>{seconds}</h1>;
        }
    };

    render() {
        return (
            <Countdown date={Date.now() + 10000} renderer={this.renderer} />
        )
    }
}

export default QuizTimer; 