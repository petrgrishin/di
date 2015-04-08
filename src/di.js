/**
 * @author Petr Grishin <petr.grishin@grishini.ru>
 */

var Container = function () {
    var self = this;
    self.values = {};
    self.factories = {};

    self.set = function (name, callable) {
        if (typeof callable === "function") {
            self.factories[name] = callable;
        } else {
            self.values[name] = callable;
        }
    };

    self.protect = function (name, callable) {
        if (typeof callable !== "function") {
            throw new Error("Not callable argument");
        }
        self.values[name] = callable;
    };

    self.get = function (name) {
        if (self.values[name] === undefined) {
            if (self.factories[name] === undefined) {
                throw new Error("Not found factory: " + name);
            }
            self.values[name] = self.factories[name](self);
        }
        if (typeof self.values[name] === "function") {
            return self.values[name](self);
        }
        return self.values[name];
    };

    self.extend = function (name, callable) {
        if (typeof callable !== "function") {
            throw new Error("Not callable argument");
        }
        var extended = function () {
            var value = self.factories[name](self);
            return callable(value, self);
        };
        self.protect(name, extended);
    };

    self.factory = function (callable) {
        return function () {
            return function (self) {
                return callable(self);
            };
        };
    };
};
