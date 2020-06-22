import { responseClient } from "../util/util";
import Tag from "../models/tag";

// 添加标签
exports.addTag = (req, res) => {
  let { name, desc } = req.body;

  Tag.findOne({
    name
  })
    .then(result => {
      if (!result) {
        let tag = new Tag({
          name,
          desc
        });

        tag
          .save()
          .then(data => {
            responseClient(res, 200, 0, "添加成功", data);
          })
          .catch(err => {
            throw err;
          });
      } else {
        responseClient(res, 200, 1, "该标签已存在");
      }
    })
    .catch(err => {
      responseClient(res);
    });
};

// 获取全部标签
exports.queryTagList = (req, res) => {
  let keyword = req.query.keyword || null;
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;

  let conditions = {};

  if (keyword) {
    const reg = new RegExp(keyword, 'i')

    conditions = {
      $or: [{ name: { $regex: reg } }, { desc: { $regex: reg }}]
    }
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;

  let responseData = {
    count: 0,
    list: [],
  };

  Tag.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error:' + err);
    } else {
      responseData.count = count;

      let fields = {
				_id: 1,
        name: 1,
        // desc: 1,
        // icon: 1,
        // create_time: 1,
        // update_time: 1,
      }; // 待返回的字段

      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
      };

      // 注：conditions 查询条件、fields 想要查询的字段、options 、callback 回调函数
      Tag.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error('Error:' + error);
          // throw error;
        } else {
          responseData.list = result;
          responseClient(res, 200, 0, 'success', responseData);
        }
      })
    }
  })
}

// 删除标签
exports.delTag = (req, res) => {
  let { id } = req.body;
  Tag.deleteMany({ _id: id })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, 0, '删除成功!');
      } else {
        responseClient(res, 200, 1, '标签不存在');
      }
    })
    .catch(err => {
      responseClient(res);
    });
};