/**
 * AI 提示词构造工具
 * 汉字认字量检测小程序 - AI 辅导功能
 */

import { LEVEL_CONFIGS, AGE_LITERACY_REFERENCE } from './levelConfig.js'

/**
 * System Prompt 内容
 * 幼儿及青少年识字教育专家角色设定
 */
export const SYSTEM_PROMPT = `# Role: 幼儿及青少年识字教育专家

## Goals:

基于孩子的年龄、当前识字量、目标识字量以及具体不认识的汉字分布，进行深度的识字能力分析。识别孩子识字进度的差距，分析不认识汉字的难易程度，并提供个性化、科学的阶段性学习建议，帮助家长或老师更有针对性地辅导。

## Constrains:

* **专业性**：建议必须符合儿童认知发展规律，不提倡"填鸭式"教学。
* **数据驱动**：分析必须严格基于用户提供的"实测识字量"与"目标识字量"的对比。
* **优先级原则**：在处理"不认识汉字列表"时，必须优先建议学习**绝对核心字**与**高频基础字**。
* **去术语化**：**严禁**在输出中使用 L1、L2 等技术代码，必须统一使用以下对应描述：
* **绝对核心字**（字频 1-50）
* **高频基础字**（字频 51-200）
* **中频常用字**（字频 201-500）
* **次常用字**（字频 501-1000）
* **低频拓展字**（字频 1001-1500）
* **生僻/书面字**（字频 1501-2500）

## Skills:

1. **数据分析力**：能敏锐对比当前识字量与标准目标的差距。
2. **语言学背景**：熟悉汉字字频分布，理解从"绝对核心字"到"生僻字"的教学优先级。
3. **教育规划**：能根据孩子的年龄段制定差异化的识字策略（如游戏识字、阅读识字或拆解识字）。
4. **同理心**：理解家长对孩子学业进度的关注，用通俗易懂的方式解释专业概念，缓解焦虑。

## Workflows:

1. **数据诊断**：接收并分析以下五个维度的数据：
  * 孩子当前年龄
  * 目标认字量（参考标准：4-5岁50-100；5-6岁200-300；幼小衔接300-500；小学1-2年级1600左右；小学3-4年级2500左右）
  * 实测认字量
  * 不认识汉字列表
  * 不认识汉字聚集的分组描述

2. **差距分析**：对比实际与目标的差距，评估孩子当前处于"领先"、"持平"还是"需加油"状态。
3. **分级解读**：重点分析"不认识汉字"所在的分组。如果**绝对核心字**或**高频基础字**占比较高，需发出预警。
4. **制定方案**：给出具体的学习建议（包含复习频率、推荐方法、学习优先级）。

## Initialization:

作为[幼儿及青少年识字教育专家]，我将为你提供专业的识字能力诊断。请提供孩子的年龄、目标认字量、实测认字量、不认识汉字列表以及它们所属的分组描述，我将为你生成详细的分析报告。`

/**
 * 获取 System Prompt
 * @returns {string} System Prompt 内容
 */
export function getSystemPrompt() {
  return SYSTEM_PROMPT
}

/**
 * 根据年龄获取阶段描述
 * @param {number} age - 年龄
 * @returns {string} 年龄阶段描述
 */
export function getAgeStage(age) {
  if (!age || age <= 0) return '未知阶段'
  if (age <= 3) return '启蒙阶段'
  if (age <= 4) return '幼儿园小班阶段'
  if (age <= 5) return '幼儿园中大班阶段'
  if (age === 6) return '幼小衔接阶段'
  if (age <= 8) return '小学低年级阶段'
  if (age <= 10) return '小学中年级阶段'
  return '小学高年级阶段'
}

/**
 * 根据年龄获取目标认字量范围
 * @param {number} age - 年龄
 * @returns {{min: number, max: number}} 目标认字量范围
 */
export function getTargetByAge(age) {
  if (!age || age <= 0) return { min: 0, max: 0 }
  if (age <= 4) return { min: 50, max: 100 }
  if (age <= 5) return { min: 200, max: 300 }
  if (age === 6) return { min: 300, max: 500 }
  if (age <= 8) return { min: 1500, max: 1700 }
  if (age <= 10) return { min: 2400, max: 2600 }
  return { min: 2500, max: 3000 }
}

/**
 * 分析不认识汉字的聚集分组
 * 根据字频分布进行分组统计
 * @param {Array<{char: string, rank_id?: number}>} unknownChars - 不认识的汉字列表
 * @param {Array<{rank_id: number, char: string}>} allChars - 所有汉字数据（用于查询 rank_id）
 * @returns {string} 聚集分组描述
 */
export function analyzeCharGroup(unknownChars, allChars = []) {
  if (!unknownChars || unknownChars.length === 0) {
    return '暂无数据'
  }

  // 构建汉字到 rank_id 的映射
  const charToRank = {}
  if (allChars && allChars.length > 0) {
    allChars.forEach(item => {
      charToRank[item.char] = item.rank_id
    })
  }

  // 统计各层级的不认识汉字数量
  const levelCounts = {
    L1: 0, // 绝对核心字 (1-50)
    L2: 0, // 高频基础字 (51-200)
    L3: 0, // 中频常用字 (201-500)
    L4: 0, // 次常用字 (501-1000)
    L5: 0, // 低频拓展字 (1001-1500)
    L6: 0  // 生僻/书面字 (1501-2500)
  }

  unknownChars.forEach(item => {
    const char = typeof item === 'string' ? item : item.char
    const rankId = typeof item === 'object' && item.rank_id 
      ? item.rank_id 
      : (charToRank[char] || 0)
    
    if (rankId >= 1 && rankId <= 50) levelCounts.L1++
    else if (rankId >= 51 && rankId <= 200) levelCounts.L2++
    else if (rankId >= 201 && rankId <= 500) levelCounts.L3++
    else if (rankId >= 501 && rankId <= 1000) levelCounts.L4++
    else if (rankId >= 1001 && rankId <= 1500) levelCounts.L5++
    else if (rankId >= 1501 && rankId <= 2500) levelCounts.L6++
  })

  // 找出主要聚集的层级
  const levelDescriptions = {
    L1: '绝对核心字',
    L2: '高频基础字',
    L3: '中频常用字',
    L4: '次常用字',
    L5: '低频拓展字',
    L6: '生僻/书面字'
  }

  const groups = []
  Object.entries(levelCounts).forEach(([level, count]) => {
    if (count > 0) {
      groups.push(`${levelDescriptions[level]}(${count}个)`)
    }
  })

  if (groups.length === 0) {
    return '暂无数据'
  }

  // 找出最主要的聚集层级
  const maxLevel = Object.entries(levelCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])[0]
  
  if (maxLevel) {
    return `主要聚集在${levelDescriptions[maxLevel[0]]}，${groups.join('、')}`
  }

  return groups.join('、')
}

/**
 * 构造 User Prompt
 * @param {Object} params - 用户参数
 * @param {number} params.age - 用户年龄
 * @param {string} [params.ageStage] - 年龄阶段描述（可选，不传则自动计算）
 * @param {number} [params.targetMin] - 目标认字量最小值（可选，不传则自动计算）
 * @param {number} [params.targetMax] - 目标认字量最大值（可选，不传则自动计算）
 * @param {number} params.actualCount - 实测认字量
 * @param {Array<string>} params.unknownChars - 不认识汉字列表
 * @param {string} [params.charGroup] - 汉字聚集分组（可选，不传则显示"暂无数据"）
 * @returns {string} 构造好的 User Prompt
 */
export function buildUserPrompt(params) {
  const {
    age = 0,
    ageStage,
    targetMin,
    targetMax,
    actualCount = 0,
    unknownChars = [],
    charGroup
  } = params

  // 自动计算年龄阶段
  const stage = ageStage || getAgeStage(age)
  
  // 自动计算目标认字量范围
  const target = (targetMin && targetMax) 
    ? { min: targetMin, max: targetMax }
    : getTargetByAge(age)

  // 格式化不认识汉字列表
  const unknownList = unknownChars.length > 0 
    ? unknownChars.slice(0, 20).join('、') + (unknownChars.length > 20 ? '...' : '')
    : '暂无数据'

  // 聚集分组
  const group = charGroup || '暂无数据'

  return `孩子基本信息：${age}岁，正处于${stage}；
目标认字量：${target.min}-${target.max}字；
实测认字量：${actualCount}字；
不认识汉字列表：${unknownList}；
不认识汉字聚集分组：${group}；`
}

/**
 * 从检测记录中提取不认识的汉字列表
 * @param {Object} record - 检测记录
 * @returns {Array<string>} 不认识的汉字列表
 */
export function extractUnknownChars(record) {
  if (!record) return []
  
  // 直接从记录中获取 unknownChars 字段
  if (record.unknownChars && Array.isArray(record.unknownChars)) {
    return record.unknownChars
  }
  
  return []
}
