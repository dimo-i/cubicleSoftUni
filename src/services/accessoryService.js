const Accessory = require('../models/Accessory');

exports.getAll = () => Accessory.find()

exports.getAllWithout = (ids) => Accessory.find({_id: {$nin: ids}});

exports.create = (accessoryData) => Accessory.create(accessoryData);