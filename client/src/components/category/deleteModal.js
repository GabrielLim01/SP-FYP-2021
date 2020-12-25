import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

function ModalExampleCloseIcon(value) {
    const [open, setOpen] = React.useState(false);

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
                <Button color="green" onClick={() => setOpen(false)}>
                    <Icon name="checkmark" /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default ModalExampleCloseIcon;
