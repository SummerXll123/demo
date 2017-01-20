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
            },//jq  会员分布tab切换
            "body&#vipWrapper li":
            {
                click: function () {
                   /* $(this).addClass("on");
                    $(this).siblings("li").removeClass("on");
                    var index = $(this).index();

/!*                    $(this).parents("#vipWrapper").next(".vipDrop").children(".vipDown").eq(index).siblings(".vipDown").css('display','none');
                    $(this).parents("#vipWrapper").next(".vipDrop").children(".vipDown").eq(index).css('display','block');*!/

                    $(this).parents("#vipWrapper").next(".vipDrop").children(".vipDown").eq(index).siblings(".vipDown").css('display','none');
                    $(this).parents("#vipWrapper").next(".vipDrop").children(".vipDown").eq(index).css('display','block');*/
                }
            },
            "body&#part-tabBtn button":
            {
                click: function () {

                  /*  $(this).addClass("curr");
                    $(this).siblings("button").removeClass("curr");

                    $(this).parents(".vipTop").next(".tab-Vip").children(".tab-list").eq($(this).index()).siblings(".tab-list").css("display","none");
                    $(this).parents(".vipTop").next(".tab-Vip").children(".tab-list").eq($(this).index()).css("display","block");*/
                }
            },
            "body&#submit":
            {
                click:function(){
                    vipMember.handles.verify("name");
                    vipMember.handles.verify("email");
                    vipMember.handles.verify("tel");
                }
            },
            "body&.form-input":
            {
                click:function(){
                    vipMember.handles.selectList("selectWrap","selectUl");
                    vipMember.handles.selectList("areaWrap","areaUl");
                    vipMember.handles.selectList("bigWrap","bigUl");
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
            root.handles.getData();
            root.handles.echartData();
            root.handles.echartAge();
            root.handles.memberProvice();
            root.handles.IDonblur("name");
            root.handles.IDonblur("email");
            root.handles.IDonblur("tel");
            root.handles.tabSwitch("vipUl","vipDrop");
            root.handles.tabSwitch("part-tabBtnUl","tab-Vip");

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

                /*//var pagerCount=document.getElementById('pagerCount');
                var root = vipMember;
                var that = this;*/

            },
            tab:function(id){
                $(this).addClass("curr");
                $(this).siblings("button").removeClass("curr");

                $(this).next(".tab-Vip").children(".tab-list").eq($(this).index()).siblings(".tab-list").css("display","none");
                $(this).next(".tab-Vip").children(".tab-list").eq($(this).index()).css("display","block");
            },
            getData:function(){
                $.ajax({
                    type:"get",
                    url:"/store/json/member.json",
                    dataType:"json",
                    timeOut:20000,
                    beforeSend:function(){

                    },
                    success:function(data){
                        console.log(data)
                      if(data.State==1){
                            //百旅会会员信息 js
                          var vipTab=document.getElementById("vipTab");
                          var li=vipTab.getElementsByTagName("li");
                          for(var i=0;i<li.length;i++){
                              var attr=li[i].getAttribute("data-type");//获取li属性
                              var children=li[i].children;//获取li下面的所有元素
                              children[1].innerHTML=data.Data[attr]//data数据赋给li下面要更改的参数
                          }
                          //百旅会会员信息  jq
                          //$(".todateAdd").html(data.Data.AddMember)

                      }
                    },
                    complete:function(xhr,status){
                        if(status=="timeOut"){
                            alert("异步超时")
                        }
                    },
                    error:function(err){
                        //alert("错误")
                    }
                })
            },      //百旅会年龄分布
            echartAge:function(){
                var myChart = echarts.init(document.getElementById('mainAge'));
                $.get('/store/json/member.json').done(function (data) {
                    myChart.setOption({
                      /*  title: {
                            text: '异步数据加载示例'
                        },*/
                        tooltip: {},
                        legend: {
                            data:['年龄']
                        },
                        xAxis: {
                            data: data.MemberAgeDistributionRt.MemberAgeDistriName
                        },
                        yAxis: {},
                        series: [{
                            name: '年龄',
                            type: 'bar',
                            data: data.MemberAgeDistributionRt.MemberAgeDistriValue,
                            itemStyle: {
                                normal: {
                                    //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#4eb900','#4eb900','#4eb900','#4eb900','#4eb900',
                                            '#4eb900','#4eb900','#4eb900','#4eb900','#4eb900',
                                            '#4eb900','#4eb900','#4eb900','#4eb900','#4eb900'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                }
                            },//设置柱的宽度，要是数据太少，柱子太宽不美观~
                            barWidth:70,
                        }],
                    });
                });
            },
            //百旅会1月目标完成率TOP10区域
            echartData:function(data){
                 var myChart = echarts.init(document.getElementById('vipTop'));
                $.get('/store/json/member.json').done(function (data) {
                    // 指定图表的配置项和数据
                    var option = {

                        title: {
                            text: '百旅会1月目标完成率TOP10区域'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            //data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: data.NewMemberTop10.NewMemberCityName
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                //name:'邮件营销',
                                type:'line',
                                stack: '总量',
                                data:data.NewMemberTop10.NewMemberCityValue
                            }
                        ]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                });
            },
            //百旅会会员分布
            memberProvice:function(data){
                var myChart = echarts.init(document.getElementById('memberProvice'));

                $.get('/store/json/china.json').done(function () {
                    // 指定图表的配置项和数据
                    function randomData() {
                        return Math.round(Math.random()*1000);
                    }
                    var option = {
                        title: {
                            text: 'iphone销量',
                            subtext: '纯属虚构',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: ['iphone3', 'iphone4', 'iphone5']
                        },//dataRange此处可以改变地图的背景颜色
                        dataRange: {
                            x: '- 1000px',
                            //图例横轴位置
                            y: '- 1000px',
                            //图例纵轴位置
                            splitList: [
                                {
                                    start: 1,
                                    end: 1,
                                    label: '北京',
                                    color: 'red'
                                },
                                {
                                    start: 2,
                                    end: 2,
                                    label: '天津',
                                    color: 'yellow'
                                },
                                {
                                    start: 3,
                                    end: 3,
                                    label: '西藏',
                                    color: 'red'
                                }
                            ]//各省地图颜色；start：值域开始值；end：值域结束值；label：图例名称；color：自定义颜色值；
                        },
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            x: 'right',
                            y: 'center',
                            feature: {
                                mark: {
                                    show: true
                                },
                                dataView: {
                                    show: true,
                                    readOnly: false
                                },
                                restore: {
                                    show: true
                                },
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        roamController: {
                            show: true,
                            x: 'right',
                            mapTypeControl: {
                                'china': true
                            }
                        },//此处可以改变地图的颜色series
                        series: [{
                            name: 'iphone5',
                            type: 'map',
                            mapType: 'china',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    },
                                    borderWidth: 1,
                                    //省份的边框宽度
                                    borderColor: '#f60',
                                    //省份的边框颜色
                                    color: '#ece2df'//地图背景颜色
                                    //areaStyle:{color:‘#f60‘}//设置地图颜色
                                },

                                emphasis: {
                                    label: {
                                        show: true
                                    }
                                }
                            },//data的value要和dataRange的值相对应
                            data: [{
                                name: '北京',
                                selected: false,
                                value: 1
                            },
                                {
                                    name: '天津',
                                    selected: false,
                                    value: 2
                                },
                                {
                                    name: '西藏',
                                    selected: false,
                                    value: 3
                                },
                                {
                                    name: '广东',
                                    value: Math.round(Math.random() * 1000)
                                },
                                {
                                    name: '台湾',
                                    value: Math.round(Math.random() * 1000)
                                },
                                {
                                    name: '香港',
                                    value: Math.round(Math.random() * 1000)
                                },
                                {
                                    name: '澳门',
                                    value: Math.round(Math.random() * 1000)
                                }]
                        }],//各省地图颜色数据依赖value
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                });

            },
            verify:function(ID){
                var nameID=document.getElementById(ID);
                var value=nameID.value;
                var type=nameID.getAttribute("data-type")

                if(value==""){
                    var nameS=nameID.nextSibling.nextSibling;
                    nameS.style.display="inline-block";
                    nameS.innerHTML="不能为空"
                    return false;
                }
            },//表单验证
            IDonblur:function(ID){
                var nameID=document.getElementById(ID);
                var type=nameID.getAttribute("data-type")
                switch (type)
                {
                    case "name":
                        nameID.onblur=function(){
                            //姓名验证
                            var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
                            var value=nameID.value;
                            if (!reg.test(value)) {
                                var nameS = nameID.nextSibling.nextSibling;
                                nameS.style.display = "inline-block";
                                nameS.innerHTML = "输入中英文及数字"
                            }else {
                                var nameS=nameID.nextSibling.nextSibling;
                                nameS.style.display="inline-block";
                                nameS.innerHTML=""
                            }
                        }
                        break;
                    case "email":

                        nameID.onblur=function(){
                            //邮箱验证
                            var regEmail=/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                            var value=nameID.value;

                            if (!regEmail.test(value)) {
                                var nameS = nameID.nextSibling.nextSibling;
                                nameS.style.display = "inline-block";
                                nameS.innerHTML = "输入正确邮箱"
                            }else {
                                var nameS=nameID.nextSibling.nextSibling;
                                nameS.style.display="inline-block";
                                nameS.innerHTML=""
                            }
                        }
                        break;
                    case "tel":
                        nameID.onblur=function(){
                            //手机验证
                            var regTel=/^1[34578]\d{9}$/;
                            var value=nameID.value;
                            if (!regTel.test(value)) {
                                var nameS = nameID.nextSibling.nextSibling;
                                nameS.style.display = "inline-block";
                                nameS.innerHTML = "输入正确手机号"
                            }else {
                                var nameS=nameID.nextSibling.nextSibling;
                                nameS.style.display="inline-block";
                                nameS.innerHTML=""
                            }
                        }
                        break;
                }

                /*var nameID=document.getElementById(ID);
                var value=nameID.value;
                var type=nameID.getAttribute("data-type")



                if(type=="name") {
                    var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
                    nameID.onblur=function(){
                        //数字、字母（不分大小写）/汉字/下划线
                        var value=nameID.value;
                        if (!reg.test(value)) {
                            var nameS = nameID.nextSibling.nextSibling;
                            nameS.style.display = "inline-block";
                            nameS.innerHTML = "输入中英文及数字"
                        }else {
                            var nameS=nameID.nextSibling.nextSibling;
                            nameS.style.display="inline-block";
                            nameS.innerHTML=""
                        }
                    }
                }
                else if(type=="email"){
                    //邮箱验证
                    var reg=/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    nameID.onblur=function(){
                        var value=nameID.value;
                        if (!reg.test(value)) {
                            var nameS = nameID.nextSibling.nextSibling;
                            nameS.style.display = "inline-block";
                            nameS.innerHTML = "输入正确邮箱"
                        }else {
                            var nameS=nameID.nextSibling.nextSibling;
                            nameS.style.display="inline-block";
                            nameS.innerHTML=""
                        }
                    }
                } else {
                    //手机验证
                    var reg=/^1[34578]\d{9}$/;
                    nameID.onblur=function(){
                        var value=nameID.value;
                        if (!reg.test(value)) {
                            var nameS = nameID.nextSibling.nextSibling;
                            nameS.style.display = "inline-block";
                            nameS.innerHTML = "输入正确手机号"
                        }else {
                            var nameS=nameID.nextSibling.nextSibling;
                            nameS.style.display="inline-block";
                            nameS.innerHTML=""
                        }
                    }
                }*/
                //return true;
            },
            //tab切换
            tabSwitch:function(id,div){
                var liS=document.getElementById(id).getElementsByTagName("li");
                var divS=document.getElementById(div).children;

                for(var i=0;i<liS.length;i++){
                    liS[i].value=i;
                    liS[i].onclick=function(){
                        for(var j=0;j<liS.length;j++){
                            liS[j].className="";
                            divS[liS[j].value].style.display="none"
                        }
                        this.className="on";
                        divS[this.value].style.display="block"
                    }
                }
            },
            //select下拉框
            selectList:function(wrap,ul){
                var id=document.getElementById(wrap);
                var ul=document.getElementById(ul);
                var liS=ul.getElementsByTagName("li")


                id.onclick=function(){
                    if(ul.style.display="none"){
                        ul.style.display="block";
                        for(var i=0;i<liS.length;i++){
                            liS[i].value=i;
                            liS[i].onclick=function(){
                                console.log(this)
                                id.innerHTML=this.innerHTML;
                                ul.style.display="none"
                            }
                        }
                    }
                }
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

