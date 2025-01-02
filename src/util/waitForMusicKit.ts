export default function waitForMusicKit(): Promise<void> {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (MusicKit.getInstance()) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}