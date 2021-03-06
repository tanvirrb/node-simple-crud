const Companies = require('../models/CompanyModel');
const fs = require('fs');

module.exports = {
    //Find all Companies
    getAll : function (req, res) {
        Companies.getAll(function (err, companies) {
            if(err)
                return res.status(400).json(err);

            res.status(200).json(companies);
        });
    },

    get: function (req, res) {
        Companies.count({_id: req.params._id}, function (err, count) {
            if(err)
                return res.status(400).json(err);
            if(count<1)
                return res.status(404).json({message: 'Company not found'});

            Companies.get({_id: req.params._id}, function (err, company) {
                if(err)
                    return res.status(400).json(err);

                res.status(200).json(company);
            });
        });
    },

//Create an Company
    Create: function (req, res) {

        //check if there is any file with the request
        if(req.files[0]){

            let original_image_path = req.files[0].path;
            let logo_path = req.files[0].destination + '/thumb/' + req.files[0].filename;

            //resize image with gm
            Companies.resizeImage(original_image_path, logo_path, function (err) {
                if(err)
                    return res.status(400).json(err);
                console.log('image resized');

                Companies.deleteImage(original_image_path, function (err) {
                    if(err)
                        return res.status(400).json(err);
                    console.log('Image deleted');
                });
            });

            req.body.logo = req.files[0].filename;
            req.body.logo_path = req.files[0].destination + '/thumb/';
        }

        Companies.create(req.body, function (err, company) {
            if(err)
                return res.status(400).json(err);

            res.status(200).json(company);
        });
    },

//Update an Company
    Update: function (req, res) {
        Companies.count({_id: req.params._id}, function (err, count) {
            if(err)
                return res.status(400).json(err);
            if(count<1)
                return res.status(404).json({message: 'Company not found'});

            if(req.files[0]){

                let original_image_path = req.files[0].path;
                let logo_path = req.files[0].destination + '/thumb/' + req.files[0].filename;

                Companies.get({_id: req.params._id}, function (err, company) {
                    if(err)
                        return res.status(400).json(err);

                    let old_image = company.logo_path + company.logo;

                    if(fs.existsSync(old_image)){
                        Companies.deleteImage(old_image, function (err) {
                            if(err)
                                console.log(err);//res.status(400).json(err);

                            console.log('Old logo deleted.');

                        });
                    }

                    //resize image with gm
                    Companies.resizeImage(original_image_path, logo_path, function (err) {
                        if(err)
                            return res.status(400).json(err);
                        console.log('Image resized for logo');

                        Companies.deleteImage(original_image_path, function (err) {
                            if(err)
                                return res.status(400).json(err);
                            console.log('Main image deleted');
                        });
                    });
                });

                req.body.logo = req.files[0].filename;
                req.body.logo_path = req.files[0].destination + '/thumb/';
            }

            Companies.updateById(req.params._id, req.body, function (err, company) {
                if(err)
                    return res.status(400).json(err);

                res.status(200).json(company);
            });
        });
    },

//Delete an Company
    Delete: function (req, res) {
        Companies.count({_id: req.params._id}, function (err, count) {

            if(err)
                return res.status(400).json(err);
            if(count<1){
                return res.status(404).json({message: 'Company not found'});
            }
            Companies.get({_id: req.params._id}, function (err, company) {
                if(err)
                    return res.status(400).json(err);

                let logo_path = company.logo_path + company.logo;

                if(fs.existsSync(logo_path)){
                    Companies.deleteImage(logo_path, function (err) {
                        if(err)
                            return err;
                        console.log('Image deleted');
                    });
                }
                Companies.removeById({_id: req.params._id}, function(err, company) {
                    if (err)
                        return res.status(400).json(err);

                    res.status(200).json({message: 'Company deleted'});
                });
            });
        });
    }
};