const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

router.get('/', statesController.getAllStates);
router.get('/:state', verifyStates, statesController.getState)
router.get('/:state/capital', verifyStates, statesController.getCapital)
router.get('/:state/nickname', verifyStates, statesController.getNickname)
router.get('/:state/population', verifyStates, statesController.getPopulation)
router.get('/:state/admission', verifyStates, statesController.getAdmission);

router.route('/:state/funfact')
    .get(verifyStates, statesController.getStateFact)
    .post(verifyStates, statesController.createNewStateFact)
    .patch(verifyStates, statesController.updateStateFact)
    .delete(verifyStates, statesController.deleteStateFact);

module.exports = router;