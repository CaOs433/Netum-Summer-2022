"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param str name string to be validated
 * @param name parameter's name for error messages
 * @returns array of error messages (empty if valid)
 */
exports.validateName = (str, name) => {
    // Array for error messages
    const errors = [];
    // Return error if str was undefined
    if (!str)
        errors.push(`Missing parameter '${name}'!`);
    // Return error array
    return errors;
};
/**
 *
 * @param age value to be validated
 * @returns array of error messages (empty if valid)
 */
exports.validateAge = (age) => {
    // Return error if age was undefined
    if (!age)
        return ["Missing parameter 'age'!"];
    // Array for error messages
    const errors = [];
    // Convert age to number
    const _age = Number(age);
    if (Number.isNaN(_age)) // Is age a valid number?
        errors.push("Parameter 'age' must be a valid number!");
    else if (age < 0) // Is age a positive number?
        errors.push("Parameter 'age' must be a positive number!");
    // Return error array
    return errors;
};
