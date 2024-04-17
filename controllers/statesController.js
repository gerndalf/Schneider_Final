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

// TODO Include data from statesData.json!!!
const getState = async (req, res) => {
    if (!req?.params?.state) {
        return res.status(400).json({ 'message': 'State Abbreviation required.' });
    }

    const state = await State.findOne({ stateCode: req.params.state }).exec();
    if (!state) {
        return res.status(204).json({ 'message': `No state matches code ${req.params.state}` });
    }
    res.json(state);
};

const getCapital = async (req, res) => {

};

const getNickname = async (req, res) => {

};

const getPopulation = async (req, res) => {

};

const getAdmission = async (req, res) => {

};

const getStateFact = async (req, res) => {

};

// Not sure if this will work, what if new state facts appear? TEST TEST TEST
const createNewStateFact = async (req, res) => {
    if (!req?.params?.state) {
        return res.status(400).json({ 'message': 'State Abbreviation required.' });
    }
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'Fun facts required.' });
    }

    const state = await State.findOne({ stateCode: req.params.state }).exec();
    if (!state) {
        return res.status(204).json({ 'message': `No state matches code ${req.params.state}` });
    }
    state.funfacts = [...state.funfacts, ...req.body.funfacts];
    const result = await state.save();
    res.json(result);
};

const updateStateFact = async (req, res) => {
    if (!req?.params?.state) {
        return res.status(400).json({ 'message': 'State Abbreviation required.' });
    }
    if (!req?.body?.funfact || !req?.body?.index) {
        return res.status(400).json({ 'message': 'Fun fact and Index required.' });
    }

    const state = await State.findOne({ stateCode: req.params.state }).exec();
    if (!state) {
        return res.status(204).json({ 'message': `No state matches code ${req.params.state}` });
    }
    state.funfacts[req.body.index] = req.body.funfact;
    const result = await state.save();
    res.json(result);
};

const deleteStateFact = async (req, res) => {
    if (!req?.params?.state) {
        return res.status(400).json({ 'message': 'State Abbreviation required.' });
    }
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': 'Index required.' });
    }

    const state = await State.findOne({ stateCode: req.params.state }).exec();
    if (!state) {
        return res.status(204).json({ 'message': `No state matches code ${req.params.state}` });
    }
    state.funfacts = state.funfacts.splice(req.body.index - 1, req.body.index - 1);
    const result = await state.save();
    res.json(result);
};

module.exports = {
    getAllStates,
    getStateFact,
    createNewStateFact,
    updateStateFact,
    deleteStateFact,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
};