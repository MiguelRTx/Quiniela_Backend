const { Router } = require('express');
const { verifyToken, restrictTo } = require('../../middlewares/auth.middleware');
const adminController = require('./admin.controller');

const router = Router();


router.use(verifyToken);
router.use(restrictTo('ADMIN'));


router.post('/sync', adminController.triggerSync);


router.post('/link-matches', adminController.linkMatches);

module.exports = router;
