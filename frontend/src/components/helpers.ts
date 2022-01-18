/**
 * Removes leading zeroes (leaves single zero) and all characters but numbers from a string
 * @param ageV age string to parse
 * @returns parsed age string
 */
export const parseAge = (ageV: string) => {
    // Remove all characters but numbers
    let filtered = (ageV.match(/[0-9]+/) || []).join('');
    // Remove leading zeros but keep single zero
    filtered.replace(/^0+(\d)/, '$1'); //ageV.replace(/[0-9]+/, '')
    // Return filtered age
    return filtered;
}

/**
 * Validates name string
 * @param str name string to be validated
 * @param name parameter's name for error messages
 * @returns array of error messages (empty if valid)
 */
 export const validateName = (str: string, name: string): string[] => {
    // Array for error messages
    const errors: string[] = [];

    // Return error if str was undefined
    if (!str)
        errors.push(`Missing ${name}!`);

    // Return error array
    return errors;
}

/**
 * Validates age (string or number)
 * @param age value to be validated
 * @returns array of error messages (empty if valid)
 */
export const validateAge = (age: number | string | undefined): string[] => {
    // Return error if age was undefined
    if (!age)
        return ["Missing age!"];

    // Array for error messages
    const errors: string[] = [];
    // Convert age to number
    const _age = Number(age);

    if (Number.isNaN(_age)) // Is age a valid number?
        errors.push("Age must be a valid number!");
    else if (age < 0) // Is age a positive number?
        errors.push("Age must be a positive number!");

    // Return error array
    return errors;
}
