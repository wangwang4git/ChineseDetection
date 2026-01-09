---
title: "用户信息管理规范"
status: "proposed"
created: "2026-01-08"
updated: "2026-01-09"
author: "AI Assistant"
---

# 用户信息管理规范

## ADDED Requirements

### Requirement: OpenID 获取和管理

系统 MUST 在应用启动时自动获取用户 OpenID，作为用户唯一标识，支持跨平台兼容和错误降级。

#### Scenario: 应用启动时获取 OpenID

**Given** 用户打开微信小程序
**When** 应用在 `App.vue` 的 `onLaunch` 生命周期中执行
**Then** 系统 SHALL 自动调用云函数 `baseFunctions` 获取 OpenID
**And** 系统 MUST 将 OpenID 保存到本地存储键 `USER_OPENID`
**And** 获取过程 MUST 不阻塞应用正常启动流程

#### Scenario: OpenID 获取失败处理

**Given** 云函数调用失败或网络异常
**When** OpenID 获取超时或返回错误
**Then** 系统 MUST 生成本地唯一标识符作为备用 ID
**And** 系统 SHALL 在控制台输出警告信息

#### Scenario: H5 环境 OpenID 处理

**Given** 应用运行在 H5 环境
**When** 无法调用微信云函数
**Then** 系统 MUST 使用条件编译 `#ifdef H5` 处理
**And** 系统 SHALL 生成基于时间戳和随机数的唯一 ID

### Requirement: 用户头像选择功能

系统 MUST 在个人页提供微信头像选择功能，遵循微信小程序头像昵称填写规范，支持跨平台兼容。

#### Scenario: 微信小程序头像选择

**Given** 用户在个人页查看用户信息卡片
**When** 用户点击头像区域
**Then** 系统 SHALL 触发微信头像选择组件 `open-type="chooseAvatar"`
**And** 系统 MUST 显示微信官方的头像选择界面

#### Scenario: 头像选择成功处理

**Given** 用户在微信头像选择界面选择了头像
**When** `@chooseavatar` 事件被触发
**Then** 系统 MUST 获取 `e.detail.avatarUrl` 头像 URL
**And** 系统 SHALL 更新本地用户信息中的 `avatar` 字段
**And** 系统 MUST 立即更新页面显示的头像

#### Scenario: H5 环境头像选择兼容

**Given** 应用运行在 H5 环境
**When** 用户点击头像区域
**Then** 系统 MUST 使用条件编译 `#ifdef H5` 处理
**And** 系统 SHALL 触发文件选择器允许用户上传图片

### Requirement: 用户昵称填写功能

系统 MUST 在个人页提供微信昵称填写功能，支持用户自定义昵称，实现实时保存和验证。

#### Scenario: 微信小程序昵称填写

**Given** 用户在个人页查看用户信息卡片
**When** 用户点击昵称区域
**Then** 系统 SHALL 激活昵称输入框 `type="nickname"`
**And** 系统 MUST 显示当前昵称内容并允许编辑

#### Scenario: 昵称输入和保存

**Given** 用户正在编辑昵称
**When** 用户输入新的昵称内容
**Then** 系统 MUST 实时验证昵称长度（1-20 个字符）
**And** 当用户失去焦点时系统 SHALL 触发 `@blur` 事件
**And** 系统 MUST 保存到本地存储键 `USER_INFO`

#### Scenario: 昵称验证和错误处理

**Given** 用户输入了无效的昵称
**When** 昵称为空或超过 20 个字符
**Then** 系统 MUST 显示错误提示
**And** 系统 SHALL 恢复到上一次有效的昵称

### Requirement: 用户信息展示和隐私保护

系统 MUST 在个人页展示用户信息，包括头像、昵称和掩码处理的 OpenID，保护用户隐私。

#### Scenario: 个人页用户信息展示

**Given** 用户进入个人页
**When** 页面加载完成
**Then** 系统 MUST 显示用户头像
**And** 系统 SHALL 显示用户昵称
**And** 系统 MUST 显示掩码处理的 OpenID

#### Scenario: OpenID 掩码显示

**Given** 需要在界面上显示 OpenID
**When** 调用 OpenID 掩码函数
**Then** 系统 MUST 显示前 4 位字符
**And** 中间部分 SHALL 用星号替代
**And** 系统 MUST 显示后 4 位字符

#### Scenario: 默认用户信息处理

**Given** 用户首次使用应用或信息获取失败
**When** 本地存储中没有有效的用户信息
**Then** 系统 MUST 使用默认头像
**And** 系统 SHALL 使用默认昵称
**And** 系统 MUST 使用生成的备用 ID 作为 OpenID

### Requirement: 本地存储和数据管理

系统 MUST 扩展本地存储功能，支持用户信息的持久化、验证和迁移，确保数据完整性。

#### Scenario: 用户信息存储结构

**Given** 需要保存用户信息到本地
**When** 调用 `setUserInfo()` 函数
**Then** 系统 MUST 使用存储键 `USER_INFO` 保存完整用户对象
**And** 用户对象 SHALL 包含必需字段
**And** 系统 MUST 使用 JSON 格式序列化存储

#### Scenario: 用户信息加载和验证

**Given** 应用启动或页面加载时
**When** 调用 `getUserInfo()` 函数
**Then** 系统 MUST 从本地存储键 `USER_INFO` 读取数据
**And** 系统 SHALL 验证数据格式和必需字段的完整性

#### Scenario: 数据迁移和兼容性

**Given** 应用更新后用户信息结构发生变化
**When** 检测到旧版本的用户数据
**Then** 系统 MUST 执行数据迁移逻辑，补充缺失字段
**And** 系统 SHALL 保持向后兼容，不丢失用户已有信息
