(function(global) {
  if (!global.uiComponents) {
    global.uiComponents = {};
  }

  class DualValueSlider {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('.slider-track');
      this.minInputField = container.querySelector('.slider-min-input input');
      this.maxInputField = container.querySelector('.slider-max-input input');
      this.valueFields = [this.minInputField, this.maxInputField].filter(Boolean);

      this.minHandle = null;
      this.maxHandle = null;
      this.fill = null;
      this.isDragging = false;
      this.currentHandle = null;
      this.config = {};
      
      this.initialize();
    }

    initialize() {
      if (!this.track) return;
      
      const configData = JSON.parse(this.container.dataset.config || '{}');
      
      this.config = {
        minRange: typeof configData.minRange === 'number' ? configData.minRange : 0,
        maxRange: typeof configData.maxRange === 'number' ? configData.maxRange : 100,
        unit: configData.unit || '',
        showInputs: configData.showInputs || false,
        isSingleHandle: configData.handles === 1
      };

      this.config.minValue = typeof configData.minValue === 'number' ? configData.minValue : this.config.minRange;
      this.config.maxValue = typeof configData.maxValue === 'number' ? configData.maxValue : this.config.maxRange;

      if (this.config.isSingleHandle) {
        if (this.minInputField && !this.maxInputField) {
          this.config.maxValue = this.config.maxRange;
        } else if (!this.minInputField && this.maxInputField) {
           this.config.minValue = typeof configData.maxValue === 'number' ? configData.maxValue : this.config.maxRange;
           this.config.maxValue = this.config.maxRange;
        }
      }


      this.createSliderElements();
      this.setupEvents();
      this.updateSliderValues([this.config.minValue, this.config.maxValue]); 
      
      if (this.config.showInputs) {
        this.updateInputFields();
        this.setupValueSync();
      }
    }

    createSliderElements() {
      this.fill = document.createElement('div');
      this.fill.className = 'slider-fill';
      this.track.appendChild(this.fill);
      
      this.minHandle = document.createElement('div');
      this.minHandle.className = 'slider-handle slider-handle-min';
      this.minHandle.setAttribute('data-handle', 'min');
      this.track.appendChild(this.minHandle);
      
      const minTooltip = document.createElement('div');
      minTooltip.className = 'slider-tooltip';
      minTooltip.style.display = 'none';
      this.minHandle.appendChild(minTooltip);
      
      if (!this.config.isSingleHandle && this.maxInputField) {
        this.maxHandle = document.createElement('div');
        this.maxHandle.className = 'slider-handle slider-handle-max';
        this.maxHandle.setAttribute('data-handle', 'max');
        this.track.appendChild(this.maxHandle);
        
        const maxTooltip = document.createElement('div');
        maxTooltip.className = 'slider-tooltip';
        maxTooltip.style.display = 'none';
        this.maxHandle.appendChild(maxTooltip);
      }
    }

    setupEvents() {
      this.minHandle.addEventListener('mousedown', (e) => this.startDrag(e, this.minHandle));
      if (this.maxHandle) {
        this.maxHandle.addEventListener('mousedown', (e) => this.startDrag(e, this.maxHandle));
      }
      
      document.addEventListener('mousemove', (e) => this.handleDrag(e));
      document.addEventListener('mouseup', () => this.stopDrag());
      
      this.minHandle.addEventListener('touchstart', (e) => this.startDrag(e, this.minHandle), { passive: false });
      if (this.maxHandle) {
        this.maxHandle.addEventListener('touchstart', (e) => this.startDrag(e, this.maxHandle), { passive: false });
      }
      
      document.addEventListener('touchmove', (e) => this.handleDrag(e), { passive: false });
      document.addEventListener('touchend', () => this.stopDrag());
      
      this.minHandle.addEventListener('mouseenter', () => this.showTooltip(this.minHandle));
      this.minHandle.addEventListener('mouseleave', () => {
        if (!this.isDragging || this.currentHandle !== this.minHandle) this.hideTooltip(this.minHandle);
      });
      
      if (this.maxHandle) {
        this.maxHandle.addEventListener('mouseenter', () => this.showTooltip(this.maxHandle));
        this.maxHandle.addEventListener('mouseleave', () => {
          if (!this.isDragging || this.currentHandle !== this.maxHandle) this.hideTooltip(this.maxHandle);
        });
      }
    }

    showTooltip(handleElement) {
      const tooltip = handleElement.querySelector('.slider-tooltip');
      if (tooltip) {
        tooltip.style.display = 'block';
      }
    }

    hideTooltip(handleElement) {
      const tooltip = handleElement.querySelector('.slider-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }

    startDrag(e, handleElement) {
      e.preventDefault();
      this.isDragging = true;
      this.currentHandle = handleElement;
      this.showTooltip(this.currentHandle);
      
      this.minHandle.style.zIndex = (this.currentHandle === this.minHandle) ? '10' : '1';
      if (this.maxHandle) {
        this.maxHandle.style.zIndex = (this.currentHandle === this.maxHandle) ? '10' : '1';
      }
    }

    handleDrag(e) {
      if (!this.isDragging || !this.currentHandle) return;
      
      e.preventDefault();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (typeof clientX === 'undefined') return;
      
      const trackRect = this.track.getBoundingClientRect();
      let position = (clientX - trackRect.left) / trackRect.width;
      position = Math.max(0, Math.min(1, position));
      
      let value = this.config.minRange + position * (this.config.maxRange - this.config.minRange);
      value = Math.round(value);

      const handleType = this.currentHandle.dataset.handle;

      if (handleType === 'min') {
        const currentMaxValue = this.maxHandle ? this.getHandleValue(this.maxHandle) : this.config.maxRange;
        const newValue = Math.min(value, currentMaxValue);
        this.updateHandlePosition(this.minHandle, newValue);
        this.config.minValue = newValue;
      } else if (handleType === 'max' && this.maxHandle) {
        const currentMinValue = this.getHandleValue(this.minHandle);
        const newValue = Math.max(value, currentMinValue);
        this.updateHandlePosition(this.maxHandle, newValue);
        this.config.maxValue = newValue;
      }
      
      this.updateFill();
      this.updateTooltips();
      
      if (this.config.showInputs) {
        this.updateInputFields();
      }
    }

    stopDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.currentHandle) {
        this.hideTooltip(this.currentHandle);
        this.minHandle.style.zIndex = '1';
        if(this.maxHandle) this.maxHandle.style.zIndex = '1';
      }
      this.currentHandle = null;
    }

    getHandleValue(handleElement) {
      if (!handleElement || !handleElement.style.left) {
          if (handleElement === this.minHandle) return this.config.minValue;
          if (handleElement === this.maxHandle) return this.config.maxValue;
          return 0;
      }
      const posPercent = parseFloat(handleElement.style.left);
      if (isNaN(posPercent)) {
          if (handleElement === this.minHandle) return this.config.minValue;
          if (handleElement === this.maxHandle) return this.config.maxValue;
          return 0;
      }
      return this.config.minRange + (posPercent / 100) * (this.config.maxRange - this.config.minRange);
    }
    
    updateHandlePosition(handleElement, value) {
      const positionPercent = ((value - this.config.minRange) / (this.config.maxRange - this.config.minRange)) * 100;
      handleElement.style.left = `${Math.max(0, Math.min(100, positionPercent))}%`;
    }

    updateFill() {
      const minPosPercent = parseFloat(this.minHandle.style.left) || 0;
      const maxPosPercent = this.maxHandle ? (parseFloat(this.maxHandle.style.left) || 100) : 100;
      
      this.fill.style.left = `${minPosPercent}%`;
      this.fill.style.width = `${maxPosPercent - minPosPercent}%`;
    }

    updateTooltips() {
      const formatValue = (val) => `${Math.round(val)}${this.config.unit ? this.config.unit : ''}`;

      const minTooltipEl = this.minHandle.querySelector('.slider-tooltip');
      if (minTooltipEl) minTooltipEl.textContent = formatValue(this.getHandleValue(this.minHandle));
      
      if (this.maxHandle) {
        const maxTooltipEl = this.maxHandle.querySelector('.slider-tooltip');
        if (maxTooltipEl) maxTooltipEl.textContent = formatValue(this.getHandleValue(this.maxHandle));
      }
    }

    updateSliderValues(values) {
      let newMin = values[0];
      let newMax = values.length > 1 ? values[1] : this.config.maxRange;

      newMin = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMin));
      if (this.maxHandle) {
          newMax = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMax));
          if (newMin > newMax) newMin = newMax;
      } else {
      }


      this.config.minValue = newMin;
      this.updateHandlePosition(this.minHandle, this.config.minValue);

      if (this.maxHandle) {
        this.config.maxValue = newMax;
        this.updateHandlePosition(this.maxHandle, this.config.maxValue);
      }
      
      this.updateFill();
      this.updateTooltips();
      if (this.config.showInputs) {
        this.updateInputFields();
      }
    }

    setupValueSync() {
      this.valueFields.forEach((inputField) => {
        if (!inputField) return;

        inputField.addEventListener('input', () => {
          this.adjustInputWidth(inputField);
        });
        
        inputField.addEventListener('change', (event) => {
          const targetInput = event.target;
          let numericValue = parseFloat(targetInput.value.replace(/[^\d.-]/g, ''));
          
          if (isNaN(numericValue)) {
            this.updateInputFields(); 
            return;
          }

          const inputType = targetInput.dataset.type;

          let currentMin = this.getHandleValue(this.minHandle);
          let currentMax = this.maxHandle ? this.getHandleValue(this.maxHandle) : this.config.maxRange;

          if (inputType === 'min') {
            numericValue = Math.max(this.config.minRange, Math.min(numericValue, currentMax));
            this.config.minValue = numericValue;
            if (this.config.isSingleHandle && !this.maxHandle) {
                 this.updateSliderValues([this.config.minValue, this.config.maxRange]);
            } else {
                 this.updateSliderValues([this.config.minValue, currentMax]);
            }
          } else if (inputType === 'max' && this.maxHandle) {
            numericValue = Math.max(currentMin, Math.min(numericValue, this.config.maxRange));
            this.config.maxValue = numericValue;
            this.updateSliderValues([currentMin, this.config.maxValue]);
          }
        });
      });
    }

    updateInputFields() {
      if (!this.config.showInputs) return;

      const formatValue = (val) => `${Math.round(val)}${this.config.unit ? '' + this.config.unit : ''}`;
      
      if (this.minInputField) {
        this.minInputField.value = formatValue(this.getHandleValue(this.minHandle));
        this.adjustInputWidth(this.minInputField);
      }
      
      if (this.maxInputField && this.maxHandle) {
        this.maxInputField.value = formatValue(this.getHandleValue(this.maxHandle));
        this.adjustInputWidth(this.maxInputField);
      }
    }

    adjustInputWidth(input) {
      if (input) {
        input.size = Math.max(3, input.value.length || input.placeholder.length || 3);
      }
    }
  }

  global.uiComponents.sliders = {
    instances: [],
    setup: () => {
      document.querySelectorAll('.slider-container').forEach(el => {
        if (!el.classList.contains('slider-initialized')) {
          global.uiComponents.sliders.instances.push(new DualValueSlider(el));
          el.classList.add('slider-initialized');
        }
      });
    },
    destroy: () => {
        global.uiComponents.sliders.instances.forEach(instance => {
            if (typeof instance.cleanup === 'function') {
                instance.cleanup();
            }
        });
        global.uiComponents.sliders.instances = [];
        document.querySelectorAll('.slider-container.slider-initialized').forEach(el => {
            el.classList.remove('slider-initialized');
        });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', global.uiComponents.sliders.setup);
  } else {
    global.uiComponents.sliders.setup();
  }

})(window);