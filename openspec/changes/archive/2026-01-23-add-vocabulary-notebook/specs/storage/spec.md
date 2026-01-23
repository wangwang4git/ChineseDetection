# 存储扩展规范

## ADDED Requirements

### Requirement: 生字本存储

本地存储 SHALL 支持生字本数据的读写。

#### Scenario: 获取生字本

- **Given**: 本地存储中存在生字本数据 `{chars: ["体", "连"], lastUpdated: 1706000000000}`
- **When**: 调用 `getVocabularyNotebook()`
- **Then**: 返回 `{chars: ["体", "连"], lastUpdated: 1706000000000}`

#### Scenario: 获取空生字本

- **Given**: 本地存储中不存在生字本数据
- **When**: 调用 `getVocabularyNotebook()`
- **Then**: 返回 `{chars: [], lastUpdated: 0}`

#### Scenario: 保存生字本

- **Given**: 生字本数据 `{chars: ["体", "连", "众"], lastUpdated: 1706000000000}`
- **When**: 调用 `setVocabularyNotebook(notebook)`
- **Then**: 数据成功保存到本地存储
- **And**: 返回 `true`

### Requirement: 生字本更新操作

系统 SHALL 支持生字的增删操作。

#### Scenario: 添加生字（去重）

- **Given**: 生字本当前为 `["体", "连"]`
- **When**: 调用 `addToVocabularyNotebook(["连", "众", "少"])`
- **Then**: 生字本更新为 `["体", "连", "众", "少"]`
- **And**: `lastUpdated` 更新为当前时间戳

#### Scenario: 移除生字

- **Given**: 生字本当前为 `["体", "连", "众"]`
- **When**: 调用 `removeFromVocabularyNotebook("连")`
- **Then**: 生字本更新为 `["体", "众"]`
- **And**: `lastUpdated` 更新为当前时间戳

#### Scenario: 移除不存在的生字

- **Given**: 生字本当前为 `["体", "连"]`
- **When**: 调用 `removeFromVocabularyNotebook("众")`
- **Then**: 生字本保持为 `["体", "连"]`
- **And**: 返回 `false`

### Requirement: 生字本初始化

系统 SHALL 支持从历史记录初始化生字本。

#### Scenario: 初始化生字本

- **Given**: 本地存储中有 2 条检测记录
- **And**: 记录 1 的 unknownChars 为 ["体", "连"]
- **And**: 记录 2 的 unknownChars 为 ["众", "体"]
- **When**: 调用 `initVocabularyNotebook()`
- **Then**: 生字本初始化为 `{chars: ["体", "连", "众"], lastUpdated: 当前时间戳}`
