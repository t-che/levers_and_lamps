document.addEventListener('DOMContentLoaded', () => {
  const leversContainer = document.getElementById('levers');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('reset-btn');
  const numLevers = 5;
  let levers = [];
  let currentDependencies = [];

  const MAX_ON_DEPENDENCIES = 5;
  const MIN_ON_DEPENDENCIES = 3;
  const MAX_OFF_DEPENDENCIES = 3;
  const MIN_OFF_DEPENDENCIES = 1;

  const generateDependencies = () =>
    Array.from({ length: numLevers }, () => ({
      on: generateRandomDependencies(MIN_ON_DEPENDENCIES, MAX_ON_DEPENDENCIES),
      off: generateRandomDependencies(MIN_OFF_DEPENDENCIES, MAX_OFF_DEPENDENCIES),
    }));

  const generateRandomDependencies = (min, max) => {
    const affected = [];
    const numberOfDependencies = min + Math.floor(Math.random() * (max - min));
    while (affected.length < numberOfDependencies) {
      let target = Math.floor(Math.random() * numLevers);
        if (!affected.includes(target)) affected.push(target);
    }
    return affected;
  };

  const createLever = (index) => {
      const leverContainer = document.createElement('div');
      leverContainer.classList.add('lever-container');

      const lever = document.createElement('div');
      lever.classList.add('lever');
      lever.dataset.state = 'off';
      lever.dataset.index = index;

      const indicator = document.createElement('div');
      indicator.classList.add('indicator');

      leverContainer.appendChild(lever);
      leverContainer.appendChild(indicator);
       return leverContainer;
  };

  const renderLevers = () => {
    leversContainer.innerHTML = '';
    levers = Array.from({ length: numLevers }, (_, index) => {
      const leverContainer = createLever(index);
      leversContainer.appendChild(leverContainer);
      return leverContainer.querySelector('.lever');
    });

    levers.forEach((lever) =>
      lever.addEventListener('click', () => {
        toggleLever(lever);
        checkWin();
      })
    );
  };

  const toggleLever = (clickedLever) => {
    const index = parseInt(clickedLever.dataset.index);
    const newState = toggleState(clickedLever);
    updateIndicators();
    applyDependencies(index, newState);
    updateIndicators();
  };

  const toggleState = (lever) => {
    lever.dataset.state = lever.dataset.state === 'off' ? 'on' : 'off';
    return lever.dataset.state;
  };

    const applyDependencies = (index, newState) => {
        const affected = newState === 'on' ? currentDependencies[index].on : currentDependencies[index].off;
        affected.forEach(depIndex => {
            if (depIndex !== index) toggleState(levers[depIndex]);
        });
    };

  const updateIndicators = () => {
    levers.forEach((lever) => {
      const indicator = lever.parentElement.querySelector('.indicator');
      indicator.classList.toggle('on', lever.dataset.state === 'on');
    });
  };

  const checkWin = () => {
    const allOn = levers.every((lever) => lever.dataset.state === 'on');
    message.textContent = allOn ? 'Решено!' : '';
    message.style.color = allOn ? 'lime' : 'initial';
  };

  const resetGame = () => {
    currentDependencies = generateDependencies();
    renderLevers();
    message.textContent = '';
    message.style.color = 'initial';
  };

  resetBtn.addEventListener('click', resetGame);
  currentDependencies = generateDependencies();
  renderLevers();
});