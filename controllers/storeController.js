const mongoose = require('mongoose');
const { syncIndexes } = require('../models/Store');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter (req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: "That filetype isn't allowed!" }, false);
        }
    }
}

exports.index = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.create = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

// Reads it into memory. Create temporary clone.
exports.upload = multer(multerOptions).single('photo');

// Resize the uploaded image
exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file) {
      next(); // skip to the next middleware
      return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once we have written the photo to our filesystem, keep going!
    next();
};

exports.store = async (req, res) => {
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/stores/${store.slug}`);
};

exports.show = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug }).populate('author');
    if (!store) return next();
    res.render('store', { store, title: store.name });
};

const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
        throw Error('You must own a store in order to edit it!');
    }
}

exports.edit = async (req, res) => {
    // Find the store given the ID
    const store = await Store.findOne({ _id: req.params.id });
    // Confirm they are the owner of the store
    confirmOwner(store, req.user);
    // Render out the edit form so the user can update their store
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
};

exports.getStoresByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    res.render('tag', { tags, title: 'Tags', tag, stores });
};

exports.search = async (req, res) => {
    const stores = await Store
    // First find stores that match
    .find({ 
            $text: {
                $search: req.query.q
            }
        }, {
            score: { 
                $meta: 'textScore' 
            }
    })
    // Then sort them 
    .sort({
        score: { 
            $meta: 'textScore' 
        }
    })
    // Limit to only 5 results 
    .limit(5);
    res.json(stores);
}

exports.mapStores = async (req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 // 10km
            }
        }
    };

    const stores = await Store.find(q).select('slug name description location photo');
    res.json(stores);
};

exports.mapPage = (req, res) => {
    res.render('map', { title: 'Map' });
}