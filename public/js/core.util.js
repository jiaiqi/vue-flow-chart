var core = {}

core.relative_w = 75
core.relative_h = 14
core.$tree_node_elm_source = null // 点击后树节点源元素
core.$tree_node_dragging_elm = null // 点击后树节点拖拽元素
core.work_panel_scope = {
  x1: 0,
  x2: 0,
  y1: 0,
  y2: 0
} // 容器面板角定位
/** 鼠标放开所在范围是否有效 **/
core.checkDropScope = function (event) {
  if (
    event.clientX > core.work_panel_scope.x1 &&
    event.clientX < core.work_panel_scope.x2 &&
    event.clientY > core.work_panel_scope.y1 &&
    event.clientY < core.work_panel_scope.y2
  ) {
    return true
  }
  return false
}

// 辅助对齐 - 动态创建的对齐参照
window.ref_node_elm = null
// 辅助对齐 - 源算法组件
window.ref_node_elm_source = null

$(function () {
  var childCompNo = null // child的comp_no
  let currtAdd = null // 当前拖动parent 的数据
  $('.ztree a').hover(
    function (event) {
      if (
        $(this)
          .parent('li')
          .has('ul')[0]
      ) {
        return false
      }
      $(this).addClass('ztree-node-a-hover')
      return false
    },
    function (event) {
      $(this).removeClass('ztree-node-a-hover')
      return false
    }
  )

  /** 树节点上鼠标点击事件 **/
  $('.ztree a').bind('mousedown', function (event, treeId, treeNode) {
    if (
      $(this)
        .parent('li')
        .has('ul')[0]
    ) {
      return false
    }
    // let domDataTitle = $(this).children('node_name').context.innerText
    let domParentDataTitle = $(this)
      .parent()
      .parent()
      .prev()['0'].innerText
    let domChildDataTitle = $(this).children('node_name').context.innerText
    mainData
    let domData = {}
    console.log('treeNode', domParentDataTitle, domChildDataTitle)
    zNodes.forEach(item => {
      if (domParentDataTitle === item.name) {
        item.children.forEach(child => {
          if (domChildDataTitle === child.name) {
            childCompNo = child.comp_no
            currtAdd = child
          }
        })
      }
    })
    console.log(domData)
    // 拖拽模板的生成
    var template = $('#node_template').html()
    console.log('template', template)
    template = template
      .replace(/\$\{nodeId\}/g, 'tempnode11')
      .replace(/\$\{icon\}/g, 'ico-click')
    template = template.replace(
      /\$\{text\}/g,
      $(this)
        .find('.node_name')
        .text()
    )

    var nd = $(template)
    console.log(nd)
    nd.css({
      left: event.clientX - core.relative_w,
      top: event.clientY - core.relative_h
    })
    $('body').append(nd)
    core.$tree_node_dragging_elm = nd // 鼠标点击创建树节点拖拽元素
    core.$tree_node_elm_source = $(event.target).parent() /// /鼠标点击创建树节点源元素

    // 容器面板左上角、右下角
    core.work_panel_scope.x1 = $('#work_panel').offset().left
    core.work_panel_scope.x2 =
      $('#work_panel').offset().left + $('#work_panel').width()
    core.work_panel_scope.y1 = $('#work_panel').offset().top
    core.work_panel_scope.y2 =
      $('#work_panel').offset().top + $('#work_panel').height()
  })

  /** 容器上的元素鼠标点击事件 **/
  var currNode = null
  var clickTimeId = null
  $(document).on('mousedown', '.draggable', function (event) {
    clearTimeout(clickTimeId)
    // 执行延时
    if (event.button != 0) {
      return false
    }
    let currentId = event.currentTarget.id

    console.log('按下event', event, currentId)
    mainData.forEach(downonly => {
      if (downonly.instance_no === currentId) {
        currNode = downonly
        console.log('当前按下元素:', currNode)
        // window.getCol(downonly.form.srv.add_srv, 'add')
      }
    })
    // let a = window.getAllConnections()
    // console.log('a----', window.jsp.remove('node1'))
    window.ref_node_elm_source = this

    draggable.addRefNode()

    draggable.start(event)
  })
  $(document).on('dblclick', '.draggable', function (event) {
    if (event.button != 0) {
      return false
    }
    // let currentId = event.currentTarget.id;

    console.log('双击', currNode)
    // mainData.forEach(downonly => {
    //   if (downonly.instance_no === currentId) {
    //     console.log('当前按下元素:', downonly, window)
    window.getCol(currNode.form.srv.add_srv, 'add', currNode.instance_no)

    //   }
    // })
    // let a = window.getAllConnections()
    // console.log('a----', window.jsp.remove('node1'))
    // window.ref_node_elm_source = this;

    // draggable.addRefNode();

    // draggable.start(event);
  })
  $(document).on('mousedown', '.ico-click', function (event) {
    event.stopPropagation()
    let currtId = $(this)
      .parent()
      .parent()['0'].id
    if (window.confirm('确认删除吗？')) {
      window.jsp.remove(currtId)
      for (let j = 0; j < mainData.length; j++) {
        if (mainData[j].instance_no === currtId) {
          mainData.splice(j, 1)
          if (mainData[j].in_instance_no.length > 0) {
            for (let k = 0; k < mainData[j].in_instance_no.length; k++) {
              if (mainData[j].in_instance_no[k] === currtId) {
                mainData[j].in_instance_no.splice(k, 1)
                console.log(mainData)
              }
            }
          }
        }
      }
    }
  })
  /** 鼠标移动事件 **/
  $(document).mousemove(function (event) {
    if (window.ref_node_elm) {
      // 所在范围内拖动移动鼠标
      var ui = {
        position: {}
      }
      ui.position.top = $(window.ref_node_elm).position().top
      ui.position.left = $(window.ref_node_elm).position().left
      draggable.drag(event, ui)
    } else if (core.$tree_node_dragging_elm) {
      if (core.$tree_node_dragging_elm.is(':animated')) {
        return false
      }
      core.$tree_node_dragging_elm.css({
        left: event.clientX - core.relative_w,
        top: event.clientY - core.relative_h
      })
    }
  })

  /** 鼠标释放事件 **/
  $(document).mouseup(function (event) {
    if (window.ref_node_elm) {
      // 所在范围内拖动释放鼠标
      draggable.stop()
      $(window.ref_node_elm).remove()
      window.ref_node_elm = null
      window.ref_node_elm_source = null
    } else if (core.$tree_node_dragging_elm) {
      // 鼠标放开所在范围是否有效
      if (core.checkDropScope(event)) {
        // alert("位置有效");
        core.$tree_node_dragging_elm.remove()
        core.$tree_node_dragging_elm = null

        // 做添加时的判断

        console.log('currtAdd', currtAdd)
        let minDataNum = currtAdd.limit_comp
        let a = 0

        if (currtAdd.is_unique) {
          mainData.forEach(all => {
            if (all.comp_no === currtAdd.comp_no) {
              a++
              debugger
              alert('有且只有一个')
            }
          })
        }
        if (a === 0) {
          var x =
            event.pageX -
            $('.menu-left').width() -
            $('.jtk-surface-canvas').position().left -
            core.relative_w
          var y =
            event.pageY -
            $('.menu-left').offset().top -
            $('.jtk-surface-canvas').position().top -
            core.relative_h
          var uid = jsPlumbUtil.uuid().replace(/\-/g, '')
          var node = window.addJsplumbNode(
            uid,
            core.$tree_node_elm_source.find('.node_name').text(), {
              x: x,
              y: y
            }
          )
          let nodeObj = {
            comp_no: childCompNo,
            instance_no: uid,
            title: core.$tree_node_elm_source.find('.node_name').text(),
            x_pos: x,
            y_pos: y,
            in_instance_no: [],
            form: {
              srv: {
                add_srv: 'srvetl_start_add',
                update_srv: 'srvetl_start_update'
              },
              // col 使用通用v2查询
              data: {
                name: 'yyy'
              }
            }
          }
          mainData.push(nodeObj)
          console.log(1111)
          window.addJsplumbPort(node, ['out'])
        }

        console.log('mainData-------', mainData)
      } else {
        // alert("位置无效");
        // 重新归置源节点所处的位置,并且删除消失
        core.$tree_node_dragging_elm.animate({
          left: core.$tree_node_elm_source.offset().left,
          top: core.$tree_node_elm_source.offset().top
        },
        400,
        function () {
          core.$tree_node_dragging_elm.remove()
          core.$tree_node_dragging_elm = null
        }
        )
      }
    }
  })
})
