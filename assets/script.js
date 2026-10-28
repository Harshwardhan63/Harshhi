const pages = document.querySelectorAll('.page');
const arrows = document.querySelectorAll('.next-arrow');
const backArrows = document.querySelectorAll('.prev-arrow');
let currentPage = 0;

function showPage(nextPage) {
  if (nextPage < 0 || nextPage >= pages.length || nextPage === currentPage) return;

  pages[currentPage].classList.remove('active');
  pages[currentPage].classList.add('leaving');
  pages[nextPage].classList.remove('leaving');
  pages[nextPage].classList.add('active');

  const oldPage = currentPage;
  currentPage = nextPage;
  window.setTimeout(() => pages[oldPage].classList.remove('leaving'), 900);
}

arrows.forEach((arrow) => {
  // data-next is the zero-based index of the page to open.
  arrow.addEventListener('click', () => showPage(Number(arrow.dataset.next)));
});

backArrows.forEach((arrow) => {
  arrow.addEventListener('click', () => showPage(Number(arrow.dataset.prev)));
});

// Swipe up to continue and swipe down to go back on touch screens.
let touchStartX = 0;
let touchStartY = 0;
document.querySelector('.story').addEventListener('touchstart', (event) => {
  if (!event.touches.length) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });
document.querySelector('.story').addEventListener('touchend', (event) => {
  if (!event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  const dy = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dy) < 65 || Math.abs(dy) < Math.abs(dx) * 1.15) return;
  if (dy < 0 && currentPage < pages.length - 1) showPage(currentPage + 1);
  if (dy > 0 && currentPage > 0) showPage(currentPage - 1);
}, { passive: true });

document.getElementById('restart').addEventListener('click', () => {
  pages.forEach((page) => page.classList.remove('active', 'leaving'));
  pages[0].classList.add('active');
  currentPage = 0;
});

// Show a video when its file is available. This works for both video pages.
document.querySelectorAll('.video-frame video').forEach((video) => {
  const placeholder = video.parentElement.querySelector('.video-placeholder');

  video.addEventListener('canplay', () => {
    video.classList.add('ready');
    placeholder.hidden = true;
  });

  video.addEventListener('error', () => {
    video.classList.remove('ready');
    placeholder.hidden = false;
  });
});

const music = document.getElementById('background-music');
const musicButton = document.getElementById('music-toggle');
const pageFourMusicButton = document.getElementById('music-toggle-page4');
function updateMusicButtons() {
  const playing = !music.paused;
  musicButton.classList.toggle('playing', playing);
  musicButton.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  musicButton.title = playing ? 'Pause music' : 'Play music';
  if (pageFourMusicButton) {
    pageFourMusicButton.classList.toggle('playing', playing);
    pageFourMusicButton.textContent = playing ? 'Pause our song ♡' : 'Play our song ♡';
  }
}
async function toggleMusic() {
  if (music.paused) {
    try { await music.play(); }
    catch (error) {
      musicButton.title = 'Add your song as assets/our-song.mp3';
      if (pageFourMusicButton) pageFourMusicButton.textContent = 'Add our-song.mp3 first ♡';
      return;
    }
  } else { music.pause(); }
  updateMusicButtons();
}
musicButton.addEventListener('click', toggleMusic);
if (pageFourMusicButton) pageFourMusicButton.addEventListener('click', toggleMusic);
music.addEventListener('play', updateMusicButtons);
music.addEventListener('pause', updateMusicButtons);


// Page 3: Yes opens Page 4; the playful No button runs away.
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');

if (yesButton && noButton) {
  yesButton.addEventListener('click', () => showPage(3));

  function moveNoButton() {
    const padding = 12;
    const buttonWidth = noButton.offsetWidth || 104;
    const buttonHeight = noButton.offsetHeight || 44;
    const maxLeft = Math.max(padding, window.innerWidth - buttonWidth - padding);
    const maxTop = Math.max(padding, window.innerHeight - buttonHeight - padding);
    let left = padding + Math.random() * (maxLeft - padding);
    let top = padding + Math.random() * (maxTop - padding);

    // Avoid landing too close to the Yes button when possible.
    const yesRect = yesButton.getBoundingClientRect();
    for (let tries = 0; tries < 8; tries++) {
      const overlapsYes = left < yesRect.right + 25 && left + buttonWidth > yesRect.left - 25 &&
        top < yesRect.bottom + 25 && top + buttonHeight > yesRect.top - 25;
      if (!overlapsYes) break;
      left = padding + Math.random() * (maxLeft - padding);
      top = padding + Math.random() * (maxTop - padding);
    }

    noButton.classList.add('running-away');
    noButton.style.left = `${left}px`;
    noButton.style.top = `${top}px`;
  }

  noButton.addEventListener('pointerenter', moveNoButton);
  noButton.addEventListener('touchstart', (event) => {
    event.preventDefault();
    moveNoButton();
  }, { passive: false });
  noButton.addEventListener('click', (event) => {
    event.preventDefault();
    moveNoButton();
  });
}


// Show the Page 4 photo when assets/our-photo.jpg has been added.
const letterPhoto = document.getElementById('letter-photo');
if (letterPhoto) {
  const photoFrame = letterPhoto.parentElement;
  letterPhoto.addEventListener('load', () => {
    letterPhoto.classList.add('ready');
    photoFrame.classList.add('has-photo');
  });
  letterPhoto.addEventListener('error', () => {
    letterPhoto.classList.remove('ready');
    photoFrame.classList.remove('has-photo');
  });
  if (letterPhoto.complete && letterPhoto.naturalWidth > 0) {
    letterPhoto.classList.add('ready');
    photoFrame.classList.add('has-photo');
  }
}
