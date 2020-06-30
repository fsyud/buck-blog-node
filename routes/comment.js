import { responseClient } from "../util/util";
import Comment from "../models/comment";
import User from "../models/users";
import Article from "../models/article";

// 获取全部评论
exports.queryCommentsList = (req, res) => {};

// 添加一级评论
exports.addComment = (req, res) => {
  let { article_id, user_id, content, hasUserInfo } = req.body;

  console.log(req.session.userInfo)

  if (!hasUserInfo && !req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }

  if(!user_id) responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");

  if(!article_id) responseClient(res, 200, 1, "文章id不能为空");

  if(!content) responseClient(res, 200, 1, "请输入留言内容！");

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
                responseClient(res, 200, 0, '留言成功 ！', commentResult);
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
