'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,

  },
  viewingCode: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

EventSchema.set('timestamps', true);

EventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
  }
});

const Event = mongoose.model('Event', EventSchema);

module.exports = { Event };

