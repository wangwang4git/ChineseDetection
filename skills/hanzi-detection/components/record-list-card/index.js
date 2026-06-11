// components/record-list-card/index.js
// 历史记录列表卡片

Component({
  data: {
    totalCount: 0,
    visibleRecords: [],
    omittedCount: 0
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] record-list-card created')
      const { NotificationType } = wx.modelContext

      const modelCtx = wx.modelContext.getContext(this)
      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data.result && data.result.structuredContent
        console.info('[ai-mode] record-list-card 收到 Result:', sc)
        if (!sc) return
        const allRecords = (sc.records || []).map(r => ({
          id: r.id,
          testTime: r.testTime || '',
          estimatedVocabulary: r.estimatedVocabulary || 0,
          totalTestedCount: r.totalTestedCount || 0,
          unknownCharCount: r.unknownCharCount || 0
        }))

        // 最多展示3条
        const maxVisible = 3
        const visibleRecords = allRecords.slice(0, maxVisible)
        const omittedCount = allRecords.length - visibleRecords.length

        this._records = allRecords
        this._allRecords = allRecords
        this.setData({
          totalCount: sc.totalCount || allRecords.length,
          visibleRecords,
          omittedCount
        })
        console.info('[ai-mode] record-list-card setData total=' + allRecords.length + ' visible=' + visibleRecords.length + ' omitted=' + omittedCount)
      })

      const viewCtx = wx.modelContext.getViewContext(this)
      const { minHeight, maxHeight, width } = viewCtx.getDimensions()
      console.info('[ai-mode] record-list-card dimensions width=' + width + ' minHeight=' + minHeight + ' maxHeight=' + maxHeight)

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info('[ai-mode] record-list-card overflow overflowed=' + overflowed + ' data=' + JSON.stringify(data))
      })
      console.info('[ai-mode] record-list-card overflow monitor=on')
    }
  },
  methods: {
    _sendUserAction(text, name, args) {
      console.info('[ai-mode] record-list-card send api/call name=' + name + ' args=' + JSON.stringify(args))
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [
          { type: 'text', text: text },
          { type: 'api/call', data: { name: name, arguments: args } }
        ]
      })
    },
    onTapRecord(e) {
      const { id } = e.currentTarget.dataset
      if (id) {
        this._sendUserAction('查看检测详情', 'getRecordDetail', { id: String(id) })
      }
    },
    onTapViewAll() {
      const viewCtx = wx.modelContext.getViewContext(this)
      // 打开个人中心页面展示全部记录
      wx.setStorageSync('skills_hanzi_detection_allRecords', this._allRecords)
      viewCtx.openDetailPage({ url: '/pages/profile/profile?fromAI=1' })
      console.info('[ai-mode] record-list-card openDetailPage url=/pages/profile/profile')
    },
    onTapStatistics() {
      this._sendUserAction('查看检测统计', 'getStatistics', {})
    }
  }
})
