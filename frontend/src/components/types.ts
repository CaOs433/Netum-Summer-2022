/** Type for person object */
export interface Person {
    id: number;
    fname: string;
    lname: string;
    age: number;
}
/** Type for new person object */
export interface NewPerson {
    fname: string;
    lname: string;
    age: number;
}
/** Sort keys for person table */
export enum PersonSortKey {
    id = 0,
    fname = 1,
    lname = 2,
    age = 3,
}
