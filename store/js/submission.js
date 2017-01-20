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
    }
,
    "#tableCount&.eui-btn-sort":
    {
        change: function (root, event, state) {
            /* $(this).parent().siblings().find(".eui-btn-sort").removeClass("eui-btn-sort-active").removeClass("eui-btn-sort-asce").removeClass("eui-btn-sort-desc");
             var columNname = $(this).attr("data-columnname");
             if (state == "asce") {
             //alert("ff")
             root.config.sortPara.ColumnNameOfSort = columNname;
             root.config.sortPara.IsAsc = 1;
             } else {
             root.config.sortPara.ColumnNameOfSort = columNname;
             root.config.sortPara.IsAsc = 0;
             }*/

            var root=submission;
            var columNname = $(this).attr("data-columnname");
            root.config.sortPara.columName=columNname;

            if ($(this).hasClass('eui-btn-sort-desc')) {
                root.config.sortPara.IsAsc = 0
            } else if ($(this).hasClass('eui-btn-sort-asce')) {
                root.config.sortPara.IsAsc = 1;
            }
            root.handles.getTableDataSort();
        }
    }
,
    "body&.eui-select":
    {       //下拉框
        click: function () {
            //var dropDown=document.getElementsByClassName("eui-select-dropDown");
            var drop = document.getElementById("droDown");
            var selectWrapper = document.getElementById("selectWrapper");
            var li = drop.getElementsByTagName("li");
            if (drop.style.display = "none") {
                drop.style.display = "block"
            }
            for (i = 0; i < li.length; i++) {
             li[i].onclick = function () {
                 selectWrapper.innerHTML = this.innerHTML;
                 drop.style.display = "none"
             //获取对应的value
                 liNum=this.getAttribute("data-value")
                 var ID=document.getElementById("meterialUl");
                 var li=ID.getElementsByTagName("li");

                 for (var i=0;i<li.length;i++){
                     var liattr=li[i].getAttribute("data-num");

                     if (liattr != liNum){
                         li[i].style.display="none";
                     }
                     if (liattr == liNum || liNum==1) {
                         li[i].style.display = "block"
                     }
                 }
             }
             }
          /*  var root = submission;
            root.handles.selectData("droDown")*/
        }
    }
,//表格编辑
    "body&.btn-update":
    {
        click:function () {
            //先获取原先的表格数据
            var root = submission;
            console.log(this)

            if (this.innerHTML=='编辑'){
                root.handles.update(this,1)
            }
            else {
                  root.handles.update_success(this, 1)

            }
            // root.handles.updateSuccess(this,1)


        }
    }
,
    //表格添加
    "body&.btn-add"
:
    {
        click:function () {
            var drop = document.getElementById("droDown");
            var selectWrapper = document.getElementById("selectWrapper");
            var tbody = document.getElementById("readTbody");
            var trLast = tbody.lastChild;
            var aaa = 456
            // var newtr="";
            var newtr = '<tr> <td>' + aaa + '</td> <td></td> <td></td> <td></td> <td></td>' +
                '<td><button type="button" class="eui-btn eui-btn-primary btn-update">编辑</button></td>' +
                '<td><button type="button" class="eui-btn eui-btn-primary btn-save">保存</button></td>' +
                '<td><button type="button" class="eui-btn eui-btn-primary btn-del">删除</button></td>' +
                '</tr>'
            console.log(newtr)

            var oldHtml = tbody.innerHTML;
            tbody.innerHTML = oldHtml + newtr
        }
    }
,//表格删除
    "body&.btn-del":
    {
        click:function () {
                var delBtn = document.getElementsByClassName("btn-del");
                var tbody = document.getElementById("readTbody");
                for (var i = 0; i < delBtn.length; i++) {
                    delBtn[i].onclick = function () {
                        var tr = this.parentNode.parentNode;
                        tbody.removeChild(tr)
                    }
                }
            // alert("4444")
        }
    }
,
    //表单提交
    "body&#submitBtn"
:
    {
        click: function () {
            var userName = document.getElementById("userName")
            var root = submission;
            root.handles.checkUser("userName");
        }
    }
,
    "body&#inputBtn"
:
    {
        click: function () {
            var nameID = document.getElementById("name")
            var emailID = document.getElementById("email3")
            var nameValue = nameID.value;
            var emailValue = emailID.value;
            var root = submission;
            // 姓名验证
            root.handles.verify(nameID, 'name');
            // 邮箱验证
            root.handles.verify(emailID, 'email3');
        }
    },
    "body&#submit":
    {
        click:function(){
            alert("ss")
        }
    }

}
,

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
    var root = submission;
    root._delegate(root.events);
    root.handles.initPlugins();
    root.handles.initEsort();
    root.handles.initPagerView();
    root.handles.getTableDataSort();
    // root.handles.checkUser();
    // root.handles.verify();
}
,
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
        var root = submission;
        var that = this;
        that.initPagerView("pagerCount");
        that.initEsort();
        //var data=root.config.sortPara;
    }
,
    initEsort: function () {
        $("#tableCount .eui-btn-sort").eSort();

    }
,
    //分页初始化
    initPagerView: function (id) {
        var pager = new PagerView('pagerCount');  //优化
        pager.index = 3; // 当前是第3页
        pager.size = 16; // 每页显示16条记录
        pager.itemCount = 100; // 一共有100条记录

        var root = submission;
        pager.onclick = function (index) {
            root.config.sortPara.CurrentPage = index;
            root.handles.getTableDataSort();

        };

        pager.render();

    }
,
    // 获取素材表格数据
    getTableDataSort: function (index) {
        var root = submission;
        var source = root.config.source;
        var sortPara = root.config.sortPara;
        //var data=sortPara;
        var tableEle = $('#tableCount');
        $.ajax({
            type: "get",
            url: "/test.json",
            // url: "http://192.168.0.103:1234/test.json",
            dataType: "json",
            data: {sortPara:sortPara},
            timeout: 20000,
            beforeSend: function () {
                $("#tableCount tbody").empty();
            },
            success: function (data) {
                if (data) {
                    var pager = new PagerView('pagerCount');
                    pager.index = data.Data.PageIndex;
                    pager.size = data.Data.PageSize;
                    pager.itemCount = data.Data.PageCount;
                    pager.render();

                    var tableData = data.Data.DataList;
                    var tbodyHtml = "";
                    if (tableData && tableData.length !== 0) {
                        tableData.forEach(function (item, index) {
                            tbodyHtml += '<tr>' +
                                '<td>' + item.Time + '</td>' +
                                '<td class="totalPart">' + item.Part + '</td>' +
                                '<td>' + item.ChargePerson + '</td>' +
                                '<td>' + item.TitleNum + '</td>' +
                                '<td>' + item.ReadNum + '</td>' +
                                '<td>' + source[item.Source - 1] + '</td>' +
                                '<td>' + '<a href="http://tcservice.17usoft.com/travel/vipclub/BLH_Appointed/Detial?" class="eui-btn eui-btn-edit" target="_blank">详情</a>' + '</td>'
                            '</tr>';
                        })
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
        })
    }
,
    showMsgInTable: function (selector, msg) {
        var tableEle = $(selector);
        var colspan = tableEle.find('thead > tr > th').length;
        var msgHtml = '<tr><td colspan="' + colspan + '" style="text-align:center;">' + msg + '</td></tr>';
        tableEle.find('tbody').html(msgHtml);
    }
,
    //用户名验证

    /*checkUser: function (ID) {
     var nameID = document.getElementById("userName")
     var value = nameID.value;

     var type = nameID.getAttribute("data-name");
     // alert(type)
     if (value == '') {
     var nameS = nameID.nextSibling;
     nameS.innerHTML = "不能为空"
     return false;
     }

     if (type=='user_name'){

     }

     var regName=/^\w{4,16}$/;
     if (user.value==""){
     // var tip=user.nextSibling;
     tip.innerHTML="不能为空"
     }
     },*/
    verify: function (dom, ID) {
        var nameID = document.getElementById(ID)
        var value = nameID.value

        var type = dom.getAttribute("data-leixing");
        // alert(type)
        if (value == '') {
            var nameS = dom.nextSibling;
            // alert(nameS)
            nameS.style.display = "inline-block";
            nameS.innerHTML = "不能为空"
            return false;
        }
        if (type == '姓名') {
            var reg = /[\u4e00-\u9fa5]/;

        } else if (type == '邮箱') {
            var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        }
        if (!reg.test(value)) {
            var nameS = dom.nextSibling;
            nameS.innerHTML = "不正确"
            return false;
        } else {
            var nameS = dom.nextSibling;
            nameS.innerHTML = ""
        }
        return true;
    }
,
    //表格编辑，获取之前数据
    update:function (obj, x) {
        var table = document.getElementById("readTable");
        // var rows =  table.rows[x].cells[i].innerHTML;
        // var cells = rows.cells[i];//获取单元格,cells 集合返回表格中所有单元格的一个数组。
        for(var i=0;i<table.rows[x].cells.length-3;i++){
            var text = table.rows[x].cells[i].innerHTML;
            table.rows[x].cells[i].innerHTML = '<input class="input" name="input'+ x + '" type="text" value=""/>';
            var input = document.getElementsByName("input" + x);
            input[i].value = text;
            input[0].focus();
            input[0].select();
        }
        obj.innerHTML = "确定";
    },
    //表格编辑，获取现在数据
     update_success:function(obj,x){
         var arr = [];
         var table = document.getElementById("readTable");
         var input = document.getElementsByName("input" + x);
         for(var i=0;i<table.rows[x].cells.length-3;i++){
             var text = input[i].value;
             arr.push(text);
         }
         //把值赋值给表格，不能在取值的时候给，会打乱input的个数
         for(var j=0;j<arr.length;j++){
             table.rows[x].cells[j].innerHTML = arr[j];
         }
         //回到原来状态
         obj.innerHTML = "编辑";
         obj.onclick = function onclick(event) {
             update(this,x)
         };
         alert(arr + ",传到后端操作成功，刷新页面");
}
,
    Module: function (root, name) {
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
,
  /*  selectData:function (cc) {

        var selectWrap = document.getElementById("selectWrapper");
        var droDown = document.getElementById("droDown");
        var li = droDown.getElementsByTagName("li");
        selectWrap.onclick = function () {
            if (droDown.style.display = "none") {
                droDown.style.display = "block";

            }
        }
        for (i = 0; i < li.length; i++) {
            li[i].onclick = function () {
                selectWrap.value = this.innerHTML;
                droDown.style.display = "none";
            }
        }


  /!*      var li = document.getElementById(cc).getElementsByClassName("li")
        var lidata = li.getAttribute("data-value");
        lidata.onclick = function () {
            selectWrapper.innerHTML = this.innerHTML;
            drop.style.display = "none"
        }*!/
    }*/
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
}
,
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
}
;

submission.loadModules = function () {
    var root = submission;
    var rootModules = root.modules;

};

