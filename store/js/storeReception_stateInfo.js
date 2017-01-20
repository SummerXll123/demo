var createStateInfoBoxModule = function(root) {
    var stateInfoBox = new root.handles.Module(root, 'stateInfoBox');
    stateInfoBox.config = {
        regRuleMap: {
            'phone': /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        }
    };
    stateInfoBox.events = {
        'body&body': {
            click: function (root, e) {
            }
        },
        ".stateInfo&.receptionEnd":{
            click:function(root,e){
                $("#endRecpetionDialog").addClass("show");
            }
        },
        ".stateInfo&#receptionRemark":{
            keyup:function(){
                var txtLen = $(this).val().length; 
                if( txtLen > 100 ){  
                    $('.canInputNum').text(' 0 ');
                    var content = $('#receptionRemark').val().substring(0,100);
                    $('#receptionRemark').val(content);
                }else{
                    $('.canInputNum').text(100-txtLen);  
                }
            }
        },
        ".stateInfo&#ensureEndBtn":{
            click:function(){
                stateInfoBox.handles.endRecpetion();
            }
        },
        ".stateInfo&#receptionNumTip":{
            mouseenter:function(){
                var that = this;
                layer.tips('客人在店内，则输入实际在店人数', that, {
                    tips: [2],
                    time: 2000
                });
            }
        }
    };
    stateInfoBox.handles = {
        getTimeString:function(date){
            var timeFormat = stateInfoBox.handles.timeFormat;
            var year = date.getFullYear();
            var month = timeFormat(date.getMonth()+1);
            var day = timeFormat(date.getDate());
            var hours = timeFormat(date.getHours());
            var minutes = timeFormat(date.getMinutes());
            var second = timeFormat(date.getSeconds());
            return year + "-" +month +"-" + day + " " + hours +":"+minutes+":"+second;
        },
        timeFormat:function(str){
            return parseInt(str)>9 ? str:"0"+str;
        },
        getStoreReceptionInfo:function(){
            var handles = stateInfoBox.handles;
            var fn_root = handles.getStoreReceptionInfo;
            var jobNumber = root.config.jobNumber;
            var basePath = root.config.basePath;
            var xhr = fn_root.xhr;
            if (xhr != null && xhr.readyState !== 4) {
                xhr.abort();
            }
            fn_root = $.ajax({
                url:basePath + "StoreReceptionInfo/GetStoreReceptionInfo?Jobnumber="+jobNumber,
                type:"GET",
                dataType:"json",
                timeout:20000,
                beforeSend:function(){

                },
                success:function(data){
                    if(data.status === 1){
                        var result = data.result;
                        $("#receptionStore").html(result.StoreName);
                        $("#storeReceptionCount").html(result.VisitPersons + "人");
                        $("#userReceptionCount").html(result.CurrEmployeeRecpPersons+"人");
                        var currentTime = result.CurrentTime;
                        currentTime = currentTime.replace(/-/g,"/");
                        var dateObj = new Date(currentTime);
                        var year,month,day,hour,minute,second;
                        var timeMilliSecond = dateObj.getTime();
                        var timer = setInterval(function(){
                            timeMilliSecond += 1000;
                            dateObj = new Date(timeMilliSecond);
                            var str = handles.getTimeString(dateObj);
                            $(".timeStr").html(str);
                        },1000);
                    }else{

                    }
                }
            })
        },
        endRecpetion:function(){
            var fn_root = stateInfoBox.handles.endRecpetion;
            var xhr = fn_root.xhr;
            if (xhr != null && xhr.readyState !== 4) {
                xhr.abort();
            }
            var isVisited = $("input[name='isVisitStore']:checked").attr("data-visited");
            var id = root.config.storeReceptionInfoId;
            var remark = $("#receptionRemark").val();
            var persons = $("#visitedCount").val();
            var basePath = root.config.basePath;
            if(persons.length == 0){
                layer.tip('请填写接待人数', '#visitedCount', {
                    tips: [2],
                    time: 2000
                });
                return;
            }
            fn_root = $.ajax({
                url:basePath +"StoreReceptionInfo/DoEndReception",
                type:"POST",    
                data:{
                    "isVistStore" : isVisited,
                    "StoreReceptionInfoId" : id,
                    "Remark" : remark,
                    "Persons" : persons,
                },
                timeout:20000,
                beforeSend:function(){

                },
                success:function(data){
                    if(data.IsSuccess){
                        layer.msg("已结束接待！");
                        // window.close();
                    }else{
                        layer.msg(data.Message);
                    }
                }
            })
        }
    };
    //在这里放模块初始化时要做的操作
    stateInfoBox.pubsub.on('stateInfoBox.init', 'stateInfoBox', function() {
        var handles = stateInfoBox.handles;
        handles.getStoreReceptionInfo(root);
    });

    return stateInfoBox;	
};