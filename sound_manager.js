class SoundManager {
    constructor() {
        this.soundsLoaded = false;
        
        try {
            this.scoreSound = new Audio('assets/score.wav');
            this.crashSound = new Audio('assets/crash.wav');
            this.backgroundMusic = new Audio('assets/backgroundmusic.mp3');
            this.shootSound = new Audio('assets/shot.mp3');
            
            // Setup background music
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.3;
            
            // Start background music on user interaction
            window.addEventListener('click', () => {
                this.playBackgroundMusic();
            }, { once: true });

            this.soundsLoaded = true;
        } catch (error) {
            console.error('Error loading sounds:', error);
        }
    }

    playBackgroundMusic() {
        try {
            this.backgroundMusic.play().catch(error => {
                console.error('Error playing background music:', error);
            });
        } catch (error) {
            console.error('Error playing background music:', error);
        }
    }

    playScore() {
        if (!this.soundsLoaded) return;
        try {
            this.scoreSound.currentTime = 0;
            this.scoreSound.play().catch(error => {
                console.error('Error playing score sound:', error);
            });
        } catch (error) {
            console.error('Error playing score sound:', error);
        }
    }

    playCrash() {
        if (!this.soundsLoaded) return;
        try {
            this.crashSound.currentTime = 0;
            this.crashSound.play().catch(error => {
                console.error('Error playing crash sound:', error);
            });
        } catch (error) {
            console.error('Error playing crash sound:', error);
        }
    }

    playShoot() {
        if (!this.soundsLoaded) return;
        try {
            this.shootSound.currentTime = 0;
            this.shootSound.play().catch(error => {
                console.error('Error playing shoot sound:', error);
            });
        } catch (error) {
            console.error('Error playing shoot sound:', error);
        }
    }
} 