function Loader(res) {
    this.resources = {};
    this.resourcesLen = res.length;
    this.counter = 0;
    this.timer = {};
    this.init(res);
}

Loader.prototype = {
    init: function (res) {
        var self = this;
        self.setRes(res);
        self.fetch(self.resources);
        Loader.prototype = utils.mixin(Loader.prototype, Events.prototype);
    },
    setRes: function (res) {
        var self = this;
        res.forEach(function (v, i) {
            var name = self.getFileName(v);
            var ext = self.getFileExt(v);
            var type = self.getNodeType(ext);
            var r = {
                ext: ext,
                type: type,
                path: v
            }
            self.resources[i] = r;
        });
    },
    getFileName: function (url) {
        return url.slice(url.lastIndexOf('/') + 1).replace(/\?.*$/, '').toLowerCase();
    },
    getFileExt: function (url) {
        return url.slice(url.lastIndexOf('.') + 1, url.length).toLowerCase();
    },
    getNodeType: function (ext) {
        var types = {
            img: ['jpg', 'jpeg', 'gif', 'png', 'bmp'],
            audio: ['ogg', 'wav', 'mp3', 'aac', 'm4a']
        }
        for (var type in types) {
            if (types[type].indexOf(ext) > -1) {
                return type;
            }
        }
    },
    fetchImg: function (path) {
        var self = this;
        var img = new Image();
        img.style.display = 'none';
        img.onload = function () {
            self.count(path);
        };
        img.src = path;
    },
    fetchAudio: function (path) {
        var self = this;
        var audio = new Audio();
        audio.preload = 'auto';
        var audioLoaded = (function () {
            return function () {
                if (audio.readyState > 0) {
                    clearInterval(self.timer[path]);
                    self.timer[path] = null;
                    self.count();
                }
            }
        })();
        self.timer[path] = setInterval(audioLoaded, 100);
        audio.src = path;
    },
    fetch: function (res) {
        for (var k in res) {
            switch (res[k].type) {
                case 'img':
                    this.fetchImg(res[k].path);
                    break;
                case 'audio':
                    this.fetchAudio(res[k].path);
                    break;
            }
        }
    },
    count: function (path) {
        this.counter++;
        if (this.counter === this.resourcesLen) {
            this.trigger('success');
        } else {
            var percentage = (this.counter / this.resourcesLen * 100).toFixed(0);
            this.trigger('progress', [percentage, path]);
        }
    }
}

var Events = function () {
    // this.map = {};
};

Events.prototype = {
    constructor: Event,
    eventMap: {},
    trigger: function (eventname, args) {
        if (this.eventMap[eventname]) {
            this.eventMap[eventname].forEach(function (fn) {
                fn.apply(this, args);
            });
        }
    },
    on: function (eventname, callback) {
        if (this.eventMap[eventname]) {
            this.eventMap[eventname].push(callback);
        } else {
            this.eventMap[eventname] = [callback];
        }
    }
};

var utils = {
    mixin: function (sup, obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                sup[i] = obj[i];
            }
        }
        return sup;
    }
};

var loader = (function () {
    return function (res) {
        return new Loader(res);
    }
})();

module.exports = loader;