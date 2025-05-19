class SideFilter {
  constructor(element) {
    this.filter = element;
    this.groups = this.filter.querySelectorAll('.side-filter__group');
    // Store bound event handlers for proper removal in destroy()
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleHeaderKeydown = this.handleHeaderKeydown.bind(this);
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initAccessibility(); // Initialize ARIA states on load
  }

  setupEventListeners() {
    // Use event delegation on the filter container for clicks
    this.filter.addEventListener('click', this.handleHeaderClick);

    // Add keydown listeners to each header for better focus management if needed,
    // or delegate if structure guarantees headers are direct children for keydown events.
    // For simplicity, iterating here is fine given the small number of groups typically.
    this.groups.forEach(group => {
      const header = group.querySelector('.side-filter__header');
      if (header) {
        header.addEventListener('keydown', this.handleHeaderKeydown);
      }
    });
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
    // Check if the event target is indeed a header itself,
    // e.target.closest() is not strictly needed here if listener is on header
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const group = e.currentTarget.parentElement; // e.currentTarget is the header
      if (group.classList.contains('side-filter__group')) {
        this.toggleGroup(group);
      }
    }
  }

  toggleGroup(group) {
    const isOpen = group.classList.toggle('is-open');
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
        // Ensure options are truly hidden if not is-open initially
        if (!isOpen) {
            // options.style.visibility = 'hidden'; // Already handled by CSS grid-template-rows and visibility
        }
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
}

document.querySelectorAll('.side-filter').forEach(filterElement => {
  new SideFilter(filterElement);
});