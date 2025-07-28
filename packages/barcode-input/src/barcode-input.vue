<template>
  <div class="el-barcode-input">
    <div :class="[
      'el-input',
      inputSize ? 'el-input--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword,
        'is-focus': focused,
        'is-valid': isValid,
        'is-invalid': !isValid && value && value.length > 0
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- 前置元素 -->
    <div class="el-input-group__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    
    <input
      :tabindex="tabindex"
      class="el-input__inner"
      v-bind="$attrs"
      :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :placeholder="placeholder"
      :maxlength="maxlength"
      ref="input"
      v-model="currentValue"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keydown="handleKeydown"
      :aria-label="label"
    >
    
    <!-- 前置内容 -->
    <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
      <slot name="prefix"></slot>
      <i class="el-input__icon"
         v-if="prefixIcon"
         :class="prefixIcon">
      </i>
    </span>
    
    <!-- 后置内容 -->
    <span
      class="el-input__suffix"
      v-if="getSuffixVisible()">
      <span class="el-input__suffix-inner">
        <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
          <slot name="suffix"></slot>
          <i class="el-input__icon"
            v-if="suffixIcon"
            :class="suffixIcon">
          </i>
        </template>
        <i v-if="showClear"
          class="el-input__icon el-icon-circle-close el-input__clear"
          @mousedown.prevent
          @click="clear"
        ></i>
        <i v-if="showPwdVisible"
          class="el-input__icon el-icon-view el-input__clear"
          @click="handlePasswordVisible"
        ></i>
        <span v-if="isWordLimitVisible" class="el-input__count">
          <span class="el-input__count-inner">
            {{ textLength }}/{{ upperLimit }}
          </span>
        </span>
      </span>
      <i class="el-input__icon"
        v-if="validateState"
        :class="['el-input__validateIcon', validateIcon]">
      </i>
    </span>
    
    <!-- 后置元素 -->
    <div class="el-input-group__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
    
    <!-- 问号提示按钮 -->
    <el-tooltip
      v-if="showHelp"
      :content="helpContent"
      placement="top"
      :popper-class="'barcode-help-tooltip'"
    >
      <i class="el-input__help-icon el-icon-question"></i>
    </el-tooltip>
  </div>
  
  <!-- 字符数显示 -->
  <div v-if="showCharCount" class="el-barcode-input__char-count">
    <span :class="['char-count-text', { 'is-exceed': textLength > expectedLength }]">
      字符数: {{ textLength }}{{ expectedLength ? '/' + expectedLength : '' }}
    </span>
  </div>
  
  <!-- 历史记录下拉框 -->
  <div v-if="focused && enableHistory && historyList.length > 0" class="el-barcode-input__history">
    <ul class="history-list">
      <li
        v-for="(item, index) in historyList"
        :key="index"
        class="history-item"
        @click="selectHistory(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import Migrating from 'element-ui/src/mixins/migrating';
import { isKorean } from 'element-ui/src/utils/shared';

// debounce 函数实现
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  name: 'ElBarcodeInput',

  componentName: 'ElBarcodeInput',

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  data() {
    return {
      currentValue: this.value === undefined || this.value === null ? '' : String(this.value),
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
      historyList: [],
      lastInputTime: 0,
      scanTimeout: null
    };
  },

  props: {
    value: [String, Number],
    size: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][BarcodeInput]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
        return true;
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    // 条码相关属性
    barcodeType: {
      type: String,
      default: 'custom',
      validator: function (value) {
        return ['package', 'battery', 'module', 'customer', 'custom'].indexOf(value) !== -1;
      }
    },
    maxlength: [String, Number],
    placeholder: String,
    // 条码格式配置
    barcodeFormat: {
      type: Object,
      default: () => ({})
    },
    // 是否显示字符数
    showCharCount: {
      type: Boolean,
      default: true
    },
    // 是否显示帮助提示
    showHelp: {
      type: Boolean,
      default: true
    },
    // 是否启用历史记录
    enableHistory: {
      type: Boolean,
      default: true
    },
    // 历史记录最大数量
    maxHistory: {
      type: Number,
      default: 10
    },
    // 是否启用防抖扫描
    enableScanDebounce: {
      type: Boolean,
      default: true
    },
    // 扫描防抖时间
    scanDebounceTime: {
      type: Number,
      default: 100
    },
    // 是否自动聚焦
    autoFocus: {
      type: Boolean,
      default: false
    },
    // 是否启用一键复制
    enableCopy: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },
    validateIcon() {
      return {
        'is-success': this.validateState === 'success',
        'is-error': this.validateState === 'error',
        'is-validating': this.validateState === 'validating'
      };
    },
    inputExceed() {
      return this.showWordLimit && this.textLength > this.upperLimit;
    },
    showClear() {
      return this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.currentValue !== '' &&
        (this.focused || this.hovering);
    },
    showPwdVisible() {
      return this.showPassword &&
        !this.inputDisabled &&
        !this.readonly;
    },
    isWordLimitVisible() {
      return this.showWordLimit &&
        this.type === 'text' &&
        (this.$slots.suffix || this.suffixIcon);
    },
    textLength() {
      return this.currentValue.length;
    },
    upperLimit() {
      return this.maxlength;
    },
    isValid() {
      if (!this.currentValue) return true;
      return this.validateBarcode(this.currentValue);
    },
    showHistory() {
      return this.focused && this.enableHistory && this.historyList.length > 0;
    },
    expectedLength() {
      const format = this.getBarcodeFormat();
      return format.expectedLength || null;
    },
    helpContent() {
      const format = this.getBarcodeFormat();
      if (!format.description) return '';
      
      return format.description.map(item => {
        return `${item.range}: ${item.meaning}`;
      }).join('<br>');
    }
  },

  watch: {
    value(val, oldVal) {
      this.setCurrentValue(val);
    }
  },

  mounted() {
    if (this.autoFocus) {
      this.$nextTick(() => {
        this.focus();
      });
    }
    
    // 加载历史记录
    this.loadHistory();
    
    // 绑定键盘事件
    this.bindKeyboardEvents();
  },

  beforeDestroy() {
    this.unbindKeyboardEvents();
  },

  methods: {
    // 获取条码格式配置
    getBarcodeFormat() {
      const defaultFormats = {
        package: {
          pattern: /^[A-Z]{2}\d{8}$/,
          expectedLength: 10,
          description: [
            { range: '1-2', meaning: '产品类型代码' },
            { range: '3-10', meaning: '序列号' }
          ]
        },
        battery: {
          pattern: /^[A-Z]{3}\d{9}$/,
          expectedLength: 12,
          description: [
            { range: '1-3', meaning: '电芯型号' },
            { range: '4-12', meaning: '电芯序列号' }
          ]
        },
        module: {
          pattern: /^[A-Z]{2}\d{10}$/,
          expectedLength: 12,
          description: [
            { range: '1-2', meaning: '模组类型' },
            { range: '3-12', meaning: '模组序列号' }
          ]
        },
        customer: {
          pattern: /^[A-Z]{2}\d{6}$/,
          expectedLength: 8,
          description: [
            { range: '1-2', meaning: '客户代码' },
            { range: '3-8', meaning: '客户产品编号' }
          ]
        },
        custom: {
          pattern: this.barcodeFormat.pattern || /.*/,
          expectedLength: this.barcodeFormat.expectedLength || null,
          description: this.barcodeFormat.description || []
        }
      };
      
      return defaultFormats[this.barcodeType] || defaultFormats.custom;
    },

    // 验证条码格式
    validateBarcode(value) {
      const format = this.getBarcodeFormat();
      return format.pattern.test(value);
    },

    // 设置当前值
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value === undefined || value === null ? '' : String(value);
    },

    // 处理输入事件
    handleInput(event) {
      const value = event.target.value;
      this.setCurrentValue(value);
      this.$emit('input', value);
      
      // 防抖扫描处理
      if (this.enableScanDebounce) {
        this.handleScanDebounce(value);
      }
      
      // 保存到历史记录
      if (this.enableHistory && value) {
        this.saveToHistory(value);
      }
      
      this.$emit('change', value);
    },

    // 防抖扫描处理
    handleScanDebounce: debounce(function(value) {
      this.$emit('scan', value);
    }, 100),

    // 处理组合输入
    handleCompositionStart() {
      this.isComposing = true;
    },

    handleCompositionUpdate(event) {
      const text = event.target.value;
      const lastCharacter = text[text.length - 1] || '';
      this.isComposing = !isKorean(lastCharacter);
    },

    handleCompositionEnd(event) {
      this.isComposing = false;
      this.handleInput(event);
    },

    // 处理焦点事件
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },

    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
      }
    },

    handleChange(event) {
      this.$emit('change', event.target.value);
    },

    // 处理键盘事件
    handleKeydown(event) {
      // Ctrl+C 复制
      if (event.ctrlKey && event.key === 'c' && this.enableCopy) {
        this.copyToClipboard();
      }
      
      // Ctrl+V 粘贴
      if (event.ctrlKey && event.key === 'v') {
        this.$nextTick(() => {
          this.$emit('paste', this.currentValue);
        });
      }
      
      // Enter 键
      if (event.key === 'Enter') {
        this.$emit('enter', this.currentValue);
      }
      
      // Escape 键清空
      if (event.key === 'Escape') {
        this.clear();
      }
    },

    // 绑定键盘事件
    bindKeyboardEvents() {
      document.addEventListener('keydown', this.handleGlobalKeydown);
    },

    // 解绑键盘事件
    unbindKeyboardEvents() {
      document.removeEventListener('keydown', this.handleGlobalKeydown);
    },

    // 全局键盘事件处理
    handleGlobalKeydown(event) {
      if (this.focused) {
        // 扫描枪通常以很快的速度输入字符
        const now = Date.now();
        if (now - this.lastInputTime < this.scanDebounceTime) {
          clearTimeout(this.scanTimeout);
          this.scanTimeout = setTimeout(() => {
            this.$emit('scan-complete', this.currentValue);
          }, this.scanDebounceTime);
        }
        this.lastInputTime = now;
      }
    },

    // 获取后缀可见性
    getSuffixVisible() {
      return this.suffixIcon || this.$slots.suffix || this.showClear || this.showPwdVisible || this.isWordLimitVisible;
    },

    // 清空输入框
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
      this.setCurrentValue('');
      this.$nextTick(() => {
        this.focus();
      });
    },

    // 处理密码可见性
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(() => {
        this.focus();
      });
    },

    // 聚焦
    focus() {
      this.$refs.input.focus();
    },

    // 失焦
    blur() {
      this.$refs.input.blur();
    },

    // 选择文本
    select() {
      this.$refs.input.select();
    },

    // 复制到剪贴板
    copyToClipboard() {
      if (this.currentValue) {
        navigator.clipboard.writeText(this.currentValue).then(() => {
          this.$message.success('已复制到剪贴板');
          this.$emit('copy', this.currentValue);
        }).catch(() => {
          this.$message.error('复制失败');
        });
      }
    },

    // 保存到历史记录
    saveToHistory(value) {
      const history = this.getHistory();
      const index = history.indexOf(value);
      
      if (index > -1) {
        history.splice(index, 1);
      }
      
      history.unshift(value);
      
      if (history.length > this.maxHistory) {
        history.splice(this.maxHistory);
      }
      
      localStorage.setItem(`barcode-history-${this.barcodeType}`, JSON.stringify(history));
      this.historyList = history;
    },

    // 加载历史记录
    loadHistory() {
      try {
        const history = localStorage.getItem(`barcode-history-${this.barcodeType}`);
        this.historyList = history ? JSON.parse(history) : [];
      } catch (error) {
        console.warn('Failed to load barcode history:', error);
        this.historyList = [];
      }
    },

    // 获取历史记录
    getHistory() {
      return this.historyList;
    },

    // 选择历史记录
    selectHistory(value) {
      this.setCurrentValue(value);
      this.$emit('input', value);
      this.$emit('history-select', value);
      this.focus();
    },

    // 清空历史记录
    clearHistory() {
      localStorage.removeItem(`barcode-history-${this.barcodeType}`);
      this.historyList = [];
      this.$emit('history-clear');
    }
  }
};
</script>

<style lang="scss" scoped>
.el-barcode-input {
  position: relative;
  display: inline-block;
  width: 100%;
  
  .el-input {
    position: relative;
    
    &.is-focus {
      .el-input__inner {
        border-color: #409eff;
      }
    }
    
    &.is-valid {
      .el-input__inner {
        border-color: #67c23a;
      }
    }
    
    &.is-invalid {
      .el-input__inner {
        border-color: #f56c6c;
      }
    }
  }
  
  .el-input__help-icon {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    color: #909399;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
      color: #409eff;
    }
  }
  
  &__char-count {
    margin-top: 5px;
    font-size: 12px;
    color: #909399;
    
    .char-count-text {
      &.is-exceed {
        color: #f56c6c;
      }
    }
  }
  
  &__history {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 2000;
    max-height: 200px;
    overflow-y: auto;
    
    .history-list {
      margin: 0;
      padding: 0;
      list-style: none;
      
      .history-item {
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #f5f7fa;
        
        &:hover {
          background-color: #f5f7fa;
        }
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

// 全局样式
.barcode-help-tooltip {
  max-width: 300px;
  
  .el-tooltip__popper {
    white-space: pre-line;
    line-height: 1.5;
  }
}
</style>