var createOrderQueryBoxModule = function(root) {
    var orderQueryBox = new root.handles.Module(root, 'orderQueryBox');

    orderQueryBox.config = {
        regRuleMap: {
            'phone': /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        },
        start: {
            elem: '#timeStart',
            // min: laydate.now(), //设定最小日期为当前日期
            min: '2016-01-01',
            max: '2099-12-31', //最大日期 
            istime: false, //是否开启时间选择
            isclear: false, //是否显示清空
            istoday: false, //是否显示今天
            issure: false,  //是否显示确认
            choose: function(datas){
                 orderQueryBox.config.end.min = datas; //开始日选好后，重置结束日的最小日期
                 orderQueryBox.config.end.start = datas //将结束日的初始值设定为开始日
            }
        },
        end: {
            elem: '#timeStop',
            // min: laydate.now(),
            min: '2016-01-01',
            max: '2099-12-31',
            istime: false,
            isclear: false, 
            istoday: false,  
            issure: false,   
            choose: function(datas){
                orderQueryBox.config.start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        },
        pagerInstance: null

    };
    orderQueryBox.events = {
        '#orderQuery&#timeStart': {
            focus: function(root, e) {
                laydate(orderQueryBox.config.start);
            }
        },
        '#orderQuery&#timeStop': {
            focus: function(root, e) {
                laydate(orderQueryBox.config.end);
            }
        },
        //点击查询按钮
        '#orderQuery&.queryBtn': {
            click: function(root, e) {
                orderQueryBox.handles.getOrderTableData(1);
            }  
        },
        '#orderQuery&.orderdetail': {
            click: function(root, e) {
                var projectid=$(this).parent('td').siblings('td[projectid]').attr('projectid');
                var ordernumber=$(this).parent('td').siblings('td[ordernumber]').attr('ordernumber');
                var memberid=$(this).parent('td').siblings('td[searchmemberid]').attr('searchmemberid');
                var mobile=$(this).parent('td').siblings('td[reservephonenum]').attr('reservephonenum');
                // var mobile=$('.queryInput').val();
                var ordercreatedate=$(this).parent('td').siblings('td[ordercreatetime]').attr('ordercreatetime');
                var backstageurl=$(this).parent('td').siblings('td[backstageurl]').attr('backstageurl');

                $.ajax({
                    type:'post',
                    url:'http://10.101.24.9/Sell/Statistics/StoreReceptionInfo/AddStoreReceptionProcessOrder',
                    data:'StoreReceptionInfoId='+798+
                         // '&ProjectId='+$('#orderProjectDropDown').find('.dropDown-btn').attr('data-value') +
                         '&ProjectId='+ projectid +
                         '&OrderNumber='+ ordernumber +
                         '&MemberId='+memberid+
                         // '&Mobile='+"18651111811"+
                         '&Mobile='+mobile+
                         '&OrderCreateDate='+ordercreatedate,
                    success: function() {
                         window.location.href=backstageurl;
                    }
                })
            }
        },
        '#orderQuery&.ordermoney': {
            click: function(root, e) {
                window.location.href=$(this).attr('value');
            }
        }  
    };
    orderQueryBox.handles = {
        /**
         * 获取订单表格数据
         * @param  {number} pageIndex 当前页码
         */
        getOrderTableData: function(pageIndex) {
            $.ajax({
                type: 'post',
                url: 'http://10.101.24.9/Sell/Statistics/StoreReceptionInfo/RegionOrderDataAdapter', 
                // url: 'http://crm.t.17usoft.com/Sell/Statistics/StoreReceptionInfo/RegionOrderDataAdapter',
                data:'SearchProjectId=' + $('#orderProjectDropDown').find('.dropDown-btn').attr('data-value') +
                     '&SearchState=' + $('#orderStateDropDown').find('.dropDown-btn').attr('data-value') +
                     '&SearchStartDate=' + $('#timeStart').val() +
                     '&SearchEndDate='+ $('#timeStop').val() +
                     '&OrderSearchContent=' + $('#orderSearchCont').val() +
                     '&pageSize=' + 2 +
                     '&CurrentPage=' + pageIndex,
                beforeSend: function() {
                    $('.queryBtn').prop('disabled', true);
                    $('.tableQuery').empty();
                    var tableData='';
                    tableData += '<thead>' + 
                                '<tr>' + 
                                    '<td class="col1">订单类型</td>' + 
                                    '<td class="col2">订单客户号</td>' + 
                                    '<td class="col3">预订人号码</td>' +
                                    '<td class="col4">线路名称</td>' +
                                    '<td class="col5">下单日期</td>' + 
                                    '<td class="col6">操作</td>' +
                                '</tr>' + 
                            '</thead>' +
                            '<tbody><tr><td colspan="6" style="text-align: center;">正在加载中...</td></tr></tbody>';
                    $('.tableQuery').append(tableData);
                },
                success:function(data) {
                    orderQueryBox.handles.setOrderTableData(data);
                },
                complete: function() {
                    $('.queryBtn').prop('disabled', false);
                },
                error: function(data) {
                    $('.tableQuery').find('tbody').html('<tr><td colspan="6" style="text-align: center;">出错了，重新查询试试</td></tr>');
                }
            })
        },
        setOrderTableData: function(data) {
            orderQueryBox.config.pagerInstance.index = data.result.PageIndex;
            orderQueryBox.config.pagerInstance.itemCount = data.result.RecordCount;
            orderQueryBox.config.pagerInstance.render();

            if(data.result.DataList){
                var resultArr=data.result.DataList;
                var tbodyData = '';
                $.each(resultArr,function(index,value){
                    tbodyData+='' +
                            '<tr>' +
                            '<td projectid="'+value["ProjectId"]+'" backstageurl="'+value["BackstageUrl"]+'" searchmemberid="'+value["SearchMemberId"]+'">'+value["ProjectName"]+'<br/>'+value["OrderType"]+'</td>' +
                            '<td orderstatus="'+value["OrderStatus"]+'" ordernumber="'+value["OrderShortNumber"]+'">'+value["OrderStatus"]+'<br/>'+value["OrderShortNumber"]+'</td>' +
                            '<td reservephonenum="'+value["ReservePhoneNum"]+'">'+value["ReservePhoneNum"]+'</td>' +
                            '<td><a class="aurl" href="'+value["ReceptionUrl"]+'">'+value["OrderTitle"]+'</a></td>' +
                            '<td ordercreatetime="'+value["OrderCreateTime"]+'">'+value["OrderCreateTime"]+'</td>' +
                            '<td><a href="javascript:void(0)" class="orderdetail">详情</a><a href="javascript:;" class="ordermoney money" value="http://finance.17usoft.com/financecommon/account/storelogon">收款</a></td>' +
                            '</tr>';
                })
                $('.tableQuery').find('tbody').html(tbodyData);

                if($('.tableQuery td[orderstatus = "待支付"]') || $('.tableQuery td[orderstatus = "支付中"]')) {
                     $('.tableQuery td[orderstatus = "待支付"]').siblings('td').find('.ordermoney').removeClass('money');
                     $('.tableQuery td[orderstatus = "支付中"]').siblings('td').find('.ordermoney').removeClass('money');
                }           
            }  
            if(data.result.DataList==null) {
                $('.tableQuery').find('tbody').html('<tr><td colspan="6" style="text-align: center;">没有查到任何数据</td></tr>');
            }
        },
        getOrderStateDropDownList: function(projectId) {
            var xhr = orderQueryBox.handles.getOrderStateDropDownList.xhr;
            if (xhr != null && xhr.readyState !== 4) {
                xhr.abort();
            }
            //订单状态请求
            orderQueryBox.handles.getOrderStateDropDownList.xhr = $.ajax({
                type:'post',
                url:'http://10.101.24.9/Sell/Statistics/StoreReceptionInfo/ProjectNameWithState',
                data:'ProjectId=' + projectId,
                success:function(data) {
                    var lis = '';
                    var $list = $('#orderStateDropDown').find('.dropDown-list');
                    $list.empty();
                    var arr = data.result.ProjectStateItems;
                    arr.forEach(function(item, index) {
                        lis += "<li data-value=" + item["StateId"] + ">"+ item["StateName"] + "</li>";
                    }) 
                    $list.append(lis); 
                }
            })
        },
        /**
         * 格式化日期
         * @param {object} 日期对象
         * @return  {string} YYYY-MM-DD
         */
        formateDate: function(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            return y + '-' + m + '-' + d;
        }
    };

    //在这里放模块初始化时要做的操作
    orderQueryBox.pubsub.on('orderQueryBox.init', 'orderQueryBox', function() {
        //获取订单状态下拉列表
        orderQueryBox.handles.getOrderStateDropDownList(0);

        //初始化分页实例
        orderQueryBox.config.pagerInstance = new PagerView('pager');
        orderQueryBox.config.pagerInstance.index = 1; // 当前是第1页
        orderQueryBox.config.pagerInstance.size = 2; // 每页显示2条记录
        orderQueryBox.config.pagerInstance.itemCount = 0; // 一共有100条记录
        
        orderQueryBox.config.pagerInstance.onclick = function(index){
            orderQueryBox.handles.getOrderTableData(index);
        };

        //设置日期控件的皮肤
        laydate.skin('danlan');

        //设置时间范围默认值为当前日期到3个月后日期
        var currDate = new Date();
        var currDateStr = orderQueryBox.handles.formateDate(currDate);
        var dateAfter3month = new Date(currDate.setMonth(currDate.getMonth() + 3));
        var dateAfter3monthStr = orderQueryBox.handles.formateDate(dateAfter3month);
        $('#timeStart').val(currDateStr);
        $('#timeStop').val(dateAfter3monthStr);
    });
    //订阅dropdownList Change事件
    root.pubsub.on('dropDown.select', 'orderQueryBox', function(value, selectedItem) {
        if ($(selectedItem).parents('#orderProjectDropDown').length > 0) {
            orderQueryBox.handles.getOrderStateDropDownList(value);  
        }  
    });
    root.pubsub.on('phoneNumber.get', 'orderQueryBox', function(phoneNumber) {
        $('.orderTxt').val(phoneNumber);
        $('.queryInput').val(phoneNumber);
    })

    return orderQueryBox;
};