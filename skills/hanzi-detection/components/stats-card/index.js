// components/stats-card/index.js
// 统计概览卡片

Component({
  data: {
    testCount: 0,
    maxScore: 0,
    avgScore: 0,
    isEmpty: true
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] stats-card created')
      const { NotificationType } = wx.modelContext

      const modelCtx = wx.modelContext.getContext(this)
      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data.result && data.result.structuredContent
        console.info('[ai-mode] stats-card 收到 Result:', sc)
        if (!sc) return
        const testCount = sc.testCount || 0
        this.setData({
          testCount: testCount,
          maxScore: sc.maxScore || 0,
          avgScore: sc.avgScore || 0,
          isEmpty: testCount === 0
        })
        console.info('[ai-mode] stats-card setData testCount=' + testCount)
      })

      const viewCtx = wx.modelContext.getViewContext(this)
      const { minHeight, maxHeight, width } = viewCtx.getDimensions()
      console.info('[ai-mode] stats-card dimensions width=' + width + ' minHeight=' + minHeight + ' maxHeight=' + maxHeight)

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info('[ai-mode] stats-card overflow overflowed=' + overflowed + ' data=' + JSON.stringify(data))
      })
      console.info('[ai-mode] stats-card overflow monitor=on')
    }
  }
})
