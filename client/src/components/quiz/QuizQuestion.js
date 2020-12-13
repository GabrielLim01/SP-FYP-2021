import React from 'react';
import { TextArea } from 'semantic-ui-react'

// UNFINISHED
// Correct Answer input field should be a dropdown containing all of the quest options, not an open text input
// Also need to write logic to set a default correct answer option (e.g. 1) in the event of mismatching data with the database
// or other unforeseen circumstances

class QuizQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: 4
        };
    }

    render() {
        const options = ['i', 'ii', 'iii', 'iv']

        const number = this.props.number;

        return (
            <div className="container">
                <div className="ui middle aligned center aligned grid">
                    <div className="column" style={{ maxWidth: '450px' }}>
                        <form className="ui large form">
                            <div className="ui stacked segment">
                                <h2>Question {number}</h2>
                                <TextArea placeholder='Input your question here' name={"question" + number} onChange={this.props.handleChange}/>
                                <h2>Options</h2>
                                {options.map((value, index) => {
                                    return (
                                        <div className="field" key={index}>
                                            <input type="text" name={"option" + number + value} placeholder={"Option " + (index + 1)} onChange={this.props.handleChange}/>
                                        </div>
                                    )
                                })}
                                <h2>Correct Answer</h2>
                                <div className="field">
                                    <input type="text" name={"correct" + number} placeholder="Correct Answer" onChange={this.props.handleChange}/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default QuizQuestion;