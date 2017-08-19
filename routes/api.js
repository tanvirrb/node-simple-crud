const express = require('express');
const router = express.Router();
const Company = require('../controller/CompanyController');
const multer  = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/logos');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({ storage: storage }).array('logo', 1);

router.route('/companies').get(Company.getAll);
router.route('/companies/:_id').get(Company.get);
router.route('/companies').post(upload, Company.Create);
router.route('/companies/:_id').put(Company.Update);
router.route('/companies/:_id').delete(Company.Delete);

module.exports = router;
