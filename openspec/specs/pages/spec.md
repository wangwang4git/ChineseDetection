# pages Specification

## Purpose
TBD - created by archiving change build-chinese-detection-app. Update Purpose after archive.
## Requirements
### Requirement: 首页 (HomePage)

首页副标题区域 MUST 修改为两行显示，增加科学原理页面入口链接。首页年龄段卡片列表中，4-5岁卡片 MUST 增加可点击提示文案并支持跳转到识字学习建议页面。

#### Scenario: 副标题显示两行

- Given 用户在首页
- Then 副标题区域显示两行：
  - 第一行："一起来测测认识多少字吧！"（颜色 #6E11B0）
  - 第二行："科学原理查看请参考👉"（颜色 #155DFC，可点击）

#### Scenario: 点击跳转科学原理页

- Given 用户在首页
- When 用户点击"科学原理查看请参考👉"
- Then 跳转到科学原理页面

#### Scenario: 4-5岁卡片显示可点击提示

- **Given** 用户在首页查看年龄段卡片列表
- **When** 页面渲染完成
- **Then** 4-5岁卡片的描述区域 SHALL 显示"目标认字量"文字（颜色 #4A5565）
- **And** 紧跟显示蓝色提示文案"（点击查看建议📖）"（颜色 #155DFC，字号 24rpx）

#### Scenario: 点击4-5岁卡片跳转建议页

- **Given** 用户在首页查看年龄段卡片列表
- **When** 用户点击4-5岁卡片
- **Then** 播放按钮音效
- **And** 使用 `uni.navigateTo` 跳转到 `/pages/literacy-advice/literacy-advice` 页面

### Requirement: 检测页 (TestPage)

检测页 SHALL 展示待测汉字，用户判断是否认识，记录检测结果，支持分层测试和动态熔断机制。

#### Scenario: 用户进行汉字检测 (UI 更新)

**Given** 用户从首页进入检测页
**When** 页面加载完成
**Then** 页面 SHALL 显示粉紫蓝渐变背景 `linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%)`
**And** 页面 SHALL 显示简化进度信息：
  - 左侧：`第 X / Y 个`（紫色文字 #6E11B0）
  - 右侧：`已认识: X 个 ✅`（紫色文字）
**And** 页面 SHALL 显示进度条（白色半透明背景 + 紫色边框 #DAB2FF）
**And** 页面 SHALL 在米字格中展示汉字：
  - 白色背景
  - 金色边框 #FDC700
  - 圆角 16px
  - 阴影效果
**And** 页面 SHALL 显示两个操作按钮（胶囊形状 + 白色边框）：
  - "✅ 我认识"：绿色渐变 `linear-gradient(90deg, #05DF72 0%, #00C950 100%)`
  - "❌ 不认识"：橙红渐变 `linear-gradient(90deg, #FF8904 0%, #FF6467 100%)`
**And** 页面 SHALL 显示鼓励语（紫色文字 #6E11B0）

---

### Requirement: 结果页 (ResultPage)

结果页 SHALL 展示检测结果，包括预估认字量和不认识的汉字列表。

#### Scenario: 用户查看检测结果 (UI 更新)

**Given** 用户完成检测进入结果页
**When** 页面加载完成
**Then** 页面 SHALL 显示粉紫蓝渐变背景
**And** 页面 SHALL 显示"🎊"图标
**And** 页面 SHALL 显示"检测完成！"标题（紫色文字 #6E11B0）
**And** 页面 SHALL 显示金黄色结果卡片：
  - 背景：金黄渐变 `linear-gradient(135deg, #FFF085 0%, #FFD6A7 100%)`
  - 边框：金色 #FDC700
  - "你的认字量大约是"（深灰色 #364153）
  - 预估认字量数字（紫色 #9810FA，48px）
  - "个汉字 📚"（深灰色 #364153）
**And** 页面 SHALL 显示"📝 需要加强的汉字"区域：
  - 白色半透明背景
  - 粉色边框 #FDA5D5
  - 标题紫色 #6E11B0
**And** 页面 SHALL 显示不认识的汉字卡片列表：
  - 粉色渐变背景 `linear-gradient(135deg, #FFE2E2 0%, #FCE7F3 100%)`
  - 粉色边框 #FDA5D5
  - 黑色文字 #0A0A0A
**And** 页面 SHALL 显示鼓励语（紫色文字 #6E11B0）
**And** 页面 SHALL 显示"🏠 结束检测"按钮：
  - 蓝紫渐变 `linear-gradient(90deg, #51A2FF 0%, #C27AFF 100%)`
  - 白色边框
  - 胶囊形状

#### Scenario: 结果页移除分层详情

**Given** 用户完成检测进入结果页
**When** 页面加载完成
**Then** 页面 SHALL NOT 显示分层测试详情区域

---

### Requirement: 个人页 (ProfilePage)

个人页 SHALL 展示用户信息、统计数据和历史检测记录。

#### Scenario: 用户查看个人信息

**Given** 用户点击 TabBar 进入个人页
**When** 页面加载完成
**Then** 显示用户信息卡片（渐变背景）：
  - 用户头像“https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0”
  - 昵称"点击设置小朋友昵称"
  - 账号"账号：user_001"

#### Scenario: 用户查看统计数据

**Given** 用户在个人页
**When** 页面加载完成
**Then** 显示三个统计卡片：
  - 📊 检测次数
  - 🏆 最高记录
  - 📈 平均认字

#### Scenario: 用户查看历史记录

**Given** 用户在个人页
**When** 页面加载完成
**Then** 显示"📚 历史检测记录"标题
**And** 显示历史记录列表，每条记录包含：
  - 检测时间
  - 📊 认字量数值
  - 需加强汉字数（如有）
  - 👉 指示图标

#### Scenario: 用户点击历史记录

**Given** 用户在个人页查看历史记录列表
**When** 用户点击某条历史记录
**Then** 跳转到历史详情页
**And** 传递记录 ID

---

### Requirement: 历史详情页 (HistoryDetailPage)

历史详情页 SHALL 展示单次检测的完整信息。

#### Scenario: 用户查看历史详情 (UI 更新)

**Given** 用户从个人页点击历史记录进入详情页
**When** 页面加载完成
**Then** 页面 SHALL 显示粉紫蓝渐变背景
**And** 页面 SHALL 显示"← 返回"按钮：
  - 白色半透明背景 `rgba(255, 255, 255, 0.90)`
  - 紫色边框 #DAB2FF
  - 紫色文字 #6E11B0
**And** 页面 SHALL 显示检测信息卡片：
  - 背景：粉紫蓝渐变 `linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%)`
  - 边框：白色
  - 检测时间（白色半透明文字）
  - "当时的认字量"（白色文字）
  - 认字量数字（白色文字）
  - "个汉字 📚"（白色文字）
**And** 页面 SHALL 显示"📝 当时不认识的汉字"区域：
  - 白色半透明背景
  - 粉色边框 #FDA5D5
  - 标题紫色 #6E11B0
**And** 页面 SHALL 显示不认识的汉字卡片列表（粉色渐变样式）
**And** 页面 SHALL 显示鼓励语：
  - "💪 现在都认识这些字了吗？"（紫色 #6E11B0）
  - "继续努力，你一定会越来越棒！"（紫色 #9810FA）

#### Scenario: 历史详情页移除分层详情

**Given** 用户从个人页点击历史记录进入详情页
**When** 页面加载完成
**Then** 页面 SHALL NOT 显示分层测试详情区域

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

