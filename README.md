# Video.js Autoplay Toggle
A plugin for Video.js that adds an autoplay toggle which will persist to cookies or localstorage.

## Usage
Include the plugin:
```html
<script src="videojs.autoplay-toggle.js"></script>
```

Add ```autoplayToggle``` to plugins object:
```js
plugins: {
    autoplayToggle: {
        namespace: 'my-custom-namespace-for-autoplay-cookies'
    }
}
```
Namespace will default to ```autoplay-toggle``` if not set.

### Conflicts With Other Plugins
When a video has been configured with an ```autoplay=true``` option and the autoplay toggle stored
value says not to autoplay, the following sequence of events will occur:

1. video.js will initialize the player
2. video.js initialization will play and fire a ```play``` event
3. autoplay-toggle plugin will initialize
4. autoplay-toggle will detect the video playing, but the stored value says not to autoplay
5. autoplay-toggle will set the autoplay setting to false, pause the video, and fire a ```pause```
event

This may problematic when another plugin is listening for ```play```/```pause```.

For this situation, a method to retrieve the autoplay value is attached to the videojs object. Using
this function before initializing any players will allow you to override the autoplay option before
it gets sent into player initialization, preventing any false ```play``` events.

An example of this usage is as follows:
```js
// retrieve initial autoplay value to setup player with
var autoplayToggleNamespace = 'videojs-plugin-integration';
var autoplayFromStorage = videojs.autoplaySettingFromStorage({
  namespace: autoplayToggleNamespace
});

// initialize video
var vid1 = videojs('vid1', {autoplay: autoplayFromStorage});

// setup autoplay toggle plugin
vid1.autoplayToggle({
  namespace: autoplayToggleNamespace
});

// setup other plugins here
```
