<template>
  <div :class="[
    'el-barcode-input',
    inputSize ? 'el-barcode-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'is-focused': focused,
      'is-valid': isValid,
      'is-invalid': !isValid && currentValue,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'el-input--prefix': $slots.prefix || prefixIcon,
      'el-input--suffix': $slots.suffix || suffixIcon || clearable || showCopy
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
      :type="type"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :placeholder="placeholder"
      :maxlength="maxlength"
      ref="input"
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
        <!-- 复制按钮 -->
        <i v-if="showCopy"
           class="el-input__icon el-icon-document-copy"
           @click="handleCopy"
           title="复制条码">
        </i>
        <!-- 清除按钮 -->
        <i v-if="showClear"
           class="el-input__icon el-icon-circle-close"
           @click="clear"
           title="清空">
        </i>
        <!-- 历史记录按钮 -->
        <i v-if="showHistory && historyList.length > 0"
           class="el-input__icon el-icon-time"
           @click="toggleHistory"
           title="历史记录">
        </i>
        <!-- 帮助提示 -->
        <el-tooltip 
          v-if="showHelp && barcodeRule" 
          effect="dark" 
          placement="top" 
          :content="formatHelpContent"
          popper-class="barcode-help-tooltip">
          <i class="el-input__icon el-icon-question"></i>
        </el-tooltip>
        <span v-if="isWordLimitVisible" class="el-input__count">
          <span class="el-input__count-inner">
            {{ textLength }}/{{ upperLimit }}
          </span>
        </span>
        <i class="el-input__icon"
           v-if="validateState"
           :class="['el-input__validateIcon', validateIcon]">
        </i>
      </span>
    </span>
    
    <!-- 后置元素 -->
    <div class="el-input-group__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
    
    <!-- 字符计数 -->
    <div v-if="showCharCount" class="el-barcode-input__count">
      字符数: {{ textLength }}
      <span v-if="barcodeRule && barcodeRule.length" class="barcode-length-range">
        ({{ barcodeRule.length.min }}-{{ barcodeRule.length.max }})
      </span>
    </div>
    
    <!-- 历史记录下拉框 -->
    <transition name="el-zoom-in-top">
      <div v-if="showHistoryDropdown" class="el-barcode-input__history">
        <div class="history-header">
          <span>历史记录</span>
          <i class="el-icon-delete" @click="clearHistory" title="清空历史"></i>
        </div>
        <ul class="history-list">
          <li 
            v-for="(item, index) in historyList" 
            :key="index"
            @click="selectHistory(item)"
            class="history-item">
            <span class="history-value">{{ item }}</span>
            <span class="history-time">{{ getHistoryTime(item) }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter';
  import Migrating from 'element-ui/src/mixins/migrating';

  // 条码类型规则配置
  const BARCODE_RULES = {
    // 包体码规则
    package: {
      name: '包体码',
      pattern: /^[A-Z0-9]{16}$/,
      length: { min: 16, max: 16 },
      format: [
        { range: '1-4', description: '生产厂商代码' },
        { range: '5-8', description: '产品型号代码' },
        { range: '9-12', description: '生产日期代码' },
        { range: '13-16', description: '流水号' }
      ]
    },
    // 电芯码规则  
    cell: {
      name: '电芯码',
      pattern: /^[A-Z0-9]{12}$/,
      length: { min: 12, max: 12 },
      format: [
        { range: '1-3', description: '电芯厂商代码' },
        { range: '4-6', description: '电芯型号代码' },
        { range: '7-10', description: '生产批次号' },
        { range: '11-12', description: '检验码' }
      ]
    },
    // 模组码规则
    module: {
      name: '模组码',
      pattern: /^[A-Z0-9]{14}$/,
      length: { min: 14, max: 14 },
      format: [
        { range: '1-2', description: '模组类型代码' },
        { range: '3-6', description: '生产厂商代码' },
        { range: '7-10', description: '生产日期代码' },
        { range: '11-14', description: '序列号' }
      ]
    },
    // 客户码规则
    customer: {
      name: '客户码',
      pattern: /^[A-Z0-9]{8,20}$/,
      length: { min: 8, max: 20 },
      format: [
        { range: '1-4', description: '客户代码' },
        { range: '5-8', description: '产品代码' },
        { range: '9-*', description: '自定义字段' }
      ]
    }
  };

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
        hovering: false,
        focused: false,
        isComposing: false,
        currentValue: this.value || '',
        historyList: [],
        showHistoryDropdown: false,
        lastScanTime: 0
      };
    },

    props: {
      value: [String, Number],
      size: String,
      resize: String,
      form: String,
      disabled: Boolean,
      readonly: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      autosize: {
        type: [Boolean, Object],
        default: false
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
        default: true
      },
      showCopy: {
        type: Boolean,
        default: true
      },
      showHistory: {
        type: Boolean,
        default: true
      },
      showHelp: {
        type: Boolean,
        default: true
      },
      showCharCount: {
        type: Boolean,
        default: true
      },
      showWordLimit: {
        type: Boolean,
        default: false
      },
      tabindex: String,
      placeholder: String,
      maxlength: Number,
      // 条码类型
      barcodeType: {
        type: String,
        default: 'package',
        validator(val) {
          return ['package', 'cell', 'module', 'customer'].includes(val);
        }
      },
      // 自动聚焦
      autofocus: {
        type: Boolean,
        default: false
      },

      // 扫描间隔检测(ms)
      scanInterval: {
        type: Number,
        default: 50
      },
      // 历史记录最大条数
      maxHistory: {
        type: Number,
        default: 10
      },
      // 自定义条码规则
      customRule: {
        type: Object,
        default: null
      }
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      validateState() {
        return this.elFormItem ? this.elFormItem.validateState : '';
      },
      needStatusIcon() {
        return this.elForm ? this.elForm.statusIcon : false;
      },
      validateIcon() {
        return {
          validating: 'el-icon-loading',
          success: 'el-icon-circle-check',
          error: 'el-icon-circle-close'
        }[this.validateState];
      },
      inputSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      inputDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      nativeInputValue() {
        return this.value === null || this.value === undefined ? '' : String(this.value);
      },
      showClear() {
        return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue &&
          (this.focused || this.hovering);
      },
      isWordLimitVisible() {
        return this.showWordLimit &&
          this.maxlength &&
          !this.inputDisabled &&
          !this.readonly;
      },
      upperLimit() {
        return this.maxlength;
      },
      textLength() {
        if (typeof this.currentValue === 'number') {
          return String(this.currentValue).length;
        }
        return (this.currentValue || '').length;
      },
      inputExceed() {
        return this.isWordLimitVisible &&
          (this.textLength > this.upperLimit);
      },
      // 获取当前条码规则
      barcodeRule() {
        if (this.customRule) {
          return this.customRule;
        }
        return BARCODE_RULES[this.barcodeType] || BARCODE_RULES.package;
      },
      // 校验条码是否有效
      isValid() {
        if (!this.currentValue) return true;
        return this.barcodeRule.pattern.test(this.currentValue);
      },
      // 格式化帮助内容
      formatHelpContent() {
        if (!this.barcodeRule || !this.barcodeRule.format) return '';
        return this.barcodeRule.format
          .map(item => `${item.range}: ${item.description}`)
          .join('\n');
      }
    },

    watch: {
      value(val) {
        this.setNativeInputValue();
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [val]);
        }
      },
      nativeInputValue() {
        this.setNativeInputValue();
      },
      currentValue: {
        immediate: true,
        handler(val) {
          this.$emit('input', val);
        }
      }
    },

    created() {
      this.$on('inputSelect', this.select);
      this.loadHistory();
    },

    mounted() {
      this.setNativeInputValue();
      if (this.autofocus) {
        this.focus();
      }
      // 监听全局点击事件关闭历史记录
      document.addEventListener('click', this.handleDocumentClick);
    },

          beforeDestroy() {
        document.removeEventListener('click', this.handleDocumentClick);
      },

    methods: {
      focus() {
        this.getInput().focus();
      },
      blur() {
        this.getInput().blur();
      },
      select() {
        this.getInput().select();
      },
      setNativeInputValue() {
        const input = this.getInput();
        if (!input) return;
        if (input.value === this.nativeInputValue) return;
        input.value = this.nativeInputValue;
      },
      getInput() {
        return this.$refs.input;
      },
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      handleBlur(event) {
        this.focused = false;
        this.showHistoryDropdown = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
        }
      },
      handleCompositionStart(event) {
        this.$emit('compositionstart', event);
        this.isComposing = true;
      },
      handleCompositionUpdate(event) {
        this.$emit('compositionupdate', event);
        const text = event.target.value;
        const lastCharacter = text[text.length - 1] || '';
        this.isComposing = !/[\u4e00-\u9fa5]/.test(lastCharacter);
      },
      handleCompositionEnd(event) {
        this.$emit('compositionend', event);
        if (this.isComposing) {
          this.isComposing = false;
          this.handleInput(event);
        }
      },
      handleInput(event) {
        if (this.isComposing) return;
        
        const value = event.target.value;
        const now = Date.now();
        
        // 检测快速扫描
        if (now - this.lastScanTime < this.scanInterval) {
          this.handleScanInput(value);
        } else {
          this.handleNormalInput(value);
        }
        
        this.lastScanTime = now;
        this.$nextTick(this.setNativeInputValue);
      },
      handleNormalInput(value) {
        this.currentValue = value;
        this.$emit('input', value);
      },
              handleScanInput(value) {
          this.currentValue = value;
          this.$emit('input', value);
          this.$emit('scan-input', value);
          
          // 立即处理扫描完成
          if (this.isValid) {
            this.addToHistory(value);
            this.$emit('scan-complete', value);
          }
        },
      handleChange(event) {
        this.$emit('change', event.target.value);
      },
      handleKeydown(event) {
        // Ctrl+A 全选
        if (event.ctrlKey && event.key === 'a') {
          this.select();
          event.preventDefault();
          return;
        }
        
        // Ctrl+C 复制
        if (event.ctrlKey && event.key === 'c' && this.currentValue) {
          this.handleCopy();
          return;
        }
        
        // Escape 清空
        if (event.key === 'Escape') {
          this.clear();
          event.preventDefault();
          return;
        }
        
        this.$emit('keydown', event);
      },
      clear() {
        this.currentValue = '';
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
        this.focus();
      },
      // 复制功能
      async handleCopy() {
        if (!this.currentValue) return;
        
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(this.currentValue);
          } else {
            // 兼容旧版浏览器
            const input = this.getInput();
            input.select();
            document.execCommand('copy');
          }
          this.$message.success('复制成功');
          this.$emit('copy', this.currentValue);
        } catch (err) {
          this.$message.error('复制失败');
        }
      },
      // 历史记录相关
      toggleHistory() {
        this.showHistoryDropdown = !this.showHistoryDropdown;
      },
      selectHistory(value) {
        this.currentValue = value;
        this.showHistoryDropdown = false;
        this.focus();
        this.$emit('history-select', value);
      },
      addToHistory(value) {
        if (!value || this.historyList.includes(value)) return;
        
        this.historyList.unshift(value);
        if (this.historyList.length > this.maxHistory) {
          this.historyList = this.historyList.slice(0, this.maxHistory);
        }
        
        this.saveHistory();
        this.$emit('history-add', value);
      },
      clearHistory() {
        this.historyList = [];
        this.saveHistory();
        this.showHistoryDropdown = false;
        this.$emit('history-clear');
      },
      loadHistory() {
        try {
          const stored = localStorage.getItem(`barcode-history-${this.barcodeType}`);
          if (stored) {
            this.historyList = JSON.parse(stored);
          }
        } catch (e) {
          console.warn('Failed to load barcode history:', e);
        }
      },
      saveHistory() {
        try {
          localStorage.setItem(
            `barcode-history-${this.barcodeType}`, 
            JSON.stringify(this.historyList)
          );
        } catch (e) {
          console.warn('Failed to save barcode history:', e);
        }
      },
      getHistoryTime(value) {
        // 简化的时间显示，实际可以保存时间戳
        return new Date().toLocaleString();
      },
      handleDocumentClick(event) {
        if (!this.$el.contains(event.target)) {
          this.showHistoryDropdown = false;
        }
      },
      getSuffixVisible() {
        return this.$slots.suffix ||
          this.suffixIcon ||
          this.showClear ||
          this.showCopy ||
          this.showHistory ||
          this.showHelp ||
          this.isWordLimitVisible ||
          (this.validateState && this.needStatusIcon);
      },
      getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        };
      }
    }
  };
</script>

<style lang="scss">
.el-barcode-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  
  &.is-focused {
    .el-input__inner {
      border-color: #409EFF;
    }
  }
  
  &.is-valid {
    .el-input__inner {
      border-color: #67C23A;
    }
  }
  
  &.is-invalid {
    .el-input__inner {
      border-color: #F56C6C;
    }
  }
  
  .el-input__inner {
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  
  &__count {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 5px;
    font-size: 12px;
    color: #909399;
    
    .barcode-length-range {
      color: #67C23A;
    }
  }
  
  &__history {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    margin-top: 5px;
    
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #EBEEF5;
      font-size: 12px;
      color: #909399;
      
      .el-icon-delete {
        cursor: pointer;
        
        &:hover {
          color: #F56C6C;
        }
      }
    }
    
    .history-list {
      list-style: none;
      margin: 0;
      padding: 0;
      
      .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: #F5F7FA;
        }
        
        .history-value {
          font-size: 13px;
          color: #303133;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .history-time {
          font-size: 11px;
          color: #C0C4CC;
          margin-left: 8px;
        }
      }
    }
  }
}

.barcode-help-tooltip {
  white-space: pre-line;
  max-width: 300px;
}

// 动画效果
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}

.el-zoom-in-top-enter,
.el-zoom-in-top-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>