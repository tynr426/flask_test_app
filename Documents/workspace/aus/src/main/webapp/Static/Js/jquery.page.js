/*!
 * ECF JavaScript Page Library v2.0.1
 * ���ݷ�ҳ��ʾJs�ļ�
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
 * 1. ��չ����չʾ���Ļص�����,����Callback��ԭcallbak���ڻ�ȡ���ݺ��Զ���չʾ��ΪshowData  2014-7-28
 * 2. ����һ��ҳ����ʹ�ö����ҳ�ؼ�ʱ��������Ľ�� 2014-10-28
 * 3. ����Ƿ���������������Լ�ָ����������   20141030
 */

!function ($, win) {

    //��չ��ECF�Ĳ���н���ʹ��
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

    // Ajax��ҳ�Ĺ��캯��
    var ecPage = $.page = function (c) {

        var my = this;


        // ���崫���config��Ϣ
        c = c || {};

        var dfs = ecPage.defaults;

        //����Ĭ������
        for (var i in dfs) {
            if (c[i] == undefined) c[i] = dfs[i];
        }

        ecPage._count++;

        if (!c.container) c.container = c.id;

        // ������ҳ��
        c.pages = Math.ceil(c.records / c.pageSize);

        //��list���и�ֵ�����ص�����ʵ��������
        return ecPage.list[c.id] = ecPage.list[c.id] ? ecPage.list[c.id]._init(c) : new ecPage.fn._init(c);
    };


    // ��ҳ�����Ĭ��������Ϣ
    ecPage.defaults = {
        id: 'pager1',				// ����page�����id
        action: 'AjaxPageData',
        container: "",						//�ؼ�������id��
        templateId: "templateId",
        pageSize: 20,						//ÿҳ��ʾ����������
        records: 0,						//�����ݼ�¼
        type: 'default',				//Ĭ��,number:������,image:ͼƬ��ʽ
        isCache: false,					//���ÿͻ������ݻ���
        loadImg: '/System/images/loading.gif',	//���ݵȴ�ʱLoadingͼƬ��ַ
        barSize: 5,						// ��ҳ�������ʾҳ��
        barRecords: true,                    // �Ƿ��ڷ�ҳ������ʾ��������
        pageIndex: 1,						// ��ǰҳ��Index
        callPage: null,			        // ��ҳ��������ҳ��
        cssName: '',						// ��ҳ������ʽ��
        showData: null,                     // ������ʾ���ݷ���
        callback: null,					// ͨ��Ajax��ȡ���ݺ�ִ�к�������,������page����
        data: '',						// ��Ҫͨ����ҳ������͵����ݲ���
        dataType: 'xml',					// Ajax�������ݵĸ�ʽ
        isPageBar: true,                // �Ƿ�ʹ�÷�ҳ��
        pageBarId: null,                // ��ʾ��ҳ��������id
        isScroll: false,                 // �Ƿ����ʱ�Զ����ط�ҳ
        scrollBox: null,                // ��Ҫ���صĹ���������
        distBottom: 100,                // ����������ײ�����߶�ʱ�Զ����ط�ҳ
        topScroll: true,                // �Ƿ�ʹ�ö����Ĺ�����
        loading: null,                  // ����ʱ����
        isHover: true,                   // �Ƿ�֧���������
        hoverColor: "#EEF3F7",             //������뱳��ɫ
        errorNull: '<div class=\"errornull\">��������</div>'
    };

    // ����Ĭ��ֵ
    ecPage.setDefault = function (name, value) {
        ecPage.defaults[name] = value;
    };

    // ��ҳ�����б���
    ecPage.list = {};

    // �Ѵ����ķ�ҳ������
    ecPage._count = 0;

    // ��ҳ�������չ��Ϣ
    ecPage.fn = ecPage.prototype = {
        Version: '2.0.0.1',
        create: '20140728',
        info: {
            // ajax��ҳ
        },

        // ������Ϣ
        _config: {},


        // page��ʼ��
        _init: function (c) {
            var my = this;
            my._config = c;
            my.pages = c.pages;
            my.render();

            // �Ƿ����ù������Զ����ط�ҳ
            if (c.isScroll) {

                var win = window.top ? window.top : window;

                // �Ƿ�ָ����������
                if (c.scrollBox) {
                    win = c.scrollBox;
                }
                else {
                    // �ж��Ƿ�ʹ�ö���ҳ��Ĺ���������
                    if (!c.topScroll) {
                        win = window;
                    }
                }


                // ��ҳ�������ĳλ��ʱ���ط�ҳ����
                $(win).bind("scroll", function () {
                    var _c = my._config, pindex = _c.pageIndex;
                    if ($(win.document).scrollTop() + _c.distBottom >= $(win.document).height() - $(win).height()) {

                        // ��ҳ�����ڵ�ǰҳʱ�Ž��м���
                        if (_c.pages > pindex) {
                            // �ƶ��˽��в��ϵļ���
                            if ($.isMobile) {
                                my.goNextPage(true);
                            }
                            else {

                                // ÿҳֻ���ۼƼ���5ҳ����
                                if (_c.isPageBar) {
                                    if (pindex % 5 != 0) {
                                        // ����׷��
                                        my.goNextPage(true);
                                    }
                                }
                                else {
                                    // ����׷��
                                    my.goNextPage(true);
                                }
                            }

                        }


                    }
                });

            }

            return my;
        },

        // ���÷�ҳ��С
        setPageSize: function (size) {
            if (size > 0) {
                this._config.pageSize = size;
            }
        },

        // ���ö���,��Ҫ����������
        reset: function (c) {
            this._config = c;
        },

        // ��ת��ָ��ҳ
        goPage: function (o, page) {
            var p = o.getAttribute('page');

            p = p ? p : page;

            this._config.pageIndex = p;

            loadData(this);
        },

        // ��ת����һҳ
        goFirstPage: function (o) {
            this._config.pageIndex = 1;
            loadData(this);
        },

        // ��ת����һҳ
        goPreviousPage: function () {
            if (this._config.pageIndex > 1) {
                this._config.pageIndex--;
                loadData(this);
            }
            else {

            }
        },

        // ��ת����һҳ
        goNextPage: function (append) {

            // ����������״̬�Ž��м�������
            this._config.pageIndex++;
            loadData(this, append);

        },

        // ��ת�����һҳ
        goLastPage: function (o) {
            this._config.pageIndex = o.getAttribute('page');
            loadData(this);
        },

        // ������Ӧ�������з�ҳ���ݲ�ѯ
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

        // ˢ�µ�ǰ�����µķ�ҳ����
        refresh: function () {
            loadData(this);
        },

        // ������Ӧ��html����
        render: function () {
            loadData(this);
        }
    };

    //����ת��  ���ıز�����
    ecPage.fn._init.prototype = ecPage.fn;

    // ��ȡ��ҳ��
    function pageString(pager) {
        var c = pager._config,
            div = document.createElement("DIV");
        div.className = (c.cssName ? c.cssName : "page-box");
        div.id = c.id + '_PageBar';
        //var div = appendElement(box, 'DIV');

        // ��ʾ��ȡ���ݵ����
        if (c.barRecords) {
            var recordsBar = appendElement(div, "DIV", "info");
            //recordsBar.innerHTML = "��<em class=\"rm\">" + c.records + "</em>������,��ǰ��<em class=\"rm\">" + c.pageIndex + "/" + c.pages + "</em>ҳ,ÿҳ<em class=\"rm\">" + c.pageSize + "</em>����¼";
            //������������ modifry by wxin 2016-12-07
            recordsBar.innerHTML = "��" + c.pages + "</em>ҳ,<em class=\"rm\">" + c.records + "</em>������";
        }


        //��ҳ
        if (c.pages > 0) { //c.pageIndex > 1
            var fristPage = appendElement(div, 'A', "first");
            fristPage.innerHTML = '��ҳ';
            fristPage.href = "javascript:;";
            fristPage.onclick = function () { pager.goFirstPage(); };
        }

        if (c.pageIndex > 1) { //c.pageIndex > 1
            var fristPage = appendElement(div, 'A', "up");
            fristPage.innerHTML = '��һҳ';
            fristPage.href = "javascript:;";
            fristPage.onclick = function () { pager.goPreviousPage(); };
        }

        var ii = 1, t = 1, vpage;
        if (parseInt(c.pages - c.barSize) > 0) { // ������Ŀ�ʼѭ���õ��м䲿�ַ�ҳ��
            if ((c.pageIndex + (c.barSize - 2)) > c.barSize) {
                t = c.pageIndex - 2;
                if (t < 1) t = 1;
                if (t > (c.pages - c.barSize)) {
                    t = c.pages - c.barSize + 1;
                }
            }
        }

        if (t > 1) {	//��ѭ����ʼʱ�ȵ�һҳ��
            appendElement(div, 'span', "more").innerHTML = '...';
        }

        for (t; t <= c.pages; t++) {
            if (ii <= c.barSize) {
                if (t == c.pageIndex) {   // ����ǰҳ
                    var cpage = appendElement(div, 'span', "now");
                    cpage.innerHTML = t;
                }
                else {  // ������ת������ҳ��
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

        if (t <= c.pages) {	// ѭ��������С�����ҳ��
            appendElement(div, 'span', "more").innerHTML = '...';
        }

        if (c.pageIndex < c.pages) { //c.pageIndex < c.pages
            var lastPage = appendElement(div, 'A', "down");
            lastPage.innerHTML = '��һҳ';
            lastPage.href = "javascript:;";
            lastPage.setAttribute('page', c.pages);
            lastPage.onclick = function () { pager.goNextPage(); };
        }

        //  ���һҳ
        if (c.pages > 0) { //c.pageIndex < c.pages
            var lastPage = appendElement(div, 'A', "end");
            lastPage.innerHTML = 'βҳ';
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
        goto.innerHTML = "��ת";

        return div;


        //��Ӳ���Ԫ��
        function appendElement(el, tagName, className, id) {
            tagName = tagName || 'DIV';
            var ele = document.createElement(tagName);
            if (id && id != "") ele.setAttribute("id", id);
            if (className && className != "") ele.className = className;
            el.appendChild(ele);
            return ele;
        };

    };

    // �ڲ�������ʼ
    // ��������
    function loadData(pager, append) {

        var c = pager._config,
            data = '';

        // �ж��Ƿ�����������
        if (c.lock) return;

        // ���������
        c.lock = true;

        data = {action:c.action,PageIndex: c.pageIndex , PageSize:  c.pageSize};
        $.ajax({
            url: c.callPage,
            data: data,
            dataType: c.dataType,
            open: c.open,
            success: function () {

                // ������ɺ����
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

                // ��ȡ�ܼ�¼��
                c.records = doc.count;
                // ������ҳ��
                c.pages = Math.ceil(c.records / c.pageSize);
                pager.reset(c);

                // �����˻ص��������ִ�д���
                if (typeof (c.showData) == 'function') {
                    c.showData.apply(pager, [doc, arguments]);
                }
                else {
                    showData(pager, doc.data, append);
                }

                if (c.pageBarId) {    //���ר�õ�pageBar���� by xp 20121205
                    $('#' + c.pageBarId).html(pageString(pager));
                }

                //�Զ��嵥ѡ��ѡUI
                if (typeof ($().customCheck) == 'function') {
                    $(document).customCheck();
                }

                //���϶�Table�б���UI
                if (typeof $().customChangeTableUI === 'function') {
                    $('#customChangeTable').customChangeTableUI({ min: 60 });
                }

                //�߼���ѯ�ر��¼�
                if (typeof (filterClose) == 'function') {
                    filterClose();
                }
            },
            done: c.done,
            error: function () {
                alert("��ҳ���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1]);
            }
        });
    };

    // ��ʾ�ص����������ݵ�������
    function showData(pager, data, append) {
        var c = pager._config;
        if ($.isArray(data) && data.length > 0) {
            var html = $("#" + c.templateId).html();
            if (typeof (c.container) == "string") {
                c.container = $(c.container);
            }
            if (c.isScroll && append) { //����׷��
                c.container.append($.tmpl(html,data));
            } else {
                c.container.html($.tmpl(html,data));
            }

            // ����������������Table�����еĽ��洦��
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
                //��col
                var cols = $('colgroup > col', c.container[0].parentNode);

                var newErrorNull = "<tr><td colspan=\"" + cols.length + "\">" + c.errorNull + "</td></tr>";

                c.container.html(newErrorNull);
            } else {
                c.container.html(c.errorNull);
            }
        };

        // �ж϶�̬ˢ�¿�ܸ߶�
        if (window.top) {
            if (window.top.main) {
                if (typeof (window.top.main.autoSize) == "function") {
                    window.top.main.autoSize(false);
                }
            }
        };

        // ��ҳ������ʾִ�����Ļص�����
        if (typeof (c.callback) == 'function') {
            c.callback.apply(pager, arguments);
        };

        if (typeof $.lazy === 'function') {
            //�ӳټ���
            $(document).nonePic();
        }
    };



}($, window);


