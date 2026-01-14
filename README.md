# 汉字认字量检测小程序

> 基于 AI 全流程开发的幼儿园汉字认字量检测应用，采用科学的分层频率抽样测试策略，为儿童提供准确的识字量评估。

## 📱 项目介绍

这是一个专为幼儿园及小学低年级儿童设计的汉字认字量检测小程序。通过科学的测试算法和友好的用户界面，帮助家长和老师了解孩子的汉字识字水平。

### ✨ 核心特性

- 🎯 **科学测试算法**：基于《现代汉语常用字表》前 2500 个高频汉字
- 📊 **分层抽样策略**：6 层级智能抽样，最多测试 175 个汉字
- ⚡ **动态熔断机制**：智能停止测试，避免过度疲劳
- 🎨 **儿童友好界面**：适配幼儿园低龄用户的 UI 设计
- 📈 **历史记录追踪**：完整的测试历史和进步跟踪
- 🔄 **跨平台支持**：基于 uni-app，支持微信小程序、H5 等多平台
- ☁️ **云端数据同步**：基于微信云开发，数据安全可靠
- 🔐 **用户身份识别**：微信授权登录，个人数据隔离

## 🏗️ 技术架构

### 前端技术栈
- **框架**：uni-app + Vue 3 (Composition API)
- **UI 库**：自定义组件库
- **样式**：SCSS + rpx 响应式单位
- **状态管理**：本地存储 + Vuex
- **构建工具**：Vite

### 后端技术栈
- **云开发平台**：微信云开发
- **云函数**：Node.js + wx-server-sdk
- **数据库**：云数据库 (MongoDB)
- **存储**：云存储
- **用户认证**：微信小程序授权

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
├── api/                    # API 接口层
│   ├── character.js        # 汉字数据接口
│   ├── record.js          # 检测记录接口
│   └── index.js           # 接口统一导出
├── cloudfunctions/        # 云函数目录
│   └── baseFunctions/     # 基础云函数
│       ├── index.js       # 云函数入口文件
│       ├── package.json   # 依赖配置
│       └── config.json    # 云函数配置
├── components/            # 公共组件
│   ├── CustomTabBar.vue   # 自定义 TabBar
│   ├── RiceGrid.vue       # 米字格组件
│   ├── GradientButton.vue # 渐变按钮
│   └── CharacterCard.vue  # 汉字卡片
├── config/                # 配置文件
│   └── env.js            # 环境变量配置
├── pages/                 # 页面
│   ├── home/              # 首页
│   ├── test/              # 检测页
│   ├── result/            # 结果页
│   ├── profile/           # 个人页
│   └── history-detail/    # 历史详情页
├── utils/                 # 工具函数
│   ├── levelConfig.js     # 分层配置
│   ├── calculate.js       # 算法计算
│   ├── storage.js         # 本地存储
│   └── index.js           # 工具函数
├── styles/                # 样式文件
│   ├── variables.scss     # 变量定义
│   └── common.scss        # 公共样式
└── static/                # 静态资源
    ├── top_2500_chars_with_literacy.json  # 汉字数据
    ├── icons/             # 图标资源
    └── images/            # 图片资源
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
| L1 | 1-50 | 绝对核心字 | 全测 (1抽1) | 50字 | ×1 |
| L2 | 51-200 | 高频基础字 | 高密抽样 (3抽1) | 50字 | ×3 |
| L3 | 201-500 | 中频常用字 | 中密抽样 (10抽1) | 30字 | ×10 |
| L4 | 501-1000 | 次常用字 | 低密抽样 (20抽1) | 25字 | ×20 |
| L5 | 1001-1500 | 低频拓展字 | 稀疏抽样 (50抽1) | 10字 | ×50 |
| L6 | 1501-2500 | 生僻/书面字 | 极疏抽样 (100抽1) | 10字 | ×100 |

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
- **米字格**：传统汉字练习格，帮助儿童专注
- **渐变按钮**：吸引注意力的交互元素
- **自定义 TabBar**：符合设计稿的导航栏

## 📱 页面功能

### 首页 (HomePage)
- 展示不同年龄段认字量参考区间
- 引导用户开始检测
- 精美的渐变背景和卡片设计

### 检测页 (TestPage)
- 米字格展示待测汉字
- "我认识" / "不认识" 选择按钮
- 实时进度显示和动态熔断

### 结果页 (ResultPage)
- 预估认字量展示
- 分层详情统计
- 不认识汉字列表

### 个人页 (ProfilePage)
- 用户信息展示
- 统计数据概览
- 历史检测记录

### 历史详情页 (HistoryDetailPage)
- 单次检测完整信息
- 不认识汉字回顾
- 进步对比分析

## 🔧 开发规范

### 代码规范
- 使用 Vue 3 Composition API
- 严格的 TypeScript 类型检查
- ESLint + Prettier 代码格式化
- 详细的 JSDoc 注释

### 文件命名
- 组件：PascalCase (如 `RiceGrid.vue`)
- 页面：kebab-case (如 `home.vue`)
- 工具函数：camelCase (如 `calculateScore.js`)

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

- **懒加载**：页面和组件按需加载
- **图片优化**：WebP 格式 + 压缩
- **缓存策略**：本地存储 + 智能缓存
- **包体积优化**：Tree Shaking + 代码分割

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
A: 修改 `static/top_2500_chars_with_literacy.json` 文件

### Q: 如何自定义测试算法？
A: 修改 `utils/levelConfig.js` 和 `utils/calculate.js` 文件

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
- [现代汉语常用字表](https://www.zdic.net/zd/zb/cc1/) - 汉字数据来源
- [Figma](https://www.figma.com/) - UI 设计工具

## 👥 贡献者墙

https://contrib.rocks/image?repo=wangwang4git/ChineseDetection

![Star History Chart](https://api.star-history.com/svg?repos=wangwang4git/ChineseDetection&type=Date)

---

<div align="center">
  <p>如果这个项目对你有帮助，请给它一个 ⭐️</p>
  <p>Made with ❤️ for children's education</p>
</div>