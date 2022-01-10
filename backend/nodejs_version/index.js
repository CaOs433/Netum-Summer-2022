"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const Person = __importStar(require("./controllers/person.controller"));
const app = express_1.default();
const port = process.env.PORT || 8080;
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
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
    res.sendFile(path_1.default.join(__dirname, 'public/index.html'), (e) => console.log('Error: ', e));
});
app.listen(port, () => {
    console.log(`Example port listening at http://localhost:${port}`);
});
