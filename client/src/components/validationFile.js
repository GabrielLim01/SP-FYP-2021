function validate(input) {
    const errors = [];

    for (let i = 0; i < input.length; i++) {
        if (input[i] === null || input[i] === undefined || input[i].length === 0) {
            errors.push('This field cannot be empty!');
        }
    }

    return errors;
}

function selected(field) {
    const errors = [];

    if (field === undefined) {
        errors.push('This field cannot be empty!');
    }

    return errors;
}

export default { validate, selected };
