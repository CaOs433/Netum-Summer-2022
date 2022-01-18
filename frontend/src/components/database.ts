import axios, { AxiosResponse } from 'axios';
import { Person, NewPerson } from './types';

/** Base url for the requests */
const BASE_URL = "https://netum-summer.herokuapp.com";

/**
 * Get all persons from the database
 * Path: GET - /persons
 * @returns request results (all persons if request was successful)
 */
export const fetchPersons = async () => {
    // Request url
    const url = BASE_URL+"/persons";
    // Make the request
    const result = await makeRequest<Person[]>(() => axios.get(url));
    // Return request results
    return result;
}

/**
 * Get person from the database
 * Path: GET - /persons/{id}
 * @param id id of the person to retrieve from the database
 * @returns request results (the person if request was successful)
 */
export const fetchPerson = async (id: number) => {
    // Request url
    const url = BASE_URL+"/persons/"+id;
    // Make the request
    const result = await makeRequest<Person>(() => axios.get(url));
    // Return request results
    return result;
}

/**
 * Add person into the database
 * Path: POST - /persons
 * @param person person to be inserted into the database
 * @returns request results (the new person if added successfully)
 */
export const addPerson = async (person: NewPerson) => {
    // Request url
    const url = BASE_URL+"/persons";
    // Make the request
    const result = await makeRequest<Person>(() => axios.post(url, person));
    // Return request results
    return result;
}

/**
 * Edit person in the database
 * Path: PUT - /persons/{id}
 * @param person edited person data
 * @returns request results (edited person if edited successfully)
 */
export const editPerson = async (person: Person) => {
    // Request url
    const url = BASE_URL+"/persons/"+person.id;
    // Make the request
    const result = await makeRequest<Person>(() => axios.put(url, person));
    // Return request results
    return result;
}

/**
 * Delete person from the database
 * Path: DELETE - /persons/{id}
 * @param id id of the person to be deleted from database
 * @returns request results (true if deleted successfully)
 */
export const deletePerson = async (id: number) => {
    // Request url
    const url = BASE_URL + "/persons/" + id;
    // Make the request
    const result = await makeRequest<true>(() => axios.delete(url));
    // Return request results
    return result;
}

/** Results for makeRequest function */
export interface Results {
    status: number;
    msg: string;
    data: any;
    errors: string[];
}

/**
 * Make an axios request and parse results
 * @param req function that makes axios request and returns it's results
 * @returns parsed results in promise
 */
async function makeRequest<Output>(req: () => Promise<AxiosResponse<any, any>>): Promise<Results> {
    // Request status code
    let status: number = -1;
    // Message from the server (success or error message)
    let msg: string = "";
    // Data from the server or false
    let rltData: Output | false = false;
    // Array of errors (validation of request parameters)
    let errors: string[] = [];

    try {
        // Make the request
        const res = await req();
        console.log("Results: ", res);
        status = res.status;

        // Data from the result body
        const data = await res.data;
        console.log("Data: ", data);

        // Get message from the response
        msg = data.message || "";
        console.log("msg: ", msg);

        // Parse the result data into TypeScript interface
        const parsed: Output = JSON.parse(JSON.stringify(data.data));
        console.log("Parsed: ", parsed);
        rltData = parsed;

    } catch (e: any) {
        // An error occurred - save error(s) and status
        console.log("Error: ", e);
        status = e.response.status || -1;
        if (e.name === "NetworkError") // Network error
            msg = `${e.name}`;
        else if (status === 400) // Bad request - get the errors
            errors = e.response.data.error || [];
    }

    // Return the results
    return { status: status, msg: msg, data: rltData, errors: errors }
}
