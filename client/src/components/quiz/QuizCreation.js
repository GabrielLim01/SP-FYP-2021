import React from 'react';
import axios from 'axios';
import { Segment, Form, Grid, TextArea, Dropdown, Button, Popup, Icon } from 'semantic-ui-react';
import { host } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import QuizQuestionCreation from './QuizQuestionCreation.js';
import retrieveItems from './retrieveItems.js';
// import Noty from 'noty';
// import '../../../node_modules/noty/lib/noty.css';
// import '../../../node_modules/noty/lib/themes/semanticui.css';

// TO-DO
// 1. Input validation (especially for checkboxes)
// 2. Unify change handlers if possible

class QuizCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: 1,
            maxQuestions: 10,
            options: 4,
            categories: [],
            fiqOptionsRange: 5,
            timeOptionsRange: 7
        };
    }

    onAddQuestion = () => {
        if (this.state.questions < this.state.maxQuestions) {
            this.setState({
                questions: this.state.questions + 1
            });
        } else {
            alert("Maximum number of questions reached!")
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value
        });
    }

    handleCheckboxChange = (checkbox) => {
        this.setState({
            [checkbox.name]: !checkbox.checked
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let questions = [];

        for (let i = 1; i < (this.state.questions + 1); i++) {

            const options = [];

            for (let j = 1; j < (this.state.options + 1); j++) {
                options.push({ name: this.state['option-' + i + '-' + j], isCorrect: this.state['isCorrect-' + i + '-' + j] || false })
            }

            questions.push({
                question: {
                    name: this.state['question' + i + 'name'],
                    points: this.state['question' + i + 'points'],
                    time: this.state['question' + i + 'time'],
                    explanation: this.state['question' + i + 'explanation'],
                    options,
                }
            });
        }

        // Construct a quiz JSON object
        let quiz = {
            title: this.state.quizTitle,
            description: this.state.quizDesc,
            category: this.state.quizCategory,
            points: this.state.quizPoints,
            time: this.state.quizTime,
            questions: questions
        };

        //console.log(JSON.stringify(quiz))

        // Send quiz object to the back-end via axios 
        axios.post(host + '/quiz', {
            quiz: quiz
        })
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                alert(error);
            });
    }

    componentDidMount() {
        retrieveItems('category')
            .then(data => {
                let categories = [];

                data.forEach(element => {
                    categories.push(element)
                });


                // new Noty({
                //     text: "Some notification text",
                //     layout: 'topRight',
                //     type: 'success'
                // }).show();


                this.setState({ categories: categories });
            })
            .catch((error) => {
                alert(error);
            })
    }

    render() {
        const questions = [];
        const categories = [];
        const FIQoptions = [];
        const timeOptions = [];

        for (let i = 1; i < (this.state.questions + 1); i++) {
            questions.push(
                <QuizQuestionCreation
                    key={'question' + i}
                    questionNumber={i}
                    options={this.state.options}
                    fiqOptionsRange={this.state.fiqOptionsRange}
                    timeOptionsRange={this.state.timeOptionsRange}
                    handleChange={this.handleChange}
                    handleDropdownChange={this.handleDropdownChange}
                    handleCheckboxChange={this.handleCheckboxChange}
                />);
        };

        for (let i = 0; i < this.state.categories.length; i++) {
            let id = this.state.categories[i].categoryId;
            let name = this.state.categories[i].categoryName;
            categories.push({ text: name, value: id });
        };

        for (let i = 1; i < this.state.fiqOptionsRange; i++) {
            let value = 25 * i
            FIQoptions.push({ text: value, value: value });
        };

        for (let i = 1; i < this.state.timeOptionsRange; i++) {
            let value = 5 * i
            timeOptions.push({ text: value, value: value });
        };

        if (!verifyLogin()) {
            return (
                <h1>403 Forbidden</h1>
            )
        } else {
            return (
                <div className="container">
                    <DashboardMenu page='quizzes'></DashboardMenu>
                    <h1 className="ui teal image header">Create your quiz!</h1>
                    <div className="subContainer" style={{ maxWidth: '60%', margin: 'auto', textAlign: 'left', paddingTop: '20px' }}>
                        <Segment>
                            <Form>
                                <Grid columns='equal'>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Popup content='The name of your quiz!' trigger={<h3>Quiz Title *</h3>} />
                                            <input type="text" name="quizTitle" placeholder="Title" onChange={this.handleChange} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup content='Tell us what your quiz is about!' trigger={<h3>Quiz Description</h3>} />
                                            <TextArea name='quizDesc' placeholder='Description' onChange={this.handleChange} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <Popup content='What category does your quiz belong in?' trigger={<h3>Category *</h3>} />
                                            <Dropdown
                                                name='quizCategory'
                                                placeholder='Select a Category'
                                                fluid
                                                selection
                                                clearable
                                                options={categories}
                                                onChange={this.handleDropdownChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup content='How much FIQ (Financial IQ) points should players earn upon correctly answering each question?' trigger={<h3>FIQ per question *</h3>} />
                                            <Dropdown
                                                name='quizPoints'
                                                placeholder='Select FIQ per question'
                                                fluid
                                                selection
                                                clearable
                                                options={FIQoptions}
                                                onChange={this.handleDropdownChange}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Popup content='How much time (in seconds) will the player have to answer each question?' trigger={<h3>Time per question *</h3>} />
                                            <Dropdown
                                                name='quizTime'
                                                placeholder='Select time (seconds) per question'
                                                fluid
                                                selection
                                                clearable
                                                options={timeOptions}
                                                onChange={this.handleDropdownChange}
                                            />
                                            <h3 style={{ float: 'right', color: 'red' }}>* required</h3>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form >
                        </Segment>
                        {questions}
                        <div className="subContainer" style={{ padding: '25px 0px', textAlign: 'right' }}>
                            <Button icon labelPosition='left' className='teal' name='addQuestion' onClick={this.onAddQuestion}>
                                <Icon name='add' size='large' />Add Question
                        </Button>
                            <Button className='blue' name='createQuiz' onClick={this.handleSubmit}>Create Quiz</Button>
                        </div>
                    </div >
                </div >
            )
        }
    }
}

export default QuizCreation;