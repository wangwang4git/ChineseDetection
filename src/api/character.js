/**
 * 汉字相关接口
 * 汉字认字量检测小程序
 */

import { successResponse, errorResponse } from './index.js'
import { LEVEL_CONFIGS } from '../utils/levelConfig.js'
import { generateTestSequence } from '../utils/calculate.js'
// 静态导入 JSON 数据
import charactersData from '../static/top_2500_chars_with_literacy.json'

// 汉字数据缓存
let charactersCache = null

/**
 * 加载汉字数据
 * @returns {Promise<Array>} 汉字数据数组
 */
async function loadCharacters() {
  if (charactersCache) {
    return charactersCache
  }

  try {
    // 直接使用静态导入的数据
    charactersCache = charactersData
    return charactersCache
  } catch (e) {
    console.error('加载汉字数据失败:', e)
    return []
  }
}

/**
 * 获取分层测试汉字列表
 * 基于分层频率抽样策略生成测试序列
 * @returns {Promise<{errCode: number, errMsg: string, data: {levels: Array}}>}
 */
export async function getLayeredTestCharacters() {
  try {
    const allChars = await loadCharacters()
    
    if (!allChars || allChars.length === 0) {
      return errorResponse(10001, '汉字数据加载失败')
    }

    const levels = generateTestSequence(allChars)
    return successResponse({ levels })
  } catch (e) {
    console.error('获取测试汉字失败:', e)
    return errorResponse(10001, '获取测试汉字失败')
  }
}

/**
 * 获取指定层级的汉字
 * @param {number} level - 层级 (1-6)
 * @returns {Promise<{errCode: number, errMsg: string, data: Array}>}
 */
export async function getCharactersByLevel(level) {
  if (level < 1 || level > 6) {
    return errorResponse(10002, '无效的层级参数')
  }

  try {
    const allChars = await loadCharacters()
    const config = LEVEL_CONFIGS.find(c => c.level === level)
    
    if (!config) {
      return errorResponse(10002, '无效的层级参数')
    }

    const levelChars = allChars.filter(
      char => char.rank_id >= config.rankStart && char.rank_id <= config.rankEnd
    )

    return successResponse(levelChars)
  } catch (e) {
    console.error('获取层级汉字失败:', e)
    return errorResponse(10001, '获取层级汉字失败')
  }
}

/**
 * 获取层级配置信息
 * @returns {Promise<{errCode: number, errMsg: string, data: Array}>}
 */
export async function getLevelConfigs() {
  return successResponse(LEVEL_CONFIGS)
}
