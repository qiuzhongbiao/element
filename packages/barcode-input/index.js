import BarcodeInput from './src/barcode-input.vue';

BarcodeInput.install = function(Vue) {
  Vue.component(BarcodeInput.name, BarcodeInput);
};

export default BarcodeInput;