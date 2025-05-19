class SideFilter {
  constructor(element) {
    this.filter = element;
    this.groups = this.filter.querySelectorAll('.side-filter__group');
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleHeaderKeydown = this.handleHeaderKeydown.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this); 
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initAccessibility();
  }

  setupEventListeners() {
    this.filter.addEventListener('click', this.handleHeaderClick);
    this.groups.forEach(group => {
      const header = group.querySelector('.side-filter__header');
      if (header) {
        header.addEventListener('keydown', this.handleHeaderKeydown);
      }
    });
    this.filter.addEventListener('change', this.handleCheckboxChange);
  }

  

    handleCheckboxChange(e) {
  const checkboxInput = e.target;

  if (checkboxInput.type === 'checkbox' && checkboxInput.classList.contains('checkbox__input') && checkboxInput.closest('.side-filter__option')) {
    let labelText = 'Unknown Filter';

    const labelWrapper = checkboxInput.closest('label.checkbox');

    if (labelWrapper) {
      const textElement = labelWrapper.querySelector('.checkbox__text');
      if (textElement) {
        labelText = textElement.textContent.trim();
      } else {
        console.warn(`span.checkbox__text not found inside label for checkbox id "${checkboxInput.id}"`);
      }
    } else {
      console.warn(`label.checkbox wrapper not found for checkbox id "${checkboxInput.id}"`);
    }

    const checkboxId = checkboxInput.id;

    if (!checkboxId) {
      console.error('Checkbox ID is missing from input element!');
      return;
    }

    const event = new CustomEvent('filterSelectionChanged', {
      bubbles: true,
      detail: {
        id: checkboxId,
        name: checkboxInput.name,
        label: labelText,
        checked: checkboxInput.checked
      }
    });
    this.filter.dispatchEvent(event);
  }
}

  handleHeaderClick(e) {
    const header = e.target.closest('.side-filter__header');
    if (!header) return;
    const group = header.parentElement;
    if (group.classList.contains('side-filter__group')) {
      this.toggleGroup(group);
    }
  }

  handleHeaderKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const group = e.currentTarget.parentElement;
      if (group.classList.contains('side-filter__group')) {
        this.toggleGroup(group);
      }
    }
  }

  toggleGroup(group) {
    group.classList.toggle('is-open');

    const header = group.querySelector('.side-filter__header');
    const options = group.querySelector('.side-filter__options');
    
    if (header) {
      header.setAttribute('aria-expanded', isOpen.toString());
    }
    if (options) {
      options.setAttribute('aria-hidden', (!isOpen).toString());
    }
  }

  initAccessibility() {
    this.groups.forEach(group => {
      const isOpen = group.classList.contains('is-open');
      const header = group.querySelector('.side-filter__header');
      const options = group.querySelector('.side-filter__options');

      if (header) {
        header.setAttribute('aria-expanded', isOpen.toString());
      }
      if (options) {
        options.setAttribute('aria-hidden', (!isOpen).toString());
      }
    });
  }

  destroy() {
    this.filter.removeEventListener('click', this.handleHeaderClick);
    this.groups.forEach(group => {
      const header = group.querySelector('.side-filter__header');
      if (header) {
        header.removeEventListener('keydown', this.handleHeaderKeydown);
      }
    });
  }
  setCheckboxState(checkboxId, isChecked) {
    const checkbox = this.filter.querySelector(`#${checkboxId}`);
    if (checkbox) {
      if (checkbox.checked !== isChecked) {
        checkbox.checked = isChecked;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.side-filter').forEach(filterElement => {
    new SideFilter(filterElement);
  });
});