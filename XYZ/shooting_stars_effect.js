document.addEventListener('DOMContentLoaded', function() {
    (function() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
        window.requestAnimationFrame = requestAnimationFrame;

        var background = document.getElementById("bgCanvas"),
            bgCtx = background.getContext("2d"),
            width = window.innerWidth,
            height = window.innerHeight;

        if (height < 400) height = 400;

        background.width = width;
        background.height = height;

        // Get the background color from the CSS variable
        var root = document.documentElement;
        var bgColor = getComputedStyle(root).getPropertyValue('--background-color');
        bgCtx.fillStyle = bgColor;
        bgCtx.fillRect(0, 0, width, height);

        var firstStarAppeared = false;

        function ShootingStar() {
            this.reset();
        }

        ShootingStar.prototype.reset = function () {
            this.x = Math.random() * width;
            this.y = 0;
            this.len = (Math.random() * 80) + 10;
            this.speed = (Math.random() * 10) + 6;
            this.size = (Math.random() * 1) + 0.1;
            this.waitTime = new Date().getTime() + (Math.random() * 4000) + 8000; // 8 to 12 seconds
            this.active = false;
        }

        ShootingStar.prototype.update = function () {
            if (this.active) {
                this.x -= this.speed;
                this.y += this.speed;
                if (this.x < 0 || this.y >= height) {
                    this.reset();
                } else {
                    bgCtx.lineWidth = this.size;
                    bgCtx.beginPath();
                    bgCtx.moveTo(this.x, this.y);
                    bgCtx.lineTo(this.x + this.len, this.y - this.len);
                    bgCtx.stroke();
                }
            } else {
                if (this.waitTime < new Date().getTime()) {
                    this.active = true;
                    document.getElementById('wish').style.opacity = '1';
                    setTimeout(function() {
                        document.getElementById('wish').style.opacity = '0';
                    }, 5000); // 5 seconds delay
                }
            }
        }

        function SymmetricalShootingStar() {
            this.reset();
        }

        SymmetricalShootingStar.prototype.reset = function () {
            this.x = width;
            this.y = Math.random() * height;
            this.len = (Math.random() * 80) + 10;
            this.speed = (Math.random() * 10) + 6;
            this.size = (Math.random() * 1) + 0.1;
            this.waitTime = new Date().getTime() + (Math.random() * 4000) + 8000; // 8 to 12 seconds
            this.active = false;
        }

        SymmetricalShootingStar.prototype.update = function () {
            if (this.active) {
                this.x -= this.speed;
                this.y -= this.speed;
                if (this.x < 0 || this.y < 0) {
                    this.reset();
                } else {
                    bgCtx.lineWidth = this.size;
                    bgCtx.beginPath();
                    bgCtx.moveTo(this.x, this.y);
                    bgCtx.lineTo(this.x + this.len, this.y + this.len);
                    bgCtx.stroke();
                }
            } else {
                if (this.waitTime < new Date().getTime()) {
                    this.active = true;
                    document.getElementById('wish').style.opacity = '1';
                    setTimeout(function() {
                        document.getElementById('wish').style.opacity = '0';
                    }, 5000); // 5 seconds delay
                }
            }
        }

        var entities = [];
        var firstStar = new ShootingStar();
        firstStar.waitTime = new Date().getTime() + 3000; // Ensure the first star appears after 3 seconds
        entities.push(firstStar);
        entities.push(new SymmetricalShootingStar());

        function animate() {
            bgCtx.fillStyle = bgColor; // Use the CSS variable for the background color
            bgCtx.fillRect(0, 0, width, height);
            bgCtx.fillStyle = '#ffffff';
            bgCtx.strokeStyle = '#ffffff';

            var entLen = entities.length;

            while (entLen--) {
                entities[entLen].update();
            }
            requestAnimationFrame(animate);
        }
        animate();
    })();
});
