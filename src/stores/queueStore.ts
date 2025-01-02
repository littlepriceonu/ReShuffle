import { ref, computed } from "vue";

const queue = ref<{id: string}[]>([]);

const songs = computed(() => {
    let songs = []
    for (const song of queue.value) {
        songs.push(song.id)
    }
    return songs
});

export {
    queue,
    songs,
}