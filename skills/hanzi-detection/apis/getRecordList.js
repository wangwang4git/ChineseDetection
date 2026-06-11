// apis/getRecordList.js
// 获取历史检测记录列表
const { successResult, errorResult, getRecords } = require('../utils/util')

async function getRecordList(params = {}) {
  console.info('[ai-mode] getRecordList 入口, params=', JSON.stringify(params))
  try {
    const records = getRecords()

    // 返回摘要信息用于列表展示
    const list = records.map(r => ({
      id: r.id,
      testTime: r.testTime,
      estimatedVocabulary: r.estimatedVocabulary,
      totalTestedCount: r.totalTestedCount,
      unknownCharCount: (r.unknownChars && r.unknownChars.length) || 0,
      isFused: !!r.isFused
    }))

    const structuredContent = {
      records: list,
      totalCount: list.length
    }

    if (list.length === 0) {
      return successResult('暂无检测记录，快去测一测吧！', structuredContent)
    }

    return successResult(`共 ${list.length} 条检测记录`, structuredContent)
  } catch (err) {
    console.error('[ai-mode] getRecordList 出错:', err.message)
    return errorResult(`获取历史记录失败: ${err.message}`)
  }
}

module.exports = { getRecordList }
