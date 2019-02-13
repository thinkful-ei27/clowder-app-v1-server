'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport')
const { Event } = require('./models');
const moment = require('moment');

router.use('/', passport.authenticate('jwt', { session: false }));

/* ========== POST ========== */
router.post('/', (req, res, next) => {

  const { eventName, dateAndTime, location, viewingCode, description } = req.body;
  // TODO get from jwtDecode of bearer token
  const { userId } = req.user;

  const newEvent = { userId, eventName, dateAndTime, location, viewingCode, description }
  if (newEvent.viewingCode === '') {
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

/* ========== GET ALL ========== */
//CONTROTLER
const getAllEventsController = (req, res, next) => {
  const { userId } = req.user
  const today = moment().format();
  const regex1 = RegExp('/upcoming*');
  const result = regex1.test(req.url);
  const query = result ? { $gte: today } : { $lt: today };

  Event.find({ dateAndTime: query, userId })
    .sort({ dateAndTime: 'desc' })
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next()
      }
    })
    .catch(err => {
      next(err);
    })
}
// GET all Upcoming Events
router.get('/upcoming/', getAllEventsController);
// GET all Past Events
router.get('/past/', getAllEventsController);

/* ========== GET ONE ========== */
//CONTROTLER
const getSingleEventController = (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user
  const today = moment().format();
  const regex1 = RegExp('/upcoming*');
  const result = regex1.test(req.url)
  const query = result ? { $gte: today } : { $lt: today }

  Event.findOne({ _id: id, dateAndTime: query, userId })
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
}
// GET SINGLE Upcoming Event by ID
router.get('/upcoming/:id', getSingleEventController);
// GET SINGLE Past Event by ID
router.get('/past/:id', getSingleEventController);

/* ========== DELETE ========== */
const DeleteController = (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  Event.findOneAndDelete({ _id: id, userId })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};
// Delete Single Upcoming Event
router.delete('/upcoming/:id', DeleteController);
// Delete Single Past Event
router.delete('/past/:id', DeleteController);

/* ========== PUT ========== */
//CONTROTLER
const editSingleEventController = (req, res, next, ) => {

  const { id } = req.params;
  const { userId } = req.user;
  const today = moment().format();
  const regex1 = RegExp('/upcoming*');
  const result = regex1.test(req.url);
  const query = result ? { $gte: today } : { $lt: today };

  const toUpdate = {};
  const updateableFields = ['eventName', 'dateAndTime', 'location', 'description', 'viewingCode'];
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

  Event.findOneAndUpdate({ _id: id, dateAndTime: query, userId }, toUpdate, { new: true })
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
}
//UPCOMING
router.put('/upcoming/:id', editSingleEventController);
//PAST
router.put('/past/:id', editSingleEventController);

module.exports = { router };

// eventName = eventName.trim();
// description = description.trim();
// location = location.trim();


 // const requiredFields = ['eventName', 'date', 'location', 'userId'];
  // const missingField = requiredFields.find(field => !(field in req.body));

  // if (missingField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: 'Missing Field',
  //     location: missingField
  //   });
  // }

  // const stringFields = ['eventName', 'location', 'description', 'viewingCode'];
  // const nonStringField = stringFields.find(
  //   field => field in req.body && typeof req.body[field] !== 'string'
  // );

  // if (nonStringField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: 'Incorrect field type: expected string',
  //     location: nonStringField
  //   });
  // }
  // const sizedFields = {
  //   eventName: {
  //     min: 1,
  //     max: 72
  //   },
  //   viewingCode: {
  //     min: 8,
  //     max: 72
  //   },
  //   description: {
  //     max: 500
  //   },
  //   location: {
  //     max: 500
  //   }
  // }

  // const tooSmallField = Object.keys(sizedFields).find(
  //   field =>
  //     'min' in sizedFields[field] &&
  //     req.body[field].trim().length < sizedFields[field].min
  // );
  // const tooLargeField = Object.keys(sizedFields).find(
  //   field =>
  //     'max' in sizedFields[field] &&
  //     req.body[field].trim().length > sizedFields[field].max
  // );

  // if (tooSmallField || tooLargeField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: tooSmallField
  //       ? `Must be at least ${sizedFields[tooSmallField]
  //         .min} characters long`
  //       : `Must be at most ${sizedFields[tooLargeField]
  //         .max} characters long`,
  //     location: tooSmallField || tooLargeField
  //   });
  // }