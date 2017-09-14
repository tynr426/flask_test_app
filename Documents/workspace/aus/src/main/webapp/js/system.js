
/**
 * aus system js file
 * author: shaipe
 */

"use strict";

var app = {
    /*��Ӳ˵�*/
    addCompleted: function (parentId) {
        console.log(parentId);
        top.$e("#ApplicationInsertForm").setValues({
            PrimaryId: parentId,
            PrimaryApp: 0
        });
    },
    save: function () {

    },
    insert:function(obj){
    	
    }
}

var sys = {
    sss: function () {
    }
};

/*�˵�*/
var menu = {
    roleId: 0,
    /*��Ӳ˵�*/
    addCompleted: function (parentId, parentName, parentLayer, fkway) {
        top.$e("#FormTemplate").setValues({
            ParentId: parentId,
            ParentName: parentName,
            Layer: parentLayer,
            FKWay: fkway,
            RoleId: menu.roleId
        });
    },

    /*�ƶ�*/
    moveCompleted: function (id, realMenuId, appId, MenuName, MoveObject, parentId) {

        ECF.ajax({
            dataType: "xml",
            async: false,
            data: "<action>loadparent</action><Id>" + id + "</Id><FKFlag>" + menu.roleId + "</FKFlag><MoveObject>" + MoveObject + "</MoveObject>",
            success: function () {
                tip.hide();
                var json = ECF.parseJSON(arguments[1].text);
                if (MoveObject == 0) {
                    top.$e("#ParentId").append("<option value='0'>�ö�</option>");
                }
                $e.each(json, function (i, item) {
                    top.$e("#ParentId").append("<option value=" + item.RealMenuId + ">" + item.MenuName + "</option>")
                    $e.each(item.children, function (j, jitem) {
                        top.$e("#ParentId").append("<option value=" + jitem.RealMenuId + ">---|" + jitem.MenuName + "</option>")
                    })

                });
            },
            error: function () {
                tip.hide();
                pub.tips("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
            }
        });
        top.$e("#MoveForm").setValues({
            Id: id,
            MenuName: MenuName,
            AppId: appId,
            RealMenuId: realMenuId,
            RoleId: menu.roleId,
            ParentId: parentId
        });
    },


}

/*����*/
var config = {

    editorTypeChange: function (obj) {
        switch (obj.value) {
            case "select":
            case "radio":
            case "checkbox":
                config.addRule();
                $e("#tr_Candidate").show();
                break;
            default:
                $e("#tr_Candidate").hide();
                $e("#ul_body").html("");
                break;
        }
    },

    //��ģ��
    rowTemplate: '',

    //���һ������
    addRule: function () {
        $e("#ul_body").append(pub.iwin().$e("#rowTemplate").html());

    },

    //ɾ������
    delRule: function (node) {
        config.delNode(node);
    },

    //ɾ������
    delNode: function (node) {
        node = config.getTr(node);
        $e(node).remove();
    },

    //���tr����
    getTr: function (node) {
        while (node.parentNode) {
            if (node.tagName.toLowerCase() == "tr") {
                break;
            }
            else {
                node = node.parentNode;
            }
        }
        return node;
    },

    addConfig: function () {
        config.saveConfig("insert", this);
    },

    updateConfig: function () {
        config.saveConfig("update", this);
    },

    updateLoadCompleted: function () {
        var data = arguments[0];
        var doc = $e.parseJSON(data);
        var f = doc[0].Candidate;
        switch (doc[0].EditorType) {
            case "select":
            case "radio":
            case "checkbox":
                $e("#tr_Candidate").show();
                var html = pub.iwin().$e("#rowTemplate").html();
                $e("#ul_body").append(jte(html, f));
                break;
        }
        config.loadCompleted();
        $e("#DataValidate").val(doc[0].DataValidate);
    },

    loadCompleted: function () {

        $e.each(dict.validateRegExp, function (i, item) {
            $e("#DataValidate").append("<option value='" + i + "'>" + item + "</option>");
        });

    },
    /*��������*/
    saveConfig: function (action, dlg) {
        var fs1 = $e("#FormTemplate");
        if (!fs1.formValidate()) return;

        var fs2 = $e("#ul_body", document.getElementById("FormTemplate"));
        if (!fs2.formValidate()) return;

        var baseinfo = fs1.getValues("xml");

        var data = config.getData();

        $e.ajax({
            url: "/WebAdmin/System/Config.aspx",
            dataType: "xml",
            data: "<action>" + action + "</action>" + baseinfo + "<Candidate>" + data + "</Candidate>",
            loading: function () {
                tip.show("���ݴ����� ...");
            },
            success: function (data) {
                tip.hide();
                if (arguments[1].text > 0) {

                    pub.tips("����ɹ���", 3, function () {
                        pub.iwin().loadData();
                    });
                    dlg.close();
                }
                else {
                    pub.error("����ʧ��,������", 3);
                }
            }
        });
    },

    /*��ȡ����*/
    getData: function () {
        var str = "";
        var arr = new Array();
        $e("#ul_body tr").each(function (i) {
            arr.push($e(this).getValues("JSON"));

        });
        return '[' + arr.join(',') + ']';
    },

    /*���ع�������*/
    loadRebate: function () {

        ECF.ajax({
            dataType: "xml",
            async: false,
            data: "<action>loaddata</action>",
            loading: function () {
                tip.show("���ݴ����� ...");
            },
            success: function () {
                tip.hide();
                var json = ECF.parseJSON(arguments[1].text);
                $e("#ul_body").html(jte($e("#rebateTemplate").html(), json));
            },
            error: function () {
                tip.hide();
                pub.tips("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
            }
        });
        config.rowTemplate = $e("#rebateRowTemplate").html();
    },
    //���� ������ʾ���ֺͱ༭��
    //wordId��������id
    //editId�༭������id
    //isEdit�Ƿ�༭״̬ true=����������ʾ�༭��;false=��ʾ�������ر༭��
    //value �Ǳ༭״̬�£���ֵ������
    showSettleInput: function (wordId, editId, isEdit, value) {
        if (isEdit) {
            $e("#" + wordId).hide();
            $e("#" + editId).show();
            $e("#" + editId).find("input").focus();
        } else {
            value = value || $e("#" + wordId).html();
            $e("#" + wordId).html(value);
            $e("#" + wordId).show();
            $e("#" + editId).hide();
        }
    }
}

var configScope = {
    openScope: function (configId, desc, keyword) {
        ECF.ajax({
            dataType: "xml",
            async: false,
            data: "<action>get.configscope</action><Id>" + configId + "</Id>",
            success: function () {
                tip.hide();

                var json = arguments[1].text;

                var html = ECF("#ConfigScopeFormTemplate").html();

                pub.html({
                    content: html, width: 600, height: 400, title: "�޸�����",
                    buttons: [{ focus: true, name: "ȷ��", callback: top.configScope.saveConfig, arguments: [configId] }],
                    callback: configScope.updateCompleted,
                    completes: [configId, desc, keyword, json]
                });

            },
            error: function () {
                tip.hide();
                pub.tips("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
            }
        });


    },

    updateCompleted: function (configId, desc, keyword, data) {
        var json = ECF.parseJSON(data);
        var OpMode = [];
        var fkway = 3;
        var dic = new Array();

        $e.each(json, function (i, item) {

            if ($e.inArray(item.OpMode, OpMode) == -1) {
                OpMode.push(item.OpMode);
            }

            fkway = item.FkWay;
        });
        var doc = {
            ConfigId: configId,
            Description: desc,
            KeyWord: keyword,
            FKWay: fkway
        };



        if ($e.inArray(0, OpMode) == -1) {
            json.push({ FKFlag: 0, OpMode: 0, Hide: 1 });
        }
        else {
            doc.OpMode1 = 0;
        }
        if ($e.inArray(1, OpMode) == -1) {
            $e.each(dict.fkflag, function (i, item) {
                json.push({ FKFlag: i, OpMode: 1, Hide: 1 })
            });
        } else {
            doc.OpMode2 = 1;
        }
        top.$e("#ConfigScopeForm").setValues(doc);
        top.$e("#ul_body").html(jte($e("#rowConfigScopeTemplate").html(), json));
    },

    /*��������*/
    saveConfig: function (configId) {
        var dlg = this;
        var fs1 = $e("#ConfigScopeForm");
        if (!fs1.formValidate()) return;

        var data = configScope.getData(configId);
        if (data.length == 0) {
            pub.tips("��ѡ��");
            return;
        }
        $e.ajax({
            dataType: "xml",
            url: "/WebAdmin/System/Config.aspx",
            data: "<action>save.scope</action><Id>" + configId + "</Id><scopes>" + data + "</scopes>",

            success: function (data) {
                tip.hide();
                if (arguments[1].text > 0) {

                    pub.tips("����ɹ���", 3, function () {
                        pub.iwin().loadData();
                    });
                    dlg.close();
                }
                else {
                    pub.error("����ʧ��,������", 3);
                }
            }
        });
    },
    /*��ȡ����*/
    getData: function (configId) {
        var str = "";
        var fkway = $e("#FKWay").value();
        $e("#ul_body tr").each(function () {
            var st = $e(this).attr("style");
            if (st == undefined || st.indexOf("none") == -1)
                str += "<scope><FKWay>" + fkway + "</FKWay><ConfigId>" + configId + "</ConfigId>" + $e(this).getValues("xml") + "</scope>";

        });
        return str;
    },
    opModeChange: function (obj) {

        if (obj.value == "1") {
            if (obj.checked) {
                $e(".Saas").show();
            }
            else {
                $e(".Saas").hide();
            }
        }
        if (obj.value == "0") {
            if (obj.checked) {
                $e(".Pass").show();
            }
            else {
                $e(".Pass").hide();
            }
        }
    }
}

/*��Ʒ*/
var product = {

    /*open config*/
    openConfig: function (productId, appId, appName, fkway) {
        pub.open('/webadmin/System/ProductConfig.aspx?ProductId=' + productId + '&AppId=' + appId + "&FKWay=" + fkway, 900, 600, '���á�' + appName + '����������', [
           {
               callback: productConfig.insert, name: '����', focus: true, arguments: [productId, appId]
           },
             {
                 callback: productConfig.scanConfig, name: 'Ԥ��', focus: true, arguments: [productId, appId,appName,fkway]
             }
        ]);
    },
    /*open config*/
    openMenu: function (productId, appId,appName) {
        pub.open('/webadmin/System/ProductMenu.aspx?ProductId=' + productId + '&AppId=' + appId, 900, 600, '���á�' + appName + '���˵�Ȩ��', [
            {
                callback: productMenu.addCustomerMenu, name: '����', focus: true, arguments: [productId, appId]
            },
             {
                 callback: productMenu.scanMenu, name: 'Ԥ��', focus: true, arguments: [productId, appId,appName]
             }
        ]);
    }
}

/*��Ʒ�˵�*/
var productMenu = {

    /*��ǰѡ��Ľ�ɫ*/
    roleId: 0,

    /*��ʾ���û�Ȩ�ޣ���������Ȩ��*/
    showCheckBoxToMenu: function (productId, appid, role) {
        var htmlContent = "";
        var htmlContent1 = "";
        ECF.ajax({
            dataType: "xml",
            data: "<action>get.menu.outer.list</action><ProductId>" + productId + "</ProductId><AppId>" + appid + "</AppId><FKFlag>" + role + "</FKFlag>",
            loading: function () {
                tip.show("���ݴ����� ...");
            },
            success: function () {
                tip.hide();
                var json = ECF.parseJSON(arguments[1].text);

                json = json[0].jsonMenu;
                ECF.each(json, function (i) {
                    htmlContent1 += $e("#FirstLayerMenuTemplate").html()
                    .replace(/\{\$Id\$\}/g, json[i].Id)
                    .replace(/\{\$MenuName\$\}/g, json[i].MenuName)
                    .replace(/\{\$ImgPath\$\}/g, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJtJREFUeNpivHDhwrNnzxhwAykpKYZt27b9xwuACliAaoEsBrwApOjfv39wfsQqdiC5IuwnuiJMk9BEoCZ9+/YtdbsIXDRyNQeQXBTwmZmZGaro79+/yDbCwZ8/f1BMApo/2/MNkA0xD8IGamZiYkIoQjMJKA1hIKyDqICQ01yeI/sXwgApYmFhwRVUQCkQCQz1Q4cO4Y8WgAADAHdzc/QUjmKTAAAAAElFTkSuQmCC")
                    .replace(/\{\$IsChecked\$\}/g, json[i].CheckStatus > 0 ? "Checked" : "");
                    var children1 = json[i].children;
                    var htmlContent2 = "";
                    ECF.each(children1, function (j) {
                        htmlContent2 += $e("#SecondLayerMenuTemplate").html()
                        .replace(/\{\$Index_i\$\}/g, json[i].Id)
                        .replace(/\{\$Id\$\}/g, children1[j].Id)
                        .replace(/\{\$MenuName\$\}/g, children1[j].MenuName)
                        .replace(/\{\$IsChecked\$\}/g, (children1[j].CheckStatus > 0 ? "Checked" : ""));
                        var children2 = children1[j].children;
                        var htmlContent3 = "";
                        ECF.each(children2, function (k) {
                            htmlContent3 += $e("#ThirdLayerMenuTemplate").html()
                            .replace(/\{\$Index_i\$\}/g, json[i].Id)
                            .replace(/\{\$Index_j\$\}/g, children1[j].Id)
                            .replace(/\{\$Id\$\}/g, children2[k].Id)
                            .replace(/\{\$MenuName\$\}/g, children2[k].MenuName)
                            .replace(/\{\$IsChecked\$\}/g, (children2[k].CheckStatus > 0 ? "Checked" : ""));
                        });
                        htmlContent2 = htmlContent2.replace(/\{\$Html2\$\}/g, htmlContent3);
                    });
                    htmlContent1 = htmlContent1.replace(/\{\$Html1\$\}/g, htmlContent2);
                });
                document.getElementById("MenuList").innerHTML = htmlContent1;

                if (typeof ($e().customCheck) == 'function') {
                    $e("#MenuList").customCheck();
                }
            },
            error: function () {
                tip.hide();
                pub.tips("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
            }
        });
    },

    /*��ӿͻ��Զ���˵�*/
    addCustomerMenu: function (productId, appid) {
        var win = this.iwindow || window;
 
        var checkboxs = this.iwindow.$e("input[type=checkbox][name=menu]:checked");

        var xml = "";

        for (var i = 0; i < checkboxs.length; i++) {
            xml += "<ProductMenu>";
            xml += "<ProductId>" + productId + "</ProductId><AppId>" + appid + "</AppId><FKFlag>" + win.productMenu.roleId + "</FKFlag>";
            if ($e(checkboxs[i]).parent("div").find("#IsUpdated").val() == "1") {
                xml += "<MenuName>" + $e(checkboxs[i]).parent("div").find("#MenuName span").html() + "</MenuName>";
            }
            xml += "<MenuId>" + $e(checkboxs[i]).val() + "</MenuId><Value>" + $e(checkboxs[i]).parent("tr").find(".settle-price").html() + "</Value>";
            xml += "</ProductMenu>";
        }
        if (xml.length == 0) {
            pub.alert("��ѡ��˵���");
            return;
        }
        ECF.ajax({
            url: '/webadmin/System/ProductMenu.aspx',
            data: "<action>add.CustomerMenu</action><ProductId>" + productId + "</ProductId><AppId>" + appid + "</AppId><FKFlag>" + win.productMenu.roleId + "</FKFlag><Menus>" + xml + "</Menus>",
            success: function () {
                pub.tips("���óɹ���", 1.5);
            }
        });
    },

    /*Ԥ��*/
    scanMenu: function (productId, appId, appName) {
        pub.open('/webadmin/System/ScanProductMenu.aspx?ProductId=' + productId + '&AppId=' + appId, 900, 600, 'Ԥ����' + appName + '���˵�Ȩ��', [
           
            {
                callback: productMenu.downSql, name: '����', focus: true, arguments: [productId, appId]
            }
        ]);

    },

    /*downSql*/
    downSql: function (productId, appid) {
       
        var dl = this;
        var win = this.iwindow || window;
        win.tip.show("���������� ...");
        ECF.ajax({
            url: '/webadmin/System/ProductMenu.aspx',
            data: "<action>create.down.menu</action><AppId>" + appid + "</AppId><ProductId>" + productId + "</ProductId>",
            success: function () {
                win.tip.hide();
                dl.close();
                var json = ECF.parseJSON(arguments[1].text);

                if (json.status == "0") {
                    pub.tips(json.result, 3);
                }
                else {
                    window.location.href = "../../" + json.result;
                }
            },
            error: function () {
                win.tip.hide();
                tip.hide();
                pub.tips("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
            }
        });
    },

    /*�򿪲˵��Ի���*/
    openMenuDialog: function (id, menuName) {
        pub.dialog('�޸Ĳ˵�', $e("#UpdateMenuNameFormTemplate").html(), 600, 500,
            [{
                callback: productMenu.updateMenu,
                arguments: [id]
            }],
            productMenu.updateMenuCompleted, [menuName]);
    },

    /*�޸Ĳ˵�*/
    updateMenu: function (id) {
        var name = top.$e("#MenuName").val();
        var menuName = top.$e("#ReMenuName").val();
        if (menuName.length == 0 || name == menuName) {
            this.close();
            return;
        }
        $e("#" + id).find("#MenuName span").html(menuName);
        $e("#" + id).find("#IsUpdated").val(1);
        this.close();
    },

    /*��������ɺ����*/
    updateMenuCompleted: function (name) {

        top.$e("#UpdateMenuNameForm").setValues({
            MenuName: name,
            ReMenuName: name
        });
    }
}

/*��Ʒ����*/
var productConfig = {

    /*insert*/
    insert: function (productId, appId) {
        var dl = this;
        var checkboxs = this.iwindow.$e("input[type=checkbox][name=Id]:checked");

        var xml = "";

        for (var i = 0; i < checkboxs.length; i++) {

            xml += "<ProductConfig><ProductId>" + productId + "</ProductId><PrimaryAppId>" + appId + "</PrimaryAppId><ConfigId>" + $e(checkboxs[i]).val() + "</ConfigId><Value>" + $e(checkboxs[i]).parent("tr").find(".settle-price").html() + "</Value></ProductConfig>";
        }
        ECF.ajax({
            url: '/webadmin/System/ProductConfig.aspx',
            data: "<action>insert</action><ConfigIds>" + xml + "</ConfigIds><ProductId>" + productId + "</ProductId><AppId>" + appId + "</AppId>",
            success: function () {
                pub.tips("���óɹ���", 1.5);
            }
        });
    },

    /*load app config*/
    loadConfig: function (productId, appId, fkway) {

        $e("#pageBody").loadList("bodyListTemplate",
        "<ProductId>" + productId + "</ProductId><AppId>" + appId + "</AppId><FKWay>" + fkway + "</FKWay>",
        "loaddata", null, null, "/webadmin/System/ProductConfig.aspx");
    },

    /*load app config*/
    loadAppConfig: function (productId, appId,fkway) {

        $e("#pageBody").loadList("bodyListTemplate",
        "<ProductId>" + productId + "</ProductId><AppId>" + appId + "</AppId><FKWay>"+fkway+"</FKWay>",
        "loaddata.app", null, function () {
            if (typeof $e().customCheck === 'function') {

                $e(document).customCheck();
            }
        }, "/webadmin/System/ProductConfig.aspx");
    },

    /*Ԥ��*/
    scanConfig: function (productId, appId,appName,fkway) {
        pub.open('/webadmin/System/ScanProductConfig.aspx?ProductId=' + productId + '&AppId=' + appId+"&FKWay="+fkway, 900, 600, 'Ԥ����' + appName + '����������', [
            
            {
                callback: productConfig.downSql, name: '����', focus: true, arguments: [appId, productId,fkway]
            }
        ]);

    },

    /*downSql���*/
    downSql: function (appid, productId,fkway) {
        var dl = this;
        var win = this.iwindow || window;
        win.tip.show("����ͬ���� ...");
        ECF.ajax({
            url: '/webadmin/System/ProductConfig.aspx',
            data: "<action>create.down.config</action><AppId>" + appid + "</AppId><ProductId>" + productId + "</ProductId><FKWay>" + fkway + "</FKWay>",
            success: function () {
                win.tip.hide();
                dl.close();
                var json = ECF.parseJSON(arguments[1].text);

                if (json.status == "0") {
                    pub.tips(json.result, 3);
                }
                else {
                    window.location.href = "../../" + json.result;
                }

            },
            error: function () {
                win.tip.hide();
                tip.hide();
                pub.tips("���ݴ������,�������: " + arguments[0] + ";������Ϣ: " + arguments[1], 1.5);
            }
        });
    }
}

var api = {
    addParameter: function (id) {
    	var body = $e("#" + id + "Body");
    	var json = [{"Length" : body.length}];
    	var html = pub.iwin().$e("#api" + id + "ParameterTemplate").html();
    	body.append(jte(html,json));
    },

    save:function(){

    	var dlg = this,
    	cnt = this.dom.content;
    	var forms = cnt.find("#ApiInsertForm").forms();

    	var data = forms.getValues() ;

    	var requestParameters = new StringBuilder();
    	var requestTrs = cnt.find("#RequestBody").children();
    	for(var i=0; i<requestTrs.length; i++){
    		requestParameters.append("<param>" + requestTrs[i].forms().getValues()+ "</param>");
    	}

    	data += "<requestParameters>" + requestParameters.toString() + "</requestParameters>";

    	var responseParameters = new StringBuilder();
    	var responseTrs = cnt.find("#ResponseBody").children();
    	for(var i=0; i<responseTrs.length; i++){
    		responseParameters.append("param>" + responseTrs[i].forms().getValues() + "</param>");
    	}
    	
		data += "<responseParameters>" + responseParameters.toString() + "</responseParameters>";
    	
    	$e.ajax({
    		dataType: "xml",
    		data: "<action>save</action>" + data,
    		success:function(){
    			console.log(arguments[1].text);
    		},
    		error:function(){

    		}
    	});
    }
};