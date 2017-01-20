var createUserInfoBoxModule = function(root) {
    var userInfoBox = new root.handles.Module(root, 'userInfoBox');
    userInfoBox.config = {
        regRuleMap: {
            'phone': /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        },
        pageSize:5
    };
    userInfoBox.events = {
        ".userInfo&.visitedTimes":{
            mouseenter:function(root,e){
                $("#visitedTimesDialog").addClass("hoverShow");
            },
            mouseleave:function(root,e){
                $("#visitedTimesDialog").removeClass("hoverShow");
            }
        },
        ".userInfo&.dialog-btn-close":{
            click:function(root,e){
                $("#visitedTimesDialog").removeClass("hoverShow");
            }
        },
        ".userInfo&#bindngState":{
            click:function(root,e){
                $("#bindDialog").addClass("show");
            }
        },
        ".userInfo&.noBound":{
            click:function(root,e){
                root.handles.showDialog("#bindDialog");
                $(".phoneNum").html(root.config.mobile)
                var status = $(this).attr("data-status");
                if(status == 2){//已注册未绑定
                    $("#memberName").val($(this).attr("data-name"));
                    $("#bindRegisterBtn").hide();
                }else{//status == 1 未注册
                    $("#bindBtn").hide();
                }
            }
        },
        // ".userInfo&#bindBtn": {
        ".userInfo&.bindBtn":{   
            click: function(root){
                var status = $(this).attr("data-btnStatus");
                userInfoBox.handles.bindRegistration(status);
            }
        },
        ".userInfo&#nameTip":{
            mouseenter:function(){
                var that = this;
                layer.tips('请填写真实姓名', that, {
                    tips: [1],
                    time: 2000
                });
            }
        },
        ".userInfo&#ensurePhoneNum":{
            click:function(){
                var phone = $("#mobilePhone").val();
                var reg = userInfoBox.config.regRuleMap.phone;
                if(phone.match(reg)){
                    $(".mobilePhoneDialog").addClass("show");
                    $(".ensureWrapper .phoneNum").html(phone);
                }else{
                    layer.tips('请输入正确的手机号',"#mobilePhone", {
                        tips: [1],
                        time: 2000
                    });
                }
            }
        },
        ".userInfo&#ensurePhone":{
            click:function(){
                root.config.mobile = $(".ensureWrapper .phoneNum").html();
                $(".inputMobile").removeClass("show");
                $(".hasMobile").removeClass("hide");
                getMemberInfo();
            }
        },
        ".userInfo&#reInput":{
            click:function(){
                $(".mobilePhoneDialog").removeClass("show");
                $("#mobilePhone").val("").focus();
            }
        },
        ".visitedInfo&.remark.notTotal":{
            mouseenter:function(){
                var that = this;
                var totalRemark = $(that).attr("data-totalRemark");
                layer.tips(totalRemark ,that, {
                    offset:'-20px',
                    tips: [2, '#3595CC'],
                    time: 1000
                });
            }
        }
    };
    userInfoBox.handles = {
        /**
            * 判断有没有传入手机号
        */
        jugdeNoMobile:function(){
            // root.config.mobile = "";
            if(root.config.mobile == ""){
                $(".inputMobile").addClass("show");
                $(".hasMobile").addClass("hide");
                return true;
            }else{
                return false;
            }
        },
        /**
            * 获取客户信息
        */
        getMemberInfo:function(){
            var fn_root = userInfoBox.handles.getMemberInfo;
            var jobNumber = root.config.jobNumber;
            var basePath = root.config.basePath;
            var mobile = root.config.mobile;
            var pageSize = userInfoBox.config.pageSize;
            var currentPage = userInfoBox.config.currentPage;
            var xhr = fn_root.xhr;
            if (xhr != null && xhr.readyState !== 4) {
                xhr.abort();
            }
            fn_root = $.ajax({
                url:basePath + "StoreReceptionInfo/GetMemberInfo?Jobnumber="+jobNumber+"&Mobile="+mobile,
                type:"GET",
                dataType:"json",
                timeout:20000,
                beforeSend:function(){

                },
                success:function(data){
                    if(data.status === 1){
                        var result = data.result;
                        $(".userInfoItem .infoCont").each(function(i,item){
                            var key = $(item).attr("data-key");
                            $(item).html(result[key]);
                        });
                        var boundStatusArr = ["未知","未注册","未绑定","我的客户","已绑定"];
                        var boundStatus = parseInt(result["BoundStatus"]);
                        if(boundStatus == 1 || boundStatus == 2){
                            var $noBound = $("<a class = 'noBound' href = 'javascript:void(0);' data-status = " + boundStatus +">未绑定</a>");
                            if(boundStatus == 2){
                                $noBound.attr("data-name",result.MemberName);
                            }
                            $("#boundStatus").empty().append($noBound);
                        }else{
                            $("#boundStatus").html(boundStatusArr[boundStatus]);
                        }
                        if(result.IsVariedMember){
                            $(".variedMember").addClass("show");
                        }
                        //广播
                        var phoneNumber = result.MemberMobile;
                        root.pubsub.fire('phoneNumber.get', null, phoneNumber);
                    }else{

                    }
                }
            })
        },
        /**
            * 获取到访次数表格的数据
            * @param  {number} currentPageIndex
        */
        getCustomerVisitList:function(currentPage){
            var mobile = root.config.mobile;
            if(mobile.length == 0){
                $("#userInfo .section-bd").html('<p class="inputMobile">\
                        <input type="text" placeholder="请输入客户姓名"/>\
                        <input type="button" value="确定"/>\
                </p>');
            }
            var fn_root = userInfoBox.handles.getCustomerVisitList;
            var basePath = root.config.basePath;
            var storeId = root.config.storeId;
            var pageSize = userInfoBox.config.pageSize;
            var xhr = fn_root.xhr;
            if (xhr != null && xhr.readyState !== 4) {
                xhr.abort();
            }
            fn_root = $.ajax({
                url:basePath +"StoreReceptionInfo/SearchCustomerVisitList?StoreId=" + storeId + "&Mobile=" + mobile + "&pageSize=" + pageSize + "&CurrentPage=" + currentPage,
                type:"GET",
                dataType:"json",
                timeout:20000,
                beforeSend:function(){

                },
                success:function(data){
                    if(data.status == 1){
                        var result = data.result;
                        var dataList = result.DataList;
                        var $tbody = $(".visitedInfo tbody");
                        $tbody.empty();
                        dataList.forEach(function(obj){
                            obj.Remark = "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试";
                            var $tr = $("<tr><td>"+ obj.VisitTime +"</td>\
                                <td>" + obj.ReceptionPerson+"</td>\
                                <td class = 'remark' data-totalRemark='" + obj.Remark + "'><span class = 'remarkCont'>" + obj.Remark +"</span></td></tr>");
                            $tbody.append($tr);
                        })
                        var recordCount = result.RecordCount;
                        userInfoBox.handles.initPagerView(pageSize,currentPage,recordCount);
                        $("table .remark").each(function(i,item){
                            var totalRemark = $(item).attr("data-totalRemark");
                            if(totalRemark.length > 35){
                                $(item).addClass("notTotal");
                            }
                        });
                    }else{

                    }
                }
            })
        },
        /**
            * 分页组件初始化及更新
            * @param  {number} size 每页显示记录
            * @param  {number} curr 当前是第几页
            * @param  {number} count 一共有多少条记录
        */
        initPagerView:function(size,curr,count){
            var pageSize = userInfoBox.config.pageSize;
            var pager = new PagerView('visitedPager');
            pager.index = curr;
            pager.size = pageSize;
            pager.itemCount = count;
            pager.onclick = function(index){
                userInfoBox.handles.getCustomerVisitList(index);
            };
            pager.render();
        },
        /**
            * 客户绑定
            * @param  {btnStatus} 按钮状态  1：未注册未绑定  2：已注册未绑定
        */
        bindRegistration:function(btnStatus){
            var fn_root = userInfoBox.handles.bindRegistration;
            var basePath = root.config.basePath;
            var storeReceptionInfoId = root.config.storeReceptionInfoId ;
            var storeId = root.config.storeId;
            var jobNumber = root.config.jobNumber;
            var mobile = root.config.mobile;
            var sex = $(".bindUserSex  input[name='sex']:checked").attr("data-sex");
            var memberName = $("#memberName").val();
            var xhr = fn_root.xhr;
            if (xhr != null && xhr.readyState !== 4) {
                xhr.abort();
            }
            fn_root = $.ajax({
                url:basePath +"StoreReceptionInfo/BindingRegistration",
                type:"POST",
                data:{
                    "StoreReceptionInfoId" : storeReceptionInfoId,
                    "JobNumber" : jobNumber,
                    "Mobile" : mobile,
                    "Sex" : sex,
                    "MemberName" : memberName
                },
                timeout:20000,
                beforeSend:function(){

                },
                success:function(data){
                    if(data.status == 1){
                        var result = data.result;
                        if(btnStatus == 1){//未注册
                            var keyArr = ["MemberId","MemberName", "BoundStatus","RegistTime"];
                            keyArr.forEach(function(key){
                                $(".userInfoUl span[data-key='" + key + "'']").html(result[key]);
                            })
                        }else{
                            $("span[data-key='BoundStatus']").html(result[BoundStatus]);
                        }
                    }else{
                        alert(data.message);
                    }
                }
            })
        }
    };

    userInfoBox.pubsub.on('userInfoBox.init', 'userInfoBox', function() {
        if(!userInfoBox.handles.jugdeNoMobile()){
            userInfoBox.handles.getMemberInfo();
            userInfoBox.handles.getCustomerVisitList(1);
        }

    });

    return userInfoBox;
};