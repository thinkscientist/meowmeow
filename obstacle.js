class Obstacle {
    constructor(screenWidth, screenHeight) {
        this.width = 50;
        this.height = 50;
        this.x = Math.random() * (screenWidth - this.width);
        this.y = -this.height;
        
        // Randomly choose between all obstacles with different probabilities
        const rand = Math.random();
        if (rand < 0.35) {
            this.type = 'meow';
            this.points = 5;
        } else if (rand < 0.70) {
            this.type = 'woof';
            this.points = 2;
        } else if (rand < 0.85) {
            this.type = 'turtle';
            this.points = -5;
        } else {
            this.type = 'tarantula';
            this.points = -10;
        }
        
        this.image = new Image();
        this.image.src = `assets/${this.type}.png`;
    }

    update(speed) {
        this.y += speed;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y > 600;
    }

    collidesWith(ship) {
        const shipRect = ship.getRect();
        return !(this.x + this.width < shipRect.x || 
                this.x > shipRect.x + shipRect.width ||
                this.y + this.height < shipRect.y ||
                this.y > shipRect.y + shipRect.height);
    }

    checkBulletCollision(bullet) {
        return !(this.x + this.width < bullet.x - bullet.width/2 || 
                this.x > bullet.x + bullet.width/2 ||
                this.y + this.height < bullet.y ||
                this.y > bullet.y + bullet.height);
    }
} 