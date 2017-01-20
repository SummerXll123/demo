/**
 * @file
 * @author gp10856
 *
 */

$(function () {
    vipMember.init();
    //alert("dd")
});
var vipMember = {
        /**
         * 全局的配置对象，包含各个模块共用的常量
         * @type {Object}
         */
        config: {
            //类型
            source: ["个人", "区域总部", "市场中心"],

            //排序
            sortPara: {
                columName: '',
                isAsc: '',
            },

            //分页
            pager: {
                CurrentPage: 1,
                PageSize: 2,
                Page: 1
            }
        },
        /**
         * 全局的DOM事件，每个模块的DOM事件请写在自己的模块里
         * @type {Object}
         */
        events: {
            "body&#search":
            {
                click: function () {
                    alert("ff");
                    console.log("dd")
                }
            },
            "body&#vipWrapper li":
            {
                click: function () {
                    //alert("dd")
                }
            }

        },

        /**
         * 包含将页面拆分开的所有模块
         * @type {Object}
         */
        modules: {
        }
        ,
        /**
         * 全局的初始化函数，会发布global.init事件，其他订阅者监听该事件，实现各自模块的初始化
         *
         */
        init: function () {
            var root = vipMember;
            root._delegate(root.events);
            root.handles.initPlugins();

        } ,
        /**
         * 包含所有模块可用的公共工具函数
         */
        helpers: {
        }
        ,
        /**
         * 包含全局的处理函数
         * @type {Object}
         */
        handles: {
            //排序
            initPlugins: function () {
                //var pagerCount=document.getElementById('pagerCount');
                var root = vipMember;
                var that = this;

            }
            ,
            initEsort: function () {

            },
        }
        ,
        loadModules: function () {
        }
        ,
        /**
         * DOM事件委托，接受selector&selector的形式
         * @private
         */
        _delegate: function (events) {
            var root = this;
            var events = events || {};
            var eventObjs, fn, queryStr, type, parentNode, parentQuery, childQuery;

            for (queryStr in events) {
                if (events.hasOwnProperty(queryStr)) {
                    eventObjs = events[queryStr];
                }

                for (type in eventObjs) {
                    if (eventObjs.hasOwnProperty(type)) {
                        fn = eventObjs[type];
                        parentQuery = queryStr.split('&')[0];
                        childQuery = queryStr.split('&')[1];
                        parentNode = $(parentQuery) || $('body');
                        if (parentQuery === childQuery) {
                            parentNode.on(type, (function (fn) {
                                return function (e) {
                                    var newThis = e.currentTarget;
                                    fn.call(newThis, root, e);
                                };
                            })(fn));
                        }
                        else {
                            parentNode.delegate(childQuery, type, (function (fn) {
                                return function (e) {
                                    var newThis = e.currentTarget;
                                    fn.call(newThis, root, e);
                                };
                            })(fn));
                        }
                    }
                }
            }
        },
        /**
         * 发布者订阅者
         * @return {[type]} [description]
         */
        _pubsub: function () {
            return {
                /**
                 *注册事件
                 *
                 * @public
                 * @param {string} [eventName] [事件名]
                 * @param {string} [listenerName] [需要添加事件的对象]
                 * @param {function()} [handler] [触发事件的相应处理函数]
                 * @return {object} [实例对象]
                 */
                on: function (eventName, listenerName, handler) {
                    if (!this._events) {
                        this._events = {};
                    }
                    if (!this._events[eventName]) {
                        this._events[eventName] = {};
                    }
                    if (this._events[eventName][listenerName] == null && typeof handler === 'function') {
                        this._events[eventName][listenerName] = handler;
                    }
                    return this;
                },

                /**
                 *触发事件
                 *
                 * @public
                 * @param {string} [eventName] [事件名，由listenerName和eventName组成]
                 * @return {object} [实例对象]
                 */
                fire: function (eventName, listenerName) {
                    if (!this._events || !this._events[eventName]) {
                        return;
                    }

                    var args = Array.prototype.slice.call(arguments, 2) || [];
                    var listeners = this._events[eventName];
                    if (listenerName == null) {
                        for (var key in listeners) {
                            listeners[key].apply(this, args);
                        }
                    }
                    else {
                        if (listeners.hasOwnProperty(listenerName)) {
                            listeners[listenerName].apply(this, args);
                        }
                        else {
                            return;
                        }
                    }

                    return this;
                },

                /**
                 *注销事件
                 *
                 *@public
                 *@param {string} [eventName] [事件名]
                 *@param {string} [listenerName] [需要添加事件的对象]
                 *@return {object} [实例对象]
                 */
                off: function (eventName, listenerName) {
                    if (!eventName && !listenerName) {
                        this._events = {};
                    }
                    if (eventName && !listenerName) {
                        delete this._events[eventName];
                    }

                    if (eventName && listenerName) {
                        delete this._events[eventName];
                    }
                    return this;
                }
            };
        }
    };

vipMember.loadModules = function () {
    var root = vipMember;
    var rootModules = root.modules;

};

