/**
 * AI 工具定义模块
 * 用于 CloudBase AI 工具调用机制
 * 汉字认字量检测小程序
 */

/**
 * 调用 Tavily Search API
 * @param {string} query - 搜索关键词
 * @param {string} apiKey - Tavily API Key
 * @returns {Promise<Object>} 搜索结果
 */
function tavilySearch(query, apiKey) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://api.tavily.com/search',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        query: query,
        search_depth: 'basic',
        max_results: 3,
        include_answer: false,
        include_raw_content: false,
        include_images: false
      },
      timeout: 15000,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.data?.error || 'Unknown error'}`))
        }
      },
      fail: (err) => reject(err)
    })
  })
}

/**
 * 获取联网搜索工具实例
 * @param {string} apiKey - Tavily API Key
 * @returns {Object|null} 工具定义对象，若 apiKey 为空则返回 null
 */
export function getSearchWebTool(apiKey) {
  // 若未配置 API Key，返回 null（不启用工具调用）
  if (!apiKey) {
    console.warn('[aiTools] Tavily API Key 未配置，联网搜索工具不可用')
    return null
  }

  return {
    name: 'search_web',
    description: '搜索网络获取最新的教育资讯、学习资源和识字教学方法。当用户询问最新信息、需要外部资源或你不确定的事实时使用此工具。',
    /**
     * 工具执行函数
     * @param {Object} params - 参数对象
     * @param {string} params.query - 搜索关键词
     * @returns {Promise<string>} JSON 格式的搜索结果
     */
    fn: async ({ query }) => {
      try {
        console.log('[aiTools] 执行搜索:', query)

        // 使用小程序 HTTP 请求调用 Tavily API
        const response = await tavilySearch(query, apiKey)

        // 提取搜索结果（限制 3 条）
        const results = response.results?.slice(0, 3).map(r => ({
          title: r.title,
          url: r.url,
          content: r.content
        })) || []

        console.log('[aiTools] 搜索结果:', results.length, '条')
        return JSON.stringify(results)
      } catch (error) {
        console.error('[aiTools] 搜索失败:', error)

        // 错误处理：返回错误信息给 AI
        let errorMsg = '搜索失败，请稍后重试'
        const errStr = error?.message || error?.errMsg || ''
        if (errStr.includes('rate limit') || errStr.includes('429')) {
          errorMsg = '搜索请求过于频繁，请稍后再试'
        } else if (errStr.includes('timeout') || errStr.includes('request:fail')) {
          errorMsg = '网络连接超时，无法完成搜索'
        } else if (errStr.includes('401') || errStr.includes('403') || errStr.includes('invalid') || errStr.includes('unauthorized')) {
          errorMsg = 'API Key 无效或已过期'
        }

        return JSON.stringify({ error: errorMsg })
      }
    },
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "搜索关键词，如'幼儿识字教学方法'、'儿童阅读绘本推荐'"
        }
      },
      required: ['query']
    }
  }
}

/**
 * 获取所有可用的 AI 工具
 * @param {Object} config - 配置对象
 * @param {string} config.tavilyApiKey - Tavily API Key
 * @returns {Array} 工具数组（过滤掉 null 值）
 */
export function getAITools(config = {}) {
  const tools = []

  // 添加联网搜索工具（若配置了 API Key）
  const searchTool = getSearchWebTool(config.tavilyApiKey)
  if (searchTool) {
    tools.push(searchTool)
  }

  return tools
}
