import React from 'react';
import axios from 'axios';
import { Modal } from 'semantic-ui-react';
import { host } from '../../common.js';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

class QuestDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trigger: props.trigger,
            quest: props.quest,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        axios
            .delete(host + `/quest/${this.state.quest.questId}`)
            .then((response) => {
                if (response.status !== 400) {
                    new Noty({
                        text: 'Quest successfully deleted!',
                        type: 'success',
                        theme: 'semanticui',
                    }).show();
                    window.location.reload();
                } else {
                    new Noty({
                        text: 'Something went wrong.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                }
            })
            .catch((error) => {
                new Noty({
                    text: `Something went wrong. ${error}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    };

    componentDidUpdate(prevState) {
        if (this.props.quest !== prevState.quest) {
            this.setState({ quest: this.props.quest });
        }
    }

    componentDidMount() { }

    render() {
        return (
            <Modal
                trigger={this.state.trigger}
                header="Are you certain?"
                content={`You are about to delete this quest, 
                    ${this.state.quest.title}.`}
                actions={[{ key: 'confirm', content: 'Confirm', negative: true, onClick: this.handleSubmit }]}
            />
        );
    }
}

export default QuestDelete;
