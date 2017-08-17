const Companies = require('../models/CompanyModel');

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

        req.body.logo = req.files.logo[0].path;
        req.body.avatar = req.files.avatar[0].path;
        var file = req.files;
        console.log(file);

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