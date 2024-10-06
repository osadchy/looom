class SoundController {
    constructor() {
        this.audioTracks = {};
        this.library = null;
    }

    async initialize() {
        try {
            const response = await fetch('library.json');
            this.library = await response.json();
            this.setupEventListeners();
            console.log('Library loaded:', this.library);
        } catch (error) {
            console.error('Error loading the audio library:', error);
        }
    }

    setupEventListeners() {
        const controls = document.querySelectorAll('.audio-control');
        controls.forEach((control, index) => {
            let theme = control.getAttribute('data-theme');
            if (!theme) {
                console.warn(`Missing data-theme attribute for audio-control element ${index}:`, control);
                return;
            }

            theme = theme.toLowerCase();
            const toggle = control.querySelector('.toggle');
            const slider = control.querySelector('.slider');

            if (!toggle || !slider) {
                console.warn(`Missing toggle or slider for theme "${theme}":`, control);
                return;
            }

            toggle.addEventListener('change', () => this.handleToggle(theme, toggle.checked));
            slider.addEventListener('input', () => this.handleVolumeChange(theme, slider.value));
            console.log(`Event listeners set up for ${theme}`);
        });

        console.log(`Total audio controls found: ${controls.length}`);
    }

    async handleToggle(theme, isChecked) {
        console.log(`Toggle ${theme}: ${isChecked}`);
        if (isChecked) {
            await this.playRandomTrack(theme);
        } else {
            this.stopTrack(theme);
        }
    }

    async playRandomTrack(theme) {
        if (this.audioTracks[theme]) {
            this.audioTracks[theme].pause();
            console.log(`Paused existing track for theme: ${theme}`);
        }

        const tracks = this.library.library[theme];
        if (!tracks || tracks.length === 0) {
            console.error(`No tracks found for theme: ${theme}`);
            return;
        }

        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        const audioPath = `library/${theme}/${randomTrack}`;
        console.log(`Attempting to play: ${audioPath}`);

        const audio = new Audio(audioPath);
        audio.loop = true;

        try {
            this.audioTracks[theme] = audio;
            await audio.play();
            const volumeSlider = document.querySelector(`.audio-control[data-theme="${theme.charAt(0).toUpperCase() + theme.slice(1)}"] .slider`);
            if (volumeSlider) {
                this.handleVolumeChange(theme, volumeSlider.value);
            } else {
                console.warn(`Volume slider not found for theme: ${theme}`);
            }
            console.log(`Playing: ${randomTrack} for theme: ${theme}`);
        } catch (error) {
            console.error(`Error playing ${randomTrack}:`, error);
        }
    }

    stopTrack(theme) {
        if (this.audioTracks[theme]) {
            this.audioTracks[theme].pause();
            this.audioTracks[theme].currentTime = 0;
            delete this.audioTracks[theme];
            console.log(`Stopped track for theme: ${theme}`);
        } else {
            console.warn(`No active track to stop for theme: ${theme}`);
        }
    }

    handleVolumeChange(theme, volume) {
        if (this.audioTracks[theme]) {
            this.audioTracks[theme].volume = volume / 100;
            console.log(`Volume for ${theme}: ${volume}%`);
        } else {
            console.warn(`No active track to change volume for theme: ${theme}`);
        }
    }
}

class MixtureController {
    constructor(soundController) {
        this.soundController = soundController;
        this.activeMixture = null;
        this.shuffleController = null; // Will be set later
        this.activeCard = null;
    }

    setShuffleController(shuffleController) {
        this.shuffleController = shuffleController;
    }

    toggleSounds(sound1, sound2) {
        // Stop shuffle session if active
        if (this.shuffleController) {
            this.shuffleController.stopShuffleSession();
        }

        // Stop previous mixture if exists
        if (this.activeMixture) {
            this.stopMixture(this.activeMixture.sound1, this.activeMixture.sound2);
        }

        // Start new mixture
        this.startMixture(sound1, sound2);

        // Update card colors
        this.updateCardColors(sound1, sound2);
    }

    stopMixture(sound1, sound2) {
        this.soundController.stopTrack(sound1.toLowerCase());
        this.soundController.stopTrack(sound2.toLowerCase());
        this.updateToggleUI(sound1, false);
        this.updateToggleUI(sound2, false);
        console.log(`Stopped mixture: ${sound1} and ${sound2}`);
    }

    async startMixture(sound1, sound2) {
        await this.soundController.handleToggle(sound1.toLowerCase(), true);
        await this.soundController.handleToggle(sound2.toLowerCase(), true);
        this.updateToggleUI(sound1, true);
        this.updateToggleUI(sound2, true);
        this.activeMixture = { sound1, sound2 };
        console.log(`Started new mixture: ${sound1} and ${sound2}`);
    }

    updateToggleUI(sound, isActive) {
        const toggle = document.querySelector(`.audio-control[data-theme="${sound}"] .toggle`);
        if (toggle) {
            toggle.checked = isActive;
        }
    }

    updateCardColors(sound1, sound2) {
        const mixtureName = `${sound1.toLowerCase()}${sound2.charAt(0).toUpperCase() + sound2.slice(1)}`;
        const cards = document.querySelectorAll('.mixture-card');
        
        cards.forEach(card => {
            const icon = card.querySelector('.material-icons-outlined');
            const text = card.querySelector('p');
            
            if (card.dataset.mixture === mixtureName) {
                card.classList.add('bg-primary', 'text-white');
                card.classList.remove('text-bg-light');
                if (icon) icon.classList.remove('text-black');
                if (text) text.classList.remove('text-black');
                this.activeCard = card;
            } else {
                card.classList.remove('bg-primary', 'text-white');
                card.classList.add('text-bg-light');
                if (icon) icon.classList.add('text-black');
                if (text) text.classList.add('text-black');
            }
        });
    }

    stopActiveMixture() {
        if (this.activeMixture) {
            this.stopMixture(this.activeMixture.sound1, this.activeMixture.sound2);
            this.activeMixture = null;
            
            // Reset active card color
            if (this.activeCard) {
                const icon = this.activeCard.querySelector('.material-icons-outlined');
                const text = this.activeCard.querySelector('p');
                
                this.activeCard.classList.remove('bg-primary', 'text-white');
                this.activeCard.classList.add('text-bg-light');
                if (icon) icon.classList.add('text-black');
                if (text) text.classList.add('text-black');
                this.activeCard = null;
            }
        }
    }

    toggleRainAndThunder() { this.toggleSounds('Rain', 'Thunder'); }
    toggleOceanAndWind() { this.toggleSounds('Ocean', 'Wind'); }
    toggleJungleAndBird() { this.toggleSounds('Jungle', 'Bird'); }
    toggleFireAndRiver() { this.toggleSounds('Fire', 'River'); }
    toggleVolcanoAndRain() { this.toggleSounds('Volcano', 'Rain'); }
    toggleCoffeeAndOffice() { this.toggleSounds('Coffee', 'Office'); }
}

class ShuffleController {
    constructor(soundController) {
        this.soundController = soundController;
        this.activeThemes = [];
        this.mixtureController = null; // Will be set later
    }

    setMixtureController(mixtureController) {
        this.mixtureController = mixtureController;
    }

    setupShuffleButton() {
        const shuffleButton = document.querySelector('.bi-shuffle').closest('a');
        if (!shuffleButton) {
            console.error('Shuffle button not found.');
            return;
        }
        shuffleButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.shuffleThemes();
        });
    }

    async shuffleThemes() {
        // Stop any active mixture
        if (this.mixtureController) {
            this.mixtureController.stopActiveMixture();
        }

        const availableThemes = Object.keys(this.soundController.library.library);

        if (availableThemes.length < 2) {
            console.error('Not enough themes to shuffle. At least two themes are required.');
            return;
        }

        // Stop all currently playing tracks
        this.stopShuffleSession();

        const shuffledThemes = this.shuffleArray(availableThemes);
        this.activeThemes = shuffledThemes.slice(0, 2);

        console.log('Selected themes for shuffle:', this.activeThemes);

        // Play only the two selected themes
        for (const theme of this.activeThemes) {
            await this.soundController.handleToggle(theme, true);
            this.updateToggleUI(theme, true);
        }

        this.enforceActiveToggles(this.activeThemes);

        // Reset all card colors
        this.resetAllCardColors();
    }

    stopShuffleSession() {
        this.activeThemes.forEach(theme => {
            this.soundController.stopTrack(theme);
            this.updateToggleUI(theme, false);
        });
        this.activeThemes = [];
    }

    updateToggleUI(theme, isActive) {
        const themeCapitalized = this.capitalizeFirstLetter(theme);
        const toggle = document.querySelector(`.audio-control[data-theme="${themeCapitalized}"] .toggle`);

        if (toggle) {
            toggle.checked = isActive;
            console.log(`Toggle UI updated for theme "${theme}": ${isActive ? 'ON' : 'OFF'}`);
        } else {
            console.warn(`Toggle switch not found for theme: ${theme}`);
        }
    }

    enforceActiveToggles(activeThemes) {
        const allToggles = document.querySelectorAll('.audio-control .toggle');
        allToggles.forEach((toggle) => {
            const control = toggle.closest('.audio-control');
            const theme = control.getAttribute('data-theme').toLowerCase();
            toggle.checked = activeThemes.includes(theme);
        });
        console.log('Enforced only the selected toggles are active.');
    }

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    resetAllCardColors() {
        const cards = document.querySelectorAll('.mixture-card');
        cards.forEach(card => {
            const icon = card.querySelector('.material-icons-outlined');
            const text = card.querySelector('p');
            
            card.classList.remove('bg-primary', 'text-white');
            card.classList.add('text-bg-light');
            if (icon) icon.classList.add('text-black');
            if (text) text.classList.add('text-black');
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const soundController = new SoundController();
    await soundController.initialize();

    const mixtureController = new MixtureController(soundController);
    const shuffleController = new ShuffleController(soundController);

    // Set up the circular reference
    mixtureController.setShuffleController(shuffleController);
    shuffleController.setMixtureController(mixtureController);

    // Make mixtureController globally accessible
    window.mixtureController = mixtureController;

    shuffleController.setupShuffleButton();
});