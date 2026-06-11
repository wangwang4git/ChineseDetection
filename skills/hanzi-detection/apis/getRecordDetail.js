// apis/getRecordDetail.js
// 获取指定检测记录的详细信息
const { successResult, errorResult, getRecordById } = require('../utils/util')

async function getRecordDetail(params = {}) {
  console.info('[ai-mode] getRecordDetail 入口, params=', JSON.stringify(params))
  try {
    const { id } = params
    if (!id) {
      return errorResult('请提供记录ID')
    }

    const record = getRecordById(id)
    if (!record) {
      return errorResult('未找到该记录')
    }

    const structuredContent = {
      id: record.id,
      testTime: record.testTime,
      estimatedVocabulary: record.estimatedVocabulary,
      totalTestedCount: record.totalTestedCount,
      levelDetails: record.levelDetails || [],
      unknownChars: record.unknownChars || [],
      knownChars: record.knownChars || [],
      isFused: !!record.isFused
    }

    return successResult(
      `检测时间: ${record.testTime}，认字量: ${record.estimatedVocabulary}，测试${record.totalTestedCount}个字`,
      structuredContent
    )
  } catch (err) {
    console.error('[ai-mode] getRecordDetail 出错:', err.message)
    return errorResult(`获取记录详情失败: ${err.message}`)
  }
}

module.exports = { getRecordDetail }
