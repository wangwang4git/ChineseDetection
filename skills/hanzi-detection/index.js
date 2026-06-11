// skills/hanzi-detection/index.js
// 汉字认字量检测 — 原子接口注册入口

const { getTestCharacters } = require('./apis/getTestCharacters')
const { submitTestResult } = require('./apis/submitTestResult')
const { getRecordList } = require('./apis/getRecordList')
const { getRecordDetail } = require('./apis/getRecordDetail')
const { getStatistics } = require('./apis/getStatistics')

wx.modelContext.registerAPI('getTestCharacters', getTestCharacters)
wx.modelContext.registerAPI('submitTestResult', submitTestResult)
wx.modelContext.registerAPI('getRecordList', getRecordList)
wx.modelContext.registerAPI('getRecordDetail', getRecordDetail)
wx.modelContext.registerAPI('getStatistics', getStatistics)
