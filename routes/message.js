import { responseClient } from "../util/util";
import Message from "../models/message";
import User from "../models/users";

// 获取所有留言列表
exports.queryMessageList = (req, res) => {
  let keyword = req.query.keyword || null;
  let state = req.query.state || "";
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {};

  if (state === "") {
    if (keyword) {
      const reg = new RegExp(keyword, "i"); //不区分大小写
      conditions = {
        content: { $regex: reg }
      };
    }
  } else if (state) {
    state = parseInt(state);
    if (keyword) {
      const reg = new RegExp(keyword, "i");
      conditions = {
        $and: [
          { $or: [{ state: state }] },
          { $or: [{ content: { $regex: reg } }] }
        ]
      };
    } else {
      conditions = { state };
    }
  } else {
    state = 0;
    if (keyword) {
      const reg = new RegExp(keyword, "i");
      conditions = {
        $and: [
          { $or: [{ state: state }] },
          { $or: [{ content: { $regex: reg } }] }
        ]
      };
    } else {
      conditions = { state };
    }
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: []
  };

  Message.countDocuments({}, (err, count) => {
    if (err) {
      console.error("Error:" + err);
    } else {
      responseData.count = count;
      // 待返回的字段
      let fields = {
        user_id: 1,
        name: 1,
        avatar: 1,
        phone: 1,
        introduce: 1,
        content: 1,
        email: 1,
        state: 1,
        other_comments: 1,
        create_time: 1
        // update_time: 1,
      };
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 }
      };
      Message.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error("Error:" + error);
          // throw error;
        } else {
          responseData.list = result;
          responseClient(res, 200, 0, "success", responseData);
        }
      });
    }
  });
};

// 添加1级留言
exports.addMessage = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }

  let { user_id, content, email, phone, name } = req.body;

  if (user_id) {
    User.findById({
      _id: user_id
    })
      .then(result => {
        if (result) {
          let message = new Message({
            user_id: result._id,
            name: name ? name : result.name,
            avatar: result.avatar,
            phone: result.phone,
            introduce: result.introduce,
            content: content,
            email: email ? email : result.email,
            state: 0
          });

          message
            .save()
            .then(data => {
              responseClient(res, 200, 0, "添加成功，等待管理员审核！", data);
            })
            .catch(err => {
              console.error("err :", err);
              throw err;
            });
        }
      })
      .catch(error => {
        console.error("error :", error);
        responseClient(res);
      });
  } else {
    // 直接保存留言内容
    let message = new Message({
      name: name,
      phone: phone,
      content: content,
      email: email,
      state: 0
    });
    message
      .save()
      .then(data => {
        responseClient(res, 200, 0, "添加成功，等待管理员审核！", data);
      })
      .catch(err2 => {
        console.error("err 2:", err2);
        throw err;
      });
  }
};

// 添加三级留言
exports.addThirdMessage = (req, res) => {
  const {
    comment_id,
    user_id,
    content,
    to_user
  } = req.body;

  Message.findById({_id: comment_id})
    .then(commentResult => {
      User.findById({
        _id: user_id
      })
        .then(userResult => {
          let userInfo = {
            user_id: userResult._id,
            name: userResult.name,
            type: userResult.type,
            avatar: userResult.avatar,
          };

          let item = {
            user: userInfo,
            content: content,
            to_user: JSON.parse(to_user),
          }
          
          commentResult.other_comments.push(item)

          console.log(commentResult)

          Message.updateOne(
            { _id: comment_id },
            {
              other_comments: commentResult.other_comments,
              state: 0,
            },
          ).then(result => {
            console.log(result)
            responseClient(
              res,
              200,
              0,
              "回复留言成功！",
              result
            );
          })
          .catch (err => {
            throw err;
          })
        })
        .catch(usererror => {
          console.error('usererror :', usererror);
          responseClient(res);
        })
    })
    .catch(CommentError => {
      console.error('CommentError :', CommentError);
      responseClient(res);
    })
}

// 删除
exports.delMessage = (req, res) => {
  let { id } = req.body;
  Message.deleteMany({ _id: id })
    .then(result => {
      // console.log('result :', result)
      if (result.n === 1) {
        responseClient(res, 200, 0, "删除成功!");
      } else {
        responseClient(res, 200, 1, "留言不存在或者已经删除！");
      }
    })
    .catch(err => {
      console.error("err :", err);
      responseClient(res);
    });
};
