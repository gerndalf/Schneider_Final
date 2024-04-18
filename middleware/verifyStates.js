const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

const stateCodes = data.states.map(state => state.code);

const verifyStates = (req, res, next) => {
    const stateCode = req.params.state;

    // Move along if no code provided.
    if (stateCode === undefined) {
        next();
    }

    if (stateCodes.includes(stateCode.toUpperCase())) {
        req.code = stateCode.toUpperCase();
        next();
    } else {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
};

module.exports = verifyStates;