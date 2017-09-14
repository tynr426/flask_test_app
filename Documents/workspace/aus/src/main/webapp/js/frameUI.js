/*
	平台后台管理专用JS 
 */

//整体框架的初始化
var initFrame = function () {
    //环境变量
    var p = $('.wrap'),
		t = $('*[init=head]'),
		b = $('*[init=body]'),
		f = $('*[init=foot]'),
		sky = '';

    if (p.length <= 0) return;

    if (t.length >= 1) {
        sky += (sky == '' ? '' : ';') + 'top:' + t[0].offsetHeight + 'px';
    }

    if (f.length >= 1) {
        sky += (sky == '' ? '' : ';') + 'bottom:' + f[0].offsetHeight + 'px';
    }

    if (b.length >= 1) {
        if (sky != '') {
            b.attr('style', sky);
        }
    }
};

//高级搜索事件
var expert = function (obj) {
    var obj = $(obj.parentNode),
		close = 'expert-close',
		open = 'expert-open';

    if (obj.hasClass(close)) {
        obj.addClass(open).removeClass(close);
    } else {
        obj.addClass(close).removeClass(open);
    }

    return;
};

//高级查询窗体点击事件
var filterWindow = function () {
    $(window).bind('click', function (evt) {
        var evts = null;
        if (evt != undefined) {
            evts = evt;
        }
        else {
            evts = evt ? evt : window.event;
        };
        var tar = evts.target ? evts.target : evts.srcElement;
        while (tar) {
            /* 满足条件 */
            if ($(tar).hasClass('expert-open')) {
                return;
            };
            /* 不满足条件 */
            if ($(tar).hasClass('custom-area')) {
                filterClose();
                return;
            };
            tar = tar.parentNode;
        };
    });
};

//高级查询外部调用关闭事件
var filterClose = function () {
    //查找到高级查询功能
    var obj = $('.extend-button');
    if (obj.length <= 0) return;
    obj.each(function (index, i) {
        var btn = $('a.btn', this);
        btn.each(function (index, i) {
            if (this.innerHTML == '高级查询') {
                var par = this.parentNode;

                if ($(par).hasClass('expert-open')) {
                    $(par).addClass('expert-close').removeClass('expert-open');
                }
            }
        });
    });
};

//表格的操作事件
var tableTool = {
    //外层对象
    obj: null,
    //外层列表对象
    tables: null,
    //遍历外层对象机器
    findObjDoms: function (obj) {
        var _obj = obj;

        while (_obj) {
            if (_obj.nodeType == 1 && _obj.nodeName == 'DIV' && $(_obj).hasClass('form')) {
                return _obj;
            }

            _obj = _obj.parentNode;
        }
    },
    //遍历列表对象机器
    findTableDoms: function (obj) {
        var _obj = obj;

        while (_obj) {
            if (_obj.nodeType == 1 && _obj.nodeName == 'TABLE') {
                return _obj;
            }

            _obj = _obj.parentNode;
        }
    },
    //移入
    over: function (obj) {
        //列表对象
        if (tableTool.tables == null) {
            tableTool.tables = tableTool.findTableDoms(obj);
        }

        if (typeof (tableTool.tables) == 'object') {
            //主体对象
            if (tableTool.obj == null) {
                tableTool.obj = tableTool.findObjDoms(obj);
            }

            //让主体对象溢出显示
            $(tableTool.obj).css({
                'overflow': 'visible'
            });
        }

        //如果是操作栏操作
        if ($(obj).hasClass('tool')) {
            var showbox = $(obj).find('.tool-menu');
            var list = $(obj).find('a');

            //调整只有一个的时候的样式
            if (list.length === 1) {
                showbox.css({
                    'bottom': '-3px'
                });
            } else if (list.length === 5) {
                showbox.css({
                    'bottom': '-22px'
                });
            } else if (list.length > 5) {
                var i = 0;
                var sum = 0;
                for (; i < (list.length - 5) ; i++) {
                    sum = sum + 24;
                }

                showbox.css({
                    'bottom': -Number(sum + 14) + 'px'
                });
            }
        }

        $(obj).addClass('open').removeClass('close');

        //图片补全
        if (typeof $.lazy === 'function') {
            $(obj).nonePic();
        }

        return;
    },
    //移除
    out: function (obj) {
        if (typeof (tableTool.tables) == 'object') {
            //让主体对象溢出不显示
            $(tableTool.obj).css({
                'overflow': 'hidden'
            });
        }

        $(obj).addClass('close').removeClass('open');

        return;
    }
};

//后台图片库管理查看大图
var checkPic = {
    obj: null,
    click: function (srcs) {
        if (srcs == '' || typeof (srcs) == "object" || typeof (srcs) == null) return;

        if (checkPic.obj == null) {
            checkPic.obj = $('#check-pic');
        }

        //获取图片对象
        var imgs = $('#pic-view', checkPic.obj[0])[0];
        imgs.setAttribute('src', '');
        imgs.setAttribute('socknonepic', '1');

        //获取当前窗体高度
        var h = $(window).height();
        //获取滚动条高度
        var s = $(window).scrollTop();

        //设置放大图图片
        var img = new Image();
        img.onload = function () {
            imgs.src = this.src.toString();
        };
        img.onerror = function () {
            imgs.src = error;
        };
        img.src = srcs.toString();
        var extend = /\.[^\.]+$/.exec(srcs);
        if ($("#Associate").length > 0) {
            $("a", document.getElementById("Associate")).each(function (i, item) {
                var title = $(this).attr("title");
                $(this).html("<img lazy_src='" + srcs + title + extend + "'/>");
            });
        }

        checkPic.obj.css({
            'top': Number((h + s - checkPic.obj.height()) / 2) + 'px',
            'display': 'block'
        });

        //图片补全
        if (typeof $.lazy === 'function') {
            $(checkPic.obj[0]).nonePic();
        }
    },
    close: function () {
        checkPic.obj.css({
            'display': 'none'
        });
    }
};
//后台选择品牌
var brandChoose = {
    click: function (obj) {
        var _obj = obj;

        //父级
        var par = $('#brandlist');

        var allInput = $('.limit-select > label', par[0]);

        //获取子集个数
        var list = $('dd', par[0]);

        var o = 0;

        while (_obj) {
            if (_obj.nodeName == 'DD') {
                if ($(_obj).hasClass('select')) {
                    $(_obj).removeClass('select');
                } else {
                    $("#BrandListBox").find("dd").removeClass('select');
                    $(_obj).addClass('select');
                }

                //获取选中的个数
                for (var i = 0; i < list.length; i++) {
                    if ($(list[i]).hasClass('select')) {
                        o++;
                    }
                }

                if (o > 0 && o < list.length) {
                    allInput.removeClass('checked').addClass('half-checked');
                } else if (o == list.length) {
                    allInput.removeClass('half-checked').addClass('checked');
                } else if (o == 0) {
                    allInput.removeClass('half-checked').removeClass('checked');
                }

                return;
            }

            _obj = _obj.parentNode;
        }
    },
    checkall: function (obj) {
        //父级
        var par = $('#brandlist');

        if (par.length <= 0) return;

        //查找品牌列表子集
        var list = $('dd', par[0]);

        var allInput = obj.parentNode;
        if ($(allInput).hasClass('checked')) {
            //全部取消选中
            var i = 0;
            for (; i < list.length; i++) {
                var _this = $(list[i]);
                if (_this.hasClass('select')) {
                    _this.removeClass('select');
                }
            }
        } else {
            //全部选中子集
            var i = 0;
            for (; i < list.length; i++) {
                var _this = $(list[i]);
                if (!_this.hasClass('select')) {
                    _this.addClass('select');
                }
            }
        }
    }
};


//加载执行
$(function () {
    initFrame();

    //高级查询窗体点击事件
    filterWindow();
});

//窗体改变
var rtime = new Date(1, 1, 2000, 12, 00, 00);
var timeout = false;
var delta = 200;
$(window).bind('resize', function () {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    };
});
function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        //Doing
        initFrame();
    };
};