---
name: figma-to-uniapp
description: This skill converts Figma designs to uni-app Vue 3 Composition API code.It should be used when users want to generate cross-platform uni-app components or pages from Figma design files. The skill reads Figma designs via MCP Figma Desktop tools and outputs production-ready Vue 3 SFC code with proper uni-app conventions,rpx units, and cross-platform compatibility.
---

# Figma to uni-app Converter

This skill transforms Figma designs into production-ready uni-app Vue 3 Composition API code, supporting cross-platform deployment to WeChat Mini Program, H5, App, and other platforms.

## When to Use

This skill should be used when:

- Converting Figma designs to uni-app pages or components
- Generating Vue 3 Composition API code from design mockups
- Creating cross-platform UI components from Figma
- User mentions "Figma", "design", "mockup", or "设计稿" along with code generation
- User provides a Figma URL or asks to implement a design

## Prerequisites

- Figma Desktop app must be running
- MCP Figma Desktop server must be connected
- The target Figma file must be open in Figma Desktop

## Workflow

### Step 1: Obtain Design Information

Use MCP Figma Desktop tools to read the design:

1. **Get design context** (primary method):
   ```
   Tool: mcp_call_tool
   Server: Figma Desktop
   Tool Name: get_design_context
   Arguments: {
     "nodeId": "<node-id>",  // Optional, uses selected node if empty
     "clientLanguages": "javascript,css",
     "clientFrameworks": "vue"
   }
   ```

2. **Get screenshot** (for visual reference):
   ```
   Tool: mcp_call_tool
   Server: Figma Desktop
   Tool Name: get_screenshot
   Arguments: {
     "nodeId": "<node-id>",
     "clientLanguages": "javascript,css",
     "clientFrameworks": "vue"
   }
   ```

3. **Get design variables** (for design tokens):
   ```
   Tool: mcp_call_tool
   Server: Figma Desktop
   Tool Name: get_variable_defs
   Arguments: {
     "nodeId": "<node-id>",
     "clientLanguages": "javascript,css",
     "clientFrameworks": "vue"
   }
   ```

4. **Get metadata** (for structure overview):
   ```
   Tool: mcp_call_tool
   Server: Figma Desktop
   Tool Name: get_metadata
   Arguments: {
     "nodeId": "<node-id>",
     "clientLanguages": "javascript,css",
     "clientFrameworks": "vue"
   }
   ```

### Step 2: Extract Node ID from URL

If user provides a Figma URL, extract the node ID:

- URL format: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
- Extract `node-id` parameter, convert `1-2` to `1:2` format
- For branch URLs: `https://figma.com/design/:fileKey/branch/:branchKey/:fileName`
  - Use `branchKey` as the `fileKey`

### Step 3: Generate uni-app Code

Transform the Figma design data into Vue 3 Composition API code following these rules:

#### File Structure

Generate `.vue` Single File Components with this structure:

```vue
<template>
  <!-- uni-app compatible template -->
</template>

<script setup>
// Vue 3 Composition API
import { ref, reactive, computed, onMounted } from 'vue'

// Component logic here
</script>

<style scoped>
/* Scoped styles with rpx units */
</style>
```

#### Template Conversion Rules

| Figma Element | uni-app Component |
|---------------|-------------------|
| Frame/Group | `<view>` |
| Text | `<text>` |
| Image | `<image>` |
| Rectangle (clickable) | `<view>` or `<button>` |
| Input field | `<input>` or `<textarea>` |
| Scroll container | `<scroll-view>` |
| List | `<view>` with `v-for` |

#### Style Conversion Rules

1. **Units**: Convert all `px` values to `rpx` (multiply by 2 for 750rpx design width)
   - `width: 100px` → `width: 200rpx`
   - Exception: `1px` borders can stay as `1rpx` or `1px`

2. **Colors**: Use design tokens when available, otherwise use hex/rgba values

3. **Flexbox**: Preserve Figma's auto-layout as flexbox:
   ```css
   display: flex;
   flex-direction: column; /* or row */
   align-items: center;
   justify-content: flex-start;
   gap: 20rpx;
   ```

4. **Border Radius**: Convert to rpx
   ```css
   border-radius: 16rpx;
   ```

5. **Shadows**: Use uni-app compatible box-shadow
   ```css
   box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
   ```

6. **Fonts**: Use system fonts for cross-platform compatibility
   ```css
   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
   ```

#### Script Conversion Rules

1. **Use Composition API** with `<script setup>`:
   ```vue
   <script setup>
   import { ref, reactive, computed } from 'vue'
   
   const count = ref(0)
   const state = reactive({ name: '', loading: false })
   
   const doubleCount = computed(() => count.value * 2)
   
   function handleClick() {
     count.value++
   }
   </script>
   ```

2. **uni-app Lifecycle Hooks**:
   ```vue
   <script setup>
   import { onMounted } from 'vue'
   import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
   
   onLoad((options) => {
     // Page load with query params
   })
   
   onShow(() => {
     // Page show
   })
   
   onMounted(() => {
     // Component mounted
   })
   </script>
   ```

3. **uni-app APIs**: Use uni.* APIs for cross-platform features:
   ```javascript
   // Navigation
   uni.navigateTo({ url: '/pages/detail/detail' })
   
   // Request
   uni.request({ url: '', method: 'GET' })
   
   // Storage
   uni.setStorageSync('key', value)
   
   // UI feedback
   uni.showToast({ title: 'Success', icon: 'success' })
   ```

### Step 4: Output Files

Based on the design scope, generate appropriate files:

#### For Pages

Create in `src/pages/[page-name]/`:
```
src/pages/[page-name]/
└── [page-name].vue
```

Update `src/pages.json` to register the page:
```json
{
  "pages": [
    {
      "path": "pages/[page-name]/[page-name]",
      "style": {
        "navigationBarTitleText": "Page Title"
      }
    }
  ]
}
```

#### For Components

Create in `src/components/`:
```
src/components/
└── [ComponentName].vue
```

## Code Quality Standards

### Naming Conventions

- **Pages**: lowercase with hyphens: `user-profile.vue`
- **Components**: PascalCase: `UserCard.vue`
- **CSS classes**: kebab-case: `.user-card-container`
- **Variables/functions**: camelCase: `userName`, `handleSubmit`

### Accessibility

- Add `aria-label` or descriptive text for interactive elements
- Ensure sufficient color contrast
- Support keyboard navigation where applicable

### Performance

- Use `v-show` for frequently toggled elements
- Use `v-if` for conditionally rendered elements
- Lazy load images with `lazy-load` attribute
- Avoid inline styles, use scoped CSS

### Cross-Platform Compatibility

- Use uni-app components instead of HTML elements
- Use `rpx` units for responsive sizing
- Test on multiple platforms (H5, WeChat Mini Program)
- Avoid platform-specific APIs without conditional compilation

## Example Output

Given a Figma card design, generate:

```vue
<template>
  <view class="card">
    <image 
      class="card-image" 
      :src="imageUrl" 
      mode="aspectFill"
      lazy-load
    />
    <view class="card-content">
      <text class="card-title">{{ title }}</text>
      <text class="card-description">{{ description }}</text>
      <view class="card-footer">
        <text class="card-price">¥{{ price }}</text>
        <view class="card-button" @tap="handleBuy">
          <text class="button-text">购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['buy'])

function handleBuy() {
  emit('buy', props)
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 340rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-image {
  width: 100%;
  height: 340rpx;
}

.card-content {
  padding: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  line-height: 44rpx;
}

.card-description {
  font-size: 26rpx;
  color: #666666;
  line-height: 36rpx;
  margin-top: 8rpx;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24rpx;
}

.card-price {
  font-size: 36rpx;
  font-weight: 700;
  color: #ff4d4f;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 32rpx;
  background-color: #1890ff;
  border-radius: 32rpx;
}

.button-text {
  font-size: 28rpx;
  color: #ffffff;
}
</style>
```

## Troubleshooting

### Common Issues

1. **Cannot connect to Figma Desktop**
   - Ensure Figma Desktop app is running
   - Check MCP Figma Desktop server status
   - Verify the design file is open

2. **Node ID not found**
   - Select the target node in Figma first
   - Use `get_metadata` to explore the document structure
   - Verify the node ID format (use `:` separator)

3. **Design too complex**
   - Break down into smaller components
   - Use `get_metadata` first to understand structure
   - Generate components separately, then compose

### Platform-Specific Notes

- **WeChat Mini Program**: Some CSS properties may not be supported
- **H5**: Full CSS support, but test on mobile browsers
- **App**: Native rendering may differ slightly

## References

For detailed uni-app API documentation, refer to:
- [uni-app Official Docs](https://uniapp.dcloud.io/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
