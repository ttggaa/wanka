//修改订单


layui.use(['form','layer','upload'],function () {


    var upload = layui.upload;
    var layer = layui.layer;
    var form = layui.form;
    var user = layui.sessionData('user');


    var pageData = {};



    pageData.submitUpdate = function(param){
        common.sendOption.data = param;
        common.sendOption.url = common.url.web_root + common.url.model.order.action + common.url.opt.update;
        common.sendOption.type = common.sendMethod.POST;
        common.sendOption.completeCallBack =pageData.addComplete;

        common.httpSend(common.sendOption);
    }

    pageData.addComplete = function(res){

        common.noDataResponse(res,common.optName.CONTROLLER_OPT_UPDATE,common.url.model.order.page.manager);
    };
    //打开选择客户
    pageData.openSelectModel = function(modelName,customerId){
        var ww = $(window).width();
        ww = ww*0.8;
        var hh = $(window).height();
        hh = hh*0.8;
        var url = common.url.page_root + common.url.model.customer.page.selectList;
        if(modelName=='customer'){

        }else if(modelName=='card'){
            url = common.url.page_root + common.url.model.card.page.selectList+'?customerId='+customerId
        }
        layer.open({
            type:2,
            title:'选择用户',
            content: url,
            area:[ ww+'px',hh+'px'],
            btn:['确定'],
            yes:function (index, layero) {
                console.log("点击了确定");
                pageData.showSelect(modelName);
                layer.close(index);//关掉自己
            }
        })
    };
    //显示选择的客户
    pageData.showSelect = function(modelName){
        var len = window.frames.length;
        var selectUsers = 0;
        for(var i=0;i<len;i++){
            if(window.frames[i].getSelectUsers && typeof  window.frames[i].getSelectUsers == "function"){
                selectUsers = window.frames[i].getSelectUsers();    //[{id,name},...]
                break;
            }
        }
        if(selectUsers.length>1){
            layer.msg('只能选择一个用户哦~',{anim:6},function () {
                pageData.openSelectModel(modelName);
            });

            return false;
        }
        var selectUser = selectUsers[0];
        $("input[name="+modelName+"Id]").val(selectUser.id);
        $("input[name="+modelName+"Name]").val(selectUser.name);
    };

    //获取详情
    pageData.getData = function(){
        var param = common.util.getHrefParam();
        common.sendOption.data = {id:param.id};
        common.sendOption.url = common.url.web_root + common.url.model.order.action + common.url.opt.get;
        common.sendOption.type = common.sendMethod.GET;
        common.sendOption.completeCallBack =pageData.getComplete;

        common.httpSend(common.sendOption);
    };


    pageData.getComplete = function(res){
        var resData = JSON.parse(res.responseText);

        if(resData.code == common.code.RESPONSE_CODE_SUCCESS){

        }else{
            layer.alert('查询订单失败',{anim:6},function () {
                history.back();
            });
            return false;
        }

        var data = JSON.parse(resData.data);

        form.val('order_form',{
            id:data.id,
            customerId:data.customerId,
            customerName:data.customerName,
            cardId:data.cardId,
            cardName:data.cardName,
            type:data.type,
            total:data.total,
            rate:data.rate,
            fee:data.fee,
            discount:data.discount,
            realFee:data.realFee,
            status:data.status,
            remark:data.remark,
        });
        form.render();
        //显示下单客户名后台查询了
        // common.util.initNameById(data.customerId,common.url.model.customer.action,$("input[name=customerName]"));
    };



    $(function () {
        pageData.getData();

        common.util.getStatusOptions('status');
        common.util.getOrderTypeOptions('type');
        form.render('select');

        //点选客户
        $("input[name=customerName]").click(function () {
            pageData.openSelectModel('customer');
        });

        //点选客户
        $("input[name=cardName]").click(function () {
            var customerId = $("input[name=customerId]").val();
            if(!customerId){
                layer.msg("先选择客户");
                return false;
            }
            pageData.openSelectModel('card',customerId);
        });

        //监听提交按钮 submit(btn_id)
        form.on('submit(formAdd)', function(data){
            pageData.submitUpdate(data.field);
            return false;
        });

    })




});
