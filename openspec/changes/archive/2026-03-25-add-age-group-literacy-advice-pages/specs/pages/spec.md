## ADDED Requirements

### Requirement: 首页年龄段卡片点击跳转

首页 SHALL 为所有 5 个年龄段卡片（4-5岁、5-6岁、幼小衔接、1-2年级、3-4年级）提供点击跳转功能。每个卡片的描述行下方 SHALL 显示蓝色文字「点击查看建议📖」（颜色 #155DFC，字号 24rpx）。点击卡片 SHALL 播放按钮音效并跳转到对应的识字学习建议页面。

#### Scenario: 所有卡片显示点击提示

- **Given** 用户在首页查看年龄段卡片
- **When** 页面加载完成
- **Then** 所有 5 个年龄段卡片 SHALL 在描述行显示蓝色「（点击查看建议📖）」文字
- **And** 文字颜色 SHALL 为 #155DFC，字号 24rpx

#### Scenario: 各卡片跳转到对应建议页

- **Given** 用户在首页
- **When** 用户点击 5-6岁卡片
- **Then** SHALL 跳转到 `/pages/literacy-advice-5-6/literacy-advice-5-6`
- **When** 用户点击幼小衔接卡片
- **Then** SHALL 跳转到 `/pages/literacy-advice-transition/literacy-advice-transition`
- **When** 用户点击 1-2年级卡片
- **Then** SHALL 跳转到 `/pages/literacy-advice-grade-1-2/literacy-advice-grade-1-2`
- **When** 用户点击 3-4年级卡片
- **Then** SHALL 跳转到 `/pages/literacy-advice-grade-3-4/literacy-advice-grade-3-4`

### Requirement: 新增 4 个识字学习建议页面路由

应用 SHALL 在 `pages.json` 中注册以下 4 个新页面路由，均使用自定义导航栏（`navigationStyle: "custom"`）：
- `pages/literacy-advice-5-6/literacy-advice-5-6`（标题："5-6岁识字学习建议"）
- `pages/literacy-advice-transition/literacy-advice-transition`（标题："幼小衔接识字学习建议"）
- `pages/literacy-advice-grade-1-2/literacy-advice-grade-1-2`（标题："1-2年级识字学习建议"）
- `pages/literacy-advice-grade-3-4/literacy-advice-grade-3-4`（标题："3-4年级识字学习建议"）

#### Scenario: 路由配置正确性

- **Given** 应用的路由配置文件 `pages.json`
- **When** 查看页面列表
- **Then** SHALL 包含上述 4 个页面路由
- **And** 每个路由的 `navigationStyle` 设置为 `"custom"`
