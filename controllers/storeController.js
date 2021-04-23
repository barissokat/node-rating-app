const mongoose = require('mongoose');
const { syncIndexes } = require('../models/Store');
const Store = mongoose.model('Store');

exports.index = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.create = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.store = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/stores/${store.slug}`);
};

exports.edit = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id});
    res.render('editStore', { title: `Edit ${store.name}`, store });
}

exports.update = async (req, res) => {
    // Set the location data to be a point
    req.body.location.type = 'Point';
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, { 
        new: true, // return the new store instead of the old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}