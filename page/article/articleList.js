layui.use(['form', 'layer', 'table', 'laydate', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        table = layui.table;

    //请选择开始日期
    laydate.render({
        elem: '.startDay',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        max: 0,
        mark: {"0-1-1": "元旦"},
        done: function (value, date) {
            if (date.month === 1 && date.date === 1) { //点击每年12月15日，弹出提示语
                layer.msg('今天是元旦，新年快乐！');
            }
        }
    });
    //请选择截止日期
    laydate.render({
        elem: '.endDay',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        max: 0,
        mark: {"0-1-1": "元旦"},
        done: function (value, date) {
            if (date.month === 1 && date.date === 1) { //点击每年12月15日，弹出提示语
                layer.msg('今天是元旦，新年快乐！');
            }
        }
    });
    //校验日期
    form.verify({
        startDay: function (value) {
            if (new Date(value) >= new Date($(".endDay").val())) {
                return "起始日期需小于截止日期！";
            }
        }
        // ,
        // endDay: function (value) {
        //     if (new Date(value) <= new Date($(".startDay").val())) {
        //         return "请选择截止日期！";
        //     }
        // }
    })
    //用户列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'article/getAll',
        where: {token: $.cookie("token")},
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 0 //成功的状态码，默认：0
            , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
            , countName: 'totalElements' //数据总数的字段名称，默认：count
            , dataName: 'content' //数据列表的字段名称，默认：data
        },
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 20,
        id: "userListTable",
        cols: [[
            {type: "checkbox", fixed: "left", width: 50},
            {
                field: 'articleTitle', title: '文章标题', minWidth: 200, align: "center", templet: function (d) {
                    return '<a lay-event="edit">' + d.articleTitle + '</a>';
                }
            },
            {
                field: 'author', title: '商城链接', minWidth: 120, align: "center", templet: function (d) {
                    return '<a class="layui-blue" href="' + d.author + '" target="_blank">' + d.author + '</a>';
                }
            },
            {
                field: 'commission', title: '提成金额', minWidth: 120, align: 'center', templet: function (d) {
                    return d.commission + " 元";
                }
            },
            {field: 'createDate', title: '创建时间', minWidth: 170, align: "center"},
            {
                field: 'remarks', title: '列表显示', width: 120, align: 'center', templet: function (d) {
                    if (d.remarks == 0) {
                        return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="正常|禁止" checked>';
                    } else if (d.remarks == 1) {
                        return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="正常|禁止" >';
                    }
                }
            },
            {title: '操作', minWidth: 160, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //点击状态按钮事件
    $(document).on("click", ".layui-form-switch",
        function () {
            if ($(this).attr("class").indexOf("layui-form-onswitch") == -1) {
                var status = 1;
            } else {
                status = 0
            }
            $.ajax({
                url: $.cookie("tempUrl") + "article/articleStatusUpt?token=" + $.cookie("token"),
                type: "POST",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    id: $(this).siblings().attr("data-id"),
                    remarks: status,
                    updateBy: $.cookie("truename")
                }),
                success: function (result) {
                    if (result.httpStatus == 200) {
                        layer.msg(result.data);
                    } else {
                        layer.alert(result.exception, {icon: 7, anim: 6});
                    }
                }
            });
        });

    //搜索
    form.on("submit(search_btn)", function () {
        var endDay = $(".endDay").val();
        if (endDay == null || endDay == "") {
            endDay = "2099-12-12"
        }
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'article/getFuzzy',
            where: {
                key: $(".searchVal").val(),
                startDay: $(".startDay").val(),
                endDay: endDay,
                token: $.cookie("token")
            },
            request: {
                pageName: 'pageNum' //页码的参数名称，默认：page
                , limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code' //数据状态的字段名称，默认：code
                , statusCode: 0 //成功的状态码，默认：0
                , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
                , countName: 'totalElements' //数据总数的字段名称，默认：count
                , dataName: 'content' //数据列表的字段名称，默认：data
            },
            cellMinWidth: 95,
            page: true,
            height: "full-125",
            limits: [10, 15, 20, 25],
            limit: 20,
            id: "userListTable",
            cols: [[
                {type: "checkbox", fixed: "left", width: 50},
                {
                    field: 'articleTitle', title: '文章标题', minWidth: 200, align: "center", templet: function (d) {
                        return '<a lay-event="edit">' + d.articleTitle + '</a>';
                    }
                },
                {
                    field: 'author', title: '商城链接', minWidth: 120, align: "center", templet: function (d) {
                        return '<a class="layui-blue" href="' + d.author + '" target="_blank">' + d.author + '</a>';
                    }
                },
                {
                    field: 'commission', title: '提成金额', minWidth: 120, align: 'center', templet: function (d) {
                        return d.commission + " 元";
                    }
                },
                {field: 'createDate', title: '创建时间', minWidth: 170, align: "center"},
                {
                    field: 'remarks', title: '列表显示', width: 120, align: 'center', templet: function (d) {
                        if (d.remarks == 0) {
                            return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="正常|禁止" checked>';
                        } else if (d.remarks == 1) {
                            return '<input type="checkbox" data-id=' + d.id + ' lay-skin="switch" lay-text="正常|禁止" >';
                        }
                    }
                },
                {title: '操作', minWidth: 160, templet: '#userListBar', fixed: "right", align: "center"}
            ]]
        })
    });

    //编辑文章
    function articleUpd(edit) {
        sessionStorage.setItem("label", edit.label) //定向投放
        sessionStorage.setItem("articleContent", edit.articleContent) //文章内容
        var index = layui.layer.open({
            title: "编辑文章",
            type: 2,
            content: "articleUpd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".articleTitle").attr("data-id", edit.id);  //传id
                    body.find(".articleTitle").val(edit.articleTitle);  //文章标题
                    body.find(".author").val(edit.author);  //作者
                    body.find(".commission").val(edit.commission);  //提成金额
                    body.find(".createDate").val(edit.createDate);  //创建时间
                    body.find("#demo1").attr("src", edit.cover);  //封面图
                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }

    //点击新增按钮事件
    $(".addNews_btn").click(function () {
        var index = layui.layer.open({
            title: "添加文章",
            type: 2,
            content: "articleAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    })

    //批量删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的文章？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "article/articleDelSome?token=" + $.cookie("token") + "&ids=" + newsId + "&handler=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "articleList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            })
        } else {
            layer.msg("请选择需要删除的文章");
        }
    })

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            articleUpd(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此文章？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "article/articleDel?token=" + $.cookie("token") + "&id=" + data.id + "&handler=" + $.cookie("truename"),
                    type: "DELETE",
                    success: function (result) {
                        layer.msg(result.data);
                        window.location.href = "articleList.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });

})
