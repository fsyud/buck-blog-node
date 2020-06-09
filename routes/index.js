/*
*所有的路由接口
*/
const user = require('./users');

module.exports = app => {
  app.get('/currentUser', user.currentUser);
  app.post('/register', user.register);
  app.post('/login', user.login);
  app.post('/logout', user.logout);
}