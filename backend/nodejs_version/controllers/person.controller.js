"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteByID = exports.updateByID = exports.addPerson = exports.getByID = exports.getAll = void 0;
const person_model_1 = __importDefault(require("../models/person.model"));
const newperson_validate_1 = __importDefault(require("../validate/newperson.validate"));
/**
 * Get all persons from the database
 * @param req request
 * @param res response
 * @returns sends all persons or an error message for the client
 */
const getAll = (req, res) => person_model_1.default.getAllPersons((err, data) => {
    // Check for errors and handle the results
    errorHandler(err, req, res, "There was an error while trying to retrieve persons from the database!", "Success!", data);
});
exports.getAll = getAll;
/**
 * Get person by id from the database
 * @param req request with person id
 * @param res response
 * @returns send person with provided id (in the request body) or an error message for the client
 */
const getByID = (req, res) => person_model_1.default.getPersonByID(req.params.id, (err, data) => {
    // Check for errors and handle the results
    errorHandler(err, req, res, `There was an error while trying to retrieve person with id ${req.params.id} from the database!`, "Success!", data);
});
exports.getByID = getByID;
/**
 * Add new person into the database
 * @param req request with person values
 * @param res response
 * @returns sends message of status of the person insert for the client
 */
const addPerson = (req, res) => {
    // Was the request body provided (there should be values for the person)
    if (!req.body) {
        res.status(400).send({ error: "Missing body of the POST request!" });
        return;
    }
    console.log("req.body: ", req.body);
    // Validate the person data
    const validated = (0, newperson_validate_1.default)(req.body);
    // Was the data valid?
    if (!validated.valid || validated.person === undefined) {
        // No it wasn't
        res.status(400).send({ error: validated.error });
        return;
    }
    // Make the MySQL query
    person_model_1.default.addPerson(validated.person, (err, data) => {
        // Check for errors and handle the results
        errorHandler(err, req, res, "There was an error while trying to add the new person into the database.", `New person was successfully inserted into the database!`, data);
    });
};
exports.addPerson = addPerson;
/**
 * Update person by id in the database
 * @param req request with new person values
 * @param res response
 * @returns sends message of status of the person update for the client
 */
const updateByID = (req, res) => {
    // Validate the person data
    const validated = (0, newperson_validate_1.default)(req.body);
    // Was the data valid?
    if (!validated.valid || validated.person === undefined) {
        // No it wasn't
        res.status(400).send({ error: validated.error });
        return;
    }
    console.log("req.body: ", req.body);
    // Make the MySQL query
    person_model_1.default.editPersonByID(req.params.id, validated.person, (err) => {
        // Check for errors and handle the results
        errorHandler(err, req, res, `There was an error while trying to edit person with id ${req.params.id} in the database.`, `Person with id ${req.params.id} was successfully updated in the database!`);
    });
};
exports.updateByID = updateByID;
/**
 * Delete person by id from the database
 * @param req request with person id
 * @param res response
 * @returns sends message of status of the person deletion for the client
 */
const deleteByID = (req, res) => person_model_1.default.deletePersonByID(req.params.id, (err) => {
    // Check for errors and handle the results
    errorHandler(err, req, res, `There was an error while trying to delete person with id ${req.params.id} from the database.`, `Person with id ${req.params.id} was successfully deleted from the database!`);
});
exports.deleteByID = deleteByID;
/**
 * Error handler for MySQL query results
 * @param err MySQL error
 * @param req request
 * @param res response
 * @param err_msg error message
 * @param success_msg success message
 * @param data data from the MySQL query
 */
const errorHandler = (err, req, res, err_msg, success_msg, data) => {
    // Was there an error?
    if (err) {
        // Was the error 'NOT FOUND'?
        if (err.kind && err.kind === "NOT_FOUND") {
            // No person with provided id
            res.status(404).send({
                message: `There was no person with id ${req.params.id}!`
            });
        }
        else {
            // Some other error occurred
            res.status(500).send({
                message: err_msg,
                mysql_error_msg: err.message || ""
            });
        }
    }
    else {
        // No errors, send results data and success message for the client
        res.send({ message: success_msg, data: data || true });
    }
};
