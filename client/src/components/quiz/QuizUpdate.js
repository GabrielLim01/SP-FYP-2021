import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Segment, Form, Grid, TextArea, Dropdown, Button, Popup } from 'semantic-ui-react';
import { host } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import retrieveItems from '../retrieveItems.js';
import QuizQuestionUpdate from './QuizQuestionUpdate.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

// TO-DO
// 1. Input validation (especially for checkboxes)
// 2. Unify change handlers if possible
// 3. Implement functionality to handle addition/deletion of questions

class QuizUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            questions: {},
            //maxQuestions: 10,
            options: 4,
            fiqOptionsRange: 5,
            timeOptionsRange: 7,
            redirect: null,
        };
    }

    // onAddQuestion = () => {
    //     if (this.state.questions < this.state.maxQuestions) {
    //         this.setState({
    //             questions: this.state.questions + 1
    //         });
    //     } else {
    //         alert("Maximum number of questions reached!")
    //     }
    // }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    handleCheckboxChange = (checkbox) => {
        this.setState({
            [checkbox.name]: !checkbox.checked,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let questions = [];

        for (let i = 1; i < this.state.questions.length + 1; i++) {
            const options = [];

            for (let j = 1; j < this.state.options + 1; j++) {
                if (this.state['option-' + i + '-' + j] !== undefined && this.state['option-' + i + '-' + j] !== '') {
                    options.push({
                        name: this.state['option-' + i + '-' + j],
                        isCorrect: this.state['isCorrect-' + i + '-' + j] || false,
                    });
                }
            }

            questions.push({
                quizQuestionId: this.state.questions[i - 1].quizQuestionId,
                question: {
                    name: this.state['question' + i + 'name'],
                    points: this.state['question' + i + 'points'],
                    time: this.state['question' + i + 'time'],
                    explanation: this.state['question' + i + 'explanation'],
                    options,
                },
            });
        }

        // Construct a quiz JSON object
        let quiz = {
            title: this.state.quizTitle,
            description: this.state.quizDesc,
            category: this.state.quizCategory,
            points: this.state.quizPoints,
            time: this.state.quizTime,
            questions: questions,
        };

        //console.log(JSON.stringify(quiz))

        // Send quiz object to the back-end via axios
        axios
            .patch(`${host}/quiz/${this.state.quizId}`, { quiz: quiz })
            .then(
                // new Noty({
                //     text: `Quiz Updated: ${quiz.title}`,
                //     type: 'success',
                //     theme: 'semanticui',
                // }).show(),
                //this.setState({ redirect: '/quizzes' }),
                window.location.href = 'quizzes'
            )
            .catch((error) => {
                alert(error);
            });
    };

    componentDidMount() {
        // props will be undefined if the user navigates to this component directly via the URL
        if (this.props.location.quiz !== undefined) {
            retrieveItems('category')
                .then((data) => {
                    let categories = [];

                    data.forEach((element) => {
                        categories.push(element);
                    });

                    this.setState({ categories: categories });
                })
                .catch((error) => {
                    alert(error);
                });

            retrieveItems(`quiz/${this.props.location.quiz.quizId}`).then((data) => {
                let questions = [];

                data.forEach((element) => {
                    questions.push({
                        quizQuestionId: element.quizQuestionId,
                        question: JSON.parse(element.question).question,
                    });
                });

                // Since data returned by the back-end has quiz-specific data appended to the front of every question
                // and we only need to reference that data once, simply remove the question and quizQuestionId from the
                // first element of the data array and store the quiz-specific data in another variable
                delete data[0].question;
                delete data[0].quizQuestionId;
                let quiz = data[0];

                this.setState(
                    {
                        quizId: quiz.quizId,
                        quizTitle: quiz.quizName,
                        quizDesc: quiz.quizDesc,
                        quizCategory: quiz.categoryId,
                        quizPoints: quiz.pointsPerQuestion,
                        quizTime: quiz.timePerQuestion,
                        questions: questions,
                    },
                    () => {
                        // Initialize the default state of all questions and their related properties
                        // If this is not done, all question-related input fields will not have their values stored in state
                        // despite defaultValue displaying the correct values
                        for (let i = 1; i < this.state.questions.length + 1; i++) {
                            let question = this.state.questions[i - 1].question;

                            this.setState({
                                ['question' + i + 'name']: question.name,
                                ['question' + i + 'points']: question.points,
                                ['question' + i + 'time']: question.time,
                                ['question' + i + 'explanation']: question.explanation,
                                ['question' + i + 'name']: question.name,
                            });

                            for (let j = 1; j < (this.state.options + 1); j++) {
                                if (question.options[j - 1] !== undefined) {
                                    console.log(question.options[j - 1].name);
                                    this.setState({
                                        ['option-' + i + '-' + j]: question.options[j - 1].name,
                                        ['isCorrect-' + i + '-' + j]: question.options[j - 1].isCorrect
                                    })
                                }
                            }
                        }
                    },
                );
            });
        } else {
            // Redirect users to /quizzes if they attempt to access this component directly via the URL
            this.setState({ redirect: '/quizzes' });
        }
    }

    render() {
        const { questions } = this.state;
        const categories = [];
        const FIQoptions = [];
        const timeOptions = [];
        const displayQuestions = [];

        for (let i = 1; i < questions.length + 1; i++) {
            displayQuestions.push(
                <QuizQuestionUpdate
                    key={'question' + i}
                    question={questions[i - 1]}
                    questionNumber={i}
                    options={this.state.options}
                    fiqOptionsRange={this.state.fiqOptionsRange}
                    timeOptionsRange={this.state.timeOptionsRange}
                    handleChange={this.handleChange}
                    handleDropdownChange={this.handleDropdownChange}
                    handleCheckboxChange={this.handleCheckboxChange}
                />,
            );
        }

        for (let i = 0; i < this.state.categories.length; i++) {
            let id = this.state.categories[i].categoryId;
            let name = this.state.categories[i].categoryName;
            categories.push({ text: name, value: id });
        }

        for (let i = 1; i < this.state.fiqOptionsRange; i++) {
            let value = 25 * i;
            FIQoptions.push({ text: value, value: value });
        }

        for (let i = 1; i < this.state.timeOptionsRange; i++) {
            let value = 5 * i;
            timeOptions.push({ text: value, value: value });
        }

        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;

            // Since quizId will be undefined on the initial render,
            // when the component is mounted and the data is populated by the axios call,
            // the Dropdown components' defaultValue will NOT be updated since render() is called before componentDidMount().
            // This is a temporary fix to force the component not to initialize the defaultValue until AFTER the component has mounted.
        } else if (this.state.quizId !== undefined) {
            return (
                <div className="container">
                    <DashboardMenu page="quizzes"></DashboardMenu>
                    <h1 className="ui teal image header">Update your quiz!</h1>
                    <div
                        className="subContainer"
                        style={{ maxWidth: '60%', margin: 'auto', textAlign: 'left', paddingTop: '20px' }}
                    >
                        <Segment>
                            <Form>
                                <Grid columns="equal">
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Popup content="The name of your quiz!" trigger={<h3>Quiz Title *</h3>} />
                                            <input
                                                type="text"
                                                name="quizTitle"
                                                onChange={this.handleChange}
                                                defaultValue={this.state.quizTitle}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="Tell us what your quiz is about!"
                                                trigger={<h3>Quiz Description</h3>}
                                            />
                                            <TextArea
                                                name="quizDesc"
                                                placeholder="Description"
                                                onChange={this.handleChange}
                                                defaultValue={this.state.quizDesc}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <Popup
                                                content="What category does your quiz belong in?"
                                                trigger={<h3>Category *</h3>}
                                            />
                                            <Dropdown
                                                name="quizCategory"
                                                placeholder="Select a Category"
                                                fluid
                                                selection
                                                clearable
                                                options={categories}
                                                defaultValue={this.state.quizCategory}
                                                onChange={this.handleDropdownChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How much FIQ (Financial IQ) points should players earn upon correctly answering each question?"
                                                trigger={<h3>FIQ per question *</h3>}
                                            />
                                            <Dropdown
                                                name="quizPoints"
                                                placeholder="Select FIQ per question"
                                                fluid
                                                selection
                                                clearable
                                                options={FIQoptions}
                                                defaultValue={this.state.quizPoints}
                                                onChange={this.handleDropdownChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup
                                                content="How much time (in seconds) will the player have to answer each question?"
                                                trigger={<h3>Time per question *</h3>}
                                            />
                                            <Dropdown
                                                name="quizTime"
                                                placeholder="Select time (seconds) per question"
                                                fluid
                                                selection
                                                clearable
                                                options={timeOptions}
                                                defaultValue={this.state.quizTime}
                                                onChange={this.handleDropdownChange}
                                            />
                                            <h3 style={{ float: 'right', color: 'red' }}>* required</h3>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </Segment>
                        {displayQuestions}
                        <div className="subContainer" style={{ padding: '25px 0px', textAlign: 'right' }}>
                            {/* <Button icon labelPosition='left' className='teal' name='addQuestion' onClick={this.onAddQuestion}>
                                <Icon name='add' size='large' />Add Question
                            </Button> */}
                            <Button className="blue" name="updateQuiz" onClick={this.handleSubmit}>
                                Update Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Return null on the initial render in order to prevent a React application crash
            // User will never see this in practice
            return null;
        }
    }
}

export default QuizUpdate;
