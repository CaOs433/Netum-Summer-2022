import sql from "../database/db";
import PersonType from "../types/person.type";
import NewPersonType from "../types/newperson.type";
import { MysqlError } from "mysql";

/** Result handler type (result, error) => void */
type Rlt = (res: any, err: any) => void;

/**
 * Person object
 * @param this the 'this'
 * @param person constructor data
 */
const Person = function(this: PersonType, person: PersonType) {
    this.id = person.id;
    this.fname = person.fname;
    this.lname = person.lname;
    this.age = person.age;
}

/**
 * Make MySQL query to get all persons from the database
 * @param result result handler
 */
Person.getAllPersons = (result: Rlt) => {
    sql.query("SELECT * FROM persons", (err, res) => {
        // If an error occurred, return from this function (errorHandler will handle the error)
        if (errorHandler(err, result))
            return;

        console.log("Persons: ", res);

        // Pass the results for result handler
        result(null, res);
    });
}

/**
 * Make MySQL query to get person by id from the database
 * @param id person id
 * @param result result handler
 */
Person.getPersonByID = (id: number, result: Rlt) => {
    sql.query("SELECT * FROM persons WHERE id = ?", Number(id), (err, res) => {
        // If an error occurred, return from this function (errorHandler will handle the error)
        if (errorHandler(err, result))
            return;

        // Was there a person with that id?
        if (res.length) {
            console.log("Found person: ", res[0]);
            // Pass the results for result handler
            result(null, res[0]);
            return;
        }

        // There was no person with the provided id
        result({ kind: "NOT_FOUND" }, null);
    });
}

/**
 * Make MySQL query to add a person into the database
 * @param newPerson values for the new person
 * @param result result handler
 */
Person.addPerson = (newPerson: NewPersonType, result: Rlt) => {
    sql.query("INSERT INTO persons SET ?", newPerson, (err, res) => {
        // If an error occurred, return from this function (errorHandler will handle the error)
        if (errorHandler(err, result))
            return;

        console.log("Created new person: ", { id: res.insertId, ...newPerson });

        // Pass the results for result handler
        result(null, { id: res.insertId, ...newPerson });
    });
}

/**
 * Make MySQL query to edit a person by id in the database
 * @param id person id
 * @param person new values for the person
 * @param result result handler
 */
Person.editPersonByID = (id: number, person: NewPersonType, result: Rlt) => {
    sql.query(`UPDATE persons SET fname = ?, lname = ?, age = ? WHERE id = ${Number(id)}`, [person.fname, person.lname, person.age], (err, res) => {
        // If an error occurred, return from this function (errorHandler will handle the error)
        if (errorHandler(err, result))
            return;

        // Was there a person with that id
        if (res.affectedRows === 0) {
            // No there wasn't
            console.log(`No person with id ${id}`);
            result({ kind: "NOT_FOUND" }, null);
            return;
        }

        console.log("Updated person: ", { id: id, ...person });

        // Pass the results for result handler
        result(null, { id: id, ...person });
    });
}

/**
 * Make MySQL query to delete a person by id from the database
 * @param id person id
 * @param result result handler
 */
Person.deletePersonByID = (id: number, result: Rlt) => {
    sql.query("DELETE FROM persons WHERE id = ?", Number(id), (err, res) => {
        // If an error occurred, return from this function (errorHandler will handle the error)
        if (errorHandler(err, result))
            return;

        // Was there a person with that id
        if (res.affectedRows === 0) {
            // No there wasn't
            result({ kind: "NOT_FOUND" }, null);
            return;
        }

        console.log("Deleted person with id: ", id);

        // Pass the results for result handler
        result(null, res);
    });
}

/**
 * Error handler for MySQL queries
 * @param err MySQL query error
 * @param result result handler
 * @returns true if there was any errors, otherwise false
 */
const errorHandler = (err: MysqlError | null, result: Rlt) => {
    if (err) {
        console.log("Error: ", err);
        result(null, err);
        return true;
    } return false;
}

export default Person;
