import React from 'react';
import { Segment } from 'semantic-ui-react';
import Countdown from 'react-countdown';

// WIP

class QuizTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: props.time * 1000
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
        console.log(this.state.time)

        return (
            <Countdown
                date={Date.now() + this.state.time}
                renderer={this.renderer}
                onComplete={this.props.onCountdownComplete}
                onTick={({ seconds }) => { this.props.onTick(seconds) }}
            />
        )
    }
}

export default QuizTimer; 