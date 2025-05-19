(function(global) {
    if (!global.uiComponents) {
        global.uiComponents = {};
    }

    class DualValueSlider {
        constructor(container) {
            this.container = container;
            this.sliderId = container.id || `slider-${Math.random().toString(36).substr(2, 9)}`;
            this.track = container.querySelector('.slider-track');
            this.minInputField = container.querySelector('.slider-min-input input');
            this.maxInputField = container.querySelector('.slider-max-input input');
            this.minHandle = null;
            this.maxHandle = null;
            this.fill = null;
            this.isDragging = false;
            this.currentHandle = null;
            this.config = {};
            this.initialize();
        }

        _log(message) {
        }

        initialize() {
            if (!this.track) {
                console.error(`[${this.sliderId}] [INITIALIZE] Slider track not found. Aborting.`);
                return;
            }
            
            const configData = JSON.parse(this.container.dataset.config || '{}');
            this._log(`[INITIALIZE] Raw data-config: ${JSON.stringify(configData)}`);
            
            this.config = {
                minRange: typeof configData.minRange === 'number' ? configData.minRange : 0,
                maxRange: typeof configData.maxRange === 'number' ? configData.maxRange : 100,
                unit: configData.unit || '',
                showInputs: !!configData.showInputs,
                isSingleHandle: configData.handles === 1
            };
            this._log(`[INITIALIZE] Parsed base config: isSingleHandle=${this.config.isSingleHandle}, minRange=${this.config.minRange}, maxRange=${this.config.maxRange}, unit='${this.config.unit}', showInputs=${this.config.showInputs}`);

            let initialMinFromData = typeof configData.minValue === 'number' ? configData.minValue : this.config.minRange;
            let initialMaxFromData = typeof configData.maxValue === 'number' ? configData.maxValue : this.config.maxRange;

            if (this.config.isSingleHandle) {
                this._log('[INITIALIZE] Mode: Single Handle');
                if (configData.showMinInput && !configData.showMaxInput) {
                    this.config.minValue = initialMinFromData;
                } else if (!configData.showMinInput && configData.showMaxInput) {
                    this.config.minValue = initialMaxFromData;
                } else {
                    this.config.minValue = initialMinFromData;
                }
                this.config.minValue = Math.max(this.config.minRange, Math.min(this.config.maxRange, this.config.minValue));
                this.config.maxValue = this.config.maxRange;
                this._log(`[INITIALIZE] Single handle config values set: minValue=${this.config.minValue}, maxValue=${this.config.maxValue} (derived from maxRange)`);
            } else {
                this._log('[INITIALIZE] Mode: Dual Handle');
                this.config.minValue = initialMinFromData;
                this.config.maxValue = initialMaxFromData;

                this.config.minValue = Math.max(this.config.minRange, Math.min(this.config.maxRange, this.config.minValue));
                this.config.maxValue = Math.max(this.config.minRange, Math.min(this.config.maxRange, this.config.maxValue));
                
                if (this.config.minValue > this.config.maxValue) {
                    this._log(`[INITIALIZE] Initial min (${this.config.minValue}) > max (${this.config.maxValue}). Swapping.`);
                    [this.config.minValue, this.config.maxValue] = [this.config.maxValue, this.config.minValue];
                }
                this._log(`[INITIALIZE] Dual handle config values set: minValue=${this.config.minValue}, maxValue=${this.config.maxValue}`);
            }
            
            this.createSliderElements();
            this.setupEvents();
            
            this._log('[INITIALIZE] Calling _updateConfigAndDOM to set initial state.');
            this._updateConfigAndDOM([this.config.minValue, this.config.isSingleHandle ? this.config.maxRange : this.config.maxValue]);
            
            if (this.config.showInputs) {
                this.setupValueSync();
            }
            this._log('[INITIALIZE] Initialization complete.');
        }

        createSliderElements() {
            this._log('[CREATE_ELEMENTS] Creating fill...');
            this.fill = document.createElement('div');
            this.fill.className = 'slider-fill';
            this.track.appendChild(this.fill);
            
            this._log('[CREATE_ELEMENTS] Creating minHandle...');
            this.minHandle = document.createElement('div');
            this.minHandle.className = 'slider-handle slider-handle-min';
            this.minHandle.setAttribute('data-handle', 'min');
            this.track.appendChild(this.minHandle);
            
            const minTooltip = document.createElement('div');
            minTooltip.className = 'slider-tooltip';
            minTooltip.style.display = 'none';
            this.minHandle.appendChild(minTooltip);
            
            if (!this.config.isSingleHandle) {
                this._log('[CREATE_ELEMENTS] Creating maxHandle for dual slider...');
                this.maxHandle = document.createElement('div');
                this.maxHandle.className = 'slider-handle slider-handle-max';
                this.maxHandle.setAttribute('data-handle', 'max');
                this.track.appendChild(this.maxHandle);
                
                const maxTooltip = document.createElement('div');
                maxTooltip.className = 'slider-tooltip';
                maxTooltip.style.display = 'none';
                this.maxHandle.appendChild(maxTooltip);
            }
            this._log('[CREATE_ELEMENTS] Elements created.');
        }

        _updateConfigAndDOM(newValues, source = null) {
            let [newMin, newMaxAttempt] = newValues.map(v => parseFloat(v));

            this._log(`[_UPDATE_CONFIG_AND_DOM] Source: ${source}. Incoming values: newMin=${newMin}, newMaxAttempt=${newMaxAttempt}. Current config BEFORE: min=${this.config.minValue}, max=${this.config.maxValue}`);

            newMin = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMin));
            
            if (this.config.isSingleHandle) {
                this.config.minValue = newMin;
                this._log(`[_UPDATE_CONFIG_AND_DOM] Single Handle: Config updated. minValue=${this.config.minValue}`);
            } else {
                let newMax = newMaxAttempt;
                newMax = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMax));

                if (source === 'minInput' || source === 'minDrag') {
                    if (newMin > newMax) {
                        this._log(`[_UPDATE_CONFIG_AND_DOM] Min change caused potential crossover: newMin (${newMin}) > newMax (${newMax}). Setting newMin = newMax.`);
                        newMin = newMax;
                    }
                } else if (source === 'maxInput' || source === 'maxDrag') {
                    if (newMax < newMin) {
                        this._log(`[_UPDATE_CONFIG_AND_DOM] Max change caused potential crossover: newMax (${newMax}) < newMin (${newMin}). Setting newMax = newMin.`);
                        newMax = newMin;
                    }
                } else {
                    if (newMin > newMax) {
                        this._log(`[_UPDATE_CONFIG_AND_DOM] General crossover or init: newMin (${newMin}) > newMax (${newMax}). Setting newMin = newMax (min is weaker).`);
                        newMin = newMax;
                    }
                }
                
                this.config.minValue = newMin;
                this.config.maxValue = newMax;
                this._log(`[_UPDATE_CONFIG_AND_DOM] Dual Handle: Config updated. minValue=${this.config.minValue}, maxValue=${this.config.maxValue}`);
            }

            this._updateSliderDOMOnly();

            if (this.config.showInputs) {
                this._log(`[_UPDATE_CONFIG_AND_DOM] Calling updateInputFields.`);
                this.updateInputFields();
            }
            this._log(`[_UPDATE_CONFIG_AND_DOM] Update cycle finished.`);
        }

        _updateSliderDOMOnly() {
            this._log(`[_UPDATE_SLIDER_DOM_ONLY] Updating slider visuals. config.minValue=${this.config.minValue}, config.maxValue=${this.config.maxValue}`);
            this.updateHandlePosition(this.minHandle, this.config.minValue);
            if (this.maxHandle) {
                this.updateHandlePosition(this.maxHandle, this.config.maxValue);
            }
            this.updateFill();
            this.updateTooltips();
        }
        
        updateHandlePosition(handleElement, value) {
            if (!handleElement) return;
            const range = this.config.maxRange - this.config.minRange;
            const positionPercent = range === 0 ? 0 : ((parseFloat(value) - this.config.minRange) / range) * 100;
            handleElement.style.left = `${Math.max(0, Math.min(100, positionPercent))}%`;
            this._log(`[UPDATE_HANDLE_POS] Handle ${handleElement.dataset.handle || 'min'} set to ${positionPercent}% for value ${value}`);
        }

        updateFill() {
            const minVal = parseFloat(this.config.minValue);
            const maxValForFill = this.maxHandle ? parseFloat(this.config.maxValue) : minVal; 
            const range = this.config.maxRange - this.config.minRange;

            if (range === 0) {
                this.fill.style.left = '0%';
                this.fill.style.width = '0%';
                this._log('[UPDATE_FILL] Range is 0. Fill set to 0% width.');
                return;
            }

            let minPosPercent = ((minVal - this.config.minRange) / range) * 100;
            minPosPercent = Math.max(0, Math.min(100, minPosPercent));
            
            if (this.maxHandle) {
                let maxPosPercent = ((maxValForFill - this.config.minRange) / range) * 100;
                maxPosPercent = Math.max(0, Math.min(100, maxPosPercent));
                this.fill.style.left = `${minPosPercent}%`;
                this.fill.style.width = `${Math.max(0, maxPosPercent - minPosPercent)}%`;
                this._log(`[UPDATE_FILL] Dual: left=${minPosPercent}%, width=${Math.max(0, maxPosPercent - minPosPercent)}%`);
            } else {
                this.fill.style.left = `0%`;
                this.fill.style.width = `${minPosPercent}%`;
                this._log(`[UPDATE_FILL] Single: left=0%, width=${minPosPercent}%`);
            }
        }

        updateTooltips() {
            const format = (val) => `${Math.round(parseFloat(val))}${this.config.unit || ''}`;
            if (this.minHandle) {
                const tt = this.minHandle.querySelector('.slider-tooltip');
                if (tt) tt.textContent = format(this.config.minValue);
            }
            if (this.maxHandle) {
                const tt = this.maxHandle.querySelector('.slider-tooltip');
                if (tt) tt.textContent = format(this.config.maxValue);
            }
            this._log('[UPDATE_TOOLTIPS] Tooltips updated.');
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
            this._log('[SETUP_EVENTS] Event listeners for handles and document set up.');
        }

        showTooltip(handleElement) { if (handleElement) { const tt = handleElement.querySelector('.slider-tooltip'); if (tt) tt.style.display = 'block';} }
        hideTooltip(handleElement) { if (handleElement) { const tt = handleElement.querySelector('.slider-tooltip'); if (tt) tt.style.display = 'none';} }
        
        startDrag(e, handleElement) {
            e.preventDefault();
            this.isDragging = true;
            this.currentHandle = handleElement;
            this.showTooltip(this.currentHandle);
            this.minHandle.style.zIndex = (this.currentHandle === this.minHandle) ? '10' : '2';
            if (this.maxHandle) {
                this.maxHandle.style.zIndex = (this.currentHandle === this.maxHandle) ? '10' : '2';
            }
            this._log(`[START_DRAG] Drag started on handle: ${handleElement.dataset.handle}`);
        }

        stopDrag() {
            if (!this.isDragging) return;
            this._log(`[STOP_DRAG] Drag stopped. Current handle: ${this.currentHandle ? this.currentHandle.dataset.handle : 'none'}`);
            this.isDragging = false;
            if (this.currentHandle) {
                this.hideTooltip(this.currentHandle);
                this.minHandle.style.zIndex = '2';
                if(this.maxHandle) this.maxHandle.style.zIndex = '2';
            }
            this.currentHandle = null;
        }

        handleDrag(e) {
            if (!this.isDragging || !this.currentHandle) return;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (typeof clientX === 'undefined') return;
            
            const trackRect = this.track.getBoundingClientRect();
            const range = this.config.maxRange - this.config.minRange;
            let positionPercent = (clientX - trackRect.left) / trackRect.width;
            positionPercent = Math.max(0, Math.min(1, positionPercent));
            let valueFromPos = this.config.minRange + positionPercent * (range === 0 ? 0 : range);

            let newCalculatedMin = parseFloat(this.config.minValue);
            let newCalculatedMax = this.config.isSingleHandle ? parseFloat(this.config.maxRange) : parseFloat(this.config.maxValue);
            let sourceOfChange = null;

            if (this.currentHandle.dataset.handle === 'min') {
                newCalculatedMin = valueFromPos;
                sourceOfChange = 'minDrag';
            } else if (this.currentHandle.dataset.handle === 'max' && this.maxHandle) {
                newCalculatedMax = valueFromPos;
                sourceOfChange = 'maxDrag';
            }
            this._log(`[HANDLE_DRAG] Source: ${sourceOfChange}, Calculated values: min=${newCalculatedMin}, max=${newCalculatedMax}`);
            this._updateConfigAndDOM([newCalculatedMin, newCalculatedMax], sourceOfChange);
        }

        setupValueSync() {
            this._log('[SETUP_VALUE_SYNC] Setting up listeners for inputs.');
            const inputsToSync = [];
            if(this.minInputField) inputsToSync.push(this.minInputField);
            if(this.maxInputField) inputsToSync.push(this.maxInputField);

            inputsToSync.forEach((inputField) => {
                inputField.addEventListener('blur', () => { });
                inputField.addEventListener('input', () => { });
                
                inputField.addEventListener('change', (event) => {
                    const targetInput = event.target;
                    const parentSliderInput = targetInput.closest('.slider-input');
                    let inputType = null;
                    if (parentSliderInput && parentSliderInput.dataset.type) {
                        inputType = parentSliderInput.dataset.type;
                    } else if (targetInput.id.toLowerCase().includes('min-input')) {
                        inputType = 'min';
                    } else if (targetInput.id.toLowerCase().includes('max-input')) {
                        inputType = 'max';
                    }

                    this._log(`[INPUT_CHANGE] Event on input: type='${inputType}', raw value: '${targetInput.value}'`);
                    if (!inputType) {
                        this._log('[INPUT_CHANGE] ERROR: Could not determine input type (min/max). Aborting change.');
                        this.updateInputFields();
                        return;
                    }
                    const numericString = targetInput.value.replace(/[^0-9.-]/g, ''); 
                    let numericValue = parseFloat(numericString);
                    
                    if (isNaN(numericValue)) { return; }
                    this._log(`[INPUT_CHANGE] Parsed numericValue: ${numericValue}`);
                    
                    let finalNewMin = parseFloat(this.config.minValue); 
                    let finalNewMax = this.config.isSingleHandle ? parseFloat(this.config.maxRange) : parseFloat(this.config.maxValue);
                    let sourceOfChange = null;

                    if (this.config.isSingleHandle) {
                        finalNewMin = numericValue; 
                        sourceOfChange = inputType === 'min' ? 'minInput' : 'maxInput';
                        this._log(`[INPUT_CHANGE] Single Handle: finalNewMin from input: ${finalNewMin}, source: ${sourceOfChange}`);
                    } else {
                        if (inputType === 'min') {
                            finalNewMin = numericValue;
                            sourceOfChange = 'minInput';
                            this._log(`[INPUT_CHANGE] Dual Handle (min input): newMinAttempt=${finalNewMin}. Current config.maxValue=${finalNewMax}. Source: ${sourceOfChange}`);
                        } else {
                            finalNewMax = numericValue;
                            sourceOfChange = 'maxInput';
                            this._log(`[INPUT_CHANGE] Dual Handle (max input): newMaxAttempt=${finalNewMax}. Current config.minValue=${finalNewMin}. Source: ${sourceOfChange}`);
                        }
                    }
                    this._log(`[INPUT_CHANGE] Values to pass to _updateConfigAndDOM: min=${finalNewMin}, max=${finalNewMax}, source=${sourceOfChange}`);
                    this._updateConfigAndDOM([finalNewMin, finalNewMax], sourceOfChange);
                });
            });
        }

        updateInputFields() {
            if (!this.config.showInputs) return;
            this._log(`[UPDATE_INPUT_FIELDS] Updating inputs. Config: min=${this.config.minValue}, max=${this.config.maxValue}, unit='${this.config.unit}'`);

            const currentUnit = this.config.unit || '';
            const formatValue = (val) => `${Math.round(parseFloat(val))}${currentUnit}`; 
            
            if (this.minInputField) {
                this.minInputField.value = formatValue(this.config.minValue);
                this.adjustInputWidth(this.minInputField);
                this._log(`[UPDATE_INPUT_FIELDS] Min input set to: '${this.minInputField.value}'`);
            }
            
            if (this.maxInputField) {
                let valueForMaxInput;
                if (!this.config.isSingleHandle) {
                    valueForMaxInput = this.config.maxValue;
                } else {
                    if (!this.minInputField || !this.container.querySelector('.slider-min-input')) {
                        if (this.container.querySelector('.slider-max-input')) {
                            valueForMaxInput = this.config.minValue; 
                        }
                    }
                }
                
                if (typeof valueForMaxInput !== 'undefined') {
                    this.maxInputField.value = formatValue(valueForMaxInput);
                    this.adjustInputWidth(this.maxInputField);
                    this._log(`[UPDATE_INPUT_FIELDS] Max input set to: '${this.maxInputField.value}'`);
                } else {
                    this._log('[UPDATE_INPUT_FIELDS] Max input not updated (valueForMaxInput is undefined for current config).');
                }
            }
        }

        adjustInputWidth(input) {
            if (input) {
                const length = Math.max(1, input.value.length || (input.placeholder ? input.placeholder.length : 0) || 1);
                input.style.width = `${Math.max(1.5, length * 0.65)}em`; 
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