import { defineCustomElement } from 'vue'
import type { App } from 'vue'
import { createPinia } from "pinia";
import { definePluginContext, addCustomButton, useMusicKit } from '@ciderapp/pluginkit'
import ReShuffler from "./components/ReShuffleModal.vue";
import Settings from './components/Settings.vue';
import PluginConfig from './plugin.config';
import waitForMusicKit from './util/waitForMusicKit';
import { createLogger } from './util/logger';
import { queue as queueStore } from './stores/queueStore';

// Todo
// * figure out why importing the config in any form bricks any vue file
// * pray that the cider plugin docs comes out soon 

/**
 * Initializing a Vue app instance so we can use things like Pinia.
 */
const pinia = createPinia()

/**
 * Function that configures the app instances of the custom elements
 */
function configureApp(app: App) {
    // if i dont have this console log here the styles wont render????
    console.log("") 
    app.use(pinia)
}   

/**
 * Custom Elements that will be registered in the app
 */
export const CustomElements
    = {
    'reshuffle-modal':
        defineCustomElement(ReShuffler, {
            /**
             * Disabling the shadow root DOM so that we can inject styles from the DOM
             */
            shadowRoot: false,
            configureApp
        }),
    'settings': defineCustomElement(Settings, {
        shadowRoot: false,
        configureApp
    }),
}

/**
 * Defining the plugin context
 */
const { plugin, setupConfig, customElementName, goToPage, useCPlugin } = definePluginContext({
    ...PluginConfig,
    CustomElements,
    setup() {
        /**
         * Registering the custom elements in the app
         */
        for (const [key, value] of Object.entries(CustomElements)) {
            const _key = key as keyof typeof CustomElements;
            customElements.define(customElementName(_key), value)
        }

        /**
         * Defining our custom settings element
         */
        this.SettingsElement = customElementName('settings');

        const logger = createLogger("ReShuffle")

        // Here we add a custom button to the top right of the chrome
        addCustomButton({
            element: '🔀',
            location: 'chrome-top/right',
            title: 'ReShuffle',
            menuElement: customElementName('reshuffle-modal'),
        })

        waitForMusicKit().then(() => {
            const musicKit = useMusicKit()
            
    
            musicKit.addEventListener('queueItemsDidChange', (queue: { id: string }[]) => {
                logger.log("(*)queueItemsDidChange", queue)
            
                queueStore.value = queue
    
                // let cfg = useConfig()
                // cfg.queue = queue
            });
        })
    }
})

/**
 * Exporting the plugin and functions
 */
export { setupConfig, customElementName, goToPage, useCPlugin };

/**
 * Exporting the plugin, Cider will use this to load the plugin
 */
export default plugin;