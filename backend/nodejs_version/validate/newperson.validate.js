"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
/**
 *
 * @param body request body with new person's parameters
 * @returns validated person or array of errors if data wasn't valid
 */
const newPerson = (body) => {
    // Array for error messages
    const errors = [];
    // Validate first name
    errors.push(...helpers_1.validateName(body.fname, "fname"));
    // Validate last name
    errors.push(...helpers_1.validateName(body.lname, "lname"));
    // Validate age
    errors.push(...helpers_1.validateAge(body.age));
    // Return array of error messages if there was any
    if (0 < errors.length)
        return { valid: false, error: errors };
    // Return validated data
    return {
        valid: true,
        person: {
            fname: String(body.fname),
            lname: String(body.lname),
            age: Number(body.age)
        }
    };
};
exports.default = newPerson;
