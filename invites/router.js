'use strict';
const express = require('express');
const router = express.Router();
const { Event } = require('../events/models');

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