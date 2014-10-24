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
