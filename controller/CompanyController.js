const Companies = require('../models/CompanyModel');
const fs = require('fs');
const gm = require('gm');
const path = require('path');

module.exports = {
    //Find all Companies
    getAll : function (req, res) {
        Companies.getAll(function (err, companies) {
            if(err)
                return res.send(err);

            res.json(companies);
        });
    },

    get: function (req, res) {
        Companies.get({_id: req.params._id}, function (err, company) {
            if(err)
                return res.send(err);
            res.json(company);
        })
    },
//Create an Company
    Create: function (req, res) {

        let height = 250;
        let width = 250;
        let original_image_path = req.files.logo[0].path;
        let logo_path_prefix = './public/images/logos/thumb/';
        let logo_path = logo_path_prefix + req.files.logo[0].fieldname + '-' + Date.now() + path.extname(req.files.logo[0].filename);

        gm(original_image_path)
            .resize(width, height, '!')
            .noProfile()
            .write(logo_path, function (err) {
                if(err)
                    throw err;
            });

        req.body.logo = logo_path;
        //req.body.avatar = req.files.avatar[0].path;

        Companies.create(req.body, function (err, company) {
            console.log(req.body);
            if(err)
                return res.send(err);
            res.json(company);
        });
    },

//Update an Company
    Update: function (req, res) {
        Companies.count({_id: req.params._id}, function (err, count) {
            if(err)
                return res.send(err);
            if(count<1)
                return res.json({message: 'Company not found'});

            Companies.updateById(req.params._id, req.body, function (err, company) {
                if(err)
                    return res.send(err);
                res.json(company);
            });
        });
    },

//Delete an Company
    Delete: function (req, res) {
        Companies.count({_id: req.params._id}, function (err, count) {

            if(err)
                return res.send(err);
            if(count<1){
                return res.json({message: 'Company not found'});
            }
            Companies.removeById({_id: req.params._id}, function(err, company) {
                if (err)
                    return res.send(err);

                res.json({ message: 'Successfully deleted' });
            });

        });
    }
};