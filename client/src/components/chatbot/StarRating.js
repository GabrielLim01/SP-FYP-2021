import axios from 'axios';
import React from 'react';
// import { Link } from "react-router-dom";
// import { Redirect } from "react-router";
import { Form, Button, Rating, TextArea } from 'semantic-ui-react';

// import Noty from "noty";
// import "../../../node_modules/noty/lib/noty.css";
// import "../../../node_modules/noty/lib/themes/semanticui.css";
import { host } from '../../common.js';

/*function validate(categoryName) {

  const errors = [];

  if (categoryName.length === 0) {
    errors.push("Category Name can't be empty");
  }

  return errors;
}
*/
class StarRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: [],
            rating1: null,
            setRating: null,
            hover: null,
            setHover: null,
            questions: [
                'How was the Quiz Gameplay?',
                'How was the Quest gameplay?',
                'Was it fun and interactive?',
                'Did you find the chatbot useful?',
                'Would you recommend this game to a friend?',
            ],
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleRatingChange(event, index) {
        this.setState({
            [`rating-${index + 1}`]: event.target.getAttribute('aria-posinset'),
        });
    }

    handleSubmit = () => {
        let array = [];

        for (let i = 1; i < 6; i++) {
            array.push(this.state[`rating-${i}`]);
        }

        //console.log(array);

        const result = axios.post(`${host}/ratings`, {
            ratings: array,
            feedback: this.state.feedback,
        });

        result
            .then((response) => {
                // new Noty({
                //     text: `Ratings successfully updated`,
                //     type: "success",
                //     theme: "semanticui",
                // }).show();
            })
            .catch((err) => {
                // new Noty({
                //     text: `Something went wrong. ${err}`,
                //     type: "error",
                //     theme: "semanticui",
                // }).show();
            });
    };

    render() {
        return (
            <Form style={{ backgroundColor: 'white', height: '385px', overflow: 'auto' }}>
                {/* <h1 style={{ textAlign: "center" }}>How was the question?</h1> */}
                <ul>
                    {this.state.questions.map((element, index) => {
                        return (
                            <li
                                key={index}
                                style={{
                                    listStyle: 'none',
                                    textAlign: 'center',
                                    marginRight: '30px',
                                    marginTop: '30px',
                                }}
                            >
                                {this.state.questions[index]}
                                <br></br>
                                <Rating
                                    key={index}
                                    icon="star"
                                    defaultRating={0}
                                    maxRating={5}
                                    onClick={(event) => this.handleRatingChange(event, index)}
                                />
                            </li>
                        );
                    })}
                    <li style={{ listStyle: 'none' }}>
                        <h3
                            style={{
                                textAlign: 'center',
                                marginRight: '40px',
                                marginTop: '30px',
                            }}
                        >
                            Any other feedback?
                        </h3>
                        <TextArea
                            name="feedback"
                            rows={2}
                            placeholder="Tell us more"
                            style={{ maxWidth: '90%', height: '150px' }}
                            onChange={this.handleChange}
                        />
                    </li>
                </ul>

                <Button
                    style={{ marginLeft: '38%', marginTop: '5%', marginBottom: '3%' }}
                    className="blue"
                    name="submitRatings"
                    onClick={this.handleSubmit}
                >
                    Submit
                </Button>
            </Form>
        );
    }
}

export default StarRating;
