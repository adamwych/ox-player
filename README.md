# Ox Player
Video player written in JavaScript with only the most basic features, like playing, pausing, and changing the volume.

## Building
To build Ox you will need Node.js.
After you've installed it - follow the instructions on how to download the dependencies and build the library.

Execute following commands from the root directory:
1. Install Gulp's CLI using `npm install -g gulp-cli`.
2. Install required dependencies using `npm install`.
3. Build the library using `gulp build`.

The library should now be in `dist` folder.

## Usage
Simply call oxPlayer() on the ```<video>``` element you want to initialize the player for.

```javascript
$('.my-video').oxPlayer(options);
```

You can pass additional options to the function, if you want.

| Name        | Description                                                  | Possible values    | Default value  |
| ----------- |:------------------------------------------------------------:| ------------------:| --------------:|
| autoPlay    | Whether the video should start playing after the page loads. | true/false         | false          |
| volume      | The volume that the video should start playing at.           | number between 0-1 | 0.5            |

## License
GPL v3.
