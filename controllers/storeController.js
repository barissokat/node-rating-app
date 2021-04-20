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