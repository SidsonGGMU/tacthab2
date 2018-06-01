(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./projects/worldsim/src/lib/model/Avatar.ts":
/*!***************************************************!*\
  !*** ./projects/worldsim/src/lib/model/Avatar.ts ***!
  \***************************************************/
/*! exports provided: Avatar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Avatar", function() { return Avatar; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./projects/worldsim/src/lib/model/types.ts");
/* harmony import */ var _World__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./World */ "./projects/worldsim/src/lib/model/World.ts");


var Avatar = /** @class */ (function () {
    function Avatar(name, location, metadata) {
        this._name = name;
        this._location = location;
        this._metadata = metadata;
    }
    Object.defineProperty(Avatar.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Avatar.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (value) {
            this._location = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Avatar.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Avatar.prototype, "locationRegisterId", {
        get: function () {
            return 'Avatar' + _World__WEBPACK_IMPORTED_MODULE_1__["World"].REGISTER_SEPARATOR + this.name + _World__WEBPACK_IMPORTED_MODULE_1__["World"].REGISTER_SEPARATOR + 'location';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Avatar.prototype, "onChanged", {
        set: function (value) {
            this._onChanged = value;
        },
        enumerable: true,
        configurable: true
    });
    Avatar.prototype.changeLocation = function (newLocation) {
        if (newLocation.sublocations.length > 0)
            return;
        this.location = newLocation.name;
        this.sendUpdate();
    };
    Avatar.prototype.register = function (e) {
        var e1 = {
            id: this.locationRegisterId,
            type: 'string',
            value: this.location
        };
        e.emitters.push(e1);
    };
    Avatar.prototype.sendUpdate = function () {
        var u = { id: this.locationRegisterId, value: this._location };
        this._onChanged(u, _types__WEBPACK_IMPORTED_MODULE_0__["UpdateType"].EMITTER);
    };
    return Avatar;
}());



/***/ }),

/***/ "./projects/worldsim/src/lib/model/Location.ts":
/*!*****************************************************!*\
  !*** ./projects/worldsim/src/lib/model/Location.ts ***!
  \*****************************************************/
/*! exports provided: Location */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Location", function() { return Location; });
var Location = /** @class */ (function () {
    function Location(name, width, height, position, metadata, personnages, sublocations) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._metadata = metadata;
        this._position = position;
        this._avatars = personnages;
        this._sublocations = sublocations;
    }
    Object.defineProperty(Location.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "avatars", {
        get: function () {
            return this._avatars;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "avatarsRec", {
        get: function () {
            var as = [];
            this._avatars.forEach(function (a) { return as.push(a); });
            this._sublocations.forEach(function (l) { return as = as.concat(l.avatarsRec); });
            return as;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "sublocations", {
        get: function () {
            return this._sublocations;
        },
        enumerable: true,
        configurable: true
    });
    Location.prototype.addAvatar = function (p) {
        this._avatars.push(p);
        p.changeLocation(this);
    };
    Location.prototype.addSublocation = function (sl) {
        this._sublocations.push(sl);
    };
    Location.prototype.removeAvatar = function (a) {
        var io = this._avatars.indexOf(a);
        if (io < 0) {
            console.error('Avatar does not exists on this location.');
            return;
        }
        this._avatars.splice(io, 1);
    };
    return Location;
}());



/***/ }),

/***/ "./projects/worldsim/src/lib/model/Obj.ts":
/*!************************************************!*\
  !*** ./projects/worldsim/src/lib/model/Obj.ts ***!
  \************************************************/
/*! exports provided: Obj */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Obj", function() { return Obj; });
/* harmony import */ var _World__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./World */ "./projects/worldsim/src/lib/model/World.ts");

var Obj = /** @class */ (function () {
    function Obj(name, position) {
        this._name = name;
        this._position = position;
    }
    Obj.getObjName = function (id) {
        return id.split(_World__WEBPACK_IMPORTED_MODULE_0__["World"].REGISTER_SEPARATOR)[0];
    };
    Object.defineProperty(Obj.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Obj.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Obj.prototype, "onChanged", {
        set: function (value) {
            this._onChanged = value;
        },
        enumerable: true,
        configurable: true
    });
    Obj.prototype.register = function (e) {
    };
    Obj.prototype.update = function (u) {
        return false;
    };
    Obj.prototype.sendUpdate = function (u, t) {
        this._onChanged(u, t);
    };
    Obj.prototype.completedId = function (s) {
        return 'Object' + _World__WEBPACK_IMPORTED_MODULE_0__["World"].REGISTER_SEPARATOR + this.name + _World__WEBPACK_IMPORTED_MODULE_0__["World"].REGISTER_SEPARATOR + s;
    };
    return Obj;
}());



/***/ }),

/***/ "./projects/worldsim/src/lib/model/Position.ts":
/*!*****************************************************!*\
  !*** ./projects/worldsim/src/lib/model/Position.ts ***!
  \*****************************************************/
/*! exports provided: Position */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Position", function() { return Position; });
var Position = /** @class */ (function () {
    function Position(x, y) {
        this._x = x;
        this._y = y;
    }
    Position.constructFrom = function (o) {
        var x = o.x;
        var y = o.y;
        if (x === null || y === null) {
            return null;
        }
        return new Position(x, y);
    };
    Object.defineProperty(Position.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return Position;
}());



/***/ }),

/***/ "./projects/worldsim/src/lib/model/World.ts":
/*!**************************************************!*\
  !*** ./projects/worldsim/src/lib/model/World.ts ***!
  \**************************************************/
/*! exports provided: World */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "World", function() { return World; });
var World = /** @class */ (function () {
    function World() {
        this._locations = [];
        this._objects = [];
        this._observers = [];
        this._scale = { x: 1, y: 1 };
    }
    World.prototype.addLocation = function (location) {
        var _this = this;
        this._locations.push(location);
        location.avatarsRec.forEach(function (a) { return a.onChanged = function (u, t) { return _this.sendUpdate(u, t); }; });
    };
    World.prototype.addObject = function (object) {
        var _this = this;
        this._objects.push(object);
        object.onChanged = function (u, t) { return _this.sendUpdate(u, t); };
    };
    World.prototype.addObserver = function (f) {
        this._observers.push(f);
    };
    World.prototype.clean = function () {
        this._objects.splice(0, this._objects.length);
        this._locations.splice(0, this._locations.length);
        this._scale = { x: 1, y: 1 };
    };
    World.prototype.calculateHeight = function () {
        var h = 0;
        for (var _i = 0, _a = this.locations; _i < _a.length; _i++) {
            var l = _a[_i];
            if (h < l.height + l.position.y) {
                h = l.height + l.position.y;
            }
        }
        return h;
    };
    World.prototype.calculateWidth = function () {
        var w = 0;
        for (var _i = 0, _a = this.locations; _i < _a.length; _i++) {
            var l = _a[_i];
            if (w < l.width + l.position.x) {
                w = l.width + l.position.x;
            }
        }
        return w;
    };
    World.prototype.sendUpdate = function (u, t) {
        this._observers.forEach(function (o) { return o(u, t); });
    };
    Object.defineProperty(World.prototype, "locations", {
        get: function () {
            return this._locations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "objects", {
        get: function () {
            return this._objects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (scale) {
            this._scale = scale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "avatars", {
        get: function () {
            var avatars = [];
            this._locations.forEach(function (l) { return l.avatarsRec.forEach(function (a) { return avatars.push(a); }); });
            console.log(avatars);
            return avatars;
        },
        enumerable: true,
        configurable: true
    });
    World.REGISTER_SEPARATOR = '::';
    return World;
}());



/***/ }),

/***/ "./projects/worldsim/src/lib/model/objects/Lamp.ts":
/*!*********************************************************!*\
  !*** ./projects/worldsim/src/lib/model/objects/Lamp.ts ***!
  \*********************************************************/
/*! exports provided: Lamp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lamp", function() { return Lamp; });
/* harmony import */ var _Position__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Position */ "./projects/worldsim/src/lib/model/Position.ts");
/* harmony import */ var _Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Lamp = /** @class */ (function (_super) {
    __extends(Lamp, _super);
    function Lamp(name, position, color, intensity) {
        var _this = _super.call(this, name, position) || this;
        _this._color = color;
        _this._intensity = intensity;
        return _this;
    }
    Lamp.isInstance = function (o) {
        return o instanceof Lamp;
    };
    Lamp.constructFrom = function (o) {
        var name = o.name;
        var position = _Position__WEBPACK_IMPORTED_MODULE_0__["Position"].constructFrom(o.position);
        var color = o.color;
        var intensity = o.intensity;
        if (name === null || position === null || color === null || intensity === null) {
            return null;
        }
        return new Lamp(name, position, color, intensity);
    };
    Object.defineProperty(Lamp.prototype, "intensity", {
        get: function () {
            return this._intensity;
        },
        set: function (value) {
            this._intensity = Math.max(Lamp.INTENSITY_MIN, Math.min(value, Lamp.INTENSITY_MAX));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lamp.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
        },
        enumerable: true,
        configurable: true
    });
    Lamp.prototype.modifyIntensity = function (modifier) {
        this.intensity += modifier;
    };
    Lamp.prototype.register = function (e) {
        var e1 = {
            id: this.completedId(Lamp.REGISTER_INTENSITY),
            type: 'number',
            value: this.intensity
        };
        var e2 = {
            id: this.completedId(Lamp.REGISTER_COLOR),
            type: 'string',
            value: this.color
        };
        e.channels.push(e1);
        e.channels.push(e2);
    };
    Lamp.prototype.update = function (u) {
        if (u.id === this.completedId(Lamp.REGISTER_COLOR)) {
            this.intensity = u.value;
        }
        else if (u.id === this.completedId(Lamp.REGISTER_INTENSITY)) {
            this.color = u.value;
        }
        else {
            return false;
        }
        return true;
    };
    Lamp.INTENSITY_MIN = 0;
    Lamp.INTENSITY_MAX = 1;
    Lamp.REGISTER_COLOR = 'lamp_color';
    Lamp.REGISTER_INTENSITY = 'lamp_intensity';
    return Lamp;
}(_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"]));



/***/ }),

/***/ "./projects/worldsim/src/lib/model/objects/LightSensor.ts":
/*!****************************************************************!*\
  !*** ./projects/worldsim/src/lib/model/objects/LightSensor.ts ***!
  \****************************************************************/
/*! exports provided: LightSensor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LightSensor", function() { return LightSensor; });
/* harmony import */ var _Position__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Position */ "./projects/worldsim/src/lib/model/Position.ts");
/* harmony import */ var _Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types */ "./projects/worldsim/src/lib/model/types.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var LightSensor = /** @class */ (function (_super) {
    __extends(LightSensor, _super);
    function LightSensor(name, position, light) {
        var _this = _super.call(this, name, position) || this;
        _this._light = light;
        return _this;
    }
    LightSensor.isInstance = function (o) {
        return o instanceof LightSensor;
    };
    LightSensor.constructFrom = function (o) {
        var name = o.name;
        var position = _Position__WEBPACK_IMPORTED_MODULE_0__["Position"].constructFrom(o.position);
        var light = o.light;
        if (name === null || position === null || light === null) {
            return null;
        }
        return new LightSensor(name, position, light);
    };
    Object.defineProperty(LightSensor.prototype, "light", {
        get: function () {
            return this._light;
        },
        set: function (value) {
            var ll = this._light;
            this._light = Math.max(LightSensor.LIGHT_MIN, Math.min(value, LightSensor.LIGHT_MAX));
            if (ll !== this._light) {
                var u = { id: this.completedId(LightSensor.REGISTER_LIGHT), value: this._light };
                this.sendUpdate(u, _types__WEBPACK_IMPORTED_MODULE_2__["UpdateType"].EMITTER);
            }
        },
        enumerable: true,
        configurable: true
    });
    LightSensor.prototype.modifyLight = function (modifier) {
        if (modifier === 0) {
            return;
        }
        this.light += modifier;
    };
    LightSensor.prototype.register = function (e) {
        var e1 = {
            id: this.completedId(LightSensor.REGISTER_LIGHT),
            type: 'number',
            value: this.light
        };
        e.emitters.push(e1);
    };
    LightSensor.LIGHT_MIN = 0;
    LightSensor.LIGHT_MAX = 1;
    LightSensor.REGISTER_LIGHT = 'lightsensor_light';
    return LightSensor;
}(_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"]));



/***/ }),

/***/ "./projects/worldsim/src/lib/model/objects/Speakers.ts":
/*!*************************************************************!*\
  !*** ./projects/worldsim/src/lib/model/objects/Speakers.ts ***!
  \*************************************************************/
/*! exports provided: Speakers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Speakers", function() { return Speakers; });
/* harmony import */ var _Position__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Position */ "./projects/worldsim/src/lib/model/Position.ts");
/* harmony import */ var _Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Speakers = /** @class */ (function (_super) {
    __extends(Speakers, _super);
    function Speakers(name, position, volume) {
        var _this = _super.call(this, name, position) || this;
        _this._volume = volume;
        return _this;
    }
    Speakers.constructFrom = function (o) {
        var name = o.name;
        var position = _Position__WEBPACK_IMPORTED_MODULE_0__["Position"].constructFrom(o.position);
        var volume = o.volume;
        if (name === null || position === null || volume === null) {
            return null;
        }
        return new Speakers(name, position, volume);
    };
    Object.defineProperty(Speakers.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = Math.max(Speakers.VOLUME_MIN, Math.min(value, Speakers.VOLUME_MAX));
        },
        enumerable: true,
        configurable: true
    });
    Speakers.prototype.register = function (e) {
        var e1 = {
            id: this.completedId(Speakers.REGISTER_VOLUME),
            type: 'number',
            value: this.volume
        };
        e.channels.push(e1);
    };
    Speakers.prototype.update = function (u) {
        if (u.id === this.completedId(Speakers.REGISTER_VOLUME)) {
            this.volume = u.value;
        }
        else {
            return false;
        }
        return true;
    };
    Speakers.VOLUME_MIN = 0;
    Speakers.VOLUME_MAX = 1;
    Speakers.REGISTER_VOLUME = 'speakers_volume';
    return Speakers;
}(_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"]));



/***/ }),

/***/ "./projects/worldsim/src/lib/model/objects/TV.ts":
/*!*******************************************************!*\
  !*** ./projects/worldsim/src/lib/model/objects/TV.ts ***!
  \*******************************************************/
/*! exports provided: TV */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TV", function() { return TV; });
/* harmony import */ var _Position__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Position */ "./projects/worldsim/src/lib/model/Position.ts");
/* harmony import */ var _Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TV = /** @class */ (function (_super) {
    __extends(TV, _super);
    function TV(name, position, channel, volume) {
        var _this = _super.call(this, name, position) || this;
        _this._channel = channel;
        _this._volume = volume;
        return _this;
    }
    TV.isInstance = function (o) {
        return o instanceof TV;
    };
    TV.constructFrom = function (o) {
        var name = o.name;
        var position = _Position__WEBPACK_IMPORTED_MODULE_0__["Position"].constructFrom(o.position);
        var channel = o.channel;
        var volume = o.volume;
        if (name === null || position === null || channel === null || volume === null) {
            return null;
        }
        return new TV(name, position, channel, volume);
    };
    Object.defineProperty(TV.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        set: function (value) {
            this._channel = Math.max(TV.CHANNEL_MIN, Math.min(value, TV.CHANNEL_MAX));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TV.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = Math.max(TV.VOLUME_MIN, Math.min(value, TV.VOLUME_MAX));
        },
        enumerable: true,
        configurable: true
    });
    TV.prototype.modifyVolume = function (modifier) {
        this.volume += modifier;
    };
    TV.prototype.register = function (e) {
        var e1 = {
            id: this.completedId(TV.REGISTER_CHANNEL),
            type: 'number',
            value: this.channel
        };
        var e2 = {
            id: this.completedId(TV.REGISTER_VOLUME),
            type: 'string',
            value: this.volume
        };
        e.channels.push(e1);
        e.channels.push(e2);
    };
    TV.prototype.update = function (u) {
        if (u.id === this.completedId(TV.REGISTER_VOLUME)) {
            this.volume = u.value;
        }
        else if (u.id === this.completedId(TV.REGISTER_CHANNEL)) {
            this.channel = u.value;
        }
        else {
            return false;
        }
        return true;
    };
    TV.VOLUME_MIN = 0;
    TV.VOLUME_MAX = 1;
    TV.CHANNEL_MIN = 0;
    TV.CHANNEL_MAX = 18;
    TV.REGISTER_CHANNEL = 'tv_channel';
    TV.REGISTER_VOLUME = 'tv_volume';
    return TV;
}(_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"]));



/***/ }),

/***/ "./projects/worldsim/src/lib/model/objects/Thermometer.ts":
/*!****************************************************************!*\
  !*** ./projects/worldsim/src/lib/model/objects/Thermometer.ts ***!
  \****************************************************************/
/*! exports provided: Thermometer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Thermometer", function() { return Thermometer; });
/* harmony import */ var _Position__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Position */ "./projects/worldsim/src/lib/model/Position.ts");
/* harmony import */ var _Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types */ "./projects/worldsim/src/lib/model/types.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Thermometer = /** @class */ (function (_super) {
    __extends(Thermometer, _super);
    function Thermometer(name, position, temperature) {
        var _this = _super.call(this, name, position) || this;
        _this._temperature = temperature;
        return _this;
    }
    Thermometer.isInstance = function (o) {
        return o instanceof Thermometer;
    };
    Thermometer.constructFrom = function (o) {
        var name = o.name;
        var position = _Position__WEBPACK_IMPORTED_MODULE_0__["Position"].constructFrom(o.position);
        var temperature = o.temperature;
        if (name === null || position === null || temperature === null) {
            return null;
        }
        return new Thermometer(name, position, temperature);
    };
    Object.defineProperty(Thermometer.prototype, "temperature", {
        get: function () {
            return this._temperature;
        },
        set: function (value) {
            var lt = this._temperature;
            this._temperature = Math.max(Thermometer.TEMPERATURE_MIN, Math.min(value, Thermometer.TEMPERATURE_MAX));
            if (lt !== this._temperature) {
                var u = { id: this.completedId(Thermometer.REGISTER_TEMPERATURE), value: this._temperature };
                this.sendUpdate(u, _types__WEBPACK_IMPORTED_MODULE_2__["UpdateType"].EMITTER);
            }
        },
        enumerable: true,
        configurable: true
    });
    Thermometer.prototype.modifyTemperature = function (modifier) {
        if (modifier === 0) {
            return;
        }
        this.temperature += modifier;
    };
    Thermometer.prototype.register = function (e) {
        var e1 = {
            id: this.completedId(Thermometer.REGISTER_TEMPERATURE),
            type: 'number',
            value: this.temperature
        };
        e.emitters.push(e1);
    };
    Thermometer.TEMPERATURE_MIN = 10;
    Thermometer.TEMPERATURE_MAX = 30;
    Thermometer.REGISTER_TEMPERATURE = 'thermometer_temperature';
    return Thermometer;
}(_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"]));



/***/ }),

/***/ "./projects/worldsim/src/lib/model/types.ts":
/*!**************************************************!*\
  !*** ./projects/worldsim/src/lib/model/types.ts ***!
  \**************************************************/
/*! exports provided: UpdateType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateType", function() { return UpdateType; });
var UpdateType;
(function (UpdateType) {
    UpdateType[UpdateType["EMITTER"] = 0] = "EMITTER";
    UpdateType[UpdateType["CHANNEL"] = 1] = "CHANNEL";
    UpdateType[UpdateType["EVENT"] = 2] = "EVENT";
})(UpdateType || (UpdateType = {}));


/***/ }),

/***/ "./projects/worldsim/src/lib/worldsim.service.ts":
/*!*******************************************************!*\
  !*** ./projects/worldsim/src/lib/worldsim.service.ts ***!
  \*******************************************************/
/*! exports provided: WorldsimService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorldsimService", function() { return WorldsimService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _model_World__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model/World */ "./projects/worldsim/src/lib/model/World.ts");
/* harmony import */ var _model_objects_Lamp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/objects/Lamp */ "./projects/worldsim/src/lib/model/objects/Lamp.ts");
/* harmony import */ var _model_Avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/Avatar */ "./projects/worldsim/src/lib/model/Avatar.ts");
/* harmony import */ var _model_objects_Speakers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/objects/Speakers */ "./projects/worldsim/src/lib/model/objects/Speakers.ts");
/* harmony import */ var _model_Location__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./model/Location */ "./projects/worldsim/src/lib/model/Location.ts");
/* harmony import */ var _model_objects_TV__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./model/objects/TV */ "./projects/worldsim/src/lib/model/objects/TV.ts");
/* harmony import */ var _model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./model/objects/Thermometer */ "./projects/worldsim/src/lib/model/objects/Thermometer.ts");
/* harmony import */ var _model_objects_LightSensor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./model/objects/LightSensor */ "./projects/worldsim/src/lib/model/objects/LightSensor.ts");
/* harmony import */ var _model_Obj__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./model/Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
/* harmony import */ var _model_Position__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./model/Position */ "./projects/worldsim/src/lib/model/Position.ts");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/lib/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _model_types__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./model/types */ "./projects/worldsim/src/lib/model/types.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













/**
 * Entry point service for worldsim lib.
 */
var WorldsimService = /** @class */ (function () {
    function WorldsimService() {
        var _this = this;
        /**
         * Boolean indicating if we are connected to the server.
         * @type {boolean}
         * @private
         */
        this._isConnected = false;
        this._world = new _model_World__WEBPACK_IMPORTED_MODULE_1__["World"]();
        this._socket = Object(socket_io_client__WEBPACK_IMPORTED_MODULE_11__["connect"])('/' + WorldsimService_1.NAMESPACE);
        // Setup listeners on the socket
        this._socket.on('connect', function () {
            _this._isConnected = true;
            // Send initial description if we did not send it already.
            if (_this._initialDescription) {
                _this.sendInitialDescription();
            }
        });
        this._socket.on('disconnect', function () { return _this._isConnected = false; });
        this._socket.on(WorldsimService_1.EVENT_UPDATE_CHANNEL, function (u) { return _this.receivedUpdate(u); });
    }
    WorldsimService_1 = WorldsimService;
    /**
     * Load the environment contained in env.
     * @param {JSONWorld} env the environment.
     */
    WorldsimService.prototype.loadEnvironment = function (env) {
        if (!env.name) {
            return false;
        }
        // Init objects
        for (var _i = 0, _a = env.objects; _i < _a.length; _i++) {
            var o = _a[_i];
            var no = void 0;
            switch (o.type) {
                case 'Lamp':
                    no = _model_objects_Lamp__WEBPACK_IMPORTED_MODULE_2__["Lamp"].constructFrom(o);
                    break;
                case 'Speakers':
                    no = _model_objects_Speakers__WEBPACK_IMPORTED_MODULE_4__["Speakers"].constructFrom(o);
                    break;
                case 'TV':
                    no = _model_objects_TV__WEBPACK_IMPORTED_MODULE_6__["TV"].constructFrom(o);
                    break;
                case 'Thermometer':
                    no = _model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_7__["Thermometer"].constructFrom(o);
                    break;
                case 'LightSensor':
                    no = _model_objects_LightSensor__WEBPACK_IMPORTED_MODULE_8__["LightSensor"].constructFrom(o);
                    break;
            }
            if (no !== null) {
                this._world.addObject(no);
            }
            else {
                this.cleanEnvironment();
                return false;
            }
        }
        // Init locations
        for (var _b = 0, _c = env.locations; _b < _c.length; _b++) {
            var l = _c[_b];
            this._world.addLocation(this.constructLocation(l));
        }
        if (!this._world.locations.find(function (l) { return l.name === 'Outside'; })) {
            var w = this._world.calculateWidth();
            var h = this._world.calculateHeight();
            var l = new _model_Location__WEBPACK_IMPORTED_MODULE_5__["Location"]('Outside', w, h / 3, new _model_Position__WEBPACK_IMPORTED_MODULE_10__["Position"](0, h), undefined, [], []);
            this._world.addLocation(l);
        }
        // Search for a valid scale
        if (env.scale) {
            if (env.scale.x > 0 && env.scale.y > 0) {
                this._world.scale = env.scale;
            }
            else {
                this.cleanEnvironment();
                return false;
            }
        }
        this._world.addObserver(this.sendUpdate.bind(this));
        var id = {
            simulatedEnvironmentName: env.name,
            channels: [],
            emitters: [],
            eventers: []
        };
        this._world.objects.forEach(function (o) { return o.register(id); });
        this._world.avatars.forEach(function (o) { return o.register(id); });
        this._initialDescription = id;
        if (this._isConnected) {
            this.sendInitialDescription();
        }
        return true;
    };
    WorldsimService.prototype.cleanEnvironment = function () {
        this._world.clean();
    };
    /**
     * Send an update to the server if we are connected.
     * @param {Update} u the update to send.
     * @param {UpdateType} t the type of the update to send.
     */
    WorldsimService.prototype.sendUpdate = function (u, t) {
        if (!this._isConnected) {
            console.log('Not connected.');
            return;
        }
        switch (t) {
            case _model_types__WEBPACK_IMPORTED_MODULE_12__["UpdateType"].EMITTER:
                this._socket.emit(WorldsimService_1.EVENT_UPDATE_EMITTER, u);
                break;
            case _model_types__WEBPACK_IMPORTED_MODULE_12__["UpdateType"].CHANNEL:
                this._socket.emit(WorldsimService_1.EVENT_UPDATE_CHANNEL, u);
                break;
            case _model_types__WEBPACK_IMPORTED_MODULE_12__["UpdateType"].EVENT:
                this._socket.emit(WorldsimService_1.EVENT_UPDATE_EVENTER, u);
                break;
            default:
                console.error('Update type incorrect');
                return;
        }
        console.log('Sent update.');
    };
    WorldsimService.prototype.receivedUpdate = function (u) {
        var objName = _model_Obj__WEBPACK_IMPORTED_MODULE_9__["Obj"].getObjName(u.id);
        var o = this._world.objects.find(function (p) { return p.name === objName; });
        if (!o.update(u)) {
            console.error('Could not find the right object to update!');
        }
    };
    /**
     * Send the initial description of the environment to the server if we can.
     */
    WorldsimService.prototype.sendInitialDescription = function () {
        if (this._isConnected && this._initialDescription) {
            this._socket.emit(WorldsimService_1.EVENT_INITIALDESCRIPTION, this._initialDescription);
        }
    };
    /**
     * Construct a location, recursively, with its sublocations.
     * @param sl the description of the location
     * @returns {Location} the constructed location object.
     */
    WorldsimService.prototype.constructLocation = function (sl) {
        var ps = [];
        var ls = [];
        if (sl.avatars) {
            for (var _i = 0, _a = sl.avatars; _i < _a.length; _i++) {
                var p = _a[_i];
                ps.push(new _model_Avatar__WEBPACK_IMPORTED_MODULE_3__["Avatar"](p.name, sl.name, (p.metadata ? p.metadata : undefined)));
            }
        }
        if (sl.sublocations) {
            for (var _b = 0, _c = sl.sublocations; _b < _c.length; _b++) {
                var l = _c[_b];
                ls.push(this.constructLocation(l));
            }
        }
        return new _model_Location__WEBPACK_IMPORTED_MODULE_5__["Location"](sl.name, sl.width, sl.height, sl.position, (sl.metadata ? sl.metadata : undefined), ps, ls);
    };
    Object.defineProperty(WorldsimService.prototype, "world", {
        get: function () {
            return this._world;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldsimService.prototype, "isConnected", {
        get: function () {
            return this._isConnected;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Namespace chosen in the server.
     * @type {string}
     */
    WorldsimService.NAMESPACE = 'simulator';
    /**
     * Name of the communication channels, must be the same as those used in the server
     * @type {string}
     */
    WorldsimService.EVENT_UPDATE_EMITTER = 'updateEmitter';
    WorldsimService.EVENT_UPDATE_CHANNEL = 'updateChannel';
    WorldsimService.EVENT_UPDATE_EVENTER = 'triggerEvent';
    WorldsimService.EVENT_INITIALDESCRIPTION = 'initialDescription';
    WorldsimService = WorldsimService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], WorldsimService);
    return WorldsimService;
    var WorldsimService_1;
}());



/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#background {\r\n  background: url('background-paint.jpg');\r\n  background-size: cover;\r\n  -webkit-filter: blur(6px);\r\n          filter: blur(6px);\r\n  z-index: -1;\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n}\r\n\r\n#title {\r\n  text-align: center;\r\n  background-color: hsl(215, 8%, 48%);\r\n  color: white;\r\n  margin: 0;\r\n  padding: 12px 0;\r\n}\r\n\r\n#intro {\r\n  background-color: hsl(215, 8%, 60%);\r\n  margin: 0;\r\n  padding: 10px;\r\n  color: #ffffff;\r\n}\r\n\r\n.title {\r\n  background-color: hsla(215, 10%, 8%, .4);\r\n  color: white;\r\n  padding: 12px 0;\r\n  margin: 0;\r\n  text-align: center;\r\n}\r\n\r\n.items {\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n}\r\n\r\n.item {\r\n  -ms-flex-positive: 1;\r\n      flex-grow: 1;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -ms-flex-pack: center;\r\n      justify-content: center;\r\n  /*background: linear-gradient(to right, #444444c0, #555555c0);*/\r\n  background: linear-gradient(to right, #777777c0, #888888c0);\r\n  color: white;\r\n}\r\n\r\n#map {\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  color: black;\r\n  margin: 12px 0;\r\n}\r\n"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"background\"></div>\r\n\r\n<div id=\"container\">\r\n  <h1 id=\"title\">\r\n    Environment Simulator\r\n  </h1>\r\n\r\n  <h3 id=\"intro\">\r\n    Env Sim: Environment simulator for my M1 Info. It simulates the environment. To use with CCBL server.\r\n  </h3>\r\n\r\n  <div id=\"content\">\r\n    <h2 class=\"title\">\r\n      Environment description\r\n    </h2>\r\n\r\n    <div class=\"items\">\r\n      <div class=\"item\">\r\n        <div class=\"item-wrapper\">\r\n          <h2>List of objects<span style=\"display: block; font-size: 60%\">Objects can <i>send or receive</i> data to or from the server</span></h2>\r\n          <ul>\r\n            <li *ngFor=\"let o of worldsimService.world.objects\">\r\n              <b>{{ o.name }}</b> at <span class=\"list-location\">({{ o.position.x }}, {{ o.position.y }})</span>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"item\">\r\n        <div class=\"item-wrapper\">\r\n          <h2>List of locations</h2>\r\n          <ul>\r\n            <li *ngFor=\"let l of worldsimService.world.locations\">\r\n              <app-show-location [location]=\"l\"></app-show-location>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <h2 class=\"title\">\r\n      Location Map (Beta)\r\n    </h2>\r\n\r\n    <div class=\"items\">\r\n      <div class=\"item\">\r\n        <div class=\"item-wrapper\" id=\"map\">\r\n          <app-show-map\r\n            [onConfigure]=\"onConfigureBinded\"\r\n            [world]=\"worldsimService.world\"\r\n            [magnificationX]=\"magnificationX\"\r\n            [magnificationY]=\"magnificationY\">\r\n          </app-show-map>\r\n\r\n          <app-configure\r\n            [obj]=\"configure\">\r\n          </app-configure>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: ShowLocationComponent, AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowLocationComponent", function() { return ShowLocationComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_worldsim_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/worldsim.service */ "./projects/worldsim/src/lib/worldsim.service.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_Location__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/Location */ "./projects/worldsim/src/lib/model/Location.ts");
/* harmony import */ var _environments__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments */ "./src/app/environments.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ShowLocationComponent = /** @class */ (function () {
    function ShowLocationComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_Location__WEBPACK_IMPORTED_MODULE_2__["Location"])
    ], ShowLocationComponent.prototype, "location", void 0);
    ShowLocationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-location',
            styles: [],
            template: "\n    <b>{{ location.name }}</b> &rArr;\n    <span class=\"list-dimensions\">{{location.width}}x{{location.height}}</span>\n    at <span class=\"list-location\">({{location.position.x + ', ' + location.position.y}})</span>\n    <ul *ngIf=\"location.sublocations.length > 0\">\n      <li *ngFor=\"let l of location.sublocations\">\n        <app-show-location [location]=\"l\"></app-show-location>\n      </li>\n    </ul>\n  "
        })
    ], ShowLocationComponent);
    return ShowLocationComponent;
}());

var AppComponent = /** @class */ (function () {
    function AppComponent(worldsimService) {
        this.worldsimService = worldsimService;
        this.magnificationX = 1;
        this.magnificationY = 1;
        this.worldsimService.loadEnvironment(_environments__WEBPACK_IMPORTED_MODULE_3__["environments"].find(function (p) { return p.name === 'Maison'; }));
        this.magnificationX = this.worldsimService.world.scale.x;
        this.magnificationY = this.worldsimService.world.scale.y;
    }
    AppComponent.prototype.onConfigure = function (param) {
        this.configure = param;
    };
    Object.defineProperty(AppComponent.prototype, "onConfigureBinded", {
        get: function () {
            return this.onConfigure.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_projects_worldsim_src_lib_worldsim_service__WEBPACK_IMPORTED_MODULE_1__["WorldsimService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _projects_worldsim_src_lib_worldsim_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/worldsim.service */ "./projects/worldsim/src/lib/worldsim.service.ts");
/* harmony import */ var _show_map_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./show-map.component */ "./src/app/show-map.component.ts");
/* harmony import */ var _show_map_obj_show_map_location_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./show-map-obj/show-map-location.component */ "./src/app/show-map-obj/show-map-location.component.ts");
/* harmony import */ var _show_map_object_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./show-map-object.component */ "./src/app/show-map-object.component.ts");
/* harmony import */ var _show_map_obj_show_map_lamp_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./show-map-obj/show-map-lamp.component */ "./src/app/show-map-obj/show-map-lamp.component.ts");
/* harmony import */ var _configure_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./configure.component */ "./src/app/configure.component.ts");
/* harmony import */ var _configure_obj_configure_lamp_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./configure-obj/configure-lamp.component */ "./src/app/configure-obj/configure-lamp.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _show_map_obj_show_map_tv_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./show-map-obj/show-map-tv.component */ "./src/app/show-map-obj/show-map-tv.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _show_map_slider_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./show-map-slider.component */ "./src/app/show-map-slider.component.ts");
/* harmony import */ var _show_map_obj_show_map_thermometer_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./show-map-obj/show-map-thermometer.component */ "./src/app/show-map-obj/show-map-thermometer.component.ts");
/* harmony import */ var _configure_obj_configure_thermometer_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./configure-obj/configure-thermometer.component */ "./src/app/configure-obj/configure-thermometer.component.ts");
/* harmony import */ var alx_dragdrop__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! alx-dragdrop */ "./node_modules/alx-dragdrop/build/DragDropModule.js");
/* harmony import */ var alx_dragdrop__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(alx_dragdrop__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _show_map_obj_show_map_lamp_icon_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./show-map-obj/show-map-lamp-icon.component */ "./src/app/show-map-obj/show-map-lamp-icon.component.ts");
/* harmony import */ var _show_map_object_template_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./show-map-object-template.component */ "./src/app/show-map-object-template.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
                _app_component__WEBPACK_IMPORTED_MODULE_2__["ShowLocationComponent"],
                _show_map_component__WEBPACK_IMPORTED_MODULE_4__["ShowMapComponent"],
                _show_map_obj_show_map_location_component__WEBPACK_IMPORTED_MODULE_5__["ShowMapLocationComponent"],
                _show_map_object_component__WEBPACK_IMPORTED_MODULE_6__["ShowMapObjectComponent"],
                _show_map_object_template_component__WEBPACK_IMPORTED_MODULE_20__["ShowMapObjectTemplateComponent"],
                _show_map_obj_show_map_lamp_component__WEBPACK_IMPORTED_MODULE_7__["ShowMapLampComponent"],
                _show_map_obj_show_map_lamp_icon_component__WEBPACK_IMPORTED_MODULE_19__["ShowMapLampIconComponent"],
                _show_map_obj_show_map_tv_component__WEBPACK_IMPORTED_MODULE_11__["ShowMapTvComponent"],
                _show_map_obj_show_map_thermometer_component__WEBPACK_IMPORTED_MODULE_16__["ShowMapThermometerComponent"],
                _show_map_slider_component__WEBPACK_IMPORTED_MODULE_15__["ShowMapSliderComponent"],
                _configure_component__WEBPACK_IMPORTED_MODULE_8__["ConfigureComponent"],
                _configure_obj_configure_lamp_component__WEBPACK_IMPORTED_MODULE_9__["ConfigureLampComponent"],
                _configure_obj_configure_thermometer_component__WEBPACK_IMPORTED_MODULE_17__["ConfigureThermometerComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_13__["MatInputModule"],
                alx_dragdrop__WEBPACK_IMPORTED_MODULE_18__["DragDropModule"]
            ],
            providers: [
                _projects_worldsim_src_lib_worldsim_service__WEBPACK_IMPORTED_MODULE_3__["WorldsimService"],
                _angular_common__WEBPACK_IMPORTED_MODULE_12__["DecimalPipe"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/configure-obj/configure-lamp.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/configure-obj/configure-lamp.component.ts ***!
  \***********************************************************/
/*! exports provided: ConfigureLampComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigureLampComponent", function() { return ConfigureLampComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/objects/Lamp */ "./projects/worldsim/src/lib/model/objects/Lamp.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfigureLampComponent = /** @class */ (function () {
    function ConfigureLampComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_1__["Lamp"])
    ], ConfigureLampComponent.prototype, "lamp", void 0);
    ConfigureLampComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-configure-lamp',
            styles: [
                "\n      .full-width {\n        width: 100%;\n      }\n    "
            ],
            template: "\n    <form>\n      <mat-form-field class=\"full-width\">\n        <input\n          matInput\n          name=\"lamp-color\"\n          placeholder=\"Color\"\n          [(ngModel)]=\"lamp.color\">\n      </mat-form-field>\n      <mat-form-field class=\"full-width\">\n        <input\n          matInput\n          name=\"lamp-intensity\"\n          placeholder=\"Intensity\"\n          [(ngModel)]=\"lamp.intensity\"\n          type=\"number\"\n          step=\"0.05\"\n          min=\"0\"\n          max=\"1\">\n      </mat-form-field>\n    </form>\n  "
        })
    ], ConfigureLampComponent);
    return ConfigureLampComponent;
}());



/***/ }),

/***/ "./src/app/configure-obj/configure-thermometer.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/configure-obj/configure-thermometer.component.ts ***!
  \******************************************************************/
/*! exports provided: ConfigureThermometerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigureThermometerComponent", function() { return ConfigureThermometerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/objects/Thermometer */ "./projects/worldsim/src/lib/model/objects/Thermometer.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfigureThermometerComponent = /** @class */ (function () {
    function ConfigureThermometerComponent() {
        this.Thermometer = _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"];
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"])
    ], ConfigureThermometerComponent.prototype, "thermometer", void 0);
    ConfigureThermometerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-configure-thermometer',
            styles: [
                "\n      .full-width {\n        width: 100%;\n      }\n    "
            ],
            template: "\n    <form>\n      <mat-form-field class=\"full-width\">\n        <input\n          matInput\n          name=\"temp-color\"\n          placeholder=\"Temperature\"\n          type=\"number\"\n          step=\"1\"\n          [min]=\"Thermometer.TEMPERATURE_MIN\"\n          [max]=\"Thermometer.TEMPERATURE_MAX\"\n          [(ngModel)]=\"thermometer.temperature\">\n      </mat-form-field>\n    </form>\n  "
        })
    ], ConfigureThermometerComponent);
    return ConfigureThermometerComponent;
}());



/***/ }),

/***/ "./src/app/configure.component.css":
/*!*****************************************!*\
  !*** ./src/app/configure.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#container {\r\n  padding: 0 20px 10px 20px;\r\n  margin-left: 40px;\r\n  background-color: #eee;\r\n  border: 2px solid #444;\r\n  width: 300px;\r\n}\r\n\r\n#title {\r\n  text-align: center;\r\n}\r\n\r\n#description {\r\n  text-align: justify;\r\n  font-style: italic;\r\n}\r\n"

/***/ }),

/***/ "./src/app/configure.component.html":
/*!******************************************!*\
  !*** ./src/app/configure.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"container\">\r\n  <h3 id=\"title\">Configure panel</h3>\r\n\r\n  <div *ngIf=\"obj != null\">\r\n    <p>\r\n      Configure {{obj.name}}\r\n    </p>\r\n\r\n    <app-configure-lamp *ngIf=\"Lamp.isInstance(obj)\" [lamp]=\"obj\"></app-configure-lamp>\r\n    <app-configure-thermometer *ngIf=\"Thermometer.isInstance(obj)\" [thermometer]=\"obj\"></app-configure-thermometer>\r\n  </div>\r\n\r\n  <div *ngIf=\"obj == null\" id=\"description\">\r\n    <p>\r\n      Here, you can configure an object.\r\n      Please click (without dragging) an object on the map,\r\n      and you will be able to see and change any value of it.\r\n    </p>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/configure.component.ts":
/*!****************************************!*\
  !*** ./src/app/configure.component.ts ***!
  \****************************************/
/*! exports provided: ConfigureComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigureComponent", function() { return ConfigureComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/Lamp */ "./projects/worldsim/src/lib/model/objects/Lamp.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_TV__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/TV */ "./projects/worldsim/src/lib/model/objects/TV.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/Thermometer */ "./projects/worldsim/src/lib/model/objects/Thermometer.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_LightSensor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/LightSensor */ "./projects/worldsim/src/lib/model/objects/LightSensor.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ConfigureComponent = /** @class */ (function () {
    function ConfigureComponent() {
        this.Lamp = _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_2__["Lamp"];
        this.TV = _projects_worldsim_src_lib_model_objects_TV__WEBPACK_IMPORTED_MODULE_3__["TV"];
        this.Thermometer = _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_4__["Thermometer"];
        this.LightSensor = _projects_worldsim_src_lib_model_objects_LightSensor__WEBPACK_IMPORTED_MODULE_5__["LightSensor"];
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"])
    ], ConfigureComponent.prototype, "obj", void 0);
    ConfigureComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-configure',
            template: __webpack_require__(/*! ./configure.component.html */ "./src/app/configure.component.html"),
            styles: [__webpack_require__(/*! ./configure.component.css */ "./src/app/configure.component.css")]
        })
    ], ConfigureComponent);
    return ConfigureComponent;
}());



/***/ }),

/***/ "./src/app/environments.ts":
/*!*********************************!*\
  !*** ./src/app/environments.ts ***!
  \*********************************/
/*! exports provided: environments */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environments", function() { return environments; });
var environments = [
    {
        name: 'Maison',
        scale: {
            x: 2.6,
            y: 1.8
        },
        objects: [
            {
                type: 'Lamp',
                position: {
                    x: 260,
                    y: 270
                },
                name: 'Lampe du salon',
                color: '#fff',
                intensity: 0.8
            },
            {
                type: 'Lamp',
                position: {
                    x: 4,
                    y: 220
                },
                name: 'Lampe de Chambre 1',
                color: '#f55',
                intensity: 0.5
            },
            {
                'type': 'Lamp',
                'position': {
                    'x': 4,
                    'y': 270
                },
                'name': 'Lampe de Chambre 2',
                'color': '#55f',
                'intensity': 0.5
            },
            {
                'type': 'TV',
                'position': {
                    'x': 260,
                    'y': 100
                },
                'name': 'TV du salon',
                'channel': 1,
                'volume': 0.2
            },
            {
                'type': 'Thermometer',
                'position': {
                    'x': 260,
                    'y': 10
                },
                'name': 'Thermometre du salon',
                'temperature': 22
            }
        ],
        locations: [
            {
                'name': 'Entrée',
                'width': 80,
                'height': 100,
                'position': {
                    x: 0,
                    y: 0
                }
            },
            {
                'name': 'Cuisine',
                'width': 120,
                'height': 100,
                'position': {
                    x: 80,
                    y: 0
                },
                'avatars': [{ name: 'Alice' }]
            },
            {
                'name': 'Salon',
                'width': 100,
                'height': 300,
                'position': {
                    x: 200,
                    y: 0
                }
            },
            {
                'name': 'Couloir 1',
                'width': 200,
                'height': 30,
                'position': {
                    x: 0,
                    y: 100
                }
            },
            {
                'name': 'Couloir 2',
                'width': 30,
                'height': 170,
                'position': {
                    x: 120,
                    y: 130
                }
            },
            {
                'name': 'WC',
                'width': 50,
                'height': 40,
                'position': {
                    x: 150,
                    y: 130
                }
            },
            {
                'name': 'SDB',
                'width': 50,
                'height': 130,
                'position': {
                    x: 150,
                    y: 170
                }
            },
            {
                'name': 'Chambres',
                'width': 120,
                'height': 170,
                'position': {
                    x: 0,
                    y: 130
                },
                'sublocations': [
                    {
                        'name': 'Chambre 1',
                        'width': 120,
                        'height': 120,
                        'position': {
                            x: 0,
                            y: 0
                        },
                        'avatars': [{ name: 'Bob' }]
                    },
                    {
                        'name': 'Chambre 2',
                        'width': 120,
                        'height': 50,
                        'position': {
                            x: 0,
                            y: 120
                        },
                    }
                ]
            }
        ]
    },
    {
        name: 'Appart',
        scale: {
            x: 4,
            y: 4
        },
        objects: [
            {
                'type': 'Lamp',
                'position': {
                    'x': 5,
                    'y': 5
                },
                'name': 'Lampe de la SDB',
                'color': '#fff',
                'intensity': 1
            },
            {
                'type': 'Lamp',
                'position': {
                    'x': 5,
                    'y': 85
                },
                'name': 'Lampe de la pièce',
                'color': '#07f',
                'intensity': .5
            }
        ],
        locations: [
            {
                'name': 'Pièce',
                'width': 100,
                'height': 100,
                'position': {
                    x: 0,
                    y: 0
                },
                sublocations: [
                    {
                        'name': 'SDB',
                        'width': 50,
                        'height': 50,
                        'position': {
                            x: 0,
                            y: 0
                        }
                    }
                ]
            }
        ]
    }
];


/***/ }),

/***/ "./src/app/show-map-obj/show-map-lamp-icon.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/show-map-obj/show-map-lamp-icon.component.ts ***!
  \**************************************************************/
/*! exports provided: ShowMapLampIconComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapLampIconComponent", function() { return ShowMapLampIconComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/objects/Lamp */ "./projects/worldsim/src/lib/model/objects/Lamp.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ShowMapLampIconComponent = /** @class */ (function () {
    function ShowMapLampIconComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_1__["Lamp"])
    ], ShowMapLampIconComponent.prototype, "object", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapLampIconComponent.prototype, "dimens", void 0);
    ShowMapLampIconComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-lamp-icon',
            styles: ["\n    /* Si besoin des border en inside, la passer sur un pseudo element ::after */\n    #t {\n      width: 500px;\n      height: 500px;\n      position: relative;\n    }\n    /* #t > div */\n    #t25, #t50, #t75, #t100, #tu, #bg {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      border-radius: 50%;\n      border: 1px dashed orange;\n      transform: translate(-50%, -50%);\n    }\n    #bg {\n      border: none;\n      background-color: rgba(255,255,255,.1);\n      width: 100%;\n      height: 100%;\n    }\n    #tu {\n      width: 37%;\n      height: 37%;\n      border: 2px solid hsl(200, 100%, 50%);\n    }\n    #t25 {\n      width: 25%;\n      height: 25%;\n      border-color: green;\n    }\n    #t50 {\n      width: 50%;\n      height: 50%;\n    }\n    #t75 {\n      width: 75%;\n      height: 75%;\n    }\n    #t100 {\n      width: 100%;\n      height: 100%;\n      border-color: red;\n    }\n  "],
            template: "\n    <div id=\"t\" [style.height]=\"dimens+'px'\" [style.width]=\"dimens+'px'\">\n      <div id=\"bg\"></div>\n      <div id=\"t25\"></div>\n      <div id=\"t50\"></div>\n      <div id=\"t75\"></div>\n      <div id=\"t100\"></div>\n      <div id=\"tu\"\n           [style.height]=\"(object.intensity*100)+'%'\"\n           [style.width]=\"(object.intensity*100)+'%'\"\n           [style.border-color]=\"object.color\"></div>\n    </div>\n  "
        })
    ], ShowMapLampIconComponent);
    return ShowMapLampIconComponent;
}());



/***/ }),

/***/ "./src/app/show-map-obj/show-map-lamp.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/show-map-obj/show-map-lamp.component.ts ***!
  \*********************************************************/
/*! exports provided: ShowMapLampComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapLampComponent", function() { return ShowMapLampComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/objects/Lamp */ "./projects/worldsim/src/lib/model/objects/Lamp.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ShowMapLampComponent = /** @class */ (function () {
    function ShowMapLampComponent(decimalPipe) {
        var _this = this;
        this.decimalPipe = decimalPipe;
        this.props = [
            // Intensity
            function () { return _this.decimalPipe.transform(_this.object.intensity * 100, '1.0-2') + '%'; },
            // Color
            function () { return _this.object.color; }
        ];
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_1__["Lamp"])
    ], ShowMapLampComponent.prototype, "object", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapLampComponent.prototype, "onConfigure", void 0);
    ShowMapLampComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-lamp',
            template: "\n    <app-show-map-object-template\n        [object]=\"object\"\n        [props]=\"props\"\n        [onConfigure]=\"onConfigure\"\n        [modifiable]=\"false\"\n        displayName=\"Lamp\">\n      <app-show-map-lamp-icon [object]=\"object\" [dimens]=\"36\"></app-show-map-lamp-icon>\n    </app-show-map-object-template>\n  "
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DecimalPipe"]])
    ], ShowMapLampComponent);
    return ShowMapLampComponent;
}());



/***/ }),

/***/ "./src/app/show-map-obj/show-map-location.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/show-map-obj/show-map-location.component.ts ***!
  \*************************************************************/
/*! exports provided: ShowMapLocationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapLocationComponent", function() { return ShowMapLocationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_Location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/Location */ "./projects/worldsim/src/lib/model/Location.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ShowMapLocationComponent = /** @class */ (function () {
    function ShowMapLocationComponent() {
        this.color = _utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].randomColorHSL({ min: 10, max: 15 }, { min: 30, max: 40 });
    }
    ShowMapLocationComponent.prototype.onClick = function () {
        console.log(this.location.name);
    };
    ShowMapLocationComponent.prototype.dropped = function (e) {
        if (this.location === e.location)
            return;
        console.log('Dropped ' + e.avatar.name + ' from ' + e.location.name);
        this.location.addAvatar(e.avatar);
        e.location.removeAvatar(e.avatar);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_Location__WEBPACK_IMPORTED_MODULE_1__["Location"])
    ], ShowMapLocationComponent.prototype, "location", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapLocationComponent.prototype, "magnificationX", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapLocationComponent.prototype, "magnificationY", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ShowMapLocationComponent.prototype, "onClick", null);
    ShowMapLocationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-location',
            styles: ["\n    .location {\n      position: absolute;\n    }\n    .location::before {\n      content: '';\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      right: 0;\n      left: 0;\n      border: 2px solid black;\n    }\n    #display {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100%;\n    }\n    .location-name {\n      font-size: 130%;\n      z-index: 1;\n    }\n    .can-drop {\n    }\n    .can-drop::after {\n      content: '';\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      right: 0;\n      left: 0;\n      z-index: 2;\n      border: 2px solid red;\n    }\n    .avatar {\n      cursor: pointer;\n      text-align: center;\n    }\n    .avatar:hover {\n      color: red;\n    }\n  "],
            template: "\n    <div\n        class=\"location\"\n        alx-dropzone\n        (alx-ondrop)=\"dropped($event)\"\n        [style.background-color]=\"color\"\n        alx-drag-over-css=\"can-drop\"\n        [style.top]=\"(location.position.y * magnificationY) + 'px'\"\n        [style.left]=\"(location.position.x * magnificationX) + 'px'\"\n        [style.width]=\"(location.width * magnificationX) + 'px'\"\n        [style.height]=\"(location.height * magnificationY) + 'px'\">\n      <app-show-map-location\n          *ngFor=\"let s of location.sublocations\"\n          [location]=\"s\"\n          [magnificationY]=\"magnificationY\"\n          [magnificationX]=\"magnificationX\">\n      </app-show-map-location>\n      <div id=\"display\" *ngIf=\"location.sublocations.length === 0\">\n        <div class=\"location-name\">\n          <div style=\"font-weight: bold\">{{location.name}}</div>\n          <div class=\"avatar\" *ngFor=\"let a of location.avatars\" [alx-draggable]=\"{location: location, avatar: a}\">\n            <i class=\"material-icons\">person_pin</i>\n            <span style=\"vertical-align: top\">{{a.name}}</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  "
        })
    ], ShowMapLocationComponent);
    return ShowMapLocationComponent;
}());



/***/ }),

/***/ "./src/app/show-map-obj/show-map-thermometer.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/show-map-obj/show-map-thermometer.component.ts ***!
  \****************************************************************/
/*! exports provided: ShowMapThermometerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapThermometerComponent", function() { return ShowMapThermometerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/objects/Thermometer */ "./projects/worldsim/src/lib/model/objects/Thermometer.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ShowMapThermometerComponent = /** @class */ (function () {
    function ShowMapThermometerComponent() {
        var _this = this;
        this.Thermometer = _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"];
        this.format = 'Temp.: %d°C';
        this.props = [
            function () { return _this.object.temperature + '°C'; }
        ];
        this.calculateColor = function (n) {
            var cold = '0000ff';
            var hot = 'ff0000';
            return _utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].scaleColor(n, cold, hot);
        };
    }
    ShowMapThermometerComponent.prototype.ngOnChanges = function (changes) {
        var ratio = (this.object.temperature - _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"].TEMPERATURE_MIN) / (_projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"].TEMPERATURE_MAX - _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"].TEMPERATURE_MIN);
        this.iconColor = this.calculateColor(ratio);
    };
    ShowMapThermometerComponent.prototype.modify = function (modifier) {
        this.object.modifyTemperature(modifier);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"])
    ], ShowMapThermometerComponent.prototype, "object", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapThermometerComponent.prototype, "onConfigure", void 0);
    ShowMapThermometerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-thermometer',
            template: "\n    <app-show-map-object-template\n        [object]=\"object\"\n        [props]=\"props\"\n        [onConfigure]=\"onConfigure\"\n        [modifiable]=\"true\"\n        [modificationValue]=\"object.temperature\"\n        [modificationMin]=\"Thermometer.TEMPERATURE_MIN\"\n        [modificationMax]=\"Thermometer.TEMPERATURE_MAX\"\n        [modificationFormat]=\"format\"\n        [modificationStrength]=\"3\"\n        [modification]=\"modify\"\n        displayName=\"Thermometer\"\n        [calculateColor]=\"calculateColor\">\n      <div>\n        <i class=\"material-icons md-36\" [style.color]=\"iconColor\">whatshot</i>\n      </div>\n    </app-show-map-object-template>\n  "
        })
    ], ShowMapThermometerComponent);
    return ShowMapThermometerComponent;
}());



/***/ }),

/***/ "./src/app/show-map-obj/show-map-tv.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/show-map-obj/show-map-tv.component.ts ***!
  \*******************************************************/
/*! exports provided: ShowMapTvComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapTvComponent", function() { return ShowMapTvComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_TV__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../projects/worldsim/src/lib/model/objects/TV */ "./projects/worldsim/src/lib/model/objects/TV.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ShowMapTvComponent = /** @class */ (function () {
    function ShowMapTvComponent(decimalPipe) {
        var _this = this;
        this.decimalPipe = decimalPipe;
        this.props = [
            function () { return _this.object.channel; },
            function () { return _this.decimalPipe.transform(_this.object.volume * 100, '1.0-2') + '%'; }
        ];
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_objects_TV__WEBPACK_IMPORTED_MODULE_1__["TV"])
    ], ShowMapTvComponent.prototype, "object", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapTvComponent.prototype, "onConfigure", void 0);
    ShowMapTvComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-tv',
            template: "\n    <app-show-map-object-template\n        [object]=\"object\"\n        [props]=\"props\"\n        [onConfigure]=\"onConfigure\"\n        [modifiable]=\"false\"\n        displayName=\"TV\">\n      <div>\n        <i class=\"material-icons md-36\">tv</i>\n      </div>\n    </app-show-map-object-template>\n  "
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DecimalPipe"]])
    ], ShowMapTvComponent);
    return ShowMapTvComponent;
}());



/***/ }),

/***/ "./src/app/show-map-object-template.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/show-map-object-template.component.ts ***!
  \*******************************************************/
/*! exports provided: ShowMapObjectTemplateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapObjectTemplateComponent", function() { return ShowMapObjectTemplateComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_Obj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ShowMapObjectTemplateComponent = /** @class */ (function () {
    function ShowMapObjectTemplateComponent() {
        this.mDown = false;
        this.mOn = false;
        this.modifier = 0;
        this.styles = {
            background: 'none',
            cursor: this.modifiable ? 'w-resize' : 'pointer'
        };
    }
    ShowMapObjectTemplateComponent.prototype.onMouseEnter = function () {
        this.styles.background = '#aaa8';
        this.mOn = true;
        this.mouseEnter();
    };
    ShowMapObjectTemplateComponent.prototype.onMouseLeave = function () {
        this.styles.background = '#fff0';
        this.mDown = false;
        this.mOn = false;
        this.launchModification();
        this.mouseLeave();
    };
    ShowMapObjectTemplateComponent.prototype.onMouseDown = function (event) {
        this.mDown = true;
        this.last = event;
        this.mouseDown();
    };
    ShowMapObjectTemplateComponent.prototype.onMouseMove = function (event) {
        if (this.mDown) {
            this.modifier = Math.round((event.clientX - this.last.clientX) / (this.modificationStrength == null ? 1 : this.modificationStrength));
        }
        this.mouseMove();
    };
    ShowMapObjectTemplateComponent.prototype.onMouseUp = function () {
        this.mDown = false;
        this.launchModification();
        this.mouseUp();
    };
    ShowMapObjectTemplateComponent.prototype.onClick = function () {
        this.onConfigure(this.object);
        this.mouseClick();
    };
    ShowMapObjectTemplateComponent.prototype.ngOnInit = function () {
        this.styles.cursor = this.modifiable ? 'w-resize' : 'pointer';
    };
    ShowMapObjectTemplateComponent.prototype.mouseEnter = function () {
    };
    ShowMapObjectTemplateComponent.prototype.mouseLeave = function () {
    };
    ShowMapObjectTemplateComponent.prototype.mouseDown = function () {
    };
    ShowMapObjectTemplateComponent.prototype.mouseMove = function () {
    };
    ShowMapObjectTemplateComponent.prototype.mouseUp = function () {
    };
    ShowMapObjectTemplateComponent.prototype.mouseClick = function () {
    };
    ShowMapObjectTemplateComponent.prototype.launchModification = function () {
        if (!this.modifiable || this.modifier === 0) {
            return;
        }
        this.modification(this.modifier);
        this.modifier = 0;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_Obj__WEBPACK_IMPORTED_MODULE_1__["Obj"])
    ], ShowMapObjectTemplateComponent.prototype, "object", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], ShowMapObjectTemplateComponent.prototype, "props", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapObjectTemplateComponent.prototype, "onConfigure", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ShowMapObjectTemplateComponent.prototype, "displayName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapObjectTemplateComponent.prototype, "calculateColor", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ShowMapObjectTemplateComponent.prototype, "modifiable", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapObjectTemplateComponent.prototype, "modification", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapObjectTemplateComponent.prototype, "modificationValue", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ShowMapObjectTemplateComponent.prototype, "modificationFormat", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapObjectTemplateComponent.prototype, "modificationMin", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapObjectTemplateComponent.prototype, "modificationMax", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapObjectTemplateComponent.prototype, "modificationStrength", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('mouseenter'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ShowMapObjectTemplateComponent.prototype, "onMouseEnter", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('mouseleave'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ShowMapObjectTemplateComponent.prototype, "onMouseLeave", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('mousedown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ShowMapObjectTemplateComponent.prototype, "onMouseDown", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('mousemove', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ShowMapObjectTemplateComponent.prototype, "onMouseMove", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('mouseup'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ShowMapObjectTemplateComponent.prototype, "onMouseUp", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ShowMapObjectTemplateComponent.prototype, "onClick", null);
    ShowMapObjectTemplateComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-object-template',
            styles: ["\n    #display-top {\n      position: absolute;\n      bottom: 100%;\n      left: 0;\n      right: 0;\n      font-size: 12px;\n      background-color: #828282;\n      color: transparent;\n    }\n    #display-bottom {\n      text-align: center;\n      position: absolute;\n      top: 100%;\n      left: 0;\n      right: 0;\n      font-size: 13px;\n      background-color: aquamarine;\n    }\n    #container {\n      min-width: 88px;\n      display: flex;\n      position: relative;\n      padding: 4px;\n    }\n    #icon {\n      width: 36px;\n      height: 36px;\n      margin-right: 4px;\n    }\n  "],
            template: "\n    <div id=\"container\" [ngStyle]=\"styles\">\n      <div id=\"display-top\">\n        <app-show-map-slider\n            *ngIf=\"mOn && modifiable\"\n            [val]=\"modificationValue + modifier\"\n            [min]=\"modificationMin\"\n            [max]=\"modificationMax\"\n            [format]=\"modificationFormat\"\n            [calculateColor]=\"calculateColor\">\n        </app-show-map-slider>\n      </div>\n      <div id=\"icon\">\n        <ng-content></ng-content>\n      </div>\n      <div>\n        <div *ngFor=\"let p of props\" style=\"line-height: 18px\">{{p()}}</div>\n      </div>\n      <div *ngIf=\"mOn && displayName != null\"\n           id=\"display-bottom\">\n        <span style=\"font-weight: bold; color: black;\">{{displayName}}</span>\n      </div>\n    </div>\n  "
        })
    ], ShowMapObjectTemplateComponent);
    return ShowMapObjectTemplateComponent;
}());



/***/ }),

/***/ "./src/app/show-map-object.component.ts":
/*!**********************************************!*\
  !*** ./src/app/show-map-object.component.ts ***!
  \**********************************************/
/*! exports provided: ShowMapObjectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapObjectComponent", function() { return ShowMapObjectComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/Thermometer */ "./projects/worldsim/src/lib/model/objects/Thermometer.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_Obj__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/Obj */ "./projects/worldsim/src/lib/model/Obj.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/Lamp */ "./projects/worldsim/src/lib/model/objects/Lamp.ts");
/* harmony import */ var _projects_worldsim_src_lib_model_objects_TV__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/objects/TV */ "./projects/worldsim/src/lib/model/objects/TV.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ShowMapObjectComponent = /** @class */ (function () {
    function ShowMapObjectComponent() {
        this.Thermometer = _projects_worldsim_src_lib_model_objects_Thermometer__WEBPACK_IMPORTED_MODULE_1__["Thermometer"];
        this.Lamp = _projects_worldsim_src_lib_model_objects_Lamp__WEBPACK_IMPORTED_MODULE_3__["Lamp"];
        this.TV = _projects_worldsim_src_lib_model_objects_TV__WEBPACK_IMPORTED_MODULE_4__["TV"];
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_Obj__WEBPACK_IMPORTED_MODULE_2__["Obj"])
    ], ShowMapObjectComponent.prototype, "object", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapObjectComponent.prototype, "onConfigure", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapObjectComponent.prototype, "magnificationX", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapObjectComponent.prototype, "magnificationY", void 0);
    ShowMapObjectComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-object',
            template: "\n    <div [style.top]=\"(object.position.y * magnificationY) + 'px'\"\n         [style.left]=\"(object.position.x * magnificationX) + 'px'\"\n         style=\"position: absolute;\">\n      <app-show-map-thermometer\n        *ngIf=\"Thermometer.isInstance(object)\"\n        [object]=\"object\"\n        [onConfigure]=\"onConfigure\">\n      </app-show-map-thermometer>\n      <app-show-map-tv\n        *ngIf=\"TV.isInstance(object)\"\n        [object]=\"object\"\n        [onConfigure]=\"onConfigure\">\n      </app-show-map-tv>\n      <app-show-map-lamp\n        *ngIf=\"Lamp.isInstance(object)\"\n        [object]=\"object\"\n        [onConfigure]=\"onConfigure\">\n      </app-show-map-lamp>\n    </div>\n  "
        })
    ], ShowMapObjectComponent);
    return ShowMapObjectComponent;
}());



/***/ }),

/***/ "./src/app/show-map-slider.component.ts":
/*!**********************************************!*\
  !*** ./src/app/show-map-slider.component.ts ***!
  \**********************************************/
/*! exports provided: ShowMapSliderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapSliderComponent", function() { return ShowMapSliderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ShowMapSliderComponent = /** @class */ (function () {
    function ShowMapSliderComponent(decimalPipe) {
        this.decimalPipe = decimalPipe;
    }
    ShowMapSliderComponent.prototype.ngOnChanges = function () {
        var val = Math.max(this.min, Math.min(this.val, this.max));
        this.sf = this.format.replace('%d', '' + this.decimalPipe.transform(val, '1.0-2'));
        this.progress = ((val - this.min) / (this.max - this.min));
        this.progressColor = this.calculateColor(this.progress);
        this.progress *= 100;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapSliderComponent.prototype, "val", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapSliderComponent.prototype, "min", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapSliderComponent.prototype, "max", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ShowMapSliderComponent.prototype, "format", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapSliderComponent.prototype, "calculateColor", void 0);
    ShowMapSliderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map-slider',
            styles: ["\n    #overlay {\n      position: absolute;\n      left: 0;\n      top: 0;\n      bottom: 0;\n      background-color: hsla(200, 50%, 60%, .6);\n      opacity: .66;\n    }\n    #overtext {\n      position: absolute;\n      top: 0;\n      right: 0;\n      left: 0;\n      bottom: 0;\n      text-align: center;\n      color: white;\n    }\n  "],
            template: "\n    R\n    <div id=\"overlay\" [style.width]=\"progress+'%'\" [style.background-color]=\"progressColor\"></div>\n    <div id=\"overtext\">{{sf}}</div>\n  "
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DecimalPipe"]])
    ], ShowMapSliderComponent);
    return ShowMapSliderComponent;
}());



/***/ }),

/***/ "./src/app/show-map.component.ts":
/*!***************************************!*\
  !*** ./src/app/show-map.component.ts ***!
  \***************************************/
/*! exports provided: ShowMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowMapComponent", function() { return ShowMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _projects_worldsim_src_lib_model_World__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../projects/worldsim/src/lib/model/World */ "./projects/worldsim/src/lib/model/World.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ShowMapComponent = /** @class */ (function () {
    function ShowMapComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _projects_worldsim_src_lib_model_World__WEBPACK_IMPORTED_MODULE_1__["World"])
    ], ShowMapComponent.prototype, "world", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], ShowMapComponent.prototype, "onConfigure", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapComponent.prototype, "magnificationX", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ShowMapComponent.prototype, "magnificationY", void 0);
    ShowMapComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-show-map',
            styles: ["\n    #container {\n      position: relative;\n      border: 2px solid black;\n      color: white;\n    }\n  "],
            template: "\n    <div id=\"container\"\n         class=\"no-select\"\n         alx-dragdrop\n         [style.height]=\"world.calculateHeight() * magnificationY + 'px'\"\n         [style.width]=\"world.calculateWidth() * magnificationX + 'px'\">\n      <app-show-map-location\n        *ngFor=\"let l of world.locations\"\n        [location]=\"l\"\n        [magnificationX]=\"magnificationX\"\n        [magnificationY]=\"magnificationY\">\n      </app-show-map-location>\n      <app-show-map-object\n        *ngFor=\"let o of world.objects\"\n        [object]=\"o\"\n        [magnificationX]=\"magnificationX\"\n        [magnificationY]=\"magnificationY\"\n        [onConfigure]=\"onConfigure\">\n      </app-show-map-object>\n    </div>\n  "
        })
    ], ShowMapComponent);
    return ShowMapComponent;
}());



/***/ }),

/***/ "./src/app/utils.ts":
/*!**************************!*\
  !*** ./src/app/utils.ts ***!
  \**************************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.dec2hex = function (x) {
        var xs = x.toString(16);
        return (xs.length === 1) ? '0' + xs : xs;
    };
    Utils.scaleColor = function (ratio, min, max) {
        var ratioInv = 1 - ratio;
        var parse = function (s, r) {
            return parseInt(s, 16) * r;
        };
        var red = Math.ceil(parse(max.substring(0, 2), ratio) + parse(min.substring(0, 2), ratioInv));
        var green = Math.ceil(parse(max.substring(2, 4), ratio) + parse(min.substring(2, 4), ratioInv));
        var blue = Math.ceil(parse(max.substring(4, 6), ratio) + parse(min.substring(4, 6), ratioInv));
        return '#' + Utils.dec2hex(red) + Utils.dec2hex(green) + Utils.dec2hex(blue);
    };
    Utils.randomColorRGB = function (min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 256; }
        if (min >= max) {
            console.error('randomColor: min can\'t be superior to max.');
            return '#000';
        }
        return 'rgb(' +
            Math.floor(min + Math.random() * (Math.min(256, max) - min)) + ', ' +
            Math.floor(min + Math.random() * (Math.min(256, max) - min)) + ', ' +
            Math.floor(min + Math.random() * (Math.min(256, max) - min)) + ')';
    };
    Utils.randomColorHSL = function (contrast, lightness) {
        if (contrast === null || contrast.min < 0 || contrast.max > 100)
            contrast = { min: 0, max: 100 };
        if (lightness === null || lightness.min < 0 || lightness.max > 100)
            lightness = { min: 0, max: 100 };
        return 'hsl(' +
            Math.floor(Math.random() * 360) + ',' +
            Math.floor(contrast.min + Math.random() * (contrast.max - contrast.min)) + '%,' +
            Math.floor(lightness.min + Math.random() * (lightness.max - lightness.min)) + '%)';
    };
    return Utils;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_4__);





if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Recherche\EnvSim6\src\main.ts */"./src/main.ts");


/***/ }),

/***/ 1:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map