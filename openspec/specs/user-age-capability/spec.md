# user-age-capability Specification

## Purpose
TBD - created by archiving change add-user-age-field. Update Purpose after archive.
## Requirements
### Requirement: 用户年龄数据模型

系统 MUST 扩展用户信息数据模型，增加年龄字段，支持年龄的存储和验证。

#### Scenario: UserInfo 类型包含年龄字段

**Given** 用户信息数据对象需要存储年龄
**When** 定义 UserInfo 类型结构
**Then** 系统 MUST 包含 `age` 字段，类型为 number
**And** 默认值 SHALL 为 0（表示未设置）
**And** 有效范围 MUST 为 1-15 岁

#### Scenario: 年龄字段验证

**Given** 需要验证用户年龄输入
**When** 调用年龄更新方法
**Then** 系统 MUST 验证年龄在 1-15 范围内
**And** 无效年龄 SHALL 被拒绝并返回错误

#### Scenario: 数据迁移兼容

**Given** 已有用户数据不包含年龄字段
**When** 加载旧版本用户数据
**Then** 系统 MUST 自动补充 `age` 字段，默认值为 0
**And** 系统 SHALL 保持其他字段不变

### Requirement: 个人页年龄展示

系统 MUST 在个人页用户信息卡片中展示用户年龄，位置在账号信息下方。

#### Scenario: 年龄信息展示

**Given** 用户进入个人页
**When** 页面渲染用户信息卡片
**Then** 系统 MUST 在账号行下方显示年龄行
**And** 已设置年龄时 SHALL 显示"年龄：X岁"格式
**And** 未设置年龄时 SHALL 显示"年龄：点击设置"

#### Scenario: 年龄展示样式

**Given** 年龄行需要与现有设计保持一致
**When** 渲染年龄展示元素
**Then** 字体大小 MUST 为 28rpx
**And** 颜色 SHALL 为 rgba(255, 255, 255, 0.9)
**And** 样式 MUST 与账号行保持一致

### Requirement: 年龄编辑功能

系统 MUST 提供年龄编辑功能，用户点击年龄行可弹出数字选择器进行年龄设置。

#### Scenario: 点击年龄行触发编辑

**Given** 用户在个人页查看用户信息卡片
**When** 用户点击年龄展示行
**Then** 系统 MUST 弹出数字选择器
**And** 选择器 SHALL 包含 1-15 岁的选项

#### Scenario: 年龄选择和保存

**Given** 用户在数字选择器中选择了年龄
**When** 用户确认选择
**Then** 系统 MUST 立即更新页面显示的年龄
**And** 系统 SHALL 异步保存年龄到本地存储
**And** 保存成功后 MUST 显示成功提示

#### Scenario: 年龄选择取消

**Given** 用户打开了数字选择器
**When** 用户取消选择或点击遮罩层
**Then** 系统 MUST 关闭选择器
**And** 系统 SHALL 保持原有年龄值不变

### Requirement: 引导弹窗年龄提示

系统 MUST 更新首次访问引导弹窗，增加年龄输入的提示信息。

#### Scenario: 引导弹窗内容更新

**Given** 用户首次访问个人页
**When** 显示引导弹窗
**Then** 弹窗内容 MUST 包含年龄设置的提示
**And** 提示文案 SHALL 为"点击年龄可以设置孩子的年龄"

### Requirement: 年龄数据本地存储

系统 MUST 将年龄数据保存在本地存储中，不同步到后台服务器。

#### Scenario: 年龄数据持久化

**Given** 用户设置了年龄
**When** 调用 userManager.updateAge() 方法
**Then** 系统 MUST 将年龄保存到本地存储键 `USER_INFO`
**And** 年龄 SHALL 作为 UserInfo 对象的 age 字段存储

#### Scenario: 年龄数据加载

**Given** 用户重新进入个人页
**When** 页面加载用户信息
**Then** 系统 MUST 从本地存储读取年龄数据
**And** 系统 SHALL 正确显示已保存的年龄

### Requirement: 跨平台兼容性

系统 MUST 确保年龄功能在微信小程序和 H5 环境下功能一致。

#### Scenario: 微信小程序环境

**Given** 应用运行在微信小程序环境
**When** 用户使用年龄编辑功能
**Then** 数字选择器 MUST 正常弹出和交互
**And** 年龄数据 SHALL 正确保存和加载

#### Scenario: H5 环境

**Given** 应用运行在 H5 环境
**When** 用户使用年龄编辑功能
**Then** 数字选择器 MUST 正常弹出和交互
**And** 年龄数据 SHALL 正确保存和加载

