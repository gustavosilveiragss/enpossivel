const hamburgerMenu = document.querySelector('.hamburger-menu');
const optionsBar = document.querySelector('.nav-menu');

hamburgerMenu.addEventListener('click', () => {
  optionsBar.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  const clickOnBar = optionsBar.contains(event.target);
  const clickOutside = hamburgerMenu.contains(event.target);

  if (!clickOnBar && !clickOutside) {
    optionsBar.classList.remove('active');
  }
});