import Person from "../models/person.model";
import MySQLError from "../types/mysqlerror.type";
import newPersonValidator from "../validate/newperson.validate";

/**
 * Get all persons from the database
 * @param req request
 * @param res response
 * @returns sends all persons or an error message for the client
 */
export const getAll = (req: any, res: any) => Person.getAllPersons((err, data) => {
    // Check for errors and handle the results
    errorHandler(
        err,
        req,
        res,
        "There was an error while trying to retrieve persons from the database!",
        "Success!",
        data
    );
});

/**
 * Get person by id from the database
 * @param req request with person id
 * @param res response
 * @returns send person with provided id (in the request body) or an error message for the client
 */
export const getByID = (req: any, res: any) => Person.getPersonByID(req.params.id, (err, data) => {
    // Check for errors and handle the results
    errorHandler(
        err,
        req,
        res,
        `There was an error while trying to retrieve person with id ${req.params.id} from the database!`,
        "Success!",
        data
    );
});

/**
 * Add new person into the database
 * @param req request with person values
 * @param res response
 * @returns sends message of status of the person insert for the client
 */
export const addPerson = (req: any, res: any) => {
    // Was the request body provided (there should be values for the person)
    if (!req.body) {
        res.status(400).send({ error: "Missing body of the POST request!" });
        return;
    }

    console.log("req.body: ", req.body);

    // Validate the person data
    const validated = newPersonValidator(req.body);

    // Was the data valid?
    if (!validated.valid || validated.person === undefined) {
        // No it wasn't
        res.status(400).send({ error: validated.error });
        return;
    }

    // Make the MySQL query
    Person.addPerson(validated.person, (err, data) => {
        // Check for errors and handle the results
        errorHandler(
            err,
            req,
            res,
            "There was an error while trying to add the new person into the database.",
            `New person was successfully inserted into the database!`,
            data
        );
    });
}

/**
 * Update person by id in the database
 * @param req request with new person values
 * @param res response
 * @returns sends message of status of the person update for the client
 */
export const updateByID = (req: any, res: any) => {
    // Validate the person data
    const validated = newPersonValidator(req.body);

    // Was the data valid?
    if (!validated.valid || validated.person === undefined) {
        // No it wasn't
        res.status(400).send({ error: validated.error });
        return;
    }

    console.log("req.body: ", req.body);

    // Make the MySQL query
    Person.editPersonByID(req.params.id, validated.person, (err) => {
        // Check for errors and handle the results
        errorHandler(
            err,
            req,
            res,
            `There was an error while trying to edit person with id ${req.params.id} in the database.`,
            `Person with id ${req.params.id} was successfully updated in the database!`
        );
    });
}

/**
 * Delete person by id from the database
 * @param req request with person id
 * @param res response
 * @returns sends message of status of the person deletion for the client
 */
export const deleteByID = (req: any, res: any) => Person.deletePersonByID(req.params.id, (err) => {
    // Check for errors and handle the results
    errorHandler(
        err,
        req,
        res,
        `There was an error while trying to delete person with id ${req.params.id} from the database.`,
        `Person with id ${req.params.id} was successfully deleted from the database!`
    );
});

/**
 * Error handler for MySQL query results
 * @param err MySQL error
 * @param req request
 * @param res response
 * @param err_msg error message
 * @param success_msg success message
 * @param data data from the MySQL query
 */
const errorHandler = (err: MySQLError, req: any, res: any, err_msg: string, success_msg: string, data?: any) => {
    // Was there an error?
    if (err) {
        // Was the error 'NOT FOUND'?
        if (err.kind && err.kind === "NOT_FOUND") {
            // No person with provided id
            res.status(404).send({
                message: `There was no person with id ${req.params.id}!`
            });
        } else {
            // Some other error occurred
            res.status(500).send({
                message: err_msg,
                mysql_error_msg: err.message || ""
            });
        }
    } else if (data.errno) {
        // Some other error occurred
        res.status(500).send({ message: err_msg });
    } else {
        // No errors, send results data and success message for the client
        res.send({ message: success_msg, data: data || true });
    }
}
