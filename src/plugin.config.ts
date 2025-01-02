import { createId } from "@paralleldrive/cuid2"

/**
 * Plugin configuration.
 */
export default {
    ce_prefix: createId(),
    identifier: 'com.littlepriceonu.re-shuffle',
    name: 'ReShuffle',
    description: 'Ever wanted to shuffle your playlist *again*? Now you can.',
    version: '0.1',
    author: 'littlepriceonu',
    repo: 'https://github.com/ciderapp/plugin-template',
    entry: {
        'plugin.js': {
            type: 'main',
        }
    }
}