//登录信息
layui.use(['form','layer','upload'],function () {


    var upload = layui.upload;
    var layer = layui.layer;
    var form = layui.form;
    var user = layui.sessionData('user');


    var pageData = {};

    form.on('submit(loginSubmit)', function(data){
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        pageData.submitLogin(data.field);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //提交登录
    pageData.submitLogin = function (data) {
        common.sendOption.data = data;
        common.sendOption.url = common.url.web_root + common.url.model.worker.action + common.url.opt.model.worker.login;
        common.sendOption.type = common.sendMethod.GET;
        common.sendOption.completeCallBack =pageData.loginComplete;

        common.httpSend(common.sendOption);
    };
    pageData.loginComplete =  function (res) {
         var resData = JSON.parse(res.responseText);
        console.log(resData);
         if(resData.code == common.code.RESPONSE_CODE_SUCCESS){
            //登录成功后处理业务
             console.log("登录成功")
             pageData.worker = JSON.parse(resData.data);
             sessionStorage.user = resData.data;
             pageData.initConfig(resData.data);
         }else{
             layer.alert('登录失败',{anim:6},function () {
                 console.log("登录失败");
                 layer.closeAll();
             })
         }
    };
    //加载用户角色下的所有权限
    pageData.loadPermissions = function (worker) {
        common.sendOption.data = {roleId:worker.roleId};
        common.sendOption.url = common.url.web_root + common.url.model.permission.action + common.url.opt.model.permission.getUserActionInRole;
        common.sendOption.type = common.sendMethod.GET;
        common.sendOption.completeCallBack =pageData.loadPermissionComplete;

        common.httpSend(common.sendOption);
    };

    pageData.loadPermissionComplete = function (res) {
        var resData = JSON.parse(res.responseText);
        sessionStorage.setItem(common.session.key.permissionData,resData.data);
        pageData.loadRoles();
    }
    pageData.loadRoles = function () {
        // var worker = JSON.parse(sessionStorage.user);
        common.sendOption.data = {};
        common.sendOption.url = common.url.web_root + common.url.model.role.action + common.url.opt.search;
        common.sendOption.type = common.sendMethod.GET;
        common.sendOption.completeCallBack =pageData.loadRolesComplete;

        common.httpSend(common.sendOption);
    };

    pageData.loadRolesComplete = function(res){
        var resData = JSON.parse(res.responseText);
        sessionStorage.setItem(common.session.key.roleData,resData.data);
        pageData.loadOrgs();
    };

    pageData.loadOrgs = function () {
        common.sendOption.data = {};
        common.sendOption.url = common.url.web_root + common.url.model.org.action + common.url.opt.search;
        common.sendOption.type = common.sendMethod.POST;
        common.sendOption.completeCallBack =pageData.loadOrgsComplete;

        common.httpSend(common.sendOption);
    };

    pageData.loadOrgsComplete = function(res){
        var resData = JSON.parse(res.responseText);
        var data = JSON.parse(resData.data);
        var orginTree = common.util.covert2TreeJSON(data,0);
        //暂时在这里保存，事实上应该在登录时保存这些数据
        sessionStorage.setItem(common.session.key.orgData,resData.data);
        sessionStorage.setItem(common.session.key.orgTree,JSON.stringify(orginTree));
        pageData.toWorkerDetail();
    };

    pageData.toWorkerDetail = function(){
        // var worker_detail = common.url.page_root + common.url.model.worker.page.detail + '?id='+pageData.worker.id;
        var worker_detail = common.url.page_root + common.url.model.finance.page.repayment;//还款提示
        if(sessionStorage.directUrl){
            worker_detail = sessionStorage.directUrl;
            sessionStorage.removeItem('directUrl');
        }
        location.href = worker_detail;
        // window.open(worker_detail);
    };

    pageData.initConfig = function (workerJsonString) {
        var worker = JSON.parse(workerJsonString);
        pageData.loadPermissions(worker);
        //加载角色(回调中完成)
        // pageData.loadRoles();
        //加载组织(回调完成)
        // pageData.loadOrgs();
        //进入登录用户详情页面(回调中完成)
        // pageData.toWorkerDetail();
    }
});
