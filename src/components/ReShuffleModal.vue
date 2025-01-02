<script setup lang="ts">
    import { useMusicKit } from "@ciderapp/pluginkit";
    import waitForMusicKit from "../util/waitForMusicKit";
    import { createLogger } from "../util/logger";
    import { songs as storeSongs } from "../stores/queueStore";
import { shuffle } from "lodash";

    // const cfg = useConfig()
    let musicKit: MusicKit.MusicKitInstance;
    const logger = createLogger("ReShuffleModal.vue")

    waitForMusicKit().then(() => {
        musicKit = useMusicKit()
    })



    let shuffling = ref(false)
    let skipCurrentSong = defineModel<boolean>()

    async function ReShuffle() {
        if (!musicKit) return

        let songs = storeSongs.value

        logger.log("Songs Pre Shuffle", songs)

        if (songs.length < 2) return

        shuffling.value = true

        songs = shuffle(songs)

        // logger.log("Songs Post Shuffle:", songs)

        let currentlyPlayingSong = musicKit.nowPlayingItem.id
        let currentlyPlayingTime = musicKit.currentPlaybackTime

        // @ts-ignore
        await musicKit.setQueue({ songs, startPlaying: skipCurrentSong.value })        

        logger.log("ReShuffled!")

        shuffling.value = false

        if (skipCurrentSong.value) {
            musicKit.skipToNextItem()
            return
        }

        await musicKit.changeToMediaItem(currentlyPlayingSong)
        musicKit.seekToTime(currentlyPlayingTime)
    }
</script>

<template>
    <div class="plugin-base">
        <div class="rs-skip-next">
            <p class="remove-margin">
                Skip Current Song:
            </p>
            <input type="checkbox" v-model="skipCurrentSong">
        </div>
        
        <button :disabled="shuffling" class="rs-btn" @click="ReShuffle()">
            <p class="remove-margin">ReShuffle</p>
        
            <div v-if="shuffling" class='rs-shuffling-overlay'/>
        </button>
    </div>
</template>

<style scoped>
    .plugin-base {
        width: 155px;
        height: 70px;
        
        padding: 4px 0px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .rs-skip-next {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 6px;
    }

    .rs-skip-next > p {
        padding-right: 8px;
    }

    .rs-btn {
        padding: 2px 6px;
        border: 1px white solid;
        border-radius: 5px;
        background: transparent;
        position: relative;

        cursor: pointer;

        display:flex;
        align-items: center;
        justify-content: center;

        transition: all 0.5s ease-in-out;
    }

    .rs-btn:disabled {
        pointer-events: none;
    }

    .rs-btn:hover {
        scale: 1.10
    }

    .rs-btn:active {
        scale: 0.95
    }

    .remove-margin {
        margin: 0;
    }

    .rs-shuffling-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        pointer-events: none;
    }

    .rs-shuffling-overlay::after {
        content: "";
        width: 15px;
        height: 15px;
        border-radius: 9999px;
        border: 2px solid white;
        border-right: 2px solid transparent;

        animation: rotate 0.5s linear infinite;
    }

    @keyframes rotate {
        to {transform: rotate(360deg);}
    }
</style>