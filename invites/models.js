'use strict';
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
  }
});

EventSchema.set('timestamps', true);

EventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

const Invite = mongoose.model('Invite', InviteSchema);

module.exports = { Invite };
