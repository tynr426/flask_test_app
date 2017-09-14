var frame = {

    currentLink: null,

    currentLinkBox: null,

    // 页面跳转
    //菜单地址跳转
    go: function (link, o, target) {

        if (target == "_blank") {
            window.open(link);
        }
        var o = $(o);
        var ifr = $("#contentIframe");

        if (frame.currentLinkBox) {
            frame.currentLinkBox.removeClass("select");
        }

        if (o.length > 0) {
            frame.currentLinkBox = o.parent("li");
            o.parent("li").addClass("select");
        }

        var body = $("body");
        // 判断是否为ie或fireforx浏览器
//        if (ECF.browsers.msie || ECF.browsers.firefox) {
//            body == $('body,html');
//        }
        body.animate({ scrollTop: 0 }, 500);

        window.scrollTo(0, 0);

        if (link != "" && link != 'undefined') {
            //给链接地址加上随机数以达到刷新的效果
            link = link + (link.indexOf("?") > 0 ? '&' : '?') + 'rnd=' + Math.random().toString();

            //alert(link);
            ifr[0].src =  link;

            ifr[0].onload = function () {

                // 处理自动适应高度
                frame.dynSize("contentIframe");

                ifr[0].onload = null;

                setTimeout(function () {

                }, 0);
            };
        }
    },

    // iframe自动适应高度
    dynSize: function (iframeId, noInit) {
        return;
        var browserVersion = window.navigator.userAgent.toUpperCase();

        var iframe = document.getElementById(iframeId);
        var bHeight = 0;

        if (!noInit) {
            iframe.style.height = "auto";
        }

        if (browserVersion.indexOf("CHROME") == -1 && browserVersion.indexOf("SAFARI") == -1)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (browserVersion.indexOf("FIREFOX") != -1)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (browserVersion.indexOf("MSIE") == -1 && browserVersion.indexOf("OPERA") == -1)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else {
            bHeight = bHeight + 3;
        }

        var height = Math.max(bHeight, dHeight);

        if (height < 530) height = 530;

        iframe.style.height = height + "px";

    },

    // 自动计算iframe的高度
    autoSize: function (init) {
        if (init == undefined) {
            init = true;
        }
        frame.dynSize("contentIframe", init);
    },

    // 加载页面菜单
    loadMenu: function () {
        console.log(11);
        $("#MenuList").loadList("MenuTemplate", null, "menu.list", null, null, "/Store.axd");
    }

};

//菜单
var menuAction = function () {
    var my = {
        //主体框架
        obj: null,
        //主体框架闭合状态
        objActive: '',
        //菜单框架
        menu: null,
        //菜单框架闭合状态
        menuActive: '',
        //区域内容
        area: null,
        //子集列表
        list: null,
        //子集列表长度
        max: 0,
        //子集列表单个高度
        listHeight: 0,
        //显示层
        showPanel: null,
        //整个显示层列表
        showList: null,
        //展开收缩对象
        targetBtn: null,
        //cookie对象
        cookieid: 'webadmin_menu_target',
        //主体关闭样式
        objClose: 'box-close',
        //主体展开样式
        objOpen: 'box-open',
        //显示层关闭样式
        menuClose: 'menu-close',
        //显示层展开样式
        menuOpen: 'menu-open',
        //缓存临时展开的列表
        showListNow: null,
        //缓存在cookie的IFrame值
        cookielinkid: 'webadmin_menu_url',
        //列表展开&关闭速度(单位:毫秒)
        speed: 200,
        //记录一级目录当前点击对象的缓存
        level_1_btn_cache: null,
        //记录二级目录当前点击对象的缓存
        level_2_btn_cache: null
    };

    if (my.obj == null) {
        my.obj = $('*[salemenu=box]');
    }

    if (my.menu == null) {
        my.menu = $('*[salemenu=menu]');
    }

    if (my.area == null) {
        my.area = $('*[salemenu=area]');
    }

    //判定主框架的存在
    if (my.obj == null && my.menu == null && my.area == null) return;

    //根据cookie获取展开关闭状态
    var cookie = getCookie(my.cookieid);//$.cookie.get(my.cookieid);
    if (cookie==null||typeof (cookie) == 'undefined') {
        my.obj.removeClass(my.objClose).addClass(my.objOpen);
        my.menu.removeClass(my.menuClose).addClass(my.menuOpen);
        my.objActive = my.objOpen;
        my.menuActive = my.menuOpen;
        addCookie(my.cookieid, my.menuOpen);
    } else {
        if (cookie == my.menuOpen) {
            my.obj.removeClass(my.objClose).addClass(my.objOpen);
            my.menu.removeClass(my.menuClose).addClass(my.menuOpen);
            my.objActive = my.objOpen;
            my.menuActive = my.menuOpen;
        } else {
            my.obj.removeClass(my.objOpen).addClass(my.objClose);
            my.menu.removeClass(my.menuOpen).addClass(my.menuClose);
            my.objActive = my.objClose;
            my.menuActive = my.menuClose;
        }
    }

    //cookie获取当前点击后的存储值
    //var cookielink = $.cookie.get(my.cookielinkid);
    //if (typeof (cookielink) == 'undefined') {
    //    var iFrame = $('#contentIframe');
    //    if (iFrame.length <= 0) return;
    //    var sr = iFrame.attr('src').toString();

    //    $.cookie.set(my.cookielinkid, sr);
    //}

    //点击后更换url值
    var targetUrl = function (sr) {
        //$.cookie.set(my.cookielinkid, sr.match(/\([^\)]+\)/g)[0].replace('(\'', '').replace('\')', ''));
        $.cookie.set(my.cookielinkid, sr);
    };

    //检查菜单栏的闭合情况
    var targetObj = function () {
        if (my.obj.hasClass(my.objOpen) && my.menu.hasClass(my.menuOpen)) {
            my.obj.removeClass(my.objOpen).addClass(my.objClose);
            my.menu.removeClass(my.menuOpen).addClass(my.menuClose);
            my.objActive = my.objClose;
            my.menuActive = my.menuClose;
            $.cookie.set(my.cookieid, my.menuClose);
        } else {
            my.obj.removeClass(my.objClose).addClass(my.objOpen);
            my.menu.removeClass(my.menuClose).addClass(my.menuOpen);
            my.objActive = my.objOpen;
            my.menuActive = my.menuOpen;
            $.cookie.set(my.cookieid, my.menuOpen);
        }

        //刷新滚动组件
        if ($.iscroll) {
            $.iscroll.refresh();
        }
    };

    //获取子集列表
    if (my.list == null) {
        my.list = $('*[salemenu=list]', my.menu[0]);
        //获取子集列表总长度
        my.max = my.list.length;
        // var liSize = $(my.list[0]).size();
        // console.log(liSize);
        //子集列表高度
        my.listHeight = $(my.list[0]).height();
    }

    //获取显示层
    if (my.showPanel == null) {
        my.showPanel = $('*[salemenu=showbox]');
    }

    //获取显示层所有列表
    if (my.showList == null) {
        my.showList = $('*[salemenu=showlist]');
    }

    //获取展开收缩对象
    if (my.targetBtn == null) {
        my.targetBtn = $('*[salemenu=sliderbar]');
    }

    //闭合同级元素
    var removeStyle = function () {
        var i = my.max;
        while (--i >= 0) {
            var _this = my.list[i];
            //先回到原来的高度
            $(_this).animate({
                'height': my.listHeight + 'px'
            }, 300, function () {
                $(_this).removeClass('select');

                //刷新滚动组件
                if ($.iscroll) {
                    $.iscroll.refresh();
                }
            });
        }
    };

    //点击对象加上选中
    var addStyle = function (obj) {
        var show = $('*[salemenu=showbox]', obj);
        var show_hei = parseInt(show[0].getAttribute('salemenu_height'));

        $(obj).addClass('select');

        $(obj).animate({
            'height': Number(show_hei + my.listHeight) + 'px'
        }, 300, function () {
            //刷新滚动组件
            if ($.iscroll) {
                $.iscroll.refresh();
            }
        });
    };

    //取消所有显示子集的样式
    var removeShowListStyle = function () {
        var max = my.showList.length;
        var i = max;

        while (--i >= 0) {
            $(my.showList[i]).removeClass('select');
        }
    };

    //冒泡找父级
    var findParent = function (obj, name) {
        var _obj = obj;
        while (_obj) {
            if (_obj.hasAttribute('salemenu') && _obj.getAttribute('salemenu') == name) {
                return _obj;
            }
            _obj = _obj.parentNode;
        }
    };

    //显示层初始化
    var showListInit = function () {
        //一级目录初始化
        if (my.list.length <= 0) { return; }

        my.list.each(function () {
        	
            var $this = $(this),
            height = $this.height();
            $this.attr('normal_height', height + 'px');

            //二级目录初始化
            if (my.showPanel.length <= 0) { return; }

            if (my.objActive != 'box-close' && my.menuActive != 'menu-close') {
                my.showPanel.each(function () {
                    //获取二级目录
                    var showList = $('*[salemenu=showlist]', this);
                    var showListLength = showList.length;

                    //获取并计算元素的高度
                    var showListHeight = Number($(showList[0]).height() * showListLength);

                    //设置二级目录高度
                    $(this).attr('normal_height', showListHeight);

                    //获取三级目录
                    showList.each(function () {
                        //设置尺寸
                        $(this).attr('normal_height', $(this).height());

                        var level = $('*[salemenu-level=box]', this);

                        level.each(function () {
                            var level_list = $('*[salemenu-level-list=list]', this);
                            if (level_list.length > 0) {
                                //计算三级目录高度
                                var level_height = Number(70 * level_list.length);
                              
                                //设置目录高度
                                $(this).attr('normal_height', level_height);
                            }
                        });
                    });
                });
            }
        });
    };
    showListInit();

    //绑定子集事件
    var bindList = function () {
        //一级目录点击事件
        if (my.list.length <= 0) { return; }

        my.list.each(function () {
            var level_1_btn = $('a.name', this);

            var levle_1_box = this;

            //一级目录点击事件
            if (level_1_btn.length > 0) {
                level_1_btn.bind('click', function () {
                    //只有在展开状态下才能被点击
                    if (my.objActive == 'box-open' && my.menuActive == 'menu-open') {
                        //如果没有展开就设置展开状态,否则要设置关闭状态
                        if ($(levle_1_box).hasClass('select')) {
                            //关闭

                            //回收选中样式
                            $(levle_1_box).removeClass('select');
                        } else {
                            //展开

                            //判断是不是点击新的按钮
                            if (my.level_1_btn_cache === null) {
                                my.level_1_btn_cache = this;

                                $(levle_1_box).addClass('select');
                            } else if (my.level_1_btn_cache !== null && my.level_1_btn_cache !== this) {
                                my.level_1_btn_cache = this;

                                //取消同级选中
                                my.list.each(function () {
                                    if ($(this).hasClass('select')) {
                                        //回收选中样式
                                        $(this).removeClass('select');
                                    }
                                });

                                $(levle_1_box).addClass('select');
                            } else if (my.level_1_btn_cache !== null && my.level_1_btn_cache === this) {
                                $(levle_1_box).addClass('select');
                            }
                        }

                        //iScroll刷新
                        if ($.iscroll) {
                            $.iscroll.refresh();
                        }
                    }
                });
            }
        });

        //二级目录点击事件
        var level_2_btn = $('a.level-2-btn');

        if (level_2_btn.length > 0) {
            level_2_btn.each(function () {
                $(this).bind('click', function () {
                    var par = this.parentNode.parentNode;

                    //如果没有展开就设置展开状态,否则要设置关闭状态
                    if ($(par).hasClass('select')) {
                        //关闭

                        //回收选中样式
                        $(par).removeClass('select');
                    } else {
                        //展开

                        //判断是不是点击新的按钮
                        if (my.level_2_btn_cache === null) {
                            my.level_2_btn_cache = par;

                            $(par).addClass('select');
                        } else if (my.level_2_btn_cache !== null && my.level_2_btn_cache !== par) {
                            my.level_2_btn_cache = par;

                            //取消同级选中
                            $('*[salemenu=showlist]').each(function () {
                                //如果父级元素只有一个子集,那么就不取消选中了
                                if($('*[salemenu=showlist]' ,this.parentNode).length > 1){
                                    if ($(this).hasClass('select')) {
                                        //回收选中样式
                                        $(this).removeClass('select');
                                    }
                                }
                            });

                            $(par).addClass('select');
                        } else if (my.level_2_btn_cache !== null && my.level_2_btn_cache === par) {
                            $(par).addClass('select');
                        }
                    }

                    //刷新滚动组件
                    if ($.iscroll) {
                        $.iscroll.refresh();
                    }
                });
            });
        }

        //三级目录点击事件
        var level_3_btn = $('a.level-3-btn');

        if (level_3_btn.length > 0) {
            level_3_btn.each(function () {
                $(this).bind('click', function () {
                    var par = this.parentNode;

                    var level_list = $('*[salemenu-level-list=list]');
                    level_list.each(function () {
                        if ($(this).hasClass('select')) {
                            $(this).removeClass('select');
                        }
                    });

                    $(par).addClass('select');

                    //获取点击的值
                    var sr = $(this).attr('savename');

                    //记录值
                    if (typeof (sr) == 'string' && sr != '') {
                        targetUrl(sr);
                    }
                });
            });
        }
    };
    bindList();

    //获取IFrame对象的地址
    var getiFrame = function () {
        var sr ="";// $.cookie.get(my.cookielinkid);

        if (typeof (sr) == 'undefined') return;

        var links = '';

        var obj = null;

        var list = $('a.level-3-btn');
        list.each(function () {
            var str = this.getAttribute('savename');
            if (sr === str) {
                obj = this;

                var clink = this.href.toString().match(/\([^\)]+\)/g);

                if (clink != null) {
                    links = clink[0].replace('(\'', '').replace('\')', '');
                }
            }
        });

        //父级
        var listParent = $(obj).parent();

        //找到显示层
        var showSpan = findParent(obj, 'showlist');

        //找到根级
        var grandParent = findParent(obj, 'list');

        //全部加上选中标记
        $(listParent).addClass('select');

        $(showSpan).addClass('select');

        $(grandParent).addClass('select');

        my.level_1_btn_cache = grandParent;

        my.level_2_btn_cache = showSpan;
        
        //刷新滚动组件
        if ($.iscroll) {
            $.iscroll.refresh();
        }

        frame.go(links);
    };
    getiFrame();
};

var main = {
    // iframe自动适应高度
    dynSize: function (iframeId, noInit) {

        var browserVersion = window.navigator.userAgent.toUpperCase();

        var iframe = document.getElementById(iframeId);

        var bHeight = 0;

        if (!noInit) {
            iframe.style.height = "auto";
        }

        if (browserVersion.indexOf("CHROME") == -1 && browserVersion.indexOf("SAFARI") == -1) {
            bHeight = iframe.contentWindow.document.body.scrollHeight;
        }

        var dHeight = 0;
        if (browserVersion.indexOf("FIREFOX") != -1)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (browserVersion.indexOf("MSIE") == -1 && browserVersion.indexOf("OPERA") == -1)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else {
            bHeight = bHeight + 3;
        }

        var height = Math.max(bHeight, dHeight);

        if (height < 530) height = 530;

        //整体框架计算尺寸
        var nHeight = main.synSize(height, iframe);

        iframe.style.height = nHeight + "px";

        //获取菜单子集
        //var menu_list = $('#menu-content');
        //设置菜单子集高度
        //menu_list.css({ 'height': Number($('#roomActive').height() - 30) + 'px' });
    },

    //整体框架自适应高度
    synSize: function (height, iframe) {
        //环境变量
        var p = $('.wrap'),
            t = $('*[init=head]'),
            theight = 0,
            b = $('*[init=body]'),
            f = $('*[init=foot]'),
            fheight = 0,
            room = $('*[init=room]');

        if (p.length <= 0) return;

        if (t.length >= 1) {
            theight = t[0].offsetHeight;
        }

        if (f.length >= 1) {
            fheight = f[0].offsetHeight;
        }

        //减掉10个像素的margin-top
        var size = Number($(window).height() - theight - fheight - 10);

        //判断左侧菜单栏是不是超标
        var menuHeight = 0;
        if (main.leftMenu != null) {
            menuHeight = main.leftMenu[0].offsetHeight;
        }

        if (height < size) {
            height = size;
        }

        if (height < menuHeight) {
            height = menuHeight;
        }

        if (b.length >= 1) {
            b.css({
                'height': height + 'px'
            });
        }

        if (room.length >= 1) {
            if (b.length >= 1) {
                if ($(window).width() <= 1024) {
                    room.css({
                        'width': '960px'
                    });
                } else {
                    room.css({
                        'width': '1200px'
                    });
                }
            }
        }

        return height;
    },
    // 退出登录
    loginout: function () {
        if (confirm('真的要退出管理后台吗?')) {
            var today = new Date();
            var expires = new Date();
            expires.setTime(today.getTime() - 1);
            document.cookie = 'AdminName=\'\'; path=/; expires=' + expires.toGMTString();
            document.cookie = 'PName=0; path=/; expires=' + expires.toGMTString();
            $.ajax({
                url: "/aus/toLoginOut.do",
                data: '<action>logout</action>',
                dataType: 'xml',
                async:false,
                success: function () {
                    alert("你已成功退出管理后台");
                    window.location.href = '/aus/toLogin.do';
                }
            });
        }
    },
    // 自动计算iframe的高度
    autoSize: function (init) {
        if (init == undefined) {
            init = true;
        }
        //main.dynSize("contentIframe", init);
    }
}

var cssStyle={
		 //返回需要获取CSS尺寸样式的高度
        cssHeight: function () {
            if (this.length < 1) return 0;
            var obj = this[0];
            var size = ['height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width'];
            var i = size.length;
            var o = 0;
            while (--i >= 0) {
                o = o + getCssSize(obj, size[i]);
            };
            return o;
        },

        //获取CSS样式中的尺寸值
        cssSize: function (obj, style) {
            var si = 0;
            var _obj = [];
            if (obj.style[style]) {
                var regx = /([\S]+)px/ig;
                var sizer = regx.exec(obj.style[style])[0];
                if (!sizer) {
                    sizer = '0px';
                };
            } else if (obj.currentStyle) {
                try {
                    var regx = /([\S]+)px/ig;
                    var sizer = regx.exec(obj.currentStyle[style])[0];
                    if (!sizer) {
                        sizer = '0px';
                    };
                } catch (e) {
                    sizer = '0px';
                };
            } else if (window.getComputedStyle) {
                try {
                    propprop = style.replace(/([A-Z])/g, "-$1");
                    propprop = style.toLowerCase();
                    var sizer = document.defaultView.getComputedStyle(obj, null);
                    if (sizer) {
                        var regx = /([\S]+)px/ig;
                        sizer = regx.exec(sizer.getPropertyValue(style))[0];
                    } else {
                        sizer = '0px';
                    };
                } catch (e) {
                    sizer = '0px';
                };
            };
            if (sizer === 'auto' || sizer === '0px') {
                si = 0;
            } else {
                si = Number(sizer.replace('px', ''));
            };
            return si;
        },
        //返回需要获取CSS尺寸样式的宽度
        cssWidthSize: function (obj) {
            if (!tools.check(obj)) return;
            var _obj = $e(obj);
            var size = ['width', 'margin-left', 'margin-right', 'padding-left', 'padding-right', 'border-left-width', 'border-right-width'];
            var i = size.length;
            var o = 0;
            while (--i >= 0) {
                o = o + tools.cssSize(_obj[0], size[i]);
            };
            return o;
        },
        //返回需要获取CSS尺寸样式的高度
        cssHeightSize: function (obj) {
            if (!tools.check(obj)) return;
            var _obj = $e(obj);
            var size = ['height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width'];
            var i = size.length;
            var o = 0;
            while (--i >= 0) {
                o = o + tools.cssSize(_obj[0], size[i]);
            };
            return o;
        }
}
