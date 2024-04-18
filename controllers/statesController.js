const State = require('../model/State');
const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

// TODO Attach funfacts from MongoDB states array TEST TEST TEST
const getAllStates = async (req, res) => {
    // Attempt to find funfacts in DB
    const dbStates = await State.find();
    const combinedStateData = data.states.map((stateData) => {
        var dbState = dbStates.find(state => state.stateCode === stateData.code)
        if (dbState) {
            stateData.funfacts = [...stateData.funfacts, ...dbState.funfacts];
        }
    });

    const nonContigStateNames = ['Hawaii', 'Alaska'];

    // TODO check for contig parameter here TEST TEST TEST
    if (req.query.contig === 'true') {
        // TODO filter to contig states
        var contigStatesData = combinedStateData.filter(state => !nonContigStateNames.includes(state.state));
        res.json(contigStateData);
    } else if (req.query.contig === 'false') {
        // TODO filter to non-contig states
        var nonContigStates = combinedStateData.filter(state => nonContigStateNames.includes(state.state));
        res.json(nonContigStates);
    } else {
        res.json(combinedStateData);
    }
};

// TODO Include data from statesData.json!!! TEST TEST TEST
const getState = async (req, res) => {
    // Attempt to find funfacts in DB
    const dbState = await State.findOne({ stateCode: req.code }).exec();
    // Grab state from statesData.json
    const dataState = data.states.find(state => state.code === req.code)

    if (dbState) {
        dataState.funfacts = [...dataState.funfacts, ...dbState.funfacts];
        res.json(dataState)
    } else {
        res.json(dataState);
    }
};

const getCapital = async (req, res) => {
    const state = data.states.find(state => state.code === req.code);
    res.json({ 'state': state.state, 'capital': state.capital_city });
};

const getNickname = async (req, res) => {
    const state = data.states.find(state => state.code === req.code);
    res.json({ 'state': state.state, 'nickname': state.nickname });
};

const getPopulation = async (req, res) => {
    const state = data.states.find(state => state.code === req.code);
    res.json({ 'state': state.state, 'population': state.population });
};

const getAdmission = async (req, res) => {
    const state = data.states.find(state => state.code === req.code);
    res.json({ 'state': state.state, 'admitted': state.admission_date });
};

const getStateFact = async (req, res) => {
    // Attempt to find funfacts for state
    const dbState = await State.findOne({ stateCode: req.code }).exec();

    if (dbState) {
        const randomIndex = Math.floor(Math.random() * dbState.funfacts.length);
        res.json({ 'state': dbState.name, 'funfact': dbState.funfacts[randomIndex] });
    }

};

// Not sure if this will work, what if new state facts appear? TEST TEST TEST
const createNewStateFact = async (req, res) => {
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