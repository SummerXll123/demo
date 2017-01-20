/**
 * @file
 * @author gp10856
 *
 */

$(function () {
    submission.init();
});

var submission = {
    /**
     * 全局的配置对象，包含各个模块共用的常量
     * @type {Object}
     */
    config: {
    },
    /**
     * 全局的DOM事件，每个模块的DOM事件请写在自己的模块里
     * @type {Object}
     */
    events: {
        "body&#search":{
            click:function(){
                alert("ff")
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
        var root = submission;
        root.handles.getTableDataSort();
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

        // 获取素材表格数据
        getTableDataSort: function (index) {
            var root = submission;
            $.ajax({
                type: "post",
                url: "/test.json",
                dataType: "json",
                timeout: 20000,
                beforeSend: function () {
                    $('#tableCount tbody').empty();
                },
                success: function (data) {
                    if (data) {
                        var tableData = data.Data.DataList;
                        var tbodyHtml = "";
                        if (tableData && tableData.length !== 0) {
                            tableData.forEach(function (item, index) {
                                tbodyHtml += '<tr>' +
                                    '<td>' + item.Time + '</td>' + //放[index]，获取当前的索引值
                                    '<td>' + item.Part + '</td>' +
                                    '<td>' + item.ChargePerson + '</td>' +
                                    '<td>' + item.TitleNum + '</td>' +
                                    '<td>' + item.ReadNum + '</td>' +
                                    '</tr>';
                                console.log(item.PublishId);
                            });
                            $("#tableCount tbody").html(tbodyHtml);

                        } else {
                            root.handles.showMsgInTable("#tableCount", "暂无数据");
                        }
                    } else {
                        root.handles.showMsgInTable("#tableCount", "加载失败，重新刷新试试");
                    }
                },
                complete: function (xhr, status) {
                    if (status == "timeout") {
                        alert("异步超时！");
                    }
                },
                error: function (err) {
                    alert(err);
                    root.handles.showMsgInTable("#tableCount", "加载出现问题");
                }
            });
        },
        showMsgInTable: function (selector, msg) {
            var tableEle = $(selector);
            var colspan = tableEle.find('thead > tr > th').length;
            var msgHtml = '<tr><td colspan="' + colspan + '" style="text-align:center;">' + msg + '</td></tr>';
            tableEle.find('tbody').html(msgHtml);
        },
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

submission.loadModules = function () {
    var root = submission;
    var rootModules = root.modules;
};