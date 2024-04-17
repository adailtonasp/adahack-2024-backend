const { Router } = require('express');
const controllers = require('../controllers/candidate-controller')
const auth = require('../middlewares/candidate-auth')

const router = Router();

router.route('/')
    .post(controllers.createCandidate)


router.route('/login')
    .post(controllers.loginCandidate)

router.route('/:id')
    .get(auth, controllers.getOneCandidate)
    .put(auth, controllers.updateCandidate)


module.exports = router