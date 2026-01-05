/**
 * 检测记录接口
 * 汉字认字量检测小程序
 */

import { successResponse, errorResponse } from './index.js'
import { getRecords, saveRecord, getRecordById, getStatistics as getStorageStatistics } from '../utils/storage.js'

/**
 * 保存检测记录
 * @param {Object} record - 检测记录
 * @returns {Promise<{errCode: number, errMsg: string, data: null}>}
 */
export async function addRecord(record) {
  // 验证必要字段
  if (!record || typeof record.estimatedVocabulary !== 'number') {
    return errorResponse(10003, '记录数据不完整')
  }

  try {
    const success = saveRecord(record)
    if (success) {
      return successResponse(null)
    } else {
      return errorResponse(10003, '保存记录失败')
    }
  } catch (e) {
    console.error('保存记录失败:', e)
    return errorResponse(10003, '保存记录失败')
  }
}

/**
 * 获取历史记录列表
 * @returns {Promise<{errCode: number, errMsg: string, data: Array}>}
 */
export async function getRecordList() {
  try {
    const records = getRecords()
    return successResponse(records)
  } catch (e) {
    console.error('获取记录列表失败:', e)
    return errorResponse(10001, '获取记录列表失败')
  }
}

/**
 * 获取单条记录详情
 * @param {string} id - 记录 ID
 * @returns {Promise<{errCode: number, errMsg: string, data: Object|null}>}
 */
export async function getRecordDetail(id) {
  if (!id) {
    return errorResponse(10004, '记录ID不能为空')
  }

  try {
    const record = getRecordById(id)
    if (record) {
      return successResponse(record)
    } else {
      return errorResponse(10004, '记录不存在')
    }
  } catch (e) {
    console.error('获取记录详情失败:', e)
    return errorResponse(10001, '获取记录详情失败')
  }
}

/**
 * 获取统计数据
 * @returns {Promise<{errCode: number, errMsg: string, data: {testCount: number, maxScore: number, avgScore: number}}>}
 */
export async function getStatistics() {
  try {
    const statistics = getStorageStatistics()
    return successResponse(statistics)
  } catch (e) {
    console.error('获取统计数据失败:', e)
    return errorResponse(10001, '获取统计数据失败')
  }
}
