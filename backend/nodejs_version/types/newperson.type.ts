/** Type for new Person (same as Person but without id since it will be created automatically by the database) */
export default interface NewPerson {
    /** First name */
    fname: string;
    /** Last name */
    lname: string;
    /** Age */
    age: number;
}
