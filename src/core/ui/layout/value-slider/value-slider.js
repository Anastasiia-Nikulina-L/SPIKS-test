(function(global) {
  if (!global.uiComponents) {
    global.uiComponents = {};
  }

  class DualValueSlider {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('.slider-track');
      this.valueFields = container.querySelectorAll('.slider-input input');
      this.minHandle = null;
      this.maxHandle = null;
      this.fill = null;
      this.isDragging = false;
      this.currentHandle = null;
      
      this.initialize();
    }

    initialize() {
      if (!this.track) return;
      
      const config = JSON.parse(this.container.dataset.config || '{}');
      this.config = {
        isSingleHandle: config.handles === 1,
        minValue: config.minValue || 0,
        maxValue: config.maxValue || 100,
        minRange: config.minRange || 0,
        maxRange: config.maxRange || 100,
        unit: config.unit || '',
        showInputs: config.showInputs || false
      };

      this.createSliderElements();
      this.setupEvents();
      this.updateSliderValues([this.config.minValue, this.config.maxValue]);
      
      if (this.config.showInputs) {
        this.setupValueSync();
      }
    }

    createSliderElements() {
      this.fill = document.createElement('div');
      this.fill.className = 'slider-fill';
      this.track.appendChild(this.fill);
      
      this.minHandle = document.createElement('div');
      this.minHandle.className = 'slider-handle';
      this.minHandle.setAttribute('data-handle', 'min');
      this.track.appendChild(this.minHandle);
      
      const minTooltip = document.createElement('div');
      minTooltip.className = 'slider-tooltip';
      minTooltip.style.display = 'none';
      this.minHandle.appendChild(minTooltip);
      
      if (!this.config.isSingleHandle) {
        this.maxHandle = document.createElement('div');
        this.maxHandle.className = 'slider-handle';
        this.maxHandle.setAttribute('data-handle', 'max');
        this.track.appendChild(this.maxHandle);
        
        const maxTooltip = document.createElement('div');
        maxTooltip.className = 'slider-tooltip';
        maxTooltip.style.display = 'none';
        this.maxHandle.appendChild(maxTooltip);
      }
    }

    setupEvents() {
      this.minHandle.addEventListener('mousedown', (e) => this.startDrag(e, 'min'));
      if (this.maxHandle) {
        this.maxHandle.addEventListener('mousedown', (e) => this.startDrag(e, 'max'));
      }
      
      document.addEventListener('mousemove', (e) => this.handleDrag(e));
      document.addEventListener('mouseup', () => this.stopDrag());
      
      this.minHandle.addEventListener('touchstart', (e) => this.startDrag(e, 'min'));
      if (this.maxHandle) {
        this.maxHandle.addEventListener('touchstart', (e) => this.startDrag(e, 'max'));
      }
      
      document.addEventListener('touchmove', (e) => this.handleDrag(e));
      document.addEventListener('touchend', () => this.stopDrag());
      
      this.minHandle.addEventListener('mouseenter', () => this.showTooltip('min'));
      this.minHandle.addEventListener('mouseleave', () => {
        if (!this.isDragging) this.hideTooltip('min');
      });
      
      if (this.maxHandle) {
        this.maxHandle.addEventListener('mouseenter', () => this.showTooltip('max'));
        this.maxHandle.addEventListener('mouseleave', () => {
          if (!this.isDragging) this.hideTooltip('max');
        });
      }
    }

    showTooltip(handle) {
      const tooltip = handle === 'min' 
        ? this.minHandle.querySelector('.slider-tooltip')
        : this.maxHandle.querySelector('.slider-tooltip');
      if (tooltip) {
        tooltip.style.display = 'block';
      }
    }

    hideTooltip(handle) {
      const tooltip = handle === 'min' 
        ? this.minHandle.querySelector('.slider-tooltip')
        : this.maxHandle.querySelector('.slider-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }

    startDrag(e, handle) {
      e.preventDefault();
      this.isDragging = true;
      this.currentHandle = handle;
      this.showTooltip(handle);
      
      if (handle === 'min') {
        this.minHandle.style.zIndex = '10';
        if (this.maxHandle) this.maxHandle.style.zIndex = '1';
      } else {
        this.maxHandle.style.zIndex = '10';
        this.minHandle.style.zIndex = '1';
      }
    }

    handleDrag(e) {
      if (!this.isDragging) return;
      
      e.preventDefault();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (!clientX) return;
      
      const trackRect = this.track.getBoundingClientRect();
      let position = (clientX - trackRect.left) / trackRect.width;
      position = Math.max(0, Math.min(1, position));
      
      const value = this.config.minRange + position * (this.config.maxRange - this.config.minRange);
      
      if (this.currentHandle === 'min') {
        const maxValue = this.maxHandle ? this.getHandleValue('max') : this.config.maxRange;
        const newValue = Math.min(value, maxValue);
        this.updateHandle('min', newValue);
      } else if (this.currentHandle === 'max') {
        const minValue = this.getHandleValue('min');
        const newValue = Math.max(value, minValue);
        this.updateHandle('max', newValue);
      }
      
      this.updateFill();
      this.updateTooltips();
      
      if (this.config.showInputs) {
        this.updateInputFields();
      }
    }

    stopDrag() {
      this.isDragging = false;
      if (this.currentHandle) {
        this.hideTooltip(this.currentHandle);
      }
      this.currentHandle = null;
    }

    getHandleValue(handle) {
      if (handle === 'min') {
        const pos = parseFloat(this.minHandle.style.left) / 100;
        return this.config.minRange + pos * (this.config.maxRange - this.config.minRange);
      } else if (handle === 'max') {
        const pos = parseFloat(this.maxHandle.style.left) / 100;
        return this.config.minRange + pos * (this.config.maxRange - this.config.minRange);
      }
      return 0;
    }

    updateHandle(handle, value) {
      const position = (value - this.config.minRange) / (this.config.maxRange - this.config.minRange) * 100;
      
      if (handle === 'min') {
        this.minHandle.style.left = `${position}%`;
        this.config.minValue = value;
      } else if (handle === 'max') {
        this.maxHandle.style.left = `${position}%`;
        this.config.maxValue = value;
      }
    }

    updateFill() {
      const minPos = parseFloat(this.minHandle.style.left) / 100 || 0;
      const maxPos = this.maxHandle ? parseFloat(this.maxHandle.style.left) / 100 : 1;
      
      this.fill.style.left = `${minPos * 100}%`;
      this.fill.style.width = `${(maxPos - minPos) * 100}%`;
    }

    updateTooltips() {
      const minValue = this.getHandleValue('min');
      const maxValue = this.getHandleValue('max');
      
      const minTooltip = this.minHandle.querySelector('.slider-tooltip');
      minTooltip.textContent = `${Math.round(minValue)}${this.config.unit ? ' ' + this.config.unit : ''}`;
      
      if (this.maxHandle) {
        const maxTooltip = this.maxHandle.querySelector('.slider-tooltip');
        maxTooltip.textContent = `${Math.round(maxValue)}${this.config.unit ? ' ' + this.config.unit : ''}`;
      }
    }

    updateSliderValues(values) {
      this.updateHandle('min', values[0]);
      if (values.length > 1 && this.maxHandle) {
        this.updateHandle('max', values[1]);
      }
      this.updateFill();
      this.updateTooltips();
    }

setupValueSync() {
  const unit = this.config.unit || '';
  
  this.track.addEventListener('slider-update', (e) => {
    const [minVal, maxVal] = e.detail.values;
    
    if (this.minInput) {
      this.minInput.value = `${Math.round(minVal)}${unit}`;
      this.minInput.size = Math.max(3, this.minInput.value.length);
    }
    
    if (this.maxInput) {
      this.maxInput.value = `${Math.round(maxVal)}${unit}`;
      this.maxInput.size = Math.max(3, this.maxInput.value.length);
    }
  });
  
  this.valueFields.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.size = Math.max(3, input.value.length);
    });
    
    input.addEventListener('change', () => {
      const numericValue = parseFloat(input.value.replace(/[^\d.-]/g, ''));
      if (!isNaN(numericValue)) {
        this.setSliderValue(index, numericValue);
      }
    });
  });
}

setSliderValue(index, value) {
  const values = this.getCurrentValues();
  values[index] = Math.max(
    this.config.minRange,
    Math.min(this.config.maxRange, value)
  );
  
  this.updateSliderValues(values);
  
  this.track.dispatchEvent(new CustomEvent('slider-update', {
    detail: { values }
  }));
}

    updateInputFields() {
      const minValue = this.getHandleValue('min');
      const maxValue = this.getHandleValue('max');
      
      const formattedMin = `${Math.round(minValue)}${this.config.unit ? ' ' + this.config.unit : ''}`;
      const formattedMax = `${Math.round(maxValue)}${this.config.unit ? ' ' + this.config.unit : ''}`;
      
      if (this.valueFields[0]) {
        this.valueFields[0].value = formattedMin;
        this.adjustInputWidth(this.valueFields[0]);
      }
      
      if (this.valueFields[1]) {
        this.valueFields[1].value = formattedMax;
        this.adjustInputWidth(this.valueFields[1]);
      }
    }

    adjustInputWidth(input) {
      input.size = Math.max(3, input.value.length);
    }

    handleInputKey(event, index) {
      if (event.key === 'Enter') {
        const numericValue = parseFloat(event.target.value.replace(/[^\d.-]/g, ''));
        if (!isNaN(numericValue)) {
          const values = [
            index === 0 ? numericValue : this.getHandleValue('min'),
            index === 1 ? numericValue : this.getHandleValue('max')
          ];
          this.updateSliderValues(values);
        }
      }
    }

    cleanup() {
      this.valueFields.forEach(field => {
        field.removeEventListener('input', this.adjustInputWidth);
        field.removeEventListener('keydown', this.handleInputKey);
      });
      
      this.minHandle.removeEventListener('mousedown', this.startDrag);
      if (this.maxHandle) {
        this.maxHandle.removeEventListener('mousedown', this.startDrag);
      }
      
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.stopDrag);
      
      document.removeEventListener('touchmove', this.handleDrag);
      document.removeEventListener('touchend', this.stopDrag);
    }
  }

global.uiComponents.sliders = {
    setup: () => {
      document.querySelectorAll('.slider-container').forEach(el => {
        new DualValueSlider(el);
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    global.uiComponents.sliders.setup();
  });
})(window);