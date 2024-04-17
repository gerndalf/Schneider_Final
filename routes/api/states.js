const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates);

// Handle passed in State Code only (KS, NE, TX, etc)
router.route('/:state')
    .get(statesController.getState)
    .post(statesController.createNewStateFact)
    .put(estatesController.updateStateFact)
    .delete(statesController.deleteStateFact)
// TODO handle more urls? like /funfact

module.exports = router;