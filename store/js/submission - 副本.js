/**
 * @展示模块
 * @author
 */


createarReader = function (root) {
    root.modules.marketReader = new root.Module(root, 'marketReader');

    var moduleRoot = root.modules.marketReader;

    //不允许隐形为config里添加属性
    //所有用到的config属性必须在该对象里面先进行声明
    moduleRoot.config = {
                 //素材分页
        pager: { }


    };

    //dom事件必须委托到该section下
    //一般情况下不允许委托到其他地方，尤其是类名下面
    moduleRoot.events = {


        "body&#search":{
            click:function(){
                alert("ff")
            }
        }

    };
    moduleRoot.handles = {
        //排序
        initPlugins: function () {
            var that = this;
            that.initPagerView("pagerCount");
            that.initESort();
            console.log("dd")
            console.log("dd");

        },
        //素材分页初始化
        initPagerView: function (id) {
            moduleRoot.config.pager = new PagerView(id);
            var pager = moduleRoot.config.pager;
            pager.index = 1;
            pager.size = 10;
            pager.itemcount = 0;
            pager.onclick = function (index) {
                moduleRoot.config.sortPara.CurrentPage = index;
                moduleRoot.handles.getTableDataSort();
            };
            pager.render();


        },
        // 获取素材表格数据
        getTableDataSort: function (index) {
            var sourceArr = moduleRoot.config.sourceArr;
            var materialTit = moduleRoot.config.materialTit;
            var rootPara = root.config.params;
            var sortPara = moduleRoot.config.sortPara;
            var data = $.extend({}, rootPara, sortPara);
            $.ajax({
                type: "post",
                url: "/sell/statistics/MarketingMaterial/GetSearchDetail",
                data: data,
                dataType: "json",
                timeout: 20000,
                beforeSend: function () {
                    $('#tableCount tbody').empty();
                },
                success: function (data) {
                    if (data) {
                        moduleRoot.config.pager.itemCount = data.Data.RecordCount;
                        moduleRoot.config.pager.render();
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
                            moduleRoot.handles.showMsgInTable("#tableCount", "暂无数据");
                        }
                    } else {
                        moduleRoot.handles.showMsgInTable("#tableCount", "加载失败，重新刷新试试");
                    }
                },
                complete: function (xhr, status) {
                    if (status == "timeout") {
                        alert("异步超时！");
                    }
                },
                error: function (err) {
                    //alert(err);
                    //moduleRoot.handles.showMsgInTable("#tableCount", "加载出现问题");
                }
            });
        },
        showMsgInTable: function (selector, msg) {
            var tableEle = $(selector);
            var colspan = tableEle.find('thead > tr > th').length;
            //var msgHtml = '<tr><td style="text-align: center;" colspan="${5}">${msg}</td></tr>';
            var msgHtml = '<tr><td colspan="' + colspan + '" style="text-align:center;">' + msg + '</td></tr>';
            tableEle.find('tbody').html(msgHtml);
        },
    };




    //在这里放模块初始化时要做的操作
    moduleRoot.pubsub.on('marketReader.init', 'marketReader', function () {
        moduleRoot.handles.initPlugins();
        moduleRoot.handles.getTableDataSort();
        alert("ff")

    });
};
createarReader.moduleRoot=function(){
    root.modules.marketReader = new root.Module(root, 'marketReader');

    var moduleRoot = root.modules.marketReader;

    moduleRoot.events=createarReader(root)

}