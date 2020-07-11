import { responseClient } from "../util/util";
import Comment from "../models/comment";
import User from "../models/users";
import Article from "../models/article";

// 获取全部评论
exports.queryCommentsList = (req, res) => {};

// 添加一级评论
exports.addComment = (req, res) => {
  let { article_id, user_id, content, hasUserInfo } = req.body;

  if (!hasUserInfo && !req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }

  if(!user_id) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
  }

  if(!article_id){
    responseClient(res, 200, 1, "文章id不能为空");
  }

  if(!content) {
    responseClient(res, 200, 1, "请输入留言内容！");
  }

  User.findById({
    _id: user_id
  }).then(result => {
    if (result) {
      let userInfo = {
        user_id: result._id,
        name: result.name,
        type: result.type,
        avatar: result.avatar
      };

      let comment = new Comment({
        article_id: article_id,
        content: content,
        user_id: user_id,
        user: userInfo
      });

      comment.save().then(commentResult => {
        Article.findOne({ _id: article_id }, (errors, data) => {
          if (errors) {
            console.error("Error:" + errors);
            // throw errors;
          } else {
            data.comments.push(commentResult._id);
            data.meta.comments = data.meta.comments + 1;
            Article.updateOne(
              { _id: article_id },
              {comments: data.comments, meta: data.meta, is_handle: 0}
            )
              .then(result => {
                responseClient(res, 200, 0, '感谢您的留言！', commentResult);
              })
              .catch(err => {
                console.error('err :', err);
                throw err;
              })
          }
        })
      })
      .catch(err2 => {
        console.error('err :', err2);
        throw err2;
      })
    } else {
      responseClient(res, 200, 1, '用户不存在');
    }
  })
  .catch(error => {
    console.error('error :', error);
    responseClient(res);
  });
};

// 添加第三者评论
exports.addThirdComment = (req, res) => { 
  let {
    article_id,
    comment_id,
    user_id,
    content,
    to_user,
    hasUserInfo
  } = req.body;

  if (!hasUserInfo && !req.session.userInfo || user_id.length === 0) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }

  Comment.findById({
    _id: comment_id,
  })
    .then(commentResult => {
      User.findById({
        _id: user_id
      })
        .then(userResult => {
          if (userResult) {
            let userInfo = {
              user_id: userResult._id,
              name: userResult.name,
              type: userResult.type,
              avatar: userResult.avatar,
            };

            console.log(to_user)
            let item = {
              user: userInfo,
              content: content,
              to_user: JSON.parse(to_user),
            }

            commentResult.other_comments.push(item)

            Comment.updateOne(
              { _id: comment_id },
              {
                other_comments: commentResult.other_comments,
                is_handle: 2,
              },
            )
              .then(result => {
                Article.findOne({ _id: article_id}, (erros, data) =>{
                  if(erros) {
                    console.error('Error:' + errors);
                  } else {
                    data.meta.comments = data.meta.comments + 1;
                    Article.updateOne({ _id: article_id }, { meta: data.meta })
                      .then(Articleresult => {
                        responseClient(
                          res,
                          200,
                          0,
                          "回复留言成功！",
                          data.meta.comments
                        );
                      })
                      .catch (articleUpdateError => {
                        throw articleUpdateError;
                      })
                  }
                })
              })
              .catch (CommentError => {
                console.error('CommentError:', CommentError);
                responseClient(res);
              })
          } else {
            responseClient(res, 200, 1, '用户不存在');
          }
        })
        .catch(usererror => {
          console.error('usererror :', usererror);
          responseClient(res);
        })
    })
    .catch(FirstCommentError => {
      console.error('FirstCommentError :', FirstCommentError);
      responseClient(res);
    })
}
