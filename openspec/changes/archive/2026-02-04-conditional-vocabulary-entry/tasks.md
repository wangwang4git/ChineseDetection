# Tasks: 生字本入口条件显示

## Implementation Tasks

### 1. 更新规范文件 [spec-delta]
- [x] 修改 `openspec/specs/profile-page/spec.md`
- [x] 新增条件显示场景：有历史记录时显示生字本入口
- [x] 新增条件隐藏场景：无历史记录时隐藏生字本入口
- **验证**：运行 `openspec validate conditional-vocabulary-entry --strict`

### 2. 修改页面模板 [code]
- [x] 在 `src/pages/profile/profile.vue` 中为生字本入口卡片添加条件渲染
- [x] 使用 `v-if="records.length > 0"` 控制显示
- [x] 保持原有样式和交互不变
- **验证**：
  - 无记录时：生字本区域不显示
  - 有记录时：生字本区域正常显示

### 3. 功能测试 [validation]
- [ ] 测试场景 1：新用户首次进入个人页，不显示生字本入口
- [ ] 测试场景 2：完成一次测试后返回个人页，显示生字本入口
- [ ] 测试场景 3：有历史记录的用户，正常显示生字本入口和数量
- **平台**：微信小程序、H5

## Dependencies

- 无外部依赖
- 任务 2 依赖任务 1 完成

## Notes

- 修改范围小，风险低
- 无需修改数据结构或存储逻辑
