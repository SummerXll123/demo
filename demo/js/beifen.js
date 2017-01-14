$(function () {
    //js改变表格背景颜色,方法1
    var table = document.getElementById("tableId");
    var tbody = table.getElementsByTagName("tbody")[0];
    var trs = tbody.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        if (i % 2 == 0) {
            trs[i].style.backgroundColor = "red";
        }
    }
    ;
//jq改变表格背景颜色,方法2
    $("#tableId tbody tr:odd").css({
        backgroundColor: "yellow",
        color: "red"
    });

    //js获取单选框被选中的个数,方法一
    var btn = document.getElementById("btn");
    btn.onclick = function () {
        var Num = document.getElementById("NumCheck");
        var arrays = new Array();//建立空数组
        var items = document.getElementsByName("check");  //获取所有name为check的元素
        for (i = 0; i < items.length; i++) {
            if (items[i].checked) {  //判断条件为是否为checked属性
                arrays.push(items[i]); //
            }
        }
        Num.innerHTML = '被选中的有：' + arrays.length + '个';
    }
    //js获取单选框被选中的个数,方法2
    $("#btn2").click(function () {
        var items = $("input[name='check']:checked");
        $(".Num").text("您已经选中:" + items.length + "个");
        // alert(items.length);
    })
    // $("#btn2 :input:checked").length();

//
    $("#form1 input:enabled").val("这里变化了").css("color", "red");
    $("#form1 input:disabled").val("这里可以用了").css({
        color: "blue",
        fontSize: "20px",
    });
    $("#form1 input:checked").length;
    //转义字符
    $("#id\\#b").css("color", "red")
    $("#id\\[2\\]").css({
        fontSize: '16px',
        color: 'blue',
    })
    //显示品牌之间切换
    var $btn = $(".showMore a");
    var $li = $(".logobox ul li:gt(5):not(:last)");
    $li.hide();
    $btn.click(function () {
        if ($li.is(":visible")) {
            $li.hide();
            $btn.text("显示全部品牌").css({
                fontSize: "20px",
                color: "red",
            });
            $("ul li ").removeClass(".style");
        }
        else {
            $li.show();
            $btn.text("精简品牌").css({
                fontSize: "14px",
                color: "blue",
            });
            $("ul li").filter(":contains('尼康'),:contains('松下')")
                .addClass(".style");
        }
        ;


        // alert($items.length);
    });
    //水果的操作
    var $li1 = $(".fruits li:eq(1)").text();//获取节点
    var $linnk = $(".fruits li:eq(2)").text();//获取节点
    var $para = $(".fruits p");
    var p_txt = $para.attr("title");
    var $fruitsul = $(".fruits ul");//获取节点，为了下文插入li做准备
    var $li_1 = $("<li title='ffff' style='color: blue;font-size: 20px;'>苹果插入1</li>");
    var $li_2 = $("<li title='ffff'>苹果插入2</li>");


    $(".fruits li:eq(1)").remove();
    $fruitsul.append($li_1).append($li_2).append($li1);
    console.log(p_txt);
    $(".linkFruits").text($linnk);
    $(".fruits strong").wrap("<b></b>"); //wrap包裹的是单个元素，分开包裹
    $(".fruits span").wrapAll("<b></b>"); //wrapAll只要符合条件，包裹在一起
    $(".fruits i").wrapInner("<b></b>"); //wrapInner，将匹配的元素的子元素包裹起来
    $li_1.click(function () {
        $(this).clone().appendTo($fruitsul);//克隆。加true是复制元素的同时复制元素中所绑定的事件。
    })
//改变属性
    var $idChange = $(".fruits .idChange");
    $idChange.click(function () {
        // $idChange.attr("title","ddddddddd");//单个属性
        $idChange.attr({
            "title": "fff",
            "name": "apple"
        });//单个属性
    })

    //object.prototype属性
    function stundent(name, age) {
        // 类的属性
        this.name = name;
        this.age = age;

        // 类的方法
        this.sayhi = function () {
            console.log("您好，" + "我是" + this.name + ",今年" + this.age + "岁");
        }
    }

    // 创建一个Student对象：小明
    var xm = new stundent("小明", 21);
    xm.sayhi();

    // 创建一个Student对象：小红
    var xh = new stundent("小红", 23);
    xh.sayhi();
    delete xh.sayhi;//删除小红的方法


    //创建小明的考试方法
    xm.text = function () {
        console.log("我是" + this.name + ",我在考试")
    }
    //调用小明的考试方法
    xm.text();
    // xh.sayhi();//小红的方法已删除，所以会报错


    //hasOwnProperty() 函数用于指示一个对象自身(不包括原型链)是否具有指定名称的属性。如果有，返回true，否则返回false。
    function site() {
        this.name = "CodePlayer";
        this.url = "www.baidu.com";

        this.sayHello = function () {
            console.log("欢迎来到" + this.name + "ll");
        }
    }


    var obj = {
        engine: "PHP",
        sayhi: function () {
            console.log(欢迎来到 + engine);
        }
    }

    var j_li = $("#n1 li");
    console.log(j_li.length); // 3

    var j_p = $("#n1 p"); // 没有p元素，返回空的jQuery对象
    console.log(j_p.size()); // 0  length和size（）一样

    /*
     在注释下方编写代码
     遍历读取aqiData中各个城市的数据
     将空气质量指数大于60的城市显示到aqi-list的列表中
     */

    /*
     //先数组排序
     /!*    aqiData.sort(function (a, b) {
     return b[1] - a[1];  //代表
     // return b[2] - a[2];
     })*!/
     // console.log(aqiData);

     //找出>60分的城市
     var arrData = [];
     for (i = 0; i < aqiData.length; i++) {
     if (aqiData[i][1] > 60) {
     arrData.push(aqiData[i]);
     console.log(arrData)
     }
     }
     //将数组arrData逐个添加到新建的list这个ul上
     var aqilist = document.getElementById('aqilist');
     for (i = 0; j = arrData.length, i < j; i++) {
     var li = document.createElement("li");
     var liText = document.createTextNode("第" + (i + 1) + "名" + arrData[i][0] + ',' + arrData[i][1]);
     // li.innerText="第"+(i+1)+"名"+arrData[i][0]+','+arrData[i][1];
     li.appendChild(liText);
     aqilist.appendChild(li);
     }

     var arr=["a","d","c","b"];
     arr.sort();  //直接调用sort()，默认排序顺序为按字母升序。
     arr.reverse(); //调用reverse(),可是字母降序


     arr=[1,3,2,10];
     arr.sort(function (a,b) {
     return a-b;
     })

     arr = [{age:23},{age:45},{age:10}];
     arr.sort(function (a,b) {
     return a.age-b.age;
     })
     arr.forEach(function (item) {
     console.log('age',item.age);
     })
     */


    //模拟夏下拉框
    var listUl = document.getElementById("listUl");
    var listFruit = document.getElementById("listFruit");
    var list = document.getElementById("list");
    var data = document.getElementsByTagName("li")

    list.onclick = function () {
        for (i = 0; i < data.length; i++) {
            listFruit.style.display = "block";
            console.log(data[i].value);
        }
    }

//testText
    /*    var test=document.getElementById("testText")
     var li=test.getElementsByTagName("li")
     for(var i=0;i<li.length;li++){
     li[i].onclick=function () {
     // alert("dd")
     console.log(li[i].getAttribute)
     }
     }*/
    /****************************************表格删除，添加****************************/
    var addBtn = document.getElementById("addBtn");
    var tableName = document.getElementById("tableName");
    addBtn.onclick = function (obj) {
        trLast = tableName.lastChild;

        var tr = document.createElement("tr");
        var td = document.createElement("td");
        tr.appendChild(td);

        td = document.createElement("td");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = "<input type='button' class='deleteBtn' value='删除'>"

        tr.appendChild(td);
        tableName.appendChild(tr);
    }

    var delBtn = document.getElementsByClassName("deleteBtn")
    var tbody = document.getElementById("tbody")
    for (var i = 0; i < delBtn.length; i++) {
        delBtn[i].onclick = function () {
            var tableName = document.getElementById('tableName').lastChild;
            var tr = this.parentNode.parentNode;
            console.log(tr)
            tbody.removeChild(tr);
        }
    }
    /*找出都是大一的女生——数组*/
    var stu = [
        ['小A', '女', 21, '大一'],
        ['小B', '男', 23, '大三'],
        ['小C', '男', 24, '大四'],
        ['小D', '女', 21, '大一'],
        ['小E', '女', 22, '大四'],
        ['小F', '男', 21, '大一'],
        ['小G', '女', 22, '大二'],
        ['小H', '女', 20, '大三'],
        ['小I', '女', 20, '大一'],
        ['小J', '男', 20, '大三']
    ];
    //找出都是大一的学生
    //怎么给找出的数组，放入到div里,用innerHTML只能出现一个,用document.write可以出现全部；什么时候用return
    for (var i = 0; i < stu.length; i++) {
        if (stu[i][3] == "大一") {
            // var arr = [];
            var arr = new Array();
            arr.push(stu[i]);
            // return;
            console.log(arr + "</br>");
            /* console.log(arr.length);
             stuArr.innerHTML=("大一人数是：" + arr.length); //为什么出现一个*/
        }
    }
//第二次筛选，找出都是女生的信息
    for (var j = 0; j < arr.length; j++) {
        if (arr[j][1] == "女") {
            console.log(arr[j][0])
        }
    }
    var stuArr = document.getElementById("stuArr");
    for (i = 0; i < arr.length; i++) {
        var li = document.createElement("li");
        var liText = document.createTextNode(arr);
        li.appendChild(liText);
        stuArr.appendChild(li);
    }
    /*运算/ */
    var countBtn = document.getElementById("countBtn");

    countBtn.onclick = function () {
        var text1 = parseInt(document.getElementById("text1").value);
        var text2 = parseInt(document.getElementById("text2").value);
        var select = document.getElementById("select").value;
        var result = "";

        switch (select) {
            case '+':
                result = text1 + text2;
                break;
            case '-':
                result = text1 - text2;
                break;
            case '*':
                result = text1 * text2;
                break;
            case  '/':
                result = text1 / text2;
        }
        document.getElementById("fruit").value = result;
    }
    /*当前的时间*/
    var date = new Date();
    var today = document.getElementById("todayDate");
    /*var timeStr = '';//日期
     timeStr = date.getFullYear() + "年" ;
     timeStr += date.getMonth() + 1 +"月";
     timeStr += date.getDate()+"日";*/

    // var date=new Date();
    var week = "";
    switch (date.getDay()) {
        case 0:
            week = "今天是:星期一";
            break;
        case 1:
            week = "星期二"
            break;
        case 2:
            week = "星期三"
            break;
        case 3:
            week = "星期四"
            break;
        case 4:
            week = "星期五"
            break;
        case 5:
            week = "星期六"
            break;
        case 6:
            week = "星期日"
            break;
    }

//成绩是一长窜的字符串不好处理，找规律后分割放到数组里更好操作哦
    var sorceStr = "小明:87; 小花:81; 小红:97; 小天:76;小张:74;小小:94;小西:90;小伍:76;小迪:64;小曼:76";
    var arr = sorceStr.split(";");
    var sum = 0;
    var av = 0;
    for (i = 0; i < arr.length; i++) {
        var index = arr[i].indexOf(":");
        // var substr=arr[i].substr("index+1",1);
        sum += parseInt(arr[i].substr(index + 1, 2));
    }
    av = sum / arr.length;
    var c = Math.floor(av);
    today.innerHTML = date.getFullYear() + "年" + date.getMonth() + 1 + "月" + date.getDay() + "日" + week + c;//月的时候要加1
    /*表单验证*/

    var inputBtn = document.getElementById("inputBtn");
    inputBtn.onclick = function () {
        /*    var nameID=document.getElementById("name")
         var emailID=document.getElementById("email")
         var nameValue = nameID.value;
         var emailValue= emailID.value;*/

        // 姓名验证
        verify('name');
        // 邮箱验证
        verify('email')
        // 身份证验证
    }




    var regId = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;

    function verify(ID) {

        var nameID = document.getElementById(ID)
        console.log(nameID);
        var value = nameID.value

        var type = nameID.getAttribute("data-leixing");
        // alert(type)
        if (value ==''){
            var nameS=nameID.nextSibling;
            nameS.innerHTML="不能为空"
            return false;
        }
        if (type =='姓名'){
            var reg = /[\u4e00-\u9fa5]/;

        }else if(type =='邮箱'){
            var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        }
        if (!reg.test(value)){
            var nameS=nameID.nextSibling;
            nameS.innerHTML="不正确"
            return false;
        }else{
            var nameS=nameID.nextSibling;
            nameS.innerHTML=""
        }



        return true;

    }

    /*   、、 verify('email',emailValue,email)
     verify('shenfenzheng',emailValue,email)*/



    // var inputBtn = document.getElementById("inputBtn");

    /* inputBtn.onclick = function () {
     var name = document.getElementById("name");
     var nameValue = name.value;
     var email = document.getElementById("email").value;
     var personId = document.getElementById("personId");
     var span = document.getElementById("span");  //怎么获取同胞元素，并内容
     // var requird=document.getElementsByClassName("requird");

     var regName = /[\u4e00-\u9fa5]/;
     var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     var regId = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;


     if (nameValue == ""  ) {
     // var span=name.nextSbiling;
     //     var span=document.createElement("span");
     // var spanText=span.createTextNode("")

     // span.appendChild="不能为空"
     span.innerHTML="不能为空"
     // name.value = "不能为空"
     // username.focus();
     return false;


     }
     console.log(nameValue);
     console.log(regName.test(nameValue))
     if (!regName.test(nameValue)) {
     // span.innerHTML="请输入中文"
     // name.value = "请输入中文"
     span.innerHTML="输入中文wqeqw "
     return false;

     }
     span.innerHTML='';


     if (email == "") {
     email.innerHTML = "不能为空"
     } else if (!regEmail.test(email)) {
     email.innerHTML = "请输入正确的邮箱"
     }

     if (personId.value == "") {
     // var span = document.createElement("span");//创建的元素放到同胞元素位置
     // var spanText=document.createTextNode("d");
     // span.innerHTML = "不能为空"
     // personId.appendChild(span)

     personId.value = "不能为空";
     // personId.onfocus.value ="";
     } else if (!regId.test(personId) && personId.length >= 18) {
     personId.value = "输入正确的身份证"
     }
     return true;
     }*/

    /*tabi切換*/
    var con = document.getElementById("tanContainer");
    var tabNav = document.getElementById("tabNav");
    var liTab = tabNav.getElementsByTagName("li");
    var tabList = document.getElementById("tabList");
    var tabLi = tabList.getElementsByTagName("div");

    /* for(var i=0;i<liTab.length;i++){
     liTab[i].index=i;
     liTab[i].onmouseover=function () {

     liTab[i].className="select"
     tabLi[i].className="show";
     for(var j=0;j<tabList.length;j++){
     if (i != j){
     tabList[j].className= "none"
     }
     }
     /!* this.className="select";
     tabLi[this.index].className="show"*!/


     }*/
    /* con.onmouseover=function(){
     tabList.style.display="block";
     }*/
    for (var i = 0; i < liTab.length; i++) {
        liTab[i].index = i;
        liTab[i].onmouseover = function () {
            for (var j = 0; j < liTab.length; j++) {
                liTab[j].className = "";
                console.log(liTab[j])
                tabLi[j].className = "";
            }
            this.className = "select";
            tabLi[this.index].className = "show"
        }
    }

    /*   con.onmouseout=function(){
     tabList.style.display="none";
     }*/

    /*模拟下拉框*/
    var selectWrap = document.getElementById("selectWrap");
    var selectList = document.getElementById("selectList");
    var li = selectList.getElementsByTagName("li");
    selectWrap.onclick = function () {
        if (selectList.style.display = "none") {
            selectList.style.display = "block";
        }
    }

    /*    $('.cource').on('click',function () {

     $('#selectWrap').val( $(this) .text());

     ///selectWrap.value=$(this).text();;
     selectList.style.display="none";
     console.log(name);
     });*/
    for (i = 0; i < li.length; i++) {
        li[i].onclick = function () {
            selectWrap.value = this.innerHTML;
            selectList.style.display = "none";
        }
    }


});