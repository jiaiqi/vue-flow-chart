/* eslint-disable */
var treeObj
var ztree_root_id = -1
var treeId = 'handle_tree'

var setting = {
  edit: {
    enable: false, // 设置 zTree 是否处于编辑状态
    showRenameBtn: false, // 设置是否显示编辑名称按钮
    showRemoveBtn: false // 设置是否显示删除按钮
  },
  data: {
    simpleData: {
      enable: true // 确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
    }
  },
  callback: {
    beforeClick: zTreeBeforeClick, // 用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作
    onClick: zTreeOnDrap
  },
  view: {
    showLine: false, // 设置 zTree 是否显示节点之间的连线
    showTitle: true, // 设置 zTree 是否显示节点的 title 提示信息(即节点 DOM 的 title 属性)
    showIcon: true, // 设置 zTree 是否显示节点的图标
    selectedMulti: false, // 设置是否允许同时选中多个节点
    addDiyDom: addDiyDom // 用于在节点上固定显示用户自定义控件
  }
}

var zNodes = [{
  // id: '0',
  // name: "数据预处理",
  open: true,
  ico: 'ico-folder-open',
  name: '作业',
  type: 'work',
  limit_comp: 2, // 该类必须最少得有俩节点，数字
  children: [
    {
      comp_no: 'work_start',
      name: '开始',
      is_unique: true, // 该节点必须有且只有一个
      amount_limit: 1, // 数字类型
      in_comp: [],
      form_srv: {
        add_srv: 'srvetl_start_add',
        update_srv: 'srvetl_start_update'
      },
      ico: 'ico-click'
    },
    {
      comp_no: 'work_task',
      name: '任务',
      is_unique: false,
      amount_limit: 1, // 最小数量
      in_comp: ['work_start'], // 允许输入节点编号
      form_srv: {
        add_srv: 'srvetl_task_add',
        update_srv: 'srvetl_task_update'
      },
      ico: 'ico-click'
    }
  ]
},
{
  open: true,
  ico: 'ico-folder-open',
  name: '输入',
  type: 'input',
  limit_comp: 1, // 该类必须最少得有俩节点，数字
  children: [{
    comp_no: 'input_db',
    name: '数据库',
    is_unique: false, // 该节点必须有且只有一个
    amount_limit: 0, // 数字类型
    in_comp: ['work_task'],
    form_srv: {
      add_srv: 'srvetl_in_db_add',
      update_srv: 'srvetl_in_db_update'
    },
    ico: 'ico-click'
  },
  {
    comp_no: 'input_ftp',
    name: 'FTP服务',
    is_unique: false,
    amount_limit: 0, // 最小数量
    in_comp: ['work_task'], // 允许输入节点编号
    form_srv: {
      add_srv: 'srvetl_ftp_add',
      update_srv: 'srvetl_ftp_update'
    },
    ico: 'ico-click'
  }
  ]
},
{
  open: true,
  ico: 'ico-folder-open',
  name: '处理',
  type: 'handle',
  limit_comp: 0, // 该类必须最少得有俩节点，数字
  children: [{
    comp_no: 'handle_filter',
    name: '过滤',
    is_unique: false, // 该节点必须有且只有一个
    amount_limit: 0, // 数字类型
    in_comp: ['input_db', 'handle_filter', 'handle_convert'],
    form_srv: {
      add_srv: 'srvetl_filter_add',
      update_srv: 'srvetl_filter_update'
    },
    ico: 'ico-click'
  },
  {
    comp_no: 'handle_convert',
    name: '转化',
    is_unique: false,
    amount_limit: 0, // 最小数量
    in_comp: ['input_db', 'handle_filter', 'handle_convert'], // 允许输入节点编号
    form_srv: {
      add_srv: 'srvetl_convert_add',
      update_srv: 'srvetl_convert_update'
    },
    ico: 'ico-click'
  }
  ]
},
{
  open: true,
  ico: 'ico-folder-open',
  name: '输出',
  type: 'output',
  limit_comp: 1, // 该类必须最少得有俩节点，数字
  children: [{
    comp_no: 'output_db',
    name: '数据库',
    is_unique: false, // 该节点必须有且只有一个
    amount_limit: 0, // 数字类型
    in_comp: ['input_db', 'handle_filter', 'handle_convert'],
    form_srv: {
      add_srv: 'srvetl_out_db_add',
      update_srv: 'srvetl_out_db_update'
    },
    ico: 'ico-click'
  },
  {
    comp_no: 'handle_file',
    name: '文件',
    is_unique: false,
    amount_limit: 0, // 最小数量
    in_comp: ['input_db', 'handle_filter', 'handle_convert'], // 允许输入节点编号
    form_srv: {
      add_srv: 'srvetl_file_add',
      update_srv: 'srvetl_file_update'
    },
    ico: 'ico-click'
  }
  ]
}
]

$(document).ready(function () {
  treeObj = $.fn.zTree.init($('#' + treeId), setting, zNodes)
  console.log(zNodes)
})

function addDiyDom (treeId, treeNode) {
  debugger
  console.log('treeNode', treeNode)
  // var aObj = $("#" + treeNode.comp_no + "_a");
  // if ($("#diySpan_" + treeNode.comp_no).length > 0) return;
  // var editStr = "<span id='diySpan_" + treeNode.comp_no + "' class='ztree-node-icon " + treeNode.ico + "'> </span>";
  // aObj.prepend(editStr);
};

/** 规避删除冒泡 **/
function zTreeBeforeClick (treeId, treeNode, clickFlag) {
  if (!treeNode) return false
}

/** 点击节点回调 **/
function zTreeOnDrap (event, treeId, treeNode) {
  DomClick(event, treeId, treeNode)
  console.log('event', event)
}

/** 节点被折叠 **/
function zTreeOnCollapse (event, treeId, treeNode) {

}

/** 节点被展开 **/
function zTreeOnExpand (event, treeId, treeNode) {

}

/** 添加绑定成功标识 **/
function addIcon (treeNode) {
  var aObj = $('#' + treeNode.tId + '_a')
  if ($('#sucIcon_' + treeNode.id).length > 0) return
  var iconStr = "<span type='button' class='suc-icon mybtn' id='sucIcon_" + treeNode.id + "' ></span>"
  aObj.append(iconStr)
}

/** 移除成功标志 **/
function removeIcon (treeNode) {
  $('#sucIcon_' + treeNode.id).remove()
}

/** 添加编辑按钮 **/
function addEidtBtn (treeId, treeNode) {
  var aObj = $('#' + treeNode.comp_no + '_a')
  if ($('#editBtn_' + treeNode.id).length > 0) return
  var editStr = "<span type='button' class='button edit mybtn' id='editBtn_" + treeNode.id + "' title='编辑' ></span>"
  aObj.append(editStr)
  var btn = $('#editBtn_' + treeNode.id)
  if (btn) {
    btn.bind('click', function () {
      core.initBlock(treeNode.block_html_id)
    })
  }
}

/** 添加删除按钮 **/
function addDelBtn (treeId, treeNode) {
  var aObj = $('#' + treeNode.tId + '_a')
  if ($('#delBtn_' + treeNode.id).length > 0) return
  var detStr = "<span type='button' class='button remove mybtn' id='delBtn_" + treeNode.id + "' title='删除区块' ></span>"
  aObj.append(detStr)
  var btn = $('#delBtn_' + treeNode.id)
  if (btn) {
    btn.bind('click', function () {
      var block_id = treeNode.block_html_id
      core.deleteBlock(block_id)
    })
  }
}

var ztree_helper = {
  loaded: function (fun) {
    var t
    if (!treeObj) {
      t = setTimeout(function () {
        ztree_helper.loaded(fun)
      }, 100)
    } else {
      clearTimeout(t)
      fun()
    }
  }
}
