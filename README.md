# 汉字认字量检测小程序

> 基于 AI 全流程开发的幼儿园汉字认字量检测应用，采用科学的分层频率抽样测试策略，为儿童提供准确的识字量评估。

## 📱 项目介绍

这是一个专为幼儿园及小学低年级儿童（1-15岁）设计的汉字认字量检测小程序。通过科学的测试算法和友好的用户界面，帮助家长和老师了解孩子的汉字识字水平，精准估算儿童识字量（0-2500字范围）。

### ✨ 核心特性

- 🎯 **科学测试算法**：基于《现代汉语常用字表》前 2500 个高频汉字，覆盖 98.5% 语料
- 📊 **分层抽样策略**：6 层级智能抽样，最多测试 175 个汉字
- ⚡ **动态熔断机制**：连续 5 个不认识或错误率超 80% 智能停止，避免儿童产生挫败感
- 🎨 **儿童友好界面**：适配幼儿园低龄用户的 UI 设计，米字格展示
- 🔊 **汉字发音功能**：微信同声传译插件支持汉字朗读（仅微信小程序）
- 📝 **组词示例展示**：展示汉字常用词语，帮助理解实际用法
- 📚 **生字本功能**：自动收集不认识的汉字，支持学习模式复习
- 🔬 **科学原理说明**：详细展示测试方法的科学依据
- 📈 **历史记录追踪**：完整的测试历史和进步跟踪
- 🤖 **AI 智能助手**：基于检测结果的个性化分析和识字建议（DeepSeek 模型）
- 🔍 **联网搜索增强**：AI 可联网获取最新教育资讯（Tavily API，可选）
- 🔄 **跨平台支持**：基于 uni-app，支持微信小程序、H5 等多平台
- ☁️ **云端数据同步**：基于微信云开发，数据安全可靠
- 🔐 **用户身份识别**：微信授权登录，个人数据隔离

## 🏗️ 技术架构

### 前端技术栈
- **框架**：uni-app 3.0 + Vue 3.4 (Composition API)
- **构建工具**：Vite 5.2.8
- **样式**：SCSS + rpx 响应式单位
- **国际化**：vue-i18n 9.1.9
- **汉字处理**：cnchar ^3.2.6（拼音、笔画等）
- **Markdown 渲染**：markdown-it ^14.1.0
- **类型支持**：TypeScript（部分支持）

### 后端技术栈
- **云开发平台**：微信云开发
- **云函数**：Node.js + wx-server-sdk
- **数据库**：云数据库 (MongoDB)
- **存储**：云存储
- **用户认证**：微信小程序授权
- **AI 服务**：微信云开发 AI（DeepSeek 模型）
- **联网搜索**：Tavily Search API（可选）
- **汉字发音**：微信同声传译插件（WechatSI）

### 核心算法
- **测试策略**：分层频率抽样
- **计算公式**：`W = N₁ + (N₂×3) + (N₃×10) + (N₄×20) + (N₅×50) + (N₆×100)`
- **熔断机制**：连续 5 个不认识或错误率超过 80% 自动停止

### 云函数 API
项目使用微信云开发提供后端服务，主要云函数接口：

#### baseFunctions 云函数
```javascript
// 获取用户 OpenID
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { type: 'getOpenId' }
})

// 创建数据集合
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { type: 'createCollection' }
})

// 查询记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { type: 'selectRecord' }
})

// 新增记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { 
    type: 'insertRecord',
    data: { /* 记录数据 */ }
  }
})

// 更新记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { 
    type: 'updateRecord',
    data: [/* 更新数据数组 */]
  }
})

// 删除记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { 
    type: 'deleteRecord',
    data: { _id: 'record_id' }
  }
})
```

## 📁 项目结构

```
src/
├── App.vue                    # 应用入口（云开发初始化、用户信息预加载）
├── main.js                    # 应用入口文件
├── manifest.json              # 应用配置（appid、权限、插件配置等）
├── pages.json                 # 页面路由和 TabBar 配置
├── api/                       # API 接口层
│   ├── index.js               # API 入口和响应格式
│   ├── character.js           # 汉字数据接口
│   ├── record.js              # 检测记录接口
│   └── user.js                # 用户信息接口
├── cloudfunctions/            # 云函数目录
│   └── baseFunctions/         # 基础云函数
│       ├── index.js           # 云函数入口文件
│       ├── package.json       # 依赖配置
│       └── config.json        # 云函数配置
├── components/                # 公共组件
│   ├── RiceGrid.vue           # 米字格汉字展示组件
│   ├── CharacterCard.vue      # 汉字卡片组件
│   ├── CustomTabBar.vue       # 自定义 TabBar 组件
│   └── GradientButton.vue     # 渐变按钮组件
├── config/                    # 配置文件
│   └── env.js                 # 环境变量配置管理
├── pages/                     # 页面目录
│   ├── home/                  # 首页（开始检测入口、科学原理入口）
│   ├── test/                  # 检测页（分层测试、生字学习模式）
│   ├── result/                # 结果页（认字量展示）
│   ├── profile/               # 个人页（骨架屏、用户信息、历史记录）
│   ├── history-detail/        # 历史详情页
│   ├── vocabulary-notebook/   # 生字本页面
│   ├── ai-assistant/          # AI 助手页（智能对话辅导）
│   └── science-principle/     # 科学原理页（测试方法说明）
├── utils/                     # 工具函数
│   ├── index.js               # 工具入口（时间格式化等）
│   ├── levelConfig.js         # 分层配置常量
│   ├── calculate.js           # 认字量计算、熔断检测、随机抽样
│   ├── storage.js             # 本地存储工具（含 OpenID 缓存）
│   ├── userManager.js         # 用户信息管理器（懒加载优化）
│   ├── share.js               # 微信分享配置
│   ├── aiPrompt.js            # AI 提示词构造工具
│   └── aiTools.js             # AI 工具定义模块（联网搜索）
├── styles/                    # 样式文件
│   ├── variables.scss         # 颜色、字体变量
│   └── common.scss            # 公共样式类
└── static/                    # 静态资源
    ├── top_2500_chars_with_literacy.json  # 汉字数据（2500字）
    ├── top_2500_chars_with_words.json     # 汉字词语数据
    ├── icons/                 # TabBar 图标
    └── images/                # 应用图片资源
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- 微信开发者工具 (用于小程序开发和云函数部署)

### 环境配置

1. **创建环境变量文件**
   ```bash
   cp .env.example .env
   ```

2. **配置微信云开发环境ID**
   ```bash
   # .env 文件
   VITE_WX_CLOUD_ENV=your-cloud-env-id-here
   
   # 可选：AI 联网搜索功能
   VITE_TAVILY_API_KEY=tvly-xxx
   ```

### 安装依赖
```bash
npm install
```

### 云开发配置

1. **开通微信云开发**
   - 在微信开发者工具中打开项目
   - 点击"云开发"按钮，开通云开发服务
   - 创建云开发环境，获取环境ID

2. **部署云函数**
   - 右键点击 `src/cloudfunctions/baseFunctions` 目录
   - 选择"上传并部署：云端安装依赖"
   - 等待部署完成

3. **初始化云数据库**
   - 云函数会自动创建 `sales` 集合（示例数据）
   - 可根据需要创建其他集合

### 开发运行
```bash
# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# 支付宝小程序开发
npm run dev:mp-alipay
```

### 生产构建
```bash
# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin
```

## 📊 测试算法详解

### 分层策略

| 层级 | 字频排名 | 描述 | 抽样策略 | 测试字数 | 权重 |
|------|----------|------|----------|----------|------|
| L1 | 1-50 | 绝对核心字 | 全测+随机打乱 | 50字 | ×1 |
| L2 | 51-200 | 高频基础字 | 随机抽样 | 50字 | ×3 |
| L3 | 201-500 | 中频常用字 | 随机抽样 | 30字 | ×10 |
| L4 | 501-1000 | 次常用字 | 随机抽样 | 25字 | ×20 |
| L5 | 1001-1500 | 低频拓展字 | 随机抽样 | 10字 | ×50 |
| L6 | 1501-2500 | 生僻/书面字 | 随机抽样 | 10字 | ×100 |

### 随机策略

- **L1层**：全部50字随机打乱顺序（Fisher-Yates洗牌算法）
- **L2-L6层**：从层级汉字中随机抽取指定数量（每次测试抽取不同汉字）

### 计算公式

```
W = N₁×1 + N₂×3 + N₃×10 + N₄×20 + N₅×50 + N₆×100
```

其中 Nₓ 为第 x 层级认识的字数。

### 熔断机制

- **连续不认识熔断**：任意层级连续 5 个字不认识，立即停止
- **错误率熔断**：任意层级错误率超过 80%，立即停止
- **处理方式**：假设剩余未测字及后续层级都不认识（计 0 分）
- **设计目的**：避免让孩子产生挫败感，同时提高测试效率

### 年龄段参考

| 年龄段 | 目标认字量 | 描述 |
|--------|------------|------|
| 4-5岁 | 50-100 | 学前启蒙阶段 |
| 5-6岁 | 200-300 | 幼儿园大班 |
| 幼小衔接 | 300-500 | 入学准备 |
| 1-2年级 | 1600左右 | 小学低年级 |
| 3-4年级 | 2500左右 | 小学中年级 |

## 🎨 UI 设计

### 设计理念
- **儿童友好**：圆角设计、明亮色彩、大字体
- **直观易懂**：简化操作流程、清晰的视觉层次
- **趣味性**：emoji 图标、渐变色彩、动画效果

### 核心组件
- **米字格 (RiceGrid)**：传统汉字练习格，支持多尺寸，帮助儿童专注
- **汉字卡片 (CharacterCard)**：汉字展示卡片组件
- **渐变按钮 (GradientButton)**：吸引注意力的交互元素
- **自定义 TabBar (CustomTabBar)**：符合设计稿的底部导航栏

### 性能优化

#### App 级用户信息预加载
应用启动时预加载用户信息，通过 `globalData` 共享给各页面，避免重复请求。

#### userManager 懒加载优化
- **本地缓存优先**：先从本地存储读取，立即返回
- **后台刷新**：异步更新 OpenID，不阻塞 UI

#### 页面级骨架屏
`profile.vue` 实现分阶段加载：
1. 首次加载显示骨架屏动画
2. 并行加载关键数据
3. 关键数据完成后显示实际内容
4. 非关键数据延迟加载

## 📱 页面功能

### 首页 (home)
- 展示不同年龄段认字量参考区间
- 引导用户开始检测
- 跳转到科学原理页了解测试方法
- 精美的渐变背景和卡片设计

### 检测页 (test)
- 米字格展示待测汉字
- "我认识" / "不认识" 选择按钮
- 实时进度显示和动态熔断
- 🔊 汉字发音功能（微信小程序，点击喇叭按钮）
- 📝 组词示例展示（展示 2 个常用词语）
- 支持生字学习模式（从生字本进入）

### 结果页 (result)
- 预估认字量展示
- 分层详情统计
- 不认识汉字列表
- 微信分享功能

### 个人页 (profile)
- 骨架屏加载动画
- 用户信息展示和编辑（头像、昵称、年龄）
- 统计数据概览
- 历史检测记录列表
- 生字本入口
- AI 辅导入口

### 历史详情页 (history-detail)
- 单次检测完整信息
- 不认识汉字回顾
- 进步对比分析

### 生字本页 (vocabulary-notebook)
- 生字列表管理（4列网格布局）
- 点击单字进入学习模式
- 从历史记录自动收集不认识的汉字
- 学习模式中认识后自动移除

### AI 助手页 (ai-assistant)
- 基于检测数据的智能分析
- 个性化识字建议和学习规划
- 联网搜索最新教育资讯（需配置 Tavily API Key）
- 流式输出 + Markdown 渲染
- 微信云开发 AI（DeepSeek 模型）

### 科学原理页 (science-principle)
- 数据来源说明（2500常用字，覆盖 98.5% 语料）
- 分层测试策略和计算公式
- 层级表格展示
- 熔断机制说明和计算示例

## 🔧 开发规范

### 代码规范
- 使用 Vue 3 Composition API (`<script setup>`)
- TypeScript 类型支持（部分）
- 详细的 JSDoc 注释

### 文件命名
- 页面文件：小写 (如 `home.vue`, `test.vue`)
- 组件：PascalCase (如 `RiceGrid.vue`, `CharacterCard.vue`)
- 工具函数：camelCase (如 `calculateVocabulary`, `checkFuse`)
- 常量：UPPER_SNAKE_CASE (如 `LEVEL_CONFIGS`, `FUSE_CONFIG`)

### 条件编译
使用 uni-app 条件编译处理平台差异：
```javascript
// #ifdef MP-WEIXIN
// 仅微信小程序执行的代码
// #endif

// #ifdef H5
// 仅 H5 执行的代码
// #endif
```

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 📈 性能优化

- **用户信息预加载**：App 启动时预加载，存储 Promise 供页面复用
- **本地缓存优先**：用户信息优先使用本地缓存，后台异步刷新
- **骨架屏加载**：首次进入页面显示骨架屏，避免白屏
- **分阶段加载**：区分关键/非关键数据，非关键数据延迟加载
- **图片优化**：WebP 格式 + 压缩
- **包体积优化**：Tree Shaking + 代码分割

## 💾 数据存储

### 本地存储键
- `TEST_RECORDS` - 检测记录列表
- `USER_INFO` - 用户信息
- `USER_OPENID` - 用户 OpenID（单独存储，便于快速访问）
- `PROFILE_GUIDE_SHOWN` - 个人页引导提示状态
- `VOCABULARY_NOTEBOOK` - 生字本数据

## 🐛 常见问题

### Q: 如何调试微信小程序？
A: 使用微信开发者工具，导入 `dist/dev/mp-weixin` 目录

### Q: 云函数调用失败怎么办？
A: 
1. 检查云开发环境ID是否正确配置
2. 确认云函数已正确部署
3. 查看控制台错误信息进行排查
4. 确保小程序已关联到对应的云开发环境

### Q: 如何更新云函数？
A: 
1. 修改 `src/cloudfunctions/baseFunctions/index.js`
2. 右键选择"上传并部署：云端安装依赖"
3. 等待部署完成后重新测试

### Q: 汉字数据如何更新？
A: 
- 基础汉字数据：`static/top_2500_chars_with_literacy.json`
- 汉字词语数据：`static/top_2500_chars_with_words.json`

### Q: 如何自定义测试算法？
A: 修改 `utils/levelConfig.js` 和 `utils/calculate.js` 文件

### Q: 汉字发音功能不工作？
A: 
1. 汉字发音仅支持微信小程序环境
2. 确保 `manifest.json` 中配置了微信同声传译插件（WechatSI）
3. 检查插件是否正确引入

### Q: 生字本功能如何使用？
A: 
1. 检测过程中不认识的汉字会自动加入生字本
2. 从个人页进入生字本查看
3. 点击单字进入学习模式，认识后自动移除

### Q: 环境变量配置问题？
A: 
1. 确保 `.env` 文件存在且格式正确
2. 检查 `vite.config.js` 中的环境变量注入
3. 重新编译项目：`npm run dev:mp-weixin`

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [uni-app](https://uniapp.dcloud.io/) - 跨平台应用开发框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [微信云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) - 云端一体化开发平台
- [微信同声传译](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/plugin.html) - 汉字发音插件
- [cnchar](https://github.com/theajack/cnchar) - 汉字拼音处理库
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器
- [现代汉语常用字表](https://www.zdic.net/zd/zb/cc1/) - 汉字数据来源
- [Figma](https://www.figma.com/) - UI 设计工具

## 👥 贡献者墙

https://contrib.rocks/image?repo=wangwang4git/ChineseDetection


## ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=wangwang4git/ChineseDetection&type=date&legend=top-left)](https://www.star-history.com/#wangwang4git/ChineseDetection&type=date&legend=top-left)


---

<div align="center">
  <p>如果这个项目对你有帮助，请给它一个 ⭐️</p>
  <p>Made with ❤️ for children's education</p>
</div>