// components/test-overview-card/index.js
// 检测概览卡片 — 展示6层级抽样信息

Component({
  data: {
    totalChars: 0,
    levelOverviews: [],
    omittedCount: 0
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] test-overview-card created')
      const { NotificationType } = wx.modelContext

      const modelCtx = wx.modelContext.getContext(this)
      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data.result && data.result.structuredContent
        console.info('[ai-mode] test-overview-card 收到 Result:', sc)
        if (!sc) return
        const allLevels = sc.levelOverviews || []
        const maxVisible = 3
        const visibleLevels = allLevels.slice(0, maxVisible)
        const omittedCount = Math.max(0, allLevels.length - maxVisible)
        this.setData({
          totalChars: sc.totalChars || 0,
          levelOverviews: visibleLevels,
          omittedCount: omittedCount
        })
        console.info('[ai-mode] test-overview-card setData totalChars=' + this.data.totalChars + ' levels=' + this.data.levelOverviews.length)
      })

      const viewCtx = wx.modelContext.getViewContext(this)
      const { minHeight, maxHeight, width } = viewCtx.getDimensions()
      console.info('[ai-mode] test-overview-card dimensions width=' + width + ' minHeight=' + minHeight + ' maxHeight=' + maxHeight)

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info('[ai-mode] test-overview-card overflow overflowed=' + overflowed + ' data=' + JSON.stringify(data))
      })
      console.info('[ai-mode] test-overview-card overflow monitor=on')
    }
  },
  methods: {
    onTapStartTest() {
      console.info('[ai-mode] test-overview-card send text 开始检测')
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [{ type: 'text', text: '开始检测' }]
      })
    }
  }
})
