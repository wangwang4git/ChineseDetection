// utils/util.js — 汉字认字量检测技能工具模块
// 包含：返回值工厂 / 层级配置 / 抽样计算 / 记录存储 / 鼓励语

// ========== 1. 返回值工厂 ==========
function errorResult(msg) {
  return { isError: true, content: [{ type: 'text', text: msg }] }
}

function successResult(msg, structuredContent) {
  const result = { isError: false, content: [{ type: 'text', text: msg }] }
  if (structuredContent !== undefined) result.structuredContent = structuredContent
  return result
}

// ========== 2. 层级配置 ==========
const LEVEL_CONFIGS = [
  { level: 1, name: 'L1', rankStart: 1, rankEnd: 50, sampleInterval: 1, testCount: 50, weight: 1, description: '绝对核心字' },
  { level: 2, name: 'L2', rankStart: 51, rankEnd: 200, sampleInterval: 3, testCount: 50, weight: 3, description: '高频基础字' },
  { level: 3, name: 'L3', rankStart: 201, rankEnd: 500, sampleInterval: 10, testCount: 30, weight: 10, description: '中频常用字' },
  { level: 4, name: 'L4', rankStart: 501, rankEnd: 1000, sampleInterval: 20, testCount: 25, weight: 20, description: '次常用字' },
  { level: 5, name: 'L5', rankStart: 1001, rankEnd: 1500, sampleInterval: 50, testCount: 10, weight: 50, description: '低频拓展字' },
  { level: 6, name: 'L6', rankStart: 1501, rankEnd: 2500, sampleInterval: 100, testCount: 10, weight: 100, description: '生僻/书面字' }
]

const FUSE_CONFIG = {
  consecutiveUnknownLimit: 5,
  errorRateLimit: 0.8,
  minTestCountForErrorRate: 5
}

const TOTAL_TEST_COUNT = LEVEL_CONFIGS.reduce((sum, c) => sum + c.testCount, 0)

// ========== 3. 字符数据加载 ==========
let _charactersCache = null
function loadCharacters() {
  if (_charactersCache) return _charactersCache
  _charactersCache = require('./charData.js')
  // 兼容两种数据格式：如果顶层是数组直接用；如果有 data 字段则取 data
  if (Array.isArray(_charactersCache)) {
    // 已经是数组格式
  } else if (_charactersCache && Array.isArray(_charactersCache.data)) {
    _charactersCache = _charactersCache.data
  }
  return _charactersCache
}

// ========== 4. 抽样与计算 ==========
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function randomSample(array, count) {
  if (count >= array.length) return shuffleArray(array)
  return shuffleArray(array).slice(0, count)
}

function generateTestSequence(allChars) {
  const levelTestData = []
  for (const config of LEVEL_CONFIGS) {
    const levelChars = allChars.filter(
      (char) => char.rank_id >= config.rankStart && char.rank_id <= config.rankEnd
    )
    let sampledChars
    if (config.level === 1) {
      sampledChars = shuffleArray(levelChars).map((char) => ({
        char: char.char,
        words: char.words || [],
        rank_id: char.rank_id,
        level: config.level
      }))
    } else {
      sampledChars = randomSample(levelChars, config.testCount).map((char) => ({
        char: char.char,
        words: char.words || [],
        rank_id: char.rank_id,
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

function calculateVocabulary(levelResults) {
  let total = 0
  for (const result of levelResults) {
    const config = LEVEL_CONFIGS.find((c) => c.level === result.level)
    if (config) {
      total += (result.knownCount || 0) * config.weight
    }
  }
  return total
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : r & 3 | 8
    return v.toString(16)
  })
}

function generateTestRecord(levelResults) {
  const unknownChars = []
  let totalTestedCount = 0
  const levelDetails = levelResults.map((result) => {
    const testedCount = (result.knownCount || 0) + (result.unknownCount || 0)
    totalTestedCount += testedCount
    if (result.unknownChars && result.unknownChars.length > 0) {
      unknownChars.push(...result.unknownChars)
    }
    return {
      level: result.level,
      testedCount: testedCount,
      knownCount: result.knownCount || 0,
      isFused: !!result.isFused
    }
  })
  const estimatedVocabulary = calculateVocabulary(levelResults)
  return {
    id: generateUUID(),
    testTime: new Date().toISOString(),
    totalTestedCount,
    estimatedVocabulary,
    levelDetails,
    unknownChars,
    isFused: false
  }
}

function getEncouragementMessage(vocabulary) {
  if (vocabulary >= 2000) return '🏆 哇！你简直是识字小达人！太厉害了！'
  else if (vocabulary >= 1500) return '🌟 非常棒！你认识很多汉字呢！'
  else if (vocabulary >= 1000) return '👏 很不错哦！继续加油！'
  else if (vocabulary >= 500) return '💪 有进步！多读多看，会越来越好！'
  else if (vocabulary >= 200) return '🌱 小小识字家，继续努力哦！'
  else return '🎈 每天认识几个字，积少成多！'
}

// ========== 5. 记录存储 ==========
const STORAGE_KEY = 'TEST_RECORDS'

function getRecords() {
  try {
    const records = wx.getStorageSync(STORAGE_KEY)
    return records ? JSON.parse(records) : []
  } catch (e) {
    console.error('[ai-mode] 获取检测记录失败:', e)
    return []
  }
}

function saveRecord(record) {
  try {
    const records = getRecords()
    records.unshift(record)
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(records))
    return true
  } catch (e) {
    console.error('[ai-mode] 保存检测记录失败:', e)
    return false
  }
}

function getRecordById(id) {
  try {
    const records = getRecords()
    return records.find((r) => r.id === id) || null
  } catch (e) {
    console.error('[ai-mode] 获取检测记录失败:', e)
    return null
  }
}

function getStatistics() {
  try {
    const records = getRecords()
    if (records.length === 0) return { testCount: 0, maxScore: 0, avgScore: 0 }
    const scores = records.map((r) => r.estimatedVocabulary).filter(s => typeof s === 'number')
    const testCount = records.length
    const maxScore = Math.max(...scores)
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / testCount)
    return { testCount, maxScore, avgScore }
  } catch (e) {
    console.error('[ai-mode] 获取统计数据失败:', e)
    return { testCount: 0, maxScore: 0, avgScore: 0 }
  }
}

module.exports = {
  errorResult,
  successResult,
  LEVEL_CONFIGS,
  FUSE_CONFIG,
  TOTAL_TEST_COUNT,
  loadCharacters,
  generateTestSequence,
  calculateVocabulary,
  generateTestRecord,
  getEncouragementMessage,
  shuffleArray,
  getRecords,
  saveRecord,
  getRecordById,
  getStatistics,
  generateUUID
}
