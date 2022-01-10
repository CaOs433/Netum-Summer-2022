import NewPerson from "../types/newperson.type";
import { validateName, validateAge } from "./helpers";

/** Output type for newPerson validate function */
interface NewPersonOutput {
    /** Is the data valid? */
    valid: boolean;
    /** Array of errors if the data wasn't valid */
    error?: string[];
    /** Validated person */
    person?: NewPerson;
}

/**
 *
 * @param body request body with new person's parameters
 * @returns validated person or array of errors if data wasn't valid
 */
const newPerson = (body: NewPerson): NewPersonOutput => {
    // Array for error messages
    const errors: string[] = [];

    // Validate first name
    errors.push(...validateName(body.fname, "fname"));
    // Validate last name
    errors.push(...validateName(body.lname, "lname"));
    // Validate age
    errors.push(...validateAge(body.age));

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
    }
}

export default newPerson;
