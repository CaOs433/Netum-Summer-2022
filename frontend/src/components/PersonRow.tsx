import React from "react";
import { Button, Spinner } from "react-bootstrap";

import * as PersonController from "./database";
import { parseAge } from "./helpers";
import { Person } from "./types";

/** PersonRow props */
interface Props {
    person: Person;
    editPersonInState: (arg0: boolean, arg1: Person) => void;
    alert: (arg0: boolean, arg1: string, arg2: string[]) => void;
    colSpan: number;
}

/** HTML table tr element for person */
const PersonRow = (props: Props) => {
    // Props
    const {person, editPersonInState: changePerson, alert, colSpan} = props;

    // Is loading on progress
    const [loading, setLoading] = React.useState<boolean>(false);
    // Is edit mode on
    const [editMode, setEditMode] = React.useState<boolean>(false);

    // Value for fname input
    const [fname, setFname] = React.useState<string>("");
    // Value for lname input
    const [lname, setLname] = React.useState<string>("");
    // Value for age input
    const [age, setAge] = React.useState<string | number>("");

    /** PUT edited person into database and update it into state */
    const editPerson = async () => {
        // Make person object from the new values
        const editedP = {id: person.id, fname: fname, lname: lname, age: Number(age)};
        // Replace edit buttons with loading circle
        setLoading(true);
        // Send new values to the server (PUT request)
        const {status, msg, errors} = await PersonController.editPerson(editedP);
        // Loading ended, bring back the edit buttons and remove loading circle
        setLoading(false);
        // Show alert view with status message for the user
        alert(status === 200, msg, errors);
        // If the request was successful, change the person values in parent state
        if (status === 200)
            changePerson(false, editedP);
        // Turn off edit mode (replace save & cancel buttons with edit & delete buttons)
        setEditMode(false);
    }

    /** DELETE person from database and update state */
    const deletePerson = async (id: number) => {
        // Replace edit buttons with loading circle
        setLoading(true);
        // Send the id of person to delete to the server (DELETE request)
        const {status, msg, errors} = await PersonController.deletePerson(id);
        // Loading ended, bring back the edit buttons and remove loading circle
        setLoading(false);
        // Show alert view with status message for the user
        alert(status === 200, msg, errors);
        // If the request was successful, delete the person from parent state
        if (status === 200)
            changePerson(true, person);
    }

    /** Get table column element */
    const getCol = (c: 0 | 1 | 2, val: string | number) => {
        // If edit mode is on, return html input
        if (editMode) {
            switch (c) {
                case 0: return <input type="text" style={styles.input} value={fname} onChange={(e) => setFname(e.target.value)} />;
                case 1: return <input type="text" style={styles.input} value={lname} onChange={(e) => setLname(e.target.value)} />;
                case 2: return <input type="text" style={styles.input} value={age}   onChange={(e) => setAge(parseAge(e.target.value))} />;

                default: break;
            }
        } return val;
    }

    // Update person value when props changes
    React.useEffect(() => {
        setFname(person.fname);
        setLname(person.lname);
        setAge(person.age);
    }, [person.age, person.fname, person.lname]);

    // Return person row (html table row)
    return (
        <tr>
            <td>{person.id}</td>
            <td>{getCol(0, person.fname)}</td>
            <td>{getCol(1, person.lname)}</td>
            <td>{getCol(2, person.age)}</td>
            <td style={{minWidth: "fit-content"}} colSpan={colSpan}>
                <div style={styles.buttonDiv}>
                    {
                        loading
                            ? <Spinner animation="border" variant="light" />
                            :
                            <>
                                {
                                    editMode
                                        ? <span style={{display: "inline"}}>
                                            <Button variant="success" onClick={editPerson}>Save</Button>
                                            {' '}
                                            <Button variant="danger" onClick={() => setEditMode(false)}>Cancel</Button>
                                        </span>
                                        : <span style={{display: "inline"}}>
                                            <Button variant="warning" onClick={() => setEditMode(true)}>Edit</Button>
                                            {' '}
                                            <Button variant="danger" onClick={async () => deletePerson(person.id)}>Delete</Button>
                                        </span>
                                }
                            </>
                    }
                </div>
            </td>
        </tr>
    );
}

export default PersonRow;

/** PersonRow CSS styles */
const styles: { [key: string]: React.CSSProperties } = {
    buttonDiv: {
        minWidth: "142px",
        display: "inline-block"
    },
    input: {
        minWidth: "40px",
        width: "100%"
    }
}
