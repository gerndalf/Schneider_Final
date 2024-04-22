const State = require('../model/State');
const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

const getAllStates = async (req, res) => {
    // Attempt to find funfacts in DB
    const dbStates = await State.find();

    var combinedStateData = [];
    if (dbStates.length > 0) {
        combinedStateData = data.states.map((stateData) => {
            var dbState = dbStates.find(state => state.stateCode === stateData.code)
            if (dbState) {
                if (stateData.funfacts) {
                    dbState.funfacts.forEach(funfact => { stateData.funfacts.push(funfact) });
                } else {
                    stateData.funfacts = dbState.funfacts;
                }
            }
            return stateData;
        });
    } else {
        combinedStateData = data.states;
    }

    const nonContigStateNames = ['Hawaii', 'Alaska'];

    if (req.query.contig === 'true') {
        var contigStatesData = combinedStateData.filter(state => !nonContigStateNames.includes(state.state));
        res.json(contigStatesData);
        console.log("contigTrue");
    } else if (req.query.contig === 'false') {
        var nonContigStates = combinedStateData.filter(state => nonContigStateNames.includes(state.state));
        res.json(nonContigStates);
        console.log("contigFalse");
    } else {
        res.json(combinedStateData);
        console.log("noContig");
    }
};

const getState = async (req, res) => {
    // Attempt to find funfacts in DB
    const dbState = await State.findOne({ stateCode: req.code }).exec();
    // Grab state from statesData.json
    const dataState = data.states.find(state => state.code === req.code)
    console.log(dataState.toString());
    if (dbState && dbState.funfacts.length > 0) {
        if (dataState.funfacts) {
            dbState.funfacts.forEach(funfact => { dataState.funfacts.push(funfact) });
        } else {
            dataState.funfacts = dbState.funfacts;
        }
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
    res.json({ 'state': state.state, 'population': state.population.toLocaleString() });
};

const getAdmission = async (req, res) => {
    const state = data.states.find(state => state.code === req.code);
    res.json({ 'state': state.state, 'admitted': state.admission_date });
};

const getStateFact = async (req, res) => {
    // Attempt to find funfacts in DB
    const dbState = await State.findOne({ stateCode: req.code }).exec();
    // Grab state from statesData.json
    const dataState = data.states.find(state => state.code === req.code)

    // Verify possible DB funfacts and combine with JSON data
    if (dbState && dbState.funfacts.length > 0) {
        if (dataState.funfacts) {
            dataState.funfacts = [...dataState.funfacts, ...dbState.funfacts];
        } else {
            dataState.funfacts = dbState.funfacts;
        }
    }

    if (dataState.funfacts !== undefined && dataState.funfacts.length > 0) {
        const randomIndex = Math.floor(Math.random() * dataState.funfacts.length);
        res.json({ 'funfact': dataState.funfacts[randomIndex] });
    } else {
        res.status(404).json({ 'message': `No Fun Facts found for ${dataState.state}` });
    }
};

const createNewStateFact = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    } else if (!Array.isArray(req?.body?.funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }

    // Look for existing DB document
    const dbState = await State.findOne({ stateCode: req.params.state }).exec();

    if (!dbState) {
        const dataState = data.states.find(state => state.code === req.params.state);
        try {
            const result = await State.create({
                stateCode: dataState.code,
                funfacts: [...req.body.funfacts]
            })

            res.status(201).json(result);
        } catch (err) {
            console.error(err);
        }
    } else {
        if (dbState.funfacts) {
            req.body.funfacts.forEach(funfact => { dbState.funfacts.push(funfact) });
        } else {
            dbState.funfacts = req.body.funfacts;
        }
        const result = await dbState.save();
        res.status(201).json(result);
    }
};

const updateStateFact = async (req, res) => {
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    } else if (!req?.body?.funfact) {
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }

    const state = await State.findOne({ stateCode: req.params.state }).exec();
    // Grab JSON data for state name
    const dataState = data.states.find(state => state.code === req.params.state);

    if (state) {
        if (state.funfacts[parseInt(req.body.index) - 1]) {
            state.funfacts[parseInt(req.body.index) - 1] = req.body.funfact;
            const result = await state.save();
            res.json(result);
        } else {
            res.status(404).json({ 'message': `No Fun Fact found at that index for ${dataState.state}` });
        }
    } else {
        res.status(404).json({ 'message': `No Fun Facts found for ${dataState.state}` });
    }
};

const deleteStateFact = async (req, res) => {
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    // Grab JSON data for state name
    const dataState = data.states.find(state => state.code === req.params.state);

    // Check DB for state
    const dbState = await State.findOne({ stateCode: req.params.state }).exec();
    if (dbState === null || dbState.funfacts.length <= 0) {
        return res.status(404).json({ 'message': `No Fun Facts found for ${dataState.state}` });
    }

    // Check dbState for index fact
    if (dbState.funfacts[parseInt(req.body.index) - 1]) {
        dbState.funfacts.splice(parseInt(req.body.index) - 1, 1);
        const result = await dbState.save();
        res.json(result);
    } else {
        res.status(404).json({ 'message': `No Fun Fact found at that index for ${dataState.state}` });
    }
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
    getAdmission,
};