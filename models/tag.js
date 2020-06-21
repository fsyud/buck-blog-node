/**
 * User model module.
 * @file 博客时间轴
 * @module model/user
 * @author singlebuck <https://github.com/singleBuck>
 */


const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 标签 schema
const tagSchema = new mongoose.Schema({
    // 标签名称
    name: { type: String, required: true, validate: /\S+/ },
    
    // 标签描述
    desc: String,
    
    // 图标
    icon: String,
    
    // 发布日期
    create_time: { type: Date, default: Date.now },
    
    // 最后修改日期
	update_time: { type: Date, default: Date.now },
})

// 自增ID插件配置
tagSchema.plugin(autoIncrement.plugin, {
	model: 'Tag',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('Tag', tagSchema);