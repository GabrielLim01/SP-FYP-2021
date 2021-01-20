import React from 'react';
import axios from 'axios';
import { Modal, Message } from 'semantic-ui-react';
import { host } from '../../common.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class AccountUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trigger: props.trigger,
            user: props.user,
            questions: 0,
            action: 'Demote',
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const result = axios.patch(`${host}/user/${this.state.user.insertId}`, {
            action: this.state.action,
        });

        result
            .then((response) => {
                if (response.status === 200) {
                    new Noty({
                        text: `Account Updated`,
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
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    };

    componentDidMount() {
        if (this.state.user.accountType === 2) this.setState({ action: 'Promote' });
    }

    render() {
        return (
            <Modal
                trigger={this.state.trigger}
                header="Are you certain?"
                content={
                    <Message warning>
                        <Message.Header>{`You are about to change the account type for this user, ${this.state.user.name}.`}</Message.Header>
                    </Message>
                }
                actions={[
                    {
                        key: 'confirm',
                        content: `${this.state.action}`,
                        negative: true,
                        onClick: this.handleSubmit,
                    },
                ]}
            />
        );
    }
}

export default AccountUpdate;
