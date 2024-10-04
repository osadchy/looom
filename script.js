document.addEventListener('DOMContentLoaded', function() {
    var myCarousel = document.querySelector('#carousel');
    var carousel = new bootstrap.Carousel(myCarousel, {
        interval: 2000,
        wrap: true
    });
});

let tracks = [];

// Load library data
fetch('library.json')
  .then(response => response.json())
  .then(data => {
    const library = data.library;
    
    // Create audio tracks for each category
    for (const category in library) {
      const mainSound = library[category][0];
      const track = new Audio(`library/${category}/${mainSound}`);
      track.loop = true;
      tracks.push({ audio: track, category: category });
    }

    // Create UI elements
    createUIElements();
  })
  .catch(error => console.error('Error loading library:', error));

function createUIElements() {
  const container = document.getElementById('sound-controls');

  tracks.forEach((track, index) => {
    const div = document.createElement('div');
    div.className = 'sound-control';

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.className = 'toggle';
    toggle.id = `toggle-${index}`;

    const label = document.createElement('label');
    label.htmlFor = `toggle-${index}`;
    label.textContent = track.category;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'slider';
    slider.min = '0';
    slider.max = '100';
    slider.value = '50';

    div.appendChild(toggle);
    div.appendChild(label);
    div.appendChild(slider);

    // Add event listeners
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        track.audio.play();
      } else {
        track.audio.pause();
        track.audio.currentTime = 0;
      }
    });

    slider.addEventListener('input', () => {
      track.audio.volume = slider.value / 100;
    });
  });
}

function playPreset(preset) {
    console.log(`Playing preset: ${preset}`);
}

const myCarouselElement = document.querySelector('#carousel');

const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: 5000,
  touch: true
});