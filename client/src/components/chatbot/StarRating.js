import axios from 'axios';
import React from 'react';
// import { Link } from "react-router-dom";
// import { Redirect } from "react-router";
import { Form, Button, Rating, TextArea } from 'semantic-ui-react';

import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';
import { host } from '../../common.js';

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
                'Rate the Guru or Goondu platform'
                // 'How was the Quiz Gameplay?',
                // 'How was the Quest gameplay?',
                // 'Was it fun and interactive?',
                // 'Did you find the chatbot useful?',
                // 'Would you recommend this game to a friend?',
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

        // for (let i = 1; i < 6; i++) {
        //     if (this.state[`rating-${i}`]) {
        //         array.push(this.state[`rating-${i}`]);
        //     } else array.push(0);
        // }
        console.log("array length", this.state.questions.length);
        for (let i = 1; i < (this.state.questions.length + 1); i++) {
            if (this.state[`rating-${i}`]) {
                array.push(this.state[`rating-${i}`]);
                console.log("This is array", array);
            }
            else
                new Noty({
                    text: `Please give a star rating!`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
        }
        if (array == null || this.state.feedback == null) {
            if (array == null) {
                new Noty({
                    text: `Please give a star ratings`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            }
            else if (this.state.feedback == null) {
                new Noty({
                    text: `Please provide a feedback`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            } else {
                new Noty({
                    text: `Please fill in all the fields`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            }
        }
        else {
            let userId = JSON.parse(sessionStorage.getItem("user")).id;

            const result = axios.post(`${host}/ratings`, {
                id: userId,
                ratings: array,
                feedback: this.state.feedback ? this.state.feedback : null,
            });

            result
                .then((response) => {
                    console.log("this is my array", array);
                    new Noty({
                        text: `Ratings successfully inserted.`,
                        type: 'success',
                        theme: 'semanticui',
                    }).show();

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((err) => {
                    new Noty({
                        text: `Something went wrong. ${err}`,
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                });
        }
    };

    render() {
        return (
            <Form style={{ backgroundColor: 'white', height: '385px', overflow: 'auto' }}>
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
                            What do you like about the Guru or Goondu platform?
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
