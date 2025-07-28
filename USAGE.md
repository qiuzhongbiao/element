# 条码输入框组件使用说明

## 组件概述

这是一个基于 Element UI 2.15.1 和 Vue 2 的条码输入框组件，专门为条码扫描和输入场景设计。

## 主要功能

### ✅ 已实现功能

1. **自动聚焦** - 支持组件挂载后自动聚焦到输入框
2. **快速清空** - 支持点击清空按钮或按 Escape 键清空
3. **一键复制** - 支持 Ctrl+C 快捷键复制到剪贴板
4. **输入限制** - 支持最大长度限制和条码格式验证
5. **历史记录** - 支持按条码类型分别存储历史记录
6. **防抖扫描** - 支持扫描枪快速输入场景
7. **视觉反馈** - 输入框边框颜色根据验证状态变化
8. **问号提示** - 显示条码格式说明气泡

### 📋 条码类型支持

- **包体码** (package): 2位字母 + 8位数字，如：AB12345678
- **电芯码** (battery): 3位字母 + 9位数字，如：ABC123456789
- **模组码** (module): 2位字母 + 10位数字，如：MD1234567890
- **客户码** (customer): 2位字母 + 6位数字，如：CU123456
- **自定义条码** (custom): 可自定义格式

## 文件结构

```
packages/barcode-input/
├── src/
│   └── barcode-input.vue    # 组件源码
├── index.js                 # 组件入口文件
├── package.json             # 组件配置
└── README.md               # 详细文档

examples/
└── barcode-input-demo.vue   # 组件示例
```

## 快速开始

### 1. 基础使用

```vue
<template>
  <el-barcode-input
    v-model="barcode"
    barcode-type="package"
    placeholder="请输入包体码"
    clearable
    auto-focus
  />
</template>

<script>
export default {
  data() {
    return {
      barcode: ''
    };
  }
};
</script>
```

### 2. 完整功能使用

```vue
<template>
  <el-barcode-input
    v-model="barcode"
    barcode-type="battery"
    placeholder="请输入电芯码"
    clearable
    auto-focus
    :show-char-count="true"
    :show-help="true"
    :enable-history="true"
    :enable-scan-debounce="true"
    :scan-debounce-time="100"
    @scan="handleScan"
    @scan-complete="handleScanComplete"
    @enter="handleEnter"
    @copy="handleCopy"
    @clear="handleClear"
    @history-select="handleHistorySelect"
  />
</template>

<script>
export default {
  data() {
    return {
      barcode: ''
    };
  },
  methods: {
    handleScan(value) {
      console.log('扫描中:', value);
    },
    handleScanComplete(value) {
      console.log('扫描完成:', value);
    },
    handleEnter(value) {
      console.log('按回车:', value);
    },
    handleCopy(value) {
      console.log('复制:', value);
    },
    handleClear() {
      console.log('清空');
    },
    handleHistorySelect(value) {
      console.log('选择历史记录:', value);
    }
  }
};
</script>
```

### 3. 自定义条码格式

```vue
<template>
  <el-barcode-input
    v-model="barcode"
    barcode-type="custom"
    :barcode-format="customFormat"
    placeholder="请输入自定义条码"
  />
</template>

<script>
export default {
  data() {
    return {
      barcode: '',
      customFormat: {
        pattern: /^[A-Z]{4}\d{6}$/,
        expectedLength: 10,
        description: [
          { range: '1-4', meaning: '自定义前缀' },
          { range: '5-10', meaning: '序列号' }
        ]
      }
    };
  }
};
</script>
```

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl + C | 复制当前值到剪贴板 |
| Ctrl + V | 粘贴内容 |
| Enter | 触发 enter 事件 |
| Escape | 清空输入框 |

## 事件说明

| 事件名 | 说明 | 触发时机 |
|--------|------|----------|
| scan | 扫描中 | 输入过程中触发 |
| scan-complete | 扫描完成 | 扫描完成后触发 |
| enter | 回车 | 按回车键时触发 |
| copy | 复制 | 复制到剪贴板时触发 |
| clear | 清空 | 清空输入框时触发 |
| history-select | 选择历史记录 | 点击历史记录项时触发 |

## 样式特性

- 输入框边框颜色根据验证状态变化（绿色=有效，红色=无效）
- 字符数显示，超出预期长度时变红
- 帮助提示气泡显示条码格式说明
- 历史记录下拉框样式美观

## 注意事项

1. **浏览器兼容性**: 复制功能需要浏览器支持 Clipboard API
2. **存储方式**: 历史记录使用 localStorage 存储
3. **扫描设备**: 防抖扫描功能适用于扫描枪等快速输入设备
4. **自定义格式**: 自定义条码格式需要提供正确的正则表达式

## 示例运行

要查看完整示例，请运行：

```bash
# 在 Element UI 项目中
npm run dev
```

然后访问示例页面查看组件的完整功能演示。

## 技术栈

- Vue 2.x
- Element UI 2.15.1
- SCSS
- JavaScript ES6+

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件！