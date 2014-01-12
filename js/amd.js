(function() {
    'use strict';

    var self = typeof window !== "undefined" ? window : global;
    var resolved = {};
    var modules = {};
    var queue = {};
    var counter = 0;

    function parseArgs(args) {
        var name, deps, val;
        var func = null, other = null;

        name = args.shift();

        if (args.length > 1) {
            deps = args.shift();
            func = args.shift();
        } else {
            val = args.shift();
            if (typeof val === "function") {
                func = val;
            } else {
                other = val;
            }
        }

        return { name: name, func: func, other: other, deps: deps };
    }

    function exec(name, func, other, deps, ns) {
        var result, d, key, q;
        var resolvedDeps = [];
        var run = false;

        if (name === null) {
            name = "_anonymous_" + (counter++);
        }

        if (!resolved[name]) {
            if (deps) {
                // There are dependencies, run func if they are all resolved,
                // queue otherwise
                for (d = 0; d < deps.length; d++) {
                    if (resolved[deps[d]]) {
                        resolvedDeps.push(ns[deps[d]]);
                    }
                }

                if (resolvedDeps.length === deps.length) {
                    run = true;
                }
            } else {
                // No deps, run
                run = true;
            }

            if (run) {
                // All dependencies satisfied, run
                if (func) {
                    result = func.apply(this, resolvedDeps);
                } else {
                    result = other;
                }

                resolved[name] = true;
                ns[name] = result;

                // Then run anything queued behind it that dependended on it,
                // making sure to only run each once (done inside exec)
                for (key in queue[name]) {
                    if (queue[name].hasOwnProperty(key)) {
                        q = queue[name][key];
                        exec.call(this, q.name, q.func, q.other, q.deps, ns);
                    }
                }

                return result;
            } else {
                // Queue up the function to each of the dependencies. We'll
                // make sure it only runs once though
                for (d = 0; d < deps.length; d++) {
                    depName = deps[d];

                    if (!queue[depName]) {
                        queue[depName] = [];
                    }

                    queue[depName].push({
                        name: name,
                        func: func,
                        other: other,
                        deps: deps
                    });
                }
            }
        }
    }

    self.define = function (/* name, func/other || name, deps_array, func */) {
        var args = parseArgs(Array.prototype.slice.call(arguments));
        var name = args.name, func = args.func, other = args.other, deps = args.deps;

        if (modules[name]) {
            throw new Error("Module already defined with name: " + name);
        }

        return exec.call(this, name, func, other, deps, modules);
    };

    self.using = function (/* deps/deps_array, func */) {
        var args = Array.prototype.slice.call(arguments);
        var func = args.pop();
        var deps = args.length > 1 ? args : args[0];

        return self.define.call(this, null, args, func);
    };
});