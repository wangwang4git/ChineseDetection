# uni-app Vue 3 Composition API Reference

## Component Template

### Basic Page Template

```vue
<template>
  <view class="page-container">
    <!-- Page content -->
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onLoad, onShow, onReady, onHide, onUnload } from '@dcloudio/uni-app'

// Reactive state
const loading = ref(false)
const list = ref([])
const form = reactive({
  name: '',
  phone: ''
})

// Computed properties
const isValid = computed(() => form.name && form.phone)

// Lifecycle hooks
onLoad((options) => {
  console.log('Page loaded with options:', options)
})

onShow(() => {
  console.log('Page shown')
})

onMounted(() => {
  fetchData()
})

// Methods
async function fetchData() {
  loading.value = true
  try {
    const res = await uni.request({
      url: 'https://api.example.com/data',
      method: 'GET'
    })
    list.value = res.data
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'error' })
  } finally {
    loading.value = false
  }
}

function handleSubmit() {
  if (!isValid.value) {
    uni.showToast({ title: '请填写完整', icon: 'none' })
    return
  }
  // Submit logic
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24rpx;
}
</style>
```

### Basic Component Template

```vue
<template>
  <view class="component-wrapper" @tap="handleTap">
    <slot name="header"></slot>
    <view class="component-content">
      <text>{{ title }}</text>
    </view>
    <slot name="footer"></slot>
  </view>
</template>

<script setup>
import { computed } from 'vue'

// Props definition
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

// Emits definition
const emit = defineEmits(['tap', 'change'])

// Computed
const sizeClass = computed(() => `size-${props.size}`)

// Methods
function handleTap() {
  if (props.disabled) return
  emit('tap')
}
</script>

<style scoped>
.component-wrapper {
  /* styles */
}
</style>
```

## uni-app Components Reference

### View Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `<view>` | Container component | `hover-class`, `hover-start-time` |
| `<scroll-view>` | Scrollable container | `scroll-x`, `scroll-y`, `scroll-top` |
| `<swiper>` | Carousel/slider | `autoplay`, `interval`, `circular` |
| `<movable-view>` | Draggable view | `direction`, `x`, `y` |

### Basic Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `<text>` | Text display | `selectable`, `space`, `decode` |
| `<rich-text>` | Rich text | `nodes`, `space` |
| `<progress>` | Progress bar | `percent`, `stroke-width`, `activeColor` |
| `<icon>` | Icon | `type`, `size`, `color` |

### Form Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `<input>` | Input field | `type`, `value`, `placeholder`, `maxlength` |
| `<textarea>` | Multi-line input | `value`, `placeholder`, `maxlength`, `auto-height` |
| `<button>` | Button | `type`, `size`, `disabled`, `loading` |
| `<checkbox>` | Checkbox | `value`, `checked`, `disabled` |
| `<radio>` | Radio button | `value`, `checked`, `disabled` |
| `<switch>` | Toggle switch | `checked`, `type`, `color` |
| `<slider>` | Slider | `min`, `max`, `value`, `step` |
| `<picker>` | Picker | `mode`, `range`, `value` |

### Media Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `<image>` | Image | `src`, `mode`, `lazy-load` |
| `<video>` | Video player | `src`, `autoplay`, `controls` |
| `<audio>` | Audio player | `src`, `loop`, `controls` |

### Navigator Component

```vue
<navigator url="/pages/detail/detail?id=1" open-type="navigate">
  <text>Go to detail</text>
</navigator>
```

## Style Guidelines

### Responsive Units

```css
/* Use rpx for responsive sizing (750rpx = screen width) */
.container {
  width: 750rpx;      /* Full width */
  padding: 24rpx;     /* ~12px on 375px screen */
  font-size: 28rpx;   /* ~14px on 375px screen */
  border-radius: 16rpx;
}

/* Use px for fixed sizes (borders, thin lines) */
.divider {
  height: 1px;
  background-color: #eee;
}
```

### Common Layout Patterns

```css
/* Flex row with space between */
.row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

/* Flex column centered */
.column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Fixed bottom bar */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #fff;
}

/* Safe area padding */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Color Variables

```css
/* Recommended color palette */
:root {
  /* Primary colors */
  --primary-color: #1890ff;
  --primary-light: #40a9ff;
  --primary-dark: #096dd9;
  
  /* Functional colors */
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  
  /* Neutral colors */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-placeholder: #999999;
  --border-color: #e8e8e8;
  --background-color: #f5f5f5;
}
```

## API Reference

### Navigation

```javascript
// Navigate to page
uni.navigateTo({
  url: '/pages/detail/detail?id=1'
})

// Redirect (replace current page)
uni.redirectTo({
  url: '/pages/home/home'
})

// Switch tab
uni.switchTab({
  url: '/pages/index/index'
})

// Go back
uni.navigateBack({
  delta: 1
})
```

### Request

```javascript
// GET request
const res = await uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: { page: 1 }
})

// POST request
const res = await uni.request({
  url: 'https://api.example.com/submit',
  method: 'POST',
  header: {
    'Content-Type': 'application/json'
  },
  data: { name: 'test' }
})
```

### Storage

```javascript
// Sync storage
uni.setStorageSync('token', 'xxx')
const token = uni.getStorageSync('token')
uni.removeStorageSync('token')

// Async storage
await uni.setStorage({ key: 'token', data: 'xxx' })
const { data } = await uni.getStorage({ key: 'token' })
```

### UI Feedback

```javascript
// Toast
uni.showToast({
  title: '操作成功',
  icon: 'success',  // 'success' | 'loading' | 'error' | 'none'
  duration: 2000
})

// Loading
uni.showLoading({ title: '加载中...' })
uni.hideLoading()

// Modal
const { confirm } = await uni.showModal({
  title: '提示',
  content: '确定要删除吗？',
  confirmText: '确定',
  cancelText: '取消'
})

// Action sheet
const { tapIndex } = await uni.showActionSheet({
  itemList: ['选项1', '选项2', '选项3']
})
```

### System Info

```javascript
// Get system info
const systemInfo = uni.getSystemInfoSync()
const { windowWidth, windowHeight, platform, statusBarHeight } = systemInfo

// Get device info
const deviceInfo = uni.getDeviceInfo()
```
