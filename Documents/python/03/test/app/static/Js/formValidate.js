

!function ($, win) {
    // ��ʼ����
    $.fn.forms = function (data, callback) {

        if (typeof (this.length) == "undefined" || this.length < 1) return;

        var frm = this;
        //if (this.length && this.length > 0) {
        _init();
        // }


        // �������ݽ����Զ����и�ֵ����
        if (data) {
            this.setValues(data, callback, []);
        }
        return frm;

        // ���г�ʼ������
        function _init() {
            var boxs = frm.find(dfs.tags);
            // ����֧��placeholder�������֧��
            boxs.placeholder();
            boxs.each(function () {
                var el = this;
                if (el.tagName == 'INPUT' && el.type == 'hidden') {
                    return;
                }
                // ����������֤�¼�
                onPromptly(el);

                if (el.nodeName == "TEXTAREA") {
                    // ���ر༭��
                    loadEditor(el);
                }

            });

        };

        function onPromptly(el) {

            var $l = $(el),
                valid = $l.attr("validate"),
                visible = $l.isVisible(),//��Ԫ�صĿɼ��Խ����ж�
                isEditor = $l.attr("editor") == "true";

            if (valid && (isEditor || visible)) {
                $l.bind("blur", function () {
                    $.forms.fieldValidate(this, valid.split("|"));
                });
            }
        };

        // ���ر༭��
        function loadEditor(el) {
            var upload = "false";

            var id = el.id || el.name,
                edited = $(el).attr("editor"); //��ȡ�����޸����Ƿ�����
            upload = $(el).attr("uploads"); // ��ȡ�ϴ��ؼ��Ƿ�����

            //�����ϴ�ͼƬ�ؼ�
            if (upload == "true") {
                uploads($(el).attr("divid"), {
                    id: $(el).attr("divid"),
                    preview_hide: true,
                    file_upload_limit: $(el).attr("imgnum"),
                    file_upload_limit: $(el).attr("queuenum"),
                    message: $(el).attr("message"),
                    preview_width: $(el).attr("imgwidth"),
                    preview_height: $(el).attr("imgheight"),
                    functname: $(el).attr("functname"),
                    post_params: {
                        module: $(el).attr("module"),
                        isprdimg: $(el).attr("isprdimg") == null ? "" : $(el).attr("isprdimg")
                    }
                });
            }

            // �жϼ����������޸���
            if (edited == "true") { //�ж��Ƿ����������޸���
                if (dfs.editor = 'kind') {  //��kindEidtor�ļ��ش���
                    try {
                        if (dfs.kindEditor) {
                            // ���Ԫ�ظ����˿�Ȼ�߶Ƚ�����ֵ���༭��Ԫ���� by xp 20160922
                            if (el.style.width != "") dfs.kindEditor.config.width = el.style.width;
                            if (el.style.height != "") dfs.kindEditor.config.height = el.style.height;
                            $.forms.editors[id] = KindEditor.create('#' + id, dfs.kindEditor.config);
                        }
                    }
                    catch (_) { alert('���ر༭��ʱ�쳣' + _); throw _; };
                }
                else if (dfs.editor = 'fck') {  //��FCKEditor�ļ��ش���
                }

            }
        };

    };


    // ����ҳ��ı�Ԫ��
    $.forms = $.fn.forms;

    $.extend($.forms, {
        // �����ֶ���֤
        fieldValidate: function (o, types) {
            var vtype = "", val = o.value, isEditor = false;
            //���޸�������ȡֵ�ж�
            if ($(o).attr("editor") == "true") {
                isEditor = true;
                if (!$.forms.editors[o.id]) {
                    return;
                }
                val = $.forms.editors[o.id].html();
            }
            for (var i = 0; i < types.length; i++) { //�������ͽ������ݵ���ȷ���ж�
                vtype = types[i];
                if (vtype !== "") {
                    vtype = vtype.toLowerCase();
                    if (o.tagName == "SELECT") {
                        if (val == "-1" || val == "") {
                            var info = $(o).attr("error") || '��ѡ����Ϣ';
                            $.forms.error(o, info);
                            var pos = $(o).offset();
                            //�˴�BUG��С��ͬ־�Ժ����
                            //window.scroll(0, pos.top);
                            return false;
                        }
                    }
                    else if (o.type == "radio" || o.type == "checkbox") {
                        val = $("input[name=" + $(o).attr("name") + "]:checked", $(o).parent().parent()[0]).length;
                        if (val == 0) {
                            var info = $(o).attr("error") || '��ѡ����Ϣ';
                            $.forms.error(o, info);
                            return false;
                        }
                    }
                    else if (val.trim() == "") { //���ֵΪ��ʱ�ٴ���
                        if (vtype == "isnull") {
                            var info = $(o).attr("error") || '�����Ϊ��';
                            $.forms.error(o, info);
                            var pos = $(o).offset();
                            //�˴�BUG��С��ͬ־�Ժ����
                            //window.scroll(0, pos.top);
                            return false;
                        }
                    }
                    else {  //��ֵ��Ϊ��ʱ����
                        if (validateRegExp[vtype] != null) {
                            var pattern = new RegExp(validateRegExp[vtype]);
                            var ret = pattern.test(val);
                            var info = $(o).attr("error") || '���ݸ�ʽ����ȷ';
                            if (!ret) {
                                $.forms.error(o, info);
                                return false;
                            }
                        }

                        //��֤length����
                        var len = $(o).attr("length");

                        if (len && o.tagName !== "SELECT") {
                            var valText = $(o).value();

                            var slen = 0;
                            if (typeof (valText) == "string") {
                                slen = valText.getLength();
                            }

                            var minLen = len.toString().split('-')[0];
                            var maxLen = len.toString().split('-')[1];
                            maxLen = maxLen || 0;

                            if (slen > maxLen || slen < minLen) {
                                var info = $(o).attr("error") || '���볬���޶�����';
                                $.forms.error(o, info);
                                return false;
                            }
                        }
                    }
                }
            }
            $.forms.success(o);
            return true;
        },

        // ��¼��ǰ���еı༭����Ϣ
        editors: {},

        // ��֤�ɹ���ʱ��ʾ
        success: function (o) {
            var $o = $(o);
            var tip = $("#" + o.id + "_successTip");
            if (tip.length < 1) {
                tip = $(document.createElement(dfs.success.tagName));
                $o.after(tip[0]);
            }

            tip.attr("id", o.id + "_successTip");
            tip.addClass(dfs.success.tagCssName);

            $o.addClass(dfs.success.cssName);

            $o.bind("focus", function () {
                $(this).removeClass(dfs.success.cssName);
                $("#" + this.id + "_successTip").remove();
            });
        },

        //��֤ʧ����ʾ
        error: function (o, info) {
            var $o = $(o);
            var id = "#" + $o.attr("id") + "_ErrorTip";
            var tip = $(id);
            if (tip.length < 1) {
                tip = $(document.createElement(dfs.error.tagName));
                $o.after(tip[0]);
            }
            tip.html(info);
            tip.attr("id", $o.attr("id") + "_ErrorTip");
            //tip.addClass({'left'});

            tip.addClass(dfs.error.tagCssName);

            $o.addClass(dfs.error.cssName);
            //top.pub.error(info,5);

            $o.bind("focus", function () {
                $(this).removeClass(dfs.error.cssName);
                $(id).remove();
            });

            //��ȡ����Ŀ��
            var obj = tip[0];
            while (obj) {
                //�ж���ҳ��ı���ʾ���ǵ�����ı���ʾ
                if ($(obj).hasClass('box_content')) {
                    var _w = tip[0].parentNode.offsetWidth;

                    //����ж����ĸ���Ԫ�ظ߶�С��100,��ô��ζ�žͻᱻ��ס,���ʱ��û�������ʾ
                    if (tip[0].parentNode.offsetTop <= 100) {
                        tip.css({
                            'left': Number(_w + 10) + 'px',
                            'bottom': '1px'
                        });

                        tip.addClass('extend_error');
                    } else {
                        //�ж��Ƿ��ı���
                        if ($o[0].nodeName == 'TEXTAREA') {
                            tip.css({
                                'bottom': '57px'
                            });
                        }
                    }
                } else if ($(obj).hasClass('custom-area')) {
                    //����ж����ĸ���Ԫ�ظ߶�С��40,��ô��ζ�žͻᱻ��ס,���ʱ��û�������ʾ
                    if (tip[0].parentNode.offsetTop <= 40) {
                        var _w = $(tip[0].parentNode).width();
                        tip.css({
                            'left': Number(_w + 10) + 'px',
                            'bottom': '1px'
                        });

                        tip.addClass('extend_error');
                    } else {
                        //�ж��Ƿ��ı���
                        if ($o[0].nodeName == 'TEXTAREA') {
                            tip.css({
                                'bottom': '57px'
                            });
                        }
                    }
                }
                obj = obj.parentNode;
            }
        }
    });

    // ������ʾ��Ϣ
    var error = function (txt) {
        if (pub && pub.error) {
            if (pub.top)
                pub.top.pub.error(txt);
            else
                pub.error(txt);
        }
        else {
            alert(txt);
        }
    }

    // �ɹ���ʾ��Ϣ
    var tip = function (txt) {
        if (pub && pub.tips) {
            if (pub.top)
                pub.top.pub.tips(txt);
            else
                pub.tips(txt);
        }
        else {
            alert(txt);
        }
    }

    $.extend($.fn, {

        // ����֤
        formValidate: function () {
            var frms = this.find(dfs.tags);
            var vald = true;
            frms.each(function () {
                var $l = $(this),
                valid = $l.attr("validate"),
                visible = !$l.is(':hidden'),//��Ԫ�صĿɼ��Խ����ж�
                isEditor = $l.attr("editor") == "true",
                isRadioOrCheckbox = this.type == "radio" || this.type == "checkbox";

                if (valid && (isEditor || isRadioOrCheckbox || visible)) {
                    var result = $.forms.fieldValidate(this, valid.split("|"));
                    if (!result) {
                        vald = false;
                        return false;
                    }
                }
            });
            return vald;
        },

        // ��ȡ��Ԫ�ص�ֵ
        getValues: function (type, noEmpty) {
            return this.find(dfs.tags).serialize(type, true)
        },


        getChkValue: function (name) {  //������Ҫ��ȡ��һ������name
            var ret = new Array();
            this.find('[name="' + name + '"]').each(function (el) {
                if (el.checked) {
                    ret.push(el.value);
                }
            });
            return ret.join("|");
        },

        setChkValue: function (name, values) {  //��һ�������и�ֵ,nameһ����Ŀؼ�Name,values��Ҫ��ֵ����values�Ŀؼ�����ѡ��,values������(|)����
            if (typeof (values) == "string") {
                var vals = values.split('|');
                this.find('[name="' + name + '"]').each(function (el) {
                    for (var i = 0; i < vals.length; i++) {
                        if (vals[i] != "" && vals[i].toLowerCase() == el.value.toLowerCase()) {
                            el.checked = true;
                            return;
                        }
                    }
                });
            }
        },

        // �Ա�Ԫ�ؽ��и�ֵ
        setValues: function (data, callback, args) {
            if (typeof (data) == "object" && $.isXMLDoc(data)) {  //����XmlDocument����
                try {
                    this.find(dfs.tags).each(function () {
                        var el = this,
                        id = this.id || this.name;
                        // ����var��������name���ԵĴ���
                        if (!id && el.tagName == "VAR") id = $(el).attr('name');

                        // ֻ��id���յ�����²Ž��д���
                        if (id) {
                            if (el.type == "checkbox" || el.type == "radio") {  //�ж�checkbox,��nameΪ��
                                id = el.name || el.id;
                            }
                            // ���xml�����ݶ�������ֵ���ڲŽ��и�ֵ
                            if ($.xml.hasNode(data, id, 0)) {
                                if ($(this).attr("formatter"))
                                    setValue(el, data);
                                else
                                    setValue(el, $.xml.getNodeValue(data, id, 0)); //ȡ��xml��ֵ�����и�ֵ,���ֽڵ�Ĵ�Сд
                            }
                        }
                    });
                } catch (e) {
                    console.error('forms - 422 err:' + e);
                }
            }
            else {  //����json��ʽ�ַ�������
                var json;
                if (typeof (data) == "object") { //���ΪJson��ʽ����ֱ��ʹ��
                    json = data;
                }
                else {
                    json = eval('(' + data + ')');
                }
                if (!json) return;
                if ($.isArray(json))
                    json = json[0];
                this.find(dfs.tags).each(function () { //��Ԫ�ؽ���ѭ����ֵ
                    var id = this.name || this.id;
                    // ����var��������name���ԵĴ���
                    if (!id && this.tagName == "VAR") id = $(this).attr('name');

                    if (id) {
                        if (this.type == "checkbox" || this.type == "radio") {  //�ж�checkbox,��nameΪ��
                            id = this.name || this.id;
                        }
                        if (typeof (json[id]) != "undefined") { //���ֵ������ֵ������
                            if ($(this).attr("formatter"))
                                setValue(this, json);
                            else
                                setValue(this, json[id]);
                        }
                    }
                });
            }


            // �������ݼ�����֮����лص��������� by xp 20120724
            if (typeof (callback) == 'function') {
                if (typeof (args) == "undefined") {
                    args = [];
                }
                callback.apply(this, [window, args]);
            }

            return this;

            function setValue(el, val, form) {  //ΪԶԪ�ظ�ֵ
                // console.log(el,val,form);
                if (typeof (val) != "undefined") {  //���ֵ������ֵ������

                    //����Editor������ֵ
                    if ($(el).attr("editor") == "true") {
                        var id = el.id || el.name;
                        //$orms.editors[id].html(val);
                    }

                    //����ͼƬ����ʾͼƬ
                    if ($(el).attr("uploads") == "true") {
                        var id = el.id || el.name;
                        if (uploads && uploads.setValue) uploads.setValue($(el).attr("divid"), val);
                    }
                    else { //����ͨԪ�ؽ��д���
                        if (el.type == "select-multiple") {
                            var arry = val.split(",");
                            for (i = 0; i < el.options.length; i++) {
                                for (var j = 0; j < arry.length; j++) {
                                    if (el.options[i].value == arry[j]) {
                                        el.options[i].selected = true;
                                    }
                                }
                            }
                        }
                        else {
                            if (el.tagName == 'IMG') {
                                var imgDomain = imageDomain || ""; //���ڴ���ͼƬ��������ַ����
                                el.onload = function () {
                                    $(this).scaleZoom();
                                };
                                el.onerror = function () {
                                    el.src = pub.defImgSrc;
                                };
                                el.src = imgDomain + val;
                            }
                            else {
                                //��ʽ������method|arg0,arg1,...
                                if($(el).attr("formatter")){
                                    var formatter = $(el).attr("formatter").split('|');
                                    var functionName = formatter[0];
                                    if (typeof window[functionName] === "function") {
                                        var vals = [], args = formatter.length > 1 ? formatter[1].split(',') : [];
                                        if (args.length == 0) {
                                            args.push("data");
                                            vals.push(data);
                                        } else {
                                            for (var i = 0; i < args.length; i++) {
                                                if ($.isXMLDoc(data))
                                                    vals.push($.xml.getNodeValue(val, args[i], 0));
                                                else
                                                    vals.push(val[args[i]]);
                                            }
                                        }
                                        var fun = new Function(args, "return " + functionName + "(" + args.join(',') + ")");
                                        $(el).value(fun.apply(this, vals));
                                    } else {
                                        $(el).value(val);
                                    }
                                }
                                else if ($(el).attr("formatfloat") == "true")
                                    $(el).value(parseFloat(val).toFixed(2));
                                else
                                    $(el).value(val);
                            }
                        }
                    }
                }
            }
        },
        /*
            ���ñ�
        */
        formReset: function () {        //���ñ�Ԫ�ص�ֵ,���������defaultValue����defaultValue��ֵ�����ؼ���

            this.find(dfs.tags).each(function (el) {//���ҳ�������Ҫ�����Ԫ�ز���ȡ��Ĭ��ֵ,��Ԫ�ظ���Ĭ��ֵ
                var cel = $(el),
                    dval = cel.attr('defaultValue');
                //�ж�����
                if (el.type === 'text' || el.type === 'hidden') {
                    dval = (dval == null ? '' : dval);
                    cel.value(dval);
                } else if (el.type === 'radio') {
                    //�ж��Ƿ�����׵�
                    var parent = el.parentNode;
                    if (parent.hasAttribute('radio')) {
                        //ȫ��ȡ�����
                        $(parent).removeClass('checked');
                        el.checked = false;

                        //����һ���������
                        if (el.hasAttribute('checked')) {
                            $(parent).addClass('checked');
                            el.checked = true;
                        };
                    };
                } else if (el.type === 'checkbox') {
                    //�ж��Ƿ�����׵�
                    var parent = el.parentNode;
                    if (parent.hasAttribute('checkbox')) {
                        //ȫ��ȡ�����
                        $(parent).removeClass('checked');
                        el.checked = false;
                    };
                } else if (el.type === 'select-one') {
                    el[0].selected = true;
                } else if (cel.attr("data-type") === 'text') {
                    cel.html("");
                };

            });
            return this;
        },

        /*
            ������AjaxPost�ύ����,��Json���ݸ�ʽ�����ύ
            @1: ������
            @2: �ص�����
            @3: ��Ҫ���õİ�ť
            @4: �����url��ַ,��ҳ����Բ�����
        */
        postJson: function (action, func, btn, url) {
            this.ajaxPost(action, func, btn, url, 'json');
        },

        /*
            ������AjaxPost�ύ����,��Xml���ݸ�ʽ�����ύ
            @1: ������
            @2: �ص�����
            @3: ��Ҫ���õİ�ť
            @4: �����url��ַ,��ҳ����Բ�����
        */
        postXml: function (action, func, btn, url) {
            this.ajaxPost(action, func, btn, url, 'xml');
        },

        /*
            ������AjaxPost�ύ����
            @1: ������
            @2: �ص�����
            @3: ��Ҫ���õİ�ť
            @4: �����url��ַ,��ҳ����Բ�����
            @5: ��������,����Ĭ��Ϊxml���ݸ�ʽ�ύ
        */
        ajaxPost: function (action, func, btn, url, dataType) {

            // ����֤�ж�
            if (!this.formValidate()) {
                error("�����ݲ���ȷ");
                return;
            }

            var opt = {};
            if (arguments.length == 1 && $.isObject(arguments[0])) {
                opt = arguments[0];
            }
            else {
                opt = {
                    url: url,
                    action: action,
                    dataType: dataType || "xml",
                    callback: func,
                    arguments: [],
                    button: btn
                };
            }

            opt.data = this.getValues(dataType) + (typeof (opt.data) == "string" ? opt.data : "");

            if (opt.data == "") {
                error("�����ݲ���ȷ");
                return;
            }

            if (dataType == "json") {
                opt.data = opt.data.remove(0, 1) + "{\"action\":" + opt.action + opt.data;
            }
            else {
                opt.data = "<action>" + opt.action + "</action>" + opt.data;
            }

            var $btn = $(opt.button),
                btnHtml = $btn.html();

            $.ajax({
                url: opt.url,
                dataType: opt.dataType || "xml",
                data: opt.data,
                loading: function () {
                    if (opt.button && opt.button.disabled) {
                        opt.button.disabled = true;
                    }
                    $btn.html("�����ύ��...");
                },
                success: function () {

                    if (opt.button && opt.button.disabled) {
                        opt.button.disabled = false;
                    }

                    $btn.html(btnHtml);

                    if ($.isArray(opt.arguments)) {
                        // ������Ŀ�ͷ���Ԫ��,�ڵ�һλ
                        opt.arguments.unshift(arguments);
                    }
                    else {
                        opt.arguments = arguments;
                    }

                    if (typeof (opt.callback) == "function") {
                        opt.callback.apply(this, opt.arguments);
                    }
                },
                error: function () {

                    if (opt.button && opt.button.disabled) {
                        opt.button.disabled = false;
                    }

                    $btn.html(btnHtml);
                    error("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
                }
            });
        }


    });

    // Ĭ��������
    var dfs = {
        success: {
            cssName: "success",
            tagName: "i",
            tagCssName: "bg rm"
        },
        error: {
            cssName: "error",
            tagName: "label",
            tagCssName: "error"
        },
        editor: "kind",
        kindEditor: {
            path: "/static/Editor/KindEditor.js",
            config: {       //����editor�ķ���
                //cssPath: (typeof (jsPath) != "undefined" ? jsPath : '') + '/Editor/themes/qq/qq.css',
                filterMode: true,
                width: 'auto',
                height: '250px',
                uploadJson: '/EditorAshx/upload_json.ashx',
                fileManagerJson: '/EditorAshx/file_manager_json.ashx',
                allowFileManager: true,
                resizeType: 1,
                // allowPreviewEmoticons : false,
                // allowImageUpload : false,
                items: [
                'source', 'fullscreen', '|', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', 'lineheight', 'indent', 'outdent', '|', 'emoticons', 'table', 'image', 'multiimage', 'link']
            }
        },
        tags: 'input[type="text"],input[type="password"],input[type="hidden"],input[type="radio"],input[type="checkbox"],select,textarea,var,img,[data-type=text]'
    };

    var validateRegExp = {
        decimal: "^([+-]?)\\d*\\.\\d+$", //������
        decimal1: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", //��������
        decimal2: "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", //��������
        decimal3: "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", //������
        decimal4: "^([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", //�Ǹ����������������� + 0��
        decimal5: "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", //�������������������� + 0��
        decimal6: "^([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|[1-9]\\d*)$",   //��������������
        decimal7: "^([1-9]\\d*.\\d*|0.\\d*[0-9]\\d*|[0-9]\\d*)$",   //�������������� (����0)
        decimal8: "^([1-9]\\d*\\.\\d*|0\\.\\d*[0-9]\\d*|[0-9]\\d*)$",   //�������������� (����0)
        discount: "^0\.\d*[0-9]\d*", //20130427 �޸�
        intege: "^-?[1-9]\\d*$", //����
        intege1: "^[1-9]\\d*$", //������
        intege2: "^-[1-9]\\d*$", //������
        intege3: "^-?[0-9]\\d*$",               //������(����0)
        intege4: "^[0-9]\\d*$",                 //������(����0)
        intordec: "^([1-9]\\d*|[1-9]\\d*\\.\\d*|0\\.\\d*[1-9]\\d*)$", //������������������
        num: "^([+-]?)\\d*\\.?\\d+$", //����
        num1: "^[1-9]\\d*|0$", //������������ + 0��
        num2: "^-[1-9]\\d*|0$", //������������ + 0��
        ascii: "^[\\x00-\\xFF]+$", //��ACSII�ַ�
        english: "^[a-z]*|[A-Z]*$",                                      //��Ӣ��
        chinese: "^[\\u4e00-\\u9fa5]+$", //������
        color: "^[a-fA-F0-9]{6}$", //��ɫ
        date: "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$", //����
        email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //�ʼ�
        idcard: "^[1-9]([0-9]{14}|[0-9]{17})$", //���֤
        ip4: "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", //ip��ַ
        letter: "^[A-Za-z]+$", //��ĸ
        letter_l: "^[a-z]+$", //Сд��ĸ
        letter_u: "^[A-Z]+$", //��д��ĸ
        mobile: "^0?(13|14|15|16|17|18|19)[0-9]{9}$", //�ֻ�
        notempty: "^\\S+$", //�ǿ�
        password: "^[a-zA-Z0-9\_]{1}([a-zA-Z0-9]|[._]){5,19}$",  //ƥ�������֡�26��Ӣ����ĸ�����»�����ɵ��ַ��� ��֤�û�����:��^[a-zA-Z]w{5,17}$����ȷ��ʽΪ������ĸ��ͷ��������6-18֮�䣬
        fullNumber: "^[0-9]+$", //����
        picture: "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", //ͼƬ
        qq: "^[1-9]*[1-9][0-9]*$", //QQ����
        rar: "(.*)\\.(rar|zip|7zip|tgz)$", //ѹ���ļ�
        tel: "(^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$)|(^(13|14|15|16|17|18|19)[0-9]{9}$)", //�绰����ĺ���(������֤��������,��������,�ֻ���)
        url: "((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?", //url
        domain: "(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?", //domain
        username: "^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$", //�û���
        deptname: "^[A-Za-z0-9_()����\\-\\u4e00-\\u9fa5]+$", //��λ��
        zipcode: "^\\d{6}$", //�ʱ�
        realname: "^[A-Za-z\\u4e00-\\u9fa5]+$", // ��ʵ����
        companyname: "^[A-Za-z0-9_()����\\-\\u4e00-\\u9fa5]+$",
        companyaddr: "^[A-Za-z0-9_()����\\#\\-\\u4e00-\\u9fa5]+$",
        companysite: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&#=]*)?$",
        script: /^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/,
        code: "^[A-Za-z0-9\-\.]+$"         //���� ��Ӣ�ĺ�����
    };

}($, window);

// �Զ���ʼ����
$(function () {
    $("*[forms]").each(function () {
        $(this).forms();
        //alert(this);
    });
});
