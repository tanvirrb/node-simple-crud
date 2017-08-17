const express = require('express');
const router = express.Router();
const Animals = require('../controller/CompanyController');
const multer  = require('multer');
const gm = require('gm').subClass({imageMagick: true});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/logos')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

router.route('/companies').get(Animals.getAll);
router.route('/companies/:_id').get(Animals.get);
router.route('/companies').post(Animals.Create);
router.route('/companies/:_id').put(Animals.Update);
router.route('/companies/:_id').delete(Animals.Delete);

module.exports = router;
