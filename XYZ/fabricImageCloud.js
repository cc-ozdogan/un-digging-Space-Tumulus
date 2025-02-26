(function(app) {
    "use strict";

    app.metadata = app.metadata || {
        consoleTag: 'H O U S E ~ f i d d l e s',
        gitHubUrl: 'https://github.com/bradyhouse/house/tree/master/fiddles/jquery/fiddle-0041-fabricImageCloud',
        dataUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/photo-album.json'
    };

    app.model = app.model || {};

    class Base {
        constructor(fabric) {
            this._fabric = fabric ? fabric : null;
        }
        apply(object, config, defaults) {
            if (defaults) {
                this.apply(object, defaults);
            }
            if (object && config && typeof config === 'object') {
                var property;
                for (property in config) {
                    if (config[property]) {
                        object[property] = config[property];
                    }
                }
            }
            return object;
        }
        get fabric() {
            return this._fabric;
        }
        set fabric(value) {
            this._fabric = value;
        }
        hasOwnMethod(method) {
            return typeof this[method] === 'function' ? true : false;
        }
    }

    class Util {
        static color() {
            var hex = "#",
                i = 0;
            for (; i < 6; i++) {
                hex += Math.floor(Math.random() * 16).toString(16);
            }
            return hex;
        }
        static emptyFn() {}
        static rand(lbound, ubound) {
            return Math.floor(Math.random() * (ubound - lbound + 1)) + lbound;
        }
        static xmlNamespaces() {
            return {
                xmlns: 'http://www.w3.org/2000/svg',
                xmlnsXLink: 'http://www.w3.org/1999/xlink',
                xmlnsEv: 'http://www.w3.org/2001/xml-events'
            }
        }
        static splitAttribute(field, id, valDef) {
            var docElement = document.getElementById(id);
            if (docElement && docElement.getAttribute(field)) {
                return docElement.getAttribute(field).split(/[,\(\)]/);
            }
            return valDef.split(/[,\(\)]/);
        }
        static mapFromQueryString(url, parameter) {
            var name = parameter.replace(/[$$]/, "\\[").replace(/[$$]/, "\\]"),
                regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                value = regex.exec(url);
            return value === null ? "" : decodeURIComponent(value[1].replace(/\+/g, " "));
        }
        static hide(obj) {
            obj.setAttribute('visibility', 'hidden');
        }
        static darkenColor(hex, lum) {
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;
            var rgb = "#",
                c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }
            return rgb;
        }
        static mapCircularPoint(centerX, centerY, radius, angle) {
            var coorX = 0,
                coorY = 0;
            try {
                coorX = Math.round(centerX + (radius * Math.cos(Util.convertToRadians(angle))));
                coorY = Math.round(centerY + (radius * Math.sin(Util.convertToRadians(angle))));
            } catch (err) {
                console.log(err.stackTrace);
            }
            return {
                x: coorX,
                y: coorY
            }
        }
        static mapCircularPath(centerX, centerY, radius, axis) {
            var _coor3pm = Util.mapCircularPoint(centerX, centerY, radius, 0),
                _coor4pm = Util.mapCircularPoint(centerX, centerY, radius, 30),
                _coor5pm = Util.mapCircularPoint(centerX, centerY, radius, 60),
                _coor6pm = Util.mapCircularPoint(centerX, centerY, radius, 90),
                _coor7pm = Util.mapCircularPoint(centerX, centerY, radius, 120),
                _coor8pm = Util.mapCircularPoint(centerX, centerY, radius, 150),
                _coor9pm = Util.mapCircularPoint(centerX, centerY, radius, 180),
                _coor10pm = Util.mapCircularPoint(centerX, centerY, radius, 210),
                _coor11pm = Util.mapCircularPoint(centerX, centerY, radius, 240),
                _coor12am = Util.mapCircularPoint(centerX, centerY, radius, 270),
                _coor1am = Util.mapCircularPoint(centerX, centerY, radius, 300),
                _coor2am = Util.mapCircularPoint(centerX, centerY, radius, 330);
            return axis === 'x' || axis === 'y' ? _coor3pm[axis] + ';' +
                _coor4pm[axis] + ';' +
                _coor5pm[axis] + ';' +
                _coor6pm[axis] + ';' +
                _coor7pm[axis] + ';' +
                _coor8pm[axis] + ';' +
                _coor9pm[axis] + ';' +
                _coor10pm[axis] + ';' +
                _coor11pm[axis] + ';' +
                _coor12am[axis] + ';' +
                _coor1am[axis] + ';' +
                _coor2am[axis] + ';' +
                _coor3pm[axis] : '';
        }
        static toCircularPointArray(centerX, centerY, radius, degrees) {
            var coors = [],
                angle = 0,
                delta = degrees ? degrees : 30;
            while (angle <= 360) {
                coors.push(Util.mapCircularPoint(centerX, centerY, radius, angle));
                angle += delta;
            }
            return coors;
        }
        static flattenToValues(pointArray, axis) {
            var path = [];
            if (pointArray.constructor === Array && pointArray.length) {
                if (pointArray[0].hasOwnProperty(axis)) {
                    pointArray.map(function(point, index) {
                        path.push(point[axis]);
                    });
                }
            }
            return path;
        }
        static reorderFrom(pointArray, startIndex) {
            var newArray = [],
                startingPoint = {};
            if (pointArray.constructor === Array && startIndex < pointArray.length) {
                startingPoint.x = pointArray[startIndex].x;
                startingPoint.y = pointArray[startIndex].y;
                newArray.push({
                    x: startingPoint.x,
                    y: startingPoint.y
                });
                pointArray.map(function(point, index) {
                    if (index > startIndex) {
                        newArray.push({
                            x: point.x,
                            y: point.y
                        })
                    }
                });
                pointArray.map(function(point, index) {
                    if (index < startIndex) {
                        newArray.push({
                            x: point.x,
                            y: point.y
                        })
                    }
                });
            }
            return newArray;
        }
        static pickRandomPoint(circularPointArr) {
            var coor = {
                    x: 0,
                    y: 0
                },
                index = 0;
            if (circularPointArr.constructor === Array) {
                index = Util.rand(0, circularPointArr.length - 1);
                coor = circularPointArr[index];
            }
            return coor;
        }
        static convertToRadians(angle) {
            return angle * (Math.PI / 180);
        }
        static scaleToWindow(type, value) {
            var factor = type === 'width' ? window.innerHeight / window.innerWidth : window.innerWidth / window.innerHeight,
                result = 0;
            if (value && typeof value === 'number') {
                result = Math.floor(value * factor);
            }
            return result;
        }
    }

    class Canvas extends Base {
        config() {
            return {
                hook: 'canvas1',
                children: [],
                backgroundColor: 'rgb(100,100,200)',
                width: 500,
                height: 500,
                onImageClick: null
            };
        }
        constructor(config) {
            super();
            if (config) {
                this.apply(this, config, this.config());
            }
            this._start = 0;
            this._stop = 0;
            this.init();
        }
        get start() {
            return this._start;
        }
        set start(value) {
            this._start = value;
        }
        get stop() {
            return this._stop;
        }
        set stop(value) {
            this._stop = value;
        }
        init() {
            var me = this,
                canvas = new fabric.Canvas(this.hook, {
                    width: this.width,
                    height: this.height
                });
            if (canvas) {
                if (this.children && this.children.length) {
                    this.children.map(function(child) {
                        if (child.fabric) {
                            child.fabric.set({ width: child.width, height: child.height });
                            canvas.add(child.fabric);
                        }
                    }, canvas);
                }
                canvas.on('mouse:down', function(object) {
                    var date = new Date();
                    me.start = date.getTime();
                });
                canvas.on('mouse:up', function(object) {
                    var date = new Date(),
                        image = object && object.target && object.target.type && object.target.type === 'image' ? object.target : null,
                        delta = 0;
                    me.stop = date.getTime();
                    delta = me.stop - me.start;
                    if (delta < 200 && image) {
                        if (me.hasOwnMethod('onImageClick')) {
                            me['onImageClick'].call(me, image);
                        }
                    }
                });
                this.fabric = canvas;
            }
        }
    }

    class Image extends Base {
        config() {
            return {
                controller: null,
                url: null,
                left: 100,
                top: 100,
                angle: 0,
                opacity: 1,
                autoBind: false,
                imageLoad: null
            }
        }
        constructor(config) {
            super();
            if (config) {
                this.apply(this, config, this.config());
            }
            this.init();
        }
        bind() {
            if (this.hook) {
                this.hook.add(this.fabric);
            }
        }
        init() {
            var me = this;
            if (me.url) {
                fabric.Image.fromURL(me.url, function(oImg) {
                    oImg.set({ width: me.width, height: me.height, left: me.left, top: me.top, opacity: me.opacity });
                    if (me.autoBind) {
                        me.bind();
                    }
                    if (me.hasOwnMethod('onImageLoad')) {
                        me['onImageLoad'].call(me, oImg);
                    }
                    me.fabric = oImg;
                });
            }
        }
    }

    class Photo extends Base {
        get config() {
            return {
                url: '',
                title: '',
                width: '0',
                height: '0',
                json: null
            }
        }
        constructor(config) {
            super();
            if (config) {
                this.apply(this, config, this.config);
            }
            this.init();
        }
        init() {
            var title = this.json && this.json.hasOwnProperty('title') ? this.json.title : '',
                mediaGroup = this.json && this.json.hasOwnProperty('media:group') ? this.json['media:group'] : null,
                mediaContent = mediaGroup && mediaGroup.hasOwnProperty('media:content') ? mediaGroup['media:content'] : null,
                content = mediaContent && mediaContent.hasOwnProperty('') ? null : null;
            if (content) {
                this.title = title;
                this.url = content.hasOwnProperty('url') ? content.url : '';
                this.width = content.hasOwnProperty('width') ? content.width : '0';
                this.height = content.hasOwnProperty('height') ? content.height : '0';
            }
        }
    }

    class PhotoAlbum extends Base {
        get config() {
            return {
                json: null,
                children: []
            }
        }
        constructor(config) {
            super();
            if (config) {
                this.apply(this, config, this.config);
                this.init();
            }
        }
        init() {
            if (this.json) {
                if (this.json.rss) {
                    if (this.json.rss.channel) {
                        if (this.json.rss.channel.item) {
                            this.json.rss.channel.item.map(function(item) {
                                this.children.push(new Photo({
                                    json: item
                                }))
                            }, this);
                        }
                    }
                }
            }
        }
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

    app.controller = app.controller || {
        topImage: null,
        onDOMContentLoaded: function() {
            try {
                console.log("%c" + app.metadata.consoleTag, 'font-style: italic; font-size: 20px;');
                console.log("%c" + app.metadata.gitHubUrl, "color: blue; font-style: italic; text-decoration: underline; background-color: #FFFF00;");
                $(document).load(app.metadata.dataUrl);
                $(document).ajaxComplete(this.onAjaxComplete);
            } catch (err) {
                document.write(JSON.stringify(err));
            }
        },
        onAjaxComplete: function(event, xhr, settings) {
            if (settings.url === app.metadata.dataUrl) {
                app.model.PhotoAlbum = new PhotoAlbum({
                    json: JSON.parse(xhr.responseText)
                });
                window.setTimeout(function() {
                    app.controller.init();
                }, 500);
            }
        },
        init: function() {
            var objects = [],
                center = {
                    x: $(document).width() / 2,
                    y: $(document).height() / 2,
                };
            app.controller.canvas = new Canvas({
                hook: 'fiddle',
                width: window.innerWidth,
                height: window.innerHeight,
                onImageClick: app.controller.onImageClick
            });
            app.model.PhotoAlbum.children.map(function(photo, index) {
                var radius = $(document).width() < $(document).height() ? $(document).width() / 2 : $(document).height() / 2,
                    randX = Util.rand(0, $(document).width()),
                    randY = Util.rand(0, $(document).height()),
                    dur = 5000,
                    circularPathArr = Util.toCircularPointArray(randX, randY, radius),
                    startingIndex = Util.rand(0, circularPathArr.length - 1),
                    startingPoint = circularPathArr[startingIndex],
                    reorderedPathArr = Util.reorderFrom(circularPathArr, startingIndex),
                    x = Util.flattenToValues(reorderedPathArr, 'x'),
                    y = Util.flattenToValues(reorderedPathArr, 'y');
                objects.push(new Image({
                    id: photo.title,
                    controller: app.controller,
                    width: objects.length % 4 === 0 ? Math.floor((+photo.width) / 4) : Math.floor((+photo.width) / 6),
                    height: objects.length % 4 === 0 ? Math.floor((+photo.height) / 4) : Math.floor((+photo.height) / 6),
                    left: startingPoint.x,
                    top: startingPoint.y,
                    url: photo.url,
                    onImageLoad: app.controller.onImageLoad
                }));
            });
        },
        onImageClick: function(image) {
            var topImage = app.controller.topImage ? app.controller.topImage : null;
            if (topImage) {
                image.setWidth(topImage.width);
                image.setHeight(topImage.height);
                image.setLeft(topImage.left);
                image.setTop(topImage.top);
                app.controller.canvas.fabric.remove(topImage);
                app.controller.topImage = null;
            } else {
                topImage = jQuery.extend(true, {}, image);
                topImage.scaleToHeight(window.innerHeight);
                app.controller.canvas.fabric.add(topImage);
                app.controller.canvas.fabric.setActiveObject(topImage);
                topImage.center();
                app.controller.topImage = topImage;
            }
        },
        onImageLoad: function(image) {
            if (app.controller.canvas) {
                app.controller.canvas.fabric.add(image);
            }
        }
    };

    $(document).ready(function() {
        app.controller.onDOMContentLoaded();
    });

    // Custom initialization for your images
    $(document).ready(function() {
        var photoAlbum = new PhotoAlbum({
            children: [
                { url: './IMG/Torrylin/min/01.jpg', width: 800, height: 600, title: 'Image 1' },
                { url: './IMG/Torrylin/min/02.jpg', width: 800, height: 600, title: 'Image 2' },
                { url: './IMG/Torrylin/min/03.jpg', width: 800, height: 600, title: 'Image 3' },
                { url: './IMG/Torrylin/min/04.jpg', width: 800, height: 600, title: 'Image 4' },
                { url: './IMG/Torrylin/min/05.jpg', width: 800, height: 600, title: 'Image 5' },
                { url: './IMG/Torrylin/min/06.jpg', width: 800, height: 600, title: 'Image 6' },
                { url: './IMG/Torrylin/min/07.jpg', width: 800, height: 600, title: 'Image 7' },
                { url: './IMG/Torrylin/min/08.jpg', width: 800, height: 600, title: 'Image 8' },
                { url: './IMG/Torrylin/min/09.jpg', width: 800, height: 600, title: 'Image 9' },
                { url: './IMG/Torrylin/min/10.jpg', width: 800, height: 600, title: 'Image 10' }
            ]
        });

        app.controller.canvas = new Canvas({
            hook: 'fiddle',
            width: window.innerWidth,
            height: window.innerHeight,
            onImageClick: app.controller.onImageClick
        });

        photoAlbum.children.map(function(photo, index) {
            var radius = $(document).width() < $(document).height() ? $(document).width() / 2 : $(document).height() / 2,
                randX = Util.rand(0, $(document).width()),
                randY = Util.rand(0, $(document).height()),
                dur = 5000,
                circularPathArr = Util.toCircularPointArray(randX, randY, radius),
                startingIndex = Util.rand(0, circularPathArr.length - 1),
                startingPoint = circularPathArr[startingIndex],
                reorderedPathArr = Util.reorderFrom(circularPathArr, startingIndex),
                x = Util.flattenToValues(reorderedPathArr, 'x'),
                y = Util.flattenToValues(reorderedPathArr, 'y');
            new Image({
                id: photo.title,
                controller: app.controller,
                width: index % 4 === 0 ? Math.floor((+photo.width) / 4) : Math.floor((+photo.width) / 6),
                height: index % 4 === 0 ? Math.floor((+photo.height) / 4) : Math.floor((+photo.height) / 6),
                left: startingPoint.x,
                top: startingPoint.y,
                url: photo.url,
                onImageLoad: app.controller.onImageLoad
            });
        });
    });
})(window.app = window.app || {});
