// components/result-card/index.js
// 检测结果卡片 — 展示认字量估算结果

Component({
  data: {
    estimatedVocabulary: 0,
    totalTestedCount: 0,
    knownCount: 0,
    unknownCount: 0,
    encouragementMessage: '',
    unknownChars: []
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] result-card created')
      const { NotificationType } = wx.modelContext

      const modelCtx = wx.modelContext.getContext(this)
      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data.result && data.result.structuredContent
        console.info('[ai-mode] result-card 收到 Result:', sc)
        if (!sc) return
        this._recordId = sc.recordId || ''
        this.setData({
          estimatedVocabulary: sc.estimatedVocabulary || 0,
          totalTestedCount: sc.totalTestedCount || 0,
          knownCount: sc.knownCount || 0,
          unknownCount: sc.unknownCount || 0,
          encouragementMessage: sc.encouragementMessage || '',
          unknownChars: (sc.unknownChars || []).slice(0, 15)
        })
        console.info('[ai-mode] result-card setData vocab=' + this.data.estimatedVocabulary + ' recordId=' + this._recordId)
      })

      const viewCtx = wx.modelContext.getViewContext(this)
      const { minHeight, maxHeight, width } = viewCtx.getDimensions()
      console.info('[ai-mode] result-card dimensions width=' + width + ' minHeight=' + minHeight + ' maxHeight=' + maxHeight)

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info('[ai-mode] result-card overflow overflowed=' + overflowed + ' data=' + JSON.stringify(data))
      })
      console.info('[ai-mode] result-card overflow monitor=on')
    }
  },
  methods: {
    _sendUserAction(text, name, args) {
      console.info('[ai-mode] result-card send api/call name=' + name + ' args=' + JSON.stringify(args))
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [
          { type: 'text', text: text },
          { type: 'api/call', data: { name: name, arguments: args } }
        ]
      })
    },
    onTapViewHistory() {
      this._sendUserAction('查看历史记录', 'getRecordList', {})
    }
  }
})
