// 添加右键菜单
// type
//  1 : 画布
//  2 : 组件
//  3 : 连接线
/* eslint-disable */
var addMenu = function (type, obj) {
  var param_array = []
  var idx = 0

  if (type == 2) {
    param_array[idx++] = {
      text: '<i class="ico-rename"></i>重命名',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      text: '<i class="ico-delete"></i>删除<span class="item-access-key">Delete</span>',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      text: '<i class="ico-copy-node"></i>复制',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      divider: true
    }
    param_array[idx++] = {
      text: '<i class="ico-run-from"></i>从此处开始执行',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      text: '<i class="ico-run-stop"></i>执行到此处',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      text: '<i class="ico-run-node"></i>执行该节点',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      divider: true
    }
    param_array[idx++] = {
      text: '<i class="ico-visible-l"></i>查看数据',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      text: '<i class="ico-analysis"></i>查看日志',
      action: function (e) {
        e.preventDefault()
      }
    }
  } else if (type == 3) {
    param_array[idx++] = {
      text: '<i class="ico-delete"></i>删除<span class="item-access-key">Delete</span>',
      action: function (e) {
        e.preventDefault()
      }
    }
  } else if (type == 1) {
    param_array[idx++] = {
      text: '<i class="ico-download"></i>粘贴节点',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      text: '<i class="ico-undo"></i>撤销删除的节点',
      action: function (e) {
        e.preventDefault()
      }
    }
    param_array[idx++] = {
      divider: true
    }
    param_array[idx++] = {
      text: '<i class="ico-save"></i>暂存',
      action: function (e) {
        e.preventDefault()
      }
    }
  }

  context.attach(obj, param_array)
}
