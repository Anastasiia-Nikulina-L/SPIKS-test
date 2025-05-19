(function(global) {
    if (!global.uiComponents) {
        global.uiComponents = {};
    }

    class ValueSliderNoui {
        constructor(container) {
            this.container = container;
            this.config = JSON.parse(container.dataset.config || '{}');
            this.sliderId = container.dataset.sliderId;
            this.sliderElement = container.querySelector(`#${this.sliderId}`);

            this.minInputField = null;
            this.maxInputField = null;

            if (this.config.showInputs) {
                if (this.config.showMinInput) {
                    this.minInputField = container.querySelector(`#min-input-${this.sliderId}`);
                }
                if (this.config.showMaxInput) {
                    this.maxInputField = container.querySelector(`#max-input-${this.sliderId}`);
                }
            }
            this.nouiInstance = null;
            this.initialize();
        }

        initialize() {
            const startValues = [];
            if (this.config.isSingleHandle) {
                startValues.push(this.config.minValue);
            } else {
                startValues.push(this.config.minValue, this.config.maxValue);
            }

            const formatter = {
                to: (value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue)) return '';
                    return `${Math.round(numValue)}${this.config.unit || ''}`;
                },
                from: (value) => {
                    if (typeof value !== 'string') {
                        return Number(value);
                    }
                    const numericString = value.replace(/[^0-9.-]/g, "");
                    if (numericString === "." || numericString === "-" || numericString === "-." || numericString === "") {
                        return NaN;
                    }
                    return Number(numericString);
                }
            };
            
            const nouiOptions = {
                start: startValues,
                connect: this.config.isSingleHandle ? 'lower' : true,
                range: {
                    'min': this.config.minRange,
                    'max': this.config.maxRange
                },
                step: 1,
                tooltips: this.config.isSingleHandle ? [formatter] : [formatter, formatter],
                format: formatter,
            };

            this.nouiInstance = noUiSlider.create(this.sliderElement, nouiOptions);

            if (this.config.showInputs) {
                this.setupInputSync();
            }

            if (this.minInputField) this.adjustInputWidth(this.minInputField);
            if (this.maxInputField) this.adjustInputWidth(this.maxInputField);
        }

        setupInputSync() {
            const inputsToSync = [];
            if (this.minInputField) inputsToSync.push(this.minInputField);
            if (this.maxInputField) inputsToSync.push(this.maxInputField);

            this.nouiInstance.on('update', (values, handle) => {
                const numericValues = values.map(v => this.nouiInstance.options.format.from(v));

                if (this.config.isSingleHandle) {
                    const singleValue = numericValues[0];
                    if (this.minInputField) {
                        this.minInputField.value = this.nouiInstance.options.format.to(singleValue);
                        this.adjustInputWidth(this.minInputField);
                    }
                    if (this.maxInputField) {
                         this.maxInputField.value = this.nouiInstance.options.format.to(singleValue);
                         this.adjustInputWidth(this.maxInputField);
                    }
                } else {
                    if (this.minInputField) {
                        this.minInputField.value = this.nouiInstance.options.format.to(numericValues[0]);
                        this.adjustInputWidth(this.minInputField);
                    }
                    if (this.maxInputField) {
                        this.maxInputField.value = this.nouiInstance.options.format.to(numericValues[1]);
                        this.adjustInputWidth(this.maxInputField);
                    }
                }
            });

            const handleInputChange = (inputElement) => {
                const sliderInputElement = inputElement.closest('.slider-input');
                let dataType = undefined;

                if (sliderInputElement) {
                    if (sliderInputElement.hasAttribute('data-type')) {
                        dataType = sliderInputElement.getAttribute('data-type');
                    } else {
                        let attrs = "";
                        for (let i = 0; i < sliderInputElement.attributes.length; i++) {
                            attrs += ` ${sliderInputElement.attributes[i].name}="${sliderInputElement.attributes[i].value}"`;
                        }
                    }
                } 

                let value = this.nouiInstance.options.format.from(inputElement.value);

                if (isNaN(value)) {
                    const currentSliderValues = this.nouiInstance.get(true);
                    if (this.config.isSingleHandle) {
                        inputElement.value = this.nouiInstance.options.format.to(currentSliderValues[0]);
                    } else {
                        if (dataType === 'min' && this.minInputField === inputElement) {
                            inputElement.value = this.nouiInstance.options.format.to(currentSliderValues[0]);
                        } else if (dataType === 'max' && this.maxInputField === inputElement) {
                            inputElement.value = this.nouiInstance.options.format.to(currentSliderValues[1]);
                        }
                    }
                    this.adjustInputWidth(inputElement);
                    return;
                }
                
                value = Math.max(this.config.minRange, Math.min(this.config.maxRange, value));

                if (this.config.isSingleHandle) {
                    this.nouiInstance.set(value);
                } else {
                    const currentValues = this.nouiInstance.get(true);
                    if (dataType === 'min') {
                        let newMin = value;
                        if (newMin > currentValues[1]) {
                            newMin = currentValues[1];
                        }
                        this.nouiInstance.set([newMin, null]);
                    } else if (dataType === 'max') {
                        let newMax = value;
                        if (newMax < currentValues[0]) {
                            newMax = currentValues[0];
                        }
                        this.nouiInstance.set([null, newMax]);
                    }
                }
            };

            inputsToSync.forEach(inputField => {
                inputField.addEventListener('change', (event) => {
                    handleInputChange(event.target);
                });

                inputField.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        event.preventDefault();
                        handleInputChange(event.target);
                    }
                });

                inputField.addEventListener('input', (event) => {
                    this.adjustInputWidth(event.target);
                });
            });
        }
        
        adjustInputWidth(input) {
            if (input) {
                const length = Math.max(1, input.value.length || (input.placeholder ? input.placeholder.length : 0) || 1);
                input.style.width = `${Math.max(1.5, length * 0.70)}em`;
            }
        }

        destroy() {
            if (this.nouiInstance) {
                this.nouiInstance.destroy();
            }
        }
    }

    global.uiComponents.nouiSliders = {
        instances: [],
        setup: () => {
            document.querySelectorAll('.noui-slider-container').forEach(el => {
                if (!el.classList.contains('noui-slider-initialized')) {
                    const instance = new ValueSliderNoui(el);
                    if (instance.nouiInstance) {
                        global.uiComponents.nouiSliders.instances.push(instance);
                        el.classList.add('noui-slider-initialized');
                    }
                }
            });
        },
        destroy: () => {
            global.uiComponents.nouiSliders.instances.forEach(instance => {
                instance.destroy();
            });
            global.uiComponents.nouiSliders.instances = [];
            document.querySelectorAll('.noui-slider-container.noui-slider-initialized').forEach(el => {
                el.classList.remove('noui-slider-initialized');
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', global.uiComponents.nouiSliders.setup);
    } else {
        global.uiComponents.nouiSliders.setup();
    }

})(window);