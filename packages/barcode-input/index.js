import BarcodeInput from './src/barcode-input';

/* istanbul ignore next */
BarcodeInput.install = function(Vue) {
  Vue.component(BarcodeInput.name, BarcodeInput);
};

export default BarcodeInput;