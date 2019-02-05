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
    type: Date,
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

EventSchema.methods.serialize = function () {
  return {
    eventName: this.eventName || '',
    date: this.date || '',
    location: this.location || '',
    description: this.description || '',
    viewingCode: this.viewingCode || null
  };
};

module.exports = mongoose.model('Event', schema);

