/**
 * aus system js file
 * author: shaipe
 */

"use strict";

var custom = {
    save: function () {

    }
}
/*website*/
var website = {
    /*add completed excute*/
    addCompleted: function (CustomId, AppId, ProductId, SN) {

        $e("#SiteForm").setValues({
            CustomerId: CustomId,
            AppId: AppId,
            ProductId: ProductId,
            SN: SN
        });
        console.log(CustomId);
    }
}

/*domain*/
var siteDomain = {
    /*add completed excute*/
    addCompleted: function (siteId) {

        $e("#DomainForm").setValues({
            SiteId: siteId
        });
    },
    loadDomain: function (siteId) {

        if ($e("#domainlist_" + siteId).html().length > 0) return;
        $e("#domainlist_" + siteId).loadList("DomainListTemplate",
     "<Id>" + siteId + "</Id>",
     "loaddata", null, null, "/webadmin/custom/Domain.aspx");
    }
}

/*database*/
var dbase = {
    /*add completed excute*/
    addCompleted: function (customerId, customappId, productId) {

        $e("#DbaseForm").setValues({
            CustomerId: customerId,
            ProductId: productId,
            PrimaryAppId: customappId
        });
    },
    loadDBase: function (customId, appId, productId) {

        $e("#dbaseList_" + appId + "_" + productId).loadList("DBaseListTemplate",
        "<CustomId>" + customId + "</CustomId><AppId>" + appId + "</AppId><ProductId>" + productId + "</ProductId>",
        "loaddata", null, null, "/webadmin/custom/DBase.aspx");
    },
    updateFinish: function (customId, appId, productId) {

        this.close();
        dbase.loadDBase(customId, appId, productId);
    }
}

/*客户*/
var custom = {
    updateCompleted: function (ctlId, secendId, thirdId, doc) {
        var json = ECF.parseJSON(doc)[0];
        $e.areas.apply(this, [ctlId, secendId, thirdId, function () {
          
            $e("#Province").val(json.Province);
            $e("#Province").trigger("change", json.Province);
            //$e("#City").val(json.City);
            //$e("#Area").val(json.Area);
        }]);
    }
}

/*客户详情*/
var customDetail = {
    productList: [],
    productChange: function (obj) {
        $e.each(customDetail.productList, function (i, item) {
            if (item.Id == obj.value) {

                console.log(dict.fkway[item.FKWay]);
                item.FKWayDesc = dict.fkway[item.FKWay];
                $e("#InsertCustomerProductForm").setValues(item);
            }
        });
    },
    /*open config*/
    openConfig: function (customId, appId, productId) {
        pub.open('/webadmin/Custom/CustomerConfig.aspx?CustomId=' + customId + '&AppId=' + appId + "&ProductId=" + productId, 900, 600, '客户配置', [
           {
               callback: customConfig.insert, name: '保存', focus: true, arguments: [customId, appId, productId]
           },
        {
            callback: customConfig.scanConfig, name: '预览', focus: true, arguments: [customId, productId, appId]
        }
        ]);
    },
    /*open config*/
    openMenu: function (customId, appId, productId) {
        pub.open('/webadmin/Custom/CustomerMenu.aspx?CustomId=' + customId + '&AppId=' + appId + "&ProductId=" + productId, 900, 600, '客户菜单', [
            {
                callback: customMenu.addCustomerMenu, name: '保存', focus: true, arguments: [customId, appId, productId]
            },
             {
                 callback: customMenu.scanMenu, name: '预览', focus: true, arguments: [customId, productId, appId]
             }
        ]);
    },
    addCompleted: function (customId, productId) {

        $e("#InsertAppForm").setValues({
            CustomerId: customId,
            ProductId: productId
        });
        ECF.ajax({
            dataType: "xml",
            async: false,
            url: '/webadmin/Custom/CustomerProduct.aspx',
            data: "<action>load.wait.add.app</action><CustomId>" + customId + "</CustomId><ProductId>" + productId + "</ProductId>",
            success: function () {
                tip.hide();
                var json = ECF.parseJSON(arguments[1].text);

                $e.each(json, function (i, item) {

                    $e("#AppId").append("<option value=" + item.AppId + ">" + item.AppName + "</option>")

                });
            },
            error: function () {
                tip.hide();
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    }


}

/*客户服务器*/
var customServer = {

    /*加载*/
    loadData: function (customerId) {
        $e("#ServerList").loadList("CustomerServerListTemplate",
      "<CustomerId>" + customerId + "</CustomerId>",
      "loaddata", null, null, "/webadmin/custom/CustomerServer.aspx");
    },

    /*添加弹出框完成后调用*/
    addCompleted: function (customerId) {

        $e("#InsertCustomerServerForm").setValues({
            CustomerId: customerId
        });
        ECF.ajax({
            dataType: "xml",
            async: false,
            url: '/webadmin/Custom/CustomerServer.aspx',
            data: "<action>load.wait.add.server</action><CustomerId>" + customerId + "</CustomerId>",
            success: function () {
                tip.hide();
                var json = ECF.parseJSON(arguments[1].text);

                $e.each(json, function (i, item) {

                    $e("#ServerId").append("<option value=" + item.Id + ">" + item.Name + "</option>")

                });
            },
            error: function () {
                tip.hide();
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    },

    /*更新完成后触发*/
    updateFinish: function (customerId) {
        this.close();
        customServer.loadData(customerId);
    }
}
/*customer's config*/
var customConfig = {
    /*insert*/
    insert: function (customId, appId, productId) {
        var dl = this;
        var checkboxs = this.iwindow.$e("input[type=checkbox][name=Id]:checked");

        var xml = "";

        for (var i = 0; i < checkboxs.length; i++) {

            xml += "<ProductConfig><ProductId>" + productId + "</ProductId><PrimaryAppId>" + appId + "</PrimaryAppId><ConfigId>" + $e(checkboxs[i]).val() + "</ConfigId><Value>" + $e(checkboxs[i]).parent("tr").find(".settle-price").html() + "</Value></ProductConfig>";
        }
        ECF.ajax({
            url: '/webadmin/Custom/CustomerConfig.aspx',
            data: "<action>insert</action><ConfigIds>" + xml + "</ConfigIds><CustomId>" + customId + "</CustomId><ProductId>" + productId + "</ProductId><AppId>" + appId + "</AppId>",
            success: function () {
                pub.tips("设置成功！", 1.5);
                //刷新父级
                pub.iwin().customConfig.loadConfig(customId, appId, productId);
            }
        });
    },

    /*del*/
    del: function (id, obj) {
        ECF.ajax({
            url: '/webadmin/Custom/CustomerConfig.aspx',
            data: "<action>delete</action><Id>" + id + "</Id>",
            success: function () {
                if (arguments[1].text > 0) {
                    pub.tips("设置成功！", 1.5, function () {
                        $e(customConfig.getTr(obj)).remove();
                    });
                } else {
                    pub.tips("设置失败！", 1.5);
                }
            }
        });
    },

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

    /*load config*/
    loadConfig: function (customId, appId, productId) {
       
        $e("#configList_" + appId + "_" + productId).loadList("CustomerConfigListTemplate",
        "<CustomId>" + customId + "</CustomId><AppId>" + appId + "</AppId><ProductId>" + productId + "</ProductId>",
        null, null, null, "/webadmin/custom/CustomerConfig.aspx");
    },

    /*load app config*/
    loadAppConfig: function (customId, appId, productId) {

        $e("#pageBody").loadList("bodyListTemplate",
        "<CustomId>" + customId + "</CustomId><AppId>" + appId + "</AppId><ProductId>" + productId + "</ProductId>",
        "loaddata.app", null, null, "/webadmin/custom/CustomerConfig.aspx");
    },
    /*预览*/
    scanConfig: function (customId, productId, appId) {
        pub.open('/webadmin/Custom/ScanCustomerConfig.aspx?CustomId=' + customId + '&ProductId=' + productId + '&AppId=' + appId, 900, 600, '预览客户拥有的配置', [
            {
                callback: customConfig.syncSql, name: '同步', focus: true, arguments: [customId, appId, productId]
            },
            {
                callback: customConfig.downSql, name: '下载', focus: true, arguments: [customId, appId, productId]
            }
        ]);

    },

    /*同步sql*/
    syncSql: function (customId, appid, productId) {
        var dl = this;
        var win = this.iwindow || window;
        win.tip.show("正中同步中 ...");
        ECF.ajax({
            url: '/webadmin/Custom/CustomerConfig.aspx',
            data: "<action>create.sync.config</action><CustomId>" + customId + "</CustomId><AppId>" + appid + "</AppId><ProductId>" + productId + "</ProductId>",
            success: function () {
                win.tip.hide();
                pub.tips(arguments[1].text, 3);
                dl.close();

            },
            error: function () {
                win.tip.hide();
                tip.hide();
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    },

    /*create sql语句*/
    downSql: function (customId, appid, productId) {
        var dl = this;
        var win = this.iwindow || window;
        win.tip.show("正中同步中 ...");
        ECF.ajax({
            url: '/webadmin/Custom/CustomerConfig.aspx',
            data: "<action>create.down.config</action><CustomId>" + customId + "</CustomId><AppId>" + appid + "</AppId><ProductId>" + productId + "</ProductId>",
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
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    }
}

/*customer's menu*/
var customMenu = {

    roleId: 0,

    /*显示该用户权限，并可设置权限*/
    showCheckBoxToMenu: function (customId, appid, role, productId) {
        var htmlContent = "";
        var htmlContent1 = "";
        ECF.ajax({
            dataType: "xml",
            url: '/webadmin/Custom/CustomerMenu.aspx',
            data: "<action>get.menu.outer.list</action><CustomId>" + customId + "</CustomId><AppId>" + appid + "</AppId><FKFlag>" + role + "</FKFlag><ProductId>" + productId + "</ProductId>",
            loading: function () {
                tip.show("数据处理中 ...");
            },
            success: function () {
                tip.hide();
                var json = ECF.parseJSON(arguments[1].text);
                var isSpecial = json[0].isSpecial;
                json = json[0].jsonMenu;
                ECF.each(json, function (i) {
                    htmlContent1 += $e("#FirstLayerMenuTemplate").html()
                    .replace(/\{\$Id\$\}/g, json[i].Id)
                    .replace(/\{\$MenuName\$\}/g, json[i].MenuName)
                    .replace(/\{\$ImgPath\$\}/g, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJtJREFUeNpivHDhwrNnzxhwAykpKYZt27b9xwuACliAaoEsBrwApOjfv39wfsQqdiC5IuwnuiJMk9BEoCZ9+/YtdbsIXDRyNQeQXBTwmZmZGaro79+/yDbCwZ8/f1BMApo/2/MNkA0xD8IGamZiYkIoQjMJKA1hIKyDqICQ01yeI/sXwgApYmFhwRVUQCkQCQz1Q4cO4Y8WgAADAHdzc/QUjmKTAAAAAElFTkSuQmCC")
                    .replace(/\{\$IsChecked\$\}/g, (json[i].CheckStatus > 0 || isSpecial == 0) ? "Checked" : "");
                    var children1 = json[i].children;
                    var htmlContent2 = "";
                    ECF.each(children1, function (j) {
                        htmlContent2 += $e("#SecondLayerMenuTemplate").html()
                        .replace(/\{\$Index_i\$\}/g, json[i].Id)
                        .replace(/\{\$Id\$\}/g, children1[j].Id)
                        .replace(/\{\$MenuName\$\}/g, children1[j].MenuName)
                        .replace(/\{\$IsChecked\$\}/g, ((children1[j].CheckStatus > 0 || isSpecial == 0) ? "Checked" : ""));
                        var children2 = children1[j].children;
                        var htmlContent3 = "";
                        ECF.each(children2, function (k) {
                            htmlContent3 += $e("#ThirdLayerMenuTemplate").html()
                            .replace(/\{\$Index_i\$\}/g, json[i].Id)
                            .replace(/\{\$Index_j\$\}/g, children1[j].Id)
                            .replace(/\{\$Id\$\}/g, children2[k].Id)
                            .replace(/\{\$MenuName\$\}/g, children2[k].MenuName)
                            .replace(/\{\$IsChecked\$\}/g, ((children2[k].CheckStatus > 0 || isSpecial == 0) ? "Checked" : ""));
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
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    },

    /*添加客户自定义菜单*/
    addCustomerMenu: function (customId, appid, productId) {
        var win = this.iwindow || window;
        var strId = win.check.getValue("MenuList");
        if (strId.length == 0) {
            pub.alert("请选择菜单！");
            return;
        }
        ECF.ajax({
            url: '/webadmin/Custom/CustomerMenu.aspx',
            data: "<action>add.CustomerMenu</action><MenuIds>" + strId + "</MenuIds><CustomId>" + customId + "</CustomId><AppId>" + appid + "</AppId><FKFlag>" + win.customMenu.roleId + "</FKFlag><ProductId>" + productId + "</ProductId>",
            success: function () {
                pub.tips("设置成功！", 1.5);
            }
        });
    },

    /*预览*/
    scanMenu: function (customId, productId, appId) {
        pub.open('/webadmin/Custom/ScanCustomerMenu.aspx?CustomId=' + customId + '&ProductId=' + productId + '&AppId=' + appId, 900, 600, '预览客户拥有的菜单', [
            {
                callback: customMenu.syncSql, name: '同步', focus: true, arguments: [customId, appId, productId]
            },
            {
                callback: customMenu.downSql, name: '下载', focus: true, arguments: [customId, appId, productId]
            }
        ]);

    },

    /*同步*/
    syncSql: function (customId, appid, productId) {
        var dl = this;
        var win = this.iwindow || window;
        win.tip.show("正在中同步中 ...");
        ECF.ajax({
            url: '/webadmin/Custom/CustomerMenu.aspx',
            data: "<action>create.sync.menu</action><CustomId>" + customId + "</CustomId><AppId>" + appid + "</AppId><ProductId>" + productId + "</ProductId>",
            success: function () {
                win.tip.hide();
                dl.close();
                pub.tips(arguments[1].text, 3);
            },
            error: function () {
                win.tip.hide();
                tip.hide();
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    },

    /*下载*/
    downSql: function (customId, appid, productId) {
        var dl = this;
        var win = this.iwindow || window;
        win.tip.show("正在处理中 ...");
        ECF.ajax({
            url: '/webadmin/Custom/CustomerMenu.aspx',
            data: "<action>create.down.menu</action><CustomId>" + customId + "</CustomId><AppId>" + appid + "</AppId><ProductId>" + productId + "</ProductId>",
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
                pub.tips("数据处理错误,错误代码: " + arguments[0] + ";错误信息: " + arguments[1], 1.5);
            }
        });
    }
}


