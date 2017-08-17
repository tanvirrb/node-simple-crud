const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/businesses');

// create a schema
var companySchema = new Schema({
    name: String,
    type: String,
    logo: String,
    avatar: String,
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
        var company = new this(data);
        company.save(callback);
    },

    updateById: function (id, updateData, callback) {
        this.update(id, {$set: updateData}, callback);
    },

    removeById: function (id, callback) {
        this.remove(id, callback);
    }
};

// the schema is useless so far
// we need to create a model using it
var Company = mongoose.model('companyCollection', companySchema);

// make this available to our users in our Node applications
module.exports = Company;