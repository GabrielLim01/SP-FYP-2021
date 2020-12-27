import axios from 'axios';
import React, { useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { host } from '../../common.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

function DeleteModal(value) {
    const [open, setOpen] = useState(false);
    const [quizArray, setQuizArray] = useState([]);
    const [isPopulated, setIsPopulated] = useState(false);

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
                        text: 'Something went wrong.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                }
            })
            .catch((err) => {
                new Noty({
                    text: 'Something went wrong.',
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    function check() {
        const result = axios.get(host + `/quiz/category/${value.category.categoryId}`);
        result
            .then((data) => {
                if (typeof data.data === 'object') {
                    let tempArray = [];

                    Object.values(data.data).forEach((quiz) => {
                        tempArray.push(quiz.quizId);
                    });

                    setQuizArray(tempArray);
                } else {
                    console.log('Array has something already');
                }
            })
            .catch();
    }

    return (
        <Modal
            closeIcon
            open={open}
            trigger={<i className="delete icon"></i>}
            onClose={() => setOpen(false)}
            onOpen={() => {
                setOpen(true);

                if (!isPopulated) {
                    check();
                    setIsPopulated(true);
                }
            }}
        >
            <Header icon="trash" content={`Delete Category: ${value.category.categoryName}?`} />
            <Modal.Content>
                <div>
                    {quizArray.length !== 0 ? (
                        <div className="ui warning message">
                            <div className="header">
                                This category is being referenced by {quizArray.length} quiz(zes)!
                            </div>
                            <p>Please delete the following quiz(zes) with id: {quizArray.join(', ')}.</p>
                        </div>
                    ) : null}
                </div>
                <br></br>
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

export default DeleteModal;
