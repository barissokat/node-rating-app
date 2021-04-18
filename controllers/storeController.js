const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.create = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.store = async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    res.redirect('/');
};