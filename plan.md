## 项目介绍

基于AI全流程，实现幼儿园汉字认字量小程序。

## 项目计划

### 需求调研

使用大模型辅助方案调研，使用`豆包`、`元宝`、`Gemini`。

#### 1. 检测字表

基于《现代汉语常用字表》及语料库大数据（如国家语委现代汉语语料库），取前2500个常用字，在现代汉语语料库出现累积频率98.5%。

参考：[cn-corpus](https://github.com/bedlate/cn-corpus)、[《现代汉语常用字表》常用字(2500字)](https://www.zdic.net/zd/zb/cc1/)

#### 2. 检测算法1

基于**分层频率抽样测试策略**，识字量计算公式：

$$W = N_{L1} + (N_{L2} \times 3) + (N_{L3} \times 10) + (N_{L4} \times 20) + (N_{L5} \times 50) + (N_{L6} \times 100)$$
$N_{Lx}$ 代表在第 $x$ 层级中实际认读正确的字数。

**动态熔断机制（Stop Rule）**
> 不要等到所有字测完！
> 规则： 在任何一个层级（L1-L6），如果孩子连续5个测试字不认识，或者该层级总错误率超过80%，立即停止测试。
> 处理： 假设该层级剩余未测字及后续所有层级的字都不认识。

| 层级 | 字频排名 | 描述 | 抽样方式 | 测试字数 | 权重 |
|------|---------|------|---------|---------|------|
| L1 | 1-50 | 绝对核心字 | 全测+随机打乱 | 50字 | ×1 |
| L2 | 51-200 | 高频基础字 | 随机抽样 | 50字 | ×3 |
| L3 | 201-500 | 中频常用字 | 随机抽样 | 30字 | ×10 |
| L4 | 501-1000 | 次常用字 | 随机抽样 | 25字 | ×20 |
| L5 | 1001-1500 | 低频拓展字 | 随机抽样 | 10字 | ×50 |
| L6 | 1501-2500 | 生僻/书面字 | 随机抽样 | 10字 | ×100 |

#### 3. 检测算法2

基于检测字表，采用**动态抽样测试**，从整个字表中随机抽取汉字进行测试，记录下每个测试字的结果（正确/错误），当满足预设的终止条件时就会停止。

测试停止时，算法会找出两个关键汉字，这两个字大致标定了孩子识字能力的模糊边界。
* 第一测试字：孩子识别正确的测试字中字频最低的（即最难的那个字）；
* 第二测试字：孩子识别错误的测试字中字频最高的（即最简单但却不认识的那个字）；

选取这两个字之间的某个目标测试字，利用预设的该字在字表中的识字率（这个识字率与字频负相关），通过公式进行计算：识字量 ≈ 目标测试字的预估识字率 × 字表总字数。
> 识字率计算基于检测字表近似换算；最后一个字“敞”，字频最低，rank_id=2500，对应识字率为2500/2500=100%，最高；第一个字“的”，字频最高，rank_id=1，对应识字率为1/2500=0.04%，最低。

**终止条件**
> 当连续认错一定数量的字，或者总的测试次数达到要求后，或者测试时间达到10-15分钟。

### 需求细化

1️⃣首页

  首页展示不同年龄段推荐的汉字认字量区间（如下列举），下方展示“开始检测吧！”按钮。

    4-5岁，目标认字量50-100
    5-6岁，目标认字量200-300
    幼小衔接，目标认字量300-500
    1～2年级，目标认字量1600左右
    3～4年级，目标认字量2500左右

2️⃣检测页

  点击“开始检测吧！”按钮，进入检测页面，居中黑体展示一个汉字，使用米字格样式展示汉字，下方展示“我认识”或“不认识”按钮，用于记录用户是否认识该汉字。

3️⃣结果页

  检测结束，展示认字量检测结果页，居中大号字体展示计算的识字量，下方展示记录的用户不认识的汉字列表，下方展示“结束检测”按钮，点击返回首页。

4️⃣个人页

  个人页展示用户头像、账号，历史认字量检测成绩。

5️⃣历史认字量检测详情页

  点击个人页历史认字量检测记录，进入历史认字量检测详情页面，展示记录的不认识的汉字列表，左上角展示返回按钮，点击返回个人页。

### 原型设计

使用AI辅助原型设计，使用`Figma Make`。

提示词参考：

```
我需要设计一个小程序，用于幼儿园汉字认字量检测，包含页面：
* 首页，首页展示不同年龄段推荐的汉字认字量区间（如下列举），下方展示“开始检测吧！”按钮；
    4-5岁，目标认字量50-100
    5-6岁，目标认字量200-300
    幼小衔接，目标认字量300-500
    1～2年级，目标认字量1600左右
    3～4年级，目标认字量2500左右
* 点击“开始检测吧！”按钮，进入检测页面，居中黑体展示一个汉字，使用米字格样式展示汉字，下方展示“我认识”或“不认识”按钮，用于记录用户是否认识该汉字；
* 检测结束，展示认字量检测页面，居中大号字体展示计算的识字量，下方展示记录的用户不认识的汉字列表，下方展示“结束检测”按钮，点击返回首页；
* 个人页，个人页展示用户头像、账号，历史认字量检测成绩；
* 点击个人页历史认字量检测记录，进入历史认字量检测详情页面，展示记录的不认识的汉字列表，左上角展示返回按钮，点击返回个人页；

UI风格：适配幼儿园低龄用户风格，参考上传图片风格！！
```

实现参考：[Figma Make原型设计](https://www.figma.com/make/K1cQSppPrXDCQosKJHo0rM/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?fullscreen=1&t=kHgXep5NcHs5pRXf-1)、[Figma设计稿](https://www.figma.com/design/WnWhtqvnDK8QVKWL9isb75/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?node-id=0-1&t=STw25JjQ21axAzHI-1)

### 技术框架

基于小程序开发框架`uni-app`，搭配`微信开发者工具`，实现小程序开发。

1. 手动创建`uni-app`空项目；
```bash
npx degit dcloudio/uni-preset-vue#vite my-vue3-project
# 进入目录my-vue3-project
npm install
```
2. 基于`OpenSpec`AI开发框架，初始化空项目；
3. 基于SDD研发模式生成代码；
4. 基于`uni-app`框架，编译小程序代码；
```bash
# 微信小程序开发构建
npm run dev:mp-weixin
# 微信小程序生产构建
npm run build:mp-weixin
```
5. 使用`微信开发者工具`进行调试和发布，打开`dist/dev`或者`dist/build`目录；
6. `uni-app`框架下微信云开发，`manifest.json`、`vite.config.js`需要单独配置，可以[参考](https://uniapp.dcloud.net.cn/collocation/manifest.html#cloudfunctionroot);
```javascript
// manifest.json
"mp-weixin":{
  // ...
   "cloudfunctionRoot": "cloudfunctions/", // 配置云开发目录
  // ...
}
```
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import fs from 'fs-extra' // fs-extra 为第三方依赖，需要安装
import path from 'path'

const plugins = [uni()]

// 仅微信小程序生效
if (process.env.UNI_PLATFORM === 'mp-weixin') {
  plugins.push({
    name: 'copy-cloudfunctions',
    buildStart() {
      fs.copySync(
        path.join(process.env.UNI_INPUT_DIR, 'cloudfunctions'),
        path.join(process.env.UNI_OUTPUT_DIR, 'cloudfunctions')
      )
    },
  })
}

export default defineConfig({
  plugins,
})
```

参考：[uni-app](https://uniapp.dcloud.net.cn/)、[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)

### 技术实现

基于`OpenSpec`框架，使用SDD研发模式，使用的相关脚手架：
1. OpenSpec
2. OpenSpec项目初始化Skill：openspec-setup，用户级
3. Figma设计稿读取MCP：Figma Desktop，用户级
4. 创建Skill的Skill：skill-creator，用户级
4. 基于Figma设计稿转uni-app Skill：figma-to-uniapp，项目级

需求提案提示词参考：

```
/openspec:proposal
1. 读取openspec/project.md，了解项目概览。
2. 你作为一位精通 Vue 3 组合式 API 的资深 uni-app 跨平台应用开发专家，在开发过程中需兼顾微信小程序兼容性，通过 #ifdef 和 #endif 条件编译处理平台差异，严格遵循 uni-app 最佳实践与性能优化建议，重视移动端适配和交互体验，并保证代码具备清晰、规范的注释。
3. 后端数据接口按业务模块对应命名，方法名采用「动词 + 名词」形式（如 addUser、getOrderList），且每个方法需做好完整的错误处理，并返回 errCode、errMsg、data 标准化格式，测试数据使用Mock机制。
4. 微信小程序包括5个页面，分别是“首页”、“检测页”、“结果页”、“个人页”和“历史认字量检测详情页”，基于Figma设计稿生成前端代码。
5. 首页：首页展示不同年龄段推荐的汉字认字量区间（如下列举），下方展示“开始检测吧！”按钮。
    4-5岁，目标认字量50-100
    5-6岁，目标认字量200-300
    幼小衔接，目标认字量300-500
    1～2年级，目标认字量1600左右
    3～4年级，目标认字量2500左右
首页Figma设计稿：https://www.figma.com/design/WnWhtqvnDK8QVKWL9isb75/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?node-id=1-201&m=dev
6. 检测页：点击“开始检测吧！”按钮，进入检测页面，居中黑体展示一个汉字，使用米字格样式展示汉字，下方展示“我认识”或“不认识”按钮，用于记录用户是否认识该汉字。
检测页Figma设计稿：https://www.figma.com/design/WnWhtqvnDK8QVKWL9isb75/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?node-id=1-374&m=dev
7. 结果页：检测结束，展示认字量检测结果页，居中大号字体展示计算的识字量，下方展示记录的用户不认识的汉字列表，下方展示“结束检测”按钮，点击返回首页。
结果页Figma设计稿：https://www.figma.com/design/WnWhtqvnDK8QVKWL9isb75/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?node-id=1-400&m=dev
8. 个人页：个人页展示用户头像、账号，历史认字量检测成绩。
个人页Figma设计稿：https://www.figma.com/design/WnWhtqvnDK8QVKWL9isb75/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?node-id=1-300&m=dev
9. 历史认字量检测详情页：点击个人页历史认字量检测记录，进入历史认字量检测详情页面，展示记录的不认识的汉字列表，左上角展示返回按钮，点击返回个人页。
历史认字量检测详情页Figma设计稿：https://www.figma.com/design/WnWhtqvnDK8QVKWL9isb75/%E6%B1%89%E5%AD%97%E8%AE%A4%E5%AD%97%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B0%8F%E7%A8%8B%E5%BA%8F?node-id=1-430&m=dev
```

```
/openspec:proposal
基于/static/top_2500_chars_with_literacy.json文件，修正认字量算法，修正提案相关内容，包括数据模型等等！
1. json文件内容为前2500个常用汉字，rank_id表示排序，char表示汉字，frequency表示该汉字在中文语料出现频率，frequency_cumulative表示该汉字之前（包括该汉字）在中文语料出现累积频率；
2. 基于分层频率抽样测试策略，识字量计算公式：
$$W = N_{L1} + (N_{L2} \times 3) + (N_{L3} \times 10) + (N_{L4} \times 20) + (N_{L5} \times 50) + (N_{L6} \times 100)$$
$N_{Lx}$ 代表在第 $x$ 层级中实际认读正确的字数
3. 分层策略：
|层级|字频排名范围|描述|覆盖率(约)|测试策略|抽样间隔|测试字数|
| -- | -- | -- | -- | -- | -- | -- |
|L1|第 1 - 50 字|绝对核心字|30%|全测|1抽1|50字|
|L2|第 51 - 200 字|高频基础字|55%|高密抽样|3抽1|50字|
|L3|第 201 - 500 字|中频常用字|75%|中密抽样|10抽1|30字|
|L4|第 501 - 1000 字|次常用字|88%|低密抽样|20抽1|25字|
|L5|第 1001 - 1500 字|低频拓展字|94%|稀疏抽样|50抽1|10字|
|L6|第 1501 - 2500 字|生僻/书面字|99%|极疏抽样|100抽1|10字|
|合计|1-2500|-|-|-|-|175字|
4. 设定动态熔断机制，不要等到所有字测完：
规则： 在任何一个层级（L1-L6），如果孩子连续5个测试字不认识，或者该层级总错误率超过80%，立即停止测试。
处理： 假设该层级剩余未测字及后续所有层级的字都不认识。
```

需求编码提示词参考：
```
/openspec:apply build-chinese-detection-app
```

fix运行错误提示词参考：
```
点击首页开始检测吧，会出现如下错误，请仔细分析后修复！
加载汉字数据失败: Error: module 'static/top_2500_chars_with_literacy.json.js' is not defined, require args is '../static/top_2500_chars_with_literacy.json'
```

需求归档提示词参考：
```
/openspec:archive build-chinese-detection-app
```

### 自测验证

借助微信开发者工具验证。

## TODOList
- [x] 前端布局对齐Figma设计稿优化
- [x] 前端交互增加动画效果
- [x] 小程序上架
- [x] 后端云开发服务搭建部署
- [x] 增加汉字发音
- [x] 增加汉字组词与发音
- [x] 增加AI相关能力
- [x] 语义化版本规范
- [ ] 添加汉字笔画
- [ ] 添加读音展示
- [ ] 添加生字本

## 技术选型

- 前端形态：小程序
- 小程序开发框架：uni-app
- 前端框架：Vue.js
- 后端服务：微信云开发
