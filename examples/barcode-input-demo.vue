<template>
  <div class="barcode-input-demo">
    <h2>条码输入框组件示例</h2>
    
    <!-- 包体码示例 -->
    <div class="demo-section">
      <h3>包体码输入示例</h3>
      <p class="demo-description">包体码格式：2位字母 + 8位数字，如：AB12345678</p>
      
      <el-form :model="packageForm" label-width="120px">
        <el-form-item label="包体码：">
          <el-barcode-input
            v-model="packageForm.barcode"
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
        
        <el-form-item>
          <el-button type="primary" @click="validatePackage">验证包体码</el-button>
          <el-button @click="clearPackage">清空</el-button>
          <el-button @click="copyPackage">复制</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 电芯码示例 -->
    <div class="demo-section">
      <h3>电芯码输入示例</h3>
      <p class="demo-description">电芯码格式：3位字母 + 9位数字，如：ABC123456789</p>
      
      <el-form :model="batteryForm" label-width="120px">
        <el-form-item label="电芯码：">
          <el-barcode-input
            v-model="batteryForm.barcode"
            barcode-type="battery"
            placeholder="请输入电芯码"
            clearable
            :show-char-count="true"
            :show-help="true"
            :enable-history="true"
            :enable-scan-debounce="true"
            :scan-debounce-time="150"
            @scan="handleScan"
            @scan-complete="handleScanComplete"
            @enter="handleEnter"
            @copy="handleCopy"
            @clear="handleClear"
            @history-select="handleHistorySelect"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="validateBattery">验证电芯码</el-button>
          <el-button @click="clearBattery">清空</el-button>
          <el-button @click="copyBattery">复制</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 模组码示例 -->
    <div class="demo-section">
      <h3>模组码输入示例</h3>
      <p class="demo-description">模组码格式：2位字母 + 10位数字，如：MD1234567890</p>
      
      <el-form :model="moduleForm" label-width="120px">
        <el-form-item label="模组码：">
          <el-barcode-input
            v-model="moduleForm.barcode"
            barcode-type="module"
            placeholder="请输入模组码"
            clearable
            :show-char-count="true"
            :show-help="true"
            :enable-history="true"
            :enable-scan-debounce="true"
            :scan-debounce-time="200"
            @scan="handleScan"
            @scan-complete="handleScanComplete"
            @enter="handleEnter"
            @copy="handleCopy"
            @clear="handleClear"
            @history-select="handleHistorySelect"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="validateModule">验证模组码</el-button>
          <el-button @click="clearModule">清空</el-button>
          <el-button @click="copyModule">复制</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 客户码示例 -->
    <div class="demo-section">
      <h3>客户码输入示例</h3>
      <p class="demo-description">客户码格式：2位字母 + 6位数字，如：CU123456</p>
      
      <el-form :model="customerForm" label-width="120px">
        <el-form-item label="客户码：">
          <el-barcode-input
            v-model="customerForm.barcode"
            barcode-type="customer"
            placeholder="请输入客户码"
            clearable
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
        
        <el-form-item>
          <el-button type="primary" @click="validateCustomer">验证客户码</el-button>
          <el-button @click="clearCustomer">清空</el-button>
          <el-button @click="copyCustomer">复制</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 自定义条码示例 -->
    <div class="demo-section">
      <h3>自定义条码输入示例</h3>
      <p class="demo-description">自定义格式：4位字母 + 6位数字，如：CUST123456</p>
      
      <el-form :model="customForm" label-width="120px">
        <el-form-item label="自定义码：">
          <el-barcode-input
            v-model="customForm.barcode"
            barcode-type="custom"
            :barcode-format="customBarcodeFormat"
            placeholder="请输入自定义条码"
            clearable
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
        
        <el-form-item>
          <el-button type="primary" @click="validateCustom">验证自定义码</el-button>
          <el-button @click="clearCustom">清空</el-button>
          <el-button @click="copyCustom">复制</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作日志 -->
    <div class="demo-section">
      <h3>操作日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarcodeInput from '../packages/barcode-input/index.js';

export default {
  name: 'BarcodeInputDemo',
  
  components: {
    BarcodeInput
  },

  data() {
    return {
      packageForm: {
        barcode: ''
      },
      batteryForm: {
        barcode: ''
      },
      moduleForm: {
        barcode: ''
      },
      customerForm: {
        barcode: ''
      },
      customForm: {
        barcode: ''
      },
      customBarcodeFormat: {
        pattern: /^[A-Z]{4}\d{6}$/,
        expectedLength: 10,
        description: [
          { range: '1-4', meaning: '自定义前缀' },
          { range: '5-10', meaning: '序列号' }
        ]
      },
      logs: []
    };
  },

  methods: {
    // 添加日志
    addLog(type, message) {
      const time = new Date().toLocaleTimeString();
      this.logs.unshift({ time, type, message });
      
      // 限制日志数量
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50);
      }
    },

    // 扫描事件处理
    handleScan(value) {
      this.addLog('扫描', `扫描中: ${value}`);
    },

    // 扫描完成事件处理
    handleScanComplete(value) {
      this.addLog('扫描完成', `扫描完成: ${value}`);
    },

    // 回车事件处理
    handleEnter(value) {
      this.addLog('回车', `按回车键: ${value}`);
    },

    // 复制事件处理
    handleCopy(value) {
      this.addLog('复制', `复制到剪贴板: ${value}`);
    },

    // 清空事件处理
    handleClear() {
      this.addLog('清空', '输入框已清空');
    },

    // 历史记录选择事件处理
    handleHistorySelect(value) {
      this.addLog('历史记录', `选择历史记录: ${value}`);
    },

    // 验证包体码
    validatePackage() {
      if (!this.packageForm.barcode) {
        this.$message.warning('请输入包体码');
        return;
      }
      
      const isValid = /^[A-Z]{2}\d{8}$/.test(this.packageForm.barcode);
      if (isValid) {
        this.$message.success('包体码格式正确');
        this.addLog('验证', `包体码验证成功: ${this.packageForm.barcode}`);
      } else {
        this.$message.error('包体码格式错误');
        this.addLog('验证', `包体码验证失败: ${this.packageForm.barcode}`);
      }
    },

    // 验证电芯码
    validateBattery() {
      if (!this.batteryForm.barcode) {
        this.$message.warning('请输入电芯码');
        return;
      }
      
      const isValid = /^[A-Z]{3}\d{9}$/.test(this.batteryForm.barcode);
      if (isValid) {
        this.$message.success('电芯码格式正确');
        this.addLog('验证', `电芯码验证成功: ${this.batteryForm.barcode}`);
      } else {
        this.$message.error('电芯码格式错误');
        this.addLog('验证', `电芯码验证失败: ${this.batteryForm.barcode}`);
      }
    },

    // 验证模组码
    validateModule() {
      if (!this.moduleForm.barcode) {
        this.$message.warning('请输入模组码');
        return;
      }
      
      const isValid = /^[A-Z]{2}\d{10}$/.test(this.moduleForm.barcode);
      if (isValid) {
        this.$message.success('模组码格式正确');
        this.addLog('验证', `模组码验证成功: ${this.moduleForm.barcode}`);
      } else {
        this.$message.error('模组码格式错误');
        this.addLog('验证', `模组码验证失败: ${this.moduleForm.barcode}`);
      }
    },

    // 验证客户码
    validateCustomer() {
      if (!this.customerForm.barcode) {
        this.$message.warning('请输入客户码');
        return;
      }
      
      const isValid = /^[A-Z]{2}\d{6}$/.test(this.customerForm.barcode);
      if (isValid) {
        this.$message.success('客户码格式正确');
        this.addLog('验证', `客户码验证成功: ${this.customerForm.barcode}`);
      } else {
        this.$message.error('客户码格式错误');
        this.addLog('验证', `客户码验证失败: ${this.customerForm.barcode}`);
      }
    },

    // 验证自定义码
    validateCustom() {
      if (!this.customForm.barcode) {
        this.$message.warning('请输入自定义码');
        return;
      }
      
      const isValid = /^[A-Z]{4}\d{6}$/.test(this.customForm.barcode);
      if (isValid) {
        this.$message.success('自定义码格式正确');
        this.addLog('验证', `自定义码验证成功: ${this.customForm.barcode}`);
      } else {
        this.$message.error('自定义码格式错误');
        this.addLog('验证', `自定义码验证失败: ${this.customForm.barcode}`);
      }
    },

    // 清空包体码
    clearPackage() {
      this.packageForm.barcode = '';
      this.addLog('清空', '包体码已清空');
    },

    // 清空电芯码
    clearBattery() {
      this.batteryForm.barcode = '';
      this.addLog('清空', '电芯码已清空');
    },

    // 清空模组码
    clearModule() {
      this.moduleForm.barcode = '';
      this.addLog('清空', '模组码已清空');
    },

    // 清空客户码
    clearCustomer() {
      this.customerForm.barcode = '';
      this.addLog('清空', '客户码已清空');
    },

    // 清空自定义码
    clearCustom() {
      this.customForm.barcode = '';
      this.addLog('清空', '自定义码已清空');
    },

    // 复制包体码
    copyPackage() {
      if (this.packageForm.barcode) {
        navigator.clipboard.writeText(this.packageForm.barcode).then(() => {
          this.$message.success('包体码已复制到剪贴板');
          this.addLog('复制', `包体码已复制: ${this.packageForm.barcode}`);
        });
      } else {
        this.$message.warning('包体码为空');
      }
    },

    // 复制电芯码
    copyBattery() {
      if (this.batteryForm.barcode) {
        navigator.clipboard.writeText(this.batteryForm.barcode).then(() => {
          this.$message.success('电芯码已复制到剪贴板');
          this.addLog('复制', `电芯码已复制: ${this.batteryForm.barcode}`);
        });
      } else {
        this.$message.warning('电芯码为空');
      }
    },

    // 复制模组码
    copyModule() {
      if (this.moduleForm.barcode) {
        navigator.clipboard.writeText(this.moduleForm.barcode).then(() => {
          this.$message.success('模组码已复制到剪贴板');
          this.addLog('复制', `模组码已复制: ${this.moduleForm.barcode}`);
        });
      } else {
        this.$message.warning('模组码为空');
      }
    },

    // 复制客户码
    copyCustomer() {
      if (this.customerForm.barcode) {
        navigator.clipboard.writeText(this.customerForm.barcode).then(() => {
          this.$message.success('客户码已复制到剪贴板');
          this.addLog('复制', `客户码已复制: ${this.customerForm.barcode}`);
        });
      } else {
        this.$message.warning('客户码为空');
      }
    },

    // 复制自定义码
    copyCustom() {
      if (this.customForm.barcode) {
        navigator.clipboard.writeText(this.customForm.barcode).then(() => {
          this.$message.success('自定义码已复制到剪贴板');
          this.addLog('复制', `自定义码已复制: ${this.customForm.barcode}`);
        });
      } else {
        this.$message.warning('自定义码为空');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.barcode-input-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    text-align: center;
    color: #303133;
    margin-bottom: 30px;
  }

  .demo-section {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fff;

    h3 {
      color: #303133;
      margin-bottom: 10px;
    }

    .demo-description {
      color: #606266;
      font-size: 14px;
      margin-bottom: 20px;
      padding: 10px;
      background: #f5f7fa;
      border-radius: 4px;
    }
  }

  .log-container {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background: #fafafa;

    .log-item {
      display: flex;
      margin-bottom: 5px;
      font-size: 12px;
      line-height: 1.5;

      .log-time {
        color: #909399;
        margin-right: 10px;
        min-width: 80px;
      }

      .log-type {
        color: #409eff;
        margin-right: 10px;
        min-width: 60px;
      }

      .log-message {
        color: #606266;
        flex: 1;
      }
    }
  }
}
</style>