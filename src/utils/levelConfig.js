/**
 * 分层配置常量
 * 汉字认字量检测 - 分层频率抽样测试策略
 */

/**
 * 层级配置
 * @type {Array<{level: number, name: string, rankStart: number, rankEnd: number, sampleInterval: number, testCount: number, weight: number, description: string}>}
 */
export const LEVEL_CONFIGS = [
  {
    level: 1,
    name: 'L1',
    rankStart: 1,
    rankEnd: 50,
    sampleInterval: 1,  // 1抽1，全测
    testCount: 50,
    weight: 1,
    description: '绝对核心字'
  },
  {
    level: 2,
    name: 'L2',
    rankStart: 51,
    rankEnd: 200,
    sampleInterval: 3,  // 3抽1
    testCount: 50,
    weight: 3,
    description: '高频基础字'
  },
  {
    level: 3,
    name: 'L3',
    rankStart: 201,
    rankEnd: 500,
    sampleInterval: 10, // 10抽1
    testCount: 30,
    weight: 10,
    description: '中频常用字'
  },
  {
    level: 4,
    name: 'L4',
    rankStart: 501,
    rankEnd: 1000,
    sampleInterval: 20, // 20抽1
    testCount: 25,
    weight: 20,
    description: '次常用字'
  },
  {
    level: 5,
    name: 'L5',
    rankStart: 1001,
    rankEnd: 1500,
    sampleInterval: 50, // 50抽1
    testCount: 10,
    weight: 50,
    description: '低频拓展字'
  },
  {
    level: 6,
    name: 'L6',
    rankStart: 1501,
    rankEnd: 2500,
    sampleInterval: 100, // 100抽1
    testCount: 10,
    weight: 100,
    description: '生僻/书面字'
  }
]

/**
 * 熔断配置
 */
export const FUSE_CONFIG = {
  consecutiveUnknownLimit: 5,  // 连续不认识熔断阈值
  errorRateLimit: 0.8,         // 错误率熔断阈值 (80%)
  minTestCountForErrorRate: 5  // 计算错误率的最小测试数
}

/**
 * 总测试字数
 */
export const TOTAL_TEST_COUNT = LEVEL_CONFIGS.reduce((sum, config) => sum + config.testCount, 0)

/**
 * 年龄段认字量参考
 */
export const AGE_LITERACY_REFERENCE = [
  { age: '4-5岁', min: 50, max: 100, description: '目标认字量 50-100 个汉字' },
  { age: '5-6岁', min: 200, max: 300, description: '目标认字量 200-300 个汉字' },
  { age: '幼小衔接', min: 300, max: 500, description: '目标认字量 300-500 个汉字' },
  { age: '1～2年级', min: 1500, max: 1700, description: '目标认字量 1600 左右个汉字' },
  { age: '3～4年级', min: 2400, max: 2600, description: '目标认字量 2500 左右个汉字' }
]
