# Looom - Ambient Sound Mixer

http://looom.app
is a web-based ambient sound mixer that helps users create the perfect atmosphere for relaxation, focus, or sleep. Mix and match various nature and urban sounds to craft your ideal soundscape.

## Features

- Mix multiple ambient sounds
- Adjust volume for each sound individually
- Preset mixtures for quick ambiance creation
- Responsive design for desktop and mobile use
- Various sound themes including nature and urban environments

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/osadchy/looom.git
   ```

2. Open `index.html` in your web browser.

## Usage

- Use the toggle switches to turn individual sounds on or off
- Adjust the sliders to control the volume of each sound
- Click on mixture presets to quickly combine complementary sounds

  ## Adding New Audio Files

To add new audio files to the Looom project:

1. Place your audio files in the `library` folder. Organize them into subfolders based on their category (e.g., `library/rain/`, `library/forest/`, etc.).

2. Update the `library.json` file in the root directory. This file should contain information about all available audio files. Here's an example structure:

```json
{
  "library": {
    "rain": ["rain1.mp3", "rain2.mp3"],
    "forest": ["forest1.mp3", "forest2.mp3"],
    "ocean": ["waves1.mp3", "waves2.mp3"]
  }
}
```

3. In the `script.js` file, the `fetch('library.json')` function loads this data and creates audio tracks for each category.

4. Update the HTML in `index.html` to include new UI elements for your added sounds. Add new `<div class="audio-control">` elements within the existing structure.

5. If you're adding new mixture presets, update the `mixtureController` object in `script.js` with new toggle functions, and add corresponding UI elements in `index.html`.

Ensure that the filenames in the JSON match exactly with the files in your `library` folder.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [CC0-1.0 License](https://github.com/osadchy/looom/blob/main/LICENSE).

## Contact

Created by Osadchy Yuri - feel free to contact me!

For more information, visit the [Looom GitHub repository](https://github.com/osadchy/looom).
