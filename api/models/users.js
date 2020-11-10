"use strict"

const uuid = require('node-uuid');
const randomstring = require("randomstring");
const _ = require('lodash');
const dbUtils = require('../neo4j/dbUtils');
const User = require('../models/neo4j/user');
const crypto = require('crypto');

const register = function (session, username, password) {
  return session.readTransaction(txc => txc.run('MATCH (user:User {username: $username}) RETURN user', {username: username}))
    .then(results => {
      if (!_.isEmpty(results.records)) {
        throw {username: 'username already in use', status: 400}
      }
      else {
        return session.writeTransaction(txc => txc.run('CREATE (user:User {id: $id, username: $username, password: $password, api_key: $api_key}) RETURN user',
          {
            id: uuid.v4(),
            username: username,
            password: hashPassword(username, password),
            api_key: randomstring.generate({
              length: 20,
              charset: 'hex'
            })
          }
        )).then(results => {
            return new User(results.records[0].get('user'));
          }
        )
      }
    });
};

const me = function (session, apiKey) {
  return session.readTransaction(txc => txc.run('MATCH (user:User {api_key: $api_key}) RETURN user', {api_key: apiKey}))
    .then(results => {
      if (_.isEmpty(results.records)) {
        throw {message: 'invalid authorization key', status: 401};
      }
      return new User(results.records[0].get('user'));
    });
};

const login = function (session, username, password) {
  return session.readTransaction(txc => txc.run('MATCH (user:User {username: $username}) RETURN user', {username: username}))
    .then(results => {
        if (_.isEmpty(results.records)) {
          throw {username: 'username does not exist', status: 400}
        }
        else {
          const dbUser = _.get(results.records[0].get('user'), 'properties');
          if (dbUser.password != hashPassword(username, password)) {
            throw {password: 'wrong password', status: 400}
          }
          return {token: _.get(dbUser, 'api_key')};
        }
      }
    );
};

function hashPassword(username, password) {
  const s = username + ':' + password;
  return crypto.createHash('sha256').update(s).digest('hex');
}

module.exports = {
  register: register,
  me: me,
  login: login
};
