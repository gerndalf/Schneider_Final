const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

const stateCodes = data.states.map(state => state.code);

const verifyStates = (req, res, next) => {
    const stateCode = req?.params?.state ? req?.params?.state.toUpperCase() : ''

    if (stateCodes.includes(stateCode)) {
        req.code = stateCode;
        next();
    } else {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
};

module.exports = verifyStates;