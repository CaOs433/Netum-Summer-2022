/**
 *
 * @param str name string to be validated
 * @param name parameter's name for error messages
 * @returns array of error messages (empty if valid)
 */
export const validateName = (str: string, name: string): string[] => {
    // Array for error messages
    const errors: string[] = [];

    // Return error if str was undefined
    if (!str)
        errors.push(`Missing parameter '${name}'!`);

    // Return error array
    return errors;
}

/**
 *
 * @param age value to be validated
 * @returns array of error messages (empty if valid)
 */
export const validateAge = (age: number | string | undefined): string[] => {
    // Return error if age was undefined
    if (!age)
        return ["Missing parameter 'age'!"];

    // Array for error messages
    const errors: string[] = [];
    // Convert age to number
    const _age = Number(age);

    if (Number.isNaN(_age)) // Is age a valid number?
        errors.push("Parameter 'age' must be a valid number!");
    else if (age < 0) // Is age a positive number?
        errors.push("Parameter 'age' must be a positive number!");

    // Return error array
    return errors;
}
