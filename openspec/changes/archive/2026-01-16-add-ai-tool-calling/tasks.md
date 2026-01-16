# add-ai-tool-calling Tasks

## 任务列表

### 1. 卸载依赖
- [x] 卸载 `@tavily/core` npm 包（该库导致微信小程序加载异常）

**验收标准**：`package.json` 不包含 `@tavily/core` 依赖

### 2. 环境变量配置
- [x] 在 `src/config/env.js` 中新增 `TAVILY_API_KEY` 配置项
- [x] 在 `.env.example` 中添加 `VITE_TAVILY_API_KEY` 模板
- [x] 在本地 `.env` 文件中配置实际的 Tavily API Key

**验收标准**：`ENV_CONFIG.TAVILY_API_KEY` 能正确读取环境变量值

### 3. 修改工具定义模块
- [x] 修改 `src/utils/aiTools.js` 文件
- [x] 移除 `@tavily/core` SDK 导入
- [x] 实现 `tavilySearch` 函数，使用 `uni.request` 调用 Tavily HTTP API
- [x] 更新 `search_web` 工具的 `fn` 函数使用 HTTP 请求
- [x] 保持错误处理逻辑

**验收标准**：工具能通过小程序 HTTP 请求调用 Tavily API 并返回搜索结果

### 4. 集成工具调用到 AI 助手页
- [x] 在 `ai-assistant.vue` 中导入工具模块和环境配置
- [x] 修改 `sendToAI` 函数，构建 tools 数组
- [x] 条件判断：仅当 TAVILY_API_KEY 存在时注册工具
- [ ] 测试工具调用流程：用户提问触发搜索 → AI 调用工具 → 返回增强回复

**验收标准**：
- 询问"最新的幼儿识字教学方法有哪些"时，AI 能调用搜索工具并基于搜索结果回复
- TAVILY_API_KEY 未配置时，AI 正常工作（无工具调用）

### 5. 更新规范文档
- [x] 在 `specs/ai-assistant/spec.md` 中更新为 HTTP API 调用方式

**验收标准**：`openspec validate add-ai-tool-calling --strict` 通过

## 任务依赖关系

```
1. 卸载依赖
       │
       ▼
2. 环境变量配置（已完成）
       │
       ▼
3. 修改工具定义模块
       │
       ▼
4. 集成工具调用到 AI 助手页
       │
       ▼
5. 更新规范文档
```

## 可并行任务

- 任务 2 和任务 5（规范文档）可并行进行
