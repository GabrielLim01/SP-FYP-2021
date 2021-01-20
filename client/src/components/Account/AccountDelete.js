import React from 'react';
import axios from 'axios';
import { Modal, Message } from 'semantic-ui-react';
import { host } from '../../common.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class AccountDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trigger: props.trigger,
            user: props.user,
            questions: 0,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        axios
            .delete(host + `/user/${this.state.user.insertId}`)
            .then((response) => {
                if (response.status !== 400) {
                    new Noty({
                        text: 'User deleted!',
                        type: 'success',
                        theme: 'semanticui',
                    }).show();
                    window.location.reload();
                } else {
                    alert('Something went wrong!');
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

    render() {
        return (
            <Modal
                trigger={this.state.trigger}
                header="Are you certain? This process is irreversible."
                content={
                    <Message warning>
                        <Message.Header>{`You are about to delete this user, ${this.state.user.name}.`}</Message.Header>
                    </Message>
                }
                actions={[{ key: 'confirm', content: 'Confirm', negative: true, onClick: this.handleSubmit }]}
            />
        );
    }
}

export default AccountDelete;
