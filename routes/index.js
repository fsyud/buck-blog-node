/*
*所有的路由接口
*/
const [
  user,
  timeLine,
  tag,
  article,
  comment,
  project
] = [
  require('./users'),
  require('./timeLine'),
  require('./tag'),
  require('./article'),
  require('./comment'),
  require('./project')
]

module.exports = app => {
  app.get('/currentUser', user.currentUser);
  app.post('/register', user.register);
  app.post('/login', user.login);
  app.post('/logout', user.logout);
  app.get('/queryUserList', user.queryUserList);
  app.post('/delUser', user.delUser);

  app.get('/queryTimeLine', timeLine.queryTimeLine);
  app.post('/addTimeLine', timeLine.addTimeLine);

  app.post('/addTag', tag.addTag);
  app.post('/delTag', tag.delTag);
  app.get('/queryTagList', tag.queryTagList);

  app.post('/addArticle', article.addArticle);
  app.post('/delArticle', article.delArticle);
  app.get('/queryArticleList', article.queryArticleList);
  app.post('/queryArticleDetail', article.queryArticleDetail);

  app.post('/addComment', comment.addComment)
  app.post('/addThirdComment', comment.addThirdComment)

  app.get('/queryProjectList', project.queryProjectList)
  app.post('/addProject', project.addProject)
  app.post('/updateProject', project.updateProject)
  app.get('/delProject', project.delProject)
  app.post('/getProjectDetail', project.getProjectDetail)
}