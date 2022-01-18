import { validateName, validateAge } from "./helpers";
import { NewPerson } from "./types";

/** Output type for newPerson validate function */
export interface NewPersonOutput {
    /** Is the data valid? */
    valid: boolean;
    /** Array of errors if the data wasn't valid */
    error?: string[];
    /** Validated person */
    person?: NewPerson;
}

/**
 * Get validated person from the values or an array of errors
 * @param data new person's data to validate
 * @returns validated person or array of errors if data wasn't valid
 */
const newPerson = (data: NewPerson): NewPersonOutput => {
    // Array for error messages
    const errors: string[] = [];

    // Validate first name
    errors.push(...validateName(data.fname, "firstname"));
    // Validate last name
    errors.push(...validateName(data.lname, "lastname"));
    // Validate age
    errors.push(...validateAge(data.age));

    // Return array of error messages if there was any
    if (0 < errors.length)
        return { valid: false, error: errors };

    // Return validated data
    return {
        valid: true,
        person: {
            fname: String(data.fname),
            lname: String(data.lname),
            age: Number(data.age)
        }
    }
}

export default newPerson;
