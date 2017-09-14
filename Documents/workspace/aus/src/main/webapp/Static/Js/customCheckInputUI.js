/*
 * 自定义单选复选控件
 * By Mr.z
 *
 * 参数参考
 * setSwitch    类型：bool 默认值：true  功能：是否启用自定义单选复选功能
 *
 * setSwitchAll 类型：bool 默认值：true  功能：是否启用多选功能
 *
 * v1.0.2
 * 新增label标签存在title的提示
 *
 * v1.0.1
 * 调整局部缓存为全局缓存,防止变量在每次Ajax更新后会出现问题
 *
 * v1.0.0
 * 版本创建
 */

(function ($, win) {
    //构造函数
    var customCheck = function (ele, options) {
        //传入的DOM对象
        this.obj = ele[0] || win.document;
        //基础配置
        this.defaults = {
            //开关(默认开启)
            setSwitch: true,
            //多选开关
            setSwitchAll: true
        };
        //基础配置扩展
        this.option = $.extend({}, this.defaults, options);
        //数组
        this.inputArray = [];
        //锁
        this.sock = false;
    };

    customCheck.prototype.init = function () {
    	var _this = this;

        //筛选初始化
        _this.initInput();

        //控件的事件绑定
        _this.bindInput();

        //对input控件进行打包包装
        _this.packInput();

        //初始化控件的选中状态
        _this.stateInput();
    };

    //对象筛选初始化
    customCheck.prototype.initInput = function () {
        var _this = this;

        if (_this.obj.length <= 0) { return; }

        var list = $('input[type=checkbox], input[type=radio]', this.obj);
        var i = 0;
        for (; i < list.length; i++) {
//          if (list[i].parentNode.tagName !== 'LABEL') {
//              _this.inputArray[_this.inputArray.length] = list[i];
//          }
			_this.inputArray[_this.inputArray.length] = list[i];
        }
    };

    //对象包装
    customCheck.prototype.packInput = function () {
        var _this = this;

        //判断是否需要包装
        if (!_this.option.setSwitch) { return; }

        var i = 0;
        for (; i < _this.inputArray.length; i++) {
            var parent = _this.inputArray[i].parentNode;

            //过滤已被包装了的
            if (parent.tagName !== 'LABEL') {
                var lab = document.createElement('label');

                //根据不同的类型给不同的样式
                if (_this.inputArray[i].type === 'checkbox') {
                    lab.className = 'custom-checkbox';
                } else if (_this.inputArray[i].type === 'radio') {
                    lab.className = 'custom-radio';
                } else {
                    //异常
                }

                //找他有没有相邻的labe标签
                var labs = $(_this.inputArray[i]).next()[0];
                var str = '';
                var fors = '';
                var ids = '';
                var titles = '';
                if (labs.tagName === 'LABEL') {
                    str = labs.innerHTML;
                    if (labs.hasAttribute('for')) {
                        fors = labs.getAttribute('for');
                    }

                    if (labs.hasAttribute('id')) {
                        ids = labs.getAttribute('id');
                    }

                    if (labs.hasAttribute('title')) {
                        titles = labs.getAttribute('title');
                    }

                    parent.removeChild(labs);
                }

                //替换DOM
                try {
                    //if (tools.winBrown() === null) {
                    //    //非IE
                    //    parent.replaceChild(lab, _this.inputArray[i]);
                    //} else {
                    //    //IE
                    //    parent.replaceNode(lab, _this.inputArray[i]);
                    //}

                    parent.replaceChild(lab, _this.inputArray[i]);

                    lab.appendChild(_this.inputArray[i]);

                    if (str !== '') {
                        var spa = document.createElement('span');
                        spa.innerHTML = str;
                        lab.appendChild(spa);
                    }

                    if (fors !== '') {
                        lab.setAttribute('for', fors);
                    }

                    if (ids !== '') {
                        lab.setAttribute('id', ids);
                    }

                    if (titles !== '') {
                        lab.setAttribute('title', titles);
                    }
                } catch (e) {
                    //TODO handle the exception
                }
            }
        }
    };

    //控件的选择状态
    customCheck.prototype.stateInput = function () {
        var _this = this;

        //判断是否能执行
        if (!_this.option.setSwitch) { return; }

        //判断有没有被包装过
        var i = 0;
        for (; i < _this.inputArray.length; i++) {
            var parent = _this.inputArray[i].parentNode;
            if (parent.tagName === 'LABEL') {
                if (_this.inputArray[i].type === 'radio') {
                    if (_this.inputArray[i].checked) {
                        $(parent).addClass('checked');
                    } else {
                        $(parent).removeClass('checked');
                    }
                } else if (_this.inputArray[i].type === 'checkbox') {
                    //多选
                    if (_this.option.setSwitchAll) {
                        var newparent = _this.inputArray[i].parentNode;

                        if (_this.inputArray[i].hasAttribute('checklist')) {
                            //返回所有相同子集元素的复选
                            var list = _this.sameChildCheckbox(_this.inputArray[i]);

                            //获取对应的父级复选
                            var parCheck = _this.getParentCheck(_this.inputArray[i]);

                            if (_this.inputArray[i].checked) {
                                $(newparent).addClass('checked');
                            } else {
                                $(newparent).removeClass('checked');
                            }

                            //获取被选中的子集
                            var checkedList = _this.checkedSameChildCheckbox(_this.inputArray[i]);

                            //if (checkedList.length === 0) {
                            //    //没有被选中的
                            //    parCheck.checked = false;
                            //    $(parCheck.parentNode).removeClass('checked').removeClass('half-checked');
                            //} else if (checkedList.length < list.length) {
                            //    //选中其中一个的
                            //    parCheck.checked = false;
                            //    $(parCheck.parentNode).addClass('half-checked').removeClass('checked');
                            //} else if (checkedList.length === list.length) {
                            //    //全部选完
                            //    parCheck.checked = true;
                            //    $(parCheck.parentNode).addClass('checked').removeClass('half-checked');
                            //}
                        } else {
                            if (_this.inputArray[i].checked) {
                                $(parent).addClass('checked');
                            } else {
                                $(parent).removeClass('checked');
                            }
                        }
                    } else {
                        if (_this.inputArray[i].checked) {
                            $(parent).addClass('checked');
                        } else {
                            $(parent).removeClass('checked');
                        }
                    }
                } else {
                    //异常
                }
            }
        }
    };

    //控件事件绑定
    customCheck.prototype.bindInput = function () {
        var _this = this;

        //判断是否能执行
        if (!_this.option.setSwitch) { return; }

        var i = 0;
        for (; i < _this.inputArray.length; i++) {
            var parent = _this.inputArray[i].parentNode;

            //如果当前对象已经存在了外包装,就证明被绑定过事件,那么就不需要再进行绑定
            if (parent.tagName !== 'LABEL') {
                $(_this.inputArray[i]).bind('click', function (evt) {
                    if (_this.sock) { return; }

                    //上锁
                    _this.sock = true;

                    //让文本不可选中
                    tools.selectStart(true);

                    //判断点击的是单选还是复选
                    if (this.type === 'radio') {
                        //查找所有相同name属性的单选
                        var list = _this.sameRadio(this);

                        $(list).each(function () {
                            var newparent = this.parentNode;

                            if (this.checked) {
                                $(newparent).addClass('checked');
                            } else {
                                $(newparent).removeClass('checked');
                            }
                        });
                    } else if (this.type === 'checkbox') {
                        var newparent = this.parentNode;

                        //多选
                        if (_this.option.setSwitchAll) {
                            if (this.hasAttribute('checkall')) {
                                //返回所有相同子集元素的复选
                                var list = _this.sameListCheckbox(this);

                                if (this.checked) {
                                    $(newparent).addClass('checked').removeClass('half-checked');

                                    //让所有子集选中
                                    $(list).each(function () {
                                        var _par = this.parentNode;
                                        this.checked = true;
                                        $(_par).addClass('checked');
                                    });
                                } else {
                                    $(newparent).removeClass('checked').removeClass('half-checked');

                                    //让所有子集不选中
                                    $(list).each(function () {
                                        var _par = this.parentNode;
                                        this.checked = false;
                                        $(_par).removeClass('checked');
                                    });
                                }
                            } else if (this.hasAttribute('checklist')) {
                                //返回所有相同子集元素的复选
                                var list = _this.sameChildCheckbox(this);

                                //获取对应的父级复选
                                var parCheck = _this.getParentCheck(this);

                                if (this.checked) {
                                    $(newparent).addClass('checked');
                                } else {
                                    $(newparent).removeClass('checked');
                                }

                                //获取被选中的子集
                                var checkedList = _this.checkedSameChildCheckbox(this);

                                if (checkedList.length === 0) {
                                    //没有被选中的
                                    parCheck.checked = false;
                                    $(parCheck.parentNode).removeClass('checked').removeClass('half-checked');
                                } else if (checkedList.length < list.length) {
                                    //选中其中一个的
                                    parCheck.checked = false;
                                    $(parCheck.parentNode).addClass('half-checked').removeClass('checked');
                                } else if (checkedList.length === list.length) {
                                    //全部选完
                                    parCheck.checked = true;
                                    $(parCheck.parentNode).addClass('checked').removeClass('half-checked');
                                }
                            } else {
                                if (this.checked) {
                                    $(newparent).addClass('checked');
                                } else {
                                    $(newparent).removeClass('checked');
                                }
                            }
                        } else {
                            if (this.checked) {
                                $(newparent).addClass('checked');
                            } else {
                                $(newparent).removeClass('checked');
                            }
                        }
                    } else {

                    }

                    //解锁
                    _this.sock = false;

                    //让文本可选中
                    tools.selectStart(false);
                });
            }
        }
    };

    //返回相同name属性的单选
    customCheck.prototype.sameRadio = function (obj) {
        var _this = this;

        var objs = [];

        var list = $('input[type=checkbox], input[type=radio]', this.obj);
        var i = 0;
        for (; i < list.length; i++) {
            if (list[i].nodeName === 'INPUT' && list[i].type === 'radio' && list[i].name === obj.name) {
                objs[objs.length] = list[i];
            }
        }

        return objs;
    };

    //返回相同checklist属性的复选
    customCheck.prototype.sameListCheckbox = function (obj) {
        var _this = this;

        var objs = [];

        //获取父级名称
        var checkAllName = obj.getAttribute('checkall');

        var list = $('input[type=checkbox], input[type=radio]', this.obj);
        var i = 0;
        for (; i < list.length; i++) {
            if (list[i].nodeName === 'INPUT' && list[i].type === 'checkbox' && list[i].hasAttribute('checklist') && list[i].getAttribute('checklist') === checkAllName) {
                objs[objs.length] = list[i];
            }
        }

        return objs;
    };

    //返回所有相同的同级的复选框子集元素
    customCheck.prototype.sameChildCheckbox = function (obj) {
        var _this = this;

        var objs = [];

        //获取父级名称
        var checkAllName = obj.getAttribute('checklist');

        var list = $('input[type=checkbox], input[type=radio]', this.obj);
        var i = 0;
        for (; i < list.length; i++) {
            if (list[i].nodeName === 'INPUT' && list[i].type === 'checkbox' && list[i].hasAttribute('checklist') && list[i].getAttribute('checklist') === checkAllName) {
                objs[objs.length] = list[i];
            }
        }

        return objs;
    };

    //根据当前点击的子集复选反推父级复选
    customCheck.prototype.getParentCheck = function (obj) {
        var _this = this;

        var objs = null;

        //获取父级名称
        var checkAllName = obj.getAttribute('checklist');

        var list = $('input[type=checkbox], input[type=radio]', this.obj);
        var i = 0;
        for (; i < list.length; i++) {
            if (list[i].nodeName === 'INPUT' && list[i].type === 'checkbox' && list[i].hasAttribute('checkall') && list[i].getAttribute('checkall') === checkAllName) {
                objs = list[i];
            }
        }

        return objs;
    };

    //返回所有被选中的同级复选框
    customCheck.prototype.checkedSameChildCheckbox = function (obj) {
        var _this = this;

        var objs = [];

        //获取父级名称
        var checkAllName = obj.getAttribute('checklist');

        var list = $('input[type=checkbox], input[type=radio]', this.obj);
        var i = 0;
        for (; i < list.length; i++) {
            if (list[i].nodeName === 'INPUT' && list[i].type === 'checkbox' && list[i].hasAttribute('checklist') && list[i].getAttribute('checklist') === checkAllName && list[i].checked) {
                objs[objs.length] = list[i];
            }
        }

        return objs;
    };

    $.fn.customCheck = function (options) {
        debugger;
        //定义插件名称
        var check = new customCheck(this, options);

        return check.init();
    };
})(ECF, window);