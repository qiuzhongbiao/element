<template>
  <div class="demo-container">
    <h2>电芯码输入框示例</h2>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="电芯码">
        <el-barcode-input
          v-model="form.cellCode"
          barcode-type="cell"
          placeholder="请输入电芯码"
          size="medium"
          @scan-complete="handleScanComplete"
          @validation="handleValidation"
        />
      </el-form-item>
      
      <el-form-item label="验证结果">
        <el-alert
          :title="validationMessage"
          :type="validationType"
          :closable="false"
          show-icon
        />
      </el-form-item>
    </el-form>
    
    <h3>电芯码格式说明</h3>
    <el-table :data="formatData" border style="margin-top: 20px;">
      <el-table-column prop="range" label="位置" width="100" />
      <el-table-column prop="description" label="含义" />
      <el-table-column prop="example" label="示例" width="120" />
      <el-table-column prop="validation" label="验证规则" />
    </el-table>
    
    <h3>快速测试</h3>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button @click="setValid" type="success" size="small">有效电芯码</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="setInvalid" type="danger" size="small">无效电芯码</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="setPartial" type="warning" size="small">部分输入</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="clearAll" type="info" size="small">清空</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarcodeInput from '../packages/barcode-input/src/barcode-input.vue';

export default {
  name: 'BarcodeInputCellDemo',
  components: {
    'el-barcode-input': BarcodeInput
  },
  data() {
    return {
      form: {
        cellCode: ''
      },
      formatData: [
        { 
          range: '1-3', 
          description: '电芯厂商代码', 
          example: 'ABC',
          validation: '大写字母或数字'
        },
        { 
          range: '4-6', 
          description: '电芯型号代码', 
          example: '123',
          validation: '大写字母或数字' 
        },
        { 
          range: '7-10', 
          description: '生产批次号', 
          example: '2312',
          validation: '大写字母或数字'
        },
        { 
          range: '11-12', 
          description: '检验码', 
          example: '01',
          validation: '大写字母或数字'
        }
      ]
    };
  },
  computed: {
    isValid() {
      if (!this.form.cellCode) return null;
      return /^[A-Z0-9]{12}$/.test(this.form.cellCode);
    },
    validationMessage() {
      if (!this.form.cellCode) {
        return '请输入电芯码进行验证';
      }
      if (this.form.cellCode.length < 12) {
        return `电芯码长度不足，当前${this.form.cellCode.length}位，需要12位`;
      }
      if (this.form.cellCode.length > 12) {
        return `电芯码长度超出，当前${this.form.cellCode.length}位，需要12位`;
      }
      if (this.isValid) {
        return '电芯码格式正确';
      }
      return '电芯码格式错误，只能包含大写字母和数字';
    },
    validationType() {
      if (!this.form.cellCode) return 'info';
      if (this.form.cellCode.length !== 12) return 'warning';
      return this.isValid ? 'success' : 'error';
    }
  },
  methods: {
    handleScanComplete(value) {
      this.$message({
        message: `电芯码扫描完成: ${value}`,
        type: this.isValid ? 'success' : 'error'
      });
    },
    handleValidation(isValid, value) {
      console.log('Validation result:', isValid, value);
    },
    setValid() {
      this.form.cellCode = 'ABC123231201';
    },
    setInvalid() {
      this.form.cellCode = 'abc123231201'; // 小写字母
    },
    setPartial() {
      this.form.cellCode = 'ABC123';
    },
    clearAll() {
      this.form.cellCode = '';
    }
  }
};
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.el-alert {
  margin-top: 10px;
}
</style>