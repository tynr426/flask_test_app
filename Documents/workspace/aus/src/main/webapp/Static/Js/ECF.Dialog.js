
/*!
 * ECF JavaScript Dialog Library v2.0.1
 * 弹出层Js文件
 *
 * Includes ECF.js
 *
 * Copyright 2011, 2014 , shaipe
 *
 * Date: 2014-07-16T21:02Z
 * Modify:  xp 2012/2/16
 *          by xp 2014/02/21 修改confirm时的题,并提供可以自义标题
 *          by xp 20140716 修改弹出时遮罩大小
 *          by xp 20140718 修改cofirm提示问题
 */


!function ($e, win) {
    var _dlg, _skin, _path,
        _count = 0,
        _$win = $e(window),
        _$doc = $e(document),
        _isIE6 = window.VBArray && !window.XMLHttpRequest,
        _isMoblie = ECF.browsers.mobile,
        _expando = 'ecDialog' + (new Date).getTime();

    var _dialog = {

        /* 
			px与%单位转换成数值 (百分比单位按照最大值换算)
			其他的单位返回原值
		*/
        toNumber: function (tv, mv) {
            if (!tv && tv !== 0 || typeof tv === 'number') {
                return tv;
            };

            var last = tv.length - 1;
            if (tv.lastIndexOf('px') === last) {
                tv = parseInt(tv);
            } else if (tv.lastIndexOf('%') === last) {
                tv = parseInt(mv * tv.split('%')[0] / 100);
            };
            //console.log('0:' + tv)
            if (typeof (tv) == "string" && tv.toLowerCase() != "auto") {
                tv = parseInt(tv);
            }
            //console.log('1:' + tv)
            return tv;
        },

        /*
			让ie6 css支持png背景
		*/
        fixPng: _isIE6 ? function () {
            var i = 0, elem, png, pngPath, runtimeStyle,
                path = artDialog.defaults.path + '/skins/',
                list = this.dom.wrap[0].getElementsByTagName('*');

            for (; i < list.length; i++) {
                elem = list[i];
                png = elem.currentStyle['png'];
                if (png) {
                    pngPath = path + png;
                    runtimeStyle = elem.runtimeStyle;
                    runtimeStyle.backgroundImage = 'none';
                    runtimeStyle.filter = "progid:DXImageTransform.Microsoft." +
                        "AlphaImageLoader(src='" + pngPath + "',sizingMethod='crop')";
                };
            };

        } : function () { },

        /*
			解析HTML片段中自定义类型脚本，其this指向artDialog内部
			<script type="text/dialog">/* [code] * /</script>
		*/
        runScript: function (ele) {
            var fun, i = 0, n = 0,
                tags = ele.getElementsByTagName('script'),
                length = tags.length,
                script = [];

            for (; i < length; i++) {
                if (tags[i].type === 'text/dialog') {
                    script[n] = tags[i].innerHTML;
                    n++;
                };
            };

            if (script.length) {
                script = script.join('');
                fun = new Function(script);
                fun.call(this);
            };
        },

        taskBar: function () {
        },

        setStyle: function (el, property, val) {			//设置样式
            if (typeof el != 'object') el = $e(el)[0];
            switch (property) {
                case 'opacity':
                    if (el.filters) {

                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        if (!el.currentStyle.hasLayout) {
                            el.style.zoom = 1;
                        }
                    } else {
                        el.style.opacity = val;
                        el.style['-moz-opacity'] = val;
                        el.style['-khtml-opacity'] = val;
                    }
                    break;
                default:
                    el.style[property] = val;
            }
            el = null;
        },

        //获取鼠标当前位置的X坐标
        mouseX: function (ev) {
            if (ev.pageX) {
                return ev.pageX;
            }
            return ev.clientX + document.body.scrollLeft - document.body.clientLeft;
        },

        //获取鼠标当前位置的Y坐标
        mouseY: function (ev) {
            if (ev.pageY) {
                return ev.pageY;
            }
            return ev.clientY + document.body.scrollTop - document.body.clientTop;
        },

        //屏幕宽度
        docWidth: function () {
            //获取窗口可显示内容的宽度
            return Math.max(document.body.clientWidth, document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);

        },
        //屏幕高度
        docHeight: function () {
            //获取窗口可显示内容的高度
            return Math.max(document.body.clientHeight, document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
        }
    };

    //ecDialog.list = [];

    //弹出层主方法
    var ecDialog = $e.dialog = ECF.dialog = function (c, ok, cancel) {

        ECF.event.stopDefault(); //阻止浏览器的鼠标事件默认行为

        c = c || {};
        //如果直接传入的为字符串或html节点的处理
        if (typeof (c) == "string" || c.nodeType == 1) {
            c = { content: c, fixed: !_isMoblie };
        };

        var api,
            dfs = ecDialog.defaults,
            ele = c.follow = this.nodeType == 1 && this || c.follow;
        //处理默认配置
        for (var i in dfs) {
            if (c[i] == undefined) c[i] = dfs[i];
        }
        //处理跟随对象
        if (typeof (ele) == "string") ele = $e(ele)[0];

        //如果为移动设备,不使用fixed,fixed对移动设置支持不好
        if (_isMoblie) c.fixed = false;

        //配置弹出对象的id
        c.id = ele && ele[_expando + 'follow'] || c.id || _expando;

        c.id += ecDialog._count;//确定层的唯一

        api = ecDialog.list[c.id];

        //如果对象已经存在则设计当前对象为焦点对象然后返回
        if (ele && api) return api.follow(ele).zIndex().focus();
        if (api) return api.zIndex().focus();


        //按钮对列处理
        if (!$e.isArray(c.button)) {
            c.button = c.button ? [c.buttion] : [];
        }

        if (ok != undefined) c.ok = ok;
        //alert(ok);
        if (cancel != undefined) c.cancel = cancel;
        //处理确定按钮到按钮队列
        c.ok && c.button.push({
            name: c.okVal,
            callback: typeof (c.ok) == "function" ? c.ok : function () { this.close(); },
            arguments: [],
            focus: true
        });
        //处理取消按钮到按钮队列
        c.cancel && c.button.push({
            name: c.cancelVal,
            callback: typeof (c.cancel) == "function" ? c.cancel : function () { this.close(); },
            arguments: []
        });

        //zIndex全局变量
        if (ecDialog.defaults.zIndex > 0) {
            c.zIndex = ecDialog.defaults.zIndex;
        }
        else {
            ecDialog.defaults.zIndex = c.zIndex;
        }

        ecDialog._count++;

        //给list对列附值并返回弹出层实例化对象
        return ecDialog.list[c.id] = _dlg ? _dlg._init(c) : new ecDialog.fn._init(c);

    };

    //ecDialog方法扩展
    ecDialog.fn = ecDialog.prototype = {
        version: '1.1.0.1',
        create: '2012/1/3',
        build: '2012/1/18',
        //弹出层相关信息
        info: {
            summary: '',
            author: 'xp',
            modeInfo: ''
        },

        //弹出层初始化
        _init: function (c) {
            var my = this, dom;
            my._isRun = true;
            my.config = c;
            my.dom = dom = my._initDom();

            my[c.show ? 'show' : 'hide'](true);

            my.title(c.title)
                .content(c.content, true)
                .button(c.button)
                .size(c.width, c.height)
                .position(c.left, c.top)
                .time(c.time);

            c.follow ? my.follow(c.follow) : my.position(c.left, c.top);

            my.zIndex().focus();

            // 锁定界面
            c.lock && my.lock();

            //事件绑定
            my._addEvent();

            //alert(c.ok);
            c.init && c.init.call(my, window);
            //alert("dialog" + window.location);

            // 当弹出层初始化完之后再执行的方法 by 20120724
            if (c.finish) {
                var cc = c.finish;
                if (typeof (cc.method) == 'function') {
                    if (ECF.isArray(cc.arguments)) {
                        cc.arguments.unshift(window);
                    }
                    else {
                        cc.arguments = [window];
                    }
                    cc.method.apply(my, cc.arguments);
                }
            }

            return my;
        },

        /*
			设置标题
			param {string, bool} 标题内容.为false则隐藏标题栏
			return {this, HTMLElement} 如果没有参数则返回内容器dom对象
		*/
        title: function (txt) {
            var dom = this.dom,
                wrap = dom.wrap,
                title = dom.title,
                tinfo = dom.title_info;

            if (txt == undefined) return title[0];

            if (txt == false) {
                dom.title_left.hide();
                title.hide().html('');
                dom.title_right.hide();
                //dom.main.css("overflow","hidden");
            } else {
                tinfo.html(txt);
            }

            return this;

        },

        /*
		   设置内容
		   @param	{String, HTMLElement}	内容 (可选)
		   @return	{this, HTMLElement}		如果无参数则返回内容容器DOM对象
		 */
        content: function (txt) {
            try {

                var my = this,
                    dom = my.dom,
                    content = dom.content[0];

                //try{	//ie6,7,8时会出问题
                content.focus();
                //}catch(e){};
                //txt没有定义的时候返回dom元素
                if (txt == undefined) return content;

                if (typeof (txt) == 'string') {
                    content.innerHTML = txt;
                    // var div = document.createElement("span");
                    // div.innerHTML = txt;
                    // txt = div;
                }
                else if (txt && txt.nodeType == 1) {
                    content.innerHTML = "";

                    if (txt.parentNode) {
                        my["contentParent"] = txt.parentNode;
                        my["thisContent"] = txt;
                    }
                    //alert(txt);
                    txt.style.display = 'block';

                    try {	//在ie6,7,8中执行时会出现异常
                        content.appendChild(txt);
                    }
                    catch (e) {
                        content.innerHTML = txt.outerHTML;
                    }

                };

                //此处不能使用dom.content.find,查找之后会改变dom.content的值
                //把焦点移入显示层中的第一个输入框中 
                var inputs = $e('input[type="text"]', dom.content[0]);
                if (inputs.length > 0) {
                    if (inputs[0].offsetTop > 0) inputs[0].focus();
                }

                return my;
            } catch (e) { alert('dialog 321 error content: ' + e); return this; }
        },

        // 给内容添加提示图标信息
        icon: function (src) {
            var my = this;
            if (src) {
                my.config.icon = src;
            }
            return my;
        },

        /*
		   位置(相对于可视区域)
		   @param	{Number, String}
		   @param	{Number, String}
		 */
        position: function (l, t) {
            var my = this,
                c = my.config,
                dom = my.dom,
                fixed = _isIE6 ? false : c.fixed,
                ie6Fixed = _isIE6 && c.fixed,
                docl = _$doc.scrollLeft(),
                doct = _$doc.scrollTop(),
                dl = fixed ? 0 : docl,
                dt = fixed ? 0 : doct,
                ww = _$win.width(),
                wh = _$win.height(),
                ow = dom.wrap[0].offsetWidth,
                oh = dom.wrap[0].offsetHeight,
                sy = dom.wrap[0].style;

            if (l || l == 0) {	//定位弹出层的左边位置
                my._left = l.toString().indexOf('%') !== -1 ? l : null;
                l = _dialog.toNumber(l, ww - ow);
                if (typeof (l) === 'number') {
                    l = ie6Fixed ? (l += docl) : l + dl;
                    sy.left = Math.max(l, dl) + 'px';
                } else if (typeof (l) === 'string') {
                    if (l == "auto") {
                        var ll = (ww - ow) / 2;
                        ll = fixed ? ll : docl + ll;
                        sy.left = ll + 'px';
                    }
                    else {
                        sy.left = l;
                    }
                };
            };

            if (t || t == 0) {	//定位弹出层的顶部位置
                my._top = t.toString().indexOf('%') !== -1 ? t : null;
                t = _dialog.toNumber(t, wh - oh);

                if (typeof t === 'number') {
                    if (ie6Fixed) {
                        t = t + doct;
                    }
                    else {
                        t = fixed ? t : t + dt;
                    }
                    sy.top = Math.max(t, dt) + 'px';
                } else if (typeof t === 'string') {
                    if (t == "auto") {
                        var tt = (wh - oh) / 2;
                        tt = fixed ? tt : doct + tt;
                        sy.top = (tt < 0 ? 0 : tt) + 'px';
                    }
                    else {
                        sy.top = t;
                    }
                };
                //console.log(_$doc.scrollTop() + '-' + sy.top);
            };

            if (l != undefined && t != undefined) {
                my._follow = null;
            }

            if (fixed) {	//设置绝对定位
                dom.wrap.css('position', 'fixed');
            }

            return my;
        },

        /*
		 	尺寸
		 	@param	{Number, String}	宽度
		 	@param	{Number, String}	高度
		 */
        size: function (w, h) {
            var my = this, maxW, maxH, scaleW, scaleH,
                dom = my.dom,
                wrap = dom.wrap,
                main = dom.main,
                c = my.config,
                w = w || c.width,
                h = h || c.height;

            //给title和button设置自动宽度
            dom.wrap[0].style.width = dom.main[0].style.width = dom.buttons[0].style.width = dom.title[0].style.width = dom.content[0].style.width = "auto";

            //获取需要除掉的边距
            var _w = ['margin-left', 'margin-right', 'border-left-width', 'border-right-width', 'padding-left', 'padding-right'];
            var _h = ['margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width', 'padding-top', 'padding-bottom'];
            var _sumw = 0;
            var _sumh = 0;
            for (var i = 0; i < _w.length; i++) {
                _sumw = _sumw + ecDialog.cssSize(dom.content[0], _w[i]);
                _sumh = _sumh + ecDialog.cssSize(dom.content[0], _h[i]);
            }

            //设置宽度
            function setWidth(w) {
                var mxw = _$win.width() - wrap[0].offsetWidth + main[0].offsetWidth,//最大宽度
                    toplrw = dom.top_left[0].offsetWidth + dom.top_right[0].offsetWidth,//顶部左右边框宽度
                    tlrw = dom.title_left[0].offsetWidth + dom.title_right[0].offsetWidth,//标题左右边框宽度
                    mlrw = dom.main_left[0].offsetWidth + dom.main_right[0].offsetWidth,//main左右边框宽度
                    blrw = dom.buttons_left[0].offsetWidth + dom.buttons_right[0].offsetWidth,//按钮左右边框宽度
                    bomlrw = dom.bottom_left[0].offsetWidth + dom.bottom_right[0].offsetWidth,//底部左右边框宽度
                    ww = w;


                if (w > 0) {	//当传入的宽度为数字
                    ww = w;
                }
                else if (typeof (w) == "string") {	//判断百分比
                    if (w != "auto") {

                        ww = _dialog.toNumber(w, maxW);

                    }
                    else { //判断传入的为字符串

                        var titlew = dom.title[0].offsetWidth;
                        //ie6时不能准确取到title的宽度需要把里面二个元素的宽度取出相加
                        if (_isIE6) {
                            if (dom.title_info[0]) dom.title_info[0].style.width = "auto";
                            var tbw = 0;
                            if (dom.title_Buttons && dom.title_Buttons[0]) {
                                dom.title_Buttons[0].style.width = "auto";
                                tbw = dom.title_Buttons[0].offsetWidth;
                            }
                            titlew = tbw + dom.title_info[0].offsetWidth;
                        }

                        ww = Math.max(dom.main[0].offsetWidth, titlew, dom.buttons[0].offsetWidth) + Math.max(toplrw, tlrw, mlrw, blrw, bomlrw);

                        if (ww > c.maxWidth) {
                            if (_isIE6 || (ECF.browser == "ie" && ECF.browserVersion == "7.0"))
                                ww = c.maxWidth;
                        }
                    }
                }



                wrap[0].style.width = ww + "px";
                dom.top_center[0].style.width = ww - toplrw + "px";
                dom.title[0].style.width = ww - tlrw + "px";
                dom.main[0].style.width = ww - mlrw + "px";
                dom.buttons[0].style.width = ww - blrw + "px";
                dom.bottom_center[0].style.width = ww - bomlrw + "px";
                dom.content[0].style.width = (ww - mlrw - _sumw) + 'px';

                //console.log(dom.main[0].style.width);
            }

            //设置高度
            function setHeight() {
                var wh,
                    toph = dom.top_center[0].offsetHeight,
                    th = dom.title[0].offsetHeight,
                    mh = dom.main[0].offsetHeight,
                    bh = dom.buttons[0].offsetHeight,
                    bomh = dom.bottom_center[0].offsetHeight;

                if (h > 0) {
                    wh = h;
                }
                else if (typeof (h) == "string") {	//判断百分比
                    if (h != "auto") {
                        wh = _dialog.toNumber(w, maxW);
                    }
                    else { //判断传入的为字符串
                        wh = toph + th + mh + bh + bomh;
                    }
                }
                //console.log('451:'+ c.id + " - " + wh);
                wrap[0].style.height = wh + 'px';

                //dom.dom.top_center[0].style.width = ww - toplrw +"px";

                dom.buttons_left[0].style.height = dom.buttons_right[0].style.height = dom.buttons[0].offsetHeight + 'px';

                var _sumwh = Number(wh - toph - th - bh - bomh);
                dom.main_left[0].style.height = dom.main[0].style.height = dom.main_right[0].style.height = _sumwh + 'px';
                dom.content[0].style.height = (_sumwh - _sumh) + 'px';
                //console.log(dom.main[0].style.height);
            }

            setWidth(w ? w : "auto");

            setHeight(h ? h : "auto");
            return my;
        },

        /*
		  跟随元素
		  @param	{HTMLElement, String}
		 */
        follow: function (ele) {
            var my = this;

            if (typeof (ele) == "string" || ele && ele.nodeType == 1) {
                $ele = $e(ele);
                ele = $ele[0];
            };

            if (!ele || !ele.offsetWidth && !ele.offsetHeight) {
                return my.position(my._left, my._top);
            }


            return my;
        },

        /*
			可爱的左右晃动效果
		*/
        shake: function () {
            var my = this,
                timerId, style = my.dom.wrap[0].style,
                p = [4, 8, 4, 0, -4, -8, -4, 0],
                fx = function () {
                    style.marginLeft = p.shift() + 'px';
                    if (p.length <= 0) {
                        style.marginLeft = 0;
                        clearInterval(timerId);
                    };
                };
            p = p.concat(p.concat(p));
            timerId = setInterval(fx, 20);
            return my;
        },

        /*
		  自定义按钮
		  @example
			button({
				name: 'login',
				callback: function () {},
				disabled: false,
				focus: true
			}, .., ..)
		*/
        button: function () {
            var my = this,
                dom = my.dom, c = my.config,
                btns = dom.buttons,
                blsts = my._btnlist || {},
                blst = arguments[0];
            if (blst) {
                my._btnlist = blsts;
                $e.each(blst, function (i, bk) {
                    if (typeof (bk) != "object") return;
                    var name = bk.name,
                        isNew = !blsts[name],
                        btn = !isNew ? blsts[name].element : document.createElement('button');
                    btn.setAttribute("type", "button");

                    if (!name || name == '') return my;
                    if (!blsts[name]) my._btnlist[name] = blsts[name] = {};
                    if (bk.callback) {//callback是否存在
                        blsts[name].callback = bk.callback;
                        blsts[name].arguments = bk.arguments;
                        btn.onclick = function () {
                            //console.log("click");
                            if (!$e.isArray(bk.arguments)) bk.arguments = [];

                            if (!bk.arguments.contains(this)) {
                                //  把要点击的按钮元素回传到执行的方法的第一个参数
                                bk.arguments.push(this);
                            }

                            // 把要点击的按钮元素传递到回调执行的方法之中;
                            //my.ButtonElement = btn;

                            bk.callback && bk.callback.apply(my, bk.arguments);
                        };

                        btn.ondblclick = function () {
                            //console.log("dbl click");
                            return false;
                        };
                    }

                    if (bk.className) btn.className = bk.className;
                    if (bk.focus) {
                        my.focus();
                        btn.className += ' ' + c.className + '_button_focus';
                    }

                    btn.disabled = !!bk.disabled;
                    if (isNew) {
                        btn.innerHTML = name;
                        btns.append(btn);
                        blsts[name].element = btn;
                    }
                });
                btns.css('display', 'block');
            }
            else {	//没有给定button时隐藏
                btns.css('display', 'none');
            }
            return my;
        },

        /*
			显示对话框
		*/
        show: function () {
            var my = this;

            return my;
        },

        /*
			隐藏对话框
		*/
        hide: function () {
        },

        /*
			关闭对话框
		*/
        close: function () {
            if (!this._isRun) return this;
            var my = this,
                dom = my.dom,
                wrap = dom.wrap,
                title = dom.title,
                content = dom.content,
                list = ecDialog.list,
                fn = my.config.close;
            //content[0].focus();


            //如果在config中提供了关闭方法则执行关闭方法
            if (typeof (fn) == 'function' && fn.call(my, window) == false) {
                return false;
            }

            //处理传入对象时把原Node还回到Dom中
            if (my["contentParent"] && my["thisContent"]) {
                var txt = my["thisContent"];
                txt.style.display = 'none';
                my["contentParent"].appendChild(txt);
            }

            //是否启用动画效果的判断
            if (my.config.animate) {
                wrap.animate({ height: '10px', opacity: .1 }, 400, close);
            }
            else {
                close();
            }
            //alert(close);
            //关闭弹出层
            function close() {
                title.html('');
                wrap.remove();
                if (my._minBtn) {	//删除任务栏上的图标
                    var $btn = $e(my._minBtn),
                        p = $btn[0].parentNode;
                    $btn.remove();
                    if (p.childNodes && p.childNodes.length < 1) {
                        var tskBar = ecDialog._taskBar;
                        if (tskBar) {
                            ecDialog._taskBar = null;
                            $e(tskBar).remove();
                        }
                    }
                }
                my.unlock();	//解除屏幕锁定
                delete ecDialog.list[my.config.id];
            }
            return my;
        },

        /*
			定时关闭
			@param: 定时秒数,无参数则为停止计时器
			@param: 时间到时执行指定的方法 0422
		*/
        time: function (s, func) {
            var my = this,
                timer = my._timer,
                fn = func;
            //如果有计时器清除
            timer && clearTimeout(timer);

            if (s) {

                s = parseInt(s);

                //定义提示计时器
                var tipTimerDiv = $e("#TipsTimer"),
                    tipTimer = null,
                    times = s - 1;
                //如果需要计时器则进行
                if (tipTimerDiv.length > 0) {
                    tipTimer = setInterval(function () {
                        tipTimerDiv.html(times--);
                        //清除循环计时器
                        if (times < 1) {
                            try {	//IE8及以下不支持对象的clear方法
                                if (tipTimer) tipTimer.clearInterval();
                            } catch (e) { clearInterval(tipTimer); }
                        }
                    }, 1000);
                }
                //alert(fn);
                //到时关闭提示
                my._timer = setTimeout(function () {
                    if (typeof (fn) == "function") {
                        fn.call(my, []);
                    }
                    my.close();
                }, 1000 * s);
            };

            return my;
        },

        /*
			设置焦点
		*/
        focus: function () {
            var my = this;
            ecDialog.focus = my;
            return my;
        },

        /*
			对话框置顶
		*/
        zIndex: function () {


            ECF.event.stopBubble();

            var my = this,
                dom = my.dom,
                wrap = dom.wrap,
                top = ecDialog.focus,
                index = ecDialog.defaults.zIndex++;

            wrap[0].style.zIndex = index;

            //设置叠加高度
            //if(my._lockMask) my._lockMask.style.zIndex = index-1;

            ecDialog.focus = my;

            return my;
        },

        //锁定屏幕
        lock: function () {
            var my = this,
                dom = my.dom,
                c = my.config,
                lockMask = my._lockMask || document.getElementById('full_lock_dialog_div');
            if (lockMask) {
                lockMask.syle.display = "block";
            }
            else {
                lockMask = document.createElement('div');
                document.getElementsByTagName('body')[0].appendChild(lockMask);
                lockMask.id = c.id + "_full_lock_dialog_Div";
                lockMask.oncontextmenu = function () { return false };
                var fbs = lockMask.style;
                fbs.zIndex = ecDialog.defaults.zIndex - 2; //给定锁定屏幕的zIndex
                fbs.position = "fixed";
                fbs.left = '0px';
                fbs.top = '0px';
                fbs.right = '0px';
                fbs.margin = '0px';
                fbs.padding = '0px';
                fbs.overflow = 'hidden';
                fbs.zoom = 1;
                fbs.width = '100%';
                fbs.height = '100%';
                //alert(c.background);

                //console.log("w:" + fbs.width + "  h:" + fbs.height);
                fbs.background = c.background;
            }

            lockMask.innerHTML = '<iframe src="about:blank" style="position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:-1; filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=1)\';" frameborder="0"></iframe>';

            _dialog.setStyle(lockMask, 'opacity', c.opacity);

            my._lockMask = lockMask;

            return my;


        },

        //解销屏幕
        unlock: function () {
            var lockMask = this._lockMask;
            if (lockMask) {
                //lockMask.style.display = 'none';
                ECF(lockMask).remove();
            }
        },

        //移动弹出层
        move: function (ev, o) {
            var ev = ev ? ev : window.event,
                my = this,
                wrap = my.dom.wrap,
                c = my.config,
                o = ev.srcElement ? ev.srcElement : ev.target;

            //判断是否是最小化,最大化,关闭按钮
            if (o.getAttribute('min') != null || o.getAttribute('max') != null || o.getAttribute('colse') != null) return my;

            //如果列表中的id不是本身,或不允许拖动 ecDialog.list[c.id] != my ||
            if (!c.drag) return my;

            var tmpbox = my._layer();

            onMove(ev, my, tmpbox);

            function onMove(ev, here, tbox) {	//层拖动处理
                var my = here,
                    c = my.config,
                    x = _dialog.mouseX(ev),
                    y = _dialog.mouseY(ev);
                tl = x - _dialog.toNumber(tbox.style.left),
                    tr = y - _dialog.toNumber(tbox.style.top),
                    t = tbox,
                    ty = t.style;
                if (!t) return; //临时层不存在时返回

                if (!window.captureEvents)
                    t.setCapture();
                else
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);

                var ecMouseMove = function (ev) {
                    ev = ev ? ev : window.event;
                    //if(ev.button == 0) return;
                    //console.log(typeof(t));
                    if (!t) return;
                    clsSelect();	//清除文本选择
                    var x = _dialog.mouseX(ev),
                        y = _dialog.mouseY(ev),
                        dw = _dialog.docWidth(),
                        dh = _dialog.docHeight();

                    if (x - tl <= 0) {	//判断X方向的位置,即高度的横向的判断
                        ty.left = "0px";
                    }
                    else if ((x - tl) >= (dw - t.offsetWidth)) {
                        ty.left = dw - o.offsetWidth + 'px';
                    }
                    else {
                        ty.left = (x - tl) + 'px';
                    }
                    //处理Y方向的拖动
                    if (y - tr <= 0) {
                        ty.top = '0px';
                    }
                    else if (y - tr >= dh - o.offsetHeight) {
                        ty.top = (dh - t.offsetHeight) + 'px';
                    }
                    else {
                        ty.top = (y - tr) + 'px';
                    }

                };

                // 清除文本选择
                var clsSelect = 'getSelection' in window ? function () {
                    window.getSelection().removeAllRanges();
                } : function () {
                    try {
                        document.selection.empty();
                    } catch (e) { };
                };


                document.onmousemove = ecMouseMove;

                document.onmouseup = function (ev) {

                    ev = ev ? ev : window.event;

                    if (!window.captureEvents)
                        t.releaseCapture();
                    else
                        window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);

                    tl = t.offsetLeft;
                    tt = t.offsetTop;
                    if (c.animate) {
                        wrap.animate({ left: tl + 'px', top: tt + 'px' }, 500, function () {
                            my.position(tl, tt);
                        });
                    }
                    else {
                        my.position(tl, tt);
                    }

                    $e(t).remove();

                    if (document.onmousemove == ecMouseMove) {
                        document.onmousemove = null;
                    }
                    else {
                        document.onmousemove = null;
                    }

                    document.onmouseup = null;
                    //console.log('left:' + tl + ',top:' + tt);
                    // document.onmouseup = null;
                };

            };

            return my;
        },

        //弹出层最小化处理
        min: function () {
            var my = this,
                o = my.dom.wrap[0],
                sy = o.style,
                a = arguments[0],
                taskBar = ecDialog._taskBar || document.getElementById('dialog_task_bar_div'),
                taskZoom;
            //处理任务栏的显示状态
            if (taskBar) {
                taskBar.style.display = "block";
            }
            else {
                taskBar = document.createElement('Div');
                document.getElementsByTagName('body')[0].appendChild(taskBar);
                taskBar.id = "dialog_task_bar_div";
                var style = taskBar.style;
                taskBar.className = 'task';
                taskBar.innerHTML = '<div class="btn"></div><div class="zoom"></div>';
                style.cssText = 'position:fixed;left:0px;bottom:0px';
                style.zIndex = '999999';
                style.width = Math.max(document.documentElement.clientWidth, document.documentElement.offsetWidth - 22) + 'px';
                ecDialog._taskBar = taskBar;
            }

            //任务栏图标容器
            taskZoom = $e('.zoom', taskBar);

            //创建任务栏图标
            var btn = my._minBtn || $e('#dialog_min_btn_' + my.config.id)[0];
            if (btn) {
                btn.style.display = 'block';
            }
            else {
                btn = document.createElement('Div');
                btn.id = 'dialog_min_btn_' + my.config.id;
                btn.className = 'btn1';
                btn.innerHTML = '<h6>' + my.dom.title_info[0].innerHTML + '</h6>';
                my._minBtn = btn;
                taskZoom.append(btn);
            }

            btn.onclick = function () { //创建栏目图标的单击事件
                if (sy.display == "none") {
                    my.zIndex();
                    sy.display = 'block';
                }
                else {
                    sy.display = 'none';
                }
            };

            btn.ondblclick = function () { 	//任务栏上图标的双击事件
                my.close();
            };

            sy.display = 'none';

            if (a) a.blur();
            return my;
        },

        //弹出层最大化
        max: function (a) {
            var my = this,
                wrap = my.dom.wrap[0],
                wsy = wrap.style,
                lmax = a.getAttribute('max');
            //判断是否把最大化按钮的对象传递
            if (!a) return my;
            if (lmax == '0') {
                var lc = wsy.left + ':' + wsy.top + ':' + wrap.offsetWidth + ':' + wrap.offsetHeight,
                    sw = document.documentElement.clientWidth,
                    sh = document.documentElement.clientHeight || document.body.scrollHeight;
                if (sw < 1) sw = document.body.clientWidth;
                my.position(0, 0);
                my.size(sw, sh);
                a.setAttribute('max', lc);
                a.title = '恢复';
            }
            else {
                lmax = lmax.split(':');
                my.position(_dialog.toNumber(lmax[0]), _dialog.toNumber(lmax[1]));
                my.size(_dialog.toNumber(lmax[2]), _dialog.toNumber(lmax[3]));
                a.setAttribute('max', '0');
            }
            a.blur();
            return my;
        },

        // 标题按钮处理
        titleBtn: function (btnName, isShow) {
            var my = this, c = my.config, dom = my.dom, title_btns = dom.title_buttons;
            switch (btnName) {
                // 最小化
                case "min":
                    break;

                //最大化
                case "max":
                    break;

                //关闭
                case "close":
                    if (isShow) {
                        dom.title_buttons.append('<a href="javascript:;" class="box_title_close" title="关闭" colse="0" ></a>');
                        dom.close = $e('.box_title_close', dom.title_buttons[0]);
                        dom.close.bind('click', function () {
                            my.close(this);
                            return false;
                        });
                    } else if (dom.close) {
                        dom.close.remove();
                    }

                    break;
            }
        },

        /*
			初始化弹出层的Dom结构
		*/
        _initDom: function (c) {

            var wrap = document.createElement('DIV'),
                body = document.getElementsByTagName('body')[0];
            wrap.style.cssText = 'position:absolute;left:0;top:0';
            wrap.innerHTML = dialogModel;
            wrap.className = 'dilogbox';

            wrap.id = this.config.id;

            body.insertBefore(wrap, body.firstChild);

            var n, i = 0,
                dom = { wrap: $e(wrap) },
                els = wrap.getElementsByTagName('*'),
                len = els.length;
            for (; i < len; i++) {
                n = els[i].className.split('box_')[1];
                if (n) dom[n] = $e(els[i]);
            };

            return dom;
        },

        //重置弹出层的位置与大小
        _reset: function () {
            var my = this,
                c = my.config;
            my.size(c.width, c.height).position(c.left, c.top);
            return my;
        },

        //创建wrap相同的临时层
        _layer: function () {
            var my = this,
                o = my.dom.wrap[0],
                osy = o.style;

            var tmpbox = my._dragLayer = document.createElement('div');
            document.getElementsByTagName('body')[0].appendChild(tmpbox);

            tmpbox.oncontextmenu = function () { return false };
            tmpbox.id = o.id + '_temp';
            tmpbox.name = o.id + '_temp';
            var tsy = tmpbox.style;
            tsy.cssText = osy.cssText + "position:absolute;background:#D2E1F0;filter:alpha(Opacity=10,style=0);opacity:0.3;cursor:move;";
            tsy.height = o.offsetHeight + "px";
            tsy.border = "2px dotted #919090";
            tsy.zIndex = osy.zIndex + 2;
            tsy.width = osy.width;
            tsy.left = osy.left;
            tsy.top = osy.top;
            return tmpbox;
        },

        /*
			添加事件代理
		*/
        _addEvent: function () {
            var rsTimer,
                my = this,
                c = my.config,
                isIE = 'CollectGarbage' in window,
                dom = my.dom;

            my._winResize = function () {
                rsTimer && clearTimeout(rsTimer);
                rsTimer = setTimeout(function () {
                    my._reset(isIE);
                }, 40);
            };

            //关闭按钮
            if (c.closeBtn) {
                dom.title_buttons.append('<a href="javascript:;" class="box_title_close" title="关闭" colse="0" ></a>');
                dom.close = $e('.box_title_close', dom.title_buttons[0]);
                dom.close.bind('click', function () {
                    my.close(this);
                    return false;
                });
            }

            //最大化按钮
            if (c.maxBtn) {
                dom.title_buttons.append('<a href="javascript:;" class="box_title_max" title="max" max="0"></a>');
                dom.max = $e('.box_title_max', dom.title_buttons[0]);
                dom.max.bind('click', function () {
                    my.max(this);
                    return false;
                });
            }

            //最小化按钮
            if (c.minBtn) {
                dom.title_buttons.append('<a href="javascript:;" class="box_title_min" title="min" min="0"></a>');
                dom.min = $e('.box_title_min', dom.title_buttons[0]);
                dom.min.bind('click', function () {
                    my.min(this);
                    return false;
                });
            }

            _$win.bind('resize', my._winResize);

            //监听点击
            dom.wrap.bind('click', function (ev) {
                ev = ev ? ev : window.event;
                var target = ev.srcElement ? ev.srcElement : ev.target;
                if (target.disabled) return false; // IE BUG
                my.zIndex();	//把当前点中的图层做为焦点图层
            });

            if (c.drag) {	//如果弹出层允许拖动,则添加拖动事件
                dom.title.css('cursor', 'move');
                dom.title[0].onmousedown = function (ev) {
                    my.move(ev);
                };
            }
        },

        /*
			卸载事件代理
		*/
        _removeEvent: function () {
            var my = this,
                dom = my.dom;

            dom.wrap.unbind();
            _$win.unbind('resize', my._winResize);
        }

    };

    //功能转换
    ecDialog.fn._init.prototype = ecDialog.fn;

    //弹出对话框默认配置
    ecDialog.defaults = {
        id: 'ecdialog',				//为弹出层指定默认id
        guid: 0,					//弹出层的唯一编号这个将于id结合构成页面中唯一对象
        title: '\u6d88\u606f',		// 标题. 默认'消息'
        url: '',						//在弹出层中打开一个链接地址
        content: '<div class="box_loading"><span>loading...</span></div>', //内容,默认为loading...
        button: null,				// 自定义按钮
        ok: null,					// 确定按钮回调函数
        cancel: null,				// 取消按钮回调函数
        init: null,					// 对话框初始化后执行的函数格式
        close: null,				// 对话框关闭前执行的函数
        okVal: '\u786E\u5B9A',		// 确定按钮文本. 默认'确定'
        cancelVal: '\u53D6\u6D88',	// 取消按钮文本. 默认'取消'
        width: "auto",				// 内容宽度'auto'
        height: "auto",				// 内容高度'auto'
        minWidth: 120,				// 最小宽度限制
        minHeight: 62,				// 最小高度限制
        maxWidth: 800,
        padding: '20px 25px',		// 内容与边界填充距离
        skin: 'default',			// 皮肤名(多皮肤共存预留接口)
        className: 'box',			//给定的样式名
        icon: null,					// 消息图标名称
        time: null,					// 自动关闭时间
        esc: true,					// 是否支持Esc键关闭
        focus: true,				// 是否支持对话框按钮聚焦
        show: true,					// 初始化后是否显示对话框
        follow: null,				// 跟随某元素(即让对话框在元素附近弹出)
        path: "",					// ecDialog路径
        lock: true,					// 是否锁屏
        background: '#000000',			// 遮罩颜色
        opacity: .8,				// 遮罩透明度
        duration: 300,				// 遮罩透明度渐变动画速度
        fixed: false,				// 是否静止定位
        left: 'auto',				// X轴坐标50
        top: 'auto',				// Y轴坐标38.2
        zIndex: 801010,				// 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
        resize: true,				// 是否允许用户调节尺寸
        drag: true,					// 是否允许用户拖动位置
        closeBtn: true,				//显示关闭按钮
        minBtn: false,				//显示最小化按钮
        maxBtn: false,				//显示最大化按钮
        scroll: false,				//跟据滚动条滚动
        animate: false,				//是否开启动话功能
        win: window					//点击是页面window
    };

    //弹出框队列
    ecDialog.list = {};

    //弹出层的个数
    ecDialog._count = 0;

    //顶层对话框的API
    ecDialog.focus = null;

    $e.extend(ecDialog, {
        info: {
            //版本信息
            version: "1.1.0 Beta",
            //框架描述
            summary: "EC Framework Dialog JS Library<br /> ECF 框架之弹出层(拖动)插件",
            //作者
            aouthor: "xp",
            //框架完成时间
            build: "2012-1-13",
            //发布时间
            release: "2012-2-6",
            //修改时间
            modify: "2017-7-16",
            //修改者
            mender: "xp",
            //修改信息说明
            modSummary: "1.调整层的样式,可根据文本内容自动适应大小(2011-10-12)<br />2.修正在ie6下不能使用的问题,但在ie6下还是存一些小的问题没有时间处理(2011-10-18)<br />3.在原来的版本的基础上做了大量的更新修改,Html结构保持不变,但实现方式上做了更多的优化(2012-2-6)"
        },

        /*
			右下角滑动通知
			@param 要弹出的相关配置信息
		*/
        notice: function (opts) {
            var opt = opts || {};
            var acfg = null, api = null, wrap = null, h = 0, t = 0,
                duration = 800,
                cfg = {
                    id: 'Notice', left: '100%', top: '100%',
                    fixed: true, drag: false, resize: false,
                    zIndex: 1982, follow: null, lock: false,
                    maxBtn: false, minBtn: false, animate: false,
                    init: function (here) {
                        api = this;
                        acfg = api.config;
                        wrap = api.dom.wrap;
                        t = parseInt(wrap[0].style.top);
                        h = t + wrap[0].offsetHeight;
                        wrap.css('top', h + 'px')
                            .animate({ top: t + 'px' }, duration, function () {
                                opt.init && opt.init.call(api, here);
                            });
                    },
                    close: function (here) {
                        wrap.animate({ top: h + 'px' }, duration, function () {
                            opt.close && opt.close.call(this, here);
                            acfg.close = null;
                            api.close();
                        });
                        return false;
                    }
                };
            for (var i in opt) {
                if (cfg[i] === undefined) cfg[i] = opt[i];
            };
            return ecDialog(cfg);
        },
        /*
		 * 警告
		 * @param	{String}	消息内容
		 */
        alert: function (content) {
            return ecDialog({
                id: 'alert', icon: 'warning', fixed: true,
                lock: true, drag: false, content: content,
                maxBtn: false, minBtn: false,
                closeBtn: false, ok: true
            }).shake();
        },
        /*
		 * 确认
		 * @param	{String}	消息内容
		 * @param	{Function}	确定按钮回调函数
		 * @param	{Function}	取消按钮回调函数
		 */
        confirm: function (title, content, yes, no) {
            return ecDialog({
                id: 'Confirm', icon: 'question', drag: false,
                maxBtn: false, minBtn: false,
                fixed: true, lock: true,
                title: title || "提示",
                content: content,
                ok: function (here) {
                    if (typeof (yes) == "function") {
                        this.close();
                        return yes && yes.call(this, here);
                    } else {
                        return yes;
                    }
                },
                cancel: function (here) {
                    if (typeof (yes) == "function") {
                        this.close();
                        return no && no.call(this, here);
                    }
                    else {
                        return no;
                    }
                }
            });
        },
        /*
		 * 提问
		 * @param 	{string}     标题
		 * @param	{String}	提问内容
		 * @param	{Function}	回调函数. 接收参数：输入值
		 * @param	{String}	默认值
		 */
        prompt: function (title, content, yes, value) {
            value = value || '';
            var input;
            return ecDialog({
                id: 'prompt', fixed: true, lock: true, width: 240,
                maxBtn: false, minBtn: false, closeBtn: false, drag: false,
                title: title || 'prompt',
                content: [
                    '<div style="margin-bottom:5px;font-size:12px">',
                    content,
                    '</div>',
                    '<div>',
                    '<input value="',
                    value,
                    '" style="width:200px;padding:6px 4px" />',
                    '</div>'
                ].join(''),
                init: function () {
                    input = this.dom.content.find('input')[0];
                    input.select();
                    input.focus();
                },
                ok: function (here) {
                    if (yes) {
                        this.close();
                        return yes.call(this, input.value, here);
                    }
                },
                cancel: function () {
                    this.close();
                }
            });
        },
        /*
		 * 短暂提示
		 * @param	{String}	提示内容
		 * @param	{Number}	显示时间 (默认1.5秒)
		 */
        tips: function (content, time, fn, w, h) {
            var wtxt = w && w > 0 ? ' width:' + w + 'px;' : '';
            var htxt = h && h > 0 ? ' height:' + h + 'px;' : '';
            // alert(wtxt);
            return ecDialog({
                id: 'Tips', cancel: false,
                fixed: true, closeBtn: true,
                maxBtn: false,
                // width: w || 'auto',
                // height: h || 'auto',
                minBtn: false,
                lock: false,
                maxWidth: 400,
                content: ['<div style="padding: 10px 28px;' + wtxt + htxt + '">',
                    content,
                    '</div><div style="width:auto; float:right; padding:10px 5px;border:#ddd soild 1px;"><span id="TipsTimer" style="color:red; font-weight:bold">',
                time ? parseInt(time) : 5,
                    '</span>秒后自动关闭.</div>'
                ].join('')
            })
                .time(parseInt(time) || 5, fn);
        },
        /*
		 * 在弹出层中显示页面
		 * @param	{String}	待打开的页面地址
		 * @param	{Object}	打开弹出层信息的对象
		 * @param	{Boolean}	是否启用缓存
		 */
        open: function (url, opts, cache) {
            opts = opts || {};

            if (typeof (url) == "object") {
                opts = url;
                url = opts.url;
            }

            var api, dom, ifr, $ifr, $con, loaded;

            if (cache == false) {
                var ts = (new Date()).getTime(),
                    ret = url.replace(/([?&])_=[^&]*/, "$1_=" + ts);
                url = ret + ((ret === url) ? (/\?/.test(url) ? "&" : "?") + "_=" + ts : "");
            };

            //页面加载完之后的回调处理
            loaded = opts.loaded;
            // 给加完后需要处理回调方法的参数赋值
            loadArguments = opts.loadArguments;
            //alert(url);
            //console.log(typeof(opts.loaded));

            var load = function () {
                var iw, ih, ac = api.config;
                //删除内容框里的加载提示
                dom.content.find('.box_loading').remove();

                //
                //把加载好的页面window对象传替到外围,方便使用;
                api.iwindow = ifr.contentWindow;

                ///console.log(ifr.contentWindow);
                if (Object.prototype.toString.apply(ifr.contentWindow) != "[object]") {
                    ifr.contentWindow.pwindow = ac.win;
                    ifr.contentWindow._myDialog = api;
                }

                //console.log(ac.win.location);

                // setTimeout: 防止IE6~7对话框样式渲染异常
                var ltime = setTimeout(function () {
                    ifr.style.cssText = 'width:100%;height:100%;border:none 0;';

                    //动态算window的高度开始
                    var getFFVersion = navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox')).split('/')[1];
                    var FFextraHeight = getFFVersion >= 0.1 ? 16 : 0;
                    //alert(ifr.contentDocument);
                    // if (ifr.document && ifr.document.body.scrollHeight){ 
                    // ifr.style.height = ifr.document.body.scrollHeight + "px"; 
                    // } 
                    // else if (ifr.contentDocument && ifr.contentDocument.body.offsetHeight){
                    // ifr.style.height = ifr.contentDocument.body.offsetHeight + FFextraHeight + "px"; 
                    //alert(ifr.contentDocument.body.offsetHeight);
                    // } 
                    //动态算window的高度结束

                    // 处理页面加载完后的执行方法
                    if (typeof (loaded) == 'function') {
                        if (!ECF.isArray(loadArguments)) {
                            loadArguments = [];
                        }
                        loaded.apply(api.iwindow, loadArguments);
                    }

                }, 50);


            };

            var cfg = {
                width: opts.width || 500,
                height: opts.height || 400,
                init: function () {
                    api = this,
                        dom = api.dom,
                        $con = dom.content,
                        ifr = api._iframe = document.createElement('iframe');
                    ifr.src = url;

                    ifr.id = ifr.name = 'dialog_open_' + api.config.id;
                    ifr.style.cssText = 'position:absolute;left:-9999em;top:-9999em;border:none 0;background:transparent;width:500px;height:500px;';
                    ifr.setAttribute('frameborder', 0, 0);
                    ifr.setAttribute('allowTransparency', true);

                    $ifr = $e(ifr);

                    //$con.css('margin', '0');
                    //$con.append(ifr);
                    //$con.css('width', dom.main[0].offsetWidth + "px");
                    //$con.css('height', dom.main[0].offsetHeight + "px");

                    $con.append(ifr);
                    //获取需要除掉的边距
                    var _w = ['margin-left', 'margin-right', 'border-left-width', 'border-right-width', 'padding-left', 'padding-right'];
                    var _h = ['margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width', 'padding-top', 'padding-bottom'];
                    var _sumw = 0;
                    var _sumh = 0;
                    for (var i = 0; i < _w.length; i++) {
                        _sumw = _sumw + ecDialog.cssSize(dom.content[0], _w[i]);
                        _sumh = _sumh + ecDialog.cssSize(dom.content[0], _h[i]);
                    }

                    //console.log(ecDialog.cssSize(dom.content[0], 'margin-left'));
                    //为了避免加载的iframe出现不可预知的滚动条,所以加上font-size和line-height属性
                    $con.css({
                        'width': Number(dom.main[0].offsetWidth - _sumw) + "px",
                        'height': Number(dom.main[0].offsetHeight - _sumh) + "px",
                        'font-size': '0px',
                        'line-height': 'normal'
                    });

                    //console.log(Object.prototype.toString.apply(ifr.contentWindow));
                    //如果给定的地址为图片地址时,ie系列浏览器会报没有操作权限,这时需要判断contentWindow对象是否为window by 20120924 xp
                    if (Object.prototype.toString.apply(ifr.contentWindow) != "[object]") {
                        window.topDialog = ifr.contentWindow.ecDialog = api;
                    }


                    //$ifr.bind('load', load);
                    load();

                },
                close: function () {
                    $ifr.css('display', 'none').unbind('load', load);

                    ifr.src = 'about:blank';
                    var win = null;
                    try {  //在ie7或以下的时候获取contentWindow时会出错
                        win = ifr.contentWindow;
                    }
                    catch (e) { }

                    if (opts.close && typeof (opts.close) == "function" && opts.close.call(api, win, top) == false) {
                        return false;
                    };

                    $ifr.remove();

                }
            };

            for (var i in opts) {
                if (cfg[i] === undefined) cfg[i] = opts[i];
            };

            delete opts.content;

            return ecDialog(cfg);

        },
        /*
		 * 获取CSS样式中的尺寸值
		 * @obj	    {Object}	遍历的对象
		 * @style	{String}	确定是否有该样式值
		 */
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
        }
    });

    var dialogModel = '<div class="box_top_left"></div><div class="box_top_center"></div><div class="box_top_right"></div><div class="clear"></div><div class="box_title_left"></div><div class="box_title"><b class="box_title_info"></b><span class="box_title_buttons"></span><div class="clear"></div></div><div class="box_title_right"></div><div class="clear"></div><div class="box_main_left"></div><div class="box_main"><div class="box_content"></div></div><div class="box_main_right"></div><div class="clear"></div><div class="box_buttons_left"></div><div class="box_buttons"></div><div class="box_buttons_right"></div><div class="clear"></div><div class="box_bottom_left"></div><div class="box_bottom_center"></div><div class="box_bottom_right"></div><div class="clear"></div>';

    ////当文档加载完成后批量处理
    //$e(function () {
    //    function getUrlPara(sUrl, name) {
    //        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //        var r = sUrl.substr(sUrl.indexOf("\?") + 1).match(reg);
    //        if (r != null) {
    //            return unescape(r[2]); 
    //        }
    //        return null;
    //    };

    //    $e("a.dialog,a.thickbox").each(function (ele) {
    //        if (!ele) return;
    //        var hf = ele.href,
    //			w = getUrlPara(hf, "width") || 600,
    //			t = ele.title || ele.innerHTML,
    //			h = getUrlPara(hf, "height") || 400;

    //        ele.onclick = function () {
    //            $e.dialog.open(hf, { width: w / 1, height: h / 1, title: t }, false);
    //            return false;
    //        };

    //    });
    //});

    $e.extend($e.fn, {
        dialog: function (title, width, height, buttons, func, args) {

            var opt = {};

            if (arguments.length == 1 && $e.isObject(arguments[0])) {
                opt = arguments[0];
            }
            else {
                opt = {
                    title: title || "标题",
                    width: width || "auto",
                    height: height || "auto",
                    buttons: buttons,
                    callback: func,
                    arguments: args || []

                };
            }

            if (this.length > 0) {

                var div = document.createElement("div");
                div.innerHTML = this.html();
                opt.content = div;

            }

            return ecDialog(opt);
        }
    });

}(ECF, window);