/*!
 * ECF JavaScript Library v2.2.2
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2011, 2014 , 2015 , 2016 shaipe
 *
 * Date: 2017-06-08T15:28Z
 *
 * 添加xml转换为json对象的方法 20140720
 * 添加Unicode编码中的中文字符相互转换 by xp 20140730
 * 添加针对浏览器的判断和提供isMobile,isAndroid,isIOS,isWeixin的方法
 * 处理获取元素的外围高度和宽度  by xp 20140828
 * 添加ECF.Event和对ECF.event.trigger的支持 by xp 20150519
 * 添加ECF.getScript方法，支持异步加载js文件，只有在使用时才添加必要的js文件 by xp 20150519
 * 在Ajax框架中添加输出格式为json的数据格式，目前支持text,xml,json by xp 20150521
 * 修修ECF.xml.toJson方法，添加一个参数，可以指定是否添加多个相同子节点时的节点名如不需; ECF.xml.toJson(xmlDoc,true); 返回结果为： [{te:1,rows:[{},{}]}] by 20160504
 * 添加ECF.clone方法，用于克隆一个对象,对ECF.xml.toJson方法多提供了一个参数为是否加根节点 by xp 20160507
 * 修正getscript中带有参数的地址会重复加载bug 20170424
 * 添加$e.getJson方法 20170608
 * 添加$e.wsocket方法，返回一个可操作的socket对象 by 20170704
 */


//对ie8或以下不支持Console的处理
if (typeof (console) === 'undefined') {
    var console = {};
    console.log = function () {
        if (arguments.length > 0) { /*alert(arguments[0]);*/ }
    };
};

(function (window, undefined) {

    var ECF = (function () {
        var ECF = function (selector, context) {
            return new ECF.fn.init(selector, context, rootECF);
        },
            readyList,
            rootECF;

        //定义功能函数
        ECF.fn = ECF.prototype = {
            //当前选择容器
            context: null,
            constructor: ECF,

            //当前选择器的选择对象
            selector: "",
            //长度
            length: 0,
            //ECF框架初始化以及初始化选择器
            init: function (selector, context, rootECF) {
                //alert(selector);
                //处理ECF(""),ECF(null),或者ECF(undefined);
                if (!selector) {
                    return this;
                }

                // 处理Dom元素
                if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                //body元素只存在一次，优化查找
                if (selector === "body" && !context && document.body) {
                    this.context = document;
                    this[0] = document.body || context.getElementsByTagName(selector)[0];
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }

                //head元素只存在一次，优化查找
                if (selector === 'head' || selector === 'html') {
                    this[0] = context.getElementsByTagName(selector)[0];
                    this.selector = selector;
                    this.length = 1;
                    return this;
                };

                // 处理Html字符串
                if (typeof (selector) === "string") {
                    // 将处理HTML字符串或者一个ID?
                    if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                        // 假设字符串的开始和结束与<>是HTML和跳过正则表达式检查
                        match = [null, selector, null];

                    } else {
                        match = ECF.regexs.quickExpr.exec(selector);
                    }

                    // 验证匹配，找上下文被指定为 #id
                    if (match && (match[1] || !context)) {
                        // HANDLE: $e(html) -> $e(array)

                        if (match[1]) {
                            context = context instanceof ECF ? context[0] : context;
                            doc = (context ? context.ownerDocument || context : document);

                            // 如果一个字符串传递，它是一个单一的标签只是做了createElement和跳过其余
                            ret = ECF.regexs.rsingleTag.exec(selector);
                            //alert(ret[1]);
                            if (ret) {
                                if (ECF.isObject(context)) {
                                    //alert(ret[1]);
                                    selector = [document.createElement(ret[1])];
                                    ECF.fn.attr.call(selector, context, true);

                                } else {
                                    selector = [document.createElement(ret[1])];
                                }

                            } else {
                                var div = doc.createElement("div");
                                div.innerHTML = match[1];
                                selector = div.childNodes;
                            }

                            return ECF.merge(this, selector);
                            // HANDLE: $e("#id")
                        } else {
                            elem = document.getElementById(match[2]);
                            //alert(elem + match[2]);
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (elem && elem.parentNode) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if (elem.id !== match[2]) {
                                    return ECF(document).find(selector);
                                }

                                // Otherwise, we inject the element directly into the ECF object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }


                    }
                    // 处理: $e(expr, context)
                    // (这只是相当于: $e(context).find(expr)
                    //
                    else {
                        var finds = ECF.find(selector, context);
                        this.length = finds.length;
                        for (var i = 0; i < this.length; i++) {
                            this[i] = finds[i];
                            //alert(this[i]);
                            //this[i].checked = true;
                        }
                        this.selector = selector;
                        return this;
                    }

                    // 处理: $e(function)
                    // 快捷键为文件准备
                } else if (ECF.isFunction(selector)) {
                    rootECF = ECF(document);
                    //alert("0000" + selector);
                    return rootECF.ready(selector);
                }

                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return ECF.makeArray(selector, this);
            },
            //返回选择器中的元素个数
            size: function () {
                return this.length;
            },
            //页面加载完成后执行
            ready: function (fn) {
                //alert('‘fn’');
                ECF.bindReady(fn);

                //var ie = !!(window.attachEvent && !window.opera);
                //var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
                //var fn = [];
                //var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
                //var d = document;
                //d.ready = function (f) {
                //    if (!ie && !wk && d.addEventListener)
                //        return d.addEventListener('DOMContentLoaded', f, false);
                //    if (fn.push(f) > 1) return;
                //    if (ie)
                //        (function () {
                //            try { d.documentElement.doScroll('left'); run(); }
                //            catch (err) { setTimeout(arguments.callee, 0); }
                //        })();
                //    else if (wk)
                //        var t = setInterval(function () {
                //            if (/^(loaded|complete)$/.test(d.readyState))
                //                clearInterval(t), run();
                //        }, 0);
                //};

                return this;
            },
            //把元素转换为数组
            toArray: function () {
                return slice.call(this, 0);
            },
            /*
            选择元素
            int		数量
            */
            item: function (num) {

                return num == null ?

                    // 返回 'clean'  的数组
                    this.toArray() :

                    // Return just the object
                    (num < 0 ? this[this.length + num] : this[num]);

                //元素数量
                // var size = this.size();

                //从左至右返回元素
                // if (i >= 0) {
                // return i <= size ? this[i] : null;
                // } else {
                //从右至左返回元素
                // return Math.abs(i) <= size ? this[(size + i)] : null;
                // }

            },

            indexOf: function (o) { //获取元素在数组中的位置
                var index = 0;
                for (; index < this.length; index++) {
                    if (o == this[index]) {
                        return index;
                    }
                }
                return index;
            },

            del: function (o) { //删除元素集合中的元素
                if (o > -1) {
                    this.length = this.length - 1;
                    delete this[o]
                } else {
                    var index = 0;
                    for (; index < this.length; index++) {
                        if (o == this[index]) {
                            break;
                        }
                    }
                    this.length = this.length - 1;
                    delete this[index]
                }
                return this;
            }
        };
        //把当前的定义拷贝给ECF()对象
        ECF.fn.init.prototype = ECF.fn;

        ECF.extend = ECF.fn.extend = function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            //处理深拷贝的情况
            if (typeof (target) === "boolean") { //如果是Bool型的跳过对目标的处理
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            //处理时，目标是一个字符串或（深拷贝可能的情况下）的东西
            if (typeof (target) !== "object" && !ECF.isFunction(target)) {
                target = {};
            }

            // extend ECF itself if only one argument is passed
            //扩展ECF的本身，如果只有一个参数传递
            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                //只有处理non-null/undefined值
                if ((options = arguments[i]) != null) {
                    //扩展基本对象
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        //防止永不结束的循环
                        if (target === copy) {
                            continue;
                        }

                        //递归如果我们合并纯对象或数组
                        if (deep && copy && (ECF.isPlainObject(copy) || (copyIsArray = ECF.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && ECF.isArray(src) ? src : [];

                            } else {
                                clone = src && ECF.isPlainObject(src) ? src : {};
                            }

                            //切勿移动原始对象，克隆
                            target[name] = ECF.extend(deep, clone, copy);

                            //不要把不确定的值
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            //返回修改后的对象
            return target;
        };

        return ECF;
    })();

    var rootECF = ECF(document);

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;



    /* 浏览器判断处理结束 */
    //对ECF进行扩展处理
    ECF.extend({

        //版本信息
        version: "2.2.2 Beta",
        // ECF默认对对象个数为0
        length: 0,
        //框架信息
        info: {
            //版本信息
            version: "2.2.2 Beta",
            //框架描述
            summary: "EC Framework JS Library",
            //作者
            aouthor: "xp",
            //框架完成时间
            build: "2011-9-26",
            //发布时间
            release: "2011-10-12",
            //修改时间
            modify: "2015-5-19",
            //修改者
            mender: "xp",
            //修改信息说明
            modSummary: "1.添加主动画播放功能(2011-10-12)"
        },
        //document对象
        document: document.compatMode == "CSS1Compat" ? document.documentElement : document.body,
        //使DOM随时可以使用？设置为true即随时可以使用
        isReady: false,
        //一个计数器来跟踪项目之前要等待多少准备的事件触发。 See #6781
        readyWait: 1,

        // 保持（或释放）ready事件
        holdReady: function (hold) {
            if (hold) {
                ECF.readyWait++;
            } else {
                ECF.ready(true);
            }
        },

        // 把需要处理DOM准备就绪
        ready: function () {
            //alert(arguments[0]);
            if (document.readyState === "complete") {
                ECF.isReady = true;
                //alert('eee' + readyList.length);
                for (var c = 0; c < readyList.length; c++) {
                    if (typeof (readyList[c]) == "function") {
                        readyList[c].apply(this, []);
                    }
                }
            }

            //var ie = !!(window.attachEvent && !window.opera);
            //var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
            //var fn = [];
            //var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
            //var d = document;
            //d.ready = function (f) {
            //    if (!ie && !wk && d.addEventListener)
            //        return d.addEventListener('DOMContentLoaded', f, false);
            //    if (fn.push(f) > 1) return;
            //    if (ie)
            //        (function () {
            //            try { d.documentElement.doScroll('left'); run(); }
            //            catch (err) { setTimeout(arguments.callee, 0); }
            //        })();
            //    else if (wk)
            //        var t = setInterval(function () {
            //            if (/^(loaded|complete)$/.test(d.readyState))
            //                clearInterval(t), run();
            //        }, 0);
            //};


            return this;
        },

        //绑定ready
        bindReady: function () {

            var DOMContentLoaded,
                callback = arguments[0],
                self = this;
            //alert(callback);
            //添加ready事件到readyList中
            if (typeof (readyList) == "undefined") {
                readyList = [];
                readyList.push(callback);
            } else {
                readyList.push(callback);
            }

            //alert('eee');

            //判断页面是否完成
            //            if (document.readyState === "complete") {
            //                if (typeof (callback) == "function") {
            //                    callback.apply(self, []);
            //                }
            //            }

            // 清理文件的准备方法
            if (document.addEventListener) {
                DOMContentLoaded = function () {
                    document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    //ECF.ready(0);
                };

                // 使用callback判断页面加载状态
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

                // 页面加载完成后添加执行方法
                window.addEventListener("load", ECF.ready, false);

            } else if (document.attachEvent) {
                //alert('3');
                var state = 0;
                DOMContentLoaded = function () {
                    //alert(window.location + " : " + document.readyState)
                    // 判断页面是否加载完成
                    if (document.readyState === "complete") {
                        document.detachEvent("onreadystatechange", DOMContentLoaded);
                        document.onreadystatechange = null;
                        //alert("ewew");
                        //ECF.ready(1);
                        if (state == 9) return;
                        state = 9;
                        // 添加onload事件
                        window.attachEvent("onload", ECF.ready);
                    }
                };

                // 为页面改变加载状态时添加处理方法
                document.attachEvent("onreadystatechange", DOMContentLoaded);



                // 如果不是ie或没有frame时获取顶级
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch (e) { }

                if (document.documentElement.doScroll && toplevel) {
                    // The DOM ready check for Internet Explorer
                    (function doScrollCheck() {
                        if (ECF.isReady) {
                            return;
                        }

                        try {
                            // If IE is used, use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            document.documentElement.doScroll("left");
                        } catch (e) {
                            setTimeout(doScrollCheck, 1);
                            return;
                        }

                        // and execute any waiting functions
                        //ECF.ready(9);
                    })();
                }
            }
        },
        //建立插件容器
        plugin: [],
        //浏览器相关信息
        browsers: (function () {
            //所有 js 元素
            var tags = document.getElementsByTagName("script");
            //取当前 js 地址
            var path = tags[tags.length - 1].getAttribute('src', 2);
            //取目录地址
            var base = path ? path.substring(0, path.lastIndexOf("/") + 1) : null;
            //浏览器版本
            var nav = navigator;
            var uat = nav.userAgent;
            var reg = '',
                browserName,
                msie = false,
                chrome = false,
                safari = false,
                opera = false,
                firefox = false;
            //根据应用程序名称进行判断
            switch (nav.appName) {
                case "Microsoft Internet Explorer":
                    {
                        browserName = "ie";
                        msie = true;
                        reg = /^.+MSIE (\d+\.\d+);.+$/;
                        break;
                    }
                default:
                    {
                        if (uat.indexOf("Chrome") != -1) {
                            browserName = "chrome";
                            chrome = true;
                            reg = /^.+Chrome\/([\d.]+?)([\s].*)$/ig;
                        } else if (uat.indexOf("Safari") != -1) {
                            browserName = "safari";
                            safari = true;
                            reg = /^.+Version\/([\d\.]+?) (Mobile.)?Safari.+$/;
                        } else if (uat.indexOf("Opera") != -1) {
                            browserName = "opera";
                            opera = true;
                            reg = /^.{0,}Opera\/(.+?) \(.+$/;
                        } else {
                            browserName = "firefox";
                            firefox = true;
                            reg = /^.+Firefox\/([\d\.]+).{0,}$/;
                        }
                    }
                    break;
            }

            return {
                base: base,
                msie: msie,
                opera: opera,
                safari: safari,
                chrome: chrome,
                firefox: firefox,
                //客户端版本
                version: uat.replace(reg, "$1"),
                //客户端语言
                lang: (!msie ? nav.language : nav.browserLanguage).toLowerCase(),

                //是否为移动设备
                mobile: /(iPhone|iPad|iPod|Android)/i.test(uat),

                //判断浏览器是否支持Html5
                isHtml5: typeof (Worker) !== "undefined" ? true : false
            }
        })(),

        // 对象克隆
        clone: function (obj) {

            if (typeof (obj) == "object") {
                var result = new Object();

                if (ECF.isArray(obj)) {
                    result = new Array();
                }

                for (var o in obj) {
                    if (typeof (obj[o]) != "function") {
                        result[o] = obj[o];
                    }
                }
                return result;
            }

            return obj;

        },

        // 获取用户端信息
        ua: (function () {
            return navigator.userAgent.toLowerCase();
        })(),

        // 是否为移动端
        isMobile: (function () {
            var ua = navigator.userAgent;
            return /(iPhone|iPad|iPod|Android)/i.test(ua);
        })(),

        // 是否为Android平台
        isAndroid: (function () {
            var ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("android") != -1 ? 1 : 0;
        })(),

        // 是否为IOS平台
        isIOS: (function () {
            var a = navigator.userAgent.toLowerCase();
            return (a.indexOf("iphone") != -1 || a.indexOf("ipad") != -1 || a.indexOf("ipod") != -1) ? 1 : 0;
        })(),

        // 获取用户端平台信息
        platform: function () {
            if (ECF.isMobile) { /*移动端*/
                if (ECF.isIOS) {
                    return "IOS";
                } else if (ECF.isAndroid) {
                    return "Android";
                } else {
                    return "other-mobile";
                }
            } else {
                return "PC";
            } /*PC端*/
        },

        // 判断是否为微信
        isWeixin: (function () {
            var ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("micromessenger") != -1 ? 1 : 0;
        })(),

        //获取当前时间
        now: function () {
            return +(new Date());
        },

        //常用的正则表在达式
        regexs: {
            // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
            quickExpr: /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

            // Check if a string has a non-whitespace character in it
            rnotwhite: /\S/,

            // Used for trimming whitespace
            trimLeft: /^\s+/,
            trimRight: /\s+$/,

            // 检查是否为数字
            rdigit: /\d/,

            // Match a standalone tag
            rsingleTag: /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

            // JSON RegExp
            rvalidchars: /^[\],:{}\s]*$/,
            rvalidescape: /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rvalidtokens: /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rvalidbraces: /(?:^|:|,)(?:\s*\[)+/g,

            // Useragent RegExp
            rwebkit: /(webkit)[ \/]([\w.]+)/,
            ropera: /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie: /(msie) ([\w.]+)/,
            rmozilla: /(mozilla)(?:.*? rv:([\w.]+))?/,

            rclass: /[\n\t\r]/g,
            rspace: /\s+/,
            rreturn: /\r/g,
            rtype: /^(?:button|input)$/i,
            rfocusable: /^(?:button|input|object|select|textarea)$/i,
            rclickable: /^a(?:rea)?$/i,
            rboolean: /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,

            // Matches dashed string for camelizing
            rdashAlpha: /-([a-z]|[0-9])/ig,
            rmsPrefix: /^-ms-/,
            rinlineECF: / ECF\d+="(?:\d+|null)"/g,
            rleadingWhitespace: /^\s+/,
            rxhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
            rtagName: /<([\w:]+)/,
            rtbody: /<tbody/i,
            rhtml: /<|&#?\w+;/,
            rnocache: /<(?:script|object|embed|option|style)/i,
            // checked="checked" or checked
            rchecked: /checked\s*(?:[^=]|=\s*.checked.)/i,
            rscriptType: /\/(java|ecma)script/i,
            rcleanScript: /^\s*<!(?:\[CDATA\[|\-\-)/,
            rrelNum: /^([\-+])=([\-+.\de]+)/,
            rfxnum: /^([+-]=)?([\d+-.]+)(.*)$/,
            rupper: /([A-Z]|^ms)/g,


            risSimple: /^.[^:#\[\.,]*$/,
            rfocusMorph: /^(?:focusinfocus|focusoutblur)$/
        },

        //需要特殊处理的节点map
        wrapMap: {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },

        isPlainObject: function (obj) {
            var key;

            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || ECF.type(obj) !== "object" || obj.nodeType || ECF.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Support: IE<9
            // Handle iteration over inherited properties before own properties.
            if (false) { // support.ownLast
                for (key in obj) {
                    return hasOwn.call(obj, key);
                }
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for (key in obj) { }

            return key === undefined || hasOwn.call(obj, key);
        },

        //判断对象类型
        type: function (obj) {

            if (obj == null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;

        },
        //判断对象是否为函数
        isFunction: function (obj) {
            return ECF.type(obj).toLowerCase() === "function";
        },
        // 一种强制的方式确定对象是否是一个窗口
        isWindow: function (obj) {
            return obj && typeof (obj) === "object" && "setInterval" in obj;
        },
        // 判断是否为数字
        isNumeric: function (obj) {
            return obj - parseFloat(obj) >= 0;
        },
        //判断对象是否为数组
        isArray: Array.isArray || function (obj) {
            return ECF.type(obj).toLowerCase() === "array";
        },
        // 判断是否类似数组
        isArraylike: function (obj) {
            var length = obj.length,
                type = ECF.type(obj).toLowerCase();

            if (type === "function" || ECF.isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        },
        //判断对象是否为NAN型
        isNaN: function (obj) {
            return obj == null || !rdigit.test(obj) || isNaN(obj);
        },
        //判断对象是否为空对象
        isEmptyObject: function (obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        //判断元素是否为对象
        isObject: function (obj) {
            if (!obj || ECF.type(obj).toLowerCase() !== "object" || obj.nodeType || ECF.isWindow(obj)) {
                return false;
            }

            try {
                var hasOwn = Object.prototype.hasOwnProperty;

                if (obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            var key;
            for (key in obj) { }

            return key === undefined || hasOwn.call(obj, key);
        },
        //判断元素是否为xmlDocument
        isXMLDoc: function (elem) {
            return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
                !!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
        },
        //判断对象是否为Json格式的对象
        isJson: function (ele) {
            var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return isjson;
        },
        //错误信息
        error: function (msg) {
            if (typeof (console) != "undefined") { //发生错误时处理调试信息
                console.log(msg);
            }
            throw msg;
        },
        //跨浏览器的JSON解析
        parseJSON: function (data) {
            //debugger;
            if (typeof (data) !== "string" || !data) {
                return null;
            }

            // 确保首/尾空白被删除（IE浏览器不能处理）
            data = data.trim();

            // 试图解析首先使用原生的JSON解析器
            if (window.JSON && window.JSON.parse) {
                try {
                    var fstr = data.substr(0, 1);
                    if (fstr != "{" && fstr != "[") {
                        return [];
                    } else {
                        return window.JSON.parse(data);
                    }
                } catch (e) { }
            }

            // 确保传入的数据是实际的JSON
            // 从http://json.org/json2.js借来的逻辑
            var rvalidchars = /^[\],:{}\s]*$/,
                rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
            if (rvalidchars.test(data.replace(rvalidescape, "@")
                .replace(rvalidtokens, "]")
                .replace(rvalidbraces, ""))) {

                return (new Function("return " + data))();

            }
            ECF.error("Invalid JSON: " + data);
        },
        // 跨浏览器的XML解析
        parseXML: function (data) {
            var xml, tmp;
            try {
                if (window.DOMParser) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                ECF.error("Invalid XML: " + data);
            }
            return xml;
        },
        // 将脚本运行为页面全局
        globalEval: function (data) {
            if (data && rnotwhite.test(data)) {
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },
        // 转换为标准大小写格式; 方便CSS和数据模块的使用
        camelCase: function (string) {
            // camelizing字符串匹配规则
            var rdashAlpha = /-([a-z]|[0-9])/ig,
                rmsPrefix = /^-ms-/,
                // 使用ECF.camelCase对行回调替换
                fcamelCase = function (all, letter) {
                    return (letter + "").toUpperCase();
                };
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        //判断元素节点名称是否为指定的名称
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
        },
        /*
        遍历元素，对每个元素执行回调函数
        func		需要执行的函数
        */
        each: function (obj, callback, args) {
            if (!obj) return obj;
            var value,
                i = 0,
                length = obj.length,
                isArray = ECF.isArraylike(obj);
            //console.log(isArray);
            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;


        },

        // 返回结果只是在内部使用
        makeArray: function (array, results) {
            var ret = results || [];

            if (array != null) {
                //窗口，字符串（和功能）也有“长度”
                //额外的typeof运算功能检查是为了防止在Safari2崩溃
                //稍微调整逻辑处理黑莓4.7 RegExp的问题
                var type = ECF.type(array).toLowerCase();

                if (array.length == null || type === "string" || type === "function" || type === "regexp" || ECF.isWindow(array)) {
                    Array.prototype.push.call(ret, array);
                } else {
                    ECF.merge(ret, array);
                }
            }

            return ret;
        },
        /*判断是在元素在数组中的位置*/
        inArray: function (elem, array) {
            if (!array) {
                return -1;
            }

            if (Array.prototype.indexOf) {
                return Array.prototype.indexOf.call(array, elem);
            }

            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i] === elem) {
                    return i;
                }
            }

            return -1;
        },
        /*对元素进行合并处理*/
        merge: function (first, second) {
            var i = first.length,
                j = 0;

            if (second && typeof (second.length) === "number") {
                for (var l = second.length; j < l; j++) {
                    first[i++] = second[j];
                }
            } else if (second) {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },
        //
        grep: function (elems, callback, inv) {
            var ret = [],
                retVal;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for (var i = 0, length = elems.length; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }

            return ret;
        },
        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var value, key, ret = [],
                i = 0,
                length = elems.length,
                // ECF objects are treated as arrays
                isArray = elems instanceof ECF || length !== undefined && typeof (length) === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || ECF.isArray(elems));

            // Go through the array, translating each of the items to their
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for (key in elems) {
                    value = callback(elems[key], key, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return ret.concat.apply([], ret);
        },
        // 功能的方法来获取和设置值集合
        // 可以选择性地执行，如果它是一个函数值
        access: function (elems, key, value, chainable, fn, emptyGet, raw) {
            //console.log(arguments);
            var i = 0,
                length = elems.length,
                bulk = key == null;

            // Sets many values
            if (ECF.type(key).toLowerCase() === "object") {
                chainable = true;
                for (i in key) {
                    //console.log(i);
                    ECF.access(elems, i, key[i], true, fn, emptyGet, raw);
                }

                // Sets one value
            } else if (value !== undefined) {
                chainable = true;

                if (!ECF.isFunction(value)) {
                    raw = true;
                }

                if (bulk) {
                    // Bulk operations run against the entire set
                    if (raw) {
                        fn.call(elems, value);
                        fn = null;

                        // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function (elem, key, value) {
                            return bulk.call(ECF(elem), value);
                        };
                    }
                }

                if (fn) {
                    for (; i < length; i++) {
                        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    }
                }
            }

            //return fn(elems[0], key);
            //console.log(chainable + " " + bulk);

            return chainable ?
                elems :

                // Gets
                bulk ?
                    fn.call(elems) :
                    length ? fn(elems[0], key) : emptyGet;
        },
        /*
        获取随机字符
        length	长度
        upper		是否允许大写字母
        lower		是否允许小写字母
        number	是否允许数字
        */
        random: function (length, upper, lower, number) {

            if (!upper && !lower && !number) {
                upper = lower = number = true;
            }

            var a = [
                ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
                ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            ];

            //临时数组
            var b = [];

            //临时字串
            var c = "";

            b = upper ? b.concat(a[0]) : b;
            b = lower ? b.concat(a[1]) : b;
            b = number ? b.concat(a[2]) : b;

            for (var i = 0; i < length; i++) {
                c += b[Math.round(Math.random() * (b.length - 1))];
            }

            return c;
        },
        /*
        返回两个数值之间的一个随机值
        min	最小值
        max	最大值
        */
        between: function (min, max) {
            return Math.round(min + (Math.random() * (max - min)));
        },
        /*
        解析URL地址
        myURL.file;     // = 'index.html'
        myURL.hash;     // = 'top'
        myURL.host;     // = 'abc.com'
        myURL.query;    // = '?id=255&m=hello'
        myURL.params;   // = Object = { id: 255, m: hello }
        myURL.path;     // = '/dirIndex.html'
        myURL.segments; // = Array = ['dir', 'index.html']
        myURL.port;     // = '8080'
        myURL.protocol; // = 'http'
        myURL.source;   // = 'http://abc.com:8080/dirIndex.html?id=255&m=hello#top'
        */
        url: function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),

                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        },
        //判断对象是否存在
        contains: function (a, b) {
            var ret = false;
            if (document.documentElement.contains) {
                ret = a !== b && (a.contains ? a.contains(b) : true);
            } else if (document.documentElement.compareDocumentPosition) {
                ret = !!(a.compareDocumentPosition(b) & 16);
            }
            return ret;
        },

        getWindow: function (elem) { //获取窗口
            return (ECF.isWindow(elem) ?
                elem :
                (elem.nodeType === 9 ?
                    elem.defaultView || elem.parentWindow :
                    false));
        },

        elements: function () { //返回html对象下的所有节点

            //console.log(arguments[0]);
            var html = arguments[0],
                div = document.createElement('div');

            if (typeof (html) != "string") html = html.toString();

            html = html.replace(ECF.regexs.rxhtmlTag, "<$1></$2>"),
                tag = (ECF.regexs.rtagName.exec(html) || ["", ""])[1].toLowerCase(),
                wrap = ECF.wrapMap[tag] || ECF.wrapMap._default,
                depth = wrap[0];

            if (html) {
                div.innerHTML = wrap[1] + html + wrap[2];
            }

            // Move to the right depth
            while (depth--) {
                div = div.lastChild;
            }

            return div.childNodes;
        },

        fragment: function (html) {
            var oFragment = document.createFragment();
        },

        keyCode: function (ev) {
            var ev = ev || window.event;
            return ev.keyCode ? ev.keyCode : e.which;
        },

        // 将Json转换为字符串
        jsonToStr: function (o) { //将json对象转换为string
            var arr = [];
            var fmt = function (s) {
                if (typeof s == 'object' && s != null) return ECF.jsonToStr(s);
                return /^(string)$/.test(typeof s) ? "'" + s.replace(/'/g, "\'") + "'" : s;
            };
            if (ECF.isArray(o)) {
                for (var i = 0; i < o.length; i++) arr.push(fmt(o[i]));
                return '[' + arr.join(',') + ']';
            } else {
                for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
                return '{' + arr.join(',') + '}';
            }
        },

        /*
            中文转Unicode编码
            @1: 中文字符
            @2: 是否转换英文和字符
        */
        toUnicode: function (s, memiangle) {
            var nativecode = s.split("");
            var uin = "";

            for (var i = 0; i < nativecode.length; i++) {
                var code = Number(nativecode[i].charCodeAt(0));

                // 判断是否转换英文和字符
                if (!memiangle || code > 127) {
                    var charAscii = code.toString(16);
                    charAscii = new String("0000").substring(charAscii.length, 4) + charAscii;
                    uin += "\\u" + charAscii;
                } else {
                    uin += nativecode[i];
                }
            }
            return uin;
        },
        /*
            Unicode编码转为自然编码
            @1: Unicode编码字符
        */
        toNative: function (s) {
            if (typeof (s) != "string") return s;

            s = s.replace(/%u/gi, "\\u");
            var asciicode = s.split("\\u");
            var nativeValue = asciicode[0];
            for (var i = 1; i < asciicode.length; i++) {
                var code = asciicode[i];
                nativeValue += String.fromCharCode(parseInt("0x" + code.substring(0, 4)));
                if (code.length > 4) {
                    nativeValue += code.substring(4, code.length);
                }
            }
            return nativeValue;
        },

        // 返回函数
        returnFunc: function (r) {
            return r;
        },

        // 定时器
        timer: function (times, func, ele, txt) {
            var tipTimer = setInterval(function () {
                if (ele && ele.html) {
                    ele.html("倒计时:" + times + "秒" + (txt ? "后" + txt : ""));
                }
                times--;
                //清除循环计时器
                if (times < 1) {
                    if (func) func();
                    try { //IE8及以下不支持对象的clear方法
                        if (tipTimer) tipTimer.clearInterval();
                    } catch (e) {
                        clearInterval(tipTimer);
                    }
                }
            }, 1000);
        }

    });

    var nodeHook, boolHook;


    //相关操作属性扩展
    ECF.extend({
        //值Hook
        valHooks: {
            option: {
                get: function (elem) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function (elem) {
                    var value,
                        index = elem.selectedIndex,
                        values = [],
                        options = elem.options,
                        one = elem.type === "select-one";

                    // Nothing was selected
                    if (index < 0) {
                        return null;
                    }

                    // Loop through all the selected options
                    for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                        var option = options[i];

                        // Don't return options that are disabled or in a disabled optgroup
                        if (option.selected && (ECF.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                            (!option.parentNode.disabled || !ECF.nodeName(option.parentNode, "optgroup"))) {

                            // Get the specific value for the option
                            value = ECF(option).val();

                            // We don't need an array for one selects
                            if (one) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push(value);
                        }
                    }

                    // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                    if (one && !values.length && options.length) {
                        return ECF(options[index]).val();
                    }

                    return values;
                },

                set: function (elem, value) {
                    var values = ECF.makeArray(value);

                    ECF(elem).find("option").each(function () {
                        this.selected = ECF.inArray(ECF(this).val(), values) >= 0;
                    });

                    if (!values.length) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },
        //属性上已有的指定方法
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            click: true,
            offset: true
        },
        //元素属性Fix
        attrFix: {
            // Always normalize to ensure hook usage
            tabindex: "tabIndex"
        },
        //获取或设置元素的属性
        attr: function (elem, name, value) {
            //alert(elem);
            var hooks, ret, nType = elem.nodeType;

            // 如果节点类型不支持读写属性就直接返回
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return undefined;
            }


            //如果已经有属性的功能函数则直接返回其功能函数处理后的值
            if (typeof (elem.getAttribute) === typeof (undefined)) {
                return ECF.prop(elem, name, value);
            }

            //console.log(name);

            if (nType !== 1 || !ECF.isXMLDoc(elem)) {

                name = name.toLowerCase();
                hooks = ECF.attrHooks[name] ||
                    (ECF.expr.match.bool.test(name) ? boolHook : nodeHook);
            }
            //console.log(hooks);

            if (value !== undefined) {
                //console.log(1);
                if (value === null) {
                    ECF.removeAttr(elem, name);

                } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }

            } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                //console.log(2);
                return ret;

            } else {
                //console.log(3);
                ret = ECF.find.attr(elem, name);
                //console.log(ret);
                // Non-existent attributes return null, we normalize to undefined
                return ret == null ?
                    undefined :
                    ret;
            }
        },
        //获除指定名称的属性
        removeAttr: function (elem, value) {
            var name, propName,
                i = 0,
                attrNames = value && value.match(rnotwhite);

            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = ECF.propFix[name] || name;

                    // Boolean attributes get special treatment (#10870)
                    if (ECF.expr.match.bool.test(name)) {
                        // Set corresponding property to false
                        if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                            elem[propName] = false;
                            // Support: IE<9
                            // Also clear defaultChecked/defaultSelected (if appropriate)
                        } else {
                            elem[ECF.camelCase("default-" + name)] =
                                elem[propName] = false;
                        }

                        // See #9699 for explanation of this approach (setting first, then removal)
                    } else {
                        ECF.attr(elem, name, "");
                    }

                    elem.removeAttribute(getSetAttribute ? name : propName);
                }
            }
        },
        //属性hook
        attrHooks: {
            type: {
                set: function (elem, value) {
                    // We can't allow the type property to be changed (since it causes problems in IE)
                    if (rtype.test(elem.nodeName) && elem.parentNode) {
                        ECF.error("type property can't be changed");
                    } else if (!ECF.support.radioValue && value === "radio" && ECF.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to it's default in case type is set after value
                        // This is for element creation
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            },
            // Use the value property for back compat
            // Use the nodeHook for button elements in IE6/7 (#1954)
            value: {
                get: function (elem, name) {
                    if (nodeHook && ECF.nodeName(elem, "button")) {
                        return nodeHook.get(elem, name);
                    }
                    return name in elem ?
                        elem.value :
                        null;
                },
                set: function (elem, value, name) {
                    if (nodeHook && ECF.nodeName(elem, "button")) {
                        return nodeHook.set(elem, value, name);
                    }
                    // Does not return so that setAttribute is also used
                    elem.value = value;
                }
            }
        },
        //属性名称对应
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        //获取或设置属性
        prop: function (elem, name, value) {
            var nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return undefined;
            }

            var ret, hooks,
                notxml = nType !== 1 || !ECF.isXMLDoc(elem);

            if (notxml) {
                // Fix name and attach hooks
                name = ECF.propFix[name] || name;
                hooks = ECF.propHooks[name];
            }
            //alert(value);
            if (value !== undefined) {
                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    return (elem[name] = value);
                }

            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                    return ret;

                } else {
                    return elem[name];
                }
            }
        },
        //属性hook
        propHooks: {
            tabIndex: {
                get: function (elem) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabindex");

                    return attributeNode && attributeNode.specified ?
                        parseInt(attributeNode.value, 10) :
                        rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
                            0 :
                            undefined;
                }
            }
        },

        // 对图片进行等比例放缩显示处理
        scaleZoom: function (ele, width, height) {
            //alert(width);
            if (ele && ele.tagName == 'IMG') {

                //     var scale="";
                // var Awidth = mypic.width;
                // var Aheight = mypic.height;
                // scale = Awidth/Aheight;
                // if (mypic.width>Wid ||mypic.height >Wid ){
                //     if(scale>1){
                //       mypic.width=Wid;
                //       mypic.height=Wid/scale;
                //     }
                //     if(scale<1){
                //       mypic.width=Wid*scale;
                //       mypic.height=Wid;
                //     }
                // }
                // debugger;
                var image = new Image(),
                    iwidth = width; // || $e(ele).attr('maxWidth') || ele.width, //定义允许图片宽度
                iheight = height; // || $e(ele).attr('maxHeight') || ele.height;  //定义允许图片高度

                if (!iwidth) {
                    iwidth = $e(ele).attr('maxWidth');
                    if (!iwidth) {
                        iwidth = ele.width;
                        $e(ele).attr('maxWidth', iwidth);
                    }
                }

                if (!iheight) {
                    iheight = $e(ele).attr('maxHeight');
                    if (!iheight) {
                        iheight = ele.height;
                        $e(ele).attr('maxHeight', iheight);
                    }
                }


                //如调用函数和img中都没设置宽和高
                iwidth = iwidth == 0 ? 200 : iwidth;
                iheight = iheight == 0 ? 150 : iheight;


                image.src = ele.src;
                //chrome 浏览器内核image.width=0
                //console.log(image.complete);
                //var ie = !!(document.all && navigator.userAgent.indexOf('Opera') === -1);
                //if (!ie && !image.complete) {
                //    image.onload = function () {
                //        ECF.scaleZoom(ele, iwidth, iheight);
                //        image.onload = null;
                //    };
                //}

                var swidth = image.width == 0 ? ele.width : image.width,
                    sheight = image.height == 0 ? ele.height : image.height,
                    scale = swidth / sheight;


                // $e(ele).attr('maxHeight',iheight);

                // console.log(scale + 'sw:' + swidth + 'sh' + sheight+ 'iw: ' + iwidth + 'ih' + iheight);

                //判断原图片的比例是否为0,为0时设为1
                if (scale == 0) scale = 1;

                if (swidth > iwidth || sheight > iheight) {

                    //长方形图片以宽为准
                    if (scale > 1) {
                        if (iwidth / scale > iheight) {
                            ele.width = iheight * scale;
                            ele.height = iheight;
                        } else {
                            ele.width = iwidth;
                            ele.height = iwidth / scale;
                        }
                    } else {
                        if (iheight * scale > iwidth) {
                            ele.width = iwidth;
                            ele.height = iwidth / scale;
                        } else {
                            ele.width = iheight * scale;
                            ele.height = iheight;
                        }
                    }
                    // console.log('w:' + ele.width + 'h:' + ele.height)
                } else {
                    ele.width = swidth;
                    ele.height = sheight;
                }
                image = null;
            }
        }
    });


    boolHook = {
        set: function (elem, value, name) {
            if (value === false) {
                // Remove boolean attributes when set to false
                ECF.removeAttr(elem, name);
            } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                // IE<8 needs the *property* name
                elem.setAttribute(!getSetAttribute && ECF.propFix[name] || name, name);

                // Use defaultChecked and defaultSelected for oldIE
            } else {
                elem[ECF.camelCase("default-" + name)] = elem[name] = true;
            }

            return name;
        }
    };


    // Populate the class2type map
    ECF.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });


    //对样式扩展
    ECF.extend({
        // 添加样式覆盖默认样式属性挂钩
        // 获取和设置样式属性的行为
        cssHooks: {
            opacity: {
                get: function (elem, computed) {

                    String.prototype.capitalize = function () {
                        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
                    };
                    //Array.prototype.contains = function(A) {
                    //    return typeof(this) == "string" ? (this.indexOf(A) >= 0) : false;
                    //};
                    String.prototype.camelize = function () {
                        return this.replace(/\-(\w)/ig,
                            function (B, A) {
                                return A.toUpperCase();
                            });
                    };
                    var css = {
                        getStyle: function (elem, styles) {
                            var value,
                                elem = elem;
                            //console.warn(typeof (elem));
                            if (typeof (elem) == "undefined") return;
                            if (styles == "float") {
                                document.defaultView ? styles = 'float' /*cssFloat*/ : styles = 'styleFloat';
                            };
                            value = elem.style[styles] || elem.style[styles.camelize()];
                            if (!value) {
                                if (document.defaultView && document.defaultView.getComputedStyle) {
                                    var _css = document.defaultView.getComputedStyle(elem, null);
                                    value = _css ? _css.getPropertyValue(styles) : null;
                                } else {
                                    if (elem.currentStyle) {
                                        value = elem.currentStyle[styles.camelize()];
                                    };
                                };
                            };
                            if (value == "auto" && ["width", "height"].contains(styles) && elem.style.display != "none") {
                                value = elem["offset" + styles.capitalize()] + "px";
                            };
                            if (typeof (elem.filters) == "undefined") return;
                            if (styles == "opacity") {
                                try {
                                    value = elem.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                                    value = value / 100;
                                } catch (e) {
                                    try {
                                        // console.log(e);
                                        value = elem.filters('alpha').opacity;
                                        //解决IE的变态不透明方法
                                        if (value == 100) {
                                            value = 0;
                                        };
                                    } catch (err) { }
                                }

                            }
                            return value == "auto" ? null : value;
                        }
                    };

                    if (computed) {

                        // We should always get a number back from opacity
                        var ret = css.getStyle(elem, "opacity", "opacity");
                        return ret === "" ? "1" : ret;

                    } else {
                        return elem.style.opacity;
                    }
                }
            }
        },

        // 排除下列CSS属性添加PX
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // 新增属性的名称，你要修复之前
        // 设置或获取值
        cssProps: {
            // 正常化浮动CSS属性
            "float": true ? "cssFloat" : "styleFloat"
        },

        // 获取和设置一个DOM节点上的样式属性
        style: function (elem, name, value, extra) {
            // 不要设置样式文本和注释节点
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // 确保我们的名称正确
            var ret, type, origName = ECF.camelCase(name),
                style = elem.style,
                hooks = ECF.cssHooks[origName];

            name = ECF.cssProps[origName] || origName;

            //console.log(name);

            // 检查如果我们设置一个值
            if (value !== undefined) {
                type = typeof (value);

                // 转换相对数串（+=或-=），以相对数. #7345
                if (type === "string" && (ret = ECF.regexs.rrelNum.exec(value))) {
                    value = (+(ret[1] + 1) * +ret[2]) + parseFloat(ECF.css(elem, name));
                    // Fixes bug #9237
                    type = "number";
                }

                // 确保NaN和空值未设置. See: #7116
                if (value == null || type === "number" && isNaN(value)) {
                    return;
                }

                // 如果一个数字是通过添加（某些CSS属性除外）的“PX”
                if (type === "number" && !ECF.cssNumber[origName]) {
                    value += "px";
                }

                // Fixes bug #5509
                // 如果提供了一个钩子，使用该值，否则只是设置指定的值
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
                    // 扔“无效”的价值观提供的错误包裹，以防止IE浏览器
                    try {
                        style[name] = value;
                    } catch (e) { }
                }

            } else {

                // 如果提供了一个钩子，从那里得到的非计算值
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }
                // console.log(style[name]);
                // 否则只是从样式对象的价值
                return style[name];
            }
        },

        //获取指定的css样式
        css: function (elem, name, outer) {
            var ret, hooks;

            // 确保我们的名称正确
            var num, val, hooks,
                origName = ECF.camelCase(name);

            // Make sure that we're working with the right name
            name = ECF.cssProps[origName] || (ECF.cssProps[origName] = vendorPropName(elem.style, origName));

            // cssFloat需要特殊处理
            if (name === "cssFloat") {
                name = "float";
            }

            var curCSS, cssExpand = ["Top", "Right", "Bottom", "Left"];


            if (document.defaultView && document.defaultView.getComputedStyle) {

                getStyles = function (elem) {
                    if (elem.ownerDocument && elem.ownerDocument.defaultView)
                        return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
                    else
                        return ret;
                };

                curCSS = function (elem, name, computed) {

                    var ret, computed = computed || getStyles(elem);

                    // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                    ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

                    if (computed) {

                        if (ret === "" && !ECF.contains(elem.ownerDocument, elem)) {
                            ret = ECF.style(elem, name);
                        }
                    }

                    return ret === undefined ?
                        ret :
                        ret + "";

                };
            }

            if (document.documentElement.currentStyle) {

                getStyles = function (elem) {
                    return elem.currentStyle;
                };

                curCSS = function (elem, name, computed) {

                    var ret, computed = computed || getStyles(elem);

                    ret = computed ? computed[name] : undefined;

                    // Avoid setting ret to empty string here
                    // so we don't default to auto
                    if (ret == null && style && style[name]) {
                        ret = style[name];
                    }

                    var left, rsLeft,
                        rposition = /^(top|right|bottom|left)$/,
                        pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source,
                        rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"),
                        style = elem.style;

                    // If we're not dealing with a regular pixel number
                    // but a number that has a weird ending, we need to convert it to pixels
                    // but not position css attributes, as those are proportional to the parent element instead
                    // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
                    if (rnumnonpx.test(ret) && !rposition.test(name)) {

                        // Remember the original values
                        left = style.left;
                        rs = elem.runtimeStyle;
                        rsLeft = rs && rs.left;

                        // Put in the new values to get a computed value out
                        if (rsLeft) {
                            rs.left = elem.currentStyle.left;
                        }
                        style.left = name === "fontSize" ? "1em" : ret;
                        ret = style.pixelLeft + "px";

                        // Revert the changed values
                        style.left = left;
                        if (rsLeft) {
                            rs.left = rsLeft;
                        }
                    }

                    return ret === "" ? "auto" : ret;
                };
            }

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = ECF.cssHooks[name] || ECF.cssHooks[origName];

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true);
            }

            // Otherwise, if a way to get the computed value exists, use that
            if (val === undefined) {
                val = curCSS(elem, name);
            }

            num = parseFloat(val);

            // 获取外部宽和高
            if (outer) {
                var augment = augmentWidthOrHeight(name, "margin", true, getStyles(elem));

                num += augment;
            }


            return ECF.isNumeric(num) ? num || 0 : val;

            return val;

            function vendorPropName(style, name) {

                // shortcut for names that are not vendor prefixed
                if (name in style) {
                    return name;
                }

                // check for vendor prefixed names
                var capName = name.charAt(0).toUpperCase() + name.slice(1),
                    origName = name,
                    i = cssPrefixes.length;

                while (i--) {
                    name = cssPrefixes[i] + capName;
                    if (name in style) {
                        return name;
                    }
                }

                return origName;
            };

            // 获取元素的padding,margin,border 的宽和高
            function augmentWidthOrHeight(name, extra, isBorderBox, styles) {
                var i = extra === (isBorderBox ? "border" : "content") ?
                    // If we already have the right measurement, avoid augmentation
                    4 :
                    // Otherwise initialize for horizontal or vertical properties
                    name === "width" ? 1 : 0,

                    val = 0;

                for (; i < 4; i += 2) {
                    // both box models exclude margin, so add it if we want it
                    if (extra === "margin") {
                        val += getFloat(extra + cssExpand[i], styles);
                    }

                    if (isBorderBox) {
                        // border-box includes padding, so remove it if we want content
                        if (extra === "content") {
                            val -= getFloat("padding" + cssExpand[i], styles);
                        }

                        // at this point, extra isn't border nor margin, so remove border
                        if (extra !== "margin") {
                            val -= getFloat("border" + cssExpand[i] + "Width", styles);
                        }
                    } else {
                        // at this point, extra isn't content, so add padding
                        val += getFloat("padding" + cssExpand[i], styles);

                        // at this point, extra isn't content nor padding, so add border
                        if (extra !== "padding") {
                            val += getFloat("border" + cssExpand[i] + "Width", styles);
                        }
                    }
                }

                return val;

                function getFloat(name, styles) {
                    try {
                        return parseFloat(styles[name]);
                    } catch (e) {
                        return 0;
                    }
                }
            };

        },

        // / CSS属性快速交换，以得到正确的计算方法
        swap: function (elem, options, callback) {
            var old = {};

            // 记住的旧值，并插入新的
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            callback.call(elem);

            // 还原旧值
            for (name in options) {
                elem.style[name] = old[name];
            }
        },

        //判断元素是否可见
        isVisible: function (ele) {

            var ret = false;

            if (ele) {
                ret = !(ele.offsetWidth == 0 && ele.offsetHeight == 0);
            }

            return ret;
        },

        isHide: function (elem, el) {
            elem = el || elem;
            return ECF.css(elem, "display") === "none" || !ECF.contains(elem.ownerDocument, elem);
        },

        // 处理过元素显示与隐藏
        showHide: function (elements, show) {
            var display, elem, hidden,
                values = [],
                index = 0,
                length = elements.length;

            for (; index < length; index++) {
                elem = elements[index];
                if (!elem.style) {
                    continue;
                }

                values[index] = ECF._data(elem, "olddisplay");
                display = elem.style.display;
                if (show) {
                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if (!values[index] && display === "none") {
                        elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if (elem.style.display === "" && isHidden(elem)) {
                        values[index] = ECF._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName));
                    }
                } else {

                    if (!values[index]) {
                        hidden = isHidden(elem);

                        if (display && display !== "none" || !hidden) {
                            ECF._data(elem, "olddisplay", hidden ? display : ECF.css(elem, "display"));
                        }
                    }
                }
            }

            // Set the display of most of the elements in a second loop
            // to avoid the constant reflow
            for (index = 0; index < length; index++) {
                elem = elements[index];
                if (!elem.style) {
                    continue;
                }
                if (!show || elem.style.display === "none" || elem.style.display === "") {
                    elem.style.display = show ? values[index] || "" : "none";
                }
            }

            return elements;
        }

    });

    ECF.extend({
        dir: function (elem, dir, until) {
            var matched = [],
                cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !ECF(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    };

    ECF.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return ECF.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return ECF.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return ECF.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return ECF.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return ECF.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return ECF.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return ECF.sibling((elem.parentNode || {}).firstChild, elem);
        },
        childNodes: function (elem) {
            return ECF.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return ECF.nodeName(elem, "iframe") ?
                elem.contentDocument || elem.contentWindow.document :
                ECF.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        ECF.fn[name] = function (until, selector) {
            var ret = ECF.map(this, fn, until);

            if (name.slice(-5) !== "Until") {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = ECF.filter(selector, ret);
            }

            if (this.length > 1) {
                // Remove duplicates
                if (!guaranteedUnique[name]) {
                    ret = ECF.unique(ret);
                }

                // Reverse order for parents* and prev-derivatives
                if (rparentsprev.test(name)) {
                    ret = ret.reverse();
                }
            }

            return this.pushStack(ret);
        };
    });

    //对数据进行处理
    ECF.extend({
        cache: {},
        data: function (elem, name, data) {
            var cache = ECF.cache,
                id = '@cache' + (new Date).getTime();

            if (name === undefined) return cache[id];
            if (!cache[id]) cache[id] = {};
            if (data !== undefined) cache[id][name] = data;

            return cache[id][name];
        },
        hasData: function (elem) {
            elem = elem.nodeType ? ECF.cache[elem[ECF.expando]] : elem[ECF.expando];
            return !!elem && !isEmptyDataObject(elem);
        },
        /*
         * 删除缓存
         * @param		{HTMLElement}	元素
         * @param		{String}		缓存名称
         */
        removeData: function (elem, name) {
            var empty = true,
                expando = $.expando,
                cache = $.cache,
                id = uuid(elem),
                thisCache = id && cache[id];

            if (!thisCache) return;
            if (name) {
                delete thisCache[name];
                for (var n in thisCache) empty = false;
                if (empty) delete $.cache[id];
            } else {
                delete cache[id];
                if (elem.removeAttribute) {
                    elem.removeAttribute(expando);
                } else {
                    elem[expando] = null;
                };
            };
        },
        //清除数据
        cleanData: function (elems) {
            var i = 0,
                elem,
                len = elems.length,
                removeEvent = ECF.event.remove,
                removeData = ECF.removeData;

            for (; i < len; i++) {
                elem = elems[i];
                removeEvent(elem);
                removeData(elem);
            };

        },
        //不用清除数据的部分
        noData: {
            "embed": true,
            // 处理所有对象，除了为Flash（处理expandos）
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553549999",
            "applet": true
        },
        // A method for determining if a DOM node can handle the data expando
        acceptData: function (elem) {
            // Do not set data on non-element because it will not be cleared (#8335).
            if (elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9) {
                return false;
            }

            var noData = elem.nodeName && ECF.noData[elem.nodeName.toLowerCase()];

            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });

    //对数据进行扩展处理
    ECF.fn.extend({

        data: function () {

        },

        //判断元素是否可见
        isVisible: function () {
            var ret = true;
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (el && el.offsetWidth == 0 && el.offsetHeight == 0) {
                    return false;
                }
            }
            return ret;
        },

        // 等比例缩放图片显示
        scaleZoom: function (width, height) {
            this.each(function () {
                ECF.scaleZoom(this, width, height);
            })
        },

        // 最大输入限制并提示 @1 字数限制，@2提示对象
        maxLength: function (m, n) {

            var check = function () {
                var l = this.value.length;
                if (l > m) {
                    this.value = $e(this).attr('old');
                } else {
                    $e(this).attr('old', this.value);
                    n.html(l ? l + '/' + m : '')[l ? 'show' : 'hide']();
                }
            };

            if (!n) {
                n = n ? n : $e('<div class="length"></div>').hide();
                t.after(n);
            }

            this.bind('keydown', function (e) {
                var k = (e || event).keyCode;
                return !(k != 37 && k != 38 && k != 39 && k != 40 && k != 8 && this.value.length >= m);
            }).bind('keyup paste', function () {
                var _t = this;
                setTimeout(function () {
                    check.call(_t)
                }, 10);
            }).trigger('keyup');

            return this;
        }
    });


    //获取CSS样式中的尺寸值
    function getCssSize(obj, style) {
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
    };

    //对ECF.fn进行扩展
    ECF.fn.extend({
        /*
        设置或返回对象样式名
        key		[String]	时返回样式值
        [JSON]		时设置属性值，如：{"color":"red","fontSize":"14px"}
        */
        attr: function (name, value) {
            return ECF.access(this, name, value, false, ECF.attr);
        },

        // 判断是否有属性存在
        hasAttr: function (name) {
            var att = this.attr(name);
            if (att == null || att == undefined || att == "") {
                return false;
            } else {
                return true;
            }
        },

        /*设置或返回对象值
            text		[可选]文本值
            add		[可选]是否在原文本上追加
        */
        value: function (text, add) {

            //设置值
            if (typeof (text) != "undefined") {

                //if (typeof (text) == "string") {
                //    text = text.htmlDecode();
                //}

                //批量绑定
                this.each(function (ele) {

                    //子元素数量,对于下拉才会有Length
                    var len = ele.length;
                    // console.log(len + ' ' + ele.type + ' ' +ele.name);
                    if (ele.tagName == "VAR") {
                        ele.innerHTML = text;
                        return;
                    } else if (ele.tagName == "IMG") {
                        var imgDomain = imageDomain || "";
                        ele.src = imgDomain + text;
                        return;
                    }
                    if (typeof (text) == "string") {
                        text = text.htmlDecode();
                    }
                    //按类型处理
                    switch (ele.type) {
                        case "select-one": //单选下拉
                            for (var i = 0; i < len; i++) {
                                if (ele[i].value == text) {
                                    ele.selectedIndex = i;
                                    break;
                                }
                            }
                            break;
                        case "select-multiple": //多选下拉
                            var arry = val.split(",");
                            for (i = 0; i < ele.options.length; i++) {
                                for (var j = 0; j < arry.length; j++) {
                                    if (ele.options[i].value == arry[j]) {
                                        ele.options[i].selected = true;
                                    }
                                }
                            }
                            // for (var i = 0; i < len; i++) {
                            // if (ele[i].value !== -1) {
                            // ele[i].selected = true;
                            // } else {
                            // ele[i].selected = false;
                            // }
                            // }
                            break;
                        case "radio": //单选和筛选按钮
                            if (ele.value == text) {
                                ele.checked = true;
                            } else {
                                ele.checked = false;
                            }
                            break;
                        case "checkbox": //对checkbox进行处理
                            if (typeof (text) == "boolean") {
                                ele.checked = text;
                                if (ele.checked) break; //checkbox被选中后跳出该循环
                            } else {
                                if (typeof (text) != 'string') {
                                    text = text.toString();
                                }
                                var txts = text.toString().split('|');
                                for (var t = 0; t < txts.length; t++) {
                                    ele.checked = (ele.value == txts[t]);
                                    if (ele.checked) break; //checkbox被选中后跳出该循环
                                }
                            }

                            break;
                        case "password":
                            break;
                        //文本框、隐藏域
                        case "text":
                        case "hidden":
                            if (add) {
                                ele.value += text;
                            } else {
                                ele.value = text;
                                //alert(window.location + ele + "text" + ele.value );
                            }
                            break;
                        case "textarea": //多行文本
                            if ($e.forms && $e.forms.editors) { //判断在线修改器是否存在
                                var editor = $e.forms.editors[name]; //获取在线修改器对象
                                if (typeof (editor) == "object") {
                                    ele.value = editor.html(text);
                                } else { //当此对象不存在线修改器
                                    ele.value = text;
                                }
                            } else {
                                ele.value = text;
                            }
                            break;
                    }
                });
                return this;
            }

            //返回值
            var val = [];

            //批量绑定
            this.each(function (ele) {

                //子元素数量
                var len = ele.length;

                //按类型处理
                switch (ele.type) {

                    //单选下拉
                    case "select-one":

                        if (len) {
                            val = ele[ele.selectedIndex].value;
                        }

                        break;

                    //多选下拉
                    case "select-multiple":

                        for (var i = 0; i < len; i++) {
                            if (ele[i].selected) {
                                val.push(ele[i].value);
                            }
                        }

                        break;

                    //单选和筛选按钮
                    case "radio":
                    case "checkbox":
                        if (ele.checked) {
                            val.push(ele.value);
                        }

                        break;

                    //文本框、隐藏域和多行文本
                    case "text":
                    case "hidden":
                    case "password":
                        val = ele.value;
                        break;

                    // 多行文本处理
                    case "textarea":
                        val = ele.value;
                        if ($e.forms && $e.forms.editors) {
                            var name = ele.id || ele.name;
                            var editor = $e.forms.editors[name];
                            if (typeof (editor) == "object") {
                                val = editor.html();
                            }
                        }
                        break;
                }

            });

            return typeof (val) == "string" ? val.trim() : val;
        },

        val: function (value) {
            var hooks, ret, isFunction,
                elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = ECF.valHooks[elem.type] || ECF.valHooks[elem.nodeName.toLowerCase()];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(ECF.regexs.rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return;
            }

            isFunction = ECF.isFunction(value);

            return this.each(function (i) {
                var val;

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, ECF(this).val());
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (ECF.isArray(val)) {
                    val = ECF.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = ECF.valHooks[this.type] || ECF.valHooks[this.nodeName.toLowerCase()];

                // If set returns undefined, fall back to normal setting
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        },

        //处理不支持HTML5的浏览器对placeholder的支持
        placeholder: function () {
            //暂时屏蔽掉不支持placeholder的IE By Zkai
            //var isPlaceholder = ("placeholder" in document.createElement("input"));
            //if (isPlaceholder) return this;
            //this.each(function (ele) {
            //    var e = ECF(ele),
            //	ph = e.attr("placeholder"),
            //    val = e.value();

            //    if (typeof(val) == 'string' && val != '') {
            //        return;
            //    }
            //    if (ph) {
            //        ele.value = ph;
            //        e.bind("focus", function () {
            //            if (this.value == ph) {
            //                this.value = "";
            //            }
            //        });
            //        e.bind("blur", function () {
            //            if (this.value == "") {
            //                this.value = ph;
            //            }
            //        });
            //    }
            //});
            return this;
        },
        /*
            序列化
            指定序列化的为什么格式的数据，目前支持Json和Xml格式的数据
        */
        serialize: function (type, empty) {
            var ret = new StringBuilder(),
                self = this,
                type = type || "xml",
                chks = [];
            self.each(function (ele) {

                var len = ele.length,
                    name = ele.id || ele.name,
                    encode = false,
                    val = "";
                var filter = $e(ele).attr("ecfilter");
                filter = filter == "true" ? true : false;
                if (filter)
                    return;
                if (this.tagName == "VAR" && !this.id) { // 当标签为VAR且如果id为空时不用取值
                    return '';
                }
                //name = name; //name.toLowerCase();

                if (name != "") {

                    // 如果对象为Img时直接返回取消此次取值
                    if (this.tagName == 'IMG') return;


                    //按类型处理
                    switch (ele.type) {

                        //单选下拉
                        case "select-one":
                            if (len) {
                                val = ele[ele.selectedIndex].value;
                            }
                            break;

                        //多选下拉
                        case "select-multiple":

                            for (var i = 0; i < len; i++) {
                                if (ele[i].selected) {
                                    val += ele[i].value + ",";
                                }
                            }
                            val = val.indexOf(",") > -1 ? val.substring(0, val.length - 1) : val;
                            break;

                        //单选和筛选按钮
                        case "radio":
                            if (ele.name != "") {
                                name = ele.name;
                            }
                            if (ele.checked) { //只有获取到了已选中的单选才break
                                val = ele.value;
                                break;
                            }

                        case "checkbox":
                            if (ele.name != "") {
                                name = ele.name; //重新定义name
                                //console.log('sub000 ' + ele.name + " - " + ele.type + " ; [chks]" + chks[ele.name]);

                                if (ele.checked) { //当checkbox被选中时
                                    //console.log(typeof(chks[name]));
                                    if (typeof (chks[name]) == "undefined") {
                                        chks[name] = new Array();
                                    }
                                    val = ele.value;
                                    chks[name].push(val);
                                }
                                name = ""; //把name附为空,让第一次添加的时候不进行添加结果处理
                            } else {
                                if (ele.checked) {
                                    val = ele.value;
                                } else {
                                    name = "";
                                }
                            }

                            break;

                        //文本框、隐藏域和多行文本
                        case "text":
                        case "password":
                            val = ele.value;
                            break;
                        case "hidden": //单独处理隐藏域 0422
                            val = ele.value;
                            if (val == "") { //如果val为空的时候，不在获取的数据中出现空节点
                                name = "";
                            }
                            break;
                        case "textarea":
                            val = ele.value;

                            //取Editor控件值
                            if ($e.forms && $e.forms.editors) {
                                var editor = $e.forms.editors[name];
                                //alert(typeof (editor) + ele.value);
                                //alert(K("#" + name).val())
                                if (typeof (editor) == "object") {
                                    val = editor.html();
                                    encode = false;
                                } else {
                                    encode = true;
                                }
                            }
                            //取上传图片中的值
                            if ($e(ele).attr("uploads") == "true") {
                                val = document.getElementById($e(ele).attr("divid")).value;
                                encode = false;
                            }
                            break;

                    }
                    var filter = ele.getAttribute("filter");

                    if (filter != null && filter != "") {
                        filter = " filter=\"" + filter + "\"";
                    } else {
                        filter = "";
                    }

                    if (name != "") {
                        if (!empty) {
                            if (val != "")
                                ret.append(putValue(name, val, type, encode, filter));
                        } else {
                            ret.append(putValue(name, val, type, encode, filter));
                        }
                    }
                }
            });

            //处理checkbox的相关处理
            for (var k in chks) {
                //console.log(typeof(chks[k]));
                if (typeof (chks[k]) == "object") { //当为数组对象时才进行处理
                    ret.append(putValue(k, chks[k].join('|'), type));
                }
                //console.log('k' + k + ' v ' + chks[k].join('|') + ' l ' + chks.length);
            }

            return (type.toLowerCase() == "json" ? "{" + ret.toString(',') + "}" : ret.toString());

            function putValue(name, val, type, encode, filter) {
                if (!filter) {
                    filter = "";
                }
                var ret = "";
                if (name == null || name == "") return "";

                if (typeof (val) == 'string') val = val.trim(); // htmlEncode会造成时间格式中的空格变成&nbsp;

                if (typeof (val) == 'string' && encode) {
                    val = val.htmlEncode(); // 处理前后的空格和处理html编码
                }

                //当值不为空时
                if (name.toUpperCase() !== "__VIEWSTATE") {
                    if (type == "xml") {
                        if (val.indexOf("<") != -1 || val.indexOf(">") != -1 || val.indexOf('&') > -1) {
                            ret = "<" + name + filter + "><![CDATA[" + val + "]]></" + name + ">";
                        } else {
                            ret = "<" + name + filter + ">" + val + "</" + name + ">";
                        }
                    } else {
                        ret = "\"" + name + "\":\"" + val + "\"";
                    }
                }
                return ret;
            }
        },
        /*
            序列化为数组
        */
        serializeArray: function () {

            //返回值
            var vals = [];

            //批量绑定
            this.each(function (ele) {

                //子元素数量
                var len = ele.length,
                    val = {};
                //设置
                val.name = ele.id || ele.name;
                //alert(ele.tagName);
                //按类型处理
                switch (ele.type) {

                    //单选下拉
                    case "select-one":

                        if (len) {
                            val.value = ele[ele.selectedIndex].value;
                            vals.push(val);
                        }

                        break;

                    //多选下拉
                    case "select-multiple":

                        for (var i = 0; i < len; i++) {
                            if (ele[i].selected) {
                                val.value = ele[i].value;
                                vals.push(val);
                            }
                        }

                        break;

                    //单选和筛选按钮
                    case "radio":
                    case "checkbox":

                        /*
                        for(var i=0;i<len;i++){
                        if( ele[i].checked ){
                        val.push(ele[i].value);
                        }
                        }
                        */

                        //for(var i=0;i<len;i++){
                        if (ele.checked) {
                            val.value = ele.value;
                            vals.push(val);
                        }

                        break;

                    //文本框、隐藏域和多行文本
                    case "text":
                    case "hidden":
                    case "textarea":
                    case "password":
                        val.value = ele.value;
                        //alert(ele.value);
                        vals.push(val);
                        break;

                }

            });

            return vals;
        },
        /*
            选择元素
		
            返回：第i个元素
            int		数量
        */
        item: function (i) {

            //元素数量
            var size = this.length;

            //从左至右返回元素
            if (i >= 0) {
                return i <= size ? this[i] : null;
            } else {
                //从右至左返回元素
                return Math.abs(i) <= size ? this[(size + i)] : null;
            }

        },
        /*
            设置或返回对象文本
            text			[可选]文本值
            replace		[可选]新的文本値
        */
        text: function (text, replace) {
            //设置值
            if (typeof (text) != "undefined") {
                //批量绑定
                this.each(function (ele) {
                    //子元素数量
                    var len = ele.length;
                    //按类型处理
                    switch (ele.type) {
                        //单选下拉
                        case "select-one":
                            for (var i = 0; i < len; i++) {
                                if (ele[i].text == text) {
                                    ele.selectedIndex = i;
                                    if (typeof (replace) != "undefined") ele[i].text = replace;
                                    break;
                                }
                            }

                            break;
                        //多选下拉
                        case "select-multiple":
                            for (var i = 0; i < len; i++) {
                                if (Mo.Array(text).indexOf(ele[i].text) !== -1) {
                                    ele[i].selected = true;
                                    if (typeof (replace) != "undefined") ele[i].text = replace;
                                } else {
                                    ele[i].selected = false;
                                }
                            }
                            break;
                        default:
                            ele.innerHTML = text;
                            break;
                    }
                });

                return this;

            }

            //返回值
            var val = [];

            //批量绑定
            this.each(function (ele) {

                //子元素数量
                var len = ele.length;

                //按类型处理
                switch (ele.type) {

                    //单选下拉
                    case "select-one":

                        if (len) {
                            val = ele[ele.selectedIndex].text;
                        }

                        break;

                    //多选下拉
                    case "select-multiple":

                        for (var i = 0; i < len; i++) {
                            if (ele[i].selected) {
                                val.push(ele[i].text);
                            }
                        }

                        break;

                }

            });

            return val;
        },

        /*
         清除元素下所有的对象
        */
        clear: function () {
            var ele = this[0];
            if (ele && ele.nodeType == 1) {
                if (ele.tagName == "TABLE" || ele.tagName == 'THEAD' || ele.tagName == 'TBODY' || ele.tagName == "SELECT") { //20120606 修改关于Tbody的处理
                    var tbody;
                    if (ele.tagName != 'THEAD' && ele.tagName != 'TBODY') {
                        tbody = $e("tbody", ele);
                        if (tbody.length > 0) {
                            ele = tbody[0];
                        }
                    }

                    for (var i = ele.childNodes.length - 1; i > -1; i--) {
                        ele.removeChild(ele.childNodes[i]);
                    }
                } else {
                    if (ele.innerHTML) {
                        ele.innerHTML = "";
                    }
                }
            }
            return this;
        },

        /*
            设置或返回对象内容
            html	[可选]代码块,html为空或html为""时直接清除里面的内容
            add		[可选]是否在原代码上追加
        */
        html: function (html, add) {
            // console.log(html);
            if (html === undefined) {
                return this[0] && this[0].nodeType === 1 ?
                    this[0].innerHTML.replace(ECF.regexs.rinlineECF, "") : "";
            } else if (html == "") {
                return this.clear();
            } else {

                //html = html.replace(ECF.regexs.rxhtmlTag, "<$1></$2>");

                if (add) {
                    this.append(html);
                } else {
                    this.clear();
                    this.append(html);
                }
                return this;
            }
        },
        /*
        设置或返回对象样式
        key		[String]	时返回样式值
        [JSON]		时设置样式值，如：{"color":"red","fontSize":"14px"}
		
        */
        css: function (name, value) {
            // Setting 'undefined' is a no-op
            if (arguments.length === 2 && value === undefined) {
                return this;
            }
            //console.log(this);
            return ECF.access(this, name, value, arguments.length > 1, function (elem, name, value) {
                var styles, len,
                    map = {},
                    i = 0;
                //console.log(elem);
                if (ECF.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;

                    for (; i < len; i++) {
                        map[name[i]] = ECF.css(elem, name[i], false, styles);
                    }

                    return map;
                }

                return value !== undefined ?
                    ECF.style(elem, name, value) :
                    ECF.css(elem, name);
            });

        },
        //设置style样式
        style: function (key) {

            //返回对象样式值
            if (typeof (key) == "string") {

                var ele = this[0];

                var $S = function () {
                    var f = document.defaultView;
                    return new Function('el', 'style', [
                        "style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));",
                        "style=='float' && (style='",
                        f ? 'cssFloat' : 'styleFloat',
                        "');return el.style[style] || ",
                        f ? 'window.getComputedStyle(el, null)[style]' : 'el.currentStyle[style]',
                        ' || null;'
                    ].join(''));
                }();

                return $S(ele, key);

            } else {

                //批量绑定
                this.each(function (ele) {

                    //设置对象样式
                    for (var x in key) {
                        ele.style[x] = key[x];
                    }

                });

                return this;

            }
        },
        /*
            返回对象位置和尺寸信息
            json	如：{"width":width,"height":height}
        */
        position: function (json) {

            var ele = this[0];
            if (!ele) return {};
            if (json) {
                //alert(json.left);
                if (json.left) {
                    ele.style.left = json.left + "px";
                }
                if (json.top) {
                    ele.style.top = json.top + "px";
                }
                return this;
            } else {
                var width = ele.offsetWidth;
                var height = ele.offsetHeight;

                // 2014/03/2 处理当前元素offsetHeight为0子元素offsetHeight正常情况下获取元素高度不正确的问题
                if (height == 0 && ele.childNodes.length > 0) {
                    for (var i = 0; i < ele.childNodes.length; i++) {
                        var h = ele.childNodes[i].offsetHeight;
                        if (typeof (h) !== "undefined" && h > 0) {
                            height += h;
                        }
                    }
                }

                //console.log("W:" + width + " H:" + height);
                var top = ele.offsetTop;
                var left = ele.offsetLeft;

                var sleft = 0,
                    stop = 0,
                    isFix = false;

                //判断上级元素是否有滚动条
                while (ele) {
                    var cssPosition = $e(ele).css("position");
                    if (cssPosition == "fixed") {
                        isFix = true;
                    }
                    if (ele.scrollTop) {
                        stop += ele.scrollTop;
                    }
                    if (ele.scrollLeft) {
                        sleft += ele.scrollLeft;
                    }
                    ele = ele.parentNode;
                }

                ele = this[0];
                while (ele = ele.offsetParent) {
                    //console.log("offsetParent", ele.tagName + ' ' + ele.offsetTop);
                    top += ele.offsetTop;
                    left += ele.offsetLeft;
                }

                //获取页面滚动条的top和left
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

                top = (top + scrollTop);
                left = (left + scrollLeft);

                // 如果在悬浮的div中的元素不减滚动条的高度
                if (!isFix) {
                    top = top - stop;
                    left = left - sleft;
                }

                return {
                    "width": width,
                    "height": height,
                    "top": top,
                    "left": left
                };
            }
        },
        /*
         * 判断样式类是否存在
         * @param	{String}	名称
         * @return	{Boolean}
         */
        hasClass: function (name) {
            if (!this[0]) return false;
            var className = ' ' + name + ' ';
            if ((' ' + this[0].className + ' ').replace(ECF.regexs.rclass, ' ')
                .indexOf(className) > -1) return true;

            return false;
        },

        /*
         * 添加样式类
         * @param	{String}	名称
         */
        getClass: function (elem) {
            return elem.getAttribute && elem.getAttribute("class") || ""
        },
        addClass: function (value) {
            var classNames, i, l, elem,
                setClass, c, cl;

            if (ECF.isFunction(value)) {
                return this.each(function (j) {
                    ECF(this).addClass(value.call(this, j, this.className));
                });
            }

            if (value && typeof (value) === "string") {
                classNames = value.split(ECF.regexs.rspace);
                //alert(this.length);
                for (i = 0; i < this.length; i++) {
                    elem = this[i];
                    if (elem.nodeType === 1) {
                        if (!elem.className && classNames.length === 1) {
                            elem.className = value;

                        } else {
                            setClass = " " + elem.className + " ";

                            for (c = 0, cl = classNames.length; c < cl; c++) {
                                if (!~setClass.indexOf(" " + classNames[c] + " ")) {
                                    setClass += classNames[c] + " ";
                                }
                            }
                            elem.className = setClass.trim();
                        }
                        //alert(elem.className);
                    }
                }
            }

            return this;
        },
        toggleClass: function (value, stateVal) {
            var type = typeof value;

            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }

            if (ECF.isFunction(value)) {
                return this.each(function (i) {
                    ECF(this).toggleClass(
                        value.call(this, i, ECF.getClass(this), stateVal),
                        stateVal
                    );
                });
            }

            return this.each(function () {
                var className, i, self, classNames;

                if (type === "string") {

                    // Toggle individual class names
                    i = 0;
                    self = ECF(this);
                    classNames = value.match(/\S+/g) || [];

                    while ((className = classNames[i++])) {

                        // Check each className given, space separated list
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }

                    // Toggle whole class name
                } else if (value === undefined || type === "boolean") {
                    className = ECF.getClass(this);
                    if (className) {

                        // Store className if set
                        dataPriv.set(this, "__className__", className);
                    }

                    // If the element has a class name or if we're passed `false`,
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    if (this.setAttribute) {
                        this.setAttribute("class",
                            className || value === false ?
                                "" :
                                dataPriv.get(this, "__className__") || ""
                        );
                    }
                }
            });
        },
        //删除样式
        removeClass: function (value) {
            var classNames, i, l, elem, className, c, cl;

            if (ECF.isFunction(value)) {
                return this.each(function (j) {
                    ECF(this).removeClass(value.call(this, j, this.className));
                });
            }

            if ((value && typeof (value) === "string") || value === undefined) {
                classNames = (value || "").split(ECF.regexs.rspace);

                for (i = 0, l = this.length; i < l; i++) {
                    elem = this[i];

                    if (elem.nodeType === 1 && elem.className) {
                        if (value) {
                            className = (" " + elem.className + " ").replace(ECF.regexs.rclass, " ");
                            for (c = 0, cl = classNames.length; c < cl; c++) {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }
                            elem.className = className.trim();

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },
        /*
            获取元素的相对位置信息返回格式为{left:90,top:90}
        */
        offset: function () {
            var pos = this.position();

            return {
                left: pos.left,
                top: pos.top
            };
        },

        //返回需要获取CSS尺寸样式的宽度
        cssWidth: function () {
            if (this.length < 1) return 0;
            var obj = this[0];
            var size = ['width', 'margin-left', 'margin-right', 'padding-left', 'padding-right', 'border-left-width', 'border-right-width'];
            var i = size.length;
            var o = 0;
            while (--i >= 0) {
                o = o + getCssSize(obj, size[i]);
            };
            return o;
        },

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
        },

        /*
            获取已选择元素的大小
        */
        size: function () {
            return this.length;
            var ele = this[0],
                val = 0;
            if (ele) {
                //alert(ECF.css(ele,"padding-left"));


                // alert(css.getStyle(ele,"padding-left")); //100px;


                //ie：通过currentStyle
                // alert(ele.innerHTML);

                // function getCurrentStyle(obj, cssproperty, csspropertyNS){
                // if(obj.style[cssproperty]){
                // return obj.style[cssproperty];
                // }
                // if (obj.currentStyle) {// IE5+
                // return obj.currentStyle[cssproperty];
                // }else if (document.defaultView.getComputedStyle(obj, null)) {// FF/Mozilla
                // var currentStyle = document.defaultView.getComputedStyle(obj, null);
                // var value = currentStyle.getPropertyValue(csspropertyNS);
                // if(!value){//try this method
                // value = currentStyle[cssproperty];
                // }
                // return value;
                // }else if (window.getComputedStyle) {// NS6+
                // var currentStyle = window.getComputedStyle(obj, "");

                // return currentStyle.getPropertyValue(csspropertyNS);
                // }
                // }
                // alert(getCurrentStyle(ele, "padding", "background-left")); //alerts "yellow"
            }
            return val;
        },
        /*
            让元素隐藏,可以设置动画,还可以设置回调函数
        */
        hide: function (speed, easing) {
            var elem, display;
            elem = this[0];
            if (speed || speed === 0) { //,opacity:.2
                return this.animate({
                    height: '1px',
                    opacity: .1,
                    width: '1px'
                }, speed, easing, function () {
                    if (elem.style) {
                        display = elem.style.display;
                        if (display != "none") {
                            display = elem.style.display = "none";
                        }
                    }
                });

            } else {
                for (var i = 0, j = this.length; i < j; i++) {
                    elem = this[i];
                    if (elem.style) {
                        display = elem.style.display;
                        //alert(display);
                        if (display != "none") {
                            display = elem.style.display = "none";
                        }
                    }
                }
                return this;
            }
        },
        /*
            让元素进行显示
        */
        show: function (speed, easing, callback) {
            var elem, display;
            elem = this[0];
            if (speed || speed === 0) {
                return this.animate({
                    height: '5px',
                    opacity: .7
                }, speed, easing, function () {
                    if (elem.style) {
                        display = elem.style.display;
                        if (display == "none") {
                            display = elem.style.display = "";
                        }
                    }
                });

            } else {
                for (var i = 0, j = this.length; i < j; i++) {
                    elem = this[i];
                    if (elem.style) {
                        display = elem.style.display;

                        if (display === "none") {
                            display = elem.style.display = "";
                        }
                    }
                }

                //if (typeof $e.lazy === 'function') {
                //    $e(this[0]).nonePic();
                //}

                return this;
            }
        },
        /*
           对元素进行隐藏显示的切换 by 20140220
       */
        toggle: function () {
            this.each(function () {
                if (ECF.isHide(this)) {
                    ECF(this).show();
                } else {
                    ECF(this).hide();
                }
            });
        },
        /*
        遍历元素，对每个元素执行回调函数
        func		需要执行的函数
        */
        each: function (func) {
            //console.log(typeof(func));
            //元素数量
            var size = this.length;

            var ele = this;

            for (var i = 0; i < size; i++) {

                /*
                回调参数
                ele[i]	当前元素
                i		当前索引
                */
                var res = func.call(ele[i], ele[i], i);

                /*
                如果需要中断，需要在函数体内定义 return false;
                */
                if (res === false) break;

            }

            return this;

        },

        add: function (selector, context) {
            return this.pushStack(
                ECF.unique(
                    ECF.merge(this.get(), ECF(selector, context))
                )
            );
        },

        //在元素前面插入元素
        prepend: function () {
            var ele = this[0];
            if (ele && ele.nodeType === 1) {
                if (typeof (arguments[0]) == "string") {
                    var els = ECF.elements(args[0]);
                    for (var n = 0; n < els.length; n++) {
                        ele.insertBefore(els[n], ele.firstChild);
                    }
                    els = null;
                } else {
                    ele.insertBefore(arguments[0], ele.firstChild);
                }
            }

            //if (typeof $e.lazy === 'function') {
            //    $e(this[0]).nonePic();
            //}

            return this;
        },
        /*
        插入外部创建的元素
        html代码或者是Html中元素对象
        */
        append: function () {
            var ele = this[0],
                args = arguments;
            if (!ele) return this;

            if (ele.tagName == "TABLE") { // 对Table进行特殊处理
                var tbody = $e("tbody", ele);
                if (tbody.length > 0) {
                    ele = tbody[0];
                } else {
                    for (var i = 0; i < ele.childNodes.length; i++) {
                        var node = ele.childNodes[i];
                        if (node.nodeType == 1) {
                            ele = node.tagName == "TBODY" ? node : ele;

                            break;
                        }
                    }
                }
            }

            if (ele && (ele.nodeType === 1 || ele.nodeType === 3)) {
                var ty = typeof (args[0]);
                if (ty == "string" || ty == "number" || ty == "boolean") {

                    var els = ECF.elements(args[0]);

                    var len = els.length;
                    // 此处循环时必须每次都取第一个，els中的值会随append后减少
                    for (var n = 0; n < len; n++) {
                        ele.appendChild(els[0]);
                    }

                    els = null;
                } else {
                    if (arguments[0]) {
                        ele.appendChild(arguments[0]);
                    }
                }
            }

            //if (typeof $e.lazy === 'function') {
            //    $e(this[0]).nonePic();
            //}


            return this;
        },
        //把元素插入指定的位置,name为插入指定的对象
        appendTo: function (name) {
            ECF(name).append(this[0]);
            return this;
        },
        //在元素的后面插入对象
        after: function () {
            var html = arguments[0],
                elem = this[0];
            if (elem && elem.parentNode) {

                var next = elem.nextSibling;

                if (typeof (html) === "string") {
                    var els = ECF.elements(html);
                    for (var n = 0; n < els.length; n++) {

                        elem.parentNode.appendChild(els[n], elem);
                    }
                } else if (html && html.nodeType == 1) {
                    if (next) {
                        elem.parentNode.insertBefore(html, next);
                    } else {
                        elem.parentNode.appendChild(html);
                    }
                }
            }
            return this
        },
        // 在指定元素前面插入元素
        before: function () {
            var html = arguments[0],
                elem = this[0];
            if (elem && elem.parentNode) {
                if (typeof (html) === "string") {
                    var els = ECF.elements(html);
                    for (var n = 0; n < els.length; n++) {
                        elem.parentNode.insertBefore(els[n], elem);
                    }
                } else if (html && html.nodeType == 1) {
                    elem.parentNode.insertBefore(html, elem);
                }
            }
            return this
        },
        /*
        删除元素
        */
        remove: function () {
            //批量删除
            this.each(function (ele) {
                if (ele.parentNode) ele.parentNode.removeChild(ele);
            });

            return this;
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
            return num != null ?

                // Return a 'clean' array
                (num < 0 ? this[num + this.length] : this[num]) :

                // Return just the object
                [].slice.call(this);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {

            // Build a new ECF matched element set
            var ret = ECF.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;

            // Return the newly-formed element set
            return ret;
        },

        map: function (callback) {
            return this.pushStack(ECF.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        end: function () {
            return this.prevObject || this.constructor(null);
        },
        /*
        返回目前元素中的最后一个元素
        */
        //end: function () {
        //    return this[this.length - 1];
        //},
        //清空所有元素
        empty: function () {
            for (var i = 0, elem;
                (elem = this[i]) != null; i++) {
                // Remove element nodes and prevent memory leaks
                if (elem.nodeType === 1) {
                    ECF.cleanData(elem.getElementsByTagName("*"));
                }

                // Remove any remaining nodes
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
            return this;
        },
        /*
        获取元素下的所有子节点
        */
        children: function () {
            if (this.length < 1) return null;
            var ele = this[0];
            var chs = new Array(),
                i = 0;
            //alert(ele);
            for (i = 0; i < ele.childNodes.length; i++) {
                var e = ele.childNodes[i];
                if (e && e.nodeType == 1) {
                    chs.push(ECF(e));
                }
            }
            return chs;
        },
        /*
             获取父节点或父元素并返回可操作的ECF元素 * 表示任一节点
             by 20140220 添加查找到指定节点名的节点,只是返回最终的那一个节点
         */
        parent: function (tagName, attName, attValue) {
            if (typeof (tagName) == "string" && tagName !== "") {
                var element = this[0];
                while (element.parentNode) {
                    // 判断节点类型
                    if (element.parentNode.nodeType == 1) {
                        element = element.parentNode;

                        // 判断TagName是否相同, 如果tagName不为*号再向低级查找
                        if (element.tagName == tagName.toUpperCase() || tagName == "*") {
                            // 对属性进行获取和判断
                            if (typeof (attName) == "string" && attName !== "") {
                                var attr = element.getAttribute(attName);
                                // console.log(attr);
                                if (attr != null) {
                                    if (typeof (attValue) == "string" && attValue !== "") {
                                        if (attValue.toLowerCase() == attValue.toLowerCase()) {
                                            break;
                                        }
                                    } else {
                                        break;
                                    }
                                }
                            } else {
                                break;
                            }
                        }

                    } else {
                        break;
                    }
                }
                return ECF(element);
            } else {
                var elem = this[0];
                if (elem) {
                    var parent = elem.parentNode;
                    return ECF(parent && parent.nodeType !== 11 ? parent : null);
                }
                return elem;
            }
        },
        /*
            获取元素的所有父节点ECF操作元素

        */
        parents: function (tagName) {
            var element = this[0],
                pns = [];
            if (typeof (tagName) == "string" && tagName !== "") {

                while (element.parentNode) {
                    if (element.parentNode.nodeType == 1) {
                        element = element.parentNode;
                        pns.push(ECF(element));
                        if (element.tagName == tagName.toUpperCase()) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } else {
                while (element.parentNode) {
                    element = element.parentNode;
                    pns.push(ECF(element));
                }
            }
            return pns;
        },
        /*
        获取当前元素的前一个对象元素
        param: tagName 节点名 20120221
        */
        prev: function (tag) {
            var ele = this[0];

            while (ele.previousSibling) {
                ele = ele.previousSibling;
                if (ele.nodeType == 1) {
                    if (typeof (tag) == "string") { //判断是否给定了tagName
                        //alert(ele.tagName + "==" + tag.toUpperCase());
                        if (ele.tagName == tag.toUpperCase()) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            return ECF(ele);
        },
        /*
        获取当元素的后一个对象元素
        */
        next: function () {
            var ele = this[0];
            while (ele.nextSibling) {
                ele = ele.nextSibling;
                if (ele.nodeType == 1) {
                    break;
                }
            }
            return ECF(ele);
        },
        /*
        即同时绑定鼠标
        */
        hover: function () {
            //alert(arguments[0]);
            this.mouseover(arguments[0]).mouseout(arguments[1]);
            return this;
        },
        /*
         */
        stop: function () {
            var timers = ECF.timers;
            for (var i = timers.length - 1; i >= 0; i--) {
                if (timers[i].elem === this[0]) timers.splice(i, 1);
            };
            return this;
        },
        //动画效果
        animate: function (prop, speed, easing, callback) {
            return ECF.animate(this[0], prop, speed, easing, callback);
        },

        /*
            为元素设置样式
        */
        setStyle: function (property, val) {
            var el = this[0];
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
            return this;
        },

        /*
        往前移动Html元素
        htmlNode: 需要移动Html元素,或者直接给定基于选择对象的第一个需要移动元素的TagName
        direc: HtmlNode移动的方向,0表示上,1表示下
        */
        move: function (htmlNode, direc) {

            htmlNode = htmlNode || this[0];
            if (typeof (htmlNode) == "string") {
                var t = this[0];
                while (t && t.parentNode && t.nodeType == 1) {
                    if (t.tagName == htmlNode.toUpperCase()) {
                        break;
                    }
                    t = t.parentNode;
                }
                htmlNode = t;
            }
            if (!htmlNode) { //当没有找到当前元素时,直接返回
                return this;
            }

            if (direc == "1") {
                var nextSibling = getNextSibling(htmlNode);
                if (nextSibling) {
                    htmlNode.parentNode.insertBefore(nextSibling, htmlNode);
                }
            } else {
                var prevSibling = getPreviousSibling(htmlNode);
                if (prevSibling) {
                    htmlNode.parentNode.insertBefore(htmlNode, prevSibling);
                }
            }

            return this;

            // 获取上一个节点, 主要处理Mozilla浏览器会把text节点也当作节点处理[可能把空格当作了]
            // currentSibling: 当前DOM元素节点
            function getPreviousSibling(currentSibling) {
                var prevSibling = currentSibling.previousSibling;
                // 首先要存在上一个节点, 如果本来就不存在上一个节点则不再执行循环
                while (prevSibling && prevSibling.nodeType != 1) {
                    prevSibling = prevSibling.previousSibling;
                };
                return prevSibling;
            };

            // 获取下一个节点, 主要处理Mozilla浏览器会把text节点也当作节点处理[可能把空格当作了]
            // currentSibling: 当前DOM元素节点
            function getNextSibling(currentSibling) {
                var nextNode = currentSibling.nextSibling;
                // 首先要存在下一个节点, 如果本来就不存在下一个节点则不再执行循环
                while (nextNode && nextNode.nodeType != 1) {
                    nextNode = nextNode.nextSibling;
                };
                return nextNode;
            };
        },

        // 淡入
        fadeIn: function (speed, callback) {

            var isShow = this.css("display");
            if (isShow == "none") {
                this.setStyle("opacity", 0);
                this.show();
            }
            this.animate({
                "opacity": 1
            }, speed, null, callback);

        },

        //淡出
        fadeOut: function (speed, callback) {
            var my = this;
            this.animate({
                "opacity": 0
            }, speed, null, function () {
                my.hide();
                if (typeof (callback) == "function") {
                    callback.apply(this, null);
                }
            });
        },

        // 淡入淡出切换
        fadeToggle: function (speed, callback) {

            var isShow = this.css("display");
            if (isShow == "none") {
                this.fadeIn(speed, callback);
            } else {
                this.fadeOut(speed, callback);
            }
        },

        // 自定义不透明度
        fadeTo: function (speed, opacity, callback) {

            var isShow = this.css("display");
            if (isShow == "none") {
                this.setStyle("opacity", 0);
                this.show();
            }

            this.animate({
                "opacity": opacity
            }, speed, null, callback);
        },

        // 向上收缩效果
        slideUp: function (speed, callback) {

        },

        //向下展开效果
        slideDown: function (speed, callback) {

        },

        //交替伸缩效果
        slideToggle: function (speed, callback) {

        }


    });

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        if (ECF.isFunction(qualifier)) {
            return ECF.grep(elements, function (elem, i) {
                /* jshint -W018 */
                return !!qualifier.call(elem, i, elem) !== not;
            });

        }

        if (qualifier.nodeType) {
            return ECF.grep(elements, function (elem) {
                return (elem === qualifier) !== not;
            });

        }

        if (typeof qualifier === "string") {
            if (ECF.regexs.risSimple.test(qualifier)) {
                return ECF.filter(qualifier, elements, not);
            }

            qualifier = ECF.filter(qualifier, elements);
        }

        return ECF.grep(elements, function (elem) {
            return (ECF.inArray(elem, qualifier) >= 0) !== not;
        });
    }

    // ECF过滤器
    ECF.filter = function (expr, elems, not) {
        var elem = elems[0];

        if (not) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 && elem.nodeType === 1 ?
            ECF.find.matchesSelector(elem, expr) ? [elem] : [] :
            ECF.find.matches(expr, ECF.grep(elems, function (elem) {
                return elem.nodeType === 1;
            }));
    };

    // 以原对象为原型进行筛选和查找，判断的扩展
    ECF.fn.extend({
        //以原对象为原型进行元素选择查找
        find: function (selector) {
            var i,
                ret = [],
                self = this,
                len = self.length;

            if (typeof selector !== "string") {
                return this.pushStack(ECF(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (ECF.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }

            for (i = 0; i < len; i++) {
                ECF.find(selector, self[i], ret);
            }

            // Needed because $e( selector, context ) becomes $e( context ).find( selector )
            ret = this.pushStack(len > 1 ? ECF.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        },
        filter: function (selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },
        not: function (selector) {
            return this.pushStack(winnow(this, selector || [], true));
        },
        is: function (selector) {
            return !!winnow(
                this,

                // If this is a positional/relative selector, check membership in the returned set
                // so $e("p:first").is("p:last") won't return true for a doc with two "p".
                typeof selector === "string" && rneedsContext.test(selector) ?
                    ECF(selector) :
                    selector || [],
                false
            ).length;
        }
    });

    // 这对象扩展事件
    ECF.fn.extend({

        on: function (types, selector, data, fn, /*INTERNAL*/ one) {
            var type, origFn;

            if (typeof types === "object") {
                if (typeof selector !== "string") {
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }

            if (data == null && fn == null) {
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    fn = data;
                    data = undefined;
                } else {
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }

            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    // 可以使用一个空集，因为事件包含的信息
                    ECF().off(event);
                    return origFn.apply(this, arguments);
                };
                //使用相同的GUID，以便调用者可以使用origFn删除
                fn.guid = origFn.guid || (origFn.guid = ECF.guid++);
            }
            return this.each(function () {
                ECF.event.add(this, types, fn, data, selector);
            });
        },
        one: function (types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                // ( event )  dispatched ECF.Event
                handleObj = types.handleObj;
                ECF(types.delegateTarget).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if (typeof types === "object") {

                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                ECF.event.remove(this, types, fn, selector);
            });
        },

        trigger: function (type, data) {
            return this.each(function () {
                ECF.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return ECF.event.trigger(type, data, elem, true);
            }
        }
    });

    // 安全活动元素
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) { }
    }

    // 静态事件处理对象
    ECF.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof ECF.Event)) {
            return new ECF.Event(src, props);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
                src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            ECF.extend(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || ECF.now();

        // Mark it as fixed
        this[ECF.expando] = true;
    };

    // ECF.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    ECF.Event.prototype = {
        isDefaultPrevented: ECF.returnFunc,
        isPropagationStopped: ECF.returnFunc,
        isImmediatePropagationStopped: ECF.returnFunc,

        preventDefault: function () {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;
            if (!e) {
                return;
            }

            // If preventDefault exists, run it on the original event
            if (e.preventDefault) {
                e.preventDefault();

                // Support: IE
                // Otherwise set the returnValue property of the original event to false
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;
            if (!e) {
                return;
            }
            // If stopPropagation exists, run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            // Support: IE
            // Set the cancelBubble property of the original event to true
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        }
    };

    //Event事件处理
    ECF.extend({
        event: {
            /*
             * 添加事件
             * @param		{HTMLElement}	元素
             * @param		{String}		事件类型
             * @param		{Function}		要添加的函数
             */
            add: function (elem, type, callback) {

                if (elem.nodeType === 3 || elem.nodeType === 8) {
                    return;
                }

                if (callback === false) {
                    callback = function () {
                        return false;
                    };
                } else if (!callback) {
                    return;
                }
                if (callback) {
                    //alert(elem.addEventListener);
                    if (elem.addEventListener) {
                        elem.addEventListener(type, callback, false);

                    } else if (elem.attachEvent) {
                        //load event 只能用attachEvent
                        if (type == "load")
                            elem.attachEvent("on" + type, callback);
                        else
                            elem["on" + type] = callback;
                    }
                    //alert(elem.onclick + "" +type);
                };
                ECF.event.global[type] = true;
                elem = null;
            },

            clear: function (elem, type) {
                if (elem.nodeType === 3 || elem.nodeType === 8) {
                    return;
                }

                if (typeof (type) == "string") {
                    if (elem["on" + type]) {
                        elem["on" + type] = null;
                    }
                }
            },
            global: {},
            /*
             * 卸载事件
             * @param		{HTMLElement}	元素
             * @param		{String}		事件类型
             * @param		{Function}		要卸载的函数
             */
            // Detach an event or set of events from an element
            remove: function (elem, type, callback) {
                if (elem.nodeType === 3 || elem.nodeType === 8) {
                    return;
                }

                if (callback === false) {
                    callback = function () {
                        return false;
                    };
                } else if (!callback) {
                    return;
                }
                if (callback) {
                    // console.log(callback);
                    //alert(elem.addEventListener);
                    if (elem.removeEventListener) {
                        elem.removeEventListener(type, callback, false);

                    } else if (elem.detachEvent) {
                        //load event 只能用attachEvent
                        if (type == "load")
                            elem.detachEvent("on" + type, callback);
                        else
                            elem["on" + type] = null;
                    }
                };
                ECF.event.global[type] = false;
                elem = null;
            },

            trigger: function (event, data, elem, onlyHandlers) {
                var handle, ontype, cur,
                    bubbleType, special, tmp, i,
                    eventPath = [elem || document],
                    type = hasOwn.call(event, "type") ? event.type : event,
                    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

                cur = tmp = elem = elem || document;

                // Don't do events on text and comment nodes
                if (elem.nodeType === 3 || elem.nodeType === 8) {
                    return;
                }

                // focus/blur morphs to focusin/out; ensure we're not firing them right now
                if (ECF.regexs.rfocusMorph.test(type + ECF.event.triggered)) {
                    return;
                }

                if (type.indexOf(".") >= 0) {
                    // Namespaced trigger; create a regexp to match event type in handle()
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    namespaces.sort();
                }
                ontype = type.indexOf(":") < 0 && "on" + type;

                // Caller can pass in a ECF.Event object, Object, or just an event type string
                event = event[ECF.expando] ?
                    event :
                    new ECF.Event(type, typeof event === "object" && event);

                // Trigger bitmask: & 1 for native handlers; & 2 for ECF (always true)
                event.isTrigger = onlyHandlers ? 2 : 3;
                event.namespace = namespaces.join(".");
                event.namespace_re = event.namespace ?
                    new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                    null;

                // Clean up the event in case it is being reused
                event.result = undefined;
                if (!event.target) {
                    event.target = elem;
                }

                // Clone any incoming data and prepend the event, creating the handler arg list
                data = data == null ? [event] :
                    ECF.makeArray(data, [event]);

                // Allow special events to draw outside the lines
                special = ECF.event.special[type] || {};
                if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                    return;
                }

                // Determine event propagation path in advance, per W3C events spec (#9951)
                // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                if (!onlyHandlers && !special.noBubble && !ECF.isWindow(elem)) {

                    bubbleType = special.delegateType || type;
                    if (!ECF.regexs.rfocusMorph.test(bubbleType + type)) {
                        cur = cur.parentNode;
                    }
                    for (; cur; cur = cur.parentNode) {
                        eventPath.push(cur);
                        tmp = cur;
                    }

                    // Only add window if we got to document (e.g., not plain obj or detached DOM)
                    if (tmp === (elem.ownerDocument || document)) {
                        eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                    }
                }

                // Fire handlers on the event path
                i = 0;
                while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

                    event.type = i > 1 ?
                        bubbleType :
                        special.bindType || type;

                    // ECF handler
                    handle = (ECF.data(cur, "events") || {})[event.type] && ECF.data(cur, "handle");
                    if (handle) {
                        handle.apply(cur, data);
                    }

                    // Native handler
                    handle = ontype && cur[ontype];
                    if (handle && ECF.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
                        event.preventDefault();
                    }
                }
                event.type = type;

                // If nobody prevented the default action, do it now
                if (!onlyHandlers && !event.isDefaultPrevented()) {

                    if ((!special._default || special._default.apply(eventPath.pop(), data) === false) &&
                        ECF.acceptData(elem)) {

                        // Call a native DOM method on the target with the same name name as the event.
                        // Can't use an .isFunction() check here because IE6/7 fails that test.
                        // Don't do default actions on window, that's where global variables be (#6170)
                        if (ontype && elem[type] && !ECF.isWindow(elem)) {

                            // Don't re-trigger an onFOO event when we call its FOO() method
                            tmp = elem[ontype];

                            if (tmp) {
                                elem[ontype] = null;
                            }

                            // Prevent re-triggering of the same event, since we already bubbled it above
                            ECF.event.triggered = type;
                            try {
                                elem[type]();
                            } catch (e) {
                                // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                                // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                            }
                            ECF.event.triggered = undefined;

                            if (tmp) {
                                elem[ontype] = tmp;
                            }
                        }
                    }
                }

                return event.result;
            },

            /* @inner 事件监听器 */
            handler: function (cache) {
                return function (event) {
                    event = ECF.event.fix(event || window.event);
                    for (var i = 0, list = cache.listeners, fn; fn = list[i++];) {
                        if (fn.call(cache.elem, event) === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        };
                    };
                };
            },

            /* @inner Event对象兼容处理 */
            fix: function (event) {
                if (event.target) return event;

                var event2 = {
                    target: event.srcElement || document,
                    preventDefault: function () {
                        event.returnValue = false
                    },
                    stopPropagation: function () {
                        event.cancelBubble = true
                    }
                };
                // IE6/7/8 在原生window.event对象写入数据会导致内存无法回收，应当采用拷贝
                for (var i in event) event2[i] = event[i];
                return event2;
            },
            //在不同的浏览器下获取event对象
            getEvent: function () {
                // "use strict";
                if (document.all) return window.event;
                func = ECF.event.getEvent.caller;
                var i = 1;
                while (func != null) {
                    var arg0 = func.arguments[0];
                    if (arg0) {
                        if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == 'object' && arg0.preventDefault && arg0.stopPropagation)) {
                            return arg0;
                        };
                    };

                    try {
                        func = func.arguments.callee.caller;
                    } catch (e) {
                        return func;
                    }

                };
                return null;
            },
            // 阻止冒泡事件
            stopBubble: function () {
                var evt = ECF.event.getEvent();
                //如果提供了事件对象，则这是一个非IE浏览器
                if (evt && evt.stopPropagation) {
                    //因此它支持W3C的stopPropagation()方法
                    evt.stopPropagation();
                } else {

                    //否则，我们需要使用IE的方式来取消事件冒泡
                    if (window.event) window.event.cancelBubble = true;
                }

            },

            // 阻止浏览器的默认行为
            stopDefault: function () {

                var evt = ECF.event.getEvent();

                // 阻止默认浏览器动作(W3C)
                if (evt && evt.preventDefault) {
                    // IE中阻止函数器默认动作的方式
                    evt.preventDefault();
                } else {
                    if (window.event) window.event.returnValue = false;
                    return false;
                };
            },
            special: {
                load: {
                    // Prevent triggered image.load events from bubbling to window.load
                    noBubble: true
                },
                focus: {
                    // Fire native event if possible so blur/focus sequence is correct
                    trigger: function () {
                        if (this !== safeActiveElement() && this.focus) {
                            try {
                                this.focus();
                                return false;
                            } catch (e) {
                                // Support: IE<9
                                // If we error on focus to hidden element (#1486, #12518),
                                // let .trigger() run the handlers
                            }
                        }
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function () {
                        if (this === safeActiveElement() && this.blur) {
                            this.blur();
                            return false;
                        }
                    },
                    delegateType: "focusout"
                },
                click: {
                    // For checkbox, fire native event so checked state will be right
                    trigger: function () {
                        if (ECF.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                            this.click();
                            return false;
                        }
                    },

                    // For cross-browser consistency, don't fire native .click() on links
                    _default: function (event) {
                        return ECF.nodeName(event.target, "a");
                    }
                },

                beforeunload: {
                    postDispatch: function (event) {

                        // Support: Firefox 20+
                        // Firefox doesn't alert if the returnValue field is not set.
                        if (event.result !== undefined && event.originalEvent) {
                            event.originalEvent.returnValue = event.result;
                        }
                    }
                }
            }

        }
    });

    //动画效果
    ECF.extend({
        opacity: {
            get: function (elem) {
                return 'opacity' in document.documentElement.style ?
                    document.defaultView.getComputedStyle(elem, false).opacity :
                    ropacity.test((elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || '') ? (parseFloat(RegExp.$1) / 100) + '' : 1;
            },
            set: function (elem, value) {
                if ('opacity' in document.documentElement.style) return elem.style.opacity = value;
                var style = elem.style;
                style.zoom = 1;

                var opacity = 'alpha(opacity=' + value * 100 + ')',
                    filter = style.filter || '';
                var ralpha = /alpha\([^)]*\)/i;
                style.filter = ralpha.test(filter) ?
                    filter.replace(ralpha, opacity) :
                    style.filter + ' ' + opacity;
            }
        },
        //动画api
        animate: function (ele, prop, speed, easing, callback) {

            speed = speed || 400;
            if (!ele) return this; //如果对象不存在直接返回
            // for(var i=0; i< arguments.length; i++){
            // alert(arguments[i]);
            // }
            if (typeof (easing) === 'function') callback = easing;
            easing = easing && ECF.easing[easing] ? easing : 'swing';

            var self = this,
                overflow,
                fx, parts, start, end, unit,
                opt = {
                    speed: speed,
                    easing: easing,
                    callback: function () {
                        if (overflow != null) ele.style.overflow = '';
                        callback && callback();
                    }
                };

            opt.curAnim = {};

            ECF.each(prop, function (name, val) {
                opt.curAnim[name] = val;
            });

            //循环处理
            ECF.each(prop, function (name, val) {
                fx = new ECF.fx(ele, opt, name);
                //console.log(fx);
                parts = ECF.regexs.rfxnum.exec(val);
                if (parts == null) return;
                start = parseFloat(name === 'opacity' || (ele.style && ele.style[name] != null) ?
                    ECF(ele).css(name) :
                    ele[name]);
                end = parseFloat(parts[2]);
                unit = parts[3];
                if (name === 'height' || name === 'width') {
                    end = Math.max(0, end);
                    overflow = [ele.style.overflow,
                    ele.style.overflowX, ele.style.overflowY
                    ];
                };

                fx.custom(start, end, unit);
            });

            if (overflow != null) ele.style.overflow = 'hidden';

            return this;
        },
        //
        easing: {
            linear: function (p, n, firstNum, diff) {
                return firstNum + diff * p;
            },
            swing: function (p, n, firstNum, diff) {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
            }
        },
        timers: [],
        fx: function (elem, options, prop) { //动画效果对象
            this.elem = elem;
            this.options = options;
            this.prop = prop;
        },
        xml: function (data) {
            //alert(data);
        },

        params: {} //扩展参数处理对象

    });

    //动画效果 fx
    ECF.extend(ECF.fx, {
        timerId: null,
        tick: function () {
            var timers = ECF.timers;
            for (var i = 0; i < timers.length; i++) {
                !timers[i]() && timers.splice(i--, 1);
            };
            !timers.length && ECF.fx.stop();
        },
        stop: function () {
            clearInterval(ECF.fx.timerId);
            ECF.fx.timerId = null;
        }

    });

    //对动画效果fx进行扩展
    ECF.extend(ECF.fx.prototype, {
        custom: function (from, to, unit) {
            var that = this;
            that.startTime = ECF.now();
            that.start = from;
            that.end = to;
            that.unit = unit;
            that.now = that.start;
            that.state = that.pos = 0;

            function t() {
                return that.step();
            };
            t.elem = that.elem;
            t();
            ECF.timers.push(t);
            if (!ECF.fx.timerId) ECF.fx.timerId = setInterval(ECF.fx.tick, 13);
        },
        step: function () {
            var that = this,
                t = ECF.now(),
                done = true;

            if (t >= that.options.speed + that.startTime) {
                that.now = that.end;
                that.state = that.pos = 1;
                that.update();

                that.options.curAnim[that.prop] = true;
                for (var i in that.options.curAnim) {
                    if (that.options.curAnim[i] !== true) {
                        done = false;
                    };
                };

                if (done) that.options.callback.call(that.elem);

                return false;
            } else {
                var n = t - that.startTime;
                that.state = n / that.options.speed;
                that.pos = ECF.easing[that.options.easing](that.state, n, 0, 1, that.options.speed);
                that.now = that.start + ((that.end - that.start) * that.pos);
                that.update();
                return true;
            };
        },
        update: function () {
            var that = this;
            if (that.prop === 'opacity') {
                ECF.opacity.set(that.elem, that.now);
            } else
                if (that.elem.style && that.elem.style[that.prop] != null) {
                    if (typeof (that.now) == 'number') {
                        //张凯 2013-05-29 修改此处是因为that.now有事值会NaN的情况时会报错
                        if (that.now.toString() == 'NaN') {
                            that.now = 0;
                        };
                        that.elem.style[that.prop] = that.now + that.unit;
                    };
                } else {
                    that.elem[that.prop] = that.now;
                };
        }
    });

    /*
     * 获取滚动条位置 - [不支持写入]
     * ECF.fn.scrollLeft, ECF.fn.scrollTop
     * @example		获取文档垂直滚动条：$e(document).scrollTop()
     * @return		{Number}	返回滚动条位置
     */
    ECF.each(['Left', 'Top'], function (i, name) {
        var method = 'scroll' + name;

        ECF.fn[method] = function (val) {
            var elem = this[0],
                win;

            win = ECF.getWindow(elem);
            return win ?
                ('pageXOffset' in win) ?
                    win[i ? 'pageYOffset' : 'pageXOffset'] :
                    win.document.documentElement[method] || win.document.body[method] :
                elem[method];
        };
    });

    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    ECF.each({
        Height: "height",
        Width: "width"
    }, function (name, type) {
        ECF.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
        }, function (defaultExtra, funcName) {
            // margin is only for outerHeight, outerWidth
            ECF.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                return ECF.access(this, type, chainable ? margin : undefined, chainable, function (elem, type, value) {
                    var doc;

                    if (ECF.isWindow(elem)) {

                        return elem.document.documentElement["client" + name];
                    }

                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body["scroll" + name], doc["scroll" + name],
                            elem.body["offset" + name], doc["offset" + name],
                            doc["client" + name]
                        );
                    }

                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        ECF.css(elem, type, margin) :

                        // Set width or height on the element
                        ECF.style(elem, type, value, extra);
                }, null);
            };
        });
    });

    // 事件绑定
    ECF.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

            // Handle event binding
            ECF.fn[name] = function (data, fn) {
                return arguments.length > 0 ?
                    this.on(name, null, data, fn) :
                    this.trigger(name);
            };
        });

    // 事件绑定
    ECF.fn.extend({
        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },

        bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            return this.off(types, null, fn);
        },

        clearBind: function (type) {
            this.each(function () {
                ECF.event.clear(this, type);
            });
        },

        delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });

    // 框架选择器
    (function () {

        /*!
         * Sizzle CSS Selector Engine v1.10.19
         * http://sizzlejs.com/
         *
         * Copyright 2013 ECF Foundation, Inc. and other contributors
         * Released under the MIT license
         *
         * Date: 2014-04-18
         */
        var Sizzle = (function (window) {

            var i,
                support,
                Expr,
                getText,
                isXML,
                tokenize,
                compile,
                select,
                outermostContext,
                sortInput,
                hasDuplicate,

                // Local document vars
                setDocument,
                document,
                docElem,
                documentIsHTML,
                rbuggyQSA,
                rbuggyMatches,
                matches,
                contains,

                // Instance-specific data
                expando = "sizzle" + -(new Date()),
                preferredDoc = window.document,
                dirruns = 0,
                done = 0,
                classCache = createCache(),
                tokenCache = createCache(),
                compilerCache = createCache(),
                sortOrder = function (a, b) {
                    if (a === b) {
                        hasDuplicate = true;
                    }
                    return 0;
                },

                // General-purpose constants
                strundefined = typeof undefined,
                MAX_NEGATIVE = 1 << 31,

                // Instance methods
                hasOwn = ({}).hasOwnProperty,
                arr = [],
                pop = arr.pop,
                push_native = arr.push,
                push = arr.push,
                slice = arr.slice,
                // Use a stripped-down indexOf if we can't use a native one
                indexOf = arr.indexOf || function (elem) {
                    var i = 0,
                        len = this.length;
                    for (; i < len; i++) {
                        if (this[i] === elem) {
                            return i;
                        }
                    }
                    return -1;
                },

                booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

                // Regular expressions

                // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
                whitespace = "[\\x20\\t\\r\\n\\f]",
                // http://www.w3.org/TR/css3-syntax/#characters
                characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

                // Loosely modeled on CSS identifier characters
                // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
                // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
                identifier = characterEncoding.replace("w", "w#"),

                // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
                attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
                    // Operator (capture 2)
                    "*([*^$|!~]?=)" + whitespace +
                    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                    "*\\]",

                pseudos = ":(" + characterEncoding + ")(?:\\((" +
                    // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                    // 1. quoted (capture 3; capture 4 or capture 5)
                    "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                    // 2. simple (capture 6)
                    "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                    // 3. anything else (capture 2)
                    ".*" +
                    ")\\)|)",

                // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
                rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

                rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
                rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

                rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

                rpseudo = new RegExp(pseudos),
                ridentifier = new RegExp("^" + identifier + "$"),

                matchExpr = {
                    "ID": new RegExp("^#(" + characterEncoding + ")"),
                    "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
                    "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                    "ATTR": new RegExp("^" + attributes),
                    "PSEUDO": new RegExp("^" + pseudos),
                    "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                        "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                        "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                    "bool": new RegExp("^(?:" + booleans + ")$", "i"),
                    // For use in libraries implementing .is()
                    // We use this for POS matching in `select`
                    "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                        whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
                },

                rinputs = /^(?:input|select|textarea|button)$/i,
                rheader = /^h\d$/i,

                rnative = /^[^{]+\{\s*\[native \w/,

                // Easily-parseable/retrievable ID or TAG or CLASS selectors
                rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

                rsibling = /[+~]/,
                rescape = /'|\\/g,

                // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
                runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
                funescape = function (_, escaped, escapedWhitespace) {
                    var high = "0x" + escaped - 0x10000;
                    // NaN means non-codepoint
                    // Support: Firefox<24
                    // Workaround erroneous numeric interpretation of +"0x"
                    return high !== high || escapedWhitespace ?
                        escaped :
                        high < 0 ?
                            // BMP codepoint
                            String.fromCharCode(high + 0x10000) :
                            // Supplemental Plane codepoint (surrogate pair)
                            String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
                };

            // Optimize for push.apply( _, NodeList )
            try {
                push.apply(
                    (arr = slice.call(preferredDoc.childNodes)),
                    preferredDoc.childNodes
                );
                // Support: Android<4.0
                // Detect silently failing push.apply
                arr[preferredDoc.childNodes.length].nodeType;
            } catch (e) {
                push = {
                    apply: arr.length ?

                        // Leverage slice if possible
                        function (target, els) {
                            push_native.apply(target, slice.call(els));
                        } :

                        // Support: IE<9
                        // Otherwise append directly
                        function (target, els) {
                            var j = target.length,
                                i = 0;
                            // Can't trust NodeList.length
                            while ((target[j++] = els[i++])) { }
                            target.length = j - 1;
                        }
                };
            }

            function Sizzle(selector, context, results, seed) {
                var match, elem, m, nodeType,
                    // QSA vars
                    i, groups, old, nid, newContext, newSelector;

                if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                    setDocument(context);
                }

                context = context || document;
                results = results || [];

                if (!selector || typeof selector !== "string") {
                    return results;
                }

                if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                    return [];
                }

                if (documentIsHTML && !seed) {

                    // Shortcuts
                    if ((match = rquickExpr.exec(selector))) {
                        // Speed-up: Sizzle("#ID")
                        if ((m = match[1])) {
                            if (nodeType === 9) {
                                elem = context.getElementById(m);
                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document (ECF #6963)
                                if (elem && elem.parentNode) {
                                    // Handle the case where IE, Opera, and Webkit return items
                                    // by name instead of ID
                                    if (elem.id === m) {
                                        results.push(elem);
                                        return results;
                                    }
                                } else {
                                    return results;
                                }
                            } else {
                                // Context is not a document
                                if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                                    contains(context, elem) && elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            }

                            // Speed-up: Sizzle("TAG")
                        } else if (match[2]) {
                            push.apply(results, context.getElementsByTagName(selector));
                            return results;

                            // Speed-up: Sizzle(".CLASS")
                        } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                            push.apply(results, context.getElementsByClassName(m));
                            return results;
                        }
                    }

                    // QSA path
                    if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                        nid = old = expando;
                        newContext = context;
                        newSelector = nodeType === 9 && selector;

                        // qSA works strangely on Element-rooted queries
                        // We can work around this by specifying an extra ID on the root
                        // and working up from there (Thanks to Andrew Dupont for the technique)
                        // IE 8 doesn't work on object elements
                        if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                            groups = tokenize(selector);

                            if ((old = context.getAttribute("id"))) {
                                nid = old.replace(rescape, "\\$&");
                            } else {
                                context.setAttribute("id", nid);
                            }
                            nid = "[id='" + nid + "'] ";

                            i = groups.length;
                            while (i--) {
                                groups[i] = nid + toSelector(groups[i]);
                            }
                            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                            newSelector = groups.join(",");
                        }

                        if (newSelector) {
                            try {
                                push.apply(results,
                                    newContext.querySelectorAll(newSelector)
                                );
                                return results;
                            } catch (qsaError) { } finally {
                                if (!old) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }
                }

                // All others
                return select(selector.replace(rtrim, "$1"), context, results, seed);
            }

            /**
             * Create key-value caches of limited size
             * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
             *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
             *	deleting the oldest entry
             */
            function createCache() {
                var keys = [];

                function cache(key, value) {
                    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                    if (keys.push(key + " ") > Expr.cacheLength) {
                        // Only keep the most recent entries
                        delete cache[keys.shift()];
                    }
                    return (cache[key + " "] = value);
                }
                return cache;
            }

            /**
             * Mark a function for special use by Sizzle
             * @param {Function} fn The function to mark
             */
            function markFunction(fn) {
                fn[expando] = true;
                return fn;
            }

            /**
             * Support testing using an element
             * @param {Function} fn Passed the created div and expects a boolean result
             */
            function assert(fn) {
                var div = document.createElement("div");

                try {
                    return !!fn(div);
                } catch (e) {
                    return false;
                } finally {
                    // Remove from its parent by default
                    if (div.parentNode) {
                        div.parentNode.removeChild(div);
                    }
                    // release memory in IE
                    div = null;
                }
            }

            /**
             * Adds the same handler for all of the specified attrs
             * @param {String} attrs Pipe-separated list of attributes
             * @param {Function} handler The method that will be applied
             */
            function addHandle(attrs, handler) {
                var arr = attrs.split("|"),
                    i = attrs.length;

                while (i--) {
                    Expr.attrHandle[arr[i]] = handler;
                }
            }

            /**
             * Checks document order of two siblings
             * @param {Element} a
             * @param {Element} b
             * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
             */
            function siblingCheck(a, b) {
                var cur = b && a,
                    diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                        (~b.sourceIndex || MAX_NEGATIVE) -
                        (~a.sourceIndex || MAX_NEGATIVE);

                // Use IE sourceIndex if available on both nodes
                if (diff) {
                    return diff;
                }

                // Check if b follows a
                if (cur) {
                    while ((cur = cur.nextSibling)) {
                        if (cur === b) {
                            return -1;
                        }
                    }
                }

                return a ? 1 : -1;
            }

            /**
             * Returns a function to use in pseudos for input types
             * @param {String} type
             */
            function createInputPseudo(type) {
                return function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === type;
                };
            }

            /**
             * Returns a function to use in pseudos for buttons
             * @param {String} type
             */
            function createButtonPseudo(type) {
                return function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && elem.type === type;
                };
            }

            /**
             * Returns a function to use in pseudos for positionals
             * @param {Function} fn
             */
            function createPositionalPseudo(fn) {
                return markFunction(function (argument) {
                    argument = +argument;
                    return markFunction(function (seed, matches) {
                        var j,
                            matchIndexes = fn([], seed.length, argument),
                            i = matchIndexes.length;

                        // Match elements found at the specified indexes
                        while (i--) {
                            if (seed[(j = matchIndexes[i])]) {
                                seed[j] = !(matches[j] = seed[j]);
                            }
                        }
                    });
                });
            }

            /**
             * Checks a node for validity as a Sizzle context
             * @param {Element|Object=} context
             * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
             */
            function testContext(context) {
                return context && typeof context.getElementsByTagName !== strundefined && context;
            }

            // Expose support vars for convenience
            support = Sizzle.support = {};

            /**
             * Detects XML nodes
             * @param {Element|Object} elem An element or a document
             * @returns {Boolean} True iff elem is a non-HTML XML node
             */
            isXML = Sizzle.isXML = function (elem) {
                // documentElement is verified for cases where it doesn't yet exist
                // (such as loading iframes in IE - #4833)
                var documentElement = elem && (elem.ownerDocument || elem).documentElement;
                return documentElement ? documentElement.nodeName !== "HTML" : false;
            };

            /**
             * Sets document-related variables once based on the current document
             * @param {Element|Object} [doc] An element or document object to use to set the document
             * @returns {Object} Returns the current document
             */
            setDocument = Sizzle.setDocument = function (node) {
                var hasCompare,
                    doc = node ? node.ownerDocument || node : preferredDoc,
                    parent = doc.defaultView;

                // If no document and documentElement is available, return
                if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                    return document;
                }

                // Set our document
                document = doc;
                docElem = doc.documentElement;

                // Support tests
                documentIsHTML = !isXML(doc);

                // Support: IE>8
                // If iframe document is assigned to "document" variable and if iframe has been reloaded,
                // IE will throw "permission denied" error when accessing "document" variable, see ECF #13936
                // IE6-8 do not support the defaultView property so parent will be undefined
                if (parent && parent !== parent.top) {
                    // IE11 does not have attachEvent, so all must suffer
                    if (parent.addEventListener) {
                        parent.addEventListener("unload", function () {
                            setDocument();
                        }, false);
                    } else if (parent.attachEvent) {
                        parent.attachEvent("onunload", function () {
                            setDocument();
                        });
                    }
                }

                /* Attributes
                ---------------------------------------------------------------------- */

                // Support: IE<8
                // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
                support.attributes = assert(function (div) {
                    div.className = "i";
                    return !div.getAttribute("className");
                });

                /* getElement(s)By*
                ---------------------------------------------------------------------- */

                // Check if getElementsByTagName("*") returns only elements
                support.getElementsByTagName = assert(function (div) {
                    div.appendChild(doc.createComment(""));
                    return !div.getElementsByTagName("*").length;
                });

                // Check if getElementsByClassName can be trusted
                support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function (div) {
                    div.innerHTML = "<div class='a'></div><div class='a i'></div>";

                    // Support: Safari<4
                    // Catch class over-caching
                    div.firstChild.className = "i";
                    // Support: Opera<10
                    // Catch gEBCN failure to find non-leading classes
                    return div.getElementsByClassName("i").length === 2;
                });

                // Support: IE<10
                // Check if getElementById returns elements by name
                // The broken getElementById methods don't pick up programatically-set names,
                // so use a roundabout getElementsByName test
                support.getById = assert(function (div) {
                    docElem.appendChild(div).id = expando;
                    return !doc.getElementsByName || !doc.getElementsByName(expando).length;
                });

                // ID find and filter
                if (support.getById) {
                    Expr.find["ID"] = function (id, context) {
                        if (typeof context.getElementById !== strundefined && documentIsHTML) {
                            var m = context.getElementById(id);
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            return m && m.parentNode ? [m] : [];
                        }
                    };
                    Expr.filter["ID"] = function (id) {
                        var attrId = id.replace(runescape, funescape);
                        return function (elem) {
                            return elem.getAttribute("id") === attrId;
                        };
                    };
                } else {
                    // Support: IE6/7
                    // getElementById is not reliable as a find shortcut
                    delete Expr.find["ID"];

                    Expr.filter["ID"] = function (id) {
                        var attrId = id.replace(runescape, funescape);
                        return function (elem) {
                            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                            return node && node.value === attrId;
                        };
                    };
                }

                // Tag
                Expr.find["TAG"] = support.getElementsByTagName ?
                    function (tag, context) {
                        if (typeof context.getElementsByTagName !== strundefined) {
                            return context.getElementsByTagName(tag);
                        }
                    } :
                    function (tag, context) {
                        var elem,
                            tmp = [],
                            i = 0,
                            results = context.getElementsByTagName(tag);

                        // Filter out possible comments
                        if (tag === "*") {
                            while ((elem = results[i++])) {
                                if (elem.nodeType === 1) {
                                    tmp.push(elem);
                                }
                            }

                            return tmp;
                        }
                        return results;
                    };

                // Class
                Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                    if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                        return context.getElementsByClassName(className);
                    }
                };

                /* QSA/matchesSelector
                ---------------------------------------------------------------------- */

                // QSA and matchesSelector support

                // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                rbuggyMatches = [];

                // qSa(:focus) reports false when true (Chrome 21)
                // We allow this because of a bug in IE8/9 that throws an error
                // whenever `document.activeElement` is accessed on an iframe
                // So, we allow :focus to pass through QSA all the time to avoid the IE error
                // See http://bugs.ECF.com/ticket/13378
                rbuggyQSA = [];

                if ((support.qsa = rnative.test(doc.querySelectorAll))) {
                    // Build QSA regex
                    // Regex strategy adopted from Diego Perini
                    assert(function (div) {
                        // Select is set to empty string on purpose
                        // This is to test IE's treatment of not explicitly
                        // setting a boolean content attribute,
                        // since its presence should be enough
                        // http://bugs.ECF.com/ticket/12359
                        div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

                        // Support: IE8, Opera 11-12.16
                        // Nothing should be selected when empty strings follow ^= or $= or *=
                        // The test attribute must be unknown in Opera but "safe" for WinRT
                        // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                        if (div.querySelectorAll("[msallowclip^='']").length) {
                            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                        }

                        // Support: IE8
                        // Boolean attributes and "value" are not treated correctly
                        if (!div.querySelectorAll("[selected]").length) {
                            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                        }

                        // Webkit/Opera - :checked should return selected option elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        // IE8 throws error here and will not see later tests
                        if (!div.querySelectorAll(":checked").length) {
                            rbuggyQSA.push(":checked");
                        }
                    });

                    assert(function (div) {
                        // Support: Windows 8 Native Apps
                        // The type and name attributes are restricted during .innerHTML assignment
                        var input = doc.createElement("input");
                        input.setAttribute("type", "hidden");
                        div.appendChild(input).setAttribute("name", "D");

                        // Support: IE8
                        // Enforce case-sensitivity of name attribute
                        if (div.querySelectorAll("[name=d]").length) {
                            rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                        }

                        // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                        // IE8 throws error here and will not see later tests
                        if (!div.querySelectorAll(":enabled").length) {
                            rbuggyQSA.push(":enabled", ":disabled");
                        }

                        // Opera 10-11 does not throw on post-comma invalid pseudos
                        div.querySelectorAll("*,:x");
                        rbuggyQSA.push(",.*:");
                    });
                }

                if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
                    docElem.webkitMatchesSelector ||
                    docElem.mozMatchesSelector ||
                    docElem.oMatchesSelector ||
                    docElem.msMatchesSelector)))) {

                    assert(function (div) {
                        // Check to see if it's possible to do matchesSelector
                        // on a disconnected node (IE 9)
                        support.disconnectedMatch = matches.call(div, "div");

                        // This should fail with an exception
                        // Gecko does not error, returns false instead
                        matches.call(div, "[s!='']:x");
                        rbuggyMatches.push("!=", pseudos);
                    });
                }

                rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
                rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

                /* Contains
                ---------------------------------------------------------------------- */
                hasCompare = rnative.test(docElem.compareDocumentPosition);

                // Element contains another
                // Purposefully does not implement inclusive descendent
                // As in, an element does not contain itself
                contains = hasCompare || rnative.test(docElem.contains) ?
                    function (a, b) {
                        var adown = a.nodeType === 9 ? a.documentElement : a,
                            bup = b && b.parentNode;
                        return a === bup || !!(bup && bup.nodeType === 1 && (
                            adown.contains ?
                                adown.contains(bup) :
                                a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                        ));
                    } :
                    function (a, b) {
                        if (b) {
                            while ((b = b.parentNode)) {
                                if (b === a) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                /* Sorting
                ---------------------------------------------------------------------- */

                // Document order sorting
                sortOrder = hasCompare ?
                    function (a, b) {

                        // Flag for duplicate removal
                        if (a === b) {
                            hasDuplicate = true;
                            return 0;
                        }

                        // Sort on method existence if only one input has compareDocumentPosition
                        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                        if (compare) {
                            return compare;
                        }

                        // Calculate position if both inputs belong to the same document
                        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
                            a.compareDocumentPosition(b) :

                            // Otherwise we know they are disconnected
                            1;

                        // Disconnected nodes
                        if (compare & 1 ||
                            (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

                            // Choose the first element that is related to our preferred document
                            if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                                return -1;
                            }
                            if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                                return 1;
                            }

                            // Maintain original order
                            return sortInput ?
                                (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
                                0;
                        }

                        return compare & 4 ? -1 : 1;
                    } :
                    function (a, b) {
                        // Exit early if the nodes are identical
                        if (a === b) {
                            hasDuplicate = true;
                            return 0;
                        }

                        var cur,
                            i = 0,
                            aup = a.parentNode,
                            bup = b.parentNode,
                            ap = [a],
                            bp = [b];

                        // Parentless nodes are either documents or disconnected
                        if (!aup || !bup) {
                            return a === doc ? -1 :
                                b === doc ? 1 :
                                    aup ? -1 :
                                        bup ? 1 :
                                            sortInput ?
                                                (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
                                                0;

                            // If the nodes are siblings, we can do a quick check
                        } else if (aup === bup) {
                            return siblingCheck(a, b);
                        }

                        // Otherwise we need full lists of their ancestors for comparison
                        cur = a;
                        while ((cur = cur.parentNode)) {
                            ap.unshift(cur);
                        }
                        cur = b;
                        while ((cur = cur.parentNode)) {
                            bp.unshift(cur);
                        }

                        // Walk down the tree looking for a discrepancy
                        while (ap[i] === bp[i]) {
                            i++;
                        }

                        return i ?
                            // Do a sibling check if the nodes have a common ancestor
                            siblingCheck(ap[i], bp[i]) :

                            // Otherwise nodes in our document sort first
                            ap[i] === preferredDoc ? -1 :
                                bp[i] === preferredDoc ? 1 :
                                    0;
                    };

                return doc;
            };

            Sizzle.matches = function (expr, elements) {
                return Sizzle(expr, null, null, elements);
            };

            Sizzle.matchesSelector = function (elem, expr) {
                // Set document vars if needed
                if ((elem.ownerDocument || elem) !== document) {
                    setDocument(elem);
                }

                // Make sure that attribute selectors are quoted
                expr = expr.replace(rattributeQuotes, "='$1']");

                if (support.matchesSelector && documentIsHTML &&
                    (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
                    (!rbuggyQSA || !rbuggyQSA.test(expr))) {

                    try {
                        var ret = matches.call(elem, expr);

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if (ret || support.disconnectedMatch ||
                            // As well, disconnected nodes are said to be in a document
                            // fragment in IE 9
                            elem.document && elem.document.nodeType !== 11) {
                            return ret;
                        }
                    } catch (e) { }
                }

                return Sizzle(expr, document, null, [elem]).length > 0;
            };

            Sizzle.contains = function (context, elem) {
                // Set document vars if needed
                if ((context.ownerDocument || context) !== document) {
                    setDocument(context);
                }
                return contains(context, elem);
            };

            Sizzle.attr = function (elem, name) {
                // Set document vars if needed
                if ((elem.ownerDocument || elem) !== document) {
                    setDocument(elem);
                }

                var fn = Expr.attrHandle[name.toLowerCase()],
                    // Don't get fooled by Object.prototype properties (ECF #13807)
                    val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
                        fn(elem, name, !documentIsHTML) :
                        undefined;

                return val !== undefined ?
                    val :
                    support.attributes || !documentIsHTML ?
                        elem.getAttribute(name) :
                        (val = elem.getAttributeNode(name)) && val.specified ?
                            val.value :
                            null;
            };

            Sizzle.error = function (msg) {
                throw new Error("Syntax error, unrecognized expression: " + msg);
            };

            /**
             * Document sorting and removing duplicates
             * @param {ArrayLike} results
             */
            Sizzle.uniqueSort = function (results) {
                var elem,
                    duplicates = [],
                    j = 0,
                    i = 0;

                // Unless we *know* we can detect duplicates, assume their presence
                hasDuplicate = !support.detectDuplicates;
                sortInput = !support.sortStable && results.slice(0);
                results.sort(sortOrder);

                if (hasDuplicate) {
                    while ((elem = results[i++])) {
                        if (elem === results[i]) {
                            j = duplicates.push(i);
                        }
                    }
                    while (j--) {
                        results.splice(duplicates[j], 1);
                    }
                }

                // Clear input after sorting to release objects
                // See https://github.com/ECF/sizzle/pull/225
                sortInput = null;

                return results;
            };

            /**
             * Utility function for retrieving the text value of an array of DOM nodes
             * @param {Array|Element} elem
             */
            getText = Sizzle.getText = function (elem) {
                var node,
                    ret = "",
                    i = 0,
                    nodeType = elem.nodeType;

                if (!nodeType) {
                    // If no nodeType, this is expected to be an array
                    while ((node = elem[i++])) {
                        // Do not traverse comment nodes
                        ret += getText(node);
                    }
                } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (ECF #11153)
                    if (typeof elem.textContent === "string") {
                        return elem.textContent;
                    } else {
                        // Traverse its children
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                            ret += getText(elem);
                        }
                    }
                } else if (nodeType === 3 || nodeType === 4) {
                    return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes

                return ret;
            };

            Expr = Sizzle.selectors = {

                // Can be adjusted by the user
                cacheLength: 50,

                createPseudo: markFunction,

                match: matchExpr,

                attrHandle: {},

                find: {},

                relative: {
                    ">": {
                        dir: "parentNode",
                        first: true
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: true
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },

                preFilter: {
                    "ATTR": function (match) {
                        match[1] = match[1].replace(runescape, funescape);

                        // Move the given value to match[3] whether quoted or unquoted
                        match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

                        if (match[2] === "~=") {
                            match[3] = " " + match[3] + " ";
                        }

                        return match.slice(0, 4);
                    },

                    "CHILD": function (match) {
                        /* matches from matchExpr["CHILD"]
                            1 type (only|nth|...)
                            2 what (child|of-type)
                            3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                            4 xn-component of xn+y argument ([+-]?\d*n|)
                            5 sign of xn-component
                            6 x of xn-component
                            7 sign of y-component
                            8 y of y-component
                        */
                        match[1] = match[1].toLowerCase();

                        if (match[1].slice(0, 3) === "nth") {
                            // nth-* requires argument
                            if (!match[3]) {
                                Sizzle.error(match[0]);
                            }

                            // numeric x and y parameters for Expr.filter.CHILD
                            // remember that false/true cast respectively to 0/1
                            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                            match[5] = +((match[7] + match[8]) || match[3] === "odd");

                            // other types prohibit arguments
                        } else if (match[3]) {
                            Sizzle.error(match[0]);
                        }

                        return match;
                    },

                    "PSEUDO": function (match) {
                        var excess,
                            unquoted = !match[6] && match[2];

                        if (matchExpr["CHILD"].test(match[0])) {
                            return null;
                        }

                        // Accept quoted arguments as-is
                        if (match[3]) {
                            match[2] = match[4] || match[5] || "";

                            // Strip excess characters from unquoted arguments
                        } else if (unquoted && rpseudo.test(unquoted) &&
                            // Get excess from tokenize (recursively)
                            (excess = tokenize(unquoted, true)) &&
                            // advance to the next closing parenthesis
                            (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                            // excess is a negative index
                            match[0] = match[0].slice(0, excess);
                            match[2] = unquoted.slice(0, excess);
                        }

                        // Return only captures needed by the pseudo filter method (type and argument)
                        return match.slice(0, 3);
                    }
                },

                filter: {

                    "TAG": function (nodeNameSelector) {
                        var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                        return nodeNameSelector === "*" ?
                            function () {
                                return true;
                            } :
                            function (elem) {
                                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                            };
                    },

                    "CLASS": function (className) {
                        var pattern = classCache[className + " "];

                        return pattern ||
                            (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                            classCache(className, function (elem) {
                                return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                            });
                    },

                    "ATTR": function (name, operator, check) {
                        return function (elem) {
                            var result = Sizzle.attr(elem, name);

                            if (result == null) {
                                return operator === "!=";
                            }
                            if (!operator) {
                                return true;
                            }

                            result += "";

                            return operator === "=" ? result === check :
                                operator === "!=" ? result !== check :
                                    operator === "^=" ? check && result.indexOf(check) === 0 :
                                        operator === "*=" ? check && result.indexOf(check) > -1 :
                                            operator === "$=" ? check && result.slice(-check.length) === check :
                                                operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
                                                    operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                                                        false;
                        };
                    },

                    "CHILD": function (type, what, argument, first, last) {
                        var simple = type.slice(0, 3) !== "nth",
                            forward = type.slice(-4) !== "last",
                            ofType = what === "of-type";

                        return first === 1 && last === 0 ?

                            // Shortcut for :nth-*(n)
                            function (elem) {
                                return !!elem.parentNode;
                            } :

                            function (elem, context, xml) {
                                var cache, outerCache, node, diff, nodeIndex, start,
                                    dir = simple !== forward ? "nextSibling" : "previousSibling",
                                    parent = elem.parentNode,
                                    name = ofType && elem.nodeName.toLowerCase(),
                                    useCache = !xml && !ofType;

                                if (parent) {

                                    // :(first|last|only)-(child|of-type)
                                    if (simple) {
                                        while (dir) {
                                            node = elem;
                                            while ((node = node[dir])) {
                                                if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                                    return false;
                                                }
                                            }
                                            // Reverse direction for :only-* (if we haven't yet done so)
                                            start = dir = type === "only" && !start && "nextSibling";
                                        }
                                        return true;
                                    }

                                    start = [forward ? parent.firstChild : parent.lastChild];

                                    // non-xml :nth-child(...) stores cache data on `parent`
                                    if (forward && useCache) {
                                        // Seek `elem` from a previously-cached index
                                        outerCache = parent[expando] || (parent[expando] = {});
                                        cache = outerCache[type] || [];
                                        nodeIndex = cache[0] === dirruns && cache[1];
                                        diff = cache[0] === dirruns && cache[2];
                                        node = nodeIndex && parent.childNodes[nodeIndex];

                                        while ((node = ++nodeIndex && node && node[dir] ||

                                            // Fallback to seeking `elem` from the start
                                            (diff = nodeIndex = 0) || start.pop())) {

                                            // When found, cache indexes on `parent` and break
                                            if (node.nodeType === 1 && ++diff && node === elem) {
                                                outerCache[type] = [dirruns, nodeIndex, diff];
                                                break;
                                            }
                                        }

                                        // Use previously-cached element index if available
                                    } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                        diff = cache[1];

                                        // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                    } else {
                                        // Use the same loop as above to seek `elem` from the start
                                        while ((node = ++nodeIndex && node && node[dir] ||
                                            (diff = nodeIndex = 0) || start.pop())) {

                                            if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                                // Cache the index of each encountered element
                                                if (useCache) {
                                                    (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                                                }

                                                if (node === elem) {
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    // Incorporate the offset, then check against cycle size
                                    diff -= last;
                                    return diff === first || (diff % first === 0 && diff / first >= 0);
                                }
                            };
                    },

                    "PSEUDO": function (pseudo, argument) {
                        // pseudo-class names are case-insensitive
                        // http://www.w3.org/TR/selectors/#pseudo-classes
                        // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                        // Remember that setFilters inherits from pseudos
                        var args,
                            fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                                Sizzle.error("unsupported pseudo: " + pseudo);

                        // The user may use createPseudo to indicate that
                        // arguments are needed to create the filter function
                        // just as Sizzle does
                        if (fn[expando]) {
                            return fn(argument);
                        }

                        // But maintain support for old signatures
                        if (fn.length > 1) {
                            args = [pseudo, pseudo, "", argument];
                            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                                markFunction(function (seed, matches) {
                                    var idx,
                                        matched = fn(seed, argument),
                                        i = matched.length;
                                    while (i--) {
                                        idx = indexOf.call(seed, matched[i]);
                                        seed[idx] = !(matches[idx] = matched[i]);
                                    }
                                }) :
                                function (elem) {
                                    return fn(elem, 0, args);
                                };
                        }

                        return fn;
                    }
                },

                pseudos: {
                    // Potentially complex pseudos
                    "not": markFunction(function (selector) {
                        // Trim the selector passed to compile
                        // to avoid treating leading and trailing
                        // spaces as combinators
                        var input = [],
                            results = [],
                            matcher = compile(selector.replace(rtrim, "$1"));

                        return matcher[expando] ?
                            markFunction(function (seed, matches, context, xml) {
                                var elem,
                                    unmatched = matcher(seed, null, xml, []),
                                    i = seed.length;

                                // Match elements unmatched by `matcher`
                                while (i--) {
                                    if ((elem = unmatched[i])) {
                                        seed[i] = !(matches[i] = elem);
                                    }
                                }
                            }) :
                            function (elem, context, xml) {
                                input[0] = elem;
                                matcher(input, null, xml, results);
                                return !results.pop();
                            };
                    }),

                    "has": markFunction(function (selector) {
                        return function (elem) {
                            return Sizzle(selector, elem).length > 0;
                        };
                    }),

                    "contains": markFunction(function (text) {
                        return function (elem) {
                            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                        };
                    }),

                    // "Whether an element is represented by a :lang() selector
                    // is based solely on the element's language value
                    // being equal to the identifier C,
                    // or beginning with the identifier C immediately followed by "-".
                    // The matching of C against the element's language value is performed case-insensitively.
                    // The identifier C does not have to be a valid language name."
                    // http://www.w3.org/TR/selectors/#lang-pseudo
                    "lang": markFunction(function (lang) {
                        // lang value must be a valid identifier
                        if (!ridentifier.test(lang || "")) {
                            Sizzle.error("unsupported lang: " + lang);
                        }
                        lang = lang.replace(runescape, funescape).toLowerCase();
                        return function (elem) {
                            var elemLang;
                            do {
                                if ((elemLang = documentIsHTML ?
                                    elem.lang :
                                    elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

                                    elemLang = elemLang.toLowerCase();
                                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                                }
                            } while ((elem = elem.parentNode) && elem.nodeType === 1);
                            return false;
                        };
                    }),

                    // Miscellaneous
                    "target": function (elem) {
                        var hash = window.location && window.location.hash;
                        return hash && hash.slice(1) === elem.id;
                    },

                    "root": function (elem) {
                        return elem === docElem;
                    },

                    "focus": function (elem) {
                        return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                    },

                    // Boolean properties
                    "enabled": function (elem) {
                        return elem.disabled === false;
                    },

                    "disabled": function (elem) {
                        return elem.disabled === true;
                    },

                    "checked": function (elem) {
                        // In CSS3, :checked should return both checked and selected elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        var nodeName = elem.nodeName.toLowerCase();
                        return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                    },

                    "selected": function (elem) {
                        // Accessing this property makes selected-by-default
                        // options in Safari work properly
                        if (elem.parentNode) {
                            elem.parentNode.selectedIndex;
                        }

                        return elem.selected === true;
                    },

                    // Contents
                    "empty": function (elem) {
                        // http://www.w3.org/TR/selectors/#empty-pseudo
                        // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                        //   but not by others (comment: 8; processing instruction: 7; etc.)
                        // nodeType < 6 works because attributes (2) do not appear as children
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                            if (elem.nodeType < 6) {
                                return false;
                            }
                        }
                        return true;
                    },

                    "parent": function (elem) {
                        return !Expr.pseudos["empty"](elem);
                    },

                    // Element/input types
                    "header": function (elem) {
                        return rheader.test(elem.nodeName);
                    },

                    "input": function (elem) {
                        return rinputs.test(elem.nodeName);
                    },

                    "button": function (elem) {
                        var name = elem.nodeName.toLowerCase();
                        return name === "input" && elem.type === "button" || name === "button";
                    },

                    "text": function (elem) {
                        var attr;
                        return elem.nodeName.toLowerCase() === "input" &&
                            elem.type === "text" &&

                            // Support: IE<8
                            // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                            ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                    },

                    // Position-in-collection
                    "first": createPositionalPseudo(function () {
                        return [0];
                    }),

                    "last": createPositionalPseudo(function (matchIndexes, length) {
                        return [length - 1];
                    }),

                    "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                        return [argument < 0 ? argument + length : argument];
                    }),

                    "even": createPositionalPseudo(function (matchIndexes, length) {
                        var i = 0;
                        for (; i < length; i += 2) {
                            matchIndexes.push(i);
                        }
                        return matchIndexes;
                    }),

                    "odd": createPositionalPseudo(function (matchIndexes, length) {
                        var i = 1;
                        for (; i < length; i += 2) {
                            matchIndexes.push(i);
                        }
                        return matchIndexes;
                    }),

                    "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                        var i = argument < 0 ? argument + length : argument;
                        for (; --i >= 0;) {
                            matchIndexes.push(i);
                        }
                        return matchIndexes;
                    }),

                    "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                        var i = argument < 0 ? argument + length : argument;
                        for (; ++i < length;) {
                            matchIndexes.push(i);
                        }
                        return matchIndexes;
                    })
                }
            };

            Expr.pseudos["nth"] = Expr.pseudos["eq"];

            // Add button/input type pseudos
            for (i in {
                radio: true,
                checkbox: true,
                file: true,
                password: true,
                image: true
            }) {
                Expr.pseudos[i] = createInputPseudo(i);
            }
            for (i in {
                submit: true,
                reset: true
            }) {
                Expr.pseudos[i] = createButtonPseudo(i);
            }

            // Easy API for creating new setFilters
            function setFilters() { }
            setFilters.prototype = Expr.filters = Expr.pseudos;
            Expr.setFilters = new setFilters();

            tokenize = Sizzle.tokenize = function (selector, parseOnly) {
                var matched, match, tokens, type,
                    soFar, groups, preFilters,
                    cached = tokenCache[selector + " "];

                if (cached) {
                    return parseOnly ? 0 : cached.slice(0);
                }

                soFar = selector;
                groups = [];
                preFilters = Expr.preFilter;

                while (soFar) {

                    // Comma and first run
                    if (!matched || (match = rcomma.exec(soFar))) {
                        if (match) {
                            // Don't consume trailing commas as valid
                            soFar = soFar.slice(match[0].length) || soFar;
                        }
                        groups.push((tokens = []));
                    }

                    matched = false;

                    // Combinators
                    if ((match = rcombinators.exec(soFar))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            // Cast descendant combinators to space
                            type: match[0].replace(rtrim, " ")
                        });
                        soFar = soFar.slice(matched.length);
                    }

                    // Filters
                    for (type in Expr.filter) {

                        // 处理type=deepClone时的问题 by xp 20140902
                        if (typeof (matchExpr[type]) != "object") continue;

                        if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                            (match = preFilters[type](match)))) {
                            matched = match.shift();
                            tokens.push({
                                value: matched,
                                type: type,
                                matches: match
                            });
                            soFar = soFar.slice(matched.length);
                        }
                    }

                    if (!matched) {
                        break;
                    }
                }

                // Return the length of the invalid excess
                // if we're just parsing
                // Otherwise, throw an error or return tokens
                return parseOnly ?
                    soFar.length :
                    soFar ?
                        Sizzle.error(selector) :
                        // Cache the tokens
                        tokenCache(selector, groups).slice(0);
            };

            function toSelector(tokens) {
                var i = 0,
                    len = tokens.length,
                    selector = "";
                for (; i < len; i++) {
                    selector += tokens[i].value;
                }
                return selector;
            }

            function addCombinator(matcher, combinator, base) {
                var dir = combinator.dir,
                    checkNonElements = base && dir === "parentNode",
                    doneName = done++;

                return combinator.first ?
                    // Check against closest ancestor/preceding element
                    function (elem, context, xml) {
                        while ((elem = elem[dir])) {
                            if (elem.nodeType === 1 || checkNonElements) {
                                return matcher(elem, context, xml);
                            }
                        }
                    } :

                    // Check against all ancestor/preceding elements
                    function (elem, context, xml) {
                        var oldCache, outerCache,
                            newCache = [dirruns, doneName];

                        // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                        if (xml) {
                            while ((elem = elem[dir])) {
                                if (elem.nodeType === 1 || checkNonElements) {
                                    if (matcher(elem, context, xml)) {
                                        return true;
                                    }
                                }
                            }
                        } else {
                            while ((elem = elem[dir])) {
                                if (elem.nodeType === 1 || checkNonElements) {
                                    outerCache = elem[expando] || (elem[expando] = {});
                                    if ((oldCache = outerCache[dir]) &&
                                        oldCache[0] === dirruns && oldCache[1] === doneName) {

                                        // Assign to newCache so results back-propagate to previous elements
                                        return (newCache[2] = oldCache[2]);
                                    } else {
                                        // Reuse newcache so results back-propagate to previous elements
                                        outerCache[dir] = newCache;

                                        // A match means we're done; a fail means we have to keep checking
                                        if ((newCache[2] = matcher(elem, context, xml))) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    };
            }

            function elementMatcher(matchers) {
                return matchers.length > 1 ?
                    function (elem, context, xml) {
                        var i = matchers.length;
                        while (i--) {
                            if (!matchers[i](elem, context, xml)) {
                                return false;
                            }
                        }
                        return true;
                    } :
                    matchers[0];
            }

            function multipleContexts(selector, contexts, results) {
                var i = 0,
                    len = contexts.length;
                for (; i < len; i++) {
                    Sizzle(selector, contexts[i], results);
                }
                return results;
            }

            function condense(unmatched, map, filter, context, xml) {
                var elem,
                    newUnmatched = [],
                    i = 0,
                    len = unmatched.length,
                    mapped = map != null;

                for (; i < len; i++) {
                    if ((elem = unmatched[i])) {
                        if (!filter || filter(elem, context, xml)) {
                            newUnmatched.push(elem);
                            if (mapped) {
                                map.push(i);
                            }
                        }
                    }
                }

                return newUnmatched;
            }

            function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                if (postFilter && !postFilter[expando]) {
                    postFilter = setMatcher(postFilter);
                }
                if (postFinder && !postFinder[expando]) {
                    postFinder = setMatcher(postFinder, postSelector);
                }
                return markFunction(function (seed, results, context, xml) {
                    var temp, i, elem,
                        preMap = [],
                        postMap = [],
                        preexisting = results.length,

                        // Get initial elements from seed or context
                        elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                        // Prefilter to get matcher input, preserving a map for seed-results synchronization
                        matcherIn = preFilter && (seed || !selector) ?
                            condense(elems, preMap, preFilter, context, xml) :
                            elems,

                        matcherOut = matcher ?
                            // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                            postFinder || (seed ? preFilter : preexisting || postFilter) ?

                                // ...intermediate processing is necessary
                                [] :

                                // ...otherwise use results directly
                                results :
                            matcherIn;

                    // Find primary matches
                    if (matcher) {
                        matcher(matcherIn, matcherOut, context, xml);
                    }

                    // Apply postFilter
                    if (postFilter) {
                        temp = condense(matcherOut, postMap);
                        postFilter(temp, [], context, xml);

                        // Un-match failing elements by moving them back to matcherIn
                        i = temp.length;
                        while (i--) {
                            if ((elem = temp[i])) {
                                matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                            }
                        }
                    }

                    if (seed) {
                        if (postFinder || preFilter) {
                            if (postFinder) {
                                // Get the final matcherOut by condensing this intermediate into postFinder contexts
                                temp = [];
                                i = matcherOut.length;
                                while (i--) {
                                    if ((elem = matcherOut[i])) {
                                        // Restore matcherIn since elem is not yet a final match
                                        temp.push((matcherIn[i] = elem));
                                    }
                                }
                                postFinder(null, (matcherOut = []), temp, xml);
                            }

                            // Move matched elements from seed to results to keep them synchronized
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i]) &&
                                    (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {

                                    seed[temp] = !(results[temp] = elem);
                                }
                            }
                        }

                        // Add elements to results, through postFinder if defined
                    } else {
                        matcherOut = condense(
                            matcherOut === results ?
                                matcherOut.splice(preexisting, matcherOut.length) :
                                matcherOut
                        );
                        if (postFinder) {
                            postFinder(null, results, matcherOut, xml);
                        } else {
                            push.apply(results, matcherOut);
                        }
                    }
                });
            }

            function matcherFromTokens(tokens) {
                var checkContext, matcher, j,
                    len = tokens.length,
                    leadingRelative = Expr.relative[tokens[0].type],
                    implicitRelative = leadingRelative || Expr.relative[" "],
                    i = leadingRelative ? 1 : 0,

                    // The foundational matcher ensures that elements are reachable from top-level context(s)
                    matchContext = addCombinator(function (elem) {
                        return elem === checkContext;
                    }, implicitRelative, true),
                    matchAnyContext = addCombinator(function (elem) {
                        return indexOf.call(checkContext, elem) > -1;
                    }, implicitRelative, true),
                    matchers = [function (elem, context, xml) {
                        return (!leadingRelative && (xml || context !== outermostContext)) || (
                            (checkContext = context).nodeType ?
                                matchContext(elem, context, xml) :
                                matchAnyContext(elem, context, xml));
                    }];

                for (; i < len; i++) {
                    if ((matcher = Expr.relative[tokens[i].type])) {
                        matchers = [addCombinator(elementMatcher(matchers), matcher)];
                    } else {
                        matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                        // Return special upon seeing a positional matcher
                        if (matcher[expando]) {
                            // Find the next relative operator (if any) for proper handling
                            j = ++i;
                            for (; j < len; j++) {
                                if (Expr.relative[tokens[j].type]) {
                                    break;
                                }
                            }
                            return setMatcher(
                                i > 1 && elementMatcher(matchers),
                                i > 1 && toSelector(
                                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                    tokens.slice(0, i - 1).concat({
                                        value: tokens[i - 2].type === " " ? "*" : ""
                                    })
                                ).replace(rtrim, "$1"),
                                matcher,
                                i < j && matcherFromTokens(tokens.slice(i, j)),
                                j < len && matcherFromTokens((tokens = tokens.slice(j))),
                                j < len && toSelector(tokens)
                            );
                        }
                        matchers.push(matcher);
                    }
                }

                return elementMatcher(matchers);
            }

            function matcherFromGroupMatchers(elementMatchers, setMatchers) {
                var bySet = setMatchers.length > 0,
                    byElement = elementMatchers.length > 0,
                    superMatcher = function (seed, context, xml, results, outermost) {
                        var elem, j, matcher,
                            matchedCount = 0,
                            i = "0",
                            unmatched = seed && [],
                            setMatched = [],
                            contextBackup = outermostContext,
                            // We must always have either seed elements or outermost context
                            elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                            // Use integer dirruns iff this is the outermost matcher
                            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                            len = elems.length;

                        if (outermost) {
                            outermostContext = context !== document && context;
                        }

                        // Add elements passing elementMatchers directly to results
                        // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                        // Support: IE<9, Safari
                        // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                        for (; i !== len && (elem = elems[i]) != null; i++) {
                            if (byElement && elem) {
                                j = 0;
                                while ((matcher = elementMatchers[j++])) {
                                    if (matcher(elem, context, xml)) {
                                        results.push(elem);
                                        break;
                                    }
                                }
                                if (outermost) {
                                    dirruns = dirrunsUnique;
                                }
                            }

                            // Track unmatched elements for set filters
                            if (bySet) {
                                // They will have gone through all possible matchers
                                if ((elem = !matcher && elem)) {
                                    matchedCount--;
                                }

                                // Lengthen the array for every element, matched or not
                                if (seed) {
                                    unmatched.push(elem);
                                }
                            }
                        }

                        // Apply set filters to unmatched elements
                        matchedCount += i;
                        if (bySet && i !== matchedCount) {
                            j = 0;
                            while ((matcher = setMatchers[j++])) {
                                matcher(unmatched, setMatched, context, xml);
                            }

                            if (seed) {
                                // Reintegrate element matches to eliminate the need for sorting
                                if (matchedCount > 0) {
                                    while (i--) {
                                        if (!(unmatched[i] || setMatched[i])) {
                                            setMatched[i] = pop.call(results);
                                        }
                                    }
                                }

                                // Discard index placeholder values to get only actual matches
                                setMatched = condense(setMatched);
                            }

                            // Add matches to results
                            push.apply(results, setMatched);

                            // Seedless set matches succeeding multiple successful matchers stipulate sorting
                            if (outermost && !seed && setMatched.length > 0 &&
                                (matchedCount + setMatchers.length) > 1) {

                                Sizzle.uniqueSort(results);
                            }
                        }

                        // Override manipulation of globals by nested matchers
                        if (outermost) {
                            dirruns = dirrunsUnique;
                            outermostContext = contextBackup;
                        }

                        return unmatched;
                    };

                return bySet ?
                    markFunction(superMatcher) :
                    superMatcher;
            }

            compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
                var i,
                    setMatchers = [],
                    elementMatchers = [],
                    cached = compilerCache[selector + " "];

                if (!cached) {
                    // Generate a function of recursive functions that can be used to check each element
                    if (!match) {
                        match = tokenize(selector);
                    }
                    i = match.length;
                    while (i--) {
                        cached = matcherFromTokens(match[i]);
                        if (cached[expando]) {
                            setMatchers.push(cached);
                        } else {
                            elementMatchers.push(cached);
                        }
                    }

                    // Cache the compiled function
                    cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

                    // Save selector and tokenization
                    cached.selector = selector;
                }
                return cached;
            };

            /**
             * A low-level selection function that works with Sizzle's compiled
             *  selector functions
             * @param {String|Function} selector A selector or a pre-compiled
             *  selector function built with Sizzle.compile
             * @param {Element} context
             * @param {Array} [results]
             * @param {Array} [seed] A set of elements to match against
             */
            select = Sizzle.select = function (selector, context, results, seed) {
                var i, tokens, token, type, find,
                    compiled = typeof selector === "function" && selector,
                    match = !seed && tokenize((selector = compiled.selector || selector));

                results = results || [];

                // Try to minimize operations if there is no seed and only one group
                if (match.length === 1) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice(0);
                    if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        support.getById && context.nodeType === 9 && documentIsHTML &&
                        Expr.relative[tokens[1].type]) {

                        context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                        if (!context) {
                            return results;

                            // Precompiled matchers will still verify ancestry, so step up a level
                        } else if (compiled) {
                            context = context.parentNode;
                        }

                        selector = selector.slice(tokens.shift().value.length);
                    }

                    // Fetch a seed set for right-to-left matching
                    i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                    while (i--) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if (Expr.relative[(type = token.type)]) {
                            break;
                        }
                        if ((find = Expr.find[type])) {
                            // Search, expanding context for leading sibling combinators
                            if ((seed = find(
                                token.matches[0].replace(runescape, funescape),
                                rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                            ))) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice(i, 1);
                                selector = seed.length && toSelector(tokens);
                                if (!selector) {
                                    push.apply(results, seed);
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }

                // Compile and execute a filtering function if one is not provided
                // Provide `match` to avoid retokenization if we modified the selector above
                (compiled || compile(selector, match))(
                    seed,
                    context, !documentIsHTML,
                    results,
                    rsibling.test(selector) && testContext(context.parentNode) || context
                );
                return results;
            };

            // One-time assignments

            // Sort stability
            support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

            // Support: Chrome<14
            // Always assume duplicates if they aren't passed to the comparison function
            support.detectDuplicates = !!hasDuplicate;

            // Initialize against the default document
            setDocument();

            // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
            // Detached nodes confoundingly follow *each other*
            support.sortDetached = assert(function (div1) {
                // Should return 1, but returns 4 (following)
                return div1.compareDocumentPosition(document.createElement("div")) & 1;
            });

            // Support: IE<8
            // Prevent attribute/property "interpolation"
            // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
            if (!assert(function (div) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild.getAttribute("href") === "#";
            })) {
                addHandle("type|href|height|width", function (elem, name, isXML) {
                    if (!isXML) {
                        return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                    }
                });
            }

            // Support: IE<9
            // Use defaultValue in place of getAttribute("value")
            if (!support.attributes || !assert(function (div) {
                div.innerHTML = "<input/>";
                div.firstChild.setAttribute("value", "");
                return div.firstChild.getAttribute("value") === "";
            })) {
                addHandle("value", function (elem, name, isXML) {
                    if (!isXML && elem.nodeName.toLowerCase() === "input") {
                        return elem.defaultValue;
                    }
                });
            }

            // Support: IE<9
            // Use getAttributeNode to fetch booleans when getAttribute lies
            if (!assert(function (div) {
                return div.getAttribute("disabled") == null;
            })) {
                addHandle(booleans, function (elem, name, isXML) {
                    var val;
                    if (!isXML) {
                        return elem[name] === true ? name.toLowerCase() :
                            (val = elem.getAttributeNode(name)) && val.specified ?
                                val.value :
                                null;
                    }
                });
            }

            return Sizzle;

        })(window);

        ECF.find = Sizzle;
        ECF.expr = Sizzle.selectors;
        ECF.expr[":"] = ECF.expr.filters;
        ECF.unique = Sizzle.uniqueSort;
        ECF.text = Sizzle.getText;
        ECF.isXMLDoc = Sizzle.isXML;
        ECF.contains = Sizzle.contains;

    })();


    //对Cookie,Code对象进行操作
    ECF.extend({
        cookie: {
            /** Get a cookie's value
             *
             *  @param integer	key		The token used to create the cookie
             *  @return void
             */
            get: function (key) {
                var arrStr = document.cookie.split("; ");
                for (var i = 0; i < arrStr.length; i++) {
                    var temp = arrStr[i].split("=");
                    if (temp[0] == key) return $e.toNative(temp[1]);
                }
            },

            /** Set a cookie
             *
             *  @param integer	key		The token that will be used to retrieve the cookie
             *  @param string	value	The string to be stored
             *  @param integer	ttl		Time To Live (hours)
             *  @param string	path	Path in which the cookie is effective, default is "/" (optional)
             *  @param string	domain	Domain where the cookie is effective, default is window.location.hostname (optional)
             *  @param boolean 	secure	Use SSL or not, default false (optional)
             *
             *  @return setted cookie
             */
            set: function (key, value, ttl, path, domain, secure) {
                cookie = [key + '=' + escape(value),
                'path=' + ((!path || path == '') ? '/' : path),
                'domain=' + ((!domain || domain == '') ? window.location.hostname : domain)
                ];

                if (ttl) cookie.push(Cookie.hoursToExpireDate(ttl));
                if (secure) cookie.push('secure');
                return document.cookie = cookie.join('; ');
            },

            /** Unset a cookie
             *
             *  @param integer	key		The token that will be used to retrieve the cookie
             *  @param string	path	Path used to create the cookie (optional)
             *  @param string	domain	Domain used to create the cookie, default is null (optional)
             *  @return void
             */
            unset: function (key, path, domain) {
                path = (!path || typeof path != 'string') ? '' : path;
                domain = (!domain || typeof domain != 'string') ? '' : domain;
                if (Cookie.get(key)) Cookie.set(key, '', 'Thu, 01-Jan-70 00:00:01 GMT', path, domain);
            },

            /** Return GTM date string of "now" + time to live
             *
             *  @param integer	ttl		Time To Live (hours)
             *  @return string
             */
            hoursToExpireDate: function (ttl) {
                if (parseInt(ttl) == 'NaN') return '';
                else {
                    now = new Date();
                    now.setTime(now.getTime() + (parseInt(ttl) * 60 * 60 * 1000));
                    return now.toGMTString();
                }
            },

            /** If Firebug JavaScript console is present, it will dump cookie string to console.
             *
             *  @return void
             */
            dump: function () {
                if (typeof console != 'undefined') {
                    console.log(document.cookie.split(';'));
                }
            },

            //删除所有 cookies
            clear: function () {
                var keys = document.cookie.match(/[^ =;]+(?=\=)/g);

                if (keys) {
                    for (var i = keys.length; i--;) {
                        Mo.Cookie.unset(keys[i]);
                    }
                }
            }
        },
        code: {
            //base64加密
            enBase64: function (str) {
                if (str == null) return "";
                str = ECF.code.utf16to8(str);
                var out, i, len, c1, c2, c3,
                    len = str.length,
                    i = 0,
                    out = "",
                    base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        out += base64encodechars.charAt(c1 >> 2);
                        out += base64encodechars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        out += base64encodechars.charAt(c1 >> 2);
                        out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                        out += base64encodechars.charAt((c2 & 0xf) << 2);
                        out += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    out += base64encodechars.charAt(c1 >> 2);
                    out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                    out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
                    out += base64encodechars.charAt(c3 & 0x3f);
                }
                return out;
            },
            //base64解密
            deBase64: function (str) {
                if (str == null) return "";
                var c1, c2, c3, c4, i, len, out,
                    len = str.length,
                    i = 0,
                    out = "",
                    base64decodechars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
                        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
                while (i < len) {

                    do {
                        c1 = base64decodechars[str.charCodeAt(i++) & 0xff];
                    } while (i < len && c1 == -1);
                    if (c1 == -1)
                        break;


                    do {
                        c2 = base64decodechars[str.charCodeAt(i++) & 0xff];
                    } while (i < len && c2 == -1);
                    if (c2 == -1)
                        break;

                    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));


                    do {
                        c3 = str.charCodeAt(i++) & 0xff;
                        if (c3 == 61)
                            return out;
                        c3 = base64decodechars[c3];
                    } while (i < len && c3 == -1);
                    if (c3 == -1)
                        break;

                    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));


                    do {
                        c4 = str.charCodeAt(i++) & 0xff;
                        if (c4 == 61)
                            return out;
                        c4 = base64decodechars[c4];
                    } while (i < len && c4 == -1);
                    if (c4 == -1)
                        break;
                    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
                }
                return ECF.code.utf8to16(out);
            },
            //utf16转utf8
            utf16to8: function (str) {
                var out, i, len, c;
                out = "";
                len = str.length;
                for (i = 0; i < len; i++) {
                    c = str.charCodeAt(i);
                    if ((c >= 0x0001) && (c <= 0x007f)) {
                        out += str.charAt(i);
                    } else if (c > 0x07ff) {
                        out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
                        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
                    } else {
                        out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
                    }
                }
                return out;
            },
            //utf6转utf16
            utf8to16: function (str) {
                var out, i, len, c;
                var char2, char3;

                out = "";
                len = str.length;
                i = 0;
                while (i < len) {
                    c = str.charCodeAt(i++);
                    switch (c >> 4) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            // 0xxxxxxx
                            out += str.charAt(i - 1);
                            break;
                        case 12:
                        case 13:
                            // 110x xxxx   10xx xxxx
                            char2 = str.charCodeAt(i++);
                            out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                            break;
                        case 14:
                            // 1110 xxxx  10xx xxxx  10xx xxxx
                            char2 = str.charCodeAt(i++);
                            char3 = str.charCodeAt(i++);
                            out += String.fromCharCode(((c & 0x0f) << 12) |
                                ((char2 & 0x3f) << 6) |
                                ((char3 & 0x3f) << 0));
                            break;
                    }
                }

                return out;
            }
        }
    });

    //对xml的操作扩展
    ECF.extend(ECF.xml, {
        //进行xml数据格式化
        formatXml: function (name, val) {
            if (name != "undefined" || name != "") {
                if (val.indexOf("<") != -1 || val.indexOf(">") != -1) {
                    return "<" + name.toLowerCase() + "><![CDATA[" + (val) + "]]></" + name.toLowerCase() + ">";
                } else {
                    return "<" + name.toLowerCase() + ">" + val + "</" + name.toLowerCase() + ">";
                }
            }
            return "<" + name.toLowerCase() + "> </" + name.toLowerCase() + ">";
        },
        //取得Xml中指定节点的指定属性
        getNodeAttribute: function (obj, name, proName, n) {
            var result = '';
            if (typeof (obj) == 'object' && name != null && name != '') {
                if (typeof n == "undefined") n = 0;
                var node = obj.getElementsByTagName(name);
                if (node != null && node.length > 0) {
                    result = node[n].getAttribute(proName);
                }
            }
            return result;
        },
        //获取一个节点的子节点数
        getChilds: function (obj, name) {
            try {
                var tmpObj = obj.getElementsByTagName(name)[0];
                //var tmpObj = obj.documentElement.selectSingleNode(name);
                return tmpObj.childNodes.length;
            } catch (e) {
                return 0;
            }
        },

        // 判断xml对象中是否有该节点存在
        hasNode: function (obj, nodeName, n) {
            return obj.getElementsByTagName(nodeName) && obj.getElementsByTagName(nodeName).item(n) && obj.getElementsByTagName(nodeName).item(n).firstChild != null;
        },

        //a获取指写节点的值
        getNodeValue: function (obj, nodeName, n) {
            //alert(obj.getElementsByTagName(nodeName).item(n).firstChild.nodeValue);
            try {
                return (obj.getElementsByTagName(nodeName).item(n).firstChild == null ? " " : obj.getElementsByTagName(nodeName).item(n).firstChild.nodeValue);
            } catch (e) {
                return ""
            }
        },

        //取得Xml中指定名称节点的第一个子节点的数据
        getFirstChildData: function (obj, name) {
            var result = '';
            if (obj) {
                if (typeof (obj) == 'object' && name != null && name != '') {
                    var node = obj.getElementsByTagName(name);
                    if (node != null && node.length > 0) {
                        if (node[0].firstChild != null) {
                            result = node[0].firstChild.data;
                        }
                    }
                }
            }
            return result;
        },

        //创建Dom对象
        createDom: function () {
            var xdom = null;
            if (document.implementation.createDocument) { // Mozilla，创建DOMParser
                var parser = new DOMParser();
                if (typeof (arguments[0]) == "string") {
                    xdom = parser.parseFromString('<?xml version="1.0" encoding="GBK" ?><root>' + arguments[0] + '</root>', "text/xml");
                } else {
                    xdom = parser.parseFromString('<?xml version="1.0" encoding="GBK" ?><root></root>', "text/xml");
                }
            } else if (window.ActiveXObject) { // IE，用ActiveX创建XML document，然后把loadXML当作DOM解析器来用
                xdom = new ActiveXObject("Microsoft.XMLDOM");
                xdom.async = "false";
                if (typeof (arguments[0]) == "string") {
                    xdom.loadXML('<?xml version="1.0" encoding="GBK" ?><root>' + arguments[0] + '</root>');
                } else {
                    xdom.loadXML('<?xml version="1.0" encoding="GBK" ?><root></root>');
                }
            }
            if (!xdom || !xdom.documentElement || xdom.getElementsByTagName("parsererror").length) {
                ECF.error("Invalid XML: " + arguments[0]);
            }
            return xdom;
        },

        /*
            xml对象转为json
            @1: xml对像
        */
        toJson: function (xmlDocument, arrayNodeNames, isRoot) {
            if (!xmlDocument) {
                return xmlDocument;
            }

            var root = xmlDocument.documentElement;

            arrayNames = (ECF.isArray(arrayNodeNames) ? arrayNodeNames : []);

            if (!root) {
                return [];
            }

            var result = null,
                nodeResult = null;

            if (isRoot) {
                return parseJsonNode(root, arrayNames);
            } else {
                result = [];

                // 根节点加入到对象中
                for (var i = 0; i < root.childNodes.length; i++) {

                    if (root.childNodes[i].nodeType != 1)
                        continue;

                    var nodeResult = parseJsonNode(root.childNodes[i], arrayNames);

                    result.push(nodeResult);
                }
            }

            return result;

            // 解析Xml节点
            function parseJsonNode(xmlNode, arrayNames) {

                var obj = {};

                //console.log(xmlNode.attributes);
                //console.log("    nodeName 2:  " + xmlNode.nodeName + "   " + xmlNode.nodeType + "   " + xmlNode.childNodes.length);

                // 处理节点属性
                if (xmlNode && xmlNode.attributes) {
                    for (var i = 0; i < xmlNode.attributes.length; i++) {
                        if (obj == null) {
                            obj = new Object();
                        }
                        obj[xmlNode.attributes[i].name] = xmlNode.attributes[i].value;
                    }
                }

                obj["xmlNodeName"] = xmlNode.nodeName;
                var nodes = [];
                var nodeNames = [];

                // 判断节点是否包含有子节点
                if (xmlNode.childNodes && xmlNode.childNodes.length > 0) {

                    // 处理多个子节点
                    for (var i = 0; i < xmlNode.childNodes.length; i++) {
                        var cnode = xmlNode.childNodes[i];
                        var cvalue = null;

                        // 正常节点
                        if (cnode.nodeType == 1) {

                            //console.log("nodeName :  " + cnode.nodeName + " nodeType  :  " + cnode.childNodes.length);

                            if (cnode.childNodes && cnode.childNodes.length > 0) {
                                // 判断节点下是否只有一个text节点
                                if (cnode.childNodes.length == 1) {
                                    if (cnode.childNodes[0].nodeType == 1) { //
                                        cvalue = parseJsonNode(cnode, arrayNames);
                                    } else {
                                        cvalue = (cnode.childNodes[0].text || cnode.childNodes[0].textContent || '');
                                    }
                                } else {
                                    cvalue = parseJsonNode(cnode, arrayNames);
                                }
                            } else {
                                cvalue = (cnode.text || cnode.textContent || '');
                            }
                        }
                        // 文本节点
                        else if (cnode.nodeType == 3 || cnode.nodeType == 4) {
                            //console.log("nodeName :  " + cnode.nodeName + " nodeType  :  " + (cnode.nodeName == "#text"));
                            cvalue = (cnode.text || cnode.textContent || '');
                        }
                        //if (cnode.nodeName == "SpecValues") {
                        //    console.log("nodeName :  " + cnode.nodeName + " value :     " + typeof (cvalue));
                        //    console.log(cvalue);
                        //}
                        if (typeof (cvalue) == "object") {

                            if (arrayNames && ECF.isArray(cvalue)) {
                                obj[cnode.nodeName] = cvalue;
                            } else {
                                nodes.push(cvalue);
                                if (!nodeNames.contains(cnode.nodeName)) {
                                    nodeNames.push(cnode.nodeName);
                                }
                            }
                        } else {

                            if (cnode.nodeName == "#cdata-section") {
                                obj[xmlNode.nodeName] = cvalue;
                            } else if (cnode.nodeName != "#text") {
                                obj[cnode.nodeName] = cvalue;
                            }
                        }
                    }

                    if (nodes.length > 0) {
                        if (nodeNames.length == 1) {
                            if (arrayNames.contains(xmlNode.nodeName)) {
                                obj = nodes;
                            } else {
                                obj[nodeNames[0]] = nodes;
                            }
                        } else {
                            for (var j = 0; j < nodeNames.length; j++) {
                                obj[nodeNames[j]] = nodes[j];
                            }
                        }
                    }
                } else {
                    //console.log("  nodeName1    :  " + xmlNode.nodeName);
                    //if (obj) {
                    //    obj["text"] = (xmlNode.text || xmlNode.textContent || '');
                    //}
                    //else {
                    obj[xmlNode.nodeName] = (xmlNode.text || xmlNode.textContent || '');
                    //}
                }
                return obj;
            };

        },

        // Xml转换为Json对象
        toJsonObject: function (xmlDocment) {
            if (!xmlDocument) {
                return xmlDocument;
            }

            var root = xmlDocument.documentElement;

            arrayNames = (ECF.isArray(arrayNodeNames) ? arrayNodeNames : []);

            if (!root) {
                return {};
            }

            var result = null,
                nodeResult = null;

            if (isRoot) {
                return parseJsonNode(root, arrayNames);
            } else {
                result = {};

                // 根节点加入到对象中
                for (var i = 0; i < root.childNodes.length; i++) {

                    var node = root.childNodes[i];
                    if (node.nodeType != 1)
                        continue;

                    var nodeResult = parseJsonNode(node, arrayNames);

                    result[node.nodeName] = nodeResult;
                }
            }

            return result;

            // 解析Xml节点
            function parseJsonNode(xmlNode, arrayNames) {

                var obj = null;

                //console.log(xmlNode.attributes);
                //console.log("    nodeName 2:  " + xmlNode.nodeName + "   " + xmlNode.nodeType + "   " + xmlNode.childNodes.length);

                // 处理节点属性
                if (xmlNode && xmlNode.attributes) {
                    for (var i = 0; i < xmlNode.attributes.length; i++) {
                        if (obj == null) {
                            obj = new Object();
                        }
                        obj[xmlNode.attributes[i].name] = xmlNode.attributes[i].value;
                    }
                }


                var nodes = [];
                var nodeNames = [];

                // 判断节点是否包含有子节点
                if (xmlNode.childNodes && xmlNode.childNodes.length > 0) {

                    // 处理多个子节点
                    for (var i = 0; i < xmlNode.childNodes.length; i++) {
                        var cnode = xmlNode.childNodes[i];
                        var cvalue = null;

                        // 正常节点
                        if (cnode.nodeType == 1) {

                            //console.log("nodeName :  " + cnode.nodeName + " nodeType  :  " + cnode.childNodes.length);

                            if (cnode.childNodes && cnode.childNodes.length > 0) {
                                // 判断节点下是否只有一个text节点
                                if (cnode.childNodes.length == 1) {
                                    if (cnode.childNodes[0].nodeType == 1) { //
                                        cvalue = parseJsonNode(cnode, arrayNames);
                                    } else {
                                        cvalue = (cnode.childNodes[0].text || cnode.childNodes[0].textContent || '');
                                    }
                                } else {
                                    cvalue = parseJsonNode(cnode, arrayNames);
                                }
                            } else {
                                cvalue = (cnode.text || cnode.textContent || '');
                            }
                        }
                        // 文本节点
                        else if (cnode.nodeType == 3 || cnode.nodeType == 4) {
                            //console.log("nodeName :  " + cnode.nodeName + " nodeType  :  " + (cnode.nodeName == "#text"));
                            cvalue = (cnode.text || cnode.textContent || '');
                        }
                        //if (cnode.nodeName == "SpecValues") {
                        //    console.log("nodeName :  " + cnode.nodeName + " value :     " + typeof (cvalue));
                        //    console.log(cvalue);
                        //}
                        if (typeof (cvalue) == "object") {

                            if (arrayNames && ECF.isArray(cvalue)) {
                                obj[cnode.nodeName] = cvalue;
                            } else {
                                nodes.push(cvalue);
                                if (!nodeNames.contains(cnode.nodeName)) {
                                    nodeNames.push(cnode.nodeName);
                                }
                            }
                        } else {

                            if (cnode.nodeName == "#cdata-section") {
                                return cvalue;
                            } else if (cnode.nodeName != "#text") {
                                obj[cnode.nodeName] = cvalue;
                            }
                        }
                    }

                    if (nodes.length > 0) {
                        if (nodeNames.length == 1) {
                            if (arrayNames.contains(xmlNode.nodeName)) {
                                obj = nodes;
                            } else {
                                obj[nodeNames[0]] = nodes;
                            }
                        } else {
                            for (var j = 0; j < nodeNames.length; j++) {
                                obj[nodeNames[j]] = nodes[j];
                            }
                        }
                    }
                } else {
                    return (xmlNode.text || xmlNode.textContent || '');
                }
                return obj;
            };
        },

        // 解析Xml对象为实体
        // xmlDocument: xmlDocument对象
        // parseRoot: 是否解析根节点
        toEntity: function (xmlDocument, parseRoot) {

            // 解析节点
            // xmlNode: xml节点
            var parseNode = function (xmlNode) {

                if (!xmlNode)
                    return null;

                var parseObj = null;

                // 首先需要将Xml节点的属性解析了
                parseObj = parseAttr(xmlNode, parseObj);
                //console.log(xmlNode.nodeName + ' type:'+ xmlNode.nodeType + xmlNode.childNodes.length);

                if (xmlNode.childNodes && xmlNode.childNodes.length > 0) { //处理有子节点和子节点存在的情况

                    for (var i = 0; i < xmlNode.childNodes.length; i++) {

                        // console.log(xmlNode.childNodes[i].nodeName + ' type:'+ xmlNode.childNodes[i].nodeType  )
                        if (xmlNode.childNodes[i].nodeType == 3 || xmlNode.childNodes[i].nodeType == 4) {
                            //console.log(xmlNode.childNodes[i].nodeName + ' type:'+ xmlNode.childNodes[i].nodeType)
                            if (!parseObj)
                                parseObj = new Object();

                            parseObj["text"] = (xmlNode.childNodes[i].text || xmlNode.childNodes[i].textContent);
                        } else if (xmlNode.childNodes[i].nodeType == 1) {

                            var parseNodeResult = parseNode(xmlNode.childNodes[i]);

                            if (parseNodeResult) {

                                if (!parseObj)
                                    parseObj = new Object();

                                if (parseObj[xmlNode.childNodes[i].nodeName]) { // 如果已经包含此名称的实体属性, 则将属性变为数组

                                    if (ECF.isArray(parseObj[xmlNode.childNodes[i].nodeName])) { // 如果已经是数组了

                                        parseObj[xmlNode.childNodes[i].nodeName].push(parseNodeResult);
                                    } else {

                                        var entity = parseObj[xmlNode.childNodes[i].nodeName];

                                        parseObj[xmlNode.childNodes[i].nodeName] = [];
                                        parseObj[xmlNode.childNodes[i].nodeName].push(entity);
                                        parseObj[xmlNode.childNodes[i].nodeName].push(parseNodeResult);
                                    }
                                } else {

                                    parseObj[xmlNode.childNodes[i].nodeName] = parseNodeResult;
                                }
                            }
                        }
                    }
                } else { //处理没有子节点,并且单节点里内容为空的情况

                    // console.log(xmlNode.nodeName + ' ' + (xmlNode.text || xmlNode.textContent || '') )
                    if (!parseObj)
                        parseObj = new Object();

                    parseObj["text"] = (xmlNode.text || xmlNode.textContent || '');
                }

                return parseObj;
            };

            // 解析节点属性
            // xmlNode: xml节点
            // parseObj: 用于存放解析对象的xml实体
            var parseAttr = function (xmlNode, parseObj) {

                if (!xmlNode || !xmlNode.attributes)
                    return parseObj;

                for (var i = 0; i < xmlNode.attributes.length; i++) {

                    if (!parseObj)
                        parseObj = new Object();

                    parseObj[xmlNode.attributes[i].name] = xmlNode.attributes[i].value;
                }

                return parseObj;
            };

            if (!xmlDocument)
                return xmlDocument;

            var parseObj = new Object();

            var root = xmlDocument.documentElement;

            if (!root)
                return parseObj;

            if (parseRoot) {

                parseObj = parseNode(root, parseObj);
            } else {

                for (var i = 0; i < root.childNodes.length; i++) {

                    if (root.childNodes[i].nodeType != 1)
                        continue;

                    var parseNodeResult = parseNode(root.childNodes[i]);

                    if (parseNodeResult) {

                        if (parseObj[root.childNodes[i].nodeName]) {

                            if (ECF.isArray(parseObj[root.childNodes[i].nodeName])) {

                                parseObj[root.childNodes[i].nodeName].push(parseNodeResult);
                            } else {

                                var entity = parseObj[root.childNodes[i].nodeName];
                                parseObj[root.childNodes[i].nodeName] = [];
                                parseObj[root.childNodes[i].nodeName].push(entity);
                                parseObj[root.childNodes[i].nodeName].push(parseNodeResult);
                            }
                        } else {

                            parseObj[root.childNodes[i].nodeName] = parseNodeResult;
                        }
                    }
                }
            }

            return parseObj;
        },

        //将Xml对象转换为｛｝对象
        toObject: function (xml) {

            var ret = new Object();

            var root = xml.documentElement;
            if (!root) return ret;
            var rows = root.childNodes;

            ret = convertNodes(rows, ret);

            return ret;

            //转换所有的节点为一个大对象
            function convertNodes(nodes, ret) {

                var nod = new Object();

                for (var n = 0; n < nodes.length; n++) {
                    var node = nodes[n];

                    if (node && node.nodeType == 1) {
                        //转换属性为对象实体
                        nod = convertNodeAttr(node);
                        if (node.childNodes.length > 0 && node.childNodes[0].nodeType == 1) {
                            if (nod[node.nodeName]) {
                                if (!ECF.isArray(nod[node.nodeName])) {
                                    nod[node.nodeName] = [nod[node.nodeName]]
                                }
                                nod[node.nodeName].push(convertNodes(node.childNodes, nod));
                            } else {
                                //添加和转换子节点
                                nod[node.nodeName] = convertNodes(node.childNodes, nod);
                            }

                        } else {
                            nod["text"] = node.text || node.textContent;
                        }
                        if (ret[node.nodeName]) {
                            if (!ECF.isArray(ret[node.nodeName])) {
                                ret[node.nodeName] = [ret[node.nodeName]];
                            }
                            ret[node.nodeName].push(nod);
                        } else {
                            ret[node.nodeName] = nod;
                        }
                    }
                }

                return ret;
            };

            //解析节点的属性
            function convertNodeAttr(node) {
                var ret = {};
                if (node && node.attributes) {
                    var attrs = node.attributes;
                    for (var i = 0; i < attrs.length; i++) {
                        ret[attrs[i].name] = attrs[i].value;
                    }
                }
                return ret;
            };

        }
    });

    //对字符串处理进行扩展
    ECF.extend(String.prototype, {
        //去掉左右空白字符
        trim: function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        },
        //去掉左边空白字符
        leftTrim: function () {
            return this.replace(/(^\s*)/g, "");
        },
        //去掉右边空白字符
        rightTrim: function () {
            return this.replace(/(\s*$)/g, "");
        },
        //过滤JS
        stripScript: function () {
            return this.replace(/<script.*?>.*?<\/script>/ig, '');
        },
        //ASCII -> Unicode转换
        unicode: function () {
            if (this) {
                var result = '';
                for (var i = 0; i < this.length; i++) {
                    result += '&#' + this.charCodeAt(i) + ';';
                }
                return result;
            }
            return this;
        },
        //Unicode -> ASCII转换
        ascii: function () {
            if (this) {
                var code = this.match(/&#(\d+);/g);
                if (code != null) {
                    var result = '';
                    for (var i = 0; i < code.length; i++) {
                        result += String.fromCharCode(code[i].replace(/[&#;]/g, ''));
                    }
                    return result;
                }
            }
            return this;
        },
        /*
            格式化数字 by 20121127
        */
        formatFloat: function (len) {
            num = this;
            return formatNumber(num, len);

            function formatNumber(num, exponent) {
                if (exponent < 1) return num;
                var str = num.toString();
                if (str.indexOf(".") != -1) {
                    if (str.split(".")[1].length == exponent) {
                        return str;
                    } else if (str.split(".")[1].length > exponent) {
                        return str.split(".")[0] + '.' + str.split(".")[1].substr(0, len);
                    } else {
                        return formatNumber(str + "0", exponent);
                    }
                } else {
                    return formatNumber(str + ".0", exponent);
                }
            }
        },

        //格式化字符串
        format: function () {
            var param = [];
            for (var i = 0, l = arguments.length; i < l; i++) {
                param.push(arguments[i]);
            }
            //var statment = param[0]; // get the first element(the original statement)
            //param.shift(); // remove the first element from array

            return this.replace(/\{(\d+)\}/g, function (m, n) {
                return param[n];
            });
        },

        /*
        返回解码后的字符串
        string		源字符串
        */
        htmlDecode: function (string) {
            return this.replace(/<br \/>/g, "\n").replace(/<br>/g, "\n").replace(/&quot;/g, "\"")
                .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "\'")
                .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
        },

        /*
        返回编码码后的字符串
        string		源字符串
        */
        htmlEncode: function (string) {
            return this.replace(/&/g, "&amp;").replace(/\"/g, "&quot;")
                .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;")
                .replace(/\n/g, "<br \/>").replace(/\r/g, "").replace(/\'/g, "&#39;");
        },

        //将字符转换为int
        toInt: function () {
            return parseInt(this);
        },

        //将字符串转换为浮点数据,并返指定保留小数位数
        toFloat: function (len) {
            if (len) {
                len = parseInt(len);
                var end = this.indexOf('.');
                var str = this;
                if (end > 0) {
                    str = this.substr(0, end + (len > 0 ? len + 1 : 0));
                }
                return parseFloat(str);
            }
            return parseFloat(this);
        },
        //  未使用和测试
        // toDecimal2 : function (x) {
        //     var f = parseFloat(x);
        //     if (isNaN(f)) {
        //         return 0.00;
        //     }
        //     var f = Math.round(x*100)/100;
        //     var s = f.toString();
        //     var rs = s.indexOf(‘.’);
        //     if (rs < 0) {
        //         rs = s.length;
        //         s += ‘.’;
        //     }
        //     while (s.length <= rs + 2) {
        //         s += ’0′;
        //     }
        //     return s;
        // },

        //获取字符串的长度，可以区分中文，一个中文字符长度为2
        getLength: function () {
            var cArr = this.match(/[^\x00-\xff]/ig);
            //console.log("中文字符长度" + cArr.length);
            return this.length + (cArr == null ? 0 : cArr.length);
        },

        toXmlData: function (name) {

            if (name == null || name == "") return "";
            val = this.trim();
            if (val.indexOf("<") != -1 || val.indexOf(">") != -1 || val.indexOf('&') > -1) {
                ret = "<" + name + "><![CDATA[" + (val) + "]]></" + name + ">";
            } else {
                ret = "<" + name + ">" + val + "</" + name + ">";
            }

            return ret;
        },

        // 去除Html标签
        removeHtml: function () {
            var str = this;
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
            str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
            return str;
        },

        isNumber: function () {
            return /^[0-9]{1,20}$/.exec(this);
        },

        // 将字符串转换为Json对象
        toJson: function () {
            return ECF.parseJSON(this);
        },

        capitalize: function () {
            return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
        },

        camelize: function () {
            return this.replace(/\-(\w)/ig,
                function (B, A) {
                    return A.toUpperCase();
                });
        }
    });

    // 对数组元素进行扩展
    ECF.extend(Array.prototype, {
        /*
            判断某元素在数组是否存在
            by xp 20120614
        */
        contains: function (element) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == element) {
                    return true;
                }
            }
            return false;
        },

        // 获取数组的真实长度
        realLength: function () {
            var len = 0;
            for (var a in this) {
                if (typeof (this[a]) != "function") {
                    len++;
                }
            }
            return len;
        }

    });

    // 地址栏参数据处理方法
    ECF.extend(ECF.params, {

        get: function (name) { //获取地址栏参数

            var url = unescape((document.location.href).replace("#", ""));

            var hval = ECF("#TEngine_EncrypUrl").value(); //用于TEngine对地址进行加密后获取原地址栏参数
            if (hval != "") {
                url = ECF.code.deBase64(hval);
            }

            //name = name.toLowerCase();
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i].toLowerCase() == "js") {
                    var tags = document.getElementsByTagName("script");
                    url = unescape(tags.item(tags.length - 1).src);
                }
            }
            var start = url.indexOf("?") + 1;
            if (start == 0) {
                return "";
            }
            var value = "";
            var queryString = url.substring(start);
            var paraNames = queryString.split("&");
            for (var i = 0; i < paraNames.length; i++) {
                if (name.toLowerCase() == getParameterName(paraNames[i]).toLowerCase()) {
                    value = getParameterValue(paraNames[i]);
                }
            }
            return value.replace("#", "");


            function getParameterName(str) {
                var start = str.indexOf("=");
                if (start == -1) {
                    return str;
                }
                return str.substring(0, start);
            };

            function getParameterValue(str) {
                var start = str.indexOf("=");
                if (start == -1) {
                    return "";
                }
                return str.substring(start + 1);
            };


        },
        catalog: function () { //获取目录路径
            var url = unescape((document.location.href).replace("#", ""));
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i].toLowerCase() == "js") {
                    var tags = document.getElementsByTagName("script");
                    url = unescape(tags.item(tags.length - 1).src);
                }
            }
            url = url.replace("\\", "/");
            if (url.indexOf("?") > 0) {
                url = url.substring(0, url.indexOf("?"));
            }
            var urlArrary = url.split("/");
            var reUrl = "";
            for (var ii = 0; ii < urlArrary.length - 1; ii++) {
                reUrl += urlArrary[ii] + "/";
            }
            return reUrl;
        },
        alter: function () { },
        getHash: function () { //获取地址栏参数中#号之后的部分
            if (document.location.href.match(/#(\w.+)/)) {
                var loc = RegExp.$1;
                return loc;
            }
        }
    });

    /**
     * 扩展JS在Html5中的存储功能
     */
    ECF.extend(ECF.storage, {
        // 记录当前作用域
        hname: location.hostname ? location.hostname : 'localStatus',
        // 是否使用地址存储
        isLocalStorage: window.localStorage ? true : false,
        // 记录数据的Dom
        dataDom: null,
        // 初始化缓存对象
        cacheData: {},
        // 初始化用户数据存储对象，初始化userData
        initDom: function () {
            if (!this.dataDom) {
                try {
                    this.dataDom = document.createElement('input'); //这里使用hidden的input元素
                    this.dataDom.type = 'hidden';
                    this.dataDom.style.display = "none";
                    this.dataDom.addBehavior('#default#userData'); //这是userData的语法
                    document.body.appendChild(this.dataDom);
                    var exDate = new Date();
                    exDate = exDate.getDate() + 30;
                    this.dataDom.expires = exDate.toUTCString(); //设定过期时间
                } catch (ex) {
                    return false;
                }
            }
            return true;
        },
        // 设置值
        set: function (key, value) {
            // 针对传入为object对象进行缓存形式处理
            if (typeof (value) == object) {
                this.cacheData[key] = value; // object对象写入缓存
            } else {
                if (this.isLocalStorage) {
                    window.localStorage.setItem(key, value);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        this.dataDom.setAttribute(key, value);
                        this.dataDom.save(this.hname)
                    }
                }
            }

        },
        // 获取值
        get: function (key) {
            var cacheValue = this.cacheData[key];
            if (typeof (cacheValue) != "undefined" && cacheValue != null) { // 判断缓存中是否存在
                return cacheValue;
            } else {
                if (this.isLocalStorage) {
                    return window.localStorage.getItem(key);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        return this.dataDom.getAttribute(key);
                    }
                }
            }
        },
        // 删除值
        remove: function (key) {
            var cacheValue = this.cacheData[key];
            if (typeof (cacheValue) != "undefined") { // 删除缓存中的数据
                delete this.cacheData[key];
            }
            if (this.isLocalStorage) {
                localStorage.removeItem(key);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.removeAttribute(key);
                    this.dataDom.save(this.hname)
                }
            }
        }
    });

    // 字符串拼凑器
    var StringBuilder = window.StringBuilder = function (value) {
        this.strings = new Array();
        if (value)
            this.append(value);
    };

    // 字符串拼凑器方法实现
    StringBuilder.prototype = {

        append: function (value) { // 添加字符串到拼凑器

            if (value) {
                this.strings.push(value);
            }
        },

        remove: function (value) { // 移除某个子元素

            if (value) {

                for (var i = 0; i < this.strings.length; i++) {

                    if (value === this.strings[i]) {
                        this.strings.splice(i, 1);
                        return;
                    }
                }
            }
        },

        contain: function (value) { // 判断是否包含某个子元素

            if (value) {

                for (var i = 0; i < this.strings.length; i++) {

                    if (value === this.strings[i])
                        return true;
                }
            }

            return false;
        },

        clear: function () { // 清空拼凑器
            this.strings.length = 0;
        },

        toString: function (Connector) { // 获取拼凑的字符串

            if (Connector)
                return this.strings.join(Connector);

            return this.strings.join("");
        }
    };

    //定义ECF全局变量
    window.ECF = window.$e = ECF;

})(window);


/* Ajax Plugin begin */
! function (ecf) {


    var guid = 0,

        //list = {}, //记录ajax队列

        getUrl = function () { //自动获取当前请求地址
            var ajaxLocation,
                //本地协议检测正则
                rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
                rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/;

            // IE浏览器访问时，可能会引发异常
            // a field from window.location if document.domain has been set
            try {
                ajaxLocation = document.location.pathname + document.location.search;
            } catch (e) {
                // 使用一个元素的href属性
                // 因为IE浏览器将修改它给予document.location
                ajaxLocation = document.createElement("a");
                ajaxLocation.href = "";
                ajaxLocation = ajaxLocation.href;
            }

            // location的分部位置
            //var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
            //alert("ajax:" + ajaxLocation);
            return ajaxLocation;
        },

        extend = function (target, src) { //对配置对象进行扩展处理
            for (var _ in src) {
                if (target[_] == undefined)
                    target[_] = src[_];
            }
            return target;
        },

        createXHR = function (corssDomain) { //获取XmlHttp对象

            var standXHR = function (corssDomain) { //获取标准的XMLHttp对象
                try {
                    var xhr = new window.XMLHttpRequest();
                    if (corssDomain) {
                        if ("withCredentials" in xhr) { //跨域的判断
                            return xhr;
                        } else if (typeof (XDomainRequest) != "undefined") {
                            xhr = new XDomainRequest();
                        }
                    }
                    return xhr;
                } catch (e) {
                    throw new Error("XMLHTTP not available: " + e);
                };
            },
                activeXHR = function () { //IE理获取XMLHTTP对象
                    // 在ie中标准的跨域对象
                    // if (typeof XDomainRequest != "undefined"){
                    // return new XDomainRequest();
                    // }
                    var Progids = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
                    for (var i = 0; i < Progids.length; i++) {
                        try {
                            return new window.ActiveXObject(Progids[i]);
                        } catch (e) {
                            alert(e);
                        }
                    }
                };

            return (window.ActiveXObject ? activeXHR() : standXHR()); //返回Xhr对象
        },

        loading = function () { //ajax正在加载中的处理
        },

        readyChange = function (xhr, s) { //请求改变处理
            if (s.isDebug && typeof (console) != "undefined") {
                console.log("XmlHttpRequest (" + (window.ActiveXObject ? "" : xhr.guid) + ') readyState is ' + xhr.readyState);
            }
            switch (xhr.readyState) {
                case 0: //UNSENT 没有发送
                    break;
                case 1: //OPENED 已打开
                    s.element ? s.element.innerHTML = "已打开链接..." : null;
                    // if (typeof (s.opening) == "function") {
                    //     s.opening.apply(xhr, []);
                    // }
                    //alert('');
                    if (typeof (s.open) == "function") {
                        try {
                            s.open.apply(xhr, []);
                        } catch (e) {
                            console.error(e);
                        };
                    }
                    break;
                case 2: //HEADERS_RECEIVED 接收头文件
                    s.element ? s.element.innerHTML = "正在接收头文件..." : null;
                    // if (typeof (s.receiving) == "function") {
                    //     s.receiving.apply(xhr, []);
                    // }
                    if (typeof (s.receive) == "function") {
                        try {
                            s.receive.apply(xhr, []);
                        } catch (e) {
                            console.error(e);
                        };
                    }
                    break;
                case 3: //LOADING 开始加载
                    s.element ? s.element.innerHTML = "数据加载中..." : null;
                    if (typeof (s.loading) == "function") {
                        try {
                            s.loading.apply(xhr, []);
                        } catch (e) {
                            console.error(e);
                        };
                    }
                    break;
                case 4: //DONE 完成加载
                    //alert(4 + ": " + xhr.status + ":" + xhr.responseText);
                    s.element ? s.element.innerHTML = "数据加载完成,正在处理..." : null; //指定element时显示处理状态
                    if (typeof (s.done) == "function") {
                        try {
                            s.done.apply(xhr, []);
                        } catch (e) {
                            console.error(e);
                        };
                    }
                    done(xhr.status, xhr.statusText, xhr, s); //处理完成
                    break;
            }
        },

        done = function (status, statusText, xhr, s) { //ajax完成请求后的处理
            //alert("2212" + statusText + ",status:" + status);
            if (s.state == 9) { //只是调用一次
                return;
            }

            s.state = 9; //正在调用done

            if (s.timeOutTimer) { //如果timeout存在,清除timeout
                clearTimeout(s.timeOutTimer);
            }

            if (status >= 200 && status < 300 || status === 304) { //状态为成功时处理
                if (status === 304) { // 没有修改数据
                    statusText = "notmodified";
                    isSuccess = true;
                } else { // 有数据修改

                    var status = status || xhr.status, //状态
                        statusText = statusText || xhr.statusText, //状态文本
                        responses = {}; //输出的所有信息

                    responses.Headers = xhr.getAllResponseHeaders(); //获取全部响应头信息
                    responses.text = xhr.responseText; // 构建响应列表
                    responses.type = xhr.getResponseHeader("Content-Type") || "text";

                    if (xhr.responseXML) {
                        xml = xhr.responseXML;
                        if (xml.documentElement) { //判断是否为Xml元素
                            responses.xml = xml;
                        }
                    }

                    // 判断输出值是否为json格式数据,为json数据时直接转为json对象 && responses.text.match("^\{(.+:.+,*){1,}\}$")
                    if (responses.type.indexOf("json") > -1) {
                        responses.json = ECF.parseJSON(responses.text);
                    }

                }

                if (typeof (s.success) == "function") { //当配置了成功后的处理方法则执行
                    //console.log(typeof(xhr) + '['+status+','+ responses+','+statusText+']');
                    //try {
                    s.success.apply(xhr, [status, responses, statusText]);

                    // 处理iscroll
                    if ($e.iscroll) {
                        if ($e.iscroll.refresh) {
                            $e.iscroll.refresh();
                        }
                    }

                    // 对swiper的支持
                    if ($e.swiper) {
                        $e.swiper.update();
                        $e.swiper.onResize();
                    }

                    // }
                    // catch (e) {
                    //     throw e;
                    //if (typeof (console) != "undefined") { //发生错误时处理调试信息
                    //    console.warn(e);
                    //}
                    // }
                }

            } else if (status == 0) { //Ajax未发送时不做处理
                if (s.isDebug && typeof (console) != "undefined") { //调试信息
                    console.log('status:' + status + 'statusText:' + statusText + ',url: ' + s.url);
                }
            } else {
                if (s.isDebug && typeof (console) != "undefined") { //调试信息
                    console.log('status:' + status + 'statusText:' + statusText + ',url: ' + s.url);
                }
                if (s && s.error) { //如果自定义了错误方法就执行错误方法
                    if (typeof (s.error) == "function") {
                        s.error.apply(xhr, [status, statusText]);
                    }
                } else {
                    if (typeof (console) != "undefined") { //发生错误时处理调试信息
                        console.log('error status:' + status + ';\nstatusText:' + statusText + ';\nurl: ' + s.url);
                    }
                }
            }

            if (s.isDebug && typeof (console) != "undefined") { //清除已经完成的XmlHttpRequest对象
                console.log("XmlHttpRequest (" + (window.ActiveXObject ? "" : xhr.guid) + ') remove success');
            }

            //开始进行Ajax发送处理,如果给定了button对象需要把button对象进行解除禁用
            if (s.button && s.button.nodeType == 1) {
                s.button.disabled = false;
                s.button.innerHTML = s.buttonHtml;
            }
            xhr = null;
        },

        abort = function (statusText, xhr, s) { //终止线程
            var statusText = statusText || "abort";
            if (xhr && xhr.readyState !== 4) {
                xhr.abort();
                done(0, statusText, xhr, s); //完成处理
            }
        },

        script = function (s) { //跨域处理脚本

            var script,
                head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

            return {
                send: function (_, callback) {
                    script = document.createElement("script");
                    script.async = true;

                    if (s.scriptCharset) { //设置script的编码
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    script.onload = script.onreadystatechange = function (_, isAbort) { // 给浏览器加载onload方法

                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                            script.onload = script.onreadystatechange = null; // 针对ie处理内在停留

                            if (head && script.parentNode && !s.hold) { // 删除脚本引用
                                head.removeChild(script);
                            }
                            script = undefined; // 取消脚本定义

                            if (!isAbort) { // 终止请求
                                if (typeof (callback) == "function")
                                    callback(200, "success");
                            }
                        }
                    };

                    head.insertBefore(script, head.firstChild); // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                },

                abort: function () {
                    if (script) {
                        script.onload(0, 1);
                    }
                }
            };

        },

        dataProcess = function (data, type) { //数据处理
            if (typeof (data) == "string") {
                if (type.toLowerCase() == "xml") {
                    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root>" + data + "</root>";
                } else {
                    return encodeURIComponent(data);
                }
            } else if (typeof (data) == "object") {
                return data;
            }
            return data;
        },

        defaults = { //ajax的默认配置
            url: getUrl(), //ajax请求地址
            isDebug: false, //是否开始调试
            method: "POST", //请求类型
            contentType: "application/x-www-form-urlencoded", //请求内容类型
            processData: true, //处理数据
            showState: true, //显示ajax状态
            async: true, //异步处理
            mimeType: "", //MIME类型
            corssDomain: false, //是否进行跨域请求,默认为false
            timeout: 0, //超时时间
            element: null, //直接进行赋值的对象元素
            button: null, //点击的对角元素
            data: null, //数据
            dataType: 'xml', //数据类型(xml,json,html,script,parameter) 默认为空,即为json
            username: null, //打开请求用户名
            password: null, //打开请求的密码
            cache: null, //缓存
            traditional: false, //传统模式
            loadstart: null, //开始加载
            open: null, // 打开请求
            receive: null, //接收头文件
            loading: null, //状态等于2,3时会处理此处对应的方法
            done: null, //完成加载
            progress: null, //处理中(只对XmlHttpRequest有效)
            loaded: null, //加载完成(只对XmlHttpRequest有效)
            success: null, //状态等于4即完成了页面加载
            error: null, //出错时
            abort: null, //终止请求
            accepts: { //接受格式
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": ["*/"] + ["*"]
            }
        };

    //ajax请求开始
    ecf.ajax = function (url, options) {
        //当链接地址与选项都未给定时返回不做任何处理
        if (!url && !options) return;

        var ops = options || {}, //定义选项
            s = {},
            xhr;

        //对url和options进行交换处理
        if (typeof (url) == "object") {
            ops = url;
            url = undefined;
        } else if (typeof (url) == "string") {
            ops.url = url;
        }

        // console.log(ops.url);

        s = extend(ops, defaults); //将对象进行请求扩展

        if (s.dataType == "script") {
            xhr = script(s);
            xhr.send(s, s.success);
            return;
        }

        xhr = createXHR(s.crossDomain); //= list[guid]

        if (!xhr) { //如果创建xmlHttp对象失败,刚返回请求
            alert('浏览器不直持ajax请求');
            return;
        }

        guid++; //xhr Guid


        s.state = 0;

        // if(s.url){//请求地址处理
        // }

        //数据类型处理

        //crossDomain跨域处理

        //数据处理

        s.method = s.method.toUpperCase(); // 将类型转换为大写

        //开始进行Ajax发送处理,如果给定了button对象需要把button对象进行禁用
        if (s.button && s.button.nodeType == 1) {
            s.button.disabled = true;
            s.buttonHtml = s.button.innerHTML;
            s.button.innerHTML = "请稍后..";
            // alert('d');
        }

        if (xhr.onloadstart) xhr.onloadstart = s.loadstart || function () { //开始加载时调用
            if (s.isDebug && typeof (console) != "undefined") {
                console.log(' begin loadstart ');
            }
        };

        if (xhr.onerror) xhr.onerror = s.error || function () { //当出现错误时调用开始设定的方法
            if (s.isDebug && typeof (console) != "undefined") {
                console.log('XmlHttpRequest error ' + arguments[0]);
            }
        };

        if (xhr.onprogress) xhr.onprogress = s.progress || function () { //正在处理过程中的处理时调用
            if (s.isDebug && typeof (console) != "undefined") {
                console.log(' begin progress ');
            }
        };

        if (xhr.onloadend) xhr.onloadend = s.loaded || function () { //xhr加载完成时调用
            if (s.isDebug && typeof (console) != "undefined") {
                console.log(' begin progress ');
            }
        };

        xhr.onreadystatechange = function () { //XmlHttp对象执行状态处理
            readyChange(xhr, s); //在ie中不能支持把xhr附给this
        };

        try {
            if (s.username) { // 打开socket 通过空用户名，在Opera上生成一个登录弹出
                xhr.open(s.method, s.url, s.async, s.username, s.password);
            } else {
                xhr.open(s.method, s.url, s.async);
            }
        } catch (e) {
            //开始进行Ajax发送处理,如果给定了button对象需要把button对象进行解除禁用
            if (s.button && s.button.nodeType == 1) {
                s.button.disabled = false;
                s.button.innerHTML = s.buttonHtml;
            }

            if (typeof (s.error) == "function") {
                s.error.apply(xhr, [e]);
            }
            return;
        }

        s.dataType = s.dataType.toLowerCase();

        //判断是否发送xml格式数据,对data进行xml数据的格式化处理
        if (s.dataType) {
            if (s.dataType == "xml") {
                if (s.processData) { //指定是否对数据进行处理然后再提交
                    s.data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root>" + s.data + "</root>";
                }
            } else if (s.dataType == "josn") {
                if (s.processData) {
                    s.data = encodeURIComponent(s.data);
                }
            }
        } else {
            if (s.processData) {
                s.data = encodeURIComponent(s.data);
            }
        }

        //对元素进行处理
        if (s.element) {
            if (typeof (s.element) == "string") {
                s.element = document.getElementById(s.element);
            }
        }

        if (s.dataType == "xml") {
            xhr.setRequestHeader("Content-Type", "ajax/xml");
        } else if (s.dataType == 'json') {
            xhr.setRequestHeader("Content-Type", "ajax/json");
        }

        if (s.mimeType && xhr.overrideMimeType) { // 修改mimeType
            xhr.overrideMimeType(s.mimeType);
        }

        if (s.async && s.timeout > 0) { // 超时处理
            s.timeoutTimer = setTimeout(function () {
                abort("timeout", xhr, s);
            }, s.timeout);
        }

        if (s.isDebug && typeof (console) != "undefined") { //调试信息
            if (!window.ActiveXObject) xhr.guid = guid;
            //console.log('create XmlHttpRequest Success, current XmlHttp Number ' + guid + '\nurl: ' + s.url + '\nmethod: ' + s.method + '\ndata: ' + s.data + '\ndataType: ' + s.dataType);
        };

        // 在数据发送之前的函数处理
        if (typeof (s.beforeSend) == "function") {
            s.beforeSend.apply(xhr, []);
        }


        try {
            xhr.send(s.data || null);
        } catch (e) {
            //开始进行Ajax发送处理,如果给定了button对象需要把button对象进行解除禁用
            if (s.button && s.button.nodeType == 1) {
                s.button.disabled = false;
                s.button.innerHTML = s.buttonHtml;
            }
            throw e;
            // if (typeof (console) != "undefined") {
            // console.warn('ECF==4414' + e);
            // }
        }
    };


    ecf.ajax.prototype = {
        defaults: defaults,
        info: {}
    };

    //ecf.ajax.prototype.constructor = ecf.ajax;

    //get方式处理
    ecf.get = function (url, options) {
        if (typeof (url) == "object") {
            url.method = "GET";
        } else if (typeof (options) == "object") {
            options.method = "GET";
        }
        ecf.ajax(url, options);
    };

    //通过Post方式获取值
    ecf.post = function (url, options) {
        if (typeof (url) == "object") {
            url.method = "POST";
        } else if (typeof (options) == "object") {
            options.method = "POST";
        }
        ecf.ajax(url, options);
    };

    // 获取Json数据
    ecf.getJson = function (url, callback) {
        ecf.ajax(url, {
            success: function () {
                callback(arguments[0], arguments[1]);
            },
            method: "GET"
        });
    };

    // 异步获取并加载js文件
    ecf.getScript = function (url, callback, hold) {
        var exsit = false,
            head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
            scripts = head.getElementsByTagName("script");

        if (typeof (hold) == "undefined") {
            hold = true;
        }

        // 需要保持注留在页面
        if (hold) {
            for (var s = 0; s < scripts.length; s++) {
                var src = $e(scripts[s]).attr("src");

                // 去掉地址后面带有特殊参数
                if (typeof (src) == "string") {
                    if (src.indexOf("?") > 0) {
                        src = src.substr(0, src.indexOf("?"));
                    }
                }

                // 去掉地址后面带有的特殊参数
                if (typeof (url) == "string") {
                    if (url.indexOf("?") > 0) {
                        url = url.substr(0, url.indexOf("?"));
                    }
                }

                if (src == url) {
                    exsit = true;
                }
            }
        }

        //console.log(exsit,hold);

        // 如果页面已经有此脚本
        if (exsit) {
            callback(200, "success");
        } else {
            ecf.ajax(url, {
                dataType: "script",
                success: callback,
                method: "GET",
                async: true,
                hold: (typeof (hold) != "undefined" ? hold : true)
            });
        }
    };

}(ECF);
/* Ajax plugin end */

/* webSocket plugin begin */

! function ($) {

    // 内部使用的WebSocket对象
    var ws = null;
    // 基础配置信息
    var setting = {
        server: "127.0.0.1",
        port: 999,
        opened: function () { },
        received: function () { },
        closed: function () { },
        error: function () { },
        // 开启调试信息
        debug: false
    };

    // 对外提供人WebSocet对象
    $.wsocket = function (options) {

        var opts = options || {};

        //处理默认配置
        for (var i in setting) {
            if (opts[i] == undefined) opts[i] = setting[i];
        }

        // 进行私有化具休业务实现
        var jSocket = function (optins) {

            // 具体方法执行
            jws._init(optins);
        };

        var jws = {
            _options: {},
            _url: "ws://",
            waitMsgs: [],
            // 初始化,判断浏览器是否支持webSocket
            _init: function (opts) {
                var support = "MozWebSocket" in window ? "MozWebSocket" : ('WebSocket' in window ? 'WebSocket' : null);
                if (support == null) {
                    alert("您的浏览器不支持WebSocket!");
                    return false;
                }

                this._options = opts;

                // 连接Socket服务
                this.connetct(opts);
            },

            // 连接服务器
            connetct: function (opts) {
                try {
                    // 给定组件对象
                    var wsImpl = window.WebSocket || window.MozWebSocket;

                    // 实例化WebSocket对象
                    ws = new wsImpl("ws://" + opts.server + ":" + opts.port + "/"); //, 'subprotocol' ws.binaryType = "blob";
                    //ws.binaryType = 'arraybuffer';
                    if (ws.readyState === WebSocket.CONNECTING) {
                        if (opts.debug)
                            console.log("正在连接WebSocket服务器...");
                    }
                    // 绑定webSocket的处理事件
                    ws.onopen = this.onOpen;
                    ws.onmessage = this.onMessage;
                    ws.onclose = this.onColse;
                    ws.onerror = this.onError;

                } catch (e) {
                    console.log("Error：" + e);
                }
            },
            // 断开连接
            disconnect: function () {
                if (ws != null && ws.readyState === WebSocket.OPEN) {
                    ws.close(); //关闭TCP连接
                }
            },
            // 打开连接
            onOpen: function (evt) {
                var opts = jws._options;

                if (ws.readyState === WebSocket.OPEN) {

                    // 开始发送一开始提交的还未发送成的消息
                    for (var i = jws.waitMsgs.length - 1; i > -1; i--) {
                        var msg = jws.waitMsgs[i];
                        if (typeof (msg) === "string") {
                            ws.send(msg);
                            jws.waitMsgs.splice(i);
                        }

                        if (opts.debug)
                            console.log("已发送消息" + msg);
                    }

                    if (opts.debug)
                        console.log("已连接到WebSocket服务器");

                    // 回调配方法
                    if (typeof (opts.opened) == "function") {
                        opts.opened.apply(this, [evt]);
                    }
                }
            },
            // 接收消息
            onMessage: function (evt) {
                var opts = jws._options;
                if (typeof (opts.received) == "function") {
                    opts.received.apply(this, [evt]);
                }
            },

            // 关闭Socket连接
            onColse: function (evt) {
                var opts = jws._options,
                    result = jws.getWebSocketState(ws);

                if (typeof (opts.colsed) == "function") {
                    opts.colsed.apply(this, [result, evt]);
                }

                if (opts.debug)
                    console.log("close事件wasClean：" + evt.wasClean + ",code：" + evt.code + ",error：" + evt.error + ",reason：" + evt.reason + "," + result);

            },

            // 当WSocket发生异常时
            onError: function (evt) {
                var opts = jws._options;
                if (typeof (opts.error) == "function") {
                    opts.error.apply(this, [evt]);
                }
            },

            // WebSocket可以收发消息的类型有String、Blob和ArrayBuffer
            // readyState、bufferedAmount 和protocol。
            // bufferedAmount 特性检查已经进入队列，但是尚未发送到服务器的字节数
            sendMessage: function (msg) {
                if (ws != null && ws.readyState === WebSocket.OPEN) {
                    if (msg == "" || msg == null || msg == "undefined") {
                        return false;
                    }
                    ws.send(msg);
                } else {
                    // 第一次发送时还连接还未完成就记录等发送的信息
                    jws.waitMsgs.push(msg);
                    if (jws._options.debug)
                        console.log("发送失败！原因：可能是WebSocket未能建立连接！");
                }
            },

            // 获取当前Socket的状态
            getWebSocketState: function (ws) {
                var result = "";
                switch (ws.readyState) {
                    case 0:
                        result = "连接正在进行中，但还未建立";
                        break;
                    case 1:
                        result = "连接已经建立。消息可以在客户端和服务器之间传递";
                        break;
                    case 2:
                        result = "连接正在进行关闭握手";
                        break;
                    case 3:
                        result = "连接已经关闭，不能打开";
                        break;
                }

                return result;
            }

        };

        // 对外公开的接口信息
        jSocket.prototype = {
            constructor: jSocket,
            // 发送信息
            send: function (msg) {
                jws.sendMessage(msg);
                return this;
            },
            // 获取当前Socket的状态
            getState: function () {
                return jws.getWebSocketState(ws);
            },
            // 当前版本
            verion: "1.0.1.1",
            // 作者
            author: "shaipe"
        };

        return new jSocket(opts);
    };

}(ECF);
/* webSocket plugin end */
