//wip soon to be modified
export const validateForm = (formData) => { 
    const errors = [];

    if(!formData.username) {
        errors.push("username is required");
    }
    
    if(!formData.email) {
        errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.push("Email is invalid");
    }

    if(!formData.password) {
        errors.push("Password is required");
    } else if (formData.password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    if(!formData.bustSize) {
        errors.push("Bust size is required");
    } else if (isNaN(formData.bustSize)) {
        errors.push("Bust size must be a number");
    }

    if(!formData.waistSize) {
        errors.push("Waist size is required");
    } else if (isNaN(formData.waistSize)) {
        errors.push("Waist size must be a number");
    }

    if(!formData.hipSize) {
        errors.push("Hip size is required");
    } else if (isNaN(formData.hipSize)) {
        errors.push("Hip size must be a number");
    }

    return errors;
};