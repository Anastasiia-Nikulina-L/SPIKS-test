(function(global) {
  if (!global.uiComponents) {
    global.uiComponents = {};
  }

  class DualValueSlider {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('.slider-track');
      this.valueFields = container.querySelectorAll('.slider-input input');
      
      this.initialize();
    }

    initialize() {
      if (!this.track) return;
      
      const config = JSON.parse(this.container.dataset.config || '{}');
      const isSingleHandle = config.handles === 1;
      
      const sliderConfig = {
        start: isSingleHandle 
          ? [config.minValue || 0] 
          : [config.minValue || 0, config.maxValue || 100],
        connect: isSingleHandle ? 'lower' : true,
        range: {
          min: config.minRange || 0,
          max: config.maxRange || 100
        },
        tooltips: isSingleHandle 
          ? [{
              to: value => `${Math.round(value)}${config.unit ? ' ' + config.unit : ''}`
            }]
          : [true, {
              to: value => `${Math.round(value)}${config.unit ? ' ' + config.unit : ''}`
            }]
      };

      noUiSlider.create(this.track, sliderConfig);
      
      if (config.showInputs) {
        this.setupValueSync(config.unit);
      }
    }

    setupValueSync(unit = '') {
      this.track.noUiSlider.on('update', (values, handleIndex) => {
        const input = this.valueFields[handleIndex];
        if (!input) return;
        
        const formattedValue = `${Math.round(values[handleIndex])}${unit ? ' ' + unit : ''}`;
        input.value = formattedValue;
        input.size = Math.max(3, formattedValue.length);
      });

      this.valueFields.forEach((field, index) => {
        if (index === this.valueFields.length - 1) {
          field.disabled = true;
        }
        
        field.addEventListener('input', () => this.adjustInputWidth(field));
        field.addEventListener('keydown', (e) => this.handleInputKey(e, index));
      });
    }

    adjustInputWidth(input) {
      input.size = Math.max(3, input.value.length);
    }

    handleInputKey(event, handleIndex) {
      if (event.key === 'Enter') {
        const numericValue = event.target.value.replace(/\D/g, '');
        this.track.noUiSlider.setHandle(handleIndex, numericValue);
      }
    }

    cleanup() {
      this.valueFields.forEach(field => {
        field.removeEventListener('input', this.adjustInputWidth);
        field.removeEventListener('keydown', this.handleInputKey);
      });
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