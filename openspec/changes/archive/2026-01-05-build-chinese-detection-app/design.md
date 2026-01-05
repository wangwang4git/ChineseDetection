---
title: 汉字认字量检测小程序 - 架构设计
status: proposed
created: 2026-01-05
---

# 架构设计文档

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
├─────────────────────────────────────────────────────────────┤
│  首页    │  检测页   │  结果页   │  个人页  │  历史详情页    │
│ (home)  │  (test)  │ (result) │(profile)│(history-detail)│
└────┬────┴────┬─────┴────┬─────┴────┬────┴───────┬────────┘
     │         │          │          │            │
┌────▼─────────▼──────────▼──────────▼────────────▼────────┐
│                      公共组件层                            │
├──────────────────────────────────────────────────────────┤
│   RiceGrid   │   CharacterCard   │   GradientButton      │
└──────────────┴───────────────────┴───────────────────────┘
     │
┌────▼─────────────────────────────────────────────────────┐
│                      业务逻辑层                            │
├──────────────────────────────────────────────────────────┤
│   API 模块 (api/)   │   工具函数 (utils/)                  │
│   - character.js   │   - storage.js                      │
│   - record.js      │   - calculate.js                    │
└──────────────┬─────┴─────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│                      数据层                               │
├──────────────────────────────────────────────────────────┤
│   Mock 数据 (mock/)        │   本地存储 (uni.storage)     │
│   - characters.js          │   - 检测记录                 │
│   - records.js             │   - 用户信息                 │
└────────────────────────────┴─────────────────────────────┘
```

## 2. 目录结构

```
src/
├── api/                      # API 接口模块
│   ├── index.js              # API 入口，统一导出
│   ├── character.js          # 汉字相关接口
│   └── record.js             # 检测记录接口
├── components/               # 公共组件
│   ├── RiceGrid.vue          # 米字格组件
│   ├── CharacterCard.vue     # 汉字卡片组件
│   └── GradientButton.vue    # 渐变按钮组件
├── mock/                     # Mock 数据
│   ├── characters.js         # 汉字库数据
│   └── records.js            # 历史记录数据
├── pages/                    # 页面
│   ├── home/                 # 首页
│   │   └── home.vue
│   ├── test/                 # 检测页
│   │   └── test.vue
│   ├── result/               # 结果页
│   │   └── result.vue
│   ├── profile/              # 个人页
│   │   └── profile.vue
│   └── history-detail/       # 历史详情页
│       └── history-detail.vue
├── styles/                   # 样式文件
│   ├── variables.scss        # 样式变量
│   └── common.scss           # 公共样式
├── utils/                    # 工具函数
│   ├── index.js              # 工具入口
│   ├── storage.js            # 存储工具
│   └── calculate.js          # 计算工具
├── static/                   # 静态资源
│   ├── images/               # 图片资源
│   └── icons/                # TabBar 图标
├── App.vue                   # 应用入口
├── main.js                   # 主入口
├── pages.json                # 页面配置
└── manifest.json             # 应用配置
```

## 3. 数据模型

### 3.1 汉字数据 (Character)

基于 `top_2500_chars_with_literacy.json` 文件结构：

```typescript
interface Character {
  rank_id: number;              // 字频排名 (1-2500)
  char: string;                 // 汉字
  frequency: number;            // 该汉字在中文语料出现频率 (%)
  frequency_cumulative: number; // 累积频率 (%)
  literacy_rate: number;        // 识字率
}
```

### 3.2 分层配置 (LevelConfig)

```typescript
interface LevelConfig {
  level: number;        // 层级 (1-6)
  name: string;         // 层级名称
  rankStart: number;    // 字频排名起始
  rankEnd: number;      // 字频排名结束
  sampleInterval: number; // 抽样间隔
  testCount: number;    // 测试字数
  weight: number;       // 计算权重
  description: string;  // 描述
}

// 分层配置常量
const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, name: 'L1', rankStart: 1, rankEnd: 50, sampleInterval: 1, testCount: 50, weight: 1, description: '绝对核心字' },
  { level: 2, name: 'L2', rankStart: 51, rankEnd: 200, sampleInterval: 3, testCount: 50, weight: 3, description: '高频基础字' },
  { level: 3, name: 'L3', rankStart: 201, rankEnd: 500, sampleInterval: 10, testCount: 30, weight: 10, description: '中频常用字' },
  { level: 4, name: 'L4', rankStart: 501, rankEnd: 1000, sampleInterval: 20, testCount: 25, weight: 20, description: '次常用字' },
  { level: 5, name: 'L5', rankStart: 1001, rankEnd: 1500, sampleInterval: 50, testCount: 10, weight: 50, description: '低频拓展字' },
  { level: 6, name: 'L6', rankStart: 1501, rankEnd: 2500, sampleInterval: 100, testCount: 10, weight: 100, description: '生僻/书面字' }
];
```

### 3.3 测试状态 (TestState)

```typescript
interface TestState {
  currentLevel: number;         // 当前测试层级 (1-6)
  currentIndex: number;         // 当前层级内的测试索引
  levelResults: LevelResult[];  // 各层级测试结果
  isFused: boolean;             // 是否已触发熔断
  fusedAtLevel: number | null;  // 熔断发生的层级
}

interface LevelResult {
  level: number;                // 层级
  testedChars: TestedChar[];    // 已测试的汉字
  knownCount: number;           // 认识的字数
  unknownCount: number;         // 不认识的字数
  consecutiveUnknown: number;   // 连续不认识计数
  isCompleted: boolean;         // 是否完成该层级
  isFused: boolean;             // 是否因熔断停止
}

interface TestedChar {
  char: string;                 // 汉字
  rank_id: number;              // 字频排名
  isKnown: boolean;             // 是否认识
  level: number;                // 所属层级
}
```

### 3.4 检测记录 (TestRecord)

```typescript
interface TestRecord {
  id: string;                    // 记录 ID (UUID)
  testTime: string;              // 检测时间 (ISO 8601)
  totalTestedCount: number;      // 实际测试汉字总数
  estimatedVocabulary: number;   // 预估认字量
  levelDetails: LevelDetail[];   // 各层级详情
  unknownChars: string[];        // 不认识的汉字列表
  isFused: boolean;              // 是否触发熔断
  fusedAtLevel: number | null;   // 熔断层级
}

interface LevelDetail {
  level: number;                 // 层级
  testedCount: number;           // 测试字数
  knownCount: number;            // 认识字数
  isFused: boolean;              // 是否熔断
}
```

### 3.5 用户信息 (User)

```typescript
interface User {
  id: string;           // 用户 ID
  nickname: string;     // 昵称
  avatar: string;       // 头像 (emoji 或 URL)
  account: string;      // 账号
}
```

## 4. API 设计

### 4.1 统一响应格式

```typescript
interface ApiResponse<T> {
  errCode: number;      // 错误码，0 表示成功
  errMsg: string;       // 错误信息
  data: T;              // 业务数据
}
```

### 4.2 汉字接口 (character.js)

```javascript
/**
 * 获取分层测试汉字列表
 * 基于分层频率抽样策略，从 top_2500_chars_with_literacy.json 生成测试序列
 * @returns {Promise<ApiResponse<{levels: LevelTestData[]}>>}
 */
export function getLayeredTestCharacters() {}

/**
 * 获取指定层级的测试汉字
 * @param {number} level - 层级 (1-6)
 * @returns {Promise<ApiResponse<Character[]>>}
 */
export function getCharactersByLevel(level) {}

/**
 * 获取层级配置信息
 * @returns {Promise<ApiResponse<LevelConfig[]>>}
 */
export function getLevelConfigs() {}
```

### 4.3 记录接口 (record.js)

```javascript
/**
 * 保存检测记录
 * @param {TestRecord} record - 检测记录（含分层详情）
 * @returns {Promise<ApiResponse<null>>}
 */
export function addRecord(record) {}

/**
 * 获取历史记录列表
 * @returns {Promise<ApiResponse<TestRecord[]>>}
 */
export function getRecordList() {}

/**
 * 获取单条记录详情
 * @param {string} id - 记录 ID
 * @returns {Promise<ApiResponse<TestRecord>>}
 */
export function getRecordDetail(id) {}

/**
 * 获取统计数据
 * @returns {Promise<ApiResponse<{testCount, maxScore, avgScore}>>}
 */
export function getStatistics() {}
```

### 4.4 计算工具 (calculate.js)

```javascript
/**
 * 计算预估认字量
 * @param {LevelResult[]} levelResults - 各层级测试结果
 * @returns {number} 预估认字量
 */
export function calculateVocabulary(levelResults) {}

/**
 * 检查是否触发熔断
 * @param {LevelResult} levelResult - 当前层级结果
 * @returns {{isFused: boolean, reason: string}} 熔断状态和原因
 */
export function checkFuse(levelResult) {}

/**
 * 生成测试序列
 * @param {Character[]} allChars - 所有汉字数据
 * @returns {LevelTestData[]} 分层测试数据
 */
export function generateTestSequence(allChars) {}
```

## 5. 认字量计算算法

### 5.1 算法原理

采用**分层频率抽样测试策略**：基于汉字使用频率将 2500 个常用汉字分为 6 个层级，每个层级按不同抽样间隔抽取测试样本，根据各层级的正确数量乘以对应权重计算总认字量。

### 5.2 分层策略

| 层级 | 字频排名范围 | 描述 | 覆盖率(约) | 抽样间隔 | 测试字数 | 权重 |
|------|-------------|------|-----------|---------|---------|------|
| L1 | 第 1-50 字 | 绝对核心字 | 30% | 1抽1 | 50字 | ×1 |
| L2 | 第 51-200 字 | 高频基础字 | 55% | 3抽1 | 50字 | ×3 |
| L3 | 第 201-500 字 | 中频常用字 | 75% | 10抽1 | 30字 | ×10 |
| L4 | 第 501-1000 字 | 次常用字 | 88% | 20抽1 | 25字 | ×20 |
| L5 | 第 1001-1500 字 | 低频拓展字 | 94% | 50抽1 | 10字 | ×50 |
| L6 | 第 1501-2500 字 | 生僻/书面字 | 99% | 100抽1 | 10字 | ×100 |
| **合计** | 1-2500 | - | - | - | **175字** | - |

### 5.3 计算公式

$$W = N_{L1} + (N_{L2} \times 3) + (N_{L3} \times 10) + (N_{L4} \times 20) + (N_{L5} \times 50) + (N_{L6} \times 100)$$

其中 $N_{Lx}$ 代表在第 $x$ 层级中实际认读正确的字数。

```javascript
/**
 * 计算预估认字量
 * @param {LevelResult[]} levelResults - 各层级测试结果
 * @returns {number} 预估认字量
 */
function calculateVocabulary(levelResults) {
  const weights = [1, 3, 10, 20, 50, 100];
  let total = 0;
  
  for (let i = 0; i < levelResults.length; i++) {
    const result = levelResults[i];
    total += result.knownCount * weights[i];
  }
  
  return total;
}
```

### 5.4 动态熔断机制

为提升测试效率，避免孩子因连续不认识而产生挫败感，设置动态熔断机制：

#### 熔断触发条件（满足任一即触发）

1. **连续不认识熔断**：在任意层级，连续 5 个测试字不认识
2. **错误率熔断**：在任意层级，总错误率超过 80%

#### 熔断处理规则

- 立即停止当前层级的测试
- 跳过后续所有层级的测试
- 假设当前层级剩余未测字及后续所有层级的字都不认识（计为 0 分）

```javascript
/**
 * 检查是否触发熔断
 * @param {LevelResult} levelResult - 当前层级结果
 * @param {LevelConfig} levelConfig - 层级配置
 * @returns {boolean} 是否触发熔断
 */
function checkFuse(levelResult, levelConfig) {
  // 条件1: 连续5个不认识
  if (levelResult.consecutiveUnknown >= 5) {
    return true;
  }
  
  // 条件2: 错误率超过80%
  const totalTested = levelResult.knownCount + levelResult.unknownCount;
  if (totalTested >= 5) { // 至少测试5个才计算错误率
    const errorRate = levelResult.unknownCount / totalTested;
    if (errorRate > 0.8) {
      return true;
    }
  }
  
  return false;
}
```

### 5.5 测试流程

```
开始测试
    │
    ▼
┌─────────────────────────────────────────────────┐
│ 层级 L1 (第1-50字, 全测50字)                      │
│   ├── 逐字测试                                   │
│   ├── 记录认识/不认识                            │
│   ├── 检查熔断条件                               │
│   │     ├── 连续5个不认识? → 熔断                │
│   │     └── 错误率>80%? → 熔断                   │
│   └── 完成或熔断                                 │
└─────────────────────────────────────────────────┘
    │
    ▼ (未熔断则继续)
┌─────────────────────────────────────────────────┐
│ 层级 L2 (第51-200字, 3抽1测50字)                  │
│   └── 同上流程...                                │
└─────────────────────────────────────────────────┘
    │
    ▼ (未熔断则继续)
    ... L3, L4, L5, L6 ...
    │
    ▼
┌─────────────────────────────────────────────────┐
│ 计算结果                                         │
│   ├── 汇总各层级认识数                           │
│   ├── 应用权重公式计算                           │
│   └── 生成检测报告                               │
└─────────────────────────────────────────────────┘
```

## 6. 页面流程

### 6.1 检测流程

```
首页 ──点击"开始检测"──→ 检测页
                          │
                          ├── 加载汉字数据 (top_2500_chars_with_literacy.json)
                          ├── 按分层策略生成测试序列 (175字)
                          │
                          ├── 层级 L1 (50字全测)
                          │     ├── 逐字展示
                          │     ├── 用户点击"认识/不认识"
                          │     ├── 记录结果，检查熔断
                          │     └── 完成或熔断
                          │
                          ├── 层级 L2-L6 (未熔断则继续)
                          │     └── 同上流程...
                          │
                          └── 测试结束（完成所有层级或触发熔断）
                                  │
                                  ▼
                              结果页
                                  │
                                  ├── 应用权重公式计算认字量
                                  ├── 展示结果和不认识汉字
                                  ├── 保存记录
                                  │
                                  └── 点击"结束检测"
                                          │
                                          ▼
                                        首页
```

### 6.2 历史查看流程

```
个人页 ──点击历史记录──→ 历史详情页
                              │
                              └── 点击"返回"
                                      │
                                      ▼
                                    个人页
```

## 7. 状态管理

### 7.1 页面间数据传递

- **检测页 → 结果页**: 通过 URL 参数传递检测结果
  ```javascript
  uni.navigateTo({
    url: `/pages/result/result?knownCount=${knownCount}&unknownChars=${JSON.stringify(unknownChars)}`
  })
  ```

- **个人页 → 历史详情页**: 通过 URL 参数传递记录 ID
  ```javascript
  uni.navigateTo({
    url: `/pages/history-detail/history-detail?id=${recordId}`
  })
  ```

### 7.2 本地存储

使用 `uni.setStorageSync` / `uni.getStorageSync` 存储：
- `TEST_RECORDS`: 检测记录列表
- `USER_INFO`: 用户信息（Mock）

## 8. 平台兼容性

### 8.1 条件编译

```vue
<!-- #ifdef MP-WEIXIN -->
<button open-type="getUserInfo">获取用户信息</button>
<!-- #endif -->

<!-- #ifdef H5 -->
<button @tap="handleGetUserInfo">获取用户信息</button>
<!-- #endif -->
```

### 8.2 样式兼容

- 使用 `rpx` 单位确保响应式
- 避免使用 CSS 变量（部分小程序不支持）
- 使用 `env(safe-area-inset-bottom)` 处理安全区域

## 9. 性能优化

### 9.1 渲染优化

- 使用 `v-show` 替代 `v-if` 处理频繁切换
- 列表使用 `:key` 绑定唯一标识
- 避免在模板中使用复杂表达式

### 9.2 资源优化

- 图片使用 `lazy-load` 懒加载
- 静态资源压缩
- 按需引入组件

### 9.3 代码优化

- 使用 `computed` 缓存计算结果
- 避免在 `onLoad` 中执行耗时操作
- 合理使用 `async/await` 处理异步
