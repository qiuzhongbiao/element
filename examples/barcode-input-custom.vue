<template>
  <div class="demo-container">
    <h2>自定义条码规则示例</h2>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="选择条码类型">
        <el-select v-model="selectedType" placeholder="请选择条码类型" @change="handleTypeChange">
          <el-option label="序列号码" value="serial" />
          <el-option label="生产批次码" value="batch" />
          <el-option label="质检码" value="quality" />
          <el-option label="自定义规则" value="custom" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="条码输入" v-if="selectedType">
        <el-barcode-input
          ref="barcodeInput"
          v-model="form.customCode"
          :custom-rule="currentRule"
          :placeholder="currentRule.placeholder"
          :debounce-delay="500"
          :max-history="5"
          size="large"
          @scan-complete="handleScanComplete"
          @input="handleInput"
          @validation="handleValidation"
        />
      </el-form-item>
      
      <el-form-item label="验证状态" v-if="selectedType">
        <el-progress 
          :percentage="validationPercentage" 
          :color="progressColor"
          :status="progressStatus"
        />
        <div class="validation-detail">{{ validationDetail }}</div>
      </el-form-item>
    </el-form>
    
    <el-card v-if="selectedType" class="rule-info">
      <div slot="header">
        <span>{{ currentRule.name }} - 规则说明</span>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="条码名称">{{ currentRule.name }}</el-descriptions-item>
        <el-descriptions-item label="长度要求">{{ currentRule.length.min }}-{{ currentRule.length.max }}位</el-descriptions-item>
        <el-descriptions-item label="格式规则" :span="2">{{ currentRule.pattern.toString() }}</el-descriptions-item>
      </el-descriptions>
      
      <h4>格式详解</h4>
      <el-table :data="currentRule.format" border size="small">
        <el-table-column prop="range" label="位置" width="100" />
        <el-table-column prop="description" label="说明" />
        <el-table-column label="当前值" width="120">
          <template slot-scope="{ row }">
            <el-tag size="mini" :type="getSegmentType(row.range)">
              {{ getSegmentValue(row.range) || '-' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <h3>功能测试</h3>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button @click="generateExample" type="primary">生成示例</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="simulateFastScan" type="success">模拟快速扫描</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="focusInput" type="info">聚焦输入框</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="clearInput" type="warning">清空</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarcodeInput from '../packages/barcode-input/src/barcode-input.vue';

export default {
  name: 'BarcodeInputCustomDemo',
  components: {
    'el-barcode-input': BarcodeInput
  },
  data() {
    return {
      selectedType: '',
      form: {
        customCode: ''
      },
      barcodeRules: {
        serial: {
          name: '序列号码',
          pattern: /^SN[0-9]{10}$/,
          length: { min: 12, max: 12 },
          placeholder: '请输入序列号码，格式：SN + 10位数字',
          format: [
            { range: '1-2', description: '产品标识' },
            { range: '3-12', description: '序列号' }
          ]
        },
        batch: {
          name: '生产批次码',
          pattern: /^[A-Z]{2}[0-9]{4}[A-Z0-9]{4}$/,
          length: { min: 10, max: 10 },
          placeholder: '请输入生产批次码，格式：2位字母 + 4位数字 + 4位字母数字',
          format: [
            { range: '1-2', description: '生产线代码' },
            { range: '3-6', description: '生产日期' },
            { range: '7-10', description: '批次编号' }
          ]
        },
        quality: {
          name: '质检码',
          pattern: /^QC[0-9]{6}[A-Z]{2}$/,
          length: { min: 10, max: 10 },
          placeholder: '请输入质检码，格式：QC + 6位数字 + 2位字母',
          format: [
            { range: '1-2', description: '质检标识' },
            { range: '3-8', description: '检验日期' },
            { range: '9-10', description: '检验员代码' }
          ]
        },
        custom: {
          name: '自定义规则',
          pattern: /^[A-Z0-9]{8,16}$/,
          length: { min: 8, max: 16 },
          placeholder: '请输入自定义条码，8-16位大写字母和数字',
          format: [
            { range: '1-4', description: '自定义前缀' },
            { range: '5-*', description: '自定义内容' }
          ]
        }
      }
    };
  },
  computed: {
    currentRule() {
      return this.barcodeRules[this.selectedType] || {};
    },
    isValid() {
      if (!this.form.customCode || !this.currentRule.pattern) return null;
      return this.currentRule.pattern.test(this.form.customCode);
    },
    validationPercentage() {
      if (!this.form.customCode) return 0;
      if (!this.currentRule.length) return 0;
      
      const currentLength = this.form.customCode.length;
      const targetLength = this.currentRule.length.max;
      const lengthPercentage = Math.min((currentLength / targetLength) * 80, 80);
      const formatPercentage = this.isValid ? 20 : 0;
      
      return Math.round(lengthPercentage + formatPercentage);
    },
    progressColor() {
      if (this.validationPercentage >= 100) return '#67C23A';
      if (this.validationPercentage >= 60) return '#E6A23C';
      return '#F56C6C';
    },
    progressStatus() {
      if (this.validationPercentage >= 100) return 'success';
      if (this.validationPercentage >= 80) return null;
      return 'exception';
    },
    validationDetail() {
      if (!this.form.customCode) return '请输入条码';
      if (!this.currentRule.pattern) return '请选择条码类型';
      
      const length = this.form.customCode.length;
      const { min, max } = this.currentRule.length;
      
      if (length < min) {
        return `长度不足，当前${length}位，至少需要${min}位`;
      }
      if (length > max) {
        return `长度超出，当前${length}位，最多允许${max}位`;
      }
      if (this.isValid) {
        return '格式验证通过';
      }
      return '格式不符合规则要求';
    }
  },
  methods: {
    handleTypeChange(type) {
      this.form.customCode = '';
    },
    handleScanComplete(value) {
      this.$message({
        message: `扫描完成: ${value}`,
        type: this.isValid ? 'success' : 'warning'
      });
    },
    handleInput(value) {
      // 实时验证
      console.log('Input:', value, 'Valid:', this.isValid);
    },
    handleValidation(isValid, value) {
      console.log('Validation changed:', isValid, value);
    },
    getSegmentValue(range) {
      if (!this.form.customCode) return '';
      
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(n => n === '*' ? this.form.customCode.length : parseInt(n));
        return this.form.customCode.slice(start - 1, end);
      }
      return '';
    },
    getSegmentType(range) {
      const value = this.getSegmentValue(range);
      if (!value) return 'info';
      
      // 简单的格式检查
      if (range === '1-2' && this.selectedType === 'serial') {
        return value === 'SN' ? 'success' : 'danger';
      }
      if (range === '1-2' && this.selectedType === 'quality') {
        return value === 'QC' ? 'success' : 'danger';
      }
      
      return 'primary';
    },
    generateExample() {
      const examples = {
        serial: 'SN2023120001',
        batch: 'AB23121001',
        quality: 'QC231201AB',
        custom: 'CUST12345678'
      };
      this.form.customCode = examples[this.selectedType] || '';
    },
    simulateFastScan() {
      // 模拟扫码枪快速输入
      const examples = {
        serial: 'SN' + Date.now().toString().slice(-10),
        batch: 'CD' + new Date().getFullYear().toString().slice(-2) + 
               String(new Date().getMonth() + 1).padStart(2, '0') + 
               String(new Date().getDate()).padStart(2, '0') + 'A001',
        quality: 'QC' + new Date().toISOString().slice(2, 8).replace(/-/g, '') + 'QA',
        custom: 'FAST' + Date.now().toString().slice(-8)
      };
      
      const example = examples[this.selectedType];
      if (example) {
        this.form.customCode = '';
        // 模拟快速输入
        let index = 0;
        const inputTimer = setInterval(() => {
          this.form.customCode += example[index];
          index++;
          if (index >= example.length) {
            clearInterval(inputTimer);
          }
        }, 20);
      }
    },
    focusInput() {
      this.$refs.barcodeInput.focus();
    },
    clearInput() {
      this.form.customCode = '';
      this.$refs.barcodeInput.focus();
    }
  }
};
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.rule-info {
  margin: 20px 0;
}

.validation-detail {
  margin-top: 10px;
  font-size: 12px;
  color: #606266;
}

.el-progress {
  margin-bottom: 10px;
}
</style>