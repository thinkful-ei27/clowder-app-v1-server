'use strict';
const express = require('express');
const router = express.Router();
const { Event } = require('../events/models');


router.post('/', (req, res, next) => {

  const { eventName, date, time, location, viewingCode, description, eventId } = req.body;
  // TODO get from jwtDecode of bearer token
  const { userId } = req.user;
  const inviteName = eventName;

  const newEvent = { eventId, userId, inviteName, date, time, location, viewingCode, description }
  if (!newEvent.viewingCode) {
    delete newEvent.viewingCode;
  }

  Event.create(newEvent)
    .then(result => {
      //TODO check this just in case
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});



//unprotected get route to display public events

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Event.findOne({ _id: id })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next()
      }
    })
    .catch(err => {
      next(err);
    })
});

module.exports = { router };