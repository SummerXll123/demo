/**
 * @file
 * @author gp10856
 * 
 */

$(function () {
    storeReception.init();
});

var storeReception = {
    /**
     * 全局的配置对象，包含各个模块共用的常量
     * @type {Object}
     */
    config: {
        basePath :"/Sell/Statistics/"
    },
    /**
     * 全局的DOM事件，每个模块的DOM事件请写在自己的模块里
     * @type {Object}
     */
    events: {
        'body&.dropDown-btn': {
            click: function (root, e) {
                $(this).toggleClass('list-show');
            }
        },
        'body&.dropDown-list > li': {
            click: function (root, e) {
                var dropDown_btn = $(this).parent().siblings('.dropDown-btn');
                var text = $(this).text();
                var value = $(this).attr('data-value');
                dropDown_btn.text(text).attr('data-value', value).removeClass('list-show');

                var selectedItem = $(this);
                selectedItem.siblings('.selected').removeClass('selected');
                selectedItem.addClass('selected');

                root.pubsub.fire('dropDown.select', null, value, selectedItem);
            }
        },
        'body&body': {
            click: function (root, e) {
                var canHideDropDown = $(e.target).parents('.dropDown').length === 0;
                if (canHideDropDown) {
                    $('.dropDown').find('.dropDown-btn').removeClass('list-show');
                }
            }
        },
        'body&.dialog-btn-close': {
            click: function(root, e) {
                var id = $(this).parents('.dialog').attr('id');
                root.handles.hideDialog('#' + id);
            }
        },
        //todo: 测试demo，需要删除
        'body&#btn-showDialog': {
            click: function(root, e) {
                root.handles.showDialog('#testDialog');
            }
        }
    },

    /**
     * 包含将页面拆分开的所有模块
     * @type {Object}
     */
    modules: {},
    /**
     * 全局的初始化函数，会发布global.init事件，其他订阅者监听该事件，实现各自模块的初始化
     * 
     */
    init: function() {
        var root = storeReception;

        root.handles.getHiddenArea();

        //root.handles.loadModuleHtml();

            root._delegate(root.events);

        root.pubsub = root._pubsub();

        root.loadModules();


        root.pubsub.fire('root.init', null);  
    },
    /**
     * 包含所有模块可用的公共工具函数
     */
    helpers: {},
    /**
     * 包含全局的处理函数
     * @type {Object}
     */
    handles: {
        Module: function(root, name) {
            var that = this;

            this.config = {};

            this.init = function () {
                //绑定dom事件
                root._delegate(that.events);
            };

            this.events = {};

            this.handles = {};

            this.pubsub = root._pubsub();
            
            root.pubsub.on('root.init', name, function () {
                that.init();

                that.pubsub.fire(name + '.init');
            });
        },
        load: function(selector, url) {
            $.ajax({
                url: url,
                cache: false,
                async: false,
                success: function(html){
                  $(selector).append(html);
                }
            });
        },
        //todo:后期可能要删除
        // loadModuleHtml: function() {
        //    var root = storeReception;
        //    root.handles.load("#stateInfo .section-bd", "storeReception_stateInfo.html");
        //    root.handles.load("#userInfo .section-bd", "storeReception_userInfo.html");
        //    root.handles.load("#orderCreate .section-bd", "storeReception_orderCreate.html");
        //    root.handles.load("#orderQuery .section-bd", "storeReception_orderQuery.html");
        // },
        /**
         * 显示弹框
         * @param  {string} dialogId #id
         */
        showDialog: function(dialogId) {
            $(dialogId).addClass('show');
        },
        hideDialog: function(dialogId) {
            $(dialogId).removeClass('show');
        },
        /*获取隐藏域内容*/
        getHiddenArea:function(){
            var root = storeReception;
            root.config.jobNumber = $("#Jobnumber").val();
            root.config.storeReceptionInfoId = $("#StoreReceptionInfoId").val();
            root.config.mobile = $("#Mobile").val();
            root.config.storeId = $("#StoreId").val();
        }   
    },
    loadModules: function() {},
    /**
     * DOM事件委托，接受selector&selector的形式
     * @private
     */
    _delegate: function(events) {
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
                if (!this._events || !this._events[eventName]) { return; }

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


storeReception.loadModules = function () {
    var root = storeReception;
    var rootModules = root.modules;
    rootModules.stateInfoBox = createStateInfoBoxModule(root);
    rootModules.userInfoBox = createUserInfoBoxModule(root);
    rootModules.orderCreateBox = createOrderCreateBoxModule(root);
    rootModules.orderQueryBox = createOrderQueryBoxModule(root);
    
};