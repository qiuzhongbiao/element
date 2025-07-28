# BarcodeInput 条码输入框

条码输入框组件是基于 Element UI Input 组件扩展的专用输入框，专门用于条码扫描和输入，支持多种条码类型的格式验证。

## 功能特性

- ✅ **自动聚焦**: 支持页面加载时自动聚焦到输入框
- ✅ **快速清空**: 一键清空输入内容，支持快捷键 ESC
- ✅ **一键复制**: 支持一键复制条码内容，兼容不同浏览器
- ✅ **输入限制**: 根据条码类型自动限制输入格式
- ✅ **历史记录**: 自动保存扫描历史，支持快速选择
- ✅ **防抖扫描**: 智能识别扫码枪输入，防抖处理避免误触发
- ✅ **视觉反馈**: 实时显示输入状态，不同颜色标识有效性
- ✅ **格式校验**: 内置多种条码类型的正则校验
- ✅ **字符计数**: 实时显示字符数和格式要求
- ✅ **帮助提示**: 气泡提示显示条码格式说明
- ✅ **兼容性**: 完全兼容 Element UI Input 的所有属性、方法和事件

## 基础用法

```vue
<template>
  <el-barcode-input
    v-model="packageCode"
    barcode-type="package"
    placeholder="请输入包体码"
    autofocus
  />
</template>

<script>
export default {
  data() {
    return {
      packageCode: ''
    };
  }
};
</script>
```

## 条码类型

组件内置了四种常用的条码类型：

### 包体码 (package)
- **格式**: 16位大写字母和数字
- **正则**: `/^[A-Z0-9]{16}$/`
- **结构**:
  - 1-4位: 生产厂商代码
  - 5-8位: 产品型号代码
  - 9-12位: 生产日期代码
  - 13-16位: 流水号

### 电芯码 (cell)
- **格式**: 12位大写字母和数字
- **正则**: `/^[A-Z0-9]{12}$/`
- **结构**:
  - 1-3位: 电芯厂商代码
  - 4-6位: 电芯型号代码
  - 7-10位: 生产批次号
  - 11-12位: 检验码

### 模组码 (module)
- **格式**: 14位大写字母和数字
- **正则**: `/^[A-Z0-9]{14}$/`
- **结构**:
  - 1-2位: 模组类型代码
  - 3-6位: 生产厂商代码
  - 7-10位: 生产日期代码
  - 11-14位: 序列号

### 客户码 (customer)
- **格式**: 8-20位大写字母和数字
- **正则**: `/^[A-Z0-9]{8,20}$/`
- **结构**:
  - 1-4位: 客户代码
  - 5-8位: 产品代码
  - 9-*位: 自定义字段

## 自定义规则

```vue
<template>
  <el-barcode-input
    v-model="customCode"
    :custom-rule="customRule"
    placeholder="请输入自定义条码"
  />
</template>

<script>
export default {
  data() {
    return {
      customCode: '',
      customRule: {
        name: '序列号码',
        pattern: /^SN[0-9]{10}$/,
        length: { min: 12, max: 12 },
        format: [
          { range: '1-2', description: '产品标识' },
          { range: '3-12', description: '序列号' }
        ]
      }
    };
  }
};
</script>
```

## 高级用法

### 扫码处理

```vue
<template>
  <el-barcode-input
    v-model="barcode"
    barcode-type="package"
    :debounce-delay="300"
    :scan-interval="50"
    @scan-input="handleScanInput"
    @scan-complete="handleScanComplete"
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
    handleScanInput(value) {
      console.log('正在扫描:', value);
    },
    handleScanComplete(value) {
      console.log('扫描完成:', value);
      // 处理扫码完成的业务逻辑
    }
  }
};
</script>
```

### 历史记录

```vue
<template>
  <el-barcode-input
    v-model="barcode"
    barcode-type="cell"
    :max-history="20"
    show-history
    @history-select="handleHistorySelect"
    @history-add="handleHistoryAdd"
    @history-clear="handleHistoryClear"
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
    handleHistorySelect(value) {
      console.log('选择历史记录:', value);
    },
    handleHistoryAdd(value) {
      console.log('添加到历史:', value);
    },
    handleHistoryClear() {
      console.log('清空历史记录');
    }
  }
};
</script>
```

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | string / number | — | — |
| barcode-type | 条码类型 | string | package / cell / module / customer | package |
| custom-rule | 自定义条码规则 | object | — | null |
| autofocus | 自动聚焦 | boolean | — | false |
| show-copy | 显示复制按钮 | boolean | — | true |
| show-history | 显示历史记录 | boolean | — | true |
| show-help | 显示帮助提示 | boolean | — | true |
| show-char-count | 显示字符计数 | boolean | — | true |
| debounce-delay | 防抖延迟时间(ms) | number | — | 300 |
| scan-interval | 扫描间隔检测(ms) | number | — | 50 |
| max-history | 历史记录最大条数 | number | — | 10 |

### 继承的 Input Attributes

组件完全继承了 Element UI Input 组件的所有属性：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 类型 | string | text, textarea | text |
| maxlength | 原生属性，最大输入长度 | number | — | — |
| minlength | 原生属性，最小输入长度 | number | — | — |
| placeholder | 输入框占位文本 | string | — | — |
| clearable | 是否可清空 | boolean | — | true |
| show-password | 是否显示切换密码图标 | boolean | — | false |
| show-word-limit | 是否显示输入字数统计 | boolean | — | false |
| disabled | 禁用 | boolean | — | false |
| size | 输入框尺寸 | string | medium / small / mini | — |
| prefix-icon | 输入框头部图标 | string | — | — |
| suffix-icon | 输入框尾部图标 | string | — | — |
| readonly | 原生属性，是否只读 | boolean | — | false |
| autocomplete | 原生属性，自动补全 | string | on, off | off |
| tabindex | 输入框的tabindex | string | — | — |
| validate-event | 输入时是否触发表单的校验 | boolean | — | true |

## Events

| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| scan-input | 检测到扫码输入时触发 | (value: string) |
| scan-complete | 扫码完成时触发 | (value: string) |
| copy | 复制条码时触发 | (value: string) |
| history-select | 选择历史记录时触发 | (value: string) |
| history-add | 添加历史记录时触发 | (value: string) |
| history-clear | 清空历史记录时触发 | — |
| validation | 验证状态改变时触发 | (isValid: boolean, value: string) |

### 继承的 Input Events

组件完全继承了 Element UI Input 组件的所有事件：

| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| blur | 在 Input 失去焦点时触发 | (event: Event) |
| focus | 在 Input 获得焦点时触发 | (event: Event) |
| change | 仅在输入框失去焦点或用户按下回车时触发 | (value: string \| number) |
| input | 在 Input 值改变时触发 | (value: string \| number) |
| clear | 在点击由 clearable 属性生成的清空按钮时触发 | — |

## Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| focus | 使 input 获取焦点 | — |
| blur | 使 input 失去焦点 | — |
| select | 选中 input 中的文字 | — |
| clear | 清空输入框内容 | — |

## Slots

| name | 说明 |
|------|------|
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |
| prepend | 输入框前置内容 |
| append | 输入框后置内容 |

## 自定义规则格式

```javascript
const customRule = {
  name: '规则名称',           // 条码类型名称
  pattern: /^[A-Z0-9]+$/,    // 正则表达式
  length: {                  // 长度要求
    min: 8,
    max: 16
  },
  format: [                  // 格式说明
    {
      range: '1-4',          // 位置范围
      description: '前缀代码' // 说明文字
    },
    {
      range: '5-*',          // 使用 * 表示到结尾
      description: '序列号'
    }
  ]
};
```

## 常见问题

### Q: 如何自定义条码格式验证？
A: 使用 `custom-rule` 属性传入自定义规则对象，包含 pattern、length、format 等配置。

### Q: 如何禁用某些功能？
A: 通过对应的 props 控制：
- `show-copy="false"` 禁用复制功能
- `show-history="false"` 禁用历史记录
- `show-help="false"` 禁用帮助提示
- `show-char-count="false"` 禁用字符计数

### Q: 如何处理扫码枪输入？
A: 组件会自动检测快速输入（通过 `scan-interval` 参数控制），并触发 `scan-input` 和 `scan-complete` 事件。

### Q: 历史记录存储在哪里？
A: 历史记录存储在浏览器的 localStorage 中，按条码类型分别存储。

### Q: 如何修改防抖时间？
A: 使用 `debounce-delay` 属性设置防抖延迟时间（毫秒）。

## 浏览器兼容性

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- IE 11+ (需要 polyfill 支持 Promise 和 async/await)

## 更新日志

### v1.0.0
- 初始版本发布
- 支持四种内置条码类型
- 支持自定义条码规则
- 完整的扫码功能和历史记录