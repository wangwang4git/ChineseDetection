/**
 * API 入口
 * 汉字认字量检测小程序
 */

export * from './character.js'
export * from './record.js'
export * from './user.js'

/**
 * 统一响应格式
 * @param {number} errCode - 错误码，0 表示成功
 * @param {string} errMsg - 错误信息
 * @param {any} data - 业务数据
 * @returns {{errCode: number, errMsg: string, data: any}}
 */
export function createResponse(errCode, errMsg, data) {
  return { errCode, errMsg, data }
}

/**
 * 成功响应
 * @param {any} data - 业务数据
 * @returns {{errCode: number, errMsg: string, data: any}}
 */
export function successResponse(data) {
  return createResponse(0, 'success', data)
}

/**
 * 失败响应
 * @param {number} errCode - 错误码
 * @param {string} errMsg - 错误信息
 * @returns {{errCode: number, errMsg: string, data: null}}
 */
export function errorResponse(errCode, errMsg) {
  return createResponse(errCode, errMsg, null)
}
