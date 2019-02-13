'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const InviteSchema = mongoose.Schema({
  inviteName: {
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
  },
  rsvps: {
    type: Array,
    required
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
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
    delete result._id;
    delete result.viewingCode
  }
});

const Event = mongoose.model('Invite', InviteSchema);

module.exports = { Invite };

