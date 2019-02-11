'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport')
const { Invite } = require('./models');

//unprotected get route to display public events

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Invite.findOne({ _id: id })
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

//Protect endpoints that create and edit public events
router.use('/', passport.authenticate('jwt', { session: false }));

//POST
router.post('/', (req, res, next) => {
  console.log('hello')
  const { inviteName, date, time, location, viewingCode, description } = req.body;
  const newinvite = { inviteName, date, time, location, viewingCode, description }
  if (newinvite.viewingCode === '' || null || undefined) {
    delete newinvite.viewingCode;
  }

  Invite.create(newinvite)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });

});

//PUT
router.put('/:id', (req, res, next, ) => {
  console.log('edit controller ran', req.body)
  const { id } = req.params;

  const toUpdate = {};
  const updateableFields = ['inviteName', 'date', 'time', 'location', 'description', 'viewingCode'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  if (toUpdate.description === '') {
    delete toUpdate.description;
    toUpdate.$unset = { description: 1 };
  }
  if (toUpdate.viewingCode === '') {
    delete toUpdate.viewingCode;
    toUpdate.$unset = { viewingCode: 1 };
  }

  Invite.findOneAndUpdate({ _id: id }, toUpdate, { new: true })
  .then(result => {
    if (result) {
      res.json(result);
    } else {
      next();
    }
  })
  .catch(err => {
    next(err);
  });
});

  module.exports = { router };