// apis/getTestCharacters.js
// 获取分层抽样的检测汉字列表
const { successResult, errorResult, loadCharacters, generateTestSequence, LEVEL_CONFIGS, TOTAL_TEST_COUNT } = require('../utils/util')

async function getTestCharacters(params = {}) {
  console.info('[ai-mode] getTestCharacters 入口, params=', JSON.stringify(params))
  try {
    const allChars = loadCharacters()
    if (!allChars || allChars.length === 0) {
      return errorResult('汉字数据加载失败')
    }
    const levels = generateTestSequence(allChars)

    // 构建层级概览
    const levelOverviews = levels.map(lv => ({
      level: lv.level,
      name: lv.name,
      description: lv.description,
      testCount: lv.testCount,
      weight: lv.weight
    }))

    // 扁平化所有待测汉字
    const allTestChars = []
    levels.forEach(lv => {
      lv.chars.forEach(ch => allTestChars.push(ch))
    })

    const structuredContent = {
      totalChars: TOTAL_TEST_COUNT,
      levelCount: LEVEL_CONFIGS.length,
      levelOverviews: levelOverviews,
      testChars: allTestChars,
      levels: levels
    }

    return successResult(`已生成${TOTAL_TEST_COUNT}个分层检测汉字，覆盖${LEVEL_CONFIGS.length}个层级`, structuredContent)
  } catch (err) {
    console.error('[ai-mode] getTestCharacters 出错:', err.message)
    return errorResult(`获取检测汉字失败: ${err.message}`)
  }
}

module.exports = { getTestCharacters }
