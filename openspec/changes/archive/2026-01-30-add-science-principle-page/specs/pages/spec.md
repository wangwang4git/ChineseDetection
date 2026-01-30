# Spec Delta: pages

对首页页面规范的修改

## MODIFIED Requirements

### Requirement: 首页 (HomePage)

首页副标题区域 MUST 修改为两行显示，增加科学原理页面入口链接。

#### Scenario: 副标题显示两行

- Given 用户在首页
- Then 副标题区域显示两行：
  - 第一行："一起来测测认识多少字吧！"（颜色 #6E11B0）
  - 第二行："科学原理查看请参考👉"（颜色 #155DFC，可点击）

#### Scenario: 点击跳转科学原理页

- Given 用户在首页
- When 用户点击"科学原理查看请参考👉"
- Then 跳转到科学原理页面
