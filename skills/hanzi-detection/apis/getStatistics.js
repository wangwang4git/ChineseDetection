// apis/getStatistics.js
// 获取检测统计数据概览
const { successResult, errorResult, getStatistics: getStatsFromStorage } = require('../utils/util')

async function getStatistics(params = {}) {
  console.info('[ai-mode] getStatistics 入口, params=', JSON.stringify(params))
  try {
    const stats = getStatsFromStorage()

    const structuredContent = {
      testCount: stats.testCount,
      maxScore: stats.maxScore,
      avgScore: stats.avgScore
    }

    if (stats.testCount === 0) {
      return successResult('还没有检测记录，快去测一测吧！', structuredContent)
    }

    return successResult(
      `共检测${stats.testCount}次，最高认字量${stats.maxScore}字，平均${stats.avgScore}字`,
      structuredContent
    )
  } catch (err) {
    console.error('[ai-mode] getStatistics 出错:', err.message)
    return errorResult(`获取统计数据失败: ${err.message}`)
  }
}

module.exports = { getStatistics }
