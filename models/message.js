/**
 * User model module.
 * @file 博客文章
 * @module model/user
 * @author singlebuck <https://github.com/singleBuck>
 */
const { mongoose } = require("../core/mongodb.js");
const autoIncrement = require("mongoose-auto-increment");

// 留言模型
const messageSchema = new mongoose.Schema({
  // 用户 id
  user_id: { type: String, default: "" },

  // 姓名
  name: { type: String, default: "" },

  // 头像
  avatar: { type: String, default: "user" },

  // 电话
  phone: { type: String, default: "" },

  // 介绍
  introduce: { type: String, default: "" },

  // 留言内容
  content: { type: String, required: true },

  // 邮箱
  email: { type: String, default: "" },

  // 状态 0 是未处理，1 是已处理
  state: { type: Number, default: 0 },

  // 创建日期
  create_time: { type: Date, default: Date.now },

  // 最后修改日期
  update_time: { type: Date, default: Date.now },

  // 第三者评论
  other_comments: [
    {
      // 谁在评论
      user: {
        user_id: { type: mongoose.Schema.Types.ObjectId },

        // 名字
        name: { type: String, required: true, default: "" },

        // 用户类型 0：博主 1：其他用户
        type: { type: Number, default: 1 },

        // 头像
        avatar: { type: String, default: "user" }
      },
      // 对谁评论
      to_user: {
        user_id: { type: mongoose.Schema.Types.ObjectId },

        // 名字
        name: { type: String, required: true, default: "" },

        // 用户类型 0：博主 1：其他用户
        type: { type: Number, default: 1 },

        // 头像
        avatar: { type: String, default: "user" }
      },

      // content
      content: { type: String, required: true, validate: /\S+/ },

      // 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
      state: { type: Number, default: 1 },

      // 创建日期
      create_time: { type: Date, default: Date.now }
    }
  ]
});

// 自增ID插件配置
messageSchema.plugin(autoIncrement.plugin, {
  model: "Message",
  field: "id",
  startAt: 1,
  incrementBy: 1
});

// 留言模型
module.exports = mongoose.model("Message", messageSchema);
