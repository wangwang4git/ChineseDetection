## MODIFIED Requirements

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
