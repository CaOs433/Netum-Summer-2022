import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import DataTable from './components/DataTable';
import { Alert } from 'react-bootstrap';
import { Results } from './components/database';

/** Main view */
function App() {
	// Is the alert view visible
	const [showAlert, setShowAlert] = React.useState<boolean>(false);
	// Alert view element
	const [alertJSX, setAlertJSX] = React.useState<JSX.Element>(<></>);
	// Latest results from the database
	const [latestResults, setLatestResults] = React.useState<Results | false>();

	/** Make and save alert view */
	const alert = (success: boolean, msg: string, errors: string[]) => {
		// Alert variant (error or success style)
		const variant = success ? "success" : "danger";
		// Header for the alert
		const heading = success ? "Success!" : "Error!";

		// Save the alert view into state
		setAlertJSX(
			<Alert style={styles.alertView} variant={variant} onClose={() => setShowAlert(false)} transition dismissible>
				<Alert.Heading>{heading}</Alert.Heading>
				<p>{msg}</p>
				{0 < errors.length && <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>}
			</Alert>
		);
		// Make the alert visible (unless there's just "success" with no other text)
		setShowAlert(!(msg === "Success!"));
	}

	// Update alert when results changes
	React.useEffect(() => {
		if (latestResults)
			alert(latestResults.status === 200, latestResults.msg, latestResults.errors);
	}, [latestResults]);

	// Return app view
	return (
		<div>
			{showAlert && alertJSX}
			<div style={styles.headerDiv}>
				<h1>Persons</h1>
				<p>Add, edit {'&'} delete persons in a MySQL database</p>
			</div>

			<DataTable setLatestResults={setLatestResults} alert={alert} />
			<div style={styles.divider} />
			<footer id="sticky-footer" style={styles.footer} className="site-footer clearfix py-2 bg-dark text-white-50 mr-auto text-center" >
				<small>
					<a href="https://github.com/CaOs433/Netum-Summer-2022" rel="noreferrer" target="_blank">Github</a> - Oskari Saarinen &copy; 2022
				</small>
			</footer>
		</div>
	);
}

export default App;

/** App CSS styles */
const styles: { [key: string]: React.CSSProperties } = {
	headerDiv: {
		padding: "12px"
	},
	alertView: {
		position: "fixed",
		top: "0px",
		width: "100%",
		borderRadius: 0,
		opacity: 0.95
	},
	footer: {
		bottom: 0
	},
	divider: {
		width: "100%",
		height: "4px",
		backgroundColor: "#346",
		margin: 0
	}
}
