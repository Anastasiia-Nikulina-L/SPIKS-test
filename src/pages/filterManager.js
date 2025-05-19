document.addEventListener('DOMContentLoaded', () => {
  const sideFilterElement = document.querySelector('.side-filter');
  const headerFilterButtonsContainer = document.querySelector('.header__filter-buttons');
  const resultsSubtitle = document.querySelector('.header__subtitle');

  let activeFilterButtons = {};

  function updateResultsHeader() {
    const buttonCount = Object.keys(activeFilterButtons).length;
  }


  document.body.addEventListener('filterSelectionChanged', (e) => {
    if (!e.target.classList.contains('side-filter')) return;

    const { id, label, checked } = e.detail;

    if (checked) {
      if (!activeFilterButtons[id]) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.innerHTML = `
          <div class="green-button" data-filter-id="${id}">
            <label class="green-button_label">${label}</label>
            <button class="green-button__close" type="button" aria-label="Remove ${label}">
            <svg class="icon-Cancel" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <use href="./assets/icons/default/sprite.svg#Cancel"></use>
                  </svg>
            </button>
          </button>
        `;
        const newButton = buttonWrapper.firstElementChild;
        headerFilterButtonsContainer.appendChild(newButton);
        activeFilterButtons[id] = newButton;
      }
    } else {
      if (activeFilterButtons[id]) {
        activeFilterButtons[id].remove();
        delete activeFilterButtons[id];
      }
    }
    updateResultsHeader();
  });

  headerFilterButtonsContainer.addEventListener('click', (e) => {
    const closeButton = e.target.closest('.green-button__close');
    if (closeButton) {
      const greenButton = closeButton.closest('.green-button[data-filter-id]');
      if (greenButton) {
        const checkboxId = greenButton.dataset.filterId;
        const sideFilterInstance = findSideFilterInstance(sideFilterElement);

        if (sideFilterInstance) {
          sideFilterInstance.setCheckboxState(checkboxId, false);
        } else {
          const checkbox = sideFilterElement.querySelector(`#${checkboxId}`);
          if (checkbox) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    }
  });
  function findSideFilterInstance(element) {
    return null;
  }
});