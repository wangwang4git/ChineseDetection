// components/record-detail-card/index.js
// 记录详情卡片

Component({
  data: {
    testTime: '',
    estimatedVocabulary: 0,
    totalTestedCount: 0,
    levelDetails: [],
    omittedLevels: 0,
    unknownChars: []
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] record-detail-card created')
      const { NotificationType } = wx.modelContext

      const modelCtx = wx.modelContext.getContext(this)
      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data.result && data.result.structuredContent
        console.info('[ai-mode] record-detail-card 收到 Result:', sc)
        if (!sc) return
        this._recordId = sc.id || ''
        this._isFused = !!sc.isFused
        const allLevels = sc.levelDetails || []
        const maxLevels = 3
        const omittedLevels = Math.max(0, allLevels.length - maxLevels)
        this.setData({
          testTime: sc.testTime || '',
          estimatedVocabulary: sc.estimatedVocabulary || 0,
          totalTestedCount: sc.totalTestedCount || 0,
          levelDetails: allLevels.slice(0, maxLevels),
          omittedLevels: omittedLevels,
          unknownChars: (sc.unknownChars || []).slice(0, 8)
        })
        console.info('[ai-mode] record-detail-card setData vocab=' + this.data.estimatedVocabulary)
      })

      const viewCtx = wx.modelContext.getViewContext(this)
      const { minHeight, maxHeight, width } = viewCtx.getDimensions()
      console.info('[ai-mode] record-detail-card dimensions width=' + width + ' minHeight=' + minHeight + ' maxHeight=' + maxHeight)

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info('[ai-mode] record-detail-card overflow overflowed=' + overflowed + ' data=' + JSON.stringify(data))
      })
      console.info('[ai-mode] record-detail-card overflow monitor=on')
    }
  },
  methods: {
    _sendUserAction(text, name, args) {
      console.info('[ai-mode] record-detail-card send api/call name=' + name + ' args=' + JSON.stringify(args))
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [
          { type: 'text', text: text },
          { type: 'api/call', data: { name: name, arguments: args } }
        ]
      })
    },
    onTapBackToList() {
      this._sendUserAction('返回记录列表', 'getRecordList', {})
    }
  }
})
