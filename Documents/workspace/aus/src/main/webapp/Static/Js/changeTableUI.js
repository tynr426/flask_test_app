//列表切换
var changeTable = function () {
    this.cutTable = function (win) {
        var win = win || window;
        if (typeof (win.location) != 'object') {
            win = window;
        }

        //遍历主框架
        var obj = ergodicMainTarget(win);

        //根据框架遍历按钮区域
        var changeBox = ergodicChangeTarget(obj);

        //根据框架遍历切换区域
        var changeBody = ergodicChangeBodyTarget(obj);

        //按钮的事件绑定
        changeBtnBind(obj, changeBox, changeBody);
    };

    //遍历主框架
    var ergodicMainTarget = function (win) {
        //遍历整体对象
        var obj = win.$e('*[label-box]');

        return obj;
    };

    //根据框架遍历按钮区域
    var ergodicChangeTarget = function (obj) {
        var max = obj.length;
        if(max <= 0) return;
        var changeBox = [];
        for (var i = 0; i < max; i++) {
            changeBox[changeBox.length] = $e('*[label-btncom]', obj[i]);
        }

        return changeBox;
    };

    //根据框架遍历切换区域
    var ergodicChangeBodyTarget = function (obj) {
        var max = obj.length;
        if (max <= 0) return;
        var changeBody = [];
        for (var i = 0; i < max; i++) {
            changeBody[changeBody.length] = $e('*[label-limitarea]', obj[i]);
        }

        return changeBody;
    };

    //按钮的事件绑定
    var changeBtnBind = function (obj, changeBox, changeBody) {
        if (obj.length <= 0 || changeBox.length <= 0 || changeBody.length <= 0) return;

        //遍历不同的按钮
        var max = changeBox.length;
        for (var i = 0; i < max; i++) {
            changeBox[i].each(function () {
                $e('*[label-btn]', this).each(function () {
                    var values = this.getAttribute('label-btn')

                    //获取唯一识别标签
                    var key = values.split('|')[0];

                    //获取事件触发方式
                    var active = values.split('|')[1];

                    //获取相同位数的切换面
                    var palce = values.split('|')[2];

                    //获取拦截
                    var intercept = values.split('|')[3];

                    //事件绑定
                    btnBindActive(this, key, active, palce, intercept);
                });
            });
        }
    };

    //事件冒泡找根级
    var bubbling = function (obj, tar, str) {
        var _obj = obj;
        while (_obj) {
            if (tools.hasAttr(_obj, tar) && _obj.getAttribute(tar) == str) {
                return _obj;
            }
            _obj = _obj.parentNode;
        }
    };

    //事件穿透找到下面的元素
    var toBubbling = function (obj, tar, chi, str) {
        var _obj = obj;
        while (_obj) {
            if (tools.hasAttr(_obj, tar) && _obj.getAttribute(tar) == str) {
                return $e('*[' + chi + '=' + str + ']', _obj)[0];
            }
            _obj = _obj.parentNode;
        }
    };

    //事件绑定
    var btnBindActive = function (obj, key, active, palce, intercept) {
        //判断绑定事件方式
        switch (active) {
            case 'click':
                //点击事件
                $e(obj).bind(START_EV, function (evt) {
                    //判断鼠标键值
                    var keyCode = evt.keyCode || evt.button;

                    if (keyCode == 2) return;

                    //让文本不可选中
                    //tools.selectStart(true);

                    //阻止冒泡
                    tools.stopBubble(evt);

                    changeActive(this, key, active, palce, intercept);
                });

                $e(obj).bind(END_EV, function (evt) {
                    //判断鼠标键值
                    var keyCode = evt.keyCode || evt.button;
                    if (keyCode == 2) return;

                    //让文本可选中
                    //tools.selectStart(false);

                    //阻止冒泡
                    tools.stopBubble(evt);
                });
                break;

            case 'hover':
                //滑动事件
                $e(obj).bind('mouseover', function (evt) {
                    //让文本不可选中
                    //tools.selectStart(true);

                    //阻止冒泡
                    tools.stopBubble(evt);

                    changeActive(this, key, active, palce, intercept);
                });

                $e(obj).bind('mouseout', function (evt) {
                    //让文本可选中
                    //tools.selectStart(false);

                    //阻止冒泡
                    tools.stopBubble(evt);
                });
                break;

            default:
                //默认点击事件
                break;
        }
    };

    //事件实现
    var changeActive = function (obj, key, active, palce, intercept) {
        //往上冒泡找到根级
        var objs = bubbling(obj, 'label-box', key);

        //往上冒泡找到切换层
        var changeBox = bubbling(obj, 'label-btncom', key);

        //往下穿透找到切换面
        var placeBox = toBubbling(obj, 'label-box', 'label-limitarea', key);

        //切换层的切换
        $e('*[label-btn]', changeBox).each(function () {
            var keys = this.getAttribute('label-btn').split('|')[0];

            if (keys == key) {
                $e(this).removeClass('select');
            };
        });
        $e(obj).addClass('select');
        
        //判断是否支持拦截
        if (intercept != 'return'){
            //切换面的切换
            $e('*[label-area]', placeBox).each(function () {
                var vkeys = this.getAttribute('label-area').split('|')[0];
                if (vkeys == key) {
                    $e(this).removeClass('select');
                };
            });
            $e('*[label-area]', placeBox).each(function () {
                var vkeys = this.getAttribute('label-area').split('|')[0];
                var ckeys = this.getAttribute('label-area').split('|')[1];
                if (vkeys == key && palce == ckeys) {
                    $e(this).addClass('select');
                };
            });
        }

        //自定义事件
        if (tools.hasAttr(obj, 'clicks')) {
            var clickAction = obj.getAttribute('clicks');
            if (clickAction) {
                eval(clickAction);
            };
        }

        //图片补全
        if (typeof $e.lazy === 'function') {
            $e(objs).nonePic();
        }

        //外部接口调用
        interfaceActive();
    };

    //切换外部事件接口
    var interfaceActive = function () {
        //iScroll刷新
        if ($e.iscroll) {
            $e.iscroll.refresh();
        }

        //自定义滚动条
        //if (typeof (customScroll) == 'function') {
        //customScroll.run('scroll-box');
        //}
    };

    return this;
}();

cutTable();