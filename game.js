class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set up responsive canvas
        this.setupResponsiveCanvas();
        window.addEventListener('resize', () => this.setupResponsiveCanvas());
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.soundManager = new SoundManager();
        this.ship = new Ship(this.width, this.height, this);
        this.obstacles = [];

        this.score = 0;
        this.speed = 2;
        this.maxSpeed = 15;
        this.acceleration = 0.1;
        this.spawnTimer = 0;

        this.keys = {};
        this.setupControls();

        this.stars = Array(100).fill().map(() => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            speed: Math.random() * 3 + 1
        }));

        this.lastTime = 0;
        this.winScore = 100;
        this.isGameOver = false;
        requestAnimationFrame(this.gameLoop.bind(this));

        this.setupMobileControls();
    }

    setupResponsiveCanvas() {
        // Get the container width
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        
        // Calculate height maintaining 4:3 aspect ratio
        const containerHeight = (containerWidth * 3) / 4;
        
        // Update canvas size
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = containerHeight + 'px';
        
        // Update canvas internal dimensions
        this.canvas.width = 800;  // Keep internal resolution constant
        this.canvas.height = 600;
        
        // Update context after resize
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;  // Keep pixel art sharp
    }

    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Touch controls for game over restart
        this.canvas.addEventListener('touchstart', () => {
            if (this.isGameOver) {
                location.reload();
            }
        });
        
        // Mouse controls for game over restart (for desktop)
        this.canvas.addEventListener('click', () => {
            if (this.isGameOver) {
                location.reload();
            }
        });
    }

    setupMobileControls() {
        const leftBtn = document.getElementById('left-btn');
        const rightBtn = document.getElementById('right-btn');
        const shootBtn = document.getElementById('shoot-btn');

        // Touch events for mobile buttons
        const handleTouch = (btn, key) => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys[key] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[key] = false;
            });
            // Also handle mouse events for testing on desktop
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys[key] = true;
            });
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys[key] = false;
            });
        };

        handleTouch(leftBtn, 'ArrowLeft');
        handleTouch(rightBtn, 'ArrowRight');
        handleTouch(shootBtn, ' ');  // Space key
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        if (this.isGameOver) {
            if (this.keys[' ']) {
                location.reload();
            }
            return;
        }

        if (this.keys['ArrowUp']) {
            this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration);
        } else {
            this.speed = Math.max(2, this.speed - this.acceleration);
        }

        this.stars.forEach(star => {
            star.y += star.speed * (this.speed / 2);
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });

        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= 1000) {
            this.obstacles.push(new Obstacle(this.width, this.height));
            this.spawnTimer = 0;
        }

        if (this.score >= this.winScore) {
            this.gameWon();
            return;
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.update(this.speed);
            
            for (let j = this.ship.bullets.length - 1; j >= 0; j--) {
                const bullet = this.ship.bullets[j];
                if (obstacle.checkBulletCollision(bullet)) {
                    this.score += obstacle.points;
                    this.obstacles.splice(i, 1);
                    this.ship.bullets.splice(j, 1);
                    if (obstacle.points > 0) {
                        this.soundManager.playScore();
                    } else {
                        this.soundManager.playCrash();
                    }
                    break;
                }
            }

            if (obstacle.isOffScreen()) {
                this.obstacles.splice(i, 1);
            } else if (obstacle.collidesWith(this.ship)) {
                this.gameOver();
            }
        }

        this.ship.handleInput(this.keys);
        this.ship.update();
    }

    draw() {
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.stars.forEach(star => {
            const size = Math.min(3, star.speed * (this.speed / this.maxSpeed));
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(star.x, star.y, size, size);
        });

        this.ship.draw(this.ctx);
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Target: ${this.winScore}`, 10, 60);
        this.ctx.fillText(`Speed: ${Math.floor(this.speed)}x`, 10, 90);

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.font = '74px Arial';
            this.ctx.fillStyle = 'red';
            const gameOverText = 'Game Over!';
            const gameOverWidth = this.ctx.measureText(gameOverText).width;
            this.ctx.fillText(gameOverText, this.width/2 - gameOverWidth/2, this.height/2);

            this.ctx.font = '30px Arial';
            this.ctx.fillStyle = 'white';
            const restartText = 'Tap to restart';
            const restartWidth = this.ctx.measureText(restartText).width;
            this.ctx.fillText(restartText, this.width/2 - restartWidth/2, this.height/2 + 50);
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.soundManager.playCrash();
    }

    gameWon() {
        this.soundManager.playScore();
        this.ctx.font = '74px Arial';
        this.ctx.fillStyle = 'green';
        const text = 'You Win!';
        const textWidth = this.ctx.measureText(text).width;
        this.ctx.fillText(text, this.width/2 - textWidth/2, this.height/2);
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}

window.onload = () => new Game(); 