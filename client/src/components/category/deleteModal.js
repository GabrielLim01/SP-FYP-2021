import axios from 'axios';
import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { host } from '../../common.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

function ModalExampleCloseIcon(value) {
    const [open, setOpen] = React.useState(false);

    function handleSubmit() {
        const result = axios.delete(host + `/category/${value.category.categoryId}`);
        result
            .then((response) => {
                if (response.status === 200) {
                    new Noty({
                        text: 'Category deleted!',
                        type: 'success',
                        theme: 'semanticui',
                    }).show();
                    window.location.reload();
                } else {
                    new Noty({
                        text: 'Something went wrong',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                }
            })
            .catch((err) => {
                new Noty({
                    text: 'Something went wrong',
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    return (
        <Modal
            closeIcon
            open={open}
            trigger={<i className="delete icon"></i>}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Header icon="trash" content={`Delete Category: ${value.category.categoryName}?`} />
            <Modal.Content>
                <p>Are you sure you want to delete {`${value.category.categoryName.toLowerCase()}`}?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setOpen(false)}>
                    <Icon name="remove" /> No
                </Button>
                <Button
                    color="green"
                    onClick={() => {
                        setOpen(false);
                        handleSubmit();
                    }}
                >
                    <Icon name="checkmark" /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default ModalExampleCloseIcon;
