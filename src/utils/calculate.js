/**
 * 认字量计算工具
 * 汉字认字量检测小程序
 */

import { LEVEL_CONFIGS, FUSE_CONFIG } from './levelConfig.js'

/**
 * Fisher-Yates 洗牌算法
 * 将数组随机打乱顺序
 * @param {Array} array - 原数组
 * @returns {Array} 打乱后的新数组
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 随机抽样
 * 从数组中随机抽取指定数量的元素
 * @param {Array} array - 原数组
 * @param {number} count - 抽取数量
 * @returns {Array} 抽样后的数组
 */
function randomSample(array, count) {
  // 如果需要的数量大于等于数组长度，返回打乱后的全部
  if (count >= array.length) {
    return shuffleArray(array)
  }
  
  // 先打乱再截取，保证随机性
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

/**
 * 生成测试序列
 * 基于分层频率抽样策略，从汉字数据中生成测试序列
 * - L1层：全部汉字随机打乱顺序
 * - L2-L6层：按抽样比例随机抽取汉字
 * @param {Array<{rank_id: number, char: string, frequency: number, frequency_cumulative: number}>} allChars - 所有汉字数据
 * @returns {Array<{level: number, name: string, description: string, weight: number, chars: Array}>} 分层测试数据
 */
export function generateTestSequence(allChars) {
  const levelTestData = []

  for (const config of LEVEL_CONFIGS) {
    // 筛选该层级范围内的汉字
    const levelChars = allChars.filter(
      char => char.rank_id >= config.rankStart && char.rank_id <= config.rankEnd
    )

    let sampledChars
    
    if (config.level === 1) {
      // L1层：全部汉字随机打乱顺序
      sampledChars = shuffleArray(levelChars).map(char => ({
        ...char,
        level: config.level
      }))
    } else {
      // L2-L6层：随机抽取 testCount 个汉字
      sampledChars = randomSample(levelChars, config.testCount).map(char => ({
        ...char,
        level: config.level
      }))
    }

    levelTestData.push({
      level: config.level,
      name: config.name,
      description: config.description,
      weight: config.weight,
      testCount: config.testCount,
      chars: sampledChars
    })
  }

  return levelTestData
}

/**
 * 计算预估认字量
 * 公式: W = N_L1 + (N_L2 × 3) + (N_L3 × 10) + (N_L4 × 20) + (N_L5 × 50) + (N_L6 × 100)
 * @param {Array<{level: number, knownCount: number}>} levelResults - 各层级测试结果
 * @returns {number} 预估认字量
 */
export function calculateVocabulary(levelResults) {
  let total = 0

  for (const result of levelResults) {
    const config = LEVEL_CONFIGS.find(c => c.level === result.level)
    if (config) {
      total += result.knownCount * config.weight
    }
  }

  return total
}

/**
 * 检查是否触发熔断
 * @param {Object} levelResult - 当前层级结果
 * @param {number} levelResult.knownCount - 认识的字数
 * @param {number} levelResult.unknownCount - 不认识的字数
 * @param {number} levelResult.consecutiveUnknown - 连续不认识计数
 * @returns {{isFused: boolean, reason: string}} 熔断状态和原因
 */
export function checkFuse(levelResult) {
  // 条件1: 连续5个不认识
  if (levelResult.consecutiveUnknown >= FUSE_CONFIG.consecutiveUnknownLimit) {
    return {
      isFused: true,
      reason: `连续${FUSE_CONFIG.consecutiveUnknownLimit}个不认识`
    }
  }

  // 条件2: 错误率超过80%
  const totalTested = levelResult.knownCount + levelResult.unknownCount
  if (totalTested >= FUSE_CONFIG.minTestCountForErrorRate) {
    const errorRate = levelResult.unknownCount / totalTested
    if (errorRate > FUSE_CONFIG.errorRateLimit) {
      return {
        isFused: true,
        reason: `错误率超过${FUSE_CONFIG.errorRateLimit * 100}%`
      }
    }
  }

  return {
    isFused: false,
    reason: ''
  }
}

/**
 * 初始化层级结果
 * @param {number} level - 层级
 * @returns {Object} 初始化的层级结果对象
 */
export function initLevelResult(level) {
  return {
    level,
    testedChars: [],
    knownCount: 0,
    unknownCount: 0,
    consecutiveUnknown: 0,
    isCompleted: false,
    isFused: false
  }
}

/**
 * 生成检测记录
 * @param {Array} levelResults - 各层级测试结果
 * @param {boolean} isFused - 是否触发熔断
 * @param {number|null} fusedAtLevel - 熔断发生的层级
 * @returns {Object} 检测记录对象
 */
export function generateTestRecord(levelResults, isFused, fusedAtLevel) {
  // 收集所有不认识的汉字
  const unknownChars = []
  let totalTestedCount = 0

  const levelDetails = levelResults.map(result => {
    const testedCount = result.knownCount + result.unknownCount
    totalTestedCount += testedCount

    // 收集不认识的汉字
    result.testedChars
      .filter(char => !char.isKnown)
      .forEach(char => unknownChars.push(char.char))

    return {
      level: result.level,
      testedCount,
      knownCount: result.knownCount,
      isFused: result.isFused
    }
  })

  // 计算预估认字量
  const estimatedVocabulary = calculateVocabulary(levelResults)

  return {
    id: generateUUID(),
    testTime: new Date().toISOString(),
    totalTestedCount,
    estimatedVocabulary,
    levelDetails,
    unknownChars,
    isFused,
    fusedAtLevel
  }
}

/**
 * 生成 UUID
 * @returns {string} UUID 字符串
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 根据认字量获取鼓励语
 * @param {number} vocabulary - 认字量
 * @returns {string} 鼓励语
 */
export function getEncouragementMessage(vocabulary) {
  if (vocabulary >= 2000) {
    return '🏆 哇！你简直是识字小达人！太厉害了！'
  } else if (vocabulary >= 1500) {
    return '🌟 非常棒！你认识很多汉字呢！'
  } else if (vocabulary >= 1000) {
    return '👏 很不错哦！继续加油！'
  } else if (vocabulary >= 500) {
    return '💪 有进步！多读多看，会越来越好！'
  } else if (vocabulary >= 200) {
    return '🌱 小小识字家，继续努力哦！'
  } else {
    return '🎈 每天认识几个字，积少成多！'
  }
}
