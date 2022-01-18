import React from "react";

import { Button, Table, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { CaretUpFill, CaretDownFill, InfoCircle } from 'react-bootstrap-icons';

import { Person, PersonSortKey } from "./types";
import { fetchPersons, addPerson, Results } from "./database";
import PersonRow from "./PersonRow";
import { parseAge } from "./helpers";
import newPerson from "./newperson.validate";

/** DataTable props */
interface Props {
    // Function to set alert in parent view
    alert: (arg0: boolean, arg1: string, arg2: string[]) => void;
    // Function to save latest results into parent view state
    setLatestResults: Function;
}

/** Type for sorter input data */
interface SorterProps {
    // Array for persons
    persons: Person[];
    // Sort key for the persons
    sortKey?: PersonSortKey;
    // Ascending order?
    sortAsc?: boolean;
}

/**
 * Sort and return persons array
 * @param _initialData not needed
 * @param data persons array to sort, sort key & asc/desc key (boolean - true if asc)
 * @returns sorted persons array
 */
const sorter = (_initialData: Person[], data: SorterProps) => {
    const {persons, sortKey, sortAsc} = data;
    switch (sortKey || 0) {
        case PersonSortKey.id: persons.sort((a, b) => a.id - b.id); break;
        case PersonSortKey.fname: persons.sort((a, b) => a.fname.localeCompare(b.fname)); break;
        case PersonSortKey.lname: persons.sort((a, b) => a.lname.localeCompare(b.lname)); break;
        case PersonSortKey.age: persons.sort((a, b) => a.age - b.age); break;

        default: break;
    } return sortAsc ? persons.reverse() : persons;
}

/**
 * HTML Table for persons
 * @param param0
 * @returns
 */
const DataTable = ({alert, setLatestResults}: Props) => {
    // Is data loading in progress
    const [loading, setLoading] = React.useState<boolean>(false);
    // Sort key for table data
    const [sortKey, setSortKey] = React.useState<PersonSortKey>(0);
    // Is the data in ascending order
    const [sortAsc, setSortAsc] = React.useState<boolean>(true);

    // Latest fetch results
    const [latestResults, setLatestRlts] = React.useState<Results | false>();
    // Data for the table
    const [persons, dispatch] = React.useReducer(sorter, []);

    // Firstname value (new person input)
    const [fname, setFname] = React.useState<string>("");
    // Lastname value (new person input)
    const [lname, setLname] = React.useState<string>("");
    // Age value (new person input)
    const [age, setAge] = React.useState<string | number>("");

    /** Fetch and save the persons data from server */
    const updatePersons = React.useCallback(async () => {
        setLoading(true);
        const results = await fetchPersons();
        setLoading(false);
        setLatestResults(results);
        setLatestRlts(results);
    }, [setLatestResults]);

    // Update persons data on page load
    React.useEffect(() => {
        updatePersons();
    }, [updatePersons]);

    // Update table when data, asc key or sort key changes
    React.useEffect(() => {
        if (latestResults && latestResults.status === 200 && latestResults.data)
            dispatch({persons: latestResults.data, sortKey: sortKey, sortAsc: sortAsc});
    }, [latestResults, sortAsc, sortKey]);

    /** Add new person into the database */
    const addNewPerson = async () => {
        // Validate user's input for new person
        const {valid, person, error} = newPerson({ fname: fname, lname: lname, age: Number(age) });
        // Was the input valid?
        if (valid && person) {
            // Valid input - make POST request to add the new person into database
            const { status, msg, data, errors } = await addPerson(person);
            // If the request was valid, save the new person into latest results state
            if (status === 200 && data)
                setLatestRlts({ status: status, msg: msg, data: [...persons, data], errors: errors });
            // Save results into parent state (triggers alert message for the user)
            setLatestResults({ status: status, msg: msg, data: data, errors: errors });
        } else {
            // Invalid input - show alert message for the user
            alert(false, "Invalid input!", error || []);
        }
    }

    /**
     * Edit person in the state (delete if del === true)
     * @param del delete (boolean)
     * @param p person
     */
    const editPersonInState = (del: boolean, p: Person) => {
        if (del) // Delete:
            dispatch({persons: persons.filter((p1) => p1.id !== p.id), sortKey: sortKey, sortAsc: sortAsc});
        else     // Edit:
            dispatch({persons: persons.map((x) => x.id !== p.id ? x : p), sortKey: sortKey, sortAsc: sortAsc});
    }

    /**
     * Change sort key or toggle asc/desc order
     * @param by sort key
     */
    const sortTable = (by: PersonSortKey) => {
        // Toggle asc/desc key if same column was clicked again
        if (sortKey === by)
            setSortAsc(!sortAsc);
        else
            setSortKey(by);
    }

    /** Get the right arrow icon */
    const getArrow = sortAsc ? <CaretUpFill /> : <CaretDownFill />;
    /**
     * Get table header element
     * @param name column name
     * @returns html table header (<th/>) element
     */
    const getTH = (name: "id" | "fname" | "lname" | "age" | string) => {
        // Variables for header values
        let title, arrow, sortFunc;
        // Set right values
        switch (name) {
            case "id":    title = "#";         arrow = (sortKey === 0) ? getArrow : ''; sortFunc = () => sortTable(0); break;
            case "fname": title = "Firstname"; arrow = (sortKey === 1) ? getArrow : ''; sortFunc = () => sortTable(1); break;
            case "lname": title = "Lastname";  arrow = (sortKey === 2) ? getArrow : ''; sortFunc = () => sortTable(2); break;
            case "age":   title = "Age";       arrow = (sortKey === 3) ? getArrow : ''; sortFunc = () => sortTable(3); break;

            default: title = name.toUpperCase(); arrow = ''; sortFunc = () => sortTable(0); break;
        }
        // Return header element
        return (
            <th key={name} onClick={sortFunc}>
                <p style={styles.p}>
                    <span>{title}</span>
                    <span>{arrow}</span>
                </p>
            </th>
        );
    }

    /** Get html table element */
    const getTable = () => (
        <Table style={styles.table} striped bordered hover responsive variant="dark">
            <thead>
                <tr>
                    {["id", "fname", "lname", "age"].map(name => getTH(name))}
                    <th><p style={styles.p}><span>Action</span></p></th>
                    <th style={styles.infoC}>
                        <p style={styles.p} className="text-center">
                            <span />
                            <OverlayTrigger trigger="click" placement="left"
                                overlay={
                                    <Popover id="popover-positioned-top">
                                        <Popover.Header as="h3">Sort table</Popover.Header>
                                        <Popover.Body>Click table header to sort by it's columns</Popover.Body>
                                    </Popover>
                                }
                            >
                                <InfoCircle />
                            </OverlayTrigger>
                            <span />
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {persons.map((person) => <PersonRow key={person.id} person={person} editPersonInState={editPersonInState} alert={alert} colSpan={2} />)}
                <tr>
                    <td>x</td>
                    <td><input style={styles.input} type="text" name="fname" placeholder="firstname" value={fname} onChange={(e) => setFname(e.target.value)} /></td>
                    <td><input style={styles.input} type="text" name="lname" placeholder="lastname"  value={lname} onChange={(e) => setLname(e.target.value)} /></td>
                    <td><input style={styles.input} type="text" name="age"   placeholder="age"       value={age}   onChange={(e) => setAge(parseAge(e.target.value))} /></td>
                    <td colSpan={2}><Button variant="primary" onClick={addNewPerson}>Add</Button></td>
                </tr>
            </tbody>
        </Table>
    );

    // If loading is in progress, return spinner otherwise return table
    return loading ? <Spinner animation="grow" variant="info" /> : getTable();
}

export default DataTable;

/** DataTable CSS styles */
const styles: { [key: string]: React.CSSProperties } = {
    p: {
        display: 'flex',
        justifyContent: "space-between"
    },
    infoC: {
        padding: "8px",
        textAlign: 'center',
    },
    newPersonInputs: {
        minWidth: "100px",
        width: "fit-content"
    },
    input: {
        minWidth: "40px",
        width: "100%"
    },
    table: {
        margin: 0
    }
}
