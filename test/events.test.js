'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const sinon = require('sinon');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/models');
const { Event } = require('../events/models');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { events, users } = require('../testData/data');

const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();


describe('/api/events', function () {
  const eventName = "testEventName";
  const date = "2019-12-21";
  const time = "7:21";
  const location = "Salem, OR";

  const eventName2 = "testEventName2";
  const date2 = "1989-02-03";
  const time2 = "19:01";
  const location2 = "Eugene, OR";

  let token, user;

  before(function () {
    // return runServer(TEST_DATABASE_URL);
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true })
      .then(() => Promise.all([
        User.deleteMany(),
        Event.deleteMany(),
        mongoose.connection.db.dropDatabase()
      ]));
  });

  after(function () {
    // return closeServer();
    return mongoose.disconnect();
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Event.insertMany(events),
      console.log(user)
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
        console.log(user, token)
      });
  });

  afterEach(function () {
    // return User.remove({});
    sandbox.restore();
    return Promise.all([
      Event.deleteMany(),
      User.deleteMany()
    ]);
  });

  describe('GET /api/events/upcoming', function () {
    const today = new Date();
   
    it.only('should return the correct number of Events in the future', function () {
      return Promise.all([
        Event.find({ dateAndTime: { $gte: today }, userId: user._id }),
        chai.request(app).get('/api/events/upcoming').set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(data.length);
        });
    });

  })

  describe('GET /api/events/past', function () {
    const today = new Date();
   
    it.only('should return the correct number of Events in the past', function () {
      return Promise.all([
        Event.find({ dateAndTime: { $lt: today }, userId: user.id }),
        chai.request(app).get('/api/events/past').set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          console.log('data:', data, 'res:', res.body)
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(data.length);
        });
    });

  })

  // describe('/api/events', function () {
  //   desribe('POST', function () {

  //   }
  //   )
  // })

}); //THIS IS THE END OF THE TEST