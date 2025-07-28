import { shallowMount, createLocalVue } from '@vue/test-utils';
import ElementUI from 'element-ui';
import BarcodeInput from '../packages/barcode-input/index.js';

const localVue = createLocalVue();
localVue.use(ElementUI);
localVue.component('ElBarcodeInput', BarcodeInput);

describe('BarcodeInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(BarcodeInput, {
      localVue,
      propsData: {
        value: '',
        barcodeType: 'package'
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('Props', () => {
    it('should have correct default props', () => {
      expect(wrapper.vm.barcodeType).toBe('package');
      expect(wrapper.vm.showCharCount).toBe(true);
      expect(wrapper.vm.showHelp).toBe(true);
      expect(wrapper.vm.enableHistory).toBe(true);
      expect(wrapper.vm.enableScanDebounce).toBe(true);
      expect(wrapper.vm.scanDebounceTime).toBe(100);
      expect(wrapper.vm.autoFocus).toBe(false);
      expect(wrapper.vm.enableCopy).toBe(true);
    });

    it('should accept custom props', () => {
      const customWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'battery',
          showCharCount: false,
          showHelp: false,
          enableHistory: false,
          autoFocus: true
        }
      });

      expect(customWrapper.vm.barcodeType).toBe('battery');
      expect(customWrapper.vm.showCharCount).toBe(false);
      expect(customWrapper.vm.showHelp).toBe(false);
      expect(customWrapper.vm.enableHistory).toBe(false);
      expect(customWrapper.vm.autoFocus).toBe(true);
    });
  });

  describe('Barcode Format', () => {
    it('should return correct format for package type', () => {
      const format = wrapper.vm.getBarcodeFormat();
      expect(format.pattern).toEqual(/^[A-Z]{2}\d{8}$/);
      expect(format.expectedLength).toBe(10);
      expect(format.description).toHaveLength(2);
    });

    it('should return correct format for battery type', () => {
      const batteryWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'battery'
        }
      });
      const format = batteryWrapper.vm.getBarcodeFormat();
      expect(format.pattern).toEqual(/^[A-Z]{3}\d{9}$/);
      expect(format.expectedLength).toBe(12);
      expect(format.description).toHaveLength(2);
    });

    it('should return correct format for module type', () => {
      const moduleWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'module'
        }
      });
      const format = moduleWrapper.vm.getBarcodeFormat();
      expect(format.pattern).toEqual(/^[A-Z]{2}\d{10}$/);
      expect(format.expectedLength).toBe(12);
      expect(format.description).toHaveLength(2);
    });

    it('should return correct format for customer type', () => {
      const customerWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'customer'
        }
      });
      const format = customerWrapper.vm.getBarcodeFormat();
      expect(format.pattern).toEqual(/^[A-Z]{2}\d{6}$/);
      expect(format.expectedLength).toBe(8);
      expect(format.description).toHaveLength(2);
    });
  });

  describe('Barcode Validation', () => {
    it('should validate package barcode correctly', () => {
      expect(wrapper.vm.validateBarcode('AB12345678')).toBe(true);
      expect(wrapper.vm.validateBarcode('A12345678')).toBe(false);
      expect(wrapper.vm.validateBarcode('AB1234567')).toBe(false);
      expect(wrapper.vm.validateBarcode('ab12345678')).toBe(false);
    });

    it('should validate battery barcode correctly', () => {
      const batteryWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'battery'
        }
      });
      expect(batteryWrapper.vm.validateBarcode('ABC123456789')).toBe(true);
      expect(batteryWrapper.vm.validateBarcode('AB123456789')).toBe(false);
      expect(batteryWrapper.vm.validateBarcode('ABC12345678')).toBe(false);
    });

    it('should validate module barcode correctly', () => {
      const moduleWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'module'
        }
      });
      expect(moduleWrapper.vm.validateBarcode('MD1234567890')).toBe(true);
      expect(moduleWrapper.vm.validateBarcode('M1234567890')).toBe(false);
      expect(moduleWrapper.vm.validateBarcode('MD123456789')).toBe(false);
    });

    it('should validate customer barcode correctly', () => {
      const customerWrapper = shallowMount(BarcodeInput, {
        localVue,
        propsData: {
          barcodeType: 'customer'
        }
      });
      expect(customerWrapper.vm.validateBarcode('CU123456')).toBe(true);
      expect(customerWrapper.vm.validateBarcode('C123456')).toBe(false);
      expect(customerWrapper.vm.validateBarcode('CU12345')).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should compute isValid correctly', () => {
      wrapper.setData({ currentValue: 'AB12345678' });
      expect(wrapper.vm.isValid).toBe(true);

      wrapper.setData({ currentValue: 'A12345678' });
      expect(wrapper.vm.isValid).toBe(false);

      wrapper.setData({ currentValue: '' });
      expect(wrapper.vm.isValid).toBe(true);
    });

    it('should compute expectedLength correctly', () => {
      expect(wrapper.vm.expectedLength).toBe(10);
    });

    it('should compute helpContent correctly', () => {
      const content = wrapper.vm.helpContent;
      expect(content).toContain('1-2: 产品类型代码');
      expect(content).toContain('3-10: 序列号');
    });

    it('should compute textLength correctly', () => {
      wrapper.setData({ currentValue: 'AB12345678' });
      expect(wrapper.vm.textLength).toBe(10);
    });
  });

  describe('Methods', () => {
    it('should set current value correctly', () => {
      wrapper.vm.setCurrentValue('test');
      expect(wrapper.vm.currentValue).toBe('test');
    });

    it('should clear input correctly', () => {
      wrapper.setData({ currentValue: 'test' });
      wrapper.vm.clear();
      expect(wrapper.vm.currentValue).toBe('');
    });

    it('should save to history correctly', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem');
      wrapper.vm.saveToHistory('test123');
      expect(spy).toHaveBeenCalledWith('barcode-history-package', JSON.stringify(['test123']));
    });

    it('should load history correctly', () => {
      const mockHistory = ['test1', 'test2'];
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockHistory));
      wrapper.vm.loadHistory();
      expect(wrapper.vm.historyList).toEqual(mockHistory);
    });

    it('should select history correctly', () => {
      const emitSpy = jest.spyOn(wrapper.vm, '$emit');
      wrapper.vm.selectHistory('test123');
      expect(wrapper.vm.currentValue).toBe('test123');
      expect(emitSpy).toHaveBeenCalledWith('input', 'test123');
      expect(emitSpy).toHaveBeenCalledWith('history-select', 'test123');
    });
  });

  describe('Events', () => {
    it('should emit input event', () => {
      const emitSpy = jest.spyOn(wrapper.vm, '$emit');
      wrapper.vm.handleInput({ target: { value: 'test' } });
      expect(emitSpy).toHaveBeenCalledWith('input', 'test');
    });

    it('should emit scan event', () => {
      const emitSpy = jest.spyOn(wrapper.vm, '$emit');
      wrapper.vm.handleScanDebounce('test');
      expect(emitSpy).toHaveBeenCalledWith('scan', 'test');
    });

    it('should emit enter event', () => {
      const emitSpy = jest.spyOn(wrapper.vm, '$emit');
      wrapper.vm.handleKeydown({ key: 'Enter', ctrlKey: false });
      expect(emitSpy).toHaveBeenCalledWith('enter', '');
    });

    it('should emit copy event', () => {
      const emitSpy = jest.spyOn(wrapper.vm, '$emit');
      wrapper.setData({ currentValue: 'test' });
      wrapper.vm.handleKeydown({ key: 'c', ctrlKey: true });
      expect(emitSpy).toHaveBeenCalledWith('copy', 'test');
    });
  });
});