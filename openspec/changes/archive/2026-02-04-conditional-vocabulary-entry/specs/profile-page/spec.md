# profile-page Spec Delta

## MODIFIED Requirements

### Requirement: 生字本入口

个人页 SHALL 在有历史检测记录时显示生字本功能入口，无记录时隐藏该入口。

#### Scenario: 有历史记录时显示生字本入口卡片

- **Given**: 用户有至少 1 条历史检测记录
- **And**: 用户生字本中有 27 个待学习汉字
- **When**: 用户进入个人页
- **Then**: 在历史记录列表下方显示生字本入口卡片
- **And**: 卡片采用白色半透明背景，圆角矩形，蓝色边框
- **And**: 左侧显示渐变圆形图标和"生字本"文字
- **And**: 右侧显示蓝色渐变胶囊按钮，内含生字数量 27

#### Scenario: 点击生字本入口

- **Given**: 用户在个人页
- **And**: 历史检测记录列表不为空
- **When**: 用户点击生字本入口卡片
- **Then**: 跳转到生字本页面 `/pages/vocabulary-notebook/vocabulary-notebook`

#### Scenario: 有历史记录但生字本为空时显示

- **Given**: 用户有历史检测记录
- **And**: 用户生字本为空（所有汉字都认识）
- **When**: 用户进入个人页
- **Then**: 生字本入口正常显示
- **And**: 生字本入口显示数字 0

#### Scenario: 无历史记录时隐藏生字本入口 [NEW]

- **Given**: 用户没有任何历史检测记录
- **When**: 用户进入个人页
- **Then**: 不显示生字本入口卡片
- **And**: 页面布局正常，无空白区域
