/*
*所有的路由接口
*/
const [
  user, timeLine, tag, article
] = [
  require('./users'),
  require('./timeLine'),
  require('./tag'),
  require('./article')
]

module.exports = app => {
  app.get('/currentUser', user.currentUser);
  app.post('/register', user.register);
  app.post('/login', user.login);
  app.post('/logout', user.logout);
  app.get('/queryUserList', user.queryUserList);

  app.get('/queryTimeLine', timeLine.queryTimeLine);
  app.post('/addTimeLine', timeLine.addTimeLine);

  app.post('/addTag', tag.addTag);
  app.post('/delTag', tag.delTag);
  app.get('/queryTagList', tag.queryTagList);

  app.post('/addArticle', article.addArticle);
  app.post('/delArticle', article.delArticle);
  app.get('/queryArticleList', article.queryArticleList);
  app.post('/queryArticleDetail', article.queryArticleDetail);

}