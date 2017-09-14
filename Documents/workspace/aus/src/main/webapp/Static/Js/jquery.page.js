/*!
 * ECF JavaScript Page Library v2.0.1
 * 数据分页显示Js文件
 *
 * Includes ECF.js
 *
 * Includes ECF.TEngine.js
 *
 * Copyright 2011, 2014 , shaipe
 *
 * Date: 2014-07-28T21:02Z
 * Modify:  xp 2014/10/28
 *
 * 1. 扩展数据展示完后的回调方法,名称Callback把原callbak用于获取数据后自定义展示改为showData  2014-7-28
 * 2. 处理一个页面中使用多个分页控件时会有问题的解决 2014-10-28
 * 3. 添加是否请允许滚动加载以及指定滚动对象   20141030
 */

!function ($, win) {

    //扩展到ECF的插件中进行使用
    $.fn.page = function (templateId, pageBarId, data, pageSize, callback, callPage) {

        var container = this,
            _c = {};

        if (arguments.length == 1 && $.isObject(arguments[0])) {
            _c = arguments[0];
        }
        else {
            _c = {
                templateId: templateId,
                id: this.selector,
                pageBarId: pageBarId,
                pageSize: pageSize || null,
                data: data,
                callback: callback,
                callPage: callPage || null
            };
        }

        _c.container = container;


        if (this.length > 0) {
            return new ecPage(_c);
        }
    };

    // Ajax分页的构造函数
    var ecPage = $.page = function (c) {

        var my = this;


        // 定义传入的config信息
        c = c || {};

        var dfs = ecPage.defaults;

        //处理默认配置
        for (var i in dfs) {
            if (c[i] == undefined) c[i] = dfs[i];
        }

        ecPage._count++;

        if (!c.container) c.container = c.id;

        // 计算总页数
        c.pages = Math.ceil(c.records / c.pageSize);

        //给list对列附值并返回弹出层实例化对象
        return ecPage.list[c.id] = ecPage.list[c.id] ? ecPage.list[c.id]._init(c) : new ecPage.fn._init(c);
    };


    // 分页插件的默认配置信息
    ecPage.defaults = {
        id: 'pager1',				// 给定page对象的id
        action: 'AjaxPageData',
        container: "",						//控件容器的id号
        templateId: "templateId",
        pageSize: 20,						//每页显示的数据条数
        records: 0,						//总数据记录
        type: 'default',				//默认,number:数字型,image:图片格式
        isCache: false,					//启用客户端数据缓存
        loadImg: '/System/images/loading.gif',	//数据等待时Loading图片地址
        barSize: 5,						// 分页第最多现示页码
        barRecords: true,                    // 是否在分页条上显示数据条数
        pageIndex: 1,						// 当前页面Index
        callPage: null,			        // 分页数据请求页面
        cssName: '',						// 分页条的样式名
        showData: null,                     // 定义显示数据方法
        callback: null,					// 通过Ajax获取数据后执行函数处理,将传入page对象
        data: '',						// 需要通过分页条向后发送的数据参数
        dataType: 'xml',					// Ajax发送数据的格式
        isPageBar: true,                // 是否使用分页条
        pageBarId: null,                // 显示分页条的容器id
        isScroll: false,                 // 是否滚动时自动加载分页
        scrollBox: null,                // 需要加载的滚动条对象
        distBottom: 100,                // 滚动条距离底部距离高度时自动加载分页
        topScroll: true,                // 是否使用顶部的滚动条
        loading: null,                  // 加载时方法
        isHover: true,                   // 是否支持鼠标移入
        hoverColor: "#EEF3F7",             //鼠标移入背景色
        errorNull: '<div class=\"errornull\">暂无数据</div>'
    };

    // 设置默认值
    ecPage.setDefault = function (name, value) {
        ecPage.defaults[name] = value;
    };

    // 分页条的列表数
    ecPage.list = {};

    // 已创建的分页条个数
    ecPage._count = 0;

    // 分页插件的扩展信息
    ecPage.fn = ecPage.prototype = {
        Version: '2.0.0.1',
        create: '20140728',
        info: {
            // ajax分页
        },

        // 配置信息
        _config: {},


        // page初始化
        _init: function (c) {
            var my = this;
            my._config = c;
            my.pages = c.pages;
            my.render();

            // 是否启用滚动条自动加载分页
            if (c.isScroll) {

                var win = window.top ? window.top : window;

                // 是否指定滚动对象
                if (c.scrollBox) {
                    win = c.scrollBox;
                }
                else {
                    // 判断是否使用顶层页面的滚动条控制
                    if (!c.topScroll) {
                        win = window;
                    }
                }


                // 当页面滚动到某位置时加载分页数据
                $(win).bind("scroll", function () {
                    var _c = my._config, pindex = _c.pageIndex;
                    if ($(win.document).scrollTop() + _c.distBottom >= $(win.document).height() - $(win).height()) {

                        // 总页数大于当前页时才进行加载
                        if (_c.pages > pindex) {
                            // 移动端进行不断的加载
                            if ($.isMobile) {
                                my.goNextPage(true);
                            }
                            else {

                                // 每页只是累计加载5页数据
                                if (_c.isPageBar) {
                                    if (pindex % 5 != 0) {
                                        // 进行追加
                                        my.goNextPage(true);
                                    }
                                }
                                else {
                                    // 进行追加
                                    my.goNextPage(true);
                                }
                            }

                        }


                    }
                });

            }

            return my;
        },

        // 设置分页大小
        setPageSize: function (size) {
            if (size > 0) {
                this._config.pageSize = size;
            }
        },

        // 重置对象,主要是重置配置
        reset: function (c) {
            this._config = c;
        },

        // 跳转到指定页
        goPage: function (o, page) {
            var p = o.getAttribute('page');

            p = p ? p : page;

            this._config.pageIndex = p;

            loadData(this);
        },

        // 跳转到第一页
        goFirstPage: function (o) {
            this._config.pageIndex = 1;
            loadData(this);
        },

        // 跳转到上一页
        goPreviousPage: function () {
            if (this._config.pageIndex > 1) {
                this._config.pageIndex--;
                loadData(this);
            }
            else {

            }
        },

        // 跳转到下一页
        goNextPage: function (append) {

            // 如果处理解锁状态才进行加载请求
            this._config.pageIndex++;
            loadData(this, append);

        },

        // 跳转到最后一页
        goLastPage: function (o) {
            this._config.pageIndex = o.getAttribute('page');
            loadData(this);
        },

        // 根据相应条件进行分页数据查询
        query: function (data) {
            if (data) {
                this._config.data = data;

                var currentData = this._config.data;
                if (currentData != data) {
                    this._config.pageIndex = 1;
                }
            }

            loadData(this);
        },

        // 刷新当前条件下的分页数据
        refresh: function () {
            loadData(this);
        },

        // 生成相应的html代码
        render: function () {
            loadData(this);
        }
    };

    //功能转换  核心必不可少
    ecPage.fn._init.prototype = ecPage.fn;

    // 获取分页条
    function pageString(pager) {
        var c = pager._config,
            div = document.createElement("DIV");
        div.className = (c.cssName ? c.cssName : "page-box");
        div.id = c.id + '_PageBar';
        //var div = appendElement(box, 'DIV');

        // 显示获取数据的情况
        if (c.barRecords) {
            var recordsBar = appendElement(div, "DIV", "info");
            //recordsBar.innerHTML = "共<em class=\"rm\">" + c.records + "</em>条数据,当前第<em class=\"rm\">" + c.pageIndex + "/" + c.pages + "</em>页,每页<em class=\"rm\">" + c.pageSize + "</em>条记录";
            //精简文字描述 modifry by wxin 2016-12-07
            recordsBar.innerHTML = "共" + c.pages + "</em>页,<em class=\"rm\">" + c.records + "</em>条数据";
        }


        //首页
        if (c.pages > 0) { //c.pageIndex > 1
            var fristPage = appendElement(div, 'A', "first");
            fristPage.innerHTML = '首页';
            fristPage.href = "javascript:;";
            fristPage.onclick = function () { pager.goFirstPage(); };
        }

        if (c.pageIndex > 1) { //c.pageIndex > 1
            var fristPage = appendElement(div, 'A', "up");
            fristPage.innerHTML = '上一页';
            fristPage.href = "javascript:;";
            fristPage.onclick = function () { pager.goPreviousPage(); };
        }

        var ii = 1, t = 1, vpage;
        if (parseInt(c.pages - c.barSize) > 0) { // 处理从哪开始循环得到中间部分分页条
            if ((c.pageIndex + (c.barSize - 2)) > c.barSize) {
                t = c.pageIndex - 2;
                if (t < 1) t = 1;
                if (t > (c.pages - c.barSize)) {
                    t = c.pages - c.barSize + 1;
                }
            }
        }

        if (t > 1) {	//当循环开始时比第一页大
            appendElement(div, 'span', "more").innerHTML = '...';
        }

        for (t; t <= c.pages; t++) {
            if (ii <= c.barSize) {
                if (t == c.pageIndex) {   // 处理当前页
                    var cpage = appendElement(div, 'span', "now");
                    cpage.innerHTML = t;
                }
                else {  // 可以跳转到其他页面
                    vpage = appendElement(div, 'A', "num");
                    vpage.href = "javascript:;";
                    vpage.onclick = function () { pager.goPage(this); };
                    vpage.innerHTML = t;
                    vpage.setAttribute('page', t);
                }
            }
            else {
                break;
            }
            ii++;
        }

        if (t <= c.pages) {	// 循环结束后小于最大页数
            appendElement(div, 'span', "more").innerHTML = '...';
        }

        if (c.pageIndex < c.pages) { //c.pageIndex < c.pages
            var lastPage = appendElement(div, 'A', "down");
            lastPage.innerHTML = '下一页';
            lastPage.href = "javascript:;";
            lastPage.setAttribute('page', c.pages);
            lastPage.onclick = function () { pager.goNextPage(); };
        }

        //  最后一页
        if (c.pages > 0) { //c.pageIndex < c.pages
            var lastPage = appendElement(div, 'A', "end");
            lastPage.innerHTML = '尾页';
            lastPage.href = "javascript:;";
            lastPage.setAttribute('page', c.pages);
            lastPage.onclick = function () { pager.goLastPage(this); };
        }

        var input = appendElement(div, "INPUT", "");
        input.type = "text";
        input.value = c.pageIndex;
        input.id = c.id + '_IndexPage';

        var goto = appendElement(div, "A", "return");
        goto.onclick = function () {
            pager.goPage(this, input.value);
        };
        goto.innerHTML = "跳转";

        return div;


        //添加并绑定元素
        function appendElement(el, tagName, className, id) {
            tagName = tagName || 'DIV';
            var ele = document.createElement(tagName);
            if (id && id != "") ele.setAttribute("id", id);
            if (className && className != "") ele.className = className;
            el.appendChild(ele);
            return ele;
        };

    };

    // 内部方法开始
    // 加载数据
    function loadData(pager, append) {

        var c = pager._config,
            data = '';

        // 判断是否锁定了请求
        if (c.lock) return;

        // 给请求加锁
        c.lock = true;

        data = {action:c.action,PageIndex: c.pageIndex , PageSize:  c.pageSize};
        $.ajax({
            url: c.callPage,
            data: data,
            dataType: c.dataType,
            open: c.open,
            success: function () {

                // 请求完成后解锁
                c.lock = false;

                var doc = (arguments[1].xml ? arguments[1].xml : arguments[1].text);
                if (!doc) return;

                if (typeof (doc) == "string") {
                    doc = $.parseJSON(doc);
                }
                else {
                    doc = $.xml.toJson(doc);
                }

                if (!doc) return;

                // 获取总记录数
                c.records = doc.count;
                // 计算总页数
                c.pages = Math.ceil(c.records / c.pageSize);
                pager.reset(c);

                // 给定了回调方法后的执行处理
                if (typeof (c.showData) == 'function') {
                    c.showData.apply(pager, [doc, arguments]);
                }
                else {
                    showData(pager, doc.data, append);
                }

                if (c.pageBarId) {    //添加专用的pageBar容器 by xp 20121205
                    $('#' + c.pageBarId).html(pageString(pager));
                }

                //自定义单选复选UI
                if (typeof ($().customCheck) == 'function') {
                    $(document).customCheck();
                }

                //可拖动Table列表宽度UI
                if (typeof $().customChangeTableUI === 'function') {
                    $('#customChangeTable').customChangeTableUI({ min: 60 });
                }

                //高级查询关闭事件
                if (typeof (filterClose) == 'function') {
                    filterClose();
                }
            },
            done: c.done,
            error: function () {
                alert("分页数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1]);
            }
        });
    };

    // 显示回调回来的数据到容器中
    function showData(pager, data, append) {
        var c = pager._config;
        if ($.isArray(data) && data.length > 0) {
            var html = $("#" + c.templateId).html();
            if (typeof (c.container) == "string") {
                c.container = $(c.container);
            }
            if (c.isScroll && append) { //进行追加
                c.container.append($.tmpl(html,data));
            } else {
                c.container.html($.tmpl(html,data));
            }

            // 开启鼠标移入如果是Table进行行的交替处理
            if (c.isHover && c.container[0].nodeName == 'TBODY') {
                $(">tr", c.container[0]).each(function(){
                    $(this).bind("mouseover", function () {
                        $(">th,>td", this).css("background-color", c.hoverColor);
                    });
                    $(this).bind("mouseout", function () {
                        $(">th,>td", this).css("background-color", "");
                    });
                });
            }
        }
        else {
            if (c.container[0].nodeName == 'TBODY') {
                //找col
                var cols = $('colgroup > col', c.container[0].parentNode);

                var newErrorNull = "<tr><td colspan=\"" + cols.length + "\">" + c.errorNull + "</td></tr>";

                c.container.html(newErrorNull);
            } else {
                c.container.html(c.errorNull);
            }
        };

        // 判断动态刷新框架高度
        if (window.top) {
            if (window.top.main) {
                if (typeof (window.top.main.autoSize) == "function") {
                    window.top.main.autoSize(false);
                }
            }
        };

        // 分页数据显示执行完后的回调方法
        if (typeof (c.callback) == 'function') {
            c.callback.apply(pager, arguments);
        };

        if (typeof $.lazy === 'function') {
            //延迟加载
            $(document).nonePic();
        }
    };



}($, window);


