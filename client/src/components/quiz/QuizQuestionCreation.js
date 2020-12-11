import React from 'react';
import { Link } from 'react-router-dom';

const QuizQuestionCreation = () => (
    <div className="container">
        <div className="ui middle aligned center aligned grid">
            {/* <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                <h1 className="ui teal image header">
                    <div className="content">
                        Create your quiz!
                </div>
                </h1>
                <form className="ui large form">
                    <div className="ui stacked segment">
                        <h2>Question 1</h2>
                        <div className="field">
                            <input type="text" name="name" placeholder="Question title" />
                        </div>
                        <h2>Options</h2>
                        <div className="field">
                            <input type="text" name="option1" placeholder="Option 1" />
                        </div>
                        <div className="field">
                            <input type="text" name="option2" placeholder="Option 2" />
                        </div>
                        <div className="field">
                            <input type="text" name="option3" placeholder="Option 3" />
                        </div>
                        <div className="field">
                            <input type="text" name="option4" placeholder="Option 4" />
                        </div>
                        <div className="ui fluid large teal submit button" >Save</div>
                        <br />
                        <div className="field">
                            <div className="ui fluid large blue button" >Add Question</div>
                        </div>
                    </div>
                </form>
            </div> */}

            <div class="ui doubling three column grid">
                <div class="column">
                    <div class="ui segment">Content</div>
                </div>
                <div class="column">
                    <div class="ui segment">Content</div>
                </div>
                <div class="column"><div class="ui segment">Content</div>
                </div>
                <div class="column"><div class="ui segment">Content</div>
                </div>
                <div class="column"><div class="ui segment">Content</div>
                </div>
                <div class="column"><div class="ui segment">Content</div>
                </div>
            </div>
            {/* <div className="column" style={{ maxWidth: '450px', paddingTop: '100px' }}>
                <h1 className="ui teal image header">
                    <div className="content">
                        Create your quiz!
                        </div>
                </h1>
            </div> */}
        </div>
    </div >
);

export default QuizQuestionCreation;