/**
 * User model module.
 * @file 权限和用户数据模型
 * @module model/users
 * @author singlebuck <https://github.com/singleBuck>
 */

const path = require('path');
const { argv } = require('yargs');

exports.MONGODB = {
  url: `mongodb://127.0.0.1:${argv.dbport || "27017"}/buckBlogAdmin`,
  username: argv.db_username || "DB_username",
  password: argv.db_password || "DB_password"
};
