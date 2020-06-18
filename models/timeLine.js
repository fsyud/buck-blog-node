/**
 * User model module.
 * @file 博客时间轴
 * @module model/user
 * @author singlebuck <https://github.com/singleBuck>
 */


const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

const timeLineSchema = new mongoose.Schema({
    // 标题
    title: { type: String, required: true },
    // 时间轴内容
    content: { type: String, required: true },
    // 状态 1 完成 2 进行 3 没完成
    state: { type: Number, default: 1 },
    // 开始日期
    start_time: { type: Date, default: Date.now },
    // 结束日期
    end_time: { type: Date, default: Date.now },
    // 最后修改日期
    update_time: { type: Date, default: Date.now },
})

// 自增ID插件配置
timeLineSchema.plugin(autoIncrement.plugin, {
	model: 'TimeLine',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});


module.exports = mongoose.model('TimeLine', timeLineSchema);