const mongoose = require('mongoose');
const gm = require('gm');
const fs = require('fs');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/businesses');

// create a schema
let companySchema = new Schema({
    name: String,
    type: String,
    logo: String,
    logo_path: String,
    created_at: String

});

companySchema.statics = {
    getAll: function (query, callback) {
        this.find(query, callback);
    },

    get: function (query, callback) {
        this.findOne(query, callback);
    },

    create: function (data, callback) {
        let company = new this(data);
        company.save(callback);
    },

    updateById: function (id, updateData, callback) {
        this.update(id, {$set: updateData}, callback);
    },

    removeById: function (id, callback) {
        this.remove(id, callback);
    },

    resizeImage: function (original_image_path, logo_path, callback) {
        let height = 250;
        let width = 250;

        gm(original_image_path)
            .resize(width, height, '!')
            .noProfile()
            .write(logo_path, function (err) {
                if(err)
                    return res.status(400).json(err);

                fs.unlink(original_image_path, function () {
                    if(err)
                        return res.status(400).json(err);

                    console.log('Original image deleted after resize');
                });
            });
        callback();
    }
};

// the schema is useless so far
// we need to create a model using it
let Company = mongoose.model('companyCollection', companySchema);

// make this available to our users in our Node applications
module.exports = Company;