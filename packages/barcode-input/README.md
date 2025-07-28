# BarcodeInput 条码输入框

基于 Element UI 2.15.1 和 Vue 2 的条码输入框组件，支持多种条码类型验证、历史记录、防抖扫描等功能。

## 基础用法

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

## 条码类型

组件内置了四种条码类型：

### 包体码 (package)
- 格式：2位字母 + 8位数字
- 示例：AB12345678
- 描述：
  - 1-2位：产品类型代码
  - 3-10位：序列号

### 电芯码 (battery)
- 格式：3位字母 + 9位数字
- 示例：ABC123456789
- 描述：
  - 1-3位：电芯型号
  - 4-12位：电芯序列号

### 模组码 (module)
- 格式：2位字母 + 10位数字
- 示例：MD1234567890
- 描述：
  - 1-2位：模组类型
  - 3-12位：模组序列号

### 客户码 (customer)
- 格式：2位字母 + 6位数字
- 示例：CU123456
- 描述：
  - 1-2位：客户代码
  - 3-8位：客户产品编号

### 自定义条码 (custom)
- 格式：可自定义
- 示例：CUST123456
- 描述：可自定义格式和描述

## 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | string / number | — | — |
| barcode-type | 条码类型 | string | package / battery / module / customer / custom | custom |
| barcode-format | 自定义条码格式配置 | object | — | {} |
| placeholder | 输入框占位文本 | string | — | — |
| clearable | 是否可清空 | boolean | — | false |
| auto-focus | 是否自动聚焦 | boolean | — | false |
| show-char-count | 是否显示字符数 | boolean | — | true |
| show-help | 是否显示帮助提示 | boolean | — | true |
| enable-history | 是否启用历史记录 | boolean | — | true |
| max-history | 历史记录最大数量 | number | — | 10 |
| enable-scan-debounce | 是否启用防抖扫描 | boolean | — | true |
| scan-debounce-time | 扫描防抖时间(ms) | number | — | 100 |
| enable-copy | 是否启用一键复制 | boolean | — | true |
| disabled | 是否禁用 | boolean | — | false |
| readonly | 是否只读 | boolean | — | false |
| size | 输入框尺寸 | string | medium / small / mini | — |
| maxlength | 最大输入长度 | string / number | — | — |
| show-password | 是否显示切换密码图标 | boolean | — | false |
| show-word-limit | 是否显示输入字数统计 | boolean | — | false |
| tabindex | 输入框的 tabindex | string | — | — |
| validate-event | 输入时是否触发表单的校验 | boolean | — | true |
| suffix-icon | 输入框尾部图标 | string | — | — |
| prefix-icon | 输入框头部图标 | string | — | — |
| label | 输入框关联的label文字 | string | — | — |
| autocomplete | 原生属性，自动完成 | string | on / off | off |

### 继承的 Input 属性

组件继承了 Element UI Input 组件的所有属性，包括但不限于：

- `type` - 类型
- `autocomplete` - 自动完成
- `disabled` - 禁用状态
- `readonly` - 只读状态
- `size` - 尺寸
- `maxlength` - 最大长度
- `placeholder` - 占位符
- `clearable` - 可清空
- `show-password` - 显示密码切换
- `show-word-limit` - 显示字数统计
- `tabindex` - tab 索引
- `validate-event` - 验证事件
- `suffix-icon` - 后缀图标
- `prefix-icon` - 前缀图标
- `label` - 标签

## 事件

| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| input | 在输入值改变时触发 | (value: string \| number) |
| change | 在值改变时触发 | (value: string \| number) |
| focus | 在获得焦点时触发 | (event: Event) |
| blur | 在失去焦点时触发 | (event: Event) |
| clear | 在点击清空按钮时触发 | — |
| enter | 在按下回车键时触发 | (value: string) |
| copy | 在复制到剪贴板时触发 | (value: string) |
| paste | 在粘贴时触发 | (value: string) |
| scan | 在扫描过程中触发 | (value: string) |
| scan-complete | 在扫描完成时触发 | (value: string) |
| history-select | 在选择历史记录时触发 | (value: string) |
| history-clear | 在清空历史记录时触发 | — |

### 继承的 Input 事件

组件继承了 Element UI Input 组件的所有事件，包括但不限于：

- `input` - 输入事件
- `change` - 改变事件
- `focus` - 聚焦事件
- `blur` - 失焦事件
- `clear` - 清空事件

## 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| focus | 使 input 获取焦点 | — |
| blur | 使 input 失去焦点 | — |
| select | 选中 input 中的文字 | — |
| clear | 清空输入框 | — |
| copyToClipboard | 复制到剪贴板 | — |
| saveToHistory | 保存到历史记录 | (value: string) |
| loadHistory | 加载历史记录 | — |
| getHistory | 获取历史记录 | — |
| selectHistory | 选择历史记录 | (value: string) |
| clearHistory | 清空历史记录 | — |

### 继承的 Input 方法

组件继承了 Element UI Input 组件的所有方法，包括但不限于：

- `focus()` - 聚焦
- `blur()` - 失焦
- `select()` - 选择文本

## 插槽

| 插槽名 | 说明 |
|--------|------|
| prepend | 输入框头部内容，只对 `type="text"` 有效 |
| append | 输入框尾部内容，只对 `type="text"` 有效 |
| prefix | 输入框头部图标 |
| suffix | 输入框尾部图标 |

## 自定义条码格式

当 `barcode-type` 为 `custom` 时，可以通过 `barcode-format` 属性自定义条码格式：

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
        pattern: /^[A-Z]{4}\d{6}$/, // 正则表达式
        expectedLength: 10, // 期望长度
        description: [ // 格式描述
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

## 功能特性

### 自动聚焦
- 通过 `auto-focus` 属性控制是否自动聚焦
- 支持在组件挂载后自动聚焦到输入框

### 快速清空
- 通过 `clearable` 属性控制是否显示清空按钮
- 支持点击清空按钮或按 Escape 键清空

### 一键复制
- 通过 `enable-copy` 属性控制是否启用复制功能
- 支持 Ctrl+C 快捷键复制
- 复制成功后会显示提示信息

### 输入限制
- 通过 `maxlength` 属性限制最大输入长度
- 通过条码类型自动验证格式
- 支持自定义正则表达式验证

### 历史记录
- 通过 `enable-history` 属性控制是否启用历史记录
- 通过 `max-history` 属性控制历史记录最大数量
- 历史记录按条码类型分别存储
- 支持点击历史记录项快速填充

### 防抖扫描
- 通过 `enable-scan-debounce` 属性控制是否启用防抖扫描
- 通过 `scan-debounce-time` 属性控制防抖时间
- 适用于扫描枪快速输入场景

### 视觉反馈
- 输入框边框颜色根据验证状态变化
- 字符数显示，超出预期长度时变红
- 帮助提示气泡显示条码格式说明

### 问号提示
- 通过 `show-help` 属性控制是否显示帮助提示
- 提示内容根据条码类型自动生成
- 支持自定义格式描述

## 完整示例

```vue
<template>
  <div>
    <!-- 包体码输入 -->
    <el-form-item label="包体码：">
      <el-barcode-input
        v-model="packageBarcode"
        barcode-type="package"
        placeholder="请输入包体码"
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
    </el-form-item>

    <!-- 电芯码输入 -->
    <el-form-item label="电芯码：">
      <el-barcode-input
        v-model="batteryBarcode"
        barcode-type="battery"
        placeholder="请输入电芯码"
        clearable
        :show-char-count="true"
        :show-help="true"
        :enable-history="true"
        @scan="handleScan"
        @scan-complete="handleScanComplete"
      />
    </el-form-item>

    <!-- 自定义条码输入 -->
    <el-form-item label="自定义码：">
      <el-barcode-input
        v-model="customBarcode"
        barcode-type="custom"
        :barcode-format="customFormat"
        placeholder="请输入自定义条码"
        clearable
        :show-char-count="true"
        :show-help="true"
        @scan="handleScan"
        @scan-complete="handleScanComplete"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  data() {
    return {
      packageBarcode: '',
      batteryBarcode: '',
      customBarcode: '',
      customFormat: {
        pattern: /^[A-Z]{4}\d{6}$/,
        expectedLength: 10,
        description: [
          { range: '1-4', meaning: '自定义前缀' },
          { range: '5-10', meaning: '序列号' }
        ]
      }
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

## 注意事项

1. 组件依赖 Element UI 2.15.1 和 Vue 2.x
2. 历史记录使用 localStorage 存储，按条码类型分别存储
3. 复制功能需要浏览器支持 Clipboard API
4. 防抖扫描功能适用于扫描枪等快速输入设备
5. 自定义条码格式需要提供正确的正则表达式和描述信息
6. 组件继承了 Element UI Input 的所有功能和样式

## 更新日志

### 1.0.0
- 初始版本发布
- 支持四种内置条码类型
- 支持自定义条码格式
- 支持历史记录功能
- 支持防抖扫描功能
- 支持一键复制功能
- 支持自动聚焦功能
- 支持视觉反馈功能
- 支持问号提示功能