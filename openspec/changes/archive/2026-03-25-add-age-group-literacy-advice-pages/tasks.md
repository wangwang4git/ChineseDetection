## 1. 路由与首页

- [x] 1.1 在 `src/pages.json` 中添加 4 个新页面路由（literacy-advice-5-6、literacy-advice-transition、literacy-advice-grade-1-2、literacy-advice-grade-3-4），均设置 `navigationStyle: "custom"`
- [x] 1.2 修改 `src/pages/home/home.vue`：将 5-6岁、幼小衔接、1-2年级、3-4年级卡片的 `tappable` 改为 `true`，为每个卡片添加 `route` 字段指向对应建议页路径
- [x] 1.3 修改首页 `@tap` 处理逻辑：将 `goToLiteracyAdvice()` 改为通用跳转方法（如 `goToAdvice(item)`），根据卡片的 `route` 字段跳转到对应页面

## 2. 5-6岁识字学习建议页面

- [x] 2.1 创建 `src/pages/literacy-advice-5-6/literacy-advice-5-6.vue`，严格对齐 4-5岁页面（`literacy-advice.vue`）的组件结构和样式体系
- [x] 2.2 根据 Figma 设计稿（320_2）填充 `adviceList` 数据（5个模块：梯度覆盖/逻辑进阶/语境浸润/评估反馈/科学复习）和 `encourageHtml` 鼓励语

## 3. 幼小衔接识字学习建议页面

- [x] 3.1 创建 `src/pages/literacy-advice-transition/literacy-advice-transition.vue`，严格对齐 4-5岁页面的组件结构和样式体系
- [x] 3.2 根据 Figma 设计稿（320_191）填充 `adviceList` 数据（5个模块：科学分层/逻辑进阶/语境实战/评估诊断/习惯养成）和 `encourageHtml` 鼓励语

## 4. 1-2年级识字学习建议页面

- [x] 4.1 创建 `src/pages/literacy-advice-grade-1-2/literacy-advice-grade-1-2.vue`，严格对齐 4-5岁页面的组件结构和样式体系
- [x] 4.2 根据 Figma 设计稿（320_384）填充 `adviceList` 数据（5个模块：目标拆解/方法进阶/语境实战/评估诊断/应用转型）和 `encourageHtml` 鼓励语

## 5. 3-4年级识字学习建议页面

- [x] 5.1 创建 `src/pages/literacy-advice-grade-3-4/literacy-advice-grade-3-4.vue`，严格对齐 4-5岁页面的组件结构和样式体系
- [x] 5.2 根据 Figma 设计稿（320_577）填充 `adviceList` 数据（5个模块：目标聚焦/方法革新/语境实战/评估监控/输出驱动）和 `encourageHtml` 鼓励语

## 6. 验证

- [x] 6.1 验证首页 5 个卡片均可正确点击跳转到对应建议页
- [x] 6.2 验证每个建议页的返回按钮可正常返回首页
- [x] 6.3 验证每个建议页的内容和样式符合对应 Figma 设计稿
