export default function validateCat(categoryName) {
    const errors = [];

    if (categoryName.length === 0) {
        errors.push('Category Name cannot be empty');
    }

    return errors;
}
