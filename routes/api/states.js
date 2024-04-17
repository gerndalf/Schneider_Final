const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates);


router.get('/:state', statesController.getState);
router.get('/:state/capital', statesController.getCapital);
router.get('/:state/nickname', statesController.getNickname);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state/admission', statesController.getAdmission);


// TODO handle more urls? like /funfact
router.route('/:state/funfact')
    .get(statesController.getStateFact)
    .post(statesController.createNewStateFact)
    .patch(estatesController.updateStateFact)
    .delete(statesController.deleteStateFact);

module.exports = router;