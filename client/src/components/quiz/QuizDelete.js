import React from 'react'
import axios from 'axios'
import { Modal } from 'semantic-ui-react'
import { host } from '../../common.js';
import retrieveItems from '../retrieveItems.js';

class QuizDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trigger: props.trigger,
            quiz: props.quiz,
            questions: 0
        }

        this._isMounted = false;
    }

    handleSubmit = () => {
        axios.delete(host + `/quiz/${this.state.quiz.quizId}`)
            .then((response) => {
                if (response.status === 204) {
                    window.location.reload();
                } else {
                    alert("Something went wrong!")
                }
            })
            .catch((error) => {
                alert(error)
            });
    }

    componentDidUpdate(prevState) {
        if (this._isMounted && this.props.quiz !== prevState.quiz) {
            this.setState({ quiz: this.props.quiz });
        }
    }

    componentDidMount() {
        this._isMounted = true;
        retrieveItems(`quiz/${this.state.quiz.quizId}`)
            .then(data => {
                if (this._isMounted && data !== undefined) {
                    this.setState({ questions: data.length });
                }
            })
            .catch((error) => {
                alert(error);
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <Modal
                trigger={this.state.trigger}
                header='Are you certain?'
                content={'You are about to delete this quiz, ' + this.state.quiz.quizName + ' , which consists of ' + this.state.questions + ' question(s). Proceed?'}
                actions={[{ key: 'confirm', content: 'Confirm', negative: true, onClick: this.handleSubmit }]}
            />
        )
    }
}

export default QuizDelete;