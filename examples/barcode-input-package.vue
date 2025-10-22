<template>
  <div class="demo-container">
    <h2>包体码输入框示例</h2>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="包体码">
        <el-barcode-input
          v-model="form.packageCode"
          barcode-type="package"
          placeholder="请输入包体码"
          autofocus
          @scan-complete="handleScanComplete"
          @copy="handleCopy"
          @history-select="handleHistorySelect"
          @clear="handleClear"
        />
      </el-form-item>
      
      <el-form-item label="实时状态">
        <el-tag :type="form.packageCode ? (isValid ? 'success' : 'danger') : 'info'">
          {{ getStatusText() }}
        </el-tag>
      </el-form-item>
      
      <el-form-item label="当前值">
        <el-input v-model="form.packageCode" readonly />
      </el-form-item>
    </el-form>
    
    <h3>功能演示</h3>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-button @click="simulateScan" type="primary">模拟扫码</el-button>
      </el-col>
      <el-col :span="8">
        <el-button @click="clearInput" type="warning">清空输入</el-button>
      </el-col>
      <el-col :span="8">
        <el-button @click="setExample" type="info">设置示例</el-button>
      </el-col>
    </el-row>
    
    <h3>包体码格式说明</h3>
    <el-table :data="formatData" border style="margin-top: 20px;">
      <el-table-column prop="range" label="位置" width="100" />
      <el-table-column prop="description" label="含义" />
      <el-table-column prop="example" label="示例" width="120" />
    </el-table>
    
    <h3>事件日志</h3>
    <el-card class="event-log">
      <div v-for="(event, index) in eventLog" :key="index" class="event-item">
        <span class="event-time">{{ event.time }}</span>
        <span class="event-type">{{ event.type }}</span>
        <span class="event-data">{{ event.data }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import BarcodeInput from '../packages/barcode-input/src/barcode-input.vue';

export default {
  name: 'BarcodeInputPackageDemo',
  components: {
    'el-barcode-input': BarcodeInput
  },
  data() {
    return {
      form: {
        packageCode: ''
      },
      eventLog: [],
      formatData: [
        { range: '1-4', description: '生产厂商代码', example: 'ABCD' },
        { range: '5-8', description: '产品型号代码', example: '1234' },
        { range: '9-12', description: '生产日期代码', example: '2312' },
        { range: '13-16', description: '流水号', example: '0001' }
      ]
    };
  },
  computed: {
    isValid() {
      if (!this.form.packageCode) return true;
      return /^[A-Z0-9]{16}$/.test(this.form.packageCode);
    }
  },
  methods: {
    getStatusText() {
      if (!this.form.packageCode) return '未输入';
      return this.isValid ? '格式正确' : '格式错误';
    },
    handleScanComplete(value) {
      this.addEventLog('扫码完成', value);
      this.$message.success(`扫码完成: ${value}`);
    },
    handleCopy(value) {
      this.addEventLog('复制', value);
    },
    handleHistorySelect(value) {
      this.addEventLog('选择历史', value);
    },
    handleClear() {
      this.addEventLog('清空', '');
    },
    simulateScan() {
      // 模拟快速输入
      const exampleCode = 'ABCD12342312' + String(Date.now()).slice(-4);
      this.form.packageCode = exampleCode;
      this.addEventLog('模拟扫码', exampleCode);
    },
    clearInput() {
      this.form.packageCode = '';
      this.addEventLog('手动清空', '');
    },
    setExample() {
      this.form.packageCode = 'ABCD12342312001';
      this.addEventLog('设置示例', 'ABCD12342312001');
    },
    addEventLog(type, data) {
      this.eventLog.unshift({
        time: new Date().toLocaleTimeString(),
        type,
        data: data || ''
      });
      if (this.eventLog.length > 10) {
        this.eventLog = this.eventLog.slice(0, 10);
      }
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

.event-log {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 20px;
}

.event-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.event-time {
  color: #909399;
  width: 100px;
}

.event-type {
  color: #409EFF;
  width: 100px;
}

.event-data {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
</style>