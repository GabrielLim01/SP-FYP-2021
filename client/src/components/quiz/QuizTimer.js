import React from 'react';
import Countdown from 'react-countdown';
import './animations.css';

class QuizTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: props.time,
        };
    }

    renderer = ({ seconds }) => {
        return (
            <div className="timer" style={{ width: '100%' }}>
                <div
                    className="timerBar"
                    style={{
                        height: '80%',
                        width: '95%',
                        border: '2px solid black',
                        background: 'linear-gradient(to bottom, red, #900)',
                        animation: `timer ${this.state.time}s linear forwards`,
                        animationPlayState: `${this.props.hasAnswered ? 'paused' : 'running'}`,
                        transformOrigin: 'left center',
                        float: 'left',
                    }}
                ></div>

                <p className="timerContent" style={{ fontSize: '30px', fontWeight: 'bold', float: 'left' }}>
                    {seconds}
                </p>
            </div>
        );
    };

    render() {
        const { refCallback } = this.props;

        return (
            <Countdown
                // date property has to be dependent on future this.prop.time value updates
                // since the QuizQuestionPlay component re-renders upon the player selecting an answer
                // By using this.props.time, the time value rendered in QuizTimer.js WILL NOT be reset back to the default time
                date={Date.now() + (this.props.time * 1000)}

                renderer={this.renderer}
                onTick={({ seconds }) => { this.props.onTick(seconds) }}
                onComplete={this.props.onCountdownComplete}
                ref={refCallback}
            />
        )
    }
}

export default QuizTimer; 
