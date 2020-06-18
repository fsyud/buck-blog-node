import { responseClient } from "../util/util";
import TimeLine from "../models/timeLine";

// 时间轴列表
exports.queryTimeLine = (req, res) => {
  let keyword = req.query.keyword || null;
  let state = req.query.state || '';
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {};
  if (!state) {
    if (keyword) {
      // 后台搜索功能 匹配关键字
      const reg = new RegExp(keyword, 'i'); //不区分大小写
      conditions = {
        $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }]
      };
    }
  } else if (state) {
    //   后台状态搜索功能
    state = parseInt(state);

    if (keyword) {
      const reg = new RegExp(keyword, 'i');

      conditions = {
        $and: [
          { $or: [{ state: state }] },
          { $or: [{ title: { $regex: reg } }, { content: { $regex: reg } }] }
        ]
      };
    } else {
      conditions = { state };
    }
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;

  let responesData = {
    count: 0,
    list: []
  };

  TimeLine.countDocuments({}, (err, count) => {
    if (err) {
      console.error("Error:" + err);
    } else {
      responesData.count = count;
      let fields = {
        title: 1,
        content: 1,
        state: 1,
        start_time: 1,
        end_time: 1
      }; // 待返回的字段

      let options = {
        skip,
        limit: pageSize,
        sort: { end_time: -1 }
      };

      TimeLine.find(conditions, fields, options, (error, result) => {
        if (error) {
          console.error("Error:" + error);
        } else {
          responesData.list = result;
          responseClient(res, 200, 0, "操作成功！", responesData);
        }
      });
    }
  });
};

// 添加时间轴内容
exports.addTimeLine = (req, res) => {
  let { title, state, content, start_time, end_time } = req.body;

  if (!title) {
    responseClient(res, 200, 2, "时间轴标题不能为空");
    return;
  }
  TimeLine.findOne({ title })
    .then(result => {
      if (!result) {
        let timeLine = new TimeLine({
          title,
          state,
          content,
          start_time,
          end_time
        });

        console.log("save time line");

        timeLine
          .save()
          .then(data => {
            responseClient(res, 200, 0, "操作成功！", data);
          })
          .catch(err => {
            console.error("err :", err);
            // throw err;
          });
      }
    })
    .catch(error => {
      console.error("errro :", errro);
      responseClient(res);
    });
};
