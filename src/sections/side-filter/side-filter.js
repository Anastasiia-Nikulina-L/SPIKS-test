class SideFilter {
  constructor(element) {
    this.filter = element;
    this.groups = this.filter.querySelectorAll('.side-filter__group');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initAccessibility();
  }

  setupEventListeners() {
    this.filter.addEventListener('click', (e) => {
      const header = e.target.closest('.side-filter__header');
      if (!header) return;
      
      const group = header.parentElement;
      this.toggleGroup(group);
    });

    this.filter.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const header = e.target.closest('.side-filter__header');
        if (header) this.toggleGroup(header.parentElement);
      }
    });
  }

  toggleGroup(group) {
    const isOpen = group.classList.toggle('is-open');
    const header = group.querySelector('.side-filter__header');
    const options = group.querySelector('.side-filter__options');
    
    header.setAttribute('aria-expanded', isOpen);
    options.setAttribute('aria-hidden', !isOpen);
  }

  initAccessibility() {
    this.groups.forEach(group => {
      const isOpen = group.classList.contains('is-open');
      const header = group.querySelector('.side-filter__header');
      const options = group.querySelector('.side-filter__options');
      
      header.setAttribute('aria-expanded', isOpen);
      options.setAttribute('aria-hidden', !isOpen);
    });
  }

  destroy() {
    this.filter.removeEventListener('click', this.handleClick);
    this.filter.removeEventListener('keydown', this.handleKeydown);
  }
}

document.querySelectorAll('.side-filter').forEach(filter => {
  new SideFilter(filter);
});