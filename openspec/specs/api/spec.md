# api Specification

## Purpose
TBD - created by archiving change build-chinese-detection-app. Update Purpose after archive.
## Requirements
### Requirement: 统一响应格式

所有 API 接口 SHALL 返回统一的响应格式，便于前端统一处理。

#### Scenario: 成功响应

**Given** API 调用成功
**When** 返回响应数据
**Then** 响应格式为：
```json
{
  "errCode": 0,
  "errMsg": "success",
  "data": { ... }
}
```

#### Scenario: 失败响应

**Given** API 调用失败
**When** 返回错误信息
**Then** 响应格式为：
```json
{
  "errCode": 10001,
  "errMsg": "错误描述信息",
  "data": null
}
```

---

### Requirement: 汉字接口 (getLayeredTestCharacters)

应用 SHALL 提供基于分层频率抽样策略获取测试汉字列表的接口。

#### Scenario: 获取分层测试汉字

**Given** 调用 `getLayeredTestCharacters()`
**When** API 执行成功
**Then** 返回 6 个层级的测试汉字数据
**And** 总计 175 个测试汉字
**And** 每个层级包含 level、name、testChars、weight 字段
**And** 汉字按以下分层策略抽取：
  - L1: 第1-50字，1抽1，50字
  - L2: 第51-200字，3抽1，50字
  - L3: 第201-500字，10抽1，30字
  - L4: 第501-1000字，20抽1，25字
  - L5: 第1001-1500字，50抽1，10字
  - L6: 第1501-2500字，100抽1，10字

---

### Requirement: 汉字接口 (getCharactersByLevel)

应用 SHALL 提供获取指定层级汉字列表的接口。

#### Scenario: 获取指定层级汉字

**Given** 调用 `getCharactersByLevel(2)`
**When** API 执行成功
**Then** 返回层级 L2 (第51-200字) 的所有汉字

#### Scenario: 无效层级参数

**Given** 调用 `getCharactersByLevel(10)`
**When** 层级参数超出范围 (1-6)
**Then** 返回错误响应
**And** errCode 为 10002
**And** errMsg 为 "无效的层级参数"

---

### Requirement: 汉字接口 (getLevelConfigs)

应用 SHALL 提供获取分层配置信息的接口。

#### Scenario: 获取层级配置

**Given** 调用 `getLevelConfigs()`
**When** API 执行成功
**Then** 返回 6 个层级的配置信息：
```json
[
  { "level": 1, "name": "L1", "rankStart": 1, "rankEnd": 50, "sampleInterval": 1, "testCount": 50, "weight": 1, "description": "绝对核心字" },
  { "level": 2, "name": "L2", "rankStart": 51, "rankEnd": 200, "sampleInterval": 3, "testCount": 50, "weight": 3, "description": "高频基础字" },
  { "level": 3, "name": "L3", "rankStart": 201, "rankEnd": 500, "sampleInterval": 10, "testCount": 30, "weight": 10, "description": "中频常用字" },
  { "level": 4, "name": "L4", "rankStart": 501, "rankEnd": 1000, "sampleInterval": 20, "testCount": 25, "weight": 20, "description": "次常用字" },
  { "level": 5, "name": "L5", "rankStart": 1001, "rankEnd": 1500, "sampleInterval": 50, "testCount": 10, "weight": 50, "description": "低频拓展字" },
  { "level": 6, "name": "L6", "rankStart": 1501, "rankEnd": 2500, "sampleInterval": 100, "testCount": 10, "weight": 100, "description": "生僻/书面字" }
]
```

---

### Requirement: 计算工具 (calculateVocabulary)

应用 SHALL 提供基于分层权重公式计算预估认字量的工具函数。

#### Scenario: 计算认字量

**Given** 调用 `calculateVocabulary(levelResults)` 传入各层级测试结果
**When** 计算执行成功
**Then** 按公式计算：W = N_L1 + (N_L2 × 3) + (N_L3 × 10) + (N_L4 × 20) + (N_L5 × 50) + (N_L6 × 100)
**And** 返回预估认字量数值

#### Scenario: 计算示例

**Given** 各层级认识字数为 [50, 45, 25, 15, 5, 2]
**When** 计算执行
**Then** 预估认字量 = 50×1 + 45×3 + 25×10 + 15×20 + 5×50 + 2×100 = 50 + 135 + 250 + 300 + 250 + 200 = 1185

---

### Requirement: 计算工具 (checkFuse)

应用 SHALL 提供检查是否触发动态熔断机制的工具函数。

#### Scenario: 连续不认识熔断

**Given** 当前层级连续 5 个测试字不认识
**When** 调用 `checkFuse(levelResult)`
**Then** 返回 `{ isFused: true, reason: "连续5个不认识" }`

#### Scenario: 错误率熔断

**Given** 当前层级已测试 10 字，其中 9 字不认识（错误率 90%）
**When** 调用 `checkFuse(levelResult)`
**Then** 返回 `{ isFused: true, reason: "错误率超过80%" }`

#### Scenario: 未触发熔断

**Given** 当前层级连续不认识少于 5 个且错误率低于 80%
**When** 调用 `checkFuse(levelResult)`
**Then** 返回 `{ isFused: false, reason: "" }`

---

### Requirement: 计算工具 (generateTestSequence)

应用 SHALL 提供基于汉字数据生成分层测试序列的工具函数。

#### Scenario: 生成测试序列

**Given** 调用 `generateTestSequence(allChars)` 传入 2500 个汉字数据
**When** 执行成功
**Then** 返回 6 个层级的测试序列
**And** L1 层级包含第 1-50 字（全部）
**And** L2 层级从第 51-200 字中每 3 个抽 1 个，共 50 字
**And** L3 层级从第 201-500 字中每 10 个抽 1 个，共 30 字
**And** L4 层级从第 501-1000 字中每 20 个抽 1 个，共 25 字
**And** L5 层级从第 1001-1500 字中每 50 个抽 1 个，共 10 字
**And** L6 层级从第 1501-2500 字中每 100 个抽 1 个，共 10 字

---

### Requirement: 记录接口 (addRecord)

应用 SHALL 提供保存检测记录到本地存储的接口。

#### Scenario: 保存检测记录

**Given** 调用 `addRecord(record)` 传入检测记录
**When** 记录数据有效
**Then** 生成唯一 ID
**And** 保存到本地存储
**And** 返回成功响应

#### Scenario: 保存含熔断信息的记录

**Given** 调用 `addRecord(record)` 传入含熔断信息的记录
**When** 记录包含 `isFused: true` 和 `fusedAtLevel: 3`
**Then** 完整保存熔断信息
**And** 返回成功响应

#### Scenario: 记录数据无效

**Given** 调用 `addRecord(record)` 传入不完整数据
**When** 缺少必要字段
**Then** 返回错误响应
**And** errCode 为 10003
**And** errMsg 为 "记录数据不完整"

---

### Requirement: 记录接口 (getRecordList)

应用 SHALL 提供获取历史检测记录列表的接口。

#### Scenario: 获取历史记录列表

**Given** 调用 `getRecordList()`
**When** API 执行成功
**Then** 返回所有历史记录
**And** 按检测时间倒序排列
**And** 每条记录包含 id、testTime、estimatedVocabulary、unknownChars、isFused 字段

#### Scenario: 无历史记录

**Given** 调用 `getRecordList()`
**When** 本地存储无记录
**Then** 返回空数组
**And** errCode 为 0

---

### Requirement: 记录接口 (getRecordDetail)

应用 SHALL 提供获取单条检测记录详情的接口。

#### Scenario: 获取记录详情

**Given** 调用 `getRecordDetail(id)` 传入有效 ID
**When** 记录存在
**Then** 返回完整记录信息
**And** 包含 levelDetails 分层详情数组

#### Scenario: 记录不存在

**Given** 调用 `getRecordDetail(id)` 传入无效 ID
**When** 记录不存在
**Then** 返回错误响应
**And** errCode 为 10004
**And** errMsg 为 "记录不存在"

---

### Requirement: 统计接口 (getStatistics)

应用 SHALL 提供获取用户检测统计数据的接口。

#### Scenario: 获取统计数据

**Given** 调用 `getStatistics()`
**When** API 执行成功
**Then** 返回统计数据：
```json
{
  "testCount": 2,
  "maxScore": 1800,
  "avgScore": 1200
}
```

#### Scenario: 无检测记录时的统计

**Given** 调用 `getStatistics()`
**When** 无历史记录
**Then** 返回默认统计数据：
```json
{
  "testCount": 0,
  "maxScore": 0,
  "avgScore": 0
}
```

