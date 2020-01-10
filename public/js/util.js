//工具模块
var util = {browserScrollWidth: null};

function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1;//不是ie浏览器
    }
}

util.isIE = IEVersion() == -1 ? false : true;

//loading
/*var d = dialog({
    width: 60,
    height: 60
});*/
var isShow = false;
//展示loading
util.showLoading = function () {
    if (!isShow) {
        d.showModal();
        isShow = true;
    }
}

//隐藏loading
util.closeLoading = function (fun) {
    setTimeout(function () {
        d.close();
        isShow = false;
        if (fun) fun();
    }, 1000);
}

//确认提示框
util.confirm = function (content, fun) {
    var d = dialog({
        title: '消息',
        width: 200,
        content: content,
        okValue: '确 定',
        ok: function () {
            if (fun) fun();
            this.close();
            return false;
        },
        cancelValue: '取消',
        cancel: function () {
        }
    });

    d.show();
}

//提示
util.alert = function (content, fun) {
    var d = dialog({
        title: '提示',
        width: 200,
        content: content,
        okValue: '确定',
        ok: function () {
            if (fun) fun();
            d.close();
            return false;
        }
    });
    d.show();
}

//警告信息提示
util.warningTip = function (msg) {
    var d = dialog({
        content: msg,
        skin: 'tip-dialog tip-warning',
        tipClassName: 'ui-tip'
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 4000);

}
//成功信息提示
util.sucTip = function (msg) {
    var d = dialog({
        content: msg,
        skin: 'tip-dialog tip-success',
        tipClassName: 'ui-tip'
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 4000);

}

//气泡提示
//var follow_d = dialog();
var tm = null;
util.showFollowDialog = function (obj, msg, align) {
    clearTimeout(tm);
    align = align ? align : 'top';
    follow_d.content(msg);
    follow_d.align = align;
    var obj, $follow_d;
    if (obj instanceof Object) {
        obj = obj;
    } else {
        obj = document.getElementById(obj)
    }
    $follow_d = $(follow_d.node);
    $follow_d.addClass('follow-dialog');
    follow_d.show(obj);
    var old_top = $follow_d.offset().top;
    $(follow_d.node).animate({top: old_top - 6},100);
}

util.hideFollowDialog = function () {
    clearTimeout(tm);
    tm = setTimeout(function () {
        follow_d.close();
    }, 200);
}

//计算当前浏览器滚动条宽度
util.scrollWidth = function () {
    if (this.browserScrollWidth) {
        return this.browserScrollWidth;
    }
    var odiv = document.createElement('div'),//创建一个div
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'//让他有滚动条
        }, i, scrollbarWidth;
    for (i in styles) odiv.style[i] = styles[i];
    document.body.appendChild(odiv);//把div添加到body中
    scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
    document.body.removeChild(odiv);//移除创建的div
    return scrollbarWidth;//返回滚动条宽度
}


//获取元素位置（js原生方法）
util.getPos = function (obj) {

    if (obj instanceof jQuery) {
        obj = obj[0];
    }

    var ret = {}

    ret.position = function () {
        return {left: obj.offsetLeft, top: obj.offsetTop}
    }

    ret.offset = function () {
        var pos = {};
        pos.left = obj.offsetLeft;
        pos.top = obj.offsetTop;
        while (obj = obj.offsetParent) {
            pos.left += obj.offsetLeft;
            pos.top += obj.offsetTop;
        }
        return pos;
    }

    return ret;
};

