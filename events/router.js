'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Event } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();



// Create a New Event
router.post('/', jsonParser, (req, res) => {

  const { eventName, date, location, viewingCode, description } = req.body;
  // TODO get from jwtDecode of bearer token
  const userId = req.headers.authorization;

  const newEvent = { eventName, date, location, viewingCode, description }
  if (newEvent.viewingCode === null) {
    delete newEvent.viewingCode;
  }

  Event.create(newEvent)
    .then(result => {
      //TODO check this just in case
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
      console.log(err);
    });

});

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