// apis/submitTestResult.js
// 提交检测答案，计算认字量并保存记录
const { successResult, errorResult, LEVEL_CONFIGS, calculateVocabulary, generateTestRecord, saveRecord, getEncouragementMessage, generateUUID } = require('../utils/util')

async function submitTestResult(params = {}) {
  console.info('[ai-mode] submitTestResult 入口, params=', JSON.stringify(params))
  try {
    const { knownChars = [], unknownChars = [] } = params

    if (!Array.isArray(knownChars) && !Array.isArray(unknownChars)) {
      return errorResult('请提供已知汉字列表(knownChars)和未知汉字列表(unknownChars)')
    }

    const knownSet = new Set(knownChars)
    const unknownSet = new Set(unknownChars)
    const allTestedChars = new Set([...knownSet, ...unknownSet])

    // 按层级汇总结果
    const levelResults = []
    for (const config of LEVEL_CONFIGS) {
      const levelKnown = []
      const levelUnknown = []
      let knownCount = 0
      let unknownCount = 0

      // 遍历该层级的所有可能字符范围，统计已知/未知
      for (const ch of knownSet) {
        // 无法从 char 反推 rank_id，所以按全部统计
        knownCount++
      }
      for (const ch of unknownSet) {
        unknownCount++
      }

      levelResults.push({
        level: config.level,
        name: config.name,
        knownCount: 0, // 需要详细数据才能按level分
        unknownCount: 0,
        unknownChars: [],
        isFused: false
      })
    }

    // 简化统计：基于总已知/未知数按比例分配
    const totalKnown = knownSet.size
    const totalUnknown = unknownSet.size
    const totalTested = totalKnown + totalUnknown

    if (totalTested === 0) {
      return errorResult('请至少提供一些检测结果')
    }

    // 按层级分布估算（基于层级权重反推）
    const weightSum = LEVEL_CONFIGS.reduce((s, c) => s + c.weight, 0)
    const estimatedVocabulary = Math.round(totalKnown * weightSum / LEVEL_CONFIGS.length)

    // 构建详细层级结果（简化版：将已知按层级均匀分布估算）
    const levelDetails = LEVEL_CONFIGS.map(config => ({
      level: config.level,
      name: config.name,
      description: config.description,
      testedCount: config.testCount,
      knownCount: Math.round(config.testCount * totalKnown / totalTested)
    }))

    // 更精确的认字量计算
    let preciseVocabulary = 0
    levelDetails.forEach((ld, idx) => {
      preciseVocabulary += ld.knownCount * LEVEL_CONFIGS[idx].weight
    })

    const encouragementMessage = getEncouragementMessage(preciseVocabulary)

    // 生成并保存记录
    const record = {
      id: generateUUID(),
      testTime: new Date().toISOString(),
      totalTestedCount: totalTested,
      estimatedVocabulary: preciseVocabulary,
      levelDetails: levelDetails,
      unknownChars: [...unknownSet],
      knownChars: [...knownSet],
      isFused: false
    }
    saveRecord(record)

    const structuredContent = {
      estimatedVocabulary: preciseVocabulary,
      totalTestedCount: totalTested,
      knownCount: totalKnown,
      unknownCount: totalUnknown,
      encouragementMessage,
      levelDetails,
      unknownChars: [...unknownSet].slice(0, 20), // 最多展示20个不认识的
      recordId: record.id
    }

    return successResult(
      `检测完成！你大约认识 ${preciseVocabulary} 个汉字，${encouragementMessage}`,
      structuredContent
    )
  } catch (err) {
    console.error('[ai-mode] submitTestResult 出错:', err.message)
    return errorResult(`提交检测结果失败: ${err.message}`)
  }
}

module.exports = { submitTestResult }
