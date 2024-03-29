layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
    $ = layui.jquery;

    //全局URL设置
    $.cookie('tempUrl', "http://localhost:8082/", {path: '/'});
    //$.cookie('tempUrl', "http://47.106.189.124:8082/", {path: '/'});

    //禁止后退按钮
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            window.history.pushState('forward', null, '#');
            window.history.forward(1);
        });
    }
    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
    window.history.forward(1);

    //登录按钮
    form.on("submit(login)", function (data) {
        // if ($("#code").val() == "jgmxj") {
        $(this).text("登录中...").attr("disabled", "disabled").addClass("layui-disabled");
        setTimeout(function () {
            $.ajax({
                url: $.cookie("tempUrl") + "admin/adminlogin.do",
                type: "POST",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    phone: $("#userName").val(),
                    password: $("#password").val()
                }),
                success: function (result) {
                    if (result.code == 0) {
                        layer.msg("登陆成功");
                        $.cookie('truename', result.data.truename, {path: '/'});
                        $.cookie('token', result.data.accessToken, {path: '/'});
                        $.cookie('id', result.data.id, {path: '/'});
                        setTimeout(function () {
                            window.location.href = "index.html";
                        }, 1000);
                    } else {
                        layer.alert("登陆失败，" + result.exception, {icon: 7, anim: 6});
                        $(".layui-disabled").text("登录").attr("disabled", false).removeClass("layui-disabled").addClass("layui-btn-warm");
                    }
                }
            });
        }, 1000);
        return false;
        // } else {
        //     layer.msg("验证码有误", {icon: 7, anim: 6});
        // }
    })

    //表单输入效果
    $(".loginBody .input-item").click(function (e) {
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function () {
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function () {
        $(this).parent().removeClass("layui-input-focus");
        if ($(this).val() != '') {
            $(this).parent().addClass("layui-input-active");
        } else {
            $(this).parent().removeClass("layui-input-active");
        }
    })
})
