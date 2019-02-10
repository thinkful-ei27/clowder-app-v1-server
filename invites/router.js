'use strict';
const express = require('express');
const router = express.Router();
const { Invite } = require('./models');

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