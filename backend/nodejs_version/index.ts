import express from "express";
import cors from "cors";
import path from "path";

import * as Person from "./controllers/person.controller";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Routes:

// Get all persons
app.get("/persons", Person.getAll);
// Get person by id
app.get("/persons/:id", Person.getByID);
// Add new person
app.post("/persons", Person.addPerson);
// Edit person by id
app.put("/persons/:id", Person.updateByID);
// Delete person by id
app.delete("/persons/:id", Person.deleteByID);


// Application:
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'), (e) => console.log('Error: ', e));
});

app.listen(port, () => {
    console.log(`Example port listening at http://localhost:${port}`);
});
