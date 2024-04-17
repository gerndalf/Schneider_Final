const State = require('../model/State');
const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

const getAllStates = async (req, res) => {
    // TODO Attach funfacts from MongoDB states array
    const states = await State.find();
    if (!states) return res.status(204).json({ 'message': 'No states found' });

    const nonContigStateNames = ['Hawaii', 'Alaska'];

    // TODO check for contig parameter here
    if (req.query.contig === 'true') {
        // TODO filter to contig states
        var contigStates = data.states.filter(state => !nonContigStateNames.includes(state.state));
        res.json(contigStates);
    } else if (req.query.contig === 'false') {
        // TODO filter to non-contig states
        var nonContigStates = data.states.filter(state => nonContigStateNames.includes(state.state));
        res.json(nonContigStates);
    } else {
        res.json(data.states);
    }
};

const getState = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }
    res.json(employee);
};

const createNewStateFact = async (req, res) => {
    const newEmployee = {
        id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateStateFact = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);
};

const deleteStateFact = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
};

module.exports = {
    getAllStates,
    createNewStateFact,
    updateStateFact,
    deleteStateFact,
    getState
};