/*
*所有的路由接口
*/
const user = require('./users');
const timeLine = require('./timeLine')

module.exports = app => {
  app.get('/currentUser', user.currentUser);
  app.post('/register', user.register);
  app.post('/login', user.login);
  app.post('/logout', user.logout);
  app.get('/queryUserList', user.queryUserList);

  app.get('/queryTimeLine', timeLine.queryTimeLine);
  app.post('/addTimeLine', timeLine.addTimeLine);
}