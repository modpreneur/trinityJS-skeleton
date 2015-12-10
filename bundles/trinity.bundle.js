System.register('github:modpreneur/trinityJS@master/Router', ['npm:lodash@3.10.1'], function (_export) {
    /**
     * Created by fisa on 7/23/15.
     */

    /**
     * Private help RegExpressions
     * @type {RegExp}
     */
    'use strict';

    var _, optionalParam, namedParam, splatParam, escapeRegExp, paramsRegExp, regxPrefix;

    /**
     * Takes routes and create regular expression for each
     * @param routes
     * @constructor
     */
    function Router(routes) {
        this.routes = routes.map(function (route) {
            route.regx = _routeToRegExp(route.path);
            return route;
        }, this);

        /** Adds prefix to regular expressions **/
        if (Router.settings.debug) {
            this.routes = this.routes.map(function (route) {
                route.regx = _modifyRouteRegx(route.regx);
                return route;
            }, this);
        }
    }

    /**
     * Adds prefix to regular expression that any path can have any route prefix
     * Note: used only for debug purposes
     * @param regx
     * @returns {RegExp}
     * @private
     */
    function _modifyRouteRegx(regx) {
        var source = regx.source;
        var start = source.indexOf('^') !== 0 ? 0 : 1;
        return new RegExp(regxPrefix + source.substring(start));
    }

    /**
     * Finds controller for route parameter
     * @param route
     * @returns {Object| null}
     */

    /**
     * Returns object with params like key:value
     * @param path {string}
     * @param regxResult
     * @returns {Object}
     * @private
     */
    function _getParams(path, regxResult) {
        var keys = path.match(paramsRegExp),
            values = regxResult.slice(1, regxResult.length - 1),
            params = {};
        // create pairs
        for (var i = 0; i < values.length; i++) {
            params[keys[i].substring(1)] = values[i];
        }
        return params;
    }

    /**
     * Creates object with key:value pairs from query string (e.g. location.search)
     * @param str
     * @returns {Object}
     * @private
     */
    function _getQueryObj(str) {
        var pairs = str.substr(1).split('&'),
            query = {};
        var ln = pairs.length;
        for (var i = 0; i < ln; i++) {
            var split = pairs[i].split('=');
            query[split[0]] = split[1];
        }
        return query;
    }

    /**
     * Attach scope object on defined path, If path is not defined, create global scope object
     * @param object
     * @param path
     * @private
     */
    function _setScope(object, path) {
        if (!path || path.length < 1) {
            window['scope'] = object;
            return;
        }

        var parsed = settings.scope.split('.'),
            last = parsed.length - 1,
            ref = window;

        for (var i = 0; i < last; i++) {
            if (!ref.hasOwnProperty(parsed[i])) {
                ref[parsed[i]] = {};
            }
            ref = ref[parsed[i]];
        }
        ref[parsed[last]] = object;
    }

    /**
     * Create regular expression from route - from backbone framework
     * @param route
     * @returns {RegExp}
     * @private
     */
    function _routeToRegExp(route) {
        route = route.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function (match, optional) {
            return optional ? match : '([^/?]+)';
        }).replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    }

    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }],
        execute: function () {
            optionalParam = /\((.*?)\)/g;
            namedParam = /(\(\?)?:\w+/g;
            splatParam = /\*\w+/g;
            escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
            paramsRegExp = /:\w+/g;
            Router.settings = {
                debug: false
            };

            /**
             * Regular expression template to modify regular expressions of routes
             * @type {string}
             */
            regxPrefix = '(?:\/\w+)*';
            Router.prototype.findController = function findController(route) {
                route = route || window.location.pathname;
                var data = null;
                var c = _.find(this.routes, function (el) {
                    var cache = el.regx.exec(route);
                    if (!!cache) {
                        data = cache;
                        return true;
                    }
                    return false;
                }) || null;

                // If we found any controller -> create request and return it
                if (c) {
                    /** Create request Info object */
                    var search = window.location.search;
                    c.request = new this.Request(c.path, data.length > 2 ? _getParams(c.path, data) : null, search.length > 0 ? _getQueryObj(search) : null);
                    //And return all inside one package
                    return c;
                }
                return null;
            };

            /**
             * Represents request object
             * @param path
             * @param params
             * @param query
             * @constructor
             */
            Router.prototype.Request = function Request(path, params, query) {
                this.path = path;
                this.query = query;
                this.params = params;
            };
            _export('default', Router);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/Controller', [], function (_export) {
    /**
     * Created by fisa on 11/2/15.
     */

    /**
     * Abstract Controller class, provides connection between app and activeController itself
     * Should be inherited from in every controller
     */
    'use strict';

    var Controller;
    return {
        setters: [],
        execute: function () {
            Controller = (function () {
                function Controller() {
                    babelHelpers.classCallCheck(this, Controller);

                    this._app = null;
                    this._scope = null;
                    this._request = null;
                }

                /**
                 * Simple getter - has to be specified
                 * @returns {*}
                 */
                babelHelpers.createClass(Controller, [{
                    key: 'getScope',
                    value: function getScope() {
                        return this._scope;
                    }
                }, {
                    key: 'getApp',
                    value: function getApp() {
                        return this._app;
                    }
                }, {
                    key: 'Get',
                    value: function Get(serviceName) {
                        console.warn('Method not implemented');
                        //TODO: should pull from app requested service, if exists, if not return null
                    }
                }, {
                    key: 'request',
                    get: function get() {
                        return this._request;
                    },

                    /**
                     * Setter for "request" property - make sure that request can be assigned only once
                     * @param value
                     * @returns {void}
                     */
                    set: function set(value) {
                        if (this._request === null) {
                            this._request = value;
                        }
                    }
                }]);
                return Controller;
            })();

            _export('default', Controller);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/App', ['npm:lodash@3.10.1', 'github:modpreneur/trinityJS@master/Router', 'github:modpreneur/trinityJS@master/Controller'], function (_export) {
    /**
     * Created by fisa on 11/1/15.
     */
    'use strict';

    var _, Router, Controller, defaultSettings, App;

    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }, function (_githubModpreneurTrinityJSMasterRouter) {
            Router = _githubModpreneurTrinityJSMasterRouter['default'];
        }, function (_githubModpreneurTrinityJSMasterController) {
            Controller = _githubModpreneurTrinityJSMasterController['default'];
        }],
        execute: function () {
            defaultSettings = {
                environment: 'production'
            };

            /**
             * Represents application, provides main control over running js
             */

            App = (function () {
                function App(routes, controllers, settings) {
                    babelHelpers.classCallCheck(this, App);

                    this.routes = routes;
                    this.controllers = controllers;
                    this.router = new Router(routes);
                    this.settings = _.extend(_.extend({}, defaultSettings), settings);
                    this.activeController = null;
                    // This way $scope property cannot be reassigned
                    Object.defineProperty(this, '$scope', {
                        value: {}
                    });
                }

                /**
                 * just testing update
                 * Kick it up
                 */
                babelHelpers.createClass(App, [{
                    key: 'start',
                    value: function start() {
                        var controller = this.router.findController();
                        if (_.isNull(controller)) {
                            return false;
                        }

                        var controllerInfo = controller.action.split('.');
                        if (controllerInfo.length < 1) {
                            throw new Error('No Controller defined! did you forget to define controller in routes?');
                        }
                        var name = controllerInfo[0] + 'Controller',
                            action = controllerInfo[1] + 'Action' || 'indexAction';

                        // Create new active controller instance
                        if (!this.controllers.hasOwnProperty(name)) {
                            throw new Error('Controller ' + name + ' does not exist, did you forget to run "buildControllers.js" script?');
                        }

                        /** Create and Set up controller instance **/
                        var instance = new this.controllers[name]();
                        if (!(instance instanceof Controller)) {
                            throw new Error(name + ' does not inherit from "Controller" class!');
                        }
                        instance._scope = this.$scope;
                        instance._app = this;
                        instance.request = controller.request;
                        this.activeController = instance;

                        /** Run **/
                        if (instance[action]) {
                            instance[action](this.$scope);
                        }
                        return true;
                    }
                }, {
                    key: 'devStart',
                    value: function devStart(path, successCallback, errorCallback) {
                        var controller = this.router.findController();
                        if (_.isNull(controller)) {
                            if (successCallback) {
                                successCallback(false);
                            }
                            return false;
                        }

                        var controllerInfo = controller.action.split('.');
                        if (controllerInfo.length < 1) {
                            var err = new Error('No Controller defined! did you forget to define controller in routes?');
                            if (errorCallback) {
                                return errorCallback(err);
                            }
                            throw err;
                        }
                        // Load controller
                        var name = controllerInfo[0] + 'Controller',
                            action = controllerInfo[1] + 'Action' || 'indexAction';
                        var self = this;
                        System['import'](path + '/' + name + '.js').then(function (controler) {
                            /** Create and Set up controller instance **/
                            var instance = new controler['default']();
                            if (!(instance instanceof Controller)) {
                                var err = new Error(name + ' does not inherit from "Controller" class!');
                                if (errorCallback) {
                                    return errorCallback(err);
                                }
                                throw err;
                            }
                            instance._scope = self.$scope;
                            instance._app = self;
                            instance.request = controller.request;
                            self.activeController = instance;

                            /** Run **/
                            if (instance[action]) {
                                instance[action](self.$scope);
                                if (successCallback) {
                                    successCallback(instance);
                                }
                            } else {
                                var err = new Error('Action "' + action + '" doesn\'t exists');
                                if (errorCallback) {
                                    return errorCallback(err);
                                }
                                throw err;
                            }
                        })['catch'](function (err) {
                            if (errorCallback) {
                                errorCallback(err);
                            }
                        });
                        return true;
                    }

                    /**
                     * Getter for environment
                     * @returns {string|*|string}
                     */
                }, {
                    key: 'environment',
                    get: function get() {
                        return this.settings.environment;
                    }
                }]);
                return App;
            })();

            _export('default', App);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/utils/classlist', ['npm:lodash@3.10.1'], function (_export) {
    /**
     * Created by fisa on 10/26/15.
     */
    'use strict';

    var _, classlist;

    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }],
        execute: function () {
            classlist = {};

            _export('default', classlist);

            /**
             * Gets classlist Object
             * @param element {HTMLElement}
             * @returns {*}
             */
            classlist.get = function (element) {
                if (element.classList) {
                    return element.classList;
                }

                var className = element.className;
                // Some types of elements don't have a className in IE (e.g. iframes).
                // Furthermore, in Firefox, className is not a string when the element is
                // an SVG element.
                return _.isString(className) && className.match(/\S+/g) || [];
            };

            /**
             * Adds a class to an element.  Does not add multiples of class names.  This
             * method may throw a DOM exception for an invalid or empty class name if
             * DOMTokenList is used.
             * @param {Element} element DOM node to add class to.
             * @param {string} className Class name to add.
             */
            classlist.add = function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                    return;
                }

                if (!classlist.contains(element, className)) {
                    // Ensure we add a space if this is not the first class name added.
                    element.className += element.className.length > 0 ? ' ' + className : className;
                }
            };

            /**
             * Add all classes to element, avoid duplicates
             * @param {Element} element
             * @param {Array<string>} classesToAdd
             */
            classlist.addAll = function (element, classesToAdd) {
                if (element.classList) {
                    _.each(classesToAdd, function (c) {
                        element.classList.add(c);
                    });
                    return;
                }

                var classMap = {};

                // Get all current class names into a map.
                _.each(classlist.get(element), function (className) {
                    classMap[className] = true;
                });

                // Add new class names to the map.
                _.each(classesToAdd, function (className) {
                    classMap[className] = true;
                });

                // Flatten the keys of the map into the className.
                element.className = '';
                for (var className in classMap) {
                    element.className += element.className.length > 0 ? ' ' + className : className;
                }
            };

            /**
             * Removes a class from an element.  This method may throw a DOM exception
             * for an invalid or empty class name if DOMTokenList is used.
             * @param {Element} element DOM node to remove class from.
             * @param {string} className Class name to remove.
             */
            classlist.remove = function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                    return;
                }

                if (classlist.contains(element, className)) {
                    // Filter out the class name.
                    element.className = _.filter(classlist.get(element), function (c) {
                        return c != className;
                    }).join(' ');
                };
            };

            /**
             * Removes all classes
             * @param {Element} element
             * @param {Array<string>} classesToRemove
             */
            classlist.removeAll = function (element, classesToRemove) {
                if (element.classList) {
                    _.each(classesToRemove, function (c) {
                        element.classList.remove(c);
                    });
                    return;
                }
                // Filter out those classes in classesToRemove.
                element.className = _.filter(classlist.get(element), function (className) {
                    // If this class is not one we are trying to remove,
                    // add it to the array of new class names.
                    return !_.contains(classesToRemove, className);
                }).join(' ');
            };

            /**
             * Returns true if element contains className provided
             * @param {Element} element
             * @param {string} className
             * @returns {boolean}
             */
            classlist.contains = function (element, className) {
                return element.classList ? element.classList.contains(className) : _.contains(classlist.get(element), className);
            };
        }
    };
});
System.register('github:modpreneur/trinityJS@master/utils/Dom', ['github:modpreneur/trinityJS@master/utils/classlist'], function (_export) {
    /**
     * Created by fisa on 10/26/15.
     */

    /**
     * Just export classlit to have it all in one component
     * @type {{}}
     */
    'use strict';

    var classListHelper, classlist, Dom;

    /**
     * Enable disabled attribute by removing attribute "disabled"
     * @param element
     */

    _export('disable', disable);

    /**
     * Removes a node from its parent.
     * @param {Node} node The node to remove.
     * @return {Node} The node removed if removed; else, null.
     */

    _export('enable', enable);

    /**
     * Removes all the child nodes on a DOM node.
     * @param {Node} node Node to remove children from.
     */

    _export('removeNode', removeNode);

    /**
     * Create document fragment from html string
     * @param htmlString
     * @returns {*}
     */

    _export('removeChildren', removeChildren);

    /**
     * Replaces a node in the DOM tree. Will do nothing if {@code oldNode} has no
     * parent.
     * @param {Node} newNode Node to insert.
     * @param {Node} oldNode Node to replace.
     */

    _export('htmlToDocumentFragment', htmlToDocumentFragment);

    /**
     * Creates DOM element
     * @param tagName
     * @param elementAttributes
     * @param innerHTML
     * @returns {Element}
     */

    _export('replaceNode', replaceNode);

    _export('createDom', createDom);

    /**
     * Disable element by adding attribute disabled="disabled"
     * @param element
     */

    function disable(element) {
        if (!element.disabled) {
            element.setAttribute('disabled', 'disabled');
        }
    }

    function enable(element) {
        if (element.disabled) {
            element.removeAttribute('disabled');
        }
    }

    function removeNode(node) {
        return node && node.parentNode ? node.parentNode.removeChild(node) : null;
    }

    function removeChildren(node) {
        var child;
        while (child = node.firstChild) {
            node.removeChild(child);
        }
    }

    function htmlToDocumentFragment(htmlString) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;

        if (tempDiv.childNodes.length == 1) {
            return tempDiv.removeChild(tempDiv.firstChild);
        } else {
            var fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            return fragment;
        }
    }

    function replaceNode(newNode, oldNode) {
        var parent = oldNode.parentNode;
        if (parent) {
            parent.replaceChild(newNode, oldNode);
        }
    }

    function createDom(tagName, elementAttributes, innerHTML) {
        var tmpElement = document.createElement(tagName);
        // Attributes?
        if (elementAttributes) {
            var attKeys = Object.keys(elementAttributes),
                keysLength = attKeys.length;

            for (var i = 0; i < keysLength; i++) {
                tmpElement.setAttribute(attKeys[i], elementAttributes[attKeys[i]]);
            }
        }
        // InnerHTML?
        if (innerHTML && typeof innerHTML === 'string') {
            //TODO: innerHTML should be checked - sanitized
            tmpElement.innerHTML = innerHTML;
        } else if (innerHTML instanceof HTMLElement) {
            tmpElement.appendChild(innerHTML);
        }
        return tmpElement;
    }

    return {
        setters: [function (_githubModpreneurTrinityJSMasterUtilsClasslist) {
            classListHelper = _githubModpreneurTrinityJSMasterUtilsClasslist['default'];
        }],
        execute: function () {
            classlist = classListHelper;

            _export('classlist', classlist);

            Dom = {
                classlist: classListHelper,
                disable: disable,
                enable: enable,
                removeNode: removeNode,
                removeChildren: removeChildren,
                htmlToDocumentFragment: htmlToDocumentFragment,
                replaceNode: replaceNode,
                createDom: createDom
            };

            _export('default', Dom);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/Services', ['github:modpreneur/trinityJS@master/utils/Dom'], function (_export) {
    /**
     * Created by fisa on 10/26/15.
     */

    /**
     * Flash messages
     * @param message
     * @param type
     */
    'use strict';

    var Dom;

    _export('messageService', messageService);

    function messageService(message, type) {
        type = type || 'info';
        message = message || type;

        var ajaxInput = q('.ajax-checkbox');
        var ajaxAlert = q('.ajax-alert');

        if (!ajaxInput || !ajaxAlert) {
            console.log('MESSAGE', message);
            alert(message);
            return;
        }

        ajaxInput = ajaxInput.cloneNode(true);
        ajaxAlert = ajaxAlert.cloneNode(true);

        var id = Math.floor(Math.random() * (9999 - 10));

        ajaxInput.setAttribute('id', 'close-alert-' + type + '-' + id.toString());
        ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{id}', id.toString());
        ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{type}', type);
        ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{message}', message);
        ajaxAlert.className = ajaxAlert.className.replace('{type}', type);

        if (type == 'success') {
            ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{icon}', 'tiecons tiecons-check color-green font-20');
        }
        if (type == 'warning') {
            ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{icon}', 'tiecons tiecons-exclamation-mark-triangle color-red font-20');
        }
        if (type == 'info') {
            ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{icon}', 'tiecons tiecons-info color-blue font-20');
        }

        ajaxAlert.innerHTML = ajaxAlert.innerHTML.replace('{icon}', 'tiecons tiecons-info color-blue font-20');

        Dom.classlist.remove(ajaxInput, 'ajax-checkbox');
        Dom.classlist.remove(ajaxAlert, 'ajax-alert');

        var box = q.id('flashMessages');
        box.appendChild(ajaxInput);
        box.appendChild(ajaxAlert);

        if (type == 'success') {
            (function () {
                var timeOutId = null;
                timeOutId = setTimeout(function () {
                    Dom.removeNode(ajaxInput);
                    Dom.removeNode(ajaxAlert);
                    clearTimeout(timeOutId); // just to be sure
                }, 2000);
            })();
        }
    }

    return {
        setters: [function (_githubModpreneurTrinityJSMasterUtilsDom) {
            Dom = _githubModpreneurTrinityJSMasterUtilsDom['default'];
        }],
        execute: function () {}
    };
});
System.register('github:modpreneur/trinityJS@master/utils/Xhr', [], function (_export) {
    /**
     * Created by fisa on 10/22/15.
     */
    /**
     * Forked and inspired by atomic.js
     * @url https://github.com/toddmotto/atomic
     *
     * Updated: rewrited to google closure Xhr object style
     */
    'use strict';

    /** Preparation - ES5 (IE 9+, others) or IE8 **/
    var XhrFactory, isES5, Xhr;
    return {
        setters: [],
        execute: function () {
            XhrFactory = window.XMLHttpRequest || ActiveXObject;
            isES5 = typeof Object.keys === 'function';

            /**
             * Wrapper of browser xhr request object
             */

            Xhr = (function () {
                /**
                 * Create Xhr object wrapper
                 * @param url {string}
                 * @param method {string} enum [GET, POST, PUT, DELETE]
                 * @param headers {Object}
                 */

                function Xhr(url, method, headers) {
                    babelHelpers.classCallCheck(this, Xhr);

                    headers = headers || {};
                    if (arguments.length < 3) {
                        throw new Error('Missing arguments!');
                    }
                    this.timeout = 0;
                    this.isTimeout = false;
                    this.callbacks = {
                        complete: function complete() {},
                        timeout: function timeout() {}
                    };
                    // Create request @Note: request must be open before setting any header
                    this.request = new XhrFactory('MSXML2.XMLHTTP.3.0');
                    this.request.open(method, url, true);

                    // Headers - default just add x-www-form-urlencoded
                    if (!headers['Content-type']) {
                        headers['Content-type'] = 'application/x-www-form-urlencoded';
                    }
                    this.setHeaders(headers);
                }

                /**
                 * Set request headers
                 * @param headers {Object}
                 */
                babelHelpers.createClass(Xhr, [{
                    key: 'setHeaders',
                    value: function setHeaders(headers) {
                        // ES 5 support ?
                        if (isES5) {
                            var headerKeys = Object.keys(headers);
                            var keysLenght = headerKeys.length;
                            for (var i = 0; i < keysLenght; i++) {
                                this.request.setRequestHeader(headerKeys[i], headers[headerKeys[i]]);
                            }
                        }
                        // IE 8 :( slow
                        else {
                                for (var name in headers) {
                                    if (headers.hasOwnProperty(name)) {
                                        this.request.setRequestHeader(name, headers[name]);
                                    }
                                }
                            }
                    }

                    /**
                     * Set maximum timeout, after that request is aborted
                     * default = 0 -> infinitive
                     * @param timeout {Number}
                     */
                }, {
                    key: 'setTimeoutInterval',
                    value: function setTimeoutInterval(timeout) {
                        this.timeout = timeout;
                    }

                    /**
                     * Set callback for complete
                     * @param callback {function}
                     */
                }, {
                    key: 'onComplete',
                    value: function onComplete(callback) {
                        this.callbacks.complete = callback;
                    }

                    /**
                     * Set callback for timeout
                     * @param callback {function}
                     */
                }, {
                    key: 'onTimeout',
                    value: function onTimeout(callback) {
                        this.callbacks.timeout = callback;
                    }

                    /**
                     * Sends request Data have to be type string
                     * @param data {String}
                     */
                }, {
                    key: 'send',
                    value: function send(data) {
                        // INITIALIZATION
                        // Define main callback
                        var self = this;
                        this.request.onreadystatechange = function () {
                            // 4 state = complete
                            if (self.request.readyState === 4) {
                                if (self.isTimeout) {
                                    self.callbacks.timeout.call(self);
                                } else {
                                    self.callbacks.complete.call(self);
                                }
                            }
                        };
                        // Timeout?
                        if (this.timeout > 0) {
                            window.setTimeout(function () {
                                self.isTimeout = true;
                                self.request.abort();
                            }, this.timeout);
                        }
                        // SEND
                        this.request.send(data);
                    }

                    /**
                     * Returns status of request
                     * @returns {number}
                     */
                }, {
                    key: 'getStatus',
                    value: function getStatus() {
                        return this.request.status;
                    }

                    /**
                     * Returns value of header with name
                     * @param name {string}
                     * @returns {string}
                     */
                }, {
                    key: 'getResponseHeader',
                    value: function getResponseHeader(name) {
                        return this.request.getResponseHeader(name);
                    }

                    /**
                     * Returns all headers parsed into array
                     * @returns {Array}
                     */
                }, {
                    key: 'getResponseHeaders',
                    value: function getResponseHeaders() {
                        var headersString = this.request.getAllResponseHeaders();
                        var headersTemp = headersString.split('\n');
                        var headersLength = headersTemp.length;
                        if (headersTemp[headersLength - 1].length === 0) {
                            headersLength--;
                        }
                        var headers = new Array(headersLength);
                        for (var i = 0; i < headersLength; i++) {
                            var header = {};
                            if (isES5) {
                                var index = headersTemp[i].indexOf(':');
                                header[headersTemp[i].substring(0, index)] = headersTemp[i].substring(index + 2);
                            } else {
                                var name = '';
                                var value = '';
                                var strLength = headersTemp[i].length;
                                var isNamePart = true;
                                for (var j = 0; j < strLength; j++) {
                                    if (headersTemp[i][j] === ':') {
                                        j++;
                                        isNamePart = false;
                                        continue;
                                    }
                                    if (isNamePart) {
                                        name += headersTemp[i][j];
                                    } else {
                                        value += headersTemp[i][j];
                                    }
                                }
                                header[name] = value;
                            }
                            // Add new Header to array
                            headers[i] = header;
                        }
                        return headers;
                    }

                    /**
                     * Return unparsed response
                     * @returns {string}
                     */
                }, {
                    key: 'getResponse',
                    value: function getResponse() {
                        return this.request.responseText;
                    }

                    /**
                     * return parsed response
                     * @returns {Object}
                     */
                }, {
                    key: 'getResponseJson',
                    value: function getResponseJson() {
                        return JSON.parse(this.request.responseText);
                    }

                    /**
                     * Check if request is success i.e. status code is 2xx
                     * @returns {boolean}
                     */
                }, {
                    key: 'isSuccess',
                    value: function isSuccess() {
                        return this.request.status >= 200 && this.request.status < 300;
                    }
                }]);
                return Xhr;
            })();

            _export('default', Xhr);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/Gateway', ['github:modpreneur/trinityJS@master/utils/Xhr'], function (_export) {
    /**
     * Created by fisa on 7/27/15.
     */

    'use strict';

    var Xhr, Gateway;

    /** PRIVATE METHODS **/
    /**
     * private abstract send request method
     * @param url
     * @param method
     * @param data
     * @param successCallback
     * @param errorCallback
     * @returns {Xhr}
     * @private
     */
    function _send(url, method, data, successCallback, errorCallback) {
        if (method.toUpperCase() === 'GET' && data) {
            url = [url.trim(), _createQuery(data)].join('');
            data = null;
        }
        var xhr = _createRequest(url, method, successCallback, errorCallback);
        xhr.send(data);
        return xhr;
    }

    /**
     * Private abstract send JSON request method
     * @param url
     * @param method
     * @param data
     * @param successCallback
     * @param errorCallback
     * @returns {Xhr}
     * @private
     */
    function _sendJSON(url, method, data, successCallback, errorCallback) {
        if (method.toUpperCase() === 'GET' && data) {
            url = [url.trim(), _createQuery(data)].join('');
            data = null;
        }
        var xhr = _createJSONRequest(url.trim(), method, successCallback, errorCallback);
        xhr.send(data ? JSON.stringify(data) : null);
        return xhr;
    }

    /**
     * Create normal request not expecting json response
     * @param url
     * @param method
     * @param sC
     * @param eC
     * @private
     */
    function _createRequest(url, method, sC, eC) {
        if (arguments.length < 4) {
            throw new Error('Not all arguments defined!');
        }
        var xhr = new Xhr(url, method, {
            'Content-type': 'text/html',
            'X-Requested-With': 'XMLHttpRequest'
        });

        xhr.setTimeoutInterval(Gateway.settings.timeout);
        xhr.onTimeout(function () {
            console.error('AJAX REQUEST TIMED OUT!');
        });
        xhr.onComplete(function () {
            if (this.getResponseHeader('Content-Type').indexOf('text/html') === -1) {
                if (Gateway.settings.debug) {
                    console.log('HEADERS', this.getResponseHeaders());
                    //TODO:  Test if ladyBug
                    _dumpOnScreen(this.getResponse());
                }
                console.error('Content-Type text/html expected! got:', this.getResponse());
                return false;
            }
            if (this.isSuccess()) {
                sC(this.getResponse());
            } else {
                if (Gateway.settings.debug) {
                    console.error('RESPONSE:', this.getResponse());
                    _dumpOnScreen(this.getResponse());
                }

                eC(this.getResponseJson());
            }
        });
        return xhr;
    }

    /**
     * Create JSON request
     * @param url
     * @param method
     * @param sC
     * @param eC
     * @private
     */
    function _createJSONRequest(url, method, sC, eC) {
        if (arguments.length < 4) {
            throw new Error('Not all arguments defined!');
        }
        var xhr = new Xhr(url, method, {
            'Content-type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });

        xhr.setTimeoutInterval(Gateway.settings.timeout);
        xhr.onTimeout(function () {
            console.error('AJAX REQUEST TIMED OUT!');
        });
        xhr.onComplete(function () {
            if (this.getResponseHeader('Content-Type') !== 'application/json') {
                if (Gateway.settings.debug) {
                    console.log('HEADERS', this.getResponseHeaders());
                    //TODO:  Test if ladyBug
                    _dumpOnScreen(this.getResponse());
                }
                console.error('Content-Type JSON expected! got:', this.getResponse());
                return false;
            }
            if (this.isSuccess()) {
                sC(this.getResponseJson());
            } else if (302 === this.getStatus()) {
                var resp = this.getResponseJson(),
                    redirectTo = resp.location;
                // Do callback and then redirect
                if (sC(resp) === false) {
                    return false;
                }
                // Redirect
                if (!redirectTo) {
                    return eC({ Error: 'Missing "location" attribute!' });
                }
                window.location.assign(redirectTo);
            } else {
                console.error('RESPONSE:', this.getResponseJson());
                eC(this.getResponseJson().error);
            }
        });
        return xhr;
    }

    /**
     * Create query string from data
     * @param data
     * @returns {string}
     * @private
     */
    function _createQuery(data) {
        var keys = Object.keys(data),
            keysLength = keys.length,
            query = new Array(keysLength);
        for (var i = 0; i < keysLength; i++) {
            query[i] = keys[i] + '=' + data[keys[i]];
        }
        return '?' + query.join('&');
    }

    /**
     * Dump response on screen
     * @param response
     * @private
     */
    function _dumpOnScreen(response) {
        window.document.documentElement.innerHTML = response;
    }
    return {
        setters: [function (_githubModpreneurTrinityJSMasterUtilsXhr) {
            Xhr = _githubModpreneurTrinityJSMasterUtilsXhr['default'];
        }],
        execute: function () {
            Gateway = {
                /**
                 *  normal GET request to defined URL
                 * @param url
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                get: function get(url, data, successCallback, errorCallback) {
                    _send(url, 'GET', data, successCallback, errorCallback);
                },
                /**
                 * JSON GET request
                 * @param url
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                getJSON: function getJSON(url, data, successCallback, errorCallback) {
                    _sendJSON(url, 'GET', data, successCallback, errorCallback);
                },

                /**
                 * normal POST request
                 * @param url
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                post: function post(url, data, successCallback, errorCallback) {
                    _send(url, 'POST', data, successCallback, errorCallback);
                },
                /**
                 * JSON POST request
                 * @param url
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                postJSON: function postJSON(url, data, successCallback, errorCallback) {
                    _sendJSON(url, 'POST', data, successCallback, errorCallback);
                },
                /**
                 * normal PUT request
                 * @param url
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                put: function put(url, data, successCallback, errorCallback) {
                    _send(url, 'PUT', data, successCallback, errorCallback);
                },
                /**
                 * JSON PUT request
                 * @param url
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                putJSON: function putJSON(url, data, successCallback, errorCallback) {
                    _sendJSON(url, 'PUT', data, successCallback, errorCallback);
                },
                /**
                 * Same as others, just allow specify method.
                 * @param url
                 * @param method
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                send: _send,

                /**
                 * Send JSON request and accepts only json
                 * @param url
                 * @param method
                 * @param data
                 * @param successCallback
                 * @param errorCallback
                 */
                sendJSON: _sendJSON,

                /**
                 * settings for gateway
                 * TODO: consider how to globally get settings ?
                 */
                settings: {
                    debug: false,
                    timeout: 10000
                }
            };

            _export('default', Gateway);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/Store', ['npm:lodash@3.10.1'], function (_export) {
    /**
     * Created by fisa on 8/20/15.
     */

    /**
     * Private cache data storage
     * @type {Array}
     */
    'use strict';

    var _, _Data, Store, Item;

    /**
     * Look for specified data by owner and key
     * @param key
     * @param owner
     * @returns {Item} | null
     * @private
     */
    function _get(owner, key) {
        var length = _Data.length;
        for (var i = 0; i < length; i++) {
            if (owner === _Data[i].owner && key === _Data[i].key) {
                return _Data[i];
            }
        }
        return null;
    }
    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }],
        execute: function () {
            _Data = [];

            /**
             * Stores values according to specified key and owner
             * Whole class is static
             */

            Store = (function () {
                function Store() {
                    babelHelpers.classCallCheck(this, Store);
                }

                /**
                 * Wrapper for data stored in collection
                 * @param key
                 * @param value
                 * @param owner
                 */
                babelHelpers.createClass(Store, null, [{
                    key: 'getValue',

                    /**
                     * Public function which returns Value or Null
                     * @param owner
                     * @param key
                     * @returns {*} | null
                     */
                    value: function getValue(owner, key) {
                        var item = _get(owner, key);
                        return item ? item.value : null;
                    }

                    /**
                     * Adds new or update existing data, If update returns old Item
                     * @param key
                     * @param value
                     * @param owner
                     * @returns {*}
                     */
                }, {
                    key: 'setValue',
                    value: function setValue(owner, key, value) {
                        var item = _get(owner, key),
                            old = null;

                        if (_.isNull(item)) {
                            old = new Item(owner, key, value);
                            _Data.push(old);
                        } else {
                            old = new Item(item.owner, item.key, item.value);
                            item.value = value;
                        }
                        return old.value;
                    }

                    /**
                     * Finds all data stored by this owner
                     * @param owner
                     * @returns {Array.<Item>} | null
                     */
                }, {
                    key: 'getAll',
                    value: function getAll(owner) {
                        var data = _Data.filter(function (item) {
                            return owner === item.owner;
                        });
                        return data.length === 0 ? null : data;
                    }

                    /**
                     * Remove stored value from Storage if owner and key exists
                     * @param owner
                     * @param key
                     * @returns {*} | null
                     */
                }, {
                    key: 'remove',
                    value: function remove(owner, key) {
                        var index = _.findIndex(_Data, function (item) {
                            return item.key === key && item.owner === owner;
                        });
                        return index ? _.pullAt(_Data, index).value : null;
                    }
                }]);
                return Store;
            })();

            _export('default', Store);

            Item = function Item(owner, key, value) {
                babelHelpers.classCallCheck(this, Item);

                this.key = key;
                this.value = value;
                this.owner = owner;
            }

            /**
             * Export class representing data stored in Store
             * @type {Item}
             */
            ;

            Store.Item = Item;

            /**
             * Export private data property for texting purposes
             * @type {Array}
             * @private
             */
            Store._data = _Data;
        }
    };
});
System.register("github:modpreneur/trinityJS@master/utils/closureEvents", [], function (_export) {
    /* */
    "use strict";

    var COMPILED, goog, closureEvents;
    return {
        setters: [],
        execute: function () {
            COMPILED = !0;
            goog = goog || {};
            goog.global = window;goog.isDef = function (a) {
                return void 0 !== a;
            };goog.exportPath_ = function (a, b, c) {
                a = a.split(".");c = c || goog.global;a[0] in c || !c.execScript || c.execScript("var " + a[0]);for (var d; a.length && (d = a.shift());) !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {};
            };
            goog.define = function (a, b) {
                var c = b;COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));goog.exportPath_(a, c);
            };goog.DEBUG = !0;goog.LOCALE = "en";goog.TRUSTED_SITE = !0;goog.STRICT_MODE_COMPATIBLE = !1;goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG;
            goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;goog.provide = function (a) {
                if (!COMPILED && goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');goog.constructNamespace_(a);
            };goog.constructNamespace_ = function (a, b) {
                if (!COMPILED) {
                    delete goog.implicitNamespaces_[a];for (var c = a; (c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);) goog.implicitNamespaces_[c] = !0;
                }goog.exportPath_(a, b);
            };goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
            goog.module = function (a) {
                if (!goog.isString(a) || !a || -1 == a.search(goog.VALID_MODULE_RE_)) throw Error("Invalid module identifier");if (!goog.isInModuleLoader_()) throw Error("Module " + a + " has been loaded incorrectly.");if (goog.moduleLoaderState_.moduleName) throw Error("goog.module may only be called once per module.");goog.moduleLoaderState_.moduleName = a;if (!COMPILED) {
                    if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');delete goog.implicitNamespaces_[a];
                }
            };goog.module.get = function (a) {
                return goog.module.getInternal_(a);
            };
            goog.module.getInternal_ = function (a) {
                if (!COMPILED) return goog.isProvided_(a) ? a in goog.loadedModules_ ? goog.loadedModules_[a] : goog.getObjectByName(a) : null;
            };goog.moduleLoaderState_ = null;goog.isInModuleLoader_ = function () {
                return null != goog.moduleLoaderState_;
            };
            goog.module.declareLegacyNamespace = function () {
                if (!COMPILED && !goog.isInModuleLoader_()) throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");if (!COMPILED && !goog.moduleLoaderState_.moduleName) throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");goog.moduleLoaderState_.declareLegacyNamespace = !0;
            };
            goog.setTestOnly = function (a) {
                if (goog.DISALLOW_TEST_ONLY_CODE) throw (a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : ".")));
            };goog.forwardDeclare = function (a) {};COMPILED || (goog.isProvided_ = function (a) {
                return a in goog.loadedModules_ || !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a));
            }, goog.implicitNamespaces_ = { "goog.module": !0 });
            goog.getObjectByName = function (a, b) {
                for (var c = a.split("."), d = b || goog.global, e; e = c.shift();) if (goog.isDefAndNotNull(d[e])) d = d[e];else return null;return d;
            };goog.globalize = function (a, b) {
                var c = b || goog.global,
                    d;for (d in a) c[d] = a[d];
            };goog.addDependency = function (a, b, c, d) {
                if (goog.DEPENDENCIES_ENABLED) {
                    var e;a = a.replace(/\\/g, "/");for (var f = goog.dependencies_, g = 0; e = b[g]; g++) f.nameToPath[e] = a, f.pathIsModule[a] = !!d;for (d = 0; b = c[d]; d++) a in f.requires || (f.requires[a] = {}), f.requires[a][b] = !0;
                }
            };
            goog.ENABLE_DEBUG_LOADER = !0;goog.logToConsole_ = function (a) {
                goog.global.console && goog.global.console.error(a);
            };goog.require = function (a) {
                if (!COMPILED) {
                    goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_ && goog.maybeProcessDeferredDep_(a);if (goog.isProvided_(a)) return goog.isInModuleLoader_() ? goog.module.getInternal_(a) : null;if (goog.ENABLE_DEBUG_LOADER) {
                        var b = goog.getPathFromDeps_(a);if (b) return goog.writeScripts_(b), null;
                    }a = "goog.require could not find: " + a;goog.logToConsole_(a);throw Error(a);
                }
            };
            goog.basePath = "";goog.nullFunction = function () {};goog.abstractMethod = function () {
                throw Error("unimplemented abstract method");
            };goog.addSingletonGetter = function (a) {
                a.getInstance = function () {
                    if (a.instance_) return a.instance_;goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);return a.instance_ = new a();
                };
            };goog.instantiatedSingletons_ = [];goog.LOAD_MODULE_USING_EVAL = !0;goog.SEAL_MODULE_EXPORTS = goog.DEBUG;goog.loadedModules_ = {};goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
            goog.DEPENDENCIES_ENABLED && (goog.dependencies_ = { pathIsModule: {}, nameToPath: {}, requires: {}, visited: {}, written: {}, deferred: {} }, goog.inHtmlDocument_ = function () {
                var a = goog.global.document;return null != a && "write" in a;
            }, goog.findBasePath_ = function () {
                if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) goog.basePath = goog.global.CLOSURE_BASE_PATH;else if (goog.inHtmlDocument_()) for (var a = goog.global.document.getElementsByTagName("SCRIPT"), b = a.length - 1; 0 <= b; --b) {
                    var c = a[b].src,
                        d = c.lastIndexOf("?"),
                        d = -1 == d ? c.length : d;if ("base.js" == c.substr(d - 7, 7)) {
                        goog.basePath = c.substr(0, d - 7);break;
                    }
                }
            }, goog.importScript_ = function (a, b) {
                (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(a, b) && (goog.dependencies_.written[a] = !0);
            }, goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.importModule_ = function (a) {
                goog.importScript_("", 'goog.retrieveAndExecModule_("' + a + '");') && (goog.dependencies_.written[a] = !0);
            }, goog.queuedModules_ = [], goog.wrapModule_ = function (a, b) {
                return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
            }, goog.loadQueuedModules_ = function () {
                var a = goog.queuedModules_.length;if (0 < a) {
                    var b = goog.queuedModules_;goog.queuedModules_ = [];for (var c = 0; c < a; c++) goog.maybeProcessDeferredPath_(b[c]);
                }
            }, goog.maybeProcessDeferredDep_ = function (a) {
                goog.isDeferredModule_(a) && goog.allDepsAreAvailable_(a) && (a = goog.getPathFromDeps_(a), goog.maybeProcessDeferredPath_(goog.basePath + a));
            }, goog.isDeferredModule_ = function (a) {
                return (a = goog.getPathFromDeps_(a)) && goog.dependencies_.pathIsModule[a] ? goog.basePath + a in goog.dependencies_.deferred : !1;
            }, goog.allDepsAreAvailable_ = function (a) {
                if ((a = goog.getPathFromDeps_(a)) && a in goog.dependencies_.requires) for (var b in goog.dependencies_.requires[a]) if (!goog.isProvided_(b) && !goog.isDeferredModule_(b)) return !1;return !0;
            }, goog.maybeProcessDeferredPath_ = function (a) {
                if (a in goog.dependencies_.deferred) {
                    var b = goog.dependencies_.deferred[a];delete goog.dependencies_.deferred[a];goog.globalEval(b);
                }
            }, goog.loadModuleFromUrl = function (a) {
                goog.retrieveAndExecModule_(a);
            }, goog.loadModule = function (a) {
                var b = goog.moduleLoaderState_;try {
                    goog.moduleLoaderState_ = { moduleName: void 0, declareLegacyNamespace: !1 };var c;if (goog.isFunction(a)) c = a.call(goog.global, {});else if (goog.isString(a)) c = goog.loadModuleFromSource_.call(goog.global, a);else throw Error("Invalid module definition");var d = goog.moduleLoaderState_.moduleName;
                    if (!goog.isString(d) || !d) throw Error('Invalid module name "' + d + '"');goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(d, c) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(c);goog.loadedModules_[d] = c;
                } finally {
                    goog.moduleLoaderState_ = b;
                }
            }, goog.loadModuleFromSource_ = function (a) {
                eval(a);return {};
            }, goog.writeScriptSrcNode_ = function (a) {
                goog.global.document.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
            }, goog.appendScriptSrcNode_ = function (a) {
                var b = goog.global.document,
                    c = b.createElement("script");c.type = "text/javascript";c.src = a;c.defer = !1;c.async = !1;b.head.appendChild(c);
            }, goog.writeScriptTag_ = function (a, b) {
                if (goog.inHtmlDocument_()) {
                    var c = goog.global.document;if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == c.readyState) {
                        if (/\bdeps.js$/.test(a)) return !1;throw Error('Cannot write "' + a + '" after document load');
                    }var d = goog.IS_OLD_IE_;void 0 === b ? d ? (d = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ", c.write('<script type="text/javascript" src="' + a + '"' + d + ">\x3c/script>")) : goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? goog.appendScriptSrcNode_(a) : goog.writeScriptSrcNode_(a) : c.write('<script type="text/javascript">' + b + "\x3c/script>");return !0;
                }return !1;
            }, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function (a, b) {
                "complete" == a.readyState && goog.lastNonModuleScriptIndex_ == b && goog.loadQueuedModules_();return !0;
            }, goog.writeScripts_ = function (a) {
                function b(a) {
                    if (!(a in e.written || a in e.visited)) {
                        e.visited[a] = !0;if (a in e.requires) for (var f in e.requires[a]) if (!goog.isProvided_(f)) if (f in e.nameToPath) b(e.nameToPath[f]);else throw Error("Undefined nameToPath for " + f);a in d || (d[a] = !0, c.push(a));
                    }
                }var c = [],
                    d = {},
                    e = goog.dependencies_;b(a);for (a = 0; a < c.length; a++) {
                    var f = c[a];goog.dependencies_.written[f] = !0;
                }var g = goog.moduleLoaderState_;goog.moduleLoaderState_ = null;for (a = 0; a < c.length; a++) if (f = c[a]) e.pathIsModule[f] ? goog.importModule_(goog.basePath + f) : goog.importScript_(goog.basePath + f);else throw (goog.moduleLoaderState_ = g, Error("Undefined script input"));goog.moduleLoaderState_ = g;
            }, goog.getPathFromDeps_ = function (a) {
                return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null;
            }, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));goog.normalizePath_ = function (a) {
                a = a.split("/");for (var b = 0; b < a.length;) "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;return a.join("/");
            };
            goog.loadFileSync_ = function (a) {
                if (goog.global.CLOSURE_LOAD_FILE_SYNC) return goog.global.CLOSURE_LOAD_FILE_SYNC(a);var b = new goog.global.XMLHttpRequest();b.open("get", a, !1);b.send();return b.responseText;
            };
            goog.retrieveAndExecModule_ = function (a) {
                if (!COMPILED) {
                    var b = a;a = goog.normalizePath_(a);var c = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_,
                        d = goog.loadFileSync_(a);if (null != d) d = goog.wrapModule_(a, d), goog.IS_OLD_IE_ ? (goog.dependencies_.deferred[b] = d, goog.queuedModules_.push(b)) : c(a, d);else throw Error("load of " + a + "failed");
                }
            };
            goog.typeOf = function (a) {
                var b = typeof a;if ("object" == b) if (a) {
                    if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
                } else return "null";else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
            };goog.isNull = function (a) {
                return null === a;
            };goog.isDefAndNotNull = function (a) {
                return null != a;
            };goog.isArray = function (a) {
                return "array" == goog.typeOf(a);
            };goog.isArrayLike = function (a) {
                var b = goog.typeOf(a);return "array" == b || "object" == b && "number" == typeof a.length;
            };goog.isDateLike = function (a) {
                return goog.isObject(a) && "function" == typeof a.getFullYear;
            };goog.isString = function (a) {
                return "string" == typeof a;
            };
            goog.isBoolean = function (a) {
                return "boolean" == typeof a;
            };goog.isNumber = function (a) {
                return "number" == typeof a;
            };goog.isFunction = function (a) {
                return "function" == goog.typeOf(a);
            };goog.isObject = function (a) {
                var b = typeof a;return "object" == b && null != a || "function" == b;
            };goog.getUid = function (a) {
                return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
            };goog.hasUid = function (a) {
                return !!a[goog.UID_PROPERTY_];
            };goog.removeUid = function (a) {
                "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);try {
                    delete a[goog.UID_PROPERTY_];
                } catch (b) {}
            };
            goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);goog.uidCounter_ = 0;goog.getHashCode = goog.getUid;goog.removeHashCode = goog.removeUid;goog.cloneObject = function (a) {
                var b = goog.typeOf(a);if ("object" == b || "array" == b) {
                    if (a.clone) return a.clone();var b = "array" == b ? [] : {},
                        c;for (c in a) b[c] = goog.cloneObject(a[c]);return b;
                }return a;
            };goog.bindNative_ = function (a, b, c) {
                return a.call.apply(a.bind, arguments);
            };
            goog.bindJs_ = function (a, b, c) {
                if (!a) throw Error();if (2 < arguments.length) {
                    var d = Array.prototype.slice.call(arguments, 2);return function () {
                        var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
                    };
                }return function () {
                    return a.apply(b, arguments);
                };
            };goog.bind = function (a, b, c) {
                Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;return goog.bind.apply(null, arguments);
            };
            goog.partial = function (a, b) {
                var c = Array.prototype.slice.call(arguments, 1);return function () {
                    var b = c.slice();b.push.apply(b, arguments);return a.apply(this, b);
                };
            };goog.mixin = function (a, b) {
                for (var c in b) a[c] = b[c];
            };goog.now = goog.TRUSTED_SITE && Date.now || function () {
                return +new Date();
            };
            goog.globalEval = function (a) {
                if (goog.global.execScript) goog.global.execScript(a, "JavaScript");else if (goog.global.eval) {
                    if (null == goog.evalWorksForGlobals_) if ((goog.global.eval("var _evalTest_ = 1;"), "undefined" != typeof goog.global._evalTest_)) {
                        try {
                            delete goog.global._evalTest_;
                        } catch (b) {}goog.evalWorksForGlobals_ = !0;
                    } else goog.evalWorksForGlobals_ = !1;if (goog.evalWorksForGlobals_) goog.global.eval(a);else {
                        var c = goog.global.document,
                            d = c.createElement("SCRIPT");d.type = "text/javascript";d.defer = !1;d.appendChild(c.createTextNode(a));
                        c.body.appendChild(d);c.body.removeChild(d);
                    }
                } else throw Error("goog.globalEval not available");
            };goog.evalWorksForGlobals_ = null;goog.getCssName = function (a, b) {
                var c = function c(a) {
                    return goog.cssNameMapping_[a] || a;
                },
                    d = function d(a) {
                    a = a.split("-");for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));return b.join("-");
                },
                    d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function (a) {
                    return a;
                };return b ? a + "-" + d(b) : d(a);
            };
            goog.setCssNameMapping = function (a, b) {
                goog.cssNameMapping_ = a;goog.cssNameMappingStyle_ = b;
            };!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);goog.getMsg = function (a, b) {
                b && (a = a.replace(/\{\$([^}]+)}/g, function (a, d) {
                    return null != b && d in b ? b[d] : a;
                }));return a;
            };goog.getMsgWithFallback = function (a, b) {
                return a;
            };goog.exportSymbol = function (a, b, c) {
                goog.exportPath_(a, b, c);
            };goog.exportProperty = function (a, b, c) {
                a[b] = c;
            };
            goog.inherits = function (a, b) {
                function c() {}c.prototype = b.prototype;a.superClass_ = b.prototype;a.prototype = new c();a.prototype.constructor = a;a.base = function (a, c, f) {
                    for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];return b.prototype[c].apply(a, g);
                };
            };
            goog.base = function (a, b, c) {
                var d = arguments.callee.caller;if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if (d.superClass_) {
                    for (var e = Array(arguments.length - 1), f = 1; f < arguments.length; f++) e[f - 1] = arguments[f];return d.superClass_.constructor.apply(a, e);
                }e = Array(arguments.length - 2);for (f = 2; f < arguments.length; f++) e[f - 2] = arguments[f];for (var f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor) if (g.prototype[b] === d) f = !0;else if (f) return g.prototype[b].apply(a, e);if (a[b] === d) return a.constructor.prototype[b].apply(a, e);throw Error("goog.base called from a method of one name to a method of a different name");
            };goog.scope = function (a) {
                a.call(goog.global);
            };COMPILED || (goog.global.COMPILED = COMPILED);
            goog.defineClass = function (a, b) {
                var c = b.constructor,
                    d = b.statics;c && c != Object.prototype.constructor || (c = function () {
                    throw Error("cannot instantiate an interface (no constructor defined).");
                });c = goog.defineClass.createSealingConstructor_(c, a);a && goog.inherits(c, a);delete b.constructor;delete b.statics;goog.defineClass.applyProperties_(c.prototype, b);null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));return c;
            };goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
            goog.defineClass.createSealingConstructor_ = function (a, b) {
                if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
                    if (b && b.prototype && b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) return a;var c = function c() {
                        var b = a.apply(this, arguments) || this;b[goog.UID_PROPERTY_] = b[goog.UID_PROPERTY_];this.constructor === c && Object.seal(b);return b;
                    };return c;
                }return a;
            };goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
            goog.defineClass.applyProperties_ = function (a, b) {
                for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
            };goog.tagUnsealableClass = function (a) {
                !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
            };goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";goog.dom = {};goog.dom.NodeType = { ELEMENT: 1, ATTRIBUTE: 2, TEXT: 3, CDATA_SECTION: 4, ENTITY_REFERENCE: 5, ENTITY: 6, PROCESSING_INSTRUCTION: 7, COMMENT: 8, DOCUMENT: 9, DOCUMENT_TYPE: 10, DOCUMENT_FRAGMENT: 11, NOTATION: 12 };goog.debug = {};goog.debug.Error = function (a) {
                if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error);else {
                    var b = Error().stack;b && (this.stack = b);
                }a && (this.message = String(a));this.reportErrorToServer = !0;
            };goog.inherits(goog.debug.Error, Error);goog.debug.Error.prototype.name = "CustomError";goog.string = {};goog.string.DETECT_DOUBLE_ESCAPING = !1;goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;goog.string.Unicode = { NBSP: " " };goog.string.startsWith = function (a, b) {
                return 0 == a.lastIndexOf(b, 0);
            };goog.string.endsWith = function (a, b) {
                var c = a.length - b.length;return 0 <= c && a.indexOf(b, c) == c;
            };goog.string.caseInsensitiveStartsWith = function (a, b) {
                return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length));
            };
            goog.string.caseInsensitiveEndsWith = function (a, b) {
                return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
            };goog.string.caseInsensitiveEquals = function (a, b) {
                return a.toLowerCase() == b.toLowerCase();
            };goog.string.subs = function (a, b) {
                for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();return d + c.join("%s");
            };goog.string.collapseWhitespace = function (a) {
                return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
            };
            goog.string.isEmptyOrWhitespace = function (a) {
                return (/^[\s\xa0]*$/.test(a)
                );
            };goog.string.isEmptyString = function (a) {
                return 0 == a.length;
            };goog.string.isEmpty = goog.string.isEmptyOrWhitespace;goog.string.isEmptyOrWhitespaceSafe = function (a) {
                return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a));
            };goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;goog.string.isBreakingWhitespace = function (a) {
                return !/[^\t\n\r ]/.test(a);
            };goog.string.isAlpha = function (a) {
                return !/[^a-zA-Z]/.test(a);
            };
            goog.string.isNumeric = function (a) {
                return !/[^0-9]/.test(a);
            };goog.string.isAlphaNumeric = function (a) {
                return !/[^a-zA-Z0-9]/.test(a);
            };goog.string.isSpace = function (a) {
                return " " == a;
            };goog.string.isUnicodeChar = function (a) {
                return 1 == a.length && " " <= a && "~" >= a || "" <= a && "�" >= a;
            };goog.string.stripNewlines = function (a) {
                return a.replace(/(\r\n|\r|\n)+/g, " ");
            };goog.string.canonicalizeNewlines = function (a) {
                return a.replace(/(\r\n|\r|\n)/g, "\n");
            };
            goog.string.normalizeWhitespace = function (a) {
                return a.replace(/\xa0|\s/g, " ");
            };goog.string.normalizeSpaces = function (a) {
                return a.replace(/\xa0|[ \t]+/g, " ");
            };goog.string.collapseBreakingSpaces = function (a) {
                return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
            };goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function (a) {
                return a.trim();
            } : function (a) {
                return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
            };goog.string.trimLeft = function (a) {
                return a.replace(/^[\s\xa0]+/, "");
            };
            goog.string.trimRight = function (a) {
                return a.replace(/[\s\xa0]+$/, "");
            };goog.string.caseInsensitiveCompare = function (a, b) {
                var c = String(a).toLowerCase(),
                    d = String(b).toLowerCase();return c < d ? -1 : c == d ? 0 : 1;
            };
            goog.string.numberAwareCompare_ = function (a, b, c) {
                if (a == b) return 0;if (!a) return -1;if (!b) return 1;for (var d = a.toLowerCase().match(c), e = b.toLowerCase().match(c), f = Math.min(d.length, e.length), g = 0; g < f; g++) {
                    c = d[g];var h = e[g];if (c != h) return a = parseInt(c, 10), !isNaN(a) && (b = parseInt(h, 10), !isNaN(b) && a - b) ? a - b : c < h ? -1 : 1;
                }return d.length != e.length ? d.length - e.length : a < b ? -1 : 1;
            };goog.string.intAwareCompare = function (a, b) {
                return goog.string.numberAwareCompare_(a, b, /\d+|\D+/g);
            };
            goog.string.floatAwareCompare = function (a, b) {
                return goog.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g);
            };goog.string.numerateCompare = goog.string.floatAwareCompare;goog.string.urlEncode = function (a) {
                return encodeURIComponent(String(a));
            };goog.string.urlDecode = function (a) {
                return decodeURIComponent(a.replace(/\+/g, " "));
            };goog.string.newLineToBr = function (a, b) {
                return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
            };
            goog.string.htmlEscape = function (a, b) {
                if (b) a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));else {
                    if (!goog.string.ALL_RE_.test(a)) return a;-1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;"));-1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_, "&lt;"));-1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;"));-1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;"));-1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));-1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"));
                }return a;
            };goog.string.AMP_RE_ = /&/g;goog.string.LT_RE_ = /</g;goog.string.GT_RE_ = />/g;goog.string.QUOT_RE_ = /"/g;
            goog.string.SINGLE_QUOTE_RE_ = /'/g;goog.string.NULL_RE_ = /\x00/g;goog.string.E_RE_ = /e/g;goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;goog.string.unescapeEntities = function (a) {
                return goog.string.contains(a, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a;
            };
            goog.string.unescapeEntitiesWithDocument = function (a, b) {
                return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a;
            };
            goog.string.unescapeEntitiesUsingDom_ = function (a, b) {
                var c = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' },
                    d;d = b ? b.createElement("div") : goog.global.document.createElement("div");return a.replace(goog.string.HTML_ENTITY_PATTERN_, function (a, b) {
                    var g = c[a];if (g) return g;if ("#" == b.charAt(0)) {
                        var h = Number("0" + b.substr(1));isNaN(h) || (g = String.fromCharCode(h));
                    }g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));return c[a] = g;
                });
            };
            goog.string.unescapePureXmlEntities_ = function (a) {
                return a.replace(/&([^;]+);/g, function (a, c) {
                    switch (c) {case "amp":
                            return "&";case "lt":
                            return "<";case "gt":
                            return ">";case "quot":
                            return '"';default:
                            if ("#" == c.charAt(0)) {
                                var d = Number("0" + c.substr(1));if (!isNaN(d)) return String.fromCharCode(d);
                            }return a;}
                });
            };goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;goog.string.whitespaceEscape = function (a, b) {
                return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
            };
            goog.string.preserveSpaces = function (a) {
                return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
            };goog.string.stripQuotes = function (a, b) {
                for (var c = b.length, d = 0; d < c; d++) {
                    var e = 1 == c ? b : b.charAt(d);if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1);
                }return a;
            };goog.string.truncate = function (a, b, c) {
                c && (a = goog.string.unescapeEntities(a));a.length > b && (a = a.substring(0, b - 3) + "...");c && (a = goog.string.htmlEscape(a));return a;
            };
            goog.string.truncateMiddle = function (a, b, c, d) {
                c && (a = goog.string.unescapeEntities(a));if (d && a.length > b) {
                    d > b && (d = b);var e = a.length - d;a = a.substring(0, b - d) + "..." + a.substring(e);
                } else a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));c && (a = goog.string.htmlEscape(a));return a;
            };goog.string.specialEscapeChars_ = { "\x00": "\\0", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\x0B", '"': '\\"', "\\": "\\\\", "<": "<" };goog.string.jsEscapeCache_ = { "'": "\\'" };
            goog.string.quote = function (a) {
                a = String(a);for (var b = ['"'], c = 0; c < a.length; c++) {
                    var d = a.charAt(c),
                        e = d.charCodeAt(0);b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d));
                }b.push('"');return b.join("");
            };goog.string.escapeString = function (a) {
                for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));return b.join("");
            };
            goog.string.escapeChar = function (a) {
                if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];var b = a,
                    c = a.charCodeAt(0);if (31 < c && 127 > c) b = a;else {
                    if (256 > c) {
                        if ((b = "\\x", 16 > c || 256 < c)) b += "0";
                    } else b = "\\u", 4096 > c && (b += "0");b += c.toString(16).toUpperCase();
                }return goog.string.jsEscapeCache_[a] = b;
            };goog.string.contains = function (a, b) {
                return -1 != a.indexOf(b);
            };
            goog.string.caseInsensitiveContains = function (a, b) {
                return goog.string.contains(a.toLowerCase(), b.toLowerCase());
            };goog.string.countOf = function (a, b) {
                return a && b ? a.split(b).length - 1 : 0;
            };goog.string.removeAt = function (a, b, c) {
                var d = a;0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));return d;
            };goog.string.remove = function (a, b) {
                var c = new RegExp(goog.string.regExpEscape(b), "");return a.replace(c, "");
            };
            goog.string.removeAll = function (a, b) {
                var c = new RegExp(goog.string.regExpEscape(b), "g");return a.replace(c, "");
            };goog.string.regExpEscape = function (a) {
                return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
            };goog.string.repeat = String.prototype.repeat ? function (a, b) {
                return a.repeat(b);
            } : function (a, b) {
                return Array(b + 1).join(a);
            };
            goog.string.padNumber = function (a, b, c) {
                a = goog.isDef(c) ? a.toFixed(c) : String(a);c = a.indexOf(".");-1 == c && (c = a.length);return goog.string.repeat("0", Math.max(0, b - c)) + a;
            };goog.string.makeSafe = function (a) {
                return null == a ? "" : String(a);
            };goog.string.buildString = function (a) {
                return Array.prototype.join.call(arguments, "");
            };goog.string.getRandomString = function () {
                return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
            };
            goog.string.compareVersions = function (a, b) {
                for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; 0 == c && g < f; g++) {
                    var h = d[g] || "",
                        k = e[g] || "",
                        l = /(\d*)(\D*)/g,
                        p = /(\d*)(\D*)/g;do {
                        var m = l.exec(h) || ["", "", ""],
                            n = p.exec(k) || ["", "", ""];if (0 == m[0].length && 0 == n[0].length) break;var c = 0 == m[1].length ? 0 : parseInt(m[1], 10),
                            q = 0 == n[1].length ? 0 : parseInt(n[1], 10),
                            c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 == m[2].length, 0 == n[2].length) || goog.string.compareElements_(m[2], n[2]);
                    } while (0 == c);
                }return c;
            };goog.string.compareElements_ = function (a, b) {
                return a < b ? -1 : a > b ? 1 : 0;
            };goog.string.hashCode = function (a) {
                for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c) >>> 0;return b;
            };goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;goog.string.createUniqueString = function () {
                return "goog_" + goog.string.uniqueStringCounter_++;
            };goog.string.toNumber = function (a) {
                var b = Number(a);return 0 == b && goog.string.isEmptyOrWhitespace(a) ? NaN : b;
            };
            goog.string.isLowerCamelCase = function (a) {
                return (/^[a-z]+([A-Z][a-z]*)*$/.test(a)
                );
            };goog.string.isUpperCamelCase = function (a) {
                return (/^([A-Z][a-z]*)+$/.test(a)
                );
            };goog.string.toCamelCase = function (a) {
                return String(a).replace(/\-([a-z])/g, function (a, c) {
                    return c.toUpperCase();
                });
            };goog.string.toSelectorCase = function (a) {
                return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
            };
            goog.string.toTitleCase = function (a, b) {
                var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function (a, b, c) {
                    return b + c.toUpperCase();
                });
            };goog.string.capitalize = function (a) {
                return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
            };goog.string.parseInt = function (a) {
                isFinite(a) && (a = String(a));return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
            };
            goog.string.splitLimit = function (a, b, c) {
                a = a.split(b);for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;a.length && d.push(a.join(b));return d;
            };goog.string.editDistance = function (a, b) {
                var c = [],
                    d = [];if (a == b) return 0;if (!a.length || !b.length) return Math.max(a.length, b.length);for (var e = 0; e < b.length + 1; e++) c[e] = e;for (e = 0; e < a.length; e++) {
                    d[0] = e + 1;for (var f = 0; f < b.length; f++) d[f + 1] = Math.min(d[f] + 1, c[f + 1] + 1, c[f] + (a[e] != b[f]));for (f = 0; f < c.length; f++) c[f] = d[f];
                }return d[b.length];
            };goog.asserts = {};goog.asserts.ENABLE_ASSERTS = goog.DEBUG;goog.asserts.AssertionError = function (a, b) {
                b.unshift(a);goog.debug.Error.call(this, goog.string.subs.apply(null, b));b.shift();this.messagePattern = a;
            };goog.inherits(goog.asserts.AssertionError, goog.debug.Error);goog.asserts.AssertionError.prototype.name = "AssertionError";goog.asserts.DEFAULT_ERROR_HANDLER = function (a) {
                throw a;
            };goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
            goog.asserts.doAssertFailure_ = function (a, b, c, d) {
                var e = "Assertion failed";if (c) var e = e + (": " + c),
                    f = d;else a && (e += ": " + a, f = b);a = new goog.asserts.AssertionError("" + e, f || []);goog.asserts.errorHandler_(a);
            };goog.asserts.setErrorHandler = function (a) {
                goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a);
            };goog.asserts.assert = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));return a;
            };
            goog.asserts.fail = function (a, b) {
                goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
            };goog.asserts.assertNumber = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };
            goog.asserts.assertString = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };goog.asserts.assertFunction = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };
            goog.asserts.assertObject = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };goog.asserts.assertArray = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };
            goog.asserts.assertBoolean = function (a, b, c) {
                goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };goog.asserts.assertElement = function (a, b, c) {
                !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
            };
            goog.asserts.assertInstanceof = function (a, b, c, d) {
                !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(b), goog.asserts.getType_(a)], c, Array.prototype.slice.call(arguments, 3));return a;
            };goog.asserts.assertObjectPrototypeIsIntact = function () {
                for (var a in Object.prototype) goog.asserts.fail(a + " should not be enumerable in Object.prototype.");
            };
            goog.asserts.getType_ = function (a) {
                return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
            };goog.events = {};goog.events.EventId = function (a) {
                this.id = a;
            };goog.events.EventId.prototype.toString = function () {
                return this.id;
            };goog.events.Listenable = function () {};goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);goog.events.Listenable.addImplementation = function (a) {
                a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
            };goog.events.Listenable.isImplementedBy = function (a) {
                return !(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
            };goog.events.ListenableKey = function () {};goog.events.ListenableKey.counter_ = 0;goog.events.ListenableKey.reserveKey = function () {
                return ++goog.events.ListenableKey.counter_;
            };goog.events.Listener = function (a, b, c, d, e, f) {
                goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);this.listener = a;this.proxy = b;this.src = c;this.type = d;this.capture = !!e;this.handler = f;this.key = goog.events.ListenableKey.reserveKey();this.removed = this.callOnce = !1;
            };goog.events.Listener.ENABLE_MONITORING = !1;goog.events.Listener.prototype.markAsRemoved = function () {
                this.removed = !0;this.handler = this.src = this.proxy = this.listener = null;
            };goog.object = {};goog.object.forEach = function (a, b, c) {
                for (var d in a) b.call(c, a[d], d, a);
            };goog.object.filter = function (a, b, c) {
                var d = {},
                    e;for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);return d;
            };goog.object.map = function (a, b, c) {
                var d = {},
                    e;for (e in a) d[e] = b.call(c, a[e], e, a);return d;
            };goog.object.some = function (a, b, c) {
                for (var d in a) if (b.call(c, a[d], d, a)) return !0;return !1;
            };goog.object.every = function (a, b, c) {
                for (var d in a) if (!b.call(c, a[d], d, a)) return !1;return !0;
            };
            goog.object.getCount = function (a) {
                var b = 0,
                    c;for (c in a) b++;return b;
            };goog.object.getAnyKey = function (a) {
                for (var b in a) return b;
            };goog.object.getAnyValue = function (a) {
                for (var b in a) return a[b];
            };goog.object.contains = function (a, b) {
                return goog.object.containsValue(a, b);
            };goog.object.getValues = function (a) {
                var b = [],
                    c = 0,
                    d;for (d in a) b[c++] = a[d];return b;
            };goog.object.getKeys = function (a) {
                var b = [],
                    c = 0,
                    d;for (d in a) b[c++] = d;return b;
            };
            goog.object.getValueByKeys = function (a, b) {
                for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++);return a;
            };goog.object.containsKey = function (a, b) {
                return null !== a && b in a;
            };goog.object.containsValue = function (a, b) {
                for (var c in a) if (a[c] == b) return !0;return !1;
            };goog.object.findKey = function (a, b, c) {
                for (var d in a) if (b.call(c, a[d], d, a)) return d;
            };goog.object.findValue = function (a, b, c) {
                return (b = goog.object.findKey(a, b, c)) && a[b];
            };
            goog.object.isEmpty = function (a) {
                for (var b in a) return !1;return !0;
            };goog.object.clear = function (a) {
                for (var b in a) delete a[b];
            };goog.object.remove = function (a, b) {
                var c;(c = b in a) && delete a[b];return c;
            };goog.object.add = function (a, b, c) {
                if (null !== a && b in a) throw Error('The object already contains the key "' + b + '"');goog.object.set(a, b, c);
            };goog.object.get = function (a, b, c) {
                return null !== a && b in a ? a[b] : c;
            };goog.object.set = function (a, b, c) {
                a[b] = c;
            };
            goog.object.setIfUndefined = function (a, b, c) {
                return b in a ? a[b] : a[b] = c;
            };goog.object.setWithReturnValueIfNotSet = function (a, b, c) {
                if (b in a) return a[b];c = c();return a[b] = c;
            };goog.object.equals = function (a, b) {
                for (var c in a) if (!(c in b) || a[c] !== b[c]) return !1;for (c in b) if (!(c in a)) return !1;return !0;
            };goog.object.clone = function (a) {
                var b = {},
                    c;for (c in a) b[c] = a[c];return b;
            };
            goog.object.unsafeClone = function (a) {
                var b = goog.typeOf(a);if ("object" == b || "array" == b) {
                    if (goog.isFunction(a.clone)) return a.clone();var b = "array" == b ? [] : {},
                        c;for (c in a) b[c] = goog.object.unsafeClone(a[c]);return b;
                }return a;
            };goog.object.transpose = function (a) {
                var b = {},
                    c;for (c in a) b[a[c]] = c;return b;
            };goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
            goog.object.extend = function (a, b) {
                for (var c, d, e = 1; e < arguments.length; e++) {
                    d = arguments[e];for (c in d) a[c] = d[c];for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
                }
            };
            goog.object.create = function (a) {
                var b = arguments.length;if (1 == b && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);if (b % 2) throw Error("Uneven number of arguments");for (var c = {}, d = 0; d < b; d += 2) c[arguments[d]] = arguments[d + 1];return c;
            };goog.object.createSet = function (a) {
                var b = arguments.length;if (1 == b && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);for (var c = {}, d = 0; d < b; d++) c[arguments[d]] = !0;return c;
            };
            goog.object.createImmutableView = function (a) {
                var b = a;Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));return b;
            };goog.object.isImmutableView = function (a) {
                return !!Object.isFrozen && Object.isFrozen(a);
            };goog.array = {};goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;goog.array.ASSUME_NATIVE_FUNCTIONS = !1;goog.array.peek = function (a) {
                return a[a.length - 1];
            };goog.array.last = goog.array.peek;
            goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);return Array.prototype.indexOf.call(a, b, c);
            } : function (a, b, c) {
                c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;for (; c < a.length; c++) if (c in a && a[c] === b) return c;return -1;
            };
            goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);return Array.prototype.lastIndexOf.call(a, b, null == c ? a.length - 1 : c);
            } : function (a, b, c) {
                c = null == c ? a.length - 1 : c;0 > c && (c = Math.max(0, a.length + c));if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;for (; 0 <= c; c--) if (c in a && a[c] === b) return c;return -1;
            };
            goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);Array.prototype.forEach.call(a, b, c);
            } : function (a, b, c) {
                for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a);
            };goog.array.forEachRight = function (a, b, c) {
                for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) d in e && b.call(c, e[d], d, a);
            };
            goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);return Array.prototype.filter.call(a, b, c);
            } : function (a, b, c) {
                for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++) if (h in g) {
                    var k = g[h];b.call(c, k, h, a) && (e[f++] = k);
                }return e;
            };
            goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);return Array.prototype.map.call(a, b, c);
            } : function (a, b, c) {
                for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));return e;
            };
            goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function (a, b, c, d) {
                goog.asserts.assert(null != a.length);d && (b = goog.bind(b, d));return Array.prototype.reduce.call(a, b, c);
            } : function (a, b, c, d) {
                var e = c;goog.array.forEach(a, function (c, g) {
                    e = b.call(d, e, c, g, a);
                });return e;
            };
            goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function (a, b, c, d) {
                goog.asserts.assert(null != a.length);d && (b = goog.bind(b, d));return Array.prototype.reduceRight.call(a, b, c);
            } : function (a, b, c, d) {
                var e = c;goog.array.forEachRight(a, function (c, g) {
                    e = b.call(d, e, c, g, a);
                });return e;
            };
            goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);return Array.prototype.some.call(a, b, c);
            } : function (a, b, c) {
                for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return !0;return !1;
            };
            goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function (a, b, c) {
                goog.asserts.assert(null != a.length);return Array.prototype.every.call(a, b, c);
            } : function (a, b, c) {
                for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && !b.call(c, e[f], f, a)) return !1;return !0;
            };goog.array.count = function (a, b, c) {
                var d = 0;goog.array.forEach(a, function (a, f, g) {
                    b.call(c, a, f, g) && ++d;
                }, c);return d;
            };
            goog.array.find = function (a, b, c) {
                b = goog.array.findIndex(a, b, c);return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
            };goog.array.findIndex = function (a, b, c) {
                for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return f;return -1;
            };goog.array.findRight = function (a, b, c) {
                b = goog.array.findIndexRight(a, b, c);return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
            };
            goog.array.findIndexRight = function (a, b, c) {
                for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--) if (d in e && b.call(c, e[d], d, a)) return d;return -1;
            };goog.array.contains = function (a, b) {
                return 0 <= goog.array.indexOf(a, b);
            };goog.array.isEmpty = function (a) {
                return 0 == a.length;
            };goog.array.clear = function (a) {
                if (!goog.isArray(a)) for (var b = a.length - 1; 0 <= b; b--) delete a[b];a.length = 0;
            };goog.array.insert = function (a, b) {
                goog.array.contains(a, b) || a.push(b);
            };
            goog.array.insertAt = function (a, b, c) {
                goog.array.splice(a, c, 0, b);
            };goog.array.insertArrayAt = function (a, b, c) {
                goog.partial(goog.array.splice, a, c, 0).apply(null, b);
            };goog.array.insertBefore = function (a, b, c) {
                var d;2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d);
            };goog.array.remove = function (a, b) {
                var c = goog.array.indexOf(a, b),
                    d;(d = 0 <= c) && goog.array.removeAt(a, c);return d;
            };
            goog.array.removeAt = function (a, b) {
                goog.asserts.assert(null != a.length);return 1 == Array.prototype.splice.call(a, b, 1).length;
            };goog.array.removeIf = function (a, b, c) {
                b = goog.array.findIndex(a, b, c);return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
            };goog.array.removeAllIf = function (a, b, c) {
                var d = 0;goog.array.forEachRight(a, function (e, f) {
                    b.call(c, e, f, a) && goog.array.removeAt(a, f) && d++;
                });return d;
            };goog.array.concat = function (a) {
                return Array.prototype.concat.apply(Array.prototype, arguments);
            };
            goog.array.join = function (a) {
                return Array.prototype.concat.apply(Array.prototype, arguments);
            };goog.array.toArray = function (a) {
                var b = a.length;if (0 < b) {
                    for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];return c;
                }return [];
            };goog.array.clone = goog.array.toArray;goog.array.extend = function (a, b) {
                for (var c = 1; c < arguments.length; c++) {
                    var d = arguments[c];if (goog.isArrayLike(d)) {
                        var e = a.length || 0,
                            f = d.length || 0;a.length = e + f;for (var g = 0; g < f; g++) a[e + g] = d[g];
                    } else a.push(d);
                }
            };
            goog.array.splice = function (a, b, c, d) {
                goog.asserts.assert(null != a.length);return Array.prototype.splice.apply(a, goog.array.slice(arguments, 1));
            };goog.array.slice = function (a, b, c) {
                goog.asserts.assert(null != a.length);return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
            };
            goog.array.removeDuplicates = function (a, b, c) {
                b = b || a;var d = function d(a) {
                    return goog.isObject(a) ? "o" + goog.getUid(a) : (typeof a).charAt(0) + a;
                };c = c || d;for (var d = {}, e = 0, f = 0; f < a.length;) {
                    var g = a[f++],
                        h = c(g);Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g);
                }b.length = e;
            };goog.array.binarySearch = function (a, b, c) {
                return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b);
            };goog.array.binarySelect = function (a, b, c) {
                return goog.array.binarySearch_(a, b, !0, void 0, c);
            };
            goog.array.binarySearch_ = function (a, b, c, d, e) {
                for (var f = 0, g = a.length, h; f < g;) {
                    var k = f + g >> 1,
                        l;l = c ? b.call(e, a[k], k, a) : b(d, a[k]);0 < l ? f = k + 1 : (g = k, h = !l);
                }return h ? f : ~f;
            };goog.array.sort = function (a, b) {
                a.sort(b || goog.array.defaultCompare);
            };goog.array.stableSort = function (a, b) {
                for (var c = 0; c < a.length; c++) a[c] = { index: c, value: a[c] };var d = b || goog.array.defaultCompare;goog.array.sort(a, function (a, b) {
                    return d(a.value, b.value) || a.index - b.index;
                });for (c = 0; c < a.length; c++) a[c] = a[c].value;
            };
            goog.array.sortByKey = function (a, b, c) {
                var d = c || goog.array.defaultCompare;goog.array.sort(a, function (a, c) {
                    return d(b(a), b(c));
                });
            };goog.array.sortObjectsByKey = function (a, b, c) {
                goog.array.sortByKey(a, function (a) {
                    return a[b];
                }, c);
            };goog.array.isSorted = function (a, b, c) {
                b = b || goog.array.defaultCompare;for (var d = 1; d < a.length; d++) {
                    var e = b(a[d - 1], a[d]);if (0 < e || 0 == e && c) return !1;
                }return !0;
            };
            goog.array.equals = function (a, b, c) {
                if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) return !1;var d = a.length;c = c || goog.array.defaultCompareEquality;for (var e = 0; e < d; e++) if (!c(a[e], b[e])) return !1;return !0;
            };goog.array.compare3 = function (a, b, c) {
                c = c || goog.array.defaultCompare;for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
                    var f = c(a[e], b[e]);if (0 != f) return f;
                }return goog.array.defaultCompare(a.length, b.length);
            };goog.array.defaultCompare = function (a, b) {
                return a > b ? 1 : a < b ? -1 : 0;
            };
            goog.array.inverseDefaultCompare = function (a, b) {
                return -goog.array.defaultCompare(a, b);
            };goog.array.defaultCompareEquality = function (a, b) {
                return a === b;
            };goog.array.binaryInsert = function (a, b, c) {
                c = goog.array.binarySearch(a, b, c);return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1;
            };goog.array.binaryRemove = function (a, b, c) {
                b = goog.array.binarySearch(a, b, c);return 0 <= b ? goog.array.removeAt(a, b) : !1;
            };
            goog.array.bucket = function (a, b, c) {
                for (var d = {}, e = 0; e < a.length; e++) {
                    var f = a[e],
                        g = b.call(c, f, e, a);goog.isDef(g) && (d[g] || (d[g] = [])).push(f);
                }return d;
            };goog.array.toObject = function (a, b, c) {
                var d = {};goog.array.forEach(a, function (e, f) {
                    d[b.call(c, e, f, a)] = e;
                });return d;
            };goog.array.range = function (a, b, c) {
                var d = [],
                    e = 0,
                    f = a;c = c || 1;void 0 !== b && (e = a, f = b);if (0 > c * (f - e)) return [];if (0 < c) for (a = e; a < f; a += c) d.push(a);else for (a = e; a > f; a += c) d.push(a);return d;
            };
            goog.array.repeat = function (a, b) {
                for (var c = [], d = 0; d < b; d++) c[d] = a;return c;
            };goog.array.flatten = function (a) {
                for (var b = [], c = 0; c < arguments.length; c++) {
                    var d = arguments[c];if (goog.isArray(d)) for (var e = 0; e < d.length; e += 8192) for (var f = goog.array.slice(d, e, e + 8192), f = goog.array.flatten.apply(null, f), g = 0; g < f.length; g++) b.push(f[g]);else b.push(d);
                }return b;
            };
            goog.array.rotate = function (a, b) {
                goog.asserts.assert(null != a.length);a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));return a;
            };goog.array.moveItem = function (a, b, c) {
                goog.asserts.assert(0 <= b && b < a.length);goog.asserts.assert(0 <= c && c < a.length);b = Array.prototype.splice.call(a, b, 1);Array.prototype.splice.call(a, c, 0, b[0]);
            };
            goog.array.zip = function (a) {
                if (!arguments.length) return [];for (var b = [], c = arguments[0].length, d = 1; d < arguments.length; d++) arguments[d].length < c && (c = arguments[d].length);for (d = 0; d < c; d++) {
                    for (var e = [], f = 0; f < arguments.length; f++) e.push(arguments[f][d]);b.push(e);
                }return b;
            };goog.array.shuffle = function (a, b) {
                for (var c = b || Math.random, d = a.length - 1; 0 < d; d--) {
                    var e = Math.floor(c() * (d + 1)),
                        f = a[d];a[d] = a[e];a[e] = f;
                }
            };goog.array.copyByIndex = function (a, b) {
                var c = [];goog.array.forEach(b, function (b) {
                    c.push(a[b]);
                });return c;
            };goog.events.ListenerMap = function (a) {
                this.src = a;this.listeners = {};this.typeCount_ = 0;
            };goog.events.ListenerMap.prototype.getTypeCount = function () {
                return this.typeCount_;
            };goog.events.ListenerMap.prototype.getListenerCount = function () {
                var a = 0,
                    b;for (b in this.listeners) a += this.listeners[b].length;return a;
            };
            goog.events.ListenerMap.prototype.add = function (a, b, c, d, e) {
                var f = a.toString();a = this.listeners[f];a || (a = this.listeners[f] = [], this.typeCount_++);var g = goog.events.ListenerMap.findListenerIndex_(a, b, d, e);-1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new goog.events.Listener(b, null, this.src, f, !!d, e), b.callOnce = c, a.push(b));return b;
            };
            goog.events.ListenerMap.prototype.remove = function (a, b, c, d) {
                a = a.toString();if (!(a in this.listeners)) return !1;var e = this.listeners[a];b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);return -1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1;
            };
            goog.events.ListenerMap.prototype.removeByKey = function (a) {
                var b = a.type;if (!(b in this.listeners)) return !1;var c = goog.array.remove(this.listeners[b], a);c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));return c;
            };goog.events.ListenerMap.prototype.removeAll = function (a) {
                a = a && a.toString();var b = 0,
                    c;for (c in this.listeners) if (!a || c == a) {
                    for (var d = this.listeners[c], e = 0; e < d.length; e++) ++b, d[e].markAsRemoved();delete this.listeners[c];this.typeCount_--;
                }return b;
            };
            goog.events.ListenerMap.prototype.getListeners = function (a, b) {
                var c = this.listeners[a.toString()],
                    d = [];if (c) for (var e = 0; e < c.length; ++e) {
                    var f = c[e];f.capture == b && d.push(f);
                }return d;
            };goog.events.ListenerMap.prototype.getListener = function (a, b, c, d) {
                a = this.listeners[a.toString()];var e = -1;a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));return -1 < e ? a[e] : null;
            };
            goog.events.ListenerMap.prototype.hasListener = function (a, b) {
                var c = goog.isDef(a),
                    d = c ? a.toString() : "",
                    e = goog.isDef(b);return goog.object.some(this.listeners, function (a, g) {
                    for (var h = 0; h < a.length; ++h) if (!(c && a[h].type != d || e && a[h].capture != b)) return !0;return !1;
                });
            };goog.events.ListenerMap.findListenerIndex_ = function (a, b, c, d) {
                for (var e = 0; e < a.length; ++e) {
                    var f = a[e];if (!f.removed && f.listener == b && f.capture == !!c && f.handler == d) return e;
                }return -1;
            };goog.labs = {};goog.labs.userAgent = {};goog.labs.userAgent.util = {};goog.labs.userAgent.util.getNativeUserAgentString_ = function () {
                var a = goog.labs.userAgent.util.getNavigator_();return a && (a = a.userAgent) ? a : "";
            };goog.labs.userAgent.util.getNavigator_ = function () {
                return goog.global.navigator;
            };goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();goog.labs.userAgent.util.setUserAgent = function (a) {
                goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_();
            };
            goog.labs.userAgent.util.getUserAgent = function () {
                return goog.labs.userAgent.util.userAgent_;
            };goog.labs.userAgent.util.matchUserAgent = function (a) {
                var b = goog.labs.userAgent.util.getUserAgent();return goog.string.contains(b, a);
            };goog.labs.userAgent.util.matchUserAgentIgnoreCase = function (a) {
                var b = goog.labs.userAgent.util.getUserAgent();return goog.string.caseInsensitiveContains(b, a);
            };
            goog.labs.userAgent.util.extractVersionTuples = function (a) {
                for (var b = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, c = [], d; d = b.exec(a);) c.push([d[1], d[2], d[3] || void 0]);return c;
            };goog.labs.userAgent.platform = {};goog.labs.userAgent.platform.isAndroid = function () {
                return goog.labs.userAgent.util.matchUserAgent("Android");
            };goog.labs.userAgent.platform.isIpod = function () {
                return goog.labs.userAgent.util.matchUserAgent("iPod");
            };goog.labs.userAgent.platform.isIphone = function () {
                return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
            };goog.labs.userAgent.platform.isIpad = function () {
                return goog.labs.userAgent.util.matchUserAgent("iPad");
            };
            goog.labs.userAgent.platform.isIos = function () {
                return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
            };goog.labs.userAgent.platform.isMacintosh = function () {
                return goog.labs.userAgent.util.matchUserAgent("Macintosh");
            };goog.labs.userAgent.platform.isLinux = function () {
                return goog.labs.userAgent.util.matchUserAgent("Linux");
            };goog.labs.userAgent.platform.isWindows = function () {
                return goog.labs.userAgent.util.matchUserAgent("Windows");
            };
            goog.labs.userAgent.platform.isChromeOS = function () {
                return goog.labs.userAgent.util.matchUserAgent("CrOS");
            };
            goog.labs.userAgent.platform.getVersion = function () {
                var a = goog.labs.userAgent.util.getUserAgent(),
                    b = "";goog.labs.userAgent.platform.isWindows() ? (b = /Windows (?:NT|Phone) ([0-9.]+)/, b = (a = b.exec(a)) ? a[1] : "0.0") : goog.labs.userAgent.platform.isIos() ? (b = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, b = (a = b.exec(a)) && a[1].replace(/_/g, ".")) : goog.labs.userAgent.platform.isMacintosh() ? (b = /Mac OS X ([0-9_.]+)/, b = (a = b.exec(a)) ? a[1].replace(/_/g, ".") : "10") : goog.labs.userAgent.platform.isAndroid() ? (b = /Android\s+([^\);]+)(\)|;)/, b = (a = b.exec(a)) && a[1]) : goog.labs.userAgent.platform.isChromeOS() && (b = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, b = (a = b.exec(a)) && a[1]);return b || "";
            };goog.labs.userAgent.platform.isVersionOrHigher = function (a) {
                return 0 <= goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), a);
            };goog.labs.userAgent.browser = {};goog.labs.userAgent.browser.matchOpera_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
            };goog.labs.userAgent.browser.matchIE_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
            };goog.labs.userAgent.browser.matchEdge_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Edge");
            };goog.labs.userAgent.browser.matchFirefox_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Firefox");
            };
            goog.labs.userAgent.browser.matchSafari_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
            };goog.labs.userAgent.browser.matchCoast_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Coast");
            };
            goog.labs.userAgent.browser.matchIosWebview_ = function () {
                return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
            };
            goog.labs.userAgent.browser.matchChrome_ = function () {
                return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_() && !goog.labs.userAgent.browser.matchEdge_();
            };goog.labs.userAgent.browser.matchAndroidBrowser_ = function () {
                return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
            };
            goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_;goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
            goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;goog.labs.userAgent.browser.isSilk = function () {
                return goog.labs.userAgent.util.matchUserAgent("Silk");
            };
            goog.labs.userAgent.browser.getVersion = function () {
                function a(a) {
                    a = goog.array.find(a, d);return c[a] || "";
                }var b = goog.labs.userAgent.util.getUserAgent();if (goog.labs.userAgent.browser.isIE()) return goog.labs.userAgent.browser.getIEVersion_(b);var b = goog.labs.userAgent.util.extractVersionTuples(b),
                    c = {};goog.array.forEach(b, function (a) {
                    c[a[0]] = a[1];
                });var d = goog.partial(goog.object.containsKey, c);return goog.labs.userAgent.browser.isOpera() ? a(["Version", "Opera", "OPR"]) : goog.labs.userAgent.browser.isEdge() ? a(["Edge"]) : goog.labs.userAgent.browser.isChrome() ? a(["Chrome", "CriOS"]) : (b = b[2]) && b[1] || "";
            };goog.labs.userAgent.browser.isVersionOrHigher = function (a) {
                return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a);
            };
            goog.labs.userAgent.browser.getIEVersion_ = function (a) {
                var b = /rv: *([\d\.]*)/.exec(a);if (b && b[1]) return b[1];var b = "",
                    c = /MSIE +([\d\.]+)/.exec(a);if (c && c[1]) if ((a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1])) if (a && a[1]) switch (a[1]) {case "4.0":
                        b = "8.0";break;case "5.0":
                        b = "9.0";break;case "6.0":
                        b = "10.0";break;case "7.0":
                        b = "11.0";} else b = "7.0";else b = c[1];return b;
            };goog.labs.userAgent.engine = {};goog.labs.userAgent.engine.isPresto = function () {
                return goog.labs.userAgent.util.matchUserAgent("Presto");
            };goog.labs.userAgent.engine.isTrident = function () {
                return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
            };goog.labs.userAgent.engine.isEdge = function () {
                return goog.labs.userAgent.util.matchUserAgent("Edge");
            };
            goog.labs.userAgent.engine.isWebKit = function () {
                return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge();
            };goog.labs.userAgent.engine.isGecko = function () {
                return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge();
            };
            goog.labs.userAgent.engine.getVersion = function () {
                var a = goog.labs.userAgent.util.getUserAgent();if (a) {
                    var a = goog.labs.userAgent.util.extractVersionTuples(a),
                        b = goog.labs.userAgent.engine.getEngineTuple_(a);if (b) return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];var a = a[0],
                        c;if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) return c[1];
                }return "";
            };
            goog.labs.userAgent.engine.getEngineTuple_ = function (a) {
                if (!goog.labs.userAgent.engine.isEdge()) return a[1];for (var b = 0; b < a.length; b++) {
                    var c = a[b];if ("Edge" == c[0]) return c;
                }
            };goog.labs.userAgent.engine.isVersionOrHigher = function (a) {
                return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a);
            };goog.labs.userAgent.engine.getVersionForKey_ = function (a, b) {
                var c = goog.array.find(a, function (a) {
                    return b == a[0];
                });return c && c[1] || "";
            };goog.userAgent = {};goog.userAgent.ASSUME_IE = !1;goog.userAgent.ASSUME_EDGE = !1;goog.userAgent.ASSUME_GECKO = !1;goog.userAgent.ASSUME_WEBKIT = !1;goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;goog.userAgent.ASSUME_OPERA = !1;goog.userAgent.ASSUME_ANY_VERSION = !1;goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;goog.userAgent.getUserAgentString = function () {
                return goog.labs.userAgent.util.getUserAgent();
            };
            goog.userAgent.getNavigator = function () {
                return goog.global.navigator || null;
            };goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge();goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE;
            goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();goog.userAgent.isMobile_ = function () {
                return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
            };goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
            goog.userAgent.determinePlatform_ = function () {
                var a = goog.userAgent.getNavigator();return a && a.platform || "";
            };goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();goog.userAgent.ASSUME_MAC = !1;goog.userAgent.ASSUME_WINDOWS = !1;goog.userAgent.ASSUME_LINUX = !1;goog.userAgent.ASSUME_X11 = !1;goog.userAgent.ASSUME_ANDROID = !1;goog.userAgent.ASSUME_IPHONE = !1;goog.userAgent.ASSUME_IPAD = !1;
            goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
            goog.userAgent.isLegacyLinux_ = function () {
                return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
            };goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();goog.userAgent.isX11_ = function () {
                var a = goog.userAgent.getNavigator();return !!a && goog.string.contains(a.appVersion || "", "X11");
            };goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
            goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();goog.userAgent.operaVersion_ = function () {
                var a = goog.global.opera.version;try {
                    return a();
                } catch (b) {
                    return a;
                }
            };
            goog.userAgent.determineVersion_ = function () {
                if (goog.userAgent.OPERA && goog.global.opera) return goog.userAgent.operaVersion_();var a = "",
                    b = goog.userAgent.getVersionRegexResult_();b && (a = b ? b[1] : "");return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a;
            };
            goog.userAgent.getVersionRegexResult_ = function () {
                var a = goog.userAgent.getUserAgentString();if (goog.userAgent.GECKO) return (/rv\:([^\);]+)(\)|;)/.exec(a)
                );if (goog.userAgent.EDGE) return (/Edge\/([\d\.]+)/.exec(a)
                );if (goog.userAgent.IE) return (/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a)
                );if (goog.userAgent.WEBKIT) return (/WebKit\/(\S+)/.exec(a)
                );
            };goog.userAgent.getDocumentMode_ = function () {
                var a = goog.global.document;return a ? a.documentMode : void 0;
            };goog.userAgent.VERSION = goog.userAgent.determineVersion_();
            goog.userAgent.compare = function (a, b) {
                return goog.string.compareVersions(a, b);
            };goog.userAgent.isVersionOrHigherCache_ = {};goog.userAgent.isVersionOrHigher = function (a) {
                return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a));
            };goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;goog.userAgent.isDocumentModeOrHigher = function (a) {
                return goog.userAgent.DOCUMENT_MODE >= a;
            };
            goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;goog.userAgent.DOCUMENT_MODE = (function () {
                var a = goog.global.document,
                    b = goog.userAgent.getDocumentMode_();return a && goog.userAgent.IE ? b || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0;
            })();goog.events.BrowserFeature = { HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY: !goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT: goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY: goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED: "ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || !goog.global.navigator.msMaxTouchPoints) };goog.debug.entryPointRegistry = {};goog.debug.EntryPointMonitor = function () {};goog.debug.entryPointRegistry.refList_ = [];goog.debug.entryPointRegistry.monitors_ = [];goog.debug.entryPointRegistry.monitorsMayExist_ = !1;goog.debug.entryPointRegistry.register = function (a) {
                goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;if (goog.debug.entryPointRegistry.monitorsMayExist_) for (var b = goog.debug.entryPointRegistry.monitors_, c = 0; c < b.length; c++) a(goog.bind(b[c].wrap, b[c]));
            };
            goog.debug.entryPointRegistry.monitorAll = function (a) {
                goog.debug.entryPointRegistry.monitorsMayExist_ = !0;for (var b = goog.bind(a.wrap, a), c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) goog.debug.entryPointRegistry.refList_[c](b);goog.debug.entryPointRegistry.monitors_.push(a);
            };
            goog.debug.entryPointRegistry.unmonitorAllIfPossible = function (a) {
                var b = goog.debug.entryPointRegistry.monitors_;goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");a = goog.bind(a.unwrap, a);for (var c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) goog.debug.entryPointRegistry.refList_[c](a);b.length--;
            };goog.events.getVendorPrefixedName_ = function (a) {
                return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase();
            };
            goog.events.EventType = { CLICK: "click", RIGHTCLICK: "rightclick", DBLCLICK: "dblclick", MOUSEDOWN: "mousedown", MOUSEUP: "mouseup", MOUSEOVER: "mouseover", MOUSEOUT: "mouseout", MOUSEMOVE: "mousemove", MOUSEENTER: "mouseenter", MOUSELEAVE: "mouseleave", SELECTSTART: "selectstart", WHEEL: "wheel", KEYPRESS: "keypress", KEYDOWN: "keydown", KEYUP: "keyup", BLUR: "blur", FOCUS: "focus", DEACTIVATE: "deactivate", FOCUSIN: goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT: goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE: "change", RESET: "reset",
                SELECT: "select", SUBMIT: "submit", INPUT: "input", PROPERTYCHANGE: "propertychange", DRAGSTART: "dragstart", DRAG: "drag", DRAGENTER: "dragenter", DRAGOVER: "dragover", DRAGLEAVE: "dragleave", DROP: "drop", DRAGEND: "dragend", TOUCHSTART: "touchstart", TOUCHMOVE: "touchmove", TOUCHEND: "touchend", TOUCHCANCEL: "touchcancel", BEFOREUNLOAD: "beforeunload", CONSOLEMESSAGE: "consolemessage", CONTEXTMENU: "contextmenu", DOMCONTENTLOADED: "DOMContentLoaded", ERROR: "error", HELP: "help", LOAD: "load", LOSECAPTURE: "losecapture", ORIENTATIONCHANGE: "orientationchange",
                READYSTATECHANGE: "readystatechange", RESIZE: "resize", SCROLL: "scroll", UNLOAD: "unload", HASHCHANGE: "hashchange", PAGEHIDE: "pagehide", PAGESHOW: "pageshow", POPSTATE: "popstate", COPY: "copy", PASTE: "paste", CUT: "cut", BEFORECOPY: "beforecopy", BEFORECUT: "beforecut", BEFOREPASTE: "beforepaste", ONLINE: "online", OFFLINE: "offline", MESSAGE: "message", CONNECT: "connect", ANIMATIONSTART: goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND: goog.events.getVendorPrefixedName_("AnimationEnd"), ANIMATIONITERATION: goog.events.getVendorPrefixedName_("AnimationIteration"),
                TRANSITIONEND: goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN: "pointerdown", POINTERUP: "pointerup", POINTERCANCEL: "pointercancel", POINTERMOVE: "pointermove", POINTEROVER: "pointerover", POINTEROUT: "pointerout", POINTERENTER: "pointerenter", POINTERLEAVE: "pointerleave", GOTPOINTERCAPTURE: "gotpointercapture", LOSTPOINTERCAPTURE: "lostpointercapture", MSGESTURECHANGE: "MSGestureChange", MSGESTUREEND: "MSGestureEnd", MSGESTUREHOLD: "MSGestureHold", MSGESTURESTART: "MSGestureStart", MSGESTURETAP: "MSGestureTap",
                MSGOTPOINTERCAPTURE: "MSGotPointerCapture", MSINERTIASTART: "MSInertiaStart", MSLOSTPOINTERCAPTURE: "MSLostPointerCapture", MSPOINTERCANCEL: "MSPointerCancel", MSPOINTERDOWN: "MSPointerDown", MSPOINTERENTER: "MSPointerEnter", MSPOINTERHOVER: "MSPointerHover", MSPOINTERLEAVE: "MSPointerLeave", MSPOINTERMOVE: "MSPointerMove", MSPOINTEROUT: "MSPointerOut", MSPOINTEROVER: "MSPointerOver", MSPOINTERUP: "MSPointerUp", TEXT: "text", TEXTINPUT: "textInput", COMPOSITIONSTART: "compositionstart", COMPOSITIONUPDATE: "compositionupdate", COMPOSITIONEND: "compositionend",
                EXIT: "exit", LOADABORT: "loadabort", LOADCOMMIT: "loadcommit", LOADREDIRECT: "loadredirect", LOADSTART: "loadstart", LOADSTOP: "loadstop", RESPONSIVE: "responsive", SIZECHANGED: "sizechanged", UNRESPONSIVE: "unresponsive", VISIBILITYCHANGE: "visibilitychange", STORAGE: "storage", DOMSUBTREEMODIFIED: "DOMSubtreeModified", DOMNODEINSERTED: "DOMNodeInserted", DOMNODEREMOVED: "DOMNodeRemoved", DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument", DOMATTRMODIFIED: "DOMAttrModified",
                DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified", BEFOREPRINT: "beforeprint", AFTERPRINT: "afterprint" };goog.disposable = {};goog.disposable.IDisposable = function () {};goog.Disposable = function () {
                goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this);this.disposed_ = this.disposed_;this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
            };goog.Disposable.MonitoringMode = { OFF: 0, PERMANENT: 1, INTERACTIVE: 2 };goog.Disposable.MONITORING_MODE = 0;goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;goog.Disposable.instances_ = {};
            goog.Disposable.getUndisposedObjects = function () {
                var a = [],
                    b;for (b in goog.Disposable.instances_) goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);return a;
            };goog.Disposable.clearUndisposedObjects = function () {
                goog.Disposable.instances_ = {};
            };goog.Disposable.prototype.disposed_ = !1;goog.Disposable.prototype.isDisposed = function () {
                return this.disposed_;
            };goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
            goog.Disposable.prototype.dispose = function () {
                if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
                    var a = goog.getUid(this);if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");delete goog.Disposable.instances_[a];
                }
            };
            goog.Disposable.prototype.registerDisposable = function (a) {
                this.addOnDisposeCallback(goog.partial(goog.dispose, a));
            };goog.Disposable.prototype.addOnDisposeCallback = function (a, b) {
                this.disposed_ ? a.call(b) : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []), this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a));
            };goog.Disposable.prototype.disposeInternal = function () {
                if (this.onDisposeCallbacks_) for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()();
            };
            goog.Disposable.isDisposed = function (a) {
                return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1;
            };goog.dispose = function (a) {
                a && "function" == typeof a.dispose && a.dispose();
            };goog.disposeAll = function (a) {
                for (var b = 0, c = arguments.length; b < c; ++b) {
                    var d = arguments[b];goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d);
                }
            };goog.events.Event = function (a, b) {
                this.type = a instanceof goog.events.EventId ? String(a) : a;this.currentTarget = this.target = b;this.defaultPrevented = this.propagationStopped_ = !1;this.returnValue_ = !0;
            };goog.events.Event.prototype.stopPropagation = function () {
                this.propagationStopped_ = !0;
            };goog.events.Event.prototype.preventDefault = function () {
                this.defaultPrevented = !0;this.returnValue_ = !1;
            };goog.events.Event.stopPropagation = function (a) {
                a.stopPropagation();
            };goog.events.Event.preventDefault = function (a) {
                a.preventDefault();
            };goog.reflect = {};goog.reflect.object = function (a, b) {
                return b;
            };goog.reflect.sinkValue = function (a) {
                goog.reflect.sinkValue[" "](a);return a;
            };goog.reflect.sinkValue[" "] = goog.nullFunction;goog.reflect.canAccessProperty = function (a, b) {
                try {
                    return goog.reflect.sinkValue(a[b]), !0;
                } catch (c) {}return !1;
            };goog.events.BrowserEvent = function (a, b) {
                goog.events.Event.call(this, a ? a.type : "");this.relatedTarget = this.currentTarget = this.target = null;this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;this.state = null;this.platformModifierKey = !1;this.event_ = null;a && this.init(a, b);
            };goog.inherits(goog.events.BrowserEvent, goog.events.Event);
            goog.events.BrowserEvent.MouseButton = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
            goog.events.BrowserEvent.prototype.init = function (a, b) {
                var c = this.type = a.type,
                    d = a.changedTouches ? a.changedTouches[0] : null;this.target = a.target || a.srcElement;this.currentTarget = b;var e = a.relatedTarget;e ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(e, "nodeName") || (e = null)) : c == goog.events.EventType.MOUSEOVER ? e = a.fromElement : c == goog.events.EventType.MOUSEOUT && (e = a.toElement);this.relatedTarget = e;goog.isNull(d) ? (this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);this.button = a.button;this.keyCode = a.keyCode || 0;this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);this.ctrlKey = a.ctrlKey;this.altKey = a.altKey;this.shiftKey = a.shiftKey;this.metaKey = a.metaKey;this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;this.state = a.state;this.event_ = a;a.defaultPrevented && this.preventDefault();
            };goog.events.BrowserEvent.prototype.isButton = function (a) {
                return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a]);
            };
            goog.events.BrowserEvent.prototype.isMouseActionButton = function () {
                return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
            };goog.events.BrowserEvent.prototype.stopPropagation = function () {
                goog.events.BrowserEvent.superClass_.stopPropagation.call(this);this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
            };
            goog.events.BrowserEvent.prototype.preventDefault = function () {
                goog.events.BrowserEvent.superClass_.preventDefault.call(this);var a = this.event_;if (a.preventDefault) a.preventDefault();else if ((a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT)) try {
                    if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1;
                } catch (b) {}
            };goog.events.BrowserEvent.prototype.getBrowserEvent = function () {
                return this.event_;
            };goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);goog.events.onString_ = "on";goog.events.onStringMap_ = {};goog.events.CaptureSimulationMode = { OFF_AND_FAIL: 0, OFF_AND_SILENT: 1, ON: 2 };goog.events.CAPTURE_SIMULATION_MODE = 2;goog.events.listenerCountEstimate_ = 0;
            goog.events.listen = function (a, b, c, d, e) {
                if (goog.isArray(b)) {
                    for (var f = 0; f < b.length; f++) goog.events.listen(a, b[f], c, d, e);return null;
                }c = goog.events.wrapListener(c);return goog.events.Listenable.isImplementedBy(a) ? a.listen(b, c, d, e) : goog.events.listen_(a, b, c, !1, d, e);
            };
            goog.events.listen_ = function (a, b, c, d, e, f) {
                if (!b) throw Error("Invalid event type");var g = !!e;if (g && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
                    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) return goog.asserts.fail("Can not register capture listener in IE8-."), null;if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) return null;
                }var h = goog.events.getListenerMap_(a);h || (a[goog.events.LISTENER_MAP_PROP_] = h = new goog.events.ListenerMap(a));
                c = h.add(b, c, d, e, f);if (c.proxy) return c;d = goog.events.getProxy();c.proxy = d;d.src = a;d.listener = c;if (a.addEventListener) a.addEventListener(b.toString(), d, g);else if (a.attachEvent) a.attachEvent(goog.events.getOnString_(b.toString()), d);else throw Error("addEventListener and attachEvent are unavailable.");goog.events.listenerCountEstimate_++;return c;
            };
            goog.events.getProxy = function () {
                var a = goog.events.handleBrowserEvent_,
                    b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function (c) {
                    return a.call(b.src, b.listener, c);
                } : function (c) {
                    c = a.call(b.src, b.listener, c);if (!c) return c;
                };return b;
            };
            goog.events.listenOnce = function (a, b, c, d, e) {
                if (goog.isArray(b)) {
                    for (var f = 0; f < b.length; f++) goog.events.listenOnce(a, b[f], c, d, e);return null;
                }c = goog.events.wrapListener(c);return goog.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, d, e) : goog.events.listen_(a, b, c, !0, d, e);
            };goog.events.listenWithWrapper = function (a, b, c, d, e) {
                b.listen(a, c, d, e);
            };
            goog.events.unlisten = function (a, b, c, d, e) {
                if (goog.isArray(b)) {
                    for (var f = 0; f < b.length; f++) goog.events.unlisten(a, b[f], c, d, e);return null;
                }c = goog.events.wrapListener(c);if (goog.events.Listenable.isImplementedBy(a)) return a.unlisten(b, c, d, e);if (!a) return !1;d = !!d;if (a = goog.events.getListenerMap_(a)) if (b = a.getListener(b, c, d, e)) return goog.events.unlistenByKey(b);return !1;
            };
            goog.events.unlistenByKey = function (a) {
                if (goog.isNumber(a) || !a || a.removed) return !1;var b = a.src;if (goog.events.Listenable.isImplementedBy(b)) return b.unlistenByKey(a);var c = a.type,
                    d = a.proxy;b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(goog.events.getOnString_(c), d);goog.events.listenerCountEstimate_--;(c = goog.events.getListenerMap_(b)) ? (c.removeByKey(a), 0 == c.getTypeCount() && (c.src = null, b[goog.events.LISTENER_MAP_PROP_] = null)) : a.markAsRemoved();return !0;
            };
            goog.events.unlistenWithWrapper = function (a, b, c, d, e) {
                b.unlisten(a, c, d, e);
            };goog.events.removeAll = function (a, b) {
                if (!a) return 0;if (goog.events.Listenable.isImplementedBy(a)) return a.removeAllListeners(b);var c = goog.events.getListenerMap_(a);if (!c) return 0;var d = 0,
                    e = b && b.toString(),
                    f;for (f in c.listeners) if (!e || f == e) for (var g = c.listeners[f].concat(), h = 0; h < g.length; ++h) goog.events.unlistenByKey(g[h]) && ++d;return d;
            };
            goog.events.getListeners = function (a, b, c) {
                return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListeners(b, c) : [] : [];
            };goog.events.getListener = function (a, b, c, d, e) {
                c = goog.events.wrapListener(c);d = !!d;return goog.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, d, e) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListener(b, c, d, e) : null : null;
            };
            goog.events.hasListener = function (a, b, c) {
                if (goog.events.Listenable.isImplementedBy(a)) return a.hasListener(b, c);a = goog.events.getListenerMap_(a);return !!a && a.hasListener(b, c);
            };goog.events.expose = function (a) {
                var b = [],
                    c;for (c in a) a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c]);return b.join("\n");
            };goog.events.getOnString_ = function (a) {
                return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a;
            };
            goog.events.fireListeners = function (a, b, c, d) {
                return goog.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c, d) : goog.events.fireListeners_(a, b, c, d);
            };goog.events.fireListeners_ = function (a, b, c, d) {
                var e = !0;if (a = goog.events.getListenerMap_(a)) if (b = a.listeners[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
                    var f = b[a];f && f.capture == c && !f.removed && (f = goog.events.fireListener(f, d), e = e && !1 !== f);
                }return e;
            };
            goog.events.fireListener = function (a, b) {
                var c = a.listener,
                    d = a.handler || a.src;a.callOnce && goog.events.unlistenByKey(a);return c.call(d, b);
            };goog.events.getTotalListenerCount = function () {
                return goog.events.listenerCountEstimate_;
            };goog.events.dispatchEvent = function (a, b) {
                goog.asserts.assert(goog.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");return a.dispatchEvent(b);
            };
            goog.events.protectBrowserEventEntryPoint = function (a) {
                goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_);
            };
            goog.events.handleBrowserEvent_ = function (a, b) {
                if (a.removed) return !0;if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
                    var c = b || goog.getObjectByName("window.event"),
                        d = new goog.events.BrowserEvent(c, this),
                        e = !0;if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
                        if (!goog.events.isMarkedIeEvent_(c)) {
                            goog.events.markIeEvent_(c);for (var c = [], f = d.currentTarget; f; f = f.parentNode) c.push(f);for (var f = a.type, g = c.length - 1; !d.propagationStopped_ && 0 <= g; g--) {
                                d.currentTarget = c[g];var h = goog.events.fireListeners_(c[g], f, !0, d),
                                    e = e && h;
                            }for (g = 0; !d.propagationStopped_ && g < c.length; g++) d.currentTarget = c[g], h = goog.events.fireListeners_(c[g], f, !1, d), e = e && h;
                        }
                    } else e = goog.events.fireListener(a, d);return e;
                }return goog.events.fireListener(a, new goog.events.BrowserEvent(b, this));
            };goog.events.markIeEvent_ = function (a) {
                var b = !1;if (0 == a.keyCode) try {
                    a.keyCode = -1;return;
                } catch (c) {
                    b = !0;
                }if (b || void 0 == a.returnValue) a.returnValue = !0;
            };goog.events.isMarkedIeEvent_ = function (a) {
                return 0 > a.keyCode || void 0 != a.returnValue;
            };
            goog.events.uniqueIdCounter_ = 0;goog.events.getUniqueId = function (a) {
                return a + "_" + goog.events.uniqueIdCounter_++;
            };goog.events.getListenerMap_ = function (a) {
                a = a[goog.events.LISTENER_MAP_PROP_];return a instanceof goog.events.ListenerMap ? a : null;
            };goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
            goog.events.wrapListener = function (a) {
                goog.asserts.assert(a, "Listener can not be null.");if (goog.isFunction(a)) return a;goog.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function (b) {
                    return a.handleEvent(b);
                });return a[goog.events.LISTENER_WRAPPER_PROP_];
            };goog.debug.entryPointRegistry.register(function (a) {
                goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_);
            });goog.events.EventTarget = function () {
                goog.Disposable.call(this);this.eventTargetListeners_ = new goog.events.ListenerMap(this);this.actualEventTarget_ = this;this.parentEventTarget_ = null;
            };goog.inherits(goog.events.EventTarget, goog.Disposable);goog.events.Listenable.addImplementation(goog.events.EventTarget);goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;goog.events.EventTarget.prototype.getParentEventTarget = function () {
                return this.parentEventTarget_;
            };
            goog.events.EventTarget.prototype.setParentEventTarget = function (a) {
                this.parentEventTarget_ = a;
            };goog.events.EventTarget.prototype.addEventListener = function (a, b, c, d) {
                goog.events.listen(this, a, b, c, d);
            };goog.events.EventTarget.prototype.removeEventListener = function (a, b, c, d) {
                goog.events.unlisten(this, a, b, c, d);
            };
            goog.events.EventTarget.prototype.dispatchEvent = function (a) {
                this.assertInitialized_();var b,
                    c = this.getParentEventTarget();if (c) {
                    b = [];for (var d = 1; c; c = c.getParentEventTarget()) b.push(c), goog.asserts.assert(++d < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
                }return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, b);
            };
            goog.events.EventTarget.prototype.disposeInternal = function () {
                goog.events.EventTarget.superClass_.disposeInternal.call(this);this.removeAllListeners();this.parentEventTarget_ = null;
            };goog.events.EventTarget.prototype.listen = function (a, b, c, d) {
                this.assertInitialized_();return this.eventTargetListeners_.add(String(a), b, !1, c, d);
            };goog.events.EventTarget.prototype.listenOnce = function (a, b, c, d) {
                return this.eventTargetListeners_.add(String(a), b, !0, c, d);
            };
            goog.events.EventTarget.prototype.unlisten = function (a, b, c, d) {
                return this.eventTargetListeners_.remove(String(a), b, c, d);
            };goog.events.EventTarget.prototype.unlistenByKey = function (a) {
                return this.eventTargetListeners_.removeByKey(a);
            };goog.events.EventTarget.prototype.removeAllListeners = function (a) {
                return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0;
            };
            goog.events.EventTarget.prototype.fireListeners = function (a, b, c) {
                a = this.eventTargetListeners_.listeners[String(a)];if (!a) return !0;a = a.concat();for (var d = !0, e = 0; e < a.length; ++e) {
                    var f = a[e];if (f && !f.removed && f.capture == b) {
                        var g = f.listener,
                            h = f.handler || f.src;f.callOnce && this.unlistenByKey(f);d = !1 !== g.call(h, c) && d;
                    }
                }return d && 0 != c.returnValue_;
            };goog.events.EventTarget.prototype.getListeners = function (a, b) {
                return this.eventTargetListeners_.getListeners(String(a), b);
            };
            goog.events.EventTarget.prototype.getListener = function (a, b, c, d) {
                return this.eventTargetListeners_.getListener(String(a), b, c, d);
            };goog.events.EventTarget.prototype.hasListener = function (a, b) {
                var c = goog.isDef(a) ? String(a) : void 0;return this.eventTargetListeners_.hasListener(c, b);
            };goog.events.EventTarget.prototype.setTargetForTesting = function (a) {
                this.actualEventTarget_ = a;
            };goog.events.EventTarget.prototype.assertInitialized_ = function () {
                goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
            };
            goog.events.EventTarget.dispatchEventInternal_ = function (a, b, c) {
                var d = b.type || b;if (goog.isString(b)) b = new goog.events.Event(b, a);else if (b instanceof goog.events.Event) b.target = b.target || a;else {
                    var e = b;b = new goog.events.Event(d, a);goog.object.extend(b, e);
                }var e = !0,
                    f;if (c) for (var g = c.length - 1; !b.propagationStopped_ && 0 <= g; g--) f = b.currentTarget = c[g], e = f.fireListeners(d, !0, b) && e;b.propagationStopped_ || (f = b.currentTarget = a, e = f.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = f.fireListeners(d, !1, b) && e));
                if (c) for (g = 0; !b.propagationStopped_ && g < c.length; g++) f = b.currentTarget = c[g], e = f.fireListeners(d, !1, b) && e;return e;
            };closureEvents = goog.events;

            _export("default", closureEvents);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/TrinityForm', ['npm:lodash@3.10.1', 'github:modpreneur/trinityJS@master/Gateway', 'github:modpreneur/trinityJS@master/utils/closureEvents', 'github:modpreneur/trinityJS@master/utils/Dom', 'github:modpreneur/trinityJS@master/Store', 'github:modpreneur/trinityJS@master/Services'], function (_export) {
    /**
    * Created by fisa on 8/19/15.
    */

    /**
     * Super form class - automatically handles form with ajax requests and adds extra behaviour
     * @param form {HTMLFormElement}
     * @param type {string}
     * @constructor
     */
    'use strict';

    var _, Gateway, events, Dom, Store, messageService, TrinityForm, nameRegExp;

    /**
     * Initialize TrinityForm
     * @param form
     * @param type
     * @private
     */
    function _initialize(form) {
        /** Add listener to form element **/
        events.listen(form, 'submit', function (e) {
            /** catch button with focus first **/
            this.activeBtn = document.activeElement.type === 'button' ? document.activeElement : this.buttons[0];
            /** Continue **/
            e.preventDefault();
            /** Lock and Load **/
            this.lock();
            this.toggleLoading();

            /** Parse and send Data **/
            var data = parseSymfonyForm(form, this.activeBtn);
            var method = data.hasOwnProperty('_method') ? data['_method'] : form.method;

            /** Discover type **/
            if (_.isNull(this.type)) {
                switch (method) {
                    case 'POST':
                        this.type = TrinityForm.formType.NEW;break;
                    case 'PUT':
                        this.type = TrinityForm.formType.EDIT;break;
                    default:
                        this.type = TrinityForm.formType.DELETE;break;
                }
            }
            Gateway.sendJSON(form.action, method, data, //Json object
            _successHandler.bind(this), _errorHandler.bind(this));
        }, false, this);
    }

    /**** PRIVATE METHODS ****/

    /** RESPONSE HANDLERS ************************************************************/
    /*** SUCCESS **/
    /**
     * Form success handler
     * @param response
     * @private
     * @return {boolean}
     */
    function _successHandler(response) {
        // Default Behaviour
        if (this.type === 'edit') {
            this.toggleLoading();
            this.unlock();
            messageService(response.message, 'success');
        } else {
            this.addButtonIcon(TrinityForm.tiecons.ok);
        }
    }
    /*** ERROR **/
    /**
     * Form error handler, if users callback returns false, omit default behaviour
     * @param error
     * @private
     * @returns {boolean}
     */
    function _errorHandler(error) {
        /** DEFAULT ERROR HANDLER **/
        if (error.db) {
            //TODO: replace with message service
            messageService(error.db, 'warning');
            this.toggleLoading();
            this.unlock();
            return true;
        }
        var noErrors = true;
        if (error.global && error.global.length > 0) {
            noErrors = false;
            _globalErrors(error.global);
        }

        if (error.fields && error.fields.length > 0) {
            noErrors = false;
            this.loading = false;
            this.addButtonIcon(TrinityForm.tiecons.error);
            _fieldErrors.call(this, error.fields);
        } else {
            this.toggleLoading();
            this.unlock();
        }
        if (noErrors && TrinityForm.settings.debug) {
            messageService('DEBUG: Request failed but no FORM errors returned! check server response', 'warning');
        }
        return true;
    }

    /**
     * Handles global errors
     * @param errors
     * @private
     */
    function _globalErrors(errors) {
        var count = errors.length;
        for (var i = 0; i < count; i++) {
            //TODO: replace with message service
            messageService(errors[i], 'warning');
        }
    }

    /**
     * Handles Field Errors - adds them to form
     * @param fields
     * @private
     */
    function _fieldErrors(fields) {
        for (var key in fields) {
            if (fields.hasOwnProperty(key)) {
                var input = document.getElementById(key);
                this.addError(key, input, fields[key]);
            }
        }
    }

    /**
     * Class representing field error
     * @param key
     * @param input
     * @param message
     * @param warn
     * @private
     * @constructor
     */
    function FieldError(key, input, message, warn) {
        this.key = key;
        this.input = input;
        this.message = message;
        this.warning = warn;
        this.listenerKey = null;
        // Add error message
        Dom.classlist.add(input, 'error');
        input.parentElement.appendChild(warn);
    }

    /**
     * Remove Error from TrinityForm instance and returns removed FieldError instance
     * @param index
     * @param e {Event}
     * @private
     * @return {FieldError}
     */
    function _removeError(index, e) {
        if (!_.isUndefined(e)) {
            e.stopPropagation();
            e.preventDefault();
        }
        var error = this.errors[index];
        _.pullAt(this.errors, index);
        Dom.classlist.remove(error.input, 'error');
        Dom.removeNode(error.warning);
        this.validate();
        return error;
    }

    /**
     * Just return Error message element
     * @param key
     * @param message
     * @private
     */
    function _createErrorMessage(key, message) {
        var errDiv = document.createElement('div');
        errDiv.className = 'validation-error';
        errDiv.id = key + '_error';
        errDiv.innerHTML = '* ' + message;
        return errDiv;
    }

    /**
     * Creates icon dom
     * @param attributes
     * @param innerHTMLstring
     * @private
     */
    function _createIcon(attributes, innerHTMLstring) {
        var icon = document.createElement('i'),
            attrKeys = Object.keys(attributes);
        _.each(attrKeys, function (key) {
            icon.setAttribute(key, attributes[key]);
        });
        if (innerHTMLstring) {
            icon.innerHTML = innerHTMLstring;
        }
        return icon;
    }

    /** BUTTON ICON ************************************************************/

    /**
     * Add Icon wrapper to btn input
     * @param btn
     * @param icon
     * @private
     */
    function _addIconWrapper(btn, icon) {
        /** Prepare Icon **/
        icon = icon.cloneNode(true);
        icon.style.width = '100%';
        icon.style.marginTop = '7px';
        Dom.classlist.addAll(icon, ['absolute', 'display-block']);

        var wrapper = Store.getValue(btn, 'wrapper');
        if (_.isNull(wrapper)) {
            wrapper = Dom.createDom('span', { 'class': 'clearfix relative text-center' });
            Dom.classlist.addAll(wrapper, Dom.classlist.get(btn));
            wrapper.style.setProperty('padding', '0px', 'important');
            /** Store info **/
            Store.setValue(btn, 'wrapper', wrapper);
            Store.setValue(btn, 'value', btn.value);
        } else if (wrapper.children.length > 1) {
            /** Replace icon **/
            Dom.replaceNode(icon, wrapper.children[1]);
            return;
        }
        /** Prepare and insert Button with icon **/
        btn.style.width = '100%';
        btn.style.setProperty('margin', '0px', 'important');
        btn.value = '';
        btn.parentElement.insertBefore(wrapper, btn);
        wrapper.appendChild(btn);
        wrapper.appendChild(icon);
    }

    /**
     * Remove Icon wrapper from btn input
     * @param btn
     * @private
     */
    function _removeIconWrapper(btn) {
        var btnValue = Store.getValue(btn, 'value'),
            wrapper = Store.getValue(btn, 'wrapper');
        if (!_.isNull(wrapper)) {
            //restore button
            wrapper.parentElement.insertBefore(btn, wrapper);
            btn.value = btnValue;
            btn.style.width = '';
            btn.style.margin = '';
            // Clean wrapper
            Dom.removeNode(wrapper);
            Dom.removeChildren(wrapper);
        }
    }

    /** FORM PARSER ************************************************************/

    /**
     * Used to parse input name -> object path
     * @type {RegExp}
     */

    /**
     * Parse form inputs and create json object according symfony name specifications
     * Example: <input value="test" name="necktie_product[name]" />
     *  {
     *      necktie_product : {
     *          name: 'test'
     *      }
     *  }
     * @private
     * @param form {HTMLFormElement}
     * @param button {HTMLElement}
     * @returns {{object}}
     */
    function parseSymfonyForm(form, button) {
        var data = {},
            formLength = form.length;
        /** Go through all inputs in form */
        for (var i = 0; i < formLength; i++) {
            if (!form[i].name || form[i].name.length < 1) {
                continue;
            }
            if ((!form[i].value || form[i].value.length < 1) && form[i].type !== 'submit') {
                continue; // No need to do any work if there are no values
            }

            switch (form[i].type) {
                case 'submit':
                    {
                        if (form[i] === button) {
                            break;
                        }
                        continue;
                    }
                case 'radio':
                case 'checkbox':
                    {
                        if (!form[i].checked) {
                            continue;
                        }
                        break;
                    }
                default:
                    break;
            }

            // Init necessary variables
            var isArray = form[i].name.indexOf('[]') !== -1,
                parsed = form[i].name.match(nameRegExp),
                reference = data,
                last = parsed.length - 1;
            /** Evaluate parsed reference object */
            for (var j = 0; j <= last; j++) {
                if (!reference[parsed[j]]) {
                    if (j === last) {
                        if (isArray) {
                            reference[parsed[j]] = [];
                            reference[parsed[j]].push(form[i].value);
                        } else {
                            reference[parsed[j]] = form[i].value;
                        }
                    } else {
                        /** Not last -> create object */
                        reference[parsed[j]] = {};
                        reference = reference[parsed[j]];
                    }
                } else {
                    if (j === last) {
                        if (isArray) {
                            reference[parsed[j]].push(form[i].value);
                        } else {
                            reference[parsed[j]] = form[i].value;
                        }
                    } else {
                        reference = reference[parsed[j]]; // create reference
                    }
                }
            }
        }
        return data;
    }
    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }, function (_githubModpreneurTrinityJSMasterGateway) {
            Gateway = _githubModpreneurTrinityJSMasterGateway['default'];
        }, function (_githubModpreneurTrinityJSMasterUtilsClosureEvents) {
            events = _githubModpreneurTrinityJSMasterUtilsClosureEvents['default'];
        }, function (_githubModpreneurTrinityJSMasterUtilsDom) {
            Dom = _githubModpreneurTrinityJSMasterUtilsDom['default'];
        }, function (_githubModpreneurTrinityJSMasterStore) {
            Store = _githubModpreneurTrinityJSMasterStore['default'];
        }, function (_githubModpreneurTrinityJSMasterServices) {
            messageService = _githubModpreneurTrinityJSMasterServices.messageService;
        }],
        execute: function () {
            TrinityForm = (function () {
                function TrinityForm(formElement, type) {
                    babelHelpers.classCallCheck(this, TrinityForm);

                    if (_.isNull(formElement)) {
                        throw new Error('Input parameter "formElement" cannot be NULL!');
                    }
                    this.element = formElement;
                    this.type = type || null;
                    this.loading = false;
                    this.errors = [];
                    this.activeBtn = null;
                    this.buttons = formElement.querySelectorAll('input[type="submit"]');
                    //Main init
                    _initialize.call(this, formElement);
                }

                /** STATIC CONSTANTS **/
                /**
                 * Form types
                 * @static
                 */

                /**
                 * Disable all forms submit inputs
                 */
                babelHelpers.createClass(TrinityForm, [{
                    key: 'lock',
                    value: function lock() {
                        _.each(this.buttons, Dom.disable);
                    }

                    /**
                     * Enable all forms submit inputs
                     */
                }, {
                    key: 'unlock',
                    value: function unlock() {
                        if (this.loading) {
                            return false;
                        }
                        _.each(this.buttons, Dom.enable);
                        return true;
                    }

                    /**
                     * Returns name of the form
                     * @returns {string}
                     */
                }, {
                    key: 'getName',
                    value: function getName() {
                        return this.element.getAttribute('name');
                    }
                }, {
                    key: 'addError',

                    /**
                     * Adds new error to TrinityForm instance
                     * @param key
                     * @param input
                     * @param message
                     * @public
                     */
                    value: function addError(key, input, message) {
                        // Create Error
                        var error = new FieldError(key, input, message, _createErrorMessage(key, message));
                        // Add error to Form errors and get its index
                        var index = this.errors.push(error) - 1;
                        //Add event listener and save listener key
                        error.listenerKey = events.listenOnce(input, 'change', _removeError.bind(this, index));
                    }
                }, {
                    key: 'removeError',

                    /**
                     * Removes error from TrinityForm
                     * @param input {string} | {HTMLInputElement}
                     * @public
                     */
                    value: function removeError(input) {
                        var index = _.isString(input) ? _.findIndex(this.errors, function (err) {
                            return err.key === input;
                        }) : _.findIndex(this.errors, function (err) {
                            return err.input === input;
                        });
                        var error = _removeError(index);
                        events.unlistenByKey(error.listenerKey);
                    }
                }, {
                    key: 'validate',

                    /**
                     * Validates if all errors are removed from form
                     * @public
                     */
                    value: function validate() {
                        if (this.errors.length < 1) {
                            this.unlock();
                            this.removeButtonIcon();
                        }
                    }

                    /**
                     * Turn on/off Loading Effect
                     * @public
                     */
                }, {
                    key: 'toggleLoading',
                    value: function toggleLoading() {
                        if (this.loading) {
                            this.loading = false;
                            _removeIconWrapper(this.activeBtn);
                        } else {
                            this.activeBtn = this.activeBtn || this.buttons[0] || null;
                            if (_.isNull(this.activeBtn)) {
                                return;
                            } // Should never be true

                            this.loading = true;
                            _addIconWrapper(this.activeBtn, TrinityForm.tiecons.loading);
                        }
                    }

                    /**
                     * Add icon to active button
                     * @param icon {HTMLElement} | {string}
                     */
                }, {
                    key: 'addButtonIcon',
                    value: function addButtonIcon(icon) {
                        var btn = this.activeBtn ? this.activeBtn : this.buttons[0];
                        if (_.isString(icon)) {
                            icon = Dom.htmlToDocumentFragment(icon);
                        }
                        _addIconWrapper.call(this, btn, icon);
                    }

                    /**
                     * Remove whole wrapper of active button
                     */
                }, {
                    key: 'removeButtonIcon',
                    value: function removeButtonIcon() {
                        _removeIconWrapper(this.activeBtn ? this.activeBtn : this.buttons[0]);
                    }
                }]);
                return TrinityForm;
            })();

            _export('default', TrinityForm);

            TrinityForm.formType = {
                EDIT: 'edit',
                NEW: 'new',
                DELETE: 'delete'
            };

            /**
             * Static default settings property
             * @static
             */
            TrinityForm.settings = {
                debug: false
            };

            /**
             * Default icons
             * @static
             */
            TrinityForm.tiecons = {
                loading: _createIcon({
                    'class': 'tiecons tiecons-loading tiecons-rotate font-20',
                    'style': 'color:#530e6d;'
                }),
                ok: _createIcon({
                    'class': 'tiecons tiecons-check font-20',
                    'style': 'color:#39b54a;'
                }),
                error: _createIcon({
                    'class': 'tiecons tiecons-cross-radius font-20',
                    'style': 'color: rgb(121, 0, 0);'
                })
            };nameRegExp = /\w+/g;
        }
    };
});
System.register('github:modpreneur/trinityJS@master/TrinityTab', ['npm:lodash@3.10.1', 'github:modpreneur/trinityJS@master/utils/Dom', 'github:modpreneur/trinityJS@master/utils/closureEvents', 'github:modpreneur/trinityJS@master/Store', 'github:modpreneur/trinityJS@master/TrinityForm', 'github:modpreneur/trinityJS@master/Gateway'], function (_export) {
    /**
     * Created by fisa on 9/11/15.
     */

    'use strict';

    var _, Dom, events, Store, TrinityForm, Gateway, tabRegx, TrinityTab, Tab, LINK_SELECTOR, LazyDOM;

    function _initialize() {
        //Check which tab to load first
        var tabInfo = location.hash.match(tabRegx),
            activeHead = null,
            path = null;

        if (_.isNull(tabInfo)) {
            activeHead = _.find(this.heads, function (tab) {
                return !_.isNull(tab.getAttribute('checked'));
            });
        } else {
            //TODO: Tab info - bigger deep
            activeHead = document.getElementById(tabInfo[1]);
            activeHead.setAttribute('checked', 'checked');
            path = tabInfo[2];
        }
        this.activeHead = activeHead;
        // Add new Tab to tabs
        this.tabs[activeHead.getAttribute('id')] = _createTab(this, activeHead, path || null);

        /** Attach click event Listeners to other heads **/
        _.map(this.heads, function (head) {
            events.listen(head, 'click', _handleTabClick.bind(this, head));
        }, this);

        events.listen(window, 'popstate', _handleNavigation, false, this);
    }

    /**
     * Handles navigation
     * @param e
     * @private
     */
    function _handleNavigation(e) {
        var tabInfo = location.hash.match(tabRegx),
            head = null;

        if (!_.isNull(tabInfo)) {
            head = document.getElementById(tabInfo[1]);
            if (this.activeHead !== head) {
                this.activeHead.removeAttribute('checked');
                this.activeHead = head;
                this.activeHead.setAttribute('checked', 'checked');
                this.activeHead.checked = true;
            }
            var tab = this.getActiveTab();
            if (tabInfo[2]) {
                tab.setActiveByUrl(tabInfo[2]);
            } else if (tab.active !== tab.root) {
                tab.active.hide();
                tab.active = tab.root;
                Dom.classlist.remove(tab.root, 'display-none');
            }
        }
    }

    /**
     * Handles click event on Tab
     * @param head
     * @param e
     * @private
     */
    function _handleTabClick(head, e) {
        var tabID = head.getAttribute('id');
        // If undefined -> Create and Set as Active
        if (_.isUndefined(this.tabs[tabID])) {
            this.tabs[tabID] = _createTab(this, head, null);
            //Set as active
            this.activeHead.removeAttribute('checked');
            this.activeHead = head;
            this.activeHead.setAttribute('checked', 'checked');
            //Hash Location change
            _pushHistory(tabID, [tabID, ' loaded']);
            //location.hash = tabID;
        } else {
                // Just make as active
                this.setActiveTab(head);
            }
    }

    /**
     * Push new history
     * @param newHash
     * @param label
     * @private
     */
    function _pushHistory(newHash, label) {
        window.history.pushState(null, label ? label.join('') : '', [location.pathname, '#', newHash].join(''));
    }

    /**
     * Create new Tab and assign parent for event propagation
     * @param parent
     * @param head
     * @param path
     * @returns {Tab}
     * @private
     */
    function _createTab(parent, head, path) {
        var t = new Tab(head, path);
        t.setParentEventTarget(parent);
        return t;
    }

    /**
     * Tab class
     */

    /**
     * PRROCES AJAX LINK
     * MOST IMPORTANT - DOWNLOADS CONTENT AND CALL OTHERS
     * @param link
     * @param isActive
     * @param callback
     * @private
     */
    function _processAjaxLink(link, isActive, callback) {
        isActive = _.isUndefined(isActive) ? true : isActive;
        Gateway.get(link, null, (function (data) {
            if (typeof data === 'object') {
                if (data.go != undefined) {
                    _processAjaxLink.call(this, data.go, isActive, callback);
                    return;
                }
                throw new Error('Unexpected response: ', data);
            } else {
                var tempDiv = Dom.createDom('div', null, data.trim());
                this.root = tempDiv.children.length === 1 ? tempDiv.children[0] : tempDiv;

                if (!isActive) {
                    Dom.classlist.add(this.root, 'display-none');
                } else {
                    this.active = this.root;
                    _hideLoading(this.body);
                }
            }

            this.body.appendChild(this.root);

            _.each(this.root.querySelectorAll('form'), function (form) {
                //to be sure, save forms
                this.forms.push(new TrinityForm(form));
            }, this);
            //Ajax links
            _initAjaxLinks.call(this, this.root);

            //Dispatch event
            var domID = this.root.getAttribute('id');
            if (domID) {
                this.dispatchEvent(new events.Event(domID, this));
            }

            // IF callback provided
            if (callback) {
                callback.call(this, this.root);
            }
        }).bind(this), (function (error) {
            //TODO: Refresh button and Error somehow
            console.error(error);
        }).bind(this));
    }

    /**
     * Initialize ajax links (only where is class ".link"
     * @param body
     * @private
     */
    function _initAjaxLinks(body) {
        var href = this.preload ? this.preload.link : null;
        _.each(body.querySelectorAll(LINK_SELECTOR), function (link, index) {
            var id = link.getAttribute('id');
            if (!id || id.length === 0) {
                id = [this.head.getAttribute('id'), '-ajaxLink-', index].join('');
                link.setAttribute('id', id);
            }
            if (!_.isNull(href) && href === link.getAttribute('href')) {
                this.children[id] = this.preload;
            } else {
                this.children[id] = null;
            }
            //Attach click handler
            events.listen(link, 'click', _handleLinkClick.bind(link, this));
        }, this);
    }

    function _handleLinkClick(parent, e) {
        var link = this;
        var id = link.getAttribute('id');
        if (_.isNull(parent.children[id])) {
            parent.children[id] = new LazyDOM(link.getAttribute('href'), parent);
            parent.children[id].setParentEventTarget(parent);
        }
        parent.setActive(parent.children[id]);
    }

    /**
     * Represents lazy loading dom structure - will be removed?
     */

    function _showLoading(element) {
        var loader = element.querySelector('.tab-loader');
        if (_.isNull(loader)) {
            var icon = Dom.createDom('i', { 'class': 'tiecons tiecons-loading tiecons-rotate font-40' });
            loader = Dom.createDom('div', { 'class': 'tab-loader' }, icon);
            element.appendChild(loader);
        } else {
            Dom.classlist.remove(loader, 'display-none');
        }
    }

    function _hideLoading(element) {
        var loader = element.querySelector('.tab-loader');
        if (loader) {
            Dom.classlist.add(loader, 'display-none');
        }
    }
    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }, function (_githubModpreneurTrinityJSMasterUtilsDom) {
            Dom = _githubModpreneurTrinityJSMasterUtilsDom['default'];
        }, function (_githubModpreneurTrinityJSMasterUtilsClosureEvents) {
            events = _githubModpreneurTrinityJSMasterUtilsClosureEvents['default'];
        }, function (_githubModpreneurTrinityJSMasterStore) {
            Store = _githubModpreneurTrinityJSMasterStore['default'];
        }, function (_githubModpreneurTrinityJSMasterTrinityForm) {
            TrinityForm = _githubModpreneurTrinityJSMasterTrinityForm['default'];
        }, function (_githubModpreneurTrinityJSMasterGateway) {
            Gateway = _githubModpreneurTrinityJSMasterGateway['default'];
        }],
        execute: function () {
            tabRegx = /(?:#)(.*tab\d+)(?:=(.*))*/;

            /**
             * Trinity Tab
             */

            TrinityTab = (function (_events$EventTarget) {
                babelHelpers.inherits(TrinityTab, _events$EventTarget);

                function TrinityTab() {
                    babelHelpers.classCallCheck(this, TrinityTab);

                    var tabHeads = document.querySelectorAll('.tab-head');
                    if (tabHeads.length < 1) {
                        throw new Error('Elements with "tab-head" class not found!');
                    }
                    babelHelpers.get(Object.getPrototypeOf(TrinityTab.prototype), 'constructor', this).call(this);
                    this.heads = tabHeads;
                    this.tabs = {};
                    this.activeHead = null;
                    _initialize.call(this);
                }

                /**
                 * Sets Active Tab as actual and update Hash path
                 * @param tabHead
                 * @public
                 */
                babelHelpers.createClass(TrinityTab, [{
                    key: 'setActiveTab',
                    value: function setActiveTab(tabHead) {
                        this.activeHead.removeAttribute('checked');
                        this.activeHead = tabHead;
                        this.activeHead.setAttribute('checked', 'checked');
                        //Update Hash URL
                        _pushHistory(this.getActiveTab().getPath());
                    }

                    /**
                     * TODO: NOTE: may return NULL if active tab still processing
                     * @returns {Tab}
                     */
                }, {
                    key: 'getActiveTab',
                    value: function getActiveTab() {
                        return _.find(this.tabs, function (tab) {
                            return tab.head === this.activeHead;
                        }, this);
                    }
                }]);
                return TrinityTab;
            })(events.EventTarget);

            _export('default', TrinityTab);

            Tab = (function (_events$EventTarget2) {
                babelHelpers.inherits(Tab, _events$EventTarget2);

                function Tab(head, path) {
                    babelHelpers.classCallCheck(this, Tab);

                    babelHelpers.get(Object.getPrototypeOf(Tab.prototype), 'constructor', this).call(this);
                    /** Tab **/
                    this.forms = [];
                    this.children = {};
                    this.head = head;
                    this.active = null;

                    // Tab body
                    this.body = document.getElementById(head.getAttribute('id').replace('tab', 'tab-body-'));

                    if (path) {
                        this.preload = new LazyDOM(path, this);
                        this.preload.setParentEventTarget(this);
                        this.active = this.preload;
                    } else {
                        _showLoading(this.body);
                    }

                    //link of body for root child
                    this.link = this.body.getAttribute('data-source');
                    _processAjaxLink.call(this, this.link, !path);
                }

                /**
                 * Generate path of actual position in deep structure -> no need
                 * @returns {string}
                 */
                babelHelpers.createClass(Tab, [{
                    key: 'getPath',
                    value: function getPath() {
                        if (_.isNull(this.active) || this.active === this.root) {
                            return this.head.getAttribute('id');
                        }
                        return [this.head.getAttribute('id'), this.active.getPath()].join('=');
                    }

                    /**
                     * Set active tab according to provided url hash..
                     * @param url
                     */
                }, {
                    key: 'setActiveByUrl',
                    value: function setActiveByUrl(url) {
                        var active = _.find(this.children, _.matches({ 'link': url }));
                        if (this.active === active) {
                            return;
                        }
                        if (this.active === this.root) {
                            Dom.classlist.add(this.root, 'display-none');
                        } else {
                            this.active.hide();
                        }
                        this.active = active;
                        this.active.show();
                    }

                    /**
                     * Set active tab
                     * @param tab
                     */
                }, {
                    key: 'setActive',
                    value: function setActive(tab) {
                        if (this.active === this.root) {
                            Dom.classlist.add(this.root, 'display-none');
                        } else {
                            this.active.hide();
                        }
                        tab.show();
                        this.active = tab;
                        _pushHistory([location.hash.substring(1), '=', this.active.getPath()].join(''));
                    }

                    /**
                     * Go back in history
                     */
                }, {
                    key: 'back',
                    value: function back() {
                        window.history.back();
                    }
                }]);
                return Tab;
            })(events.EventTarget);

            _export('Tab', Tab);

            LINK_SELECTOR = '.link';

            LazyDOM = (function (_events$EventTarget3) {
                babelHelpers.inherits(LazyDOM, _events$EventTarget3);

                function LazyDOM(link, parent) {
                    babelHelpers.classCallCheck(this, LazyDOM);

                    babelHelpers.get(Object.getPrototypeOf(LazyDOM.prototype), 'constructor', this).call(this);
                    /** Lazy DOM **/
                    this.children = {};
                    this.forms = [];
                    this.link = link;
                    this.parent = parent;
                    this.active = null;
                    this.root = null;

                    // Create body
                    this.body = document.createElement('div');
                    _showLoading(this.body);

                    parent.body.appendChild(this.body);

                    _processAjaxLink.call(this, this.link, true, function (target) {
                        // Create back button
                        var header = target.querySelector('.header-h2');
                        var backButton = Dom.createDom('span', { 'class': 'tab-back' }, '');
                        var icon = Dom.createDom('i', { 'class': 'tiecons tiecons-arrow-bold-long-left font-20' }, '');
                        backButton.appendChild(icon);

                        header.appendChild(backButton);
                        Dom.classlist.add(header, 'padding-left-90');
                        events.listen(backButton, 'click', (function (e) {
                            e.preventDefault();
                            this.parent.back();
                        }).bind(this));
                    });
                }

                babelHelpers.createClass(LazyDOM, [{
                    key: 'hide',
                    value: function hide() {
                        Dom.classlist.add(this.body, 'display-none');
                    }
                }, {
                    key: 'show',
                    value: function show() {
                        Dom.classlist.remove(this.body, 'display-none');
                    }
                }, {
                    key: 'getPath',
                    value: function getPath() {
                        if (_.isNull(this.active) || this.active === this.root) {
                            return this.link;
                        }
                        return [this.link, this.active.getPath()].join('=');
                    }
                }, {
                    key: 'back',
                    value: function back() {
                        window.history.back();
                    }
                }, {
                    key: 'setActive',
                    value: function setActive(tab) {
                        if (this.active === this.root) {
                            Dom.classlist.add(this.root, 'display-none');
                        } else {
                            this.active.hide();
                        }
                        tab.show();
                        this.active = tab;
                        _pushHistory([location.hash.substring(1), '=', this.active.getPath()].join(''));
                    }
                }]);
                return LazyDOM;
            })(events.EventTarget);
        }
    };
});
System.register('github:modpreneur/trinityJS@master/Collection', ['npm:lodash@3.10.1', 'github:modpreneur/trinityJS@master/utils/Dom', 'github:modpreneur/trinityJS@master/utils/closureEvents', 'github:modpreneur/trinityJS@master/Store'], function (_export) {
    /**
     * Created by fisa on 8/20/15.
     */

    /**
     * Default settings of Collection Object
     * @type {{addButton: string, deleteButton: string, onAdd: null, onDelete: null, name: string}}
     */
    'use strict';

    var _, Dom, events, Store, defaultSettings, Collection, PrototypeData, CollectionChild;

    /**
     * Initialize Collection object
     * @param data {PrototypeData}
     * @private
     */
    function _initialize(data) {
        // init
        var prototypeDom = Dom.htmlToDocumentFragment(data.prototype);
        var protoChildren = _.map(prototypeDom.querySelectorAll('[data-prototype]'), function (node) {
            return _parsePrototypeData(node);
        });

        this.prototype = _getHtmlString(prototypeDom);
        this.protoChildren = protoChildren;
        _addCreateBtn.call(this);

        // Add class and delete button to children
        var children = _.filter(this.collectionHolder.children, function (node) {
            return Dom.classlist.contains(node, 'row');
        });
        this.children = _.each(children, function (child, index, coll) {
            var newChild = new CollectionChild(child, index, this);
            _addRemoveBtn.call(this, newChild);
            coll[index] = newChild;
        }, this);
        //Add first?
        if (children.length === 0 && this.settings.addFirst) {
            this.add();
        }
    }

    /**
     * Parse prototype data from element and remove [data-prototype] and [data-options] values
     * [data-prototype] value is set to "prototype_name" of parsed element, found in options
     * @param element
     * @returns {PrototypeData}
     * @private
     */
    function _parsePrototypeData(element) {
        var data = new PrototypeData(element.getAttribute('data-prototype'), JSON.parse(element.getAttribute('data-options')));
        //clean up
        element.removeAttribute('data-options');
        element.setAttribute('data-prototype', data.options['prototype_name']);
        return data;
    }

    /**
     * Add remove button to element
     * @param child {CollectionChild}
     * @private
     */
    function _addRemoveBtn(child) {
        var settings = this.settings,
            removeButton = settings.deleteButton.cloneNode(true);

        // right ID to delete button
        removeButton.setAttribute('id', [removeButton.getAttribute('id'), '_', child.node.getAttribute('id')].join(''));

        events.listenOnce(removeButton, 'click', (function (e) {
            // prevent the link from creating a "#" on the URL
            e.preventDefault();

            if (_.isFunction(settings.onDelete)) {
                settings.onDelete(child.node);
            }
            var id = child.id;
            // remove collection child
            child.remove();
            // Update all other children
            this.children = _.filter(this.children, function (item) {
                if (item.id > id) {
                    item.setID(item.id - 1);
                    return true;
                }
                return !(item.id === id);
            });
        }).bind(this));

        //Append child to right
        child.node.querySelector('.form-right').appendChild(removeButton);
    }

    /**
     * Add Add button to collection
     * @private
     */
    function _addCreateBtn() {
        var settings = this.settings;
        events.listen(settings.addButton, 'click', (function (e) {
            e.preventDefault();
            // add a new tag form (see next code block)
            this.add();
        }).bind(this));
        //append add button
        this.collectionHolder.appendChild(settings.addButton);
    }

    /**
     * Fills placeholders in prototype string
     * @param key {string}
     * @param name {string}
     * @param number {Number}
     * @param prototype {string}
     * @returns {XML|string}
     * @private
     */
    function _fillPlaceholders(key, name, number, prototype) {
        var labelRegx = new RegExp(key + 'label__', 'g'),
            nameRegx = new RegExp(key, 'g');
        return prototype.replace(labelRegx, name + number).replace(nameRegx, '' + number);
    }

    /**
     * Return HTML string representation of HTML Element object
     * @param element {HTMLElement}
     * @returns {string}
     * @private
     */
    function _getHtmlString(element) {
        var wrap = document.createElement('div');
        wrap.appendChild(element);
        return wrap.innerHTML;
    }

    /**
     * Remove label of node
     * @param node {HTMLElement}
     * @private
     */
    function _removeLabel(node) {
        Dom.removeNode(node.querySelector('.form-left'));
        var formRight = node.querySelector('.form-right');
        Dom.classlist.removeAll(formRight, ['span-none-padding-medium-16', 'span-none-padding-large-18', 'span-none-padding-xlarge-14']);
        Dom.classlist.addAll(formRight, ['span-none-padding-medium-24', 'span-none-padding-large-24', 'span-none-padding-xlarge-24']);
    }

    /**
     * Simple class which keeps basic prototype data
     * @class PrototypeData
     * @param proto {string}
     * @param options {Object}
     * @constructor
     */

    /**
     * Initialize new collections of child
     * @param prototypeElements {HTMLCollection | Array}
     * @param prototypeDataSource {Array}
     * @returns {*|Array}
     * @private
     */
    function _initializeCollections(prototypeElements, prototypeDataSource) {
        if (!prototypeDataSource) {
            return _.map(prototypeElements, function (el) {
                return Store.getValue(el, 'collection');
            });
        } else {
            // Init next level
            return _.map(prototypeElements, function (el) {
                var prototypeName = el.getAttribute('data-prototype');
                var prototypeData = _.cloneDeep(_.find(prototypeDataSource, function (data) {
                    return data.options['prototype_name'] === prototypeName;
                }));
                prototypeData.prototype = _fillPlaceholders(this.parent.settings['prototype_name'], this.parent.settings.name, this.id, prototypeData.prototype);
                return new Collection(el, this.parent.globalOptions, prototypeData, this.parent.layer + 1);
            }, this);
        }
    }

    /**
     * Change identifier on particular level of selected attribute
     * @param node {HTMLElement}
     * @param id {string}
     * @param layer {Number}
     * @param attribute {string}
     * @private
     */
    function _updateAttribute(node, id, layer, attribute) {
        var isName = attribute === 'name';
        var regex = isName ? /\[\d]/g : /_\d_|_\d$/g;
        var parameterStr = node.getAttribute(attribute);
        var resultStr = '';

        var i = 0;
        var rgxResult = null;
        var next = true;

        while (next) {
            rgxResult = regex.exec(parameterStr);
            if (i === layer) {
                resultStr += parameterStr.substring(0, rgxResult.index + 1);
                resultStr += id;

                if (!isName && parameterStr.length === rgxResult.index + rgxResult[0].length) {
                    break;
                }
                // Add trailing
                resultStr += isName ? ']' : '_';
                //Add end of string
                resultStr += parameterStr.substring(rgxResult.index + rgxResult[0].length);
                next = false;
                break;
            }
            i++;
        }
        //Set new ID
        node.setAttribute(attribute, resultStr);
    }
    return {
        setters: [function (_npmLodash3101) {
            _ = _npmLodash3101['default'];
        }, function (_githubModpreneurTrinityJSMasterUtilsDom) {
            Dom = _githubModpreneurTrinityJSMasterUtilsDom['default'];
        }, function (_githubModpreneurTrinityJSMasterUtilsClosureEvents) {
            events = _githubModpreneurTrinityJSMasterUtilsClosureEvents['default'];
        }, function (_githubModpreneurTrinityJSMasterStore) {
            Store = _githubModpreneurTrinityJSMasterStore['default'];
        }],
        execute: function () {
            defaultSettings = {
                addButton: '<div class="collection-add display-inline-block">\n            <div class="span-medium-8 span-large-6 span-xlarge-10"></div>\n            <div class="display-inline-block">\n                <a href="#" id="addButton" class="add-collection-item button button-info button-medium button-circle">\n                    <i class="tiecons tiecons-plus-radius-large"></i>\n                </a>\n            </div>\n        </div>',
                deleteButton: '<a title="Remove item" href="#" id="deleteButton" class="delete-collection-item">\n            <span class="tiecons tiecons-cross-angular tiecons-postfix circle"></span>\n        </a>',
                onAdd: null,
                onDelete: null,
                label: false,
                addFirst: true,
                name: '[Element Name]'
            };

            /**
             * TODO: Test it
             * Collection class, handles one layer of Collection form
             * @param element {HTMLElement}
             * @param [globalOptions] {Object}
             * @param [prototypeData] {PrototypeData}
             * @param [layer] {number}
             * @constructor
             */

            Collection = (function () {
                function Collection(element, globalOptions, prototypeData, layer) {
                    babelHelpers.classCallCheck(this, Collection);

                    this.collectionHolder = element;
                    this.prototype = null;
                    this.protoChildren = [];
                    this.children = [];
                    this.globalOptions = globalOptions;
                    this.layer = layer || 0;

                    if (!prototypeData) {
                        prototypeData = _parsePrototypeData(element);
                        Store.setValue(element, 'collection', this);
                    }
                    this.settings = _.extend(_.clone(defaultSettings), globalOptions ? _.extend(prototypeData.options, globalOptions) : prototypeData.options);
                    this.settings.addButton = Dom.htmlToDocumentFragment(this.settings.addButton.trim());
                    this.settings.deleteButton = Dom.htmlToDocumentFragment(this.settings.deleteButton.trim());
                    /** Make it live **/
                    _initialize.call(this, prototypeData);
                }

                /**
                 * Adds new child to collection
                 */
                babelHelpers.createClass(Collection, [{
                    key: 'add',
                    value: function add() {
                        var settings = this.settings,
                            addButton = settings.addButton,
                            prototype = this.prototype,
                            prototypeChildren = this.protoChildren;

                        var childrenCount = _.filter(this.collectionHolder.children, function (node) {
                            return Dom.classlist.contains(node, 'collection-child');
                        });

                        var newChildStr = _fillPlaceholders(settings['prototype_name'], settings.name, childrenCount.length, prototype);
                        var newChildNode = Dom.htmlToDocumentFragment(newChildStr.trim());
                        var child = new CollectionChild(newChildNode, childrenCount.length, this, prototypeChildren);
                        this.children.push(child);
                        _addRemoveBtn.call(this, child);

                        //Insert new Child
                        addButton.parentNode.insertBefore(newChildNode, addButton);

                        if (_.isFunction(settings.onAdd)) {
                            settings.onAdd(newChildNode);
                        }
                    }
                }]);
                return Collection;
            })();

            _export('default', Collection);

            PrototypeData = function PrototypeData(proto, options) {
                babelHelpers.classCallCheck(this, PrototypeData);

                this.prototype = proto;
                this.options = options;
            }

            /**
             * Class representing child of collection
             * @class CollectionChild
             * @param node {HTMLElement}
             * @param id {string}
             * @param parent {Collection}
             * @param [prototypeData] {Array}
             * @constructor
             */
            ;

            CollectionChild = (function () {
                function CollectionChild(node, id, parent, prototypeData) {
                    babelHelpers.classCallCheck(this, CollectionChild);

                    this.id = id;
                    this.node = node;
                    this.parent = parent;

                    Dom.classlist.add(node, 'collection-child');
                    //Label?
                    if (parent.settings.label === false) {
                        _removeLabel(node);
                    }

                    var prototypeElements = node.querySelectorAll('[data-prototype]');
                    if (prototypeElements.length > 0) {
                        this.collections = _initializeCollections.call(this, prototypeElements, prototypeData);
                    }
                }

                /**
                 * Safety remove of child
                 */
                babelHelpers.createClass(CollectionChild, [{
                    key: 'remove',
                    value: function remove() {
                        Dom.removeNode(this.node);
                    }

                    /**
                     * Set ID of child and update all elements descendant
                     * @param id
                     */
                }, {
                    key: 'setID',
                    value: function setID(id) {
                        var layer = this.parent.layer;
                        this.id = id;
                        // ID
                        _.map(this.node.querySelectorAll('[id]'), function (el) {
                            _updateAttribute(el, id, layer, 'id');
                        }, this);
                        // NAME
                        _.map(this.node.querySelectorAll('[name]'), function (el) {
                            _updateAttribute(el, id, layer, 'name');
                        }, this);
                        // LABEL
                        _.map(this.node.querySelectorAll('label[for]'), function (el) {
                            _updateAttribute(el, id, layer, 'for');
                        }, this);
                        // change to self
                        _updateAttribute(this.node, id, layer, 'id');
                    }
                }]);
                return CollectionChild;
            })();
        }
    };
});
System.register('github:modpreneur/trinityJS@master/trinity', ['github:modpreneur/trinityJS@master/App', 'github:modpreneur/trinityJS@master/Controller', 'github:modpreneur/trinityJS@master/Router', 'github:modpreneur/trinityJS@master/Services', 'github:modpreneur/trinityJS@master/Gateway', 'github:modpreneur/trinityJS@master/Store', 'github:modpreneur/trinityJS@master/TrinityForm', 'github:modpreneur/trinityJS@master/TrinityTab', 'github:modpreneur/trinityJS@master/Collection'], function (_export) {
  /**
   * Created by fisa on 11/9/15.
   */

  /**
   * Just export all from trinity
   */
  'use strict';

  var App, Controller, Router, Services, Gateway, Store, TrinityForm, TrinityTab, Collection;
  return {
    setters: [function (_githubModpreneurTrinityJSMasterApp) {
      App = _githubModpreneurTrinityJSMasterApp['default'];
    }, function (_githubModpreneurTrinityJSMasterController) {
      Controller = _githubModpreneurTrinityJSMasterController['default'];
    }, function (_githubModpreneurTrinityJSMasterRouter) {
      Router = _githubModpreneurTrinityJSMasterRouter['default'];
    }, function (_githubModpreneurTrinityJSMasterServices) {
      Services = _githubModpreneurTrinityJSMasterServices['default'];
    }, function (_githubModpreneurTrinityJSMasterGateway) {
      Gateway = _githubModpreneurTrinityJSMasterGateway['default'];
    }, function (_githubModpreneurTrinityJSMasterStore) {
      Store = _githubModpreneurTrinityJSMasterStore['default'];
    }, function (_githubModpreneurTrinityJSMasterTrinityForm) {
      TrinityForm = _githubModpreneurTrinityJSMasterTrinityForm['default'];
    }, function (_githubModpreneurTrinityJSMasterTrinityTab) {
      TrinityTab = _githubModpreneurTrinityJSMasterTrinityTab['default'];
    }, function (_githubModpreneurTrinityJSMasterCollection) {
      Collection = _githubModpreneurTrinityJSMasterCollection['default'];
    }],
    execute: function () {
      _export('default', {
        // Core
        App: App,
        Controller: Controller,
        Router: Router,

        // standalone utils
        Gateway: Gateway,
        Store: Store,
        Services: Services,
        Collection: Collection,

        // depends on Gateway, Store and Services
        TrinityForm: TrinityForm,
        TrinityTab: TrinityTab
      });
    }
  };
});
System.register("github:modpreneur/trinityJS@master", ["github:modpreneur/trinityJS@master/trinity"], function (_export) {
  "use strict";

  return {
    setters: [function (_githubModpreneurTrinityJSMasterTrinity) {
      for (var _key in _githubModpreneurTrinityJSMasterTrinity) {
        if (_key !== "default") _export(_key, _githubModpreneurTrinityJSMasterTrinity[_key]);
      }

      _export("default", _githubModpreneurTrinityJSMasterTrinity["default"]);
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=trinity.bundle.js.map