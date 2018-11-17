//新增订单入账


layui.use(['form','layer','upload','laydate'],function () {

    var laydate = layui.laydate;
    var upload = layui.upload;
    var layer = layui.layer;
    var form = layui.form;
    var user = layui.sessionData('user');


    var pageData = {};



    pageData.submitAdd = function(param){
        if(param.exportDate){
            var d = new Date(param.exportDate);
            param.exportDate = d.getTime();
        }
        common.sendOption.data = param;
        common.sendOption.url = common.url.web_root + common.url.model.orderImport.action + common.url.opt.add;
        common.sendOption.type = common.sendMethod.POST;
        common.sendOption.completeCallBack =pageData.addComplete;
        common.httpSend(common.sendOption);
    }

    pageData.addComplete = function(res){
        var p = common.util.getHrefParam();
        var order_export_url = common.url.model.order.page.imexport + '?id=' + p.orderId;
        common.noDataResponse(res,common.optName.CONTROLLER_OPT_ADD,order_export_url);
    };


    //打开选择资金账户
    pageData.openSelectModel = function(prev){
        var model  =  'account';
        if(prev=='pos'){
            model = 'pos';
        }
        var ww = $(window).width();
        ww = ww*0.8;
        var hh = $(window).height();
        hh = hh*0.8;
        layer.open({
            type:2,
            title:'选择用户',
            content: common.url.page_root + common.url.model[model].page.selectList,
            area:[ ww+'px',hh+'px'],
            btn:['确定'],
            yes:function (index, layero) {
                console.log("点击了确定");
                pageData.showSelecteds(prev);
                layer.close(index);//关掉自己
            }
        })
    };
    //显示选择资金账户结果
    pageData.showSelecteds = function(prev){
        var len = window.frames.length;
        var selectUsers = 0;
        for(var i=0;i<len;i++){
            if(window.frames[i].getSelectUsers && typeof  window.frames[i].getSelectUsers == "function"){
                selectUsers = window.frames[i].getSelectUsers();    //[{id,name},...]
                break;
            }
        }
        if(selectUsers.length>1){
            layer.msg('只能选择一个账户哦~',{anim:6},function () {
                pageData.openSelectModel(prev);
            });

            return false;
        }
        var selectUser = selectUsers[0];
        $("input[name="+prev+"Id]").val(selectUser.id);
        $("input[name="+prev+"Name]").val(selectUser.name);
    };



    $(function () {
        var p = common.util.getHrefParam();
        $("input[name=orderId]").val(p.orderId);
        //初始化日期控件
        common.util.initSelectDate(laydate,'exportDate',common.formatDateType.datetime);
        //初始化操作类型
        // common.util.getOrderTypeOptions('type');
        common.util.getOrderImportTypeOptions('type',p.type);

        //消费方式
        common.util.getConsumeTypeOptions('consumeType')


        //点选POS机
        $("input[name=posName]").click(function () {
            pageData.openSelectModel('pos');
        });

        //点选消费账户
        $("input[name=consumeAccountName]").click(function () {
            pageData.openSelectModel('consumeAccount');
        });

        //初始化手续费率选择
        common.util.getRatesOptions('rate');
        form.render('select');

        //监听提交按钮 submit(btn_id)
        form.on('submit(formAdd)', function(data){
            pageData.submitAdd(data.field);
            return false;
        });

    })




});
