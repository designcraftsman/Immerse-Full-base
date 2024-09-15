const express = require('express');
const router = express.Router();
const SessionCtrl = require('../controllers/sessionCtrl');
const auth = require('../middleware/auth');

router.post('/add' ,SessionCtrl.addSession);
router.get('/getByTeacher/:id' , SessionCtrl.getSessionsByTeacher);
router.get('/getByStudent/:username' , SessionCtrl.getSessionsByStudent);


module.exports = router;