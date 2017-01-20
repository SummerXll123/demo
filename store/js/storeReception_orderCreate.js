var createOrderCreateBoxModule = function(root) {
    var orderCreateBox = new root.handles.Module(root, 'orderCreateBox');

    orderCreateBox.config = {
        regExp: /^[1][358][0-9]{9}$/
    };
    orderCreateBox.events = {
        '#orderCreate&.orderUl li': {
            click:function () {
                $(this).addClass('liHover').siblings('li').removeClass('liHover');
            }
        },
        '#orderCreate&.orderBtn': { 
            click: function(root, e){
                orderCreateBox.handles.orderTest();
            }
            
        }
    };
    orderCreateBox.handles = {
        verifyPhone: function() {
            var val = $().val();
            orderCreateBox.config.phone_reg.test(val)
        },
        //产品咨询验证
        orderTest: function() {
            var orderTxt= $('.orderTxt').val();
            var hasChecked= false;
             
            if($('.orderUl li').hasClass('liHover')) {
                hasChecked=true;
            }
            if(!hasChecked) {
                layer.tips('选择项目必选一项哦','#orderBtn',{time:2000,tips:[4,'#FAA824']});
                return false;
            }
            if(!(orderCreateBox.config.regExp).test(orderTxt) && (orderTxt)) {
                layer.tips('手机号为11位有效数字哦','#orderBtn',{time:2000,tips:[4,'#FAA824']});
                return false;
            } 

            //选择项目 
            var proId;
            var liVal=$('.orderUl li[class*="liHover"]').text();
            switch (liVal) {
                case '出境':
                    proId=1;
                    break;
                case '国长':
                    proId=2;
                    break;
                case '邮轮':
                    proId=3;
                    break;
                case '周边自由行':
                    proId=4;
                    break;
                case '周边跟团':
                    proId=5;
            }

            //手机号
            var orderTxt=$('.orderTxt').val();
           
            $.ajax({
                type:'post',
                url: 'http://10.101.24.9/Sell/Statistics/StoreReceptionInfo/ConsultingProducts', 
                data:'StoreReceptionInfoId='+798+
                     '&ProjectId='+proId+
                     '&Mobile='+orderTxt,
                success:function(data) { 
                    window.location.href=data["Message"];
                },
                error:function() {
                    alert('请求出错');
                }
            })

        }
    };

    //在这里放模块初始化时要做的操作
    orderCreateBox.pubsub.on('orderCreateBox.init', 'orderCreateBox', function() {
    });

    return orderCreateBox;	
};
