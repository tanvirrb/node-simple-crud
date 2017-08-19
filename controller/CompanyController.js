const Companies = require('../models/CompanyModel');
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

        if(req.files[0]){
            let original_image_path = req.files[0].path;
            let logo_path = req.files[0].destination + '/thumb/' + req.files[0].fieldname + '-' + Date.now() + path.extname(req.files[0].filename);

            Companies.resizeImage(original_image_path, logo_path, function (err) {
                if(err)
                    throw err;
                console.log('image resized');
            });

            req.body.logo = logo_path;
        }
        console.log(req.body);

        Companies.create(req.body, function (err, company) {
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