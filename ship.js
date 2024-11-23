class Ship {
    constructor(screenWidth, screenHeight, game) {
        this.width = 40;
        this.height = 60;
        this.x = screenWidth / 2 - this.width / 2;
        this.y = screenHeight - this.height - 20;
        this.speed = 8;
        this.game = game;
        this.bullets = [];
        this.lastShot = 0;
        this.shootDelay = 250;
        this.thrustFrame = 0;
        this.thrustColors = ['#ff0000', '#ff6600', '#ffff00'];
    }

    handleInput(keys) {
        if (keys['ArrowLeft']) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight']) {
            this.x += this.speed;
        }
        if (keys[' ']) { // Spacebar
            this.shoot();
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot >= this.shootDelay) {
            this.bullets.push({
                x: this.x + this.width / 2,
                y: this.y,
                width: 4,
                height: 10,
                speed: 10
            });
            this.lastShot = now;
            this.game.soundManager.playShoot(); // Play shooting sound
        }
    }

    update() {
        this.x = Math.max(0, Math.min(800 - this.width, this.x));
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed;
            if (bullet.y + bullet.height < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // Draw bullets
        ctx.fillStyle = '#fff';
        this.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x - bullet.width/2, bullet.y, bullet.width, bullet.height);
        });

        // Draw ship
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Draw thrust when accelerating
        if (this.game.keys['ArrowUp']) {
            const thrustColor = this.thrustColors[this.thrustFrame % this.thrustColors.length];
            ctx.fillStyle = thrustColor;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 4, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height + 20);
            ctx.lineTo(this.x + this.width * 3 / 4, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            this.thrustFrame++;
        }
    }

    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
} 