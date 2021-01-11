import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import Countdown from 'react-countdown';

class QuizTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: props.time * 1000
        };
    }

    // Renderer callback with condition
    renderer = ({ seconds }) => {
        return <div style={{ width: '100%' }}>
            <Grid columns='equal'>
                <Grid.Column>
                    <Segment inverted color='red' style={{ border: '2px solid black' }}>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <h2>{seconds}</h2>
                </Grid.Column>
            </Grid>
        </ div >;
    };

    render() {
        return (
            <Countdown
                date={Date.now() + this.state.time}
                renderer={this.renderer}
                onTick={({ seconds }) => { this.props.onTick(seconds) }}
                onComplete={this.props.onCountdownComplete}
            />
        )
    }
}

export default QuizTimer; 