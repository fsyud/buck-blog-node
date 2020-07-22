/*
*所有的路由接口
*/
const [
  user,
  timeLine,
  tag,
  article,
  comment,
  project,
  message,
] = [
  require('./users'),
  require('./timeLine'),
  require('./tag'),
  require('./article'),
  require('./comment'),
  require('./project'),
  require('./message')
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
  app.post('/updateTimeTimeline', timeLine.updateTimeTimeline);
  app.post('/delTimeline', timeLine.delTimeline);

  app.post('/addTag', tag.addTag);
  app.post('/delTag', tag.delTag);
  app.get('/queryTagList', tag.queryTagList);

  app.post('/addArticle', article.addArticle);
  app.post('/delArticle', article.delArticle);
  app.post('/updateArticle', article.updateArticle);
  app.post('/likeArticle', article.likeArticle);

  app.get('/queryArticleList', article.queryArticleList);
  app.post('/queryArticleDetail', article.queryArticleDetail);

  app.post('/addComment', comment.addComment)
  app.post('/addThirdComment', comment.addThirdComment)
  app.get('/queryCommentsList', comment.queryCommentsList)
  app.post('/changeStairComment', comment.changeStairComment)
  app.post('/changeThirdComment', comment.changeThirdComment)
  app.post('/delComment', comment.delComment)

  app.get('/queryProjectList', project.queryProjectList)
  app.post('/addProject', project.addProject)
  app.post('/updateProject', project.updateProject)
  app.post('/delProject', project.delProject)
  app.post('/getProjectDetail', project.getProjectDetail)

  app.post('/addMessage', message.addMessage)
  app.post('/addThirdMessage', message.addThirdMessage)
  app.get('/queryMessageList', message.queryMessageList)
  app.post('/delMessage', message.delMessage)
}