/* eslint-disable no-unused-vars */
<template>
  <div class="home">
    <nav class="navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">样本预处理</a>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-3 col-md-2 menu-left">
          <ul id="handle_tree" class="ztree"></ul>
        </div>
        <div class="col-xs-6 col-md-8">
          <div class="layout-center">
            <div id="work_panel" class="work_panel">
              <!-- controls -->
              <div class="controls">
                <i class="fa fa-home selected-mode" reset title="适应画布"></i>
                <i class="fa fa-search" realsize title="实际尺寸"></i>
                <i class="fa fa-search-plus" mode="up" title="放大"></i>
                <i class="fa fa-search-minus" mode="down" title="缩小"></i>
                <i class="fa fa-arrows" mode="pan" title="移动"></i>
                <i class="fa fa-pencil" mode="select" title="编辑选择"></i>
              </div>
              <!-- miniview -->
              <div class="miniview"></div>
            </div>
            <el-button
              class="el-button el-button--primary submit"
              type="primary"
              >提交</el-button
            >
            <div id="guide-h" class="guide"></div>
            <div id="guide-v" class="guide"></div>
          </div>
        </div>
        <div class="col-xs-3 col-md-2">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active">
              <a href="#tab1" aria-controls="tab1" role="tab" data-toggle="tab"
                >参数设置</a
              >
            </li>
            <!-- <li role="presentation">
              <a href="#tab2" aria-controls="tab2" role="tab" data-toggle="tab"
                >执行调试</a
              >
            </!-->
          </ul>
          <!-- Tab panes -->
          <div id="app" class="tab-content">
            <!-- <div role="tabpanel" class="tab-pane active" id="tab1">
              <p>采样个数</p>
              <p><span class="help-block inline ml5">与采样比例二选一</span></p>
              <p><input type="text" placeholder="" /></p>
              <p>采样比例</p>
              <p>
                <span class="help-block inline ml5"
                  >范围(0,1) 与采样个数二选一</span
                >
              </p>
              <p><input type="text" placeholder="" /></p>
              <p>
                <label><input type="checkbox" />放回采样</label>
              </p>
            </div> -->
            <!-- <div role="tabpanel" class="tab-pane" id="tab2">2</div> -->
            <el-form :inline="true">
              <div v-for="(item, index) in colData" :key="index">
                <el-form-item :label="item.label">
                  <el-input
                    v-if="item.bx_col_type === 'string'"
                    v-model="item.value"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
              <el-button
                @click="save"
                class="save"
                v-if="colData.length > 0"
                type="primary"
                >保存</el-button
              >
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!--节点html模板-->
    <!-- <div id="node_template" style="display:none;">
      <div
        align="center"
        id="${nodeId}"
        name="${name}"
        class="pane-node-content"
        style="position:absolute;"
      >
        <span class="iconfont ${icon}">x</span>
        <span>${text}</span>
        <span class="status ico-warning-o"></span>
      </div>
  </div> -->
    <div id="node_template" style="display:none;">
      <div
        align="center"
        id="${nodeId}"
        name="${name}"
        class="pane-node-content"
        style="position:absolute;display: flex;"
      >
        <div class="left"><span class="iconfont ${icon}" >x</span></div>
        <div class="right">
          <span>${text}</span> <span class="status ico-warning-o"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import $ from 'jquery'
var mainData = [
  {
    comp_no: 'work_start',
    instance_no: 'node1',
    title: '存储过程1',
    x_pos: 80,
    y_pos: 20,
    in_instance_no: [], // 被xxx连接
    form: {
      srv: {
        add_srv: 'srvzhsq_dept_add',
        update_srv: 'srvzhsq_dept_update'
      },
      // col 使用通用v2查询
      data: {
        name: 'yyy'
      }
    }
  },
  {
    comp_no: 'work_task',
    instance_no: 'node2',
    title: '存储过程2',
    x_pos: 80,
    y_pos: 100,
    in_instance_no: ['node1'], // 被xxx连接
    form: {
      srv: {
        add_srv: 'srvzhsq_information_add',
        update_srv: 'srvzhsq_information_update'
      },
      // col 使用通用v2查询
      data: {
        name: 'yyy'
      }
    }
  }
]
export default {
  name: 'home',
  components: {},
  data () {
    return {
      a: 1,
      procInstNo: '20190726094131429100',
      colOriData: [],
      colData: [],
      currentId: '',
      currentNode: null
    }
  },
  methods: {
    onNavigate (eventType, procInstanceNo) {
      this.$router.push({
        name: 'procdetail',
        params: { proc_instance_no: procInstanceNo }
      })
      window.location.reload(true)
    },
    save () {
      console.log('currentId', this.currentId)
      let colObj = {}
      this.colData.forEach(cols => {
        colObj[cols.columns] = cols.value
      })
      mainData.forEach(curr => {
        if (this.currentId === curr.instance_no) {
          curr.form.data = colObj
          console.log('save:----', curr)
        }
      })
    },
    getCol (serviceName, type, id) {
      this.currentId = id
      let self = this
      let cond = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'service_name',
            ruleType: 'eq',
            value: serviceName
          },
          {
            colName: 'use_type',
            ruleType: 'eq',
            value: type
          }
        ]
      }
      this.axios
        .post(
          'http://39.98.203.134:8081/sqfw/select/srvsys_service_columnex_v2_select?colsel_v2=' +
            serviceName,
          cond
        )
        .then(res => {
          let colOriData = res.data.data.srv_cols
          this.colOriData = colOriData.filter(item => {
            // return item["in_add"] === 1;
            return item['in_' + type] === 1
          })
          self.colOriData.forEach(ori => {
            ori['value'] = ''
          })
          self.colData = self.deepCopy(self.colOriData)
          console.log(
            'this.colData',
            self.colData,
            'this.colOriData',
            self.colOriData
          )
        })
    },
    /**
     * 深拷贝
     * @param {*} obj 拷贝对象(object or array)
     * @param {*} cache 缓存数组
     */
    deepCopy (obj, cache = []) {
      let self = this
      // typeof [] => 'object'
      // typeof {} => 'object'
      if (obj === null || typeof obj !== 'object') {
        return obj
      }
      // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
      /**
       * 类似下面这种
       * var a = {b:1}
       * a.c = a
       * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
       */
      const hit = cache.filter(c => c.original === obj)[0]
      if (hit) {
        return hit.copy
      }

      const copy = Array.isArray(obj) ? [] : {}
      // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
      cache.push({
        original: obj,
        copy
      })
      Object.keys(obj).forEach(key => {
        copy[key] = self.deepCopy(obj[key], cache)
      })

      return copy
    },
    addNode () {},
    addPorts () {},
    // 容器上的元素的鼠标点击事件
    draggableMouseDown (event) {
      // 鼠标按下
      if (event.button !== 0) {
        return false
      }
      let currentId = event.currentTarget.id
      console.log('onMouseDown', event, currentId)
      mainData.forEach(downonly => {
        if (downonly.instance_no === currentId) {
          // currNode = downonly
          this.currentNode = downonly
          console.log('当前按下元素:', downonly)
        // window.getCol(downonly.form.srv.add_srv, 'add')
        }
        window.ref_node_elm_source = this
        draggable.addRefNode()
        draggable.start(event)
      })
    },
    draggableDoubleClick (event) {
      // 鼠标双击事件
      if (event.button !== 0) {
        return false
      }
      console.log('双击', this.currNode)
      window.getCol(this.currNode.form.srv.add_srv, 'add', this.currNode.instance_no)
    },
    iconMouseDown (event) {
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
    },
    /** 鼠标移动事件 **/
    mouseMove (event) {
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
    }

  },
  mounted () {
    window.getCol = this.getCol
    setTimeout(() => {
      let addNode = window.addJsplumbNode
      let addPorts = window.addJsplumbPort
      // window.getCol("srvzhsq_dept_add",'add')
      mainData.forEach(item => {
        let positionObj = {
          x: item.x_pos,
          y: item.y_pos
        }
        let nodes = addNode(item.instance_no, item.title, positionObj)
        console.log('nodes==' + item.instance_no, nodes)
        addPorts(nodes, ['out'])
      })
      let instance = window.jsp
      console.log('instance=====', window)
      for (let i = 0; i < mainData.length; i++) {
        for (let j = 0; j < mainData[i].in_instance_no.length; j++) {
          if (mainData[i].in_instance_no[j].length > 0) {
            instance.connect({
              uuids: [
                `${mainData[i].in_instance_no[j]}-out`,
                `${mainData[i].instance_no}-out`
              ],
              editable: true
            })
          }
        }
      }

      // console.log('instance-----end----', instance, instance.getContainer(), window)
      // for (let i = 0; i < mainData.length; i++) {

      // }
      // console.log("window", sourceEndpoint)
    }, 0)
  }
}

var MIN_DISTANCE = 8 // 捕获的最小距离

var zoom = 1

var guides = [] // 没有可用的引导

var innerOffsetX, innerOffsetY
/* eslint-disable */
var elmOffsetX, elmOffsetY, absOffsetX, absOffsetY

var elm_pos = null

var canvasOffsetX, canvasOffsetY

var draggable = {
  _this: null,

  addRefNode: function () {
    var copy_node = $(
      '<div align="center" id="node1" class="pane-node-copy" style="position: absolute;display:none;"><span>&nbsp;</span></div>'
    )
    copy_node.css({
      left: util.getPos(window.ref_node_elm_source).position().left,
      top: util.getPos(window.ref_node_elm_source).position().top
    })

    window.$jsPlumbCanvas.append(copy_node)

    draggable._this = window.ref_node_elm = copy_node[0]
  },

  start: function (event) {
    zoom = window.renderer.getZoom()

    if (zoom > 1.2) {
      MIN_DISTANCE = 2
    } else {
      MIN_DISTANCE = 8
    }

    var t = window.ref_node_elm_source

    guides = $.map(
      $('.draggable') /* .not([this._this]) */,
      computeGuidesForElement
    )

    elmOffsetX = event.clientX - util.getPos(t).offset().left

    elmOffsetY = event.clientY - util.getPos(t).offset().top

    // 包含canvasOffset
    innerOffsetX =
      util.getPos(t).offset().left - util.getPos(t).position().left
    // 包含canvasOffset
    innerOffsetY = util.getPos(t).offset().top - util.getPos(t).position().top

    canvasOffsetX = util.getPos(window.$jsPlumbCanvas).position().left

    canvasOffsetY = util.getPos(window.$jsPlumbCanvas).position().top

    absOffsetX = util.getPos(window.$jsPlumbCanvas).offset().left

    absOffsetY = util.getPos(window.$jsPlumbCanvas).offset().top
  },

  /**

     * 参数说明

     * @param event

     * @param ui

     *

     *  event事件的

     * offsetX：

     * outerwidth： 属性是一个只读的整数，声明了整个窗口的宽度。

     *  outerheight： 属性是一个只读的整数，声明了整个窗口的高度。

     */

  drag: function (event) {
    $(draggable._this).show()

    // 迭代所有的guids，记住最近的h和v guids

    // var guideV
    // var guideH
    // var distV = MIN_DISTANCE + 1
    // var distH = MIN_DISTANCE + 1
    // var offsetV
    // var offsetH

    var chosenGuides = {
      top: {
        dist: MIN_DISTANCE + 1
      },
      left: {
        dist: MIN_DISTANCE + 1
      }
    }

    var $t = $(this._this)

    // pageX、pageY：文档坐标x、y ;

    // eslint-disable-next-line camelcase
    var pos = (elm_pos = {
      top: event.pageY - innerOffsetY - elmOffsetY,
      left: event.pageX - innerOffsetX - elmOffsetX
    })

    // outerHeight、outerWidth：整个浏览器的高度、宽度

    var w = $t.outerWidth() - 1

    var h = $t.outerHeight() - 1

    var pos_abs = {
      top: event.pageY - elmOffsetY,
      left: event.pageX - elmOffsetX
    }

    var elemGuides = computeGuidesForElement(null, pos, w, h)

    $.each(guides, function (i, guide) {
      $.each(elemGuides, function (i, elemGuide) {
        if (guide.type == elemGuide.type) {
          var prop = guide.type == 'h' ? 'top' : 'left'

          var d = Math.abs(elemGuide[prop] - guide[prop])

          if (d < chosenGuides[prop].dist) {
            chosenGuides[prop].dist = d

            chosenGuides[prop].offset = elemGuide[prop] - pos[prop]

            chosenGuides[prop].guide = guide
          }
        }
      })
    })

    if (chosenGuides.top.dist <= MIN_DISTANCE) {
      var ref_top = chosenGuides.top.guide.top - chosenGuides.top.offset

      $(this._this).css({
        top: ref_top
      })

      elm_pos.top = ref_top

      var guide_elm = chosenGuides.top.guide.owner
      var cur_elm = this._this
      var width =
        Math.abs(
          util.getPos(guide_elm).position().left -
            util.getPos(cur_elm).position().left
        ) + w
      var guide_left = util.getPos(guide_elm).position().left
      var cur_left = util.getPos(cur_elm).position().left
      var abs_left = guide_left < cur_left ? guide_left : cur_left
      $('#guide-h')
        .css({
          top: chosenGuides.top.guide.top,
          width: width,
          left: abs_left
        })
        .show()
    } else {
      $('#guide-h').hide()

      $(this._this).css({
        top: pos.top
      })
    }

    if (chosenGuides.left.dist <= MIN_DISTANCE) {
      var ref_left = chosenGuides.left.guide.left - chosenGuides.left.offset
      $(this._this).css({
        left: ref_left
      })

      elm_pos.left = ref_left

      var guide_elm = chosenGuides.left.guide.owner
      var cur_elm = this._this
      var height =
        Math.abs(
          util.getPos(guide_elm).position().top -
            util.getPos(cur_elm).position().top
        ) + h
      var guide_top = util.getPos(guide_elm).position().top
      var cur_top = util.getPos(cur_elm).position().top
      var abs_top = guide_top < cur_top ? guide_top : cur_top
      $('#guide-v')
        .css({
          left: chosenGuides.left.guide.left,
          height: height,
          top: abs_top
        })
        .show()
    } else {
      $('#guide-v').hide()

      $(this._this).css({
        left: pos.left
      })
    }
  },

  stop: function (event) {
    $('#guide-v, #guide-h').hide()

    if (!window.ref_node_elm_source || !elm_pos) return

    window.jsp.animate(window.ref_node_elm_source, {
      left: elm_pos.left,
      top: elm_pos.top
    })
    $('.jtk-miniview-canvas')
      .find(
        'div[jtk-node-id="' +
          window.ref_node_elm_source.getAttribute('id') +
          '"]'
      )
      .css({
        left: elm_pos.left,
        top: elm_pos.top
      })
    console.log(window.renderer.getMiniview())
    console.log(window.renderer.getMiniview().getToolkit())
    console.log(window.renderer.getPan())
    console.log(window.renderer.getViewportCenter())
    elm_pos = null
  }
}

// $(".draggable").draggable(draggable_param)

function computeGuidesForElement (elem, pos, w, h) {
  if (elem != null) {
    var $t = $(elem)

    // offset:返回当前元素 的偏移量

    pos = util.getPos($t).position()

    w = $t.outerWidth() - 1

    h = $t.outerHeight() - 1
  }
  /* console.log((elem ? elem.id : '') + '--->' + pos.left)
    console.log((elem ? 'jsabs-->' + util.getPos($t).offset().left : '--'))
    console.log((elem ? 'jqabs-->' + $t.offset().left : '--'))
    console.log((elem ? 'jsposition-->' + elem.offsetLeft : '--'))
    console.log((elem ? 'jqposition-->' + $t.position().left : '--'))

    console.log((elem ? elem.id : '') + 'w--->' + w) */

  /*   pos.left *= zoom;
       pos.top *= zoom;
       w *= zoom;
       h *= zoom; */

  return [
    {
      type: 'h',
      left: pos.left,
      top: pos.top,
      owner: elem
    }, // 垂直方向左下对齐线

    {
      type: 'h',
      left: pos.left,
      top: pos.top + h,
      owner: elem
    },

    {
      type: 'v',
      left: pos.left,
      top: pos.top,
      owner: elem
    },

    {
      type: 'v',
      left: pos.left + w,
      top: pos.top,
      owner: elem
    },

    // 您可以添加_any_其他指南在这里就好了（如指南10像素单元的左）

    {
      type: 'h',
      left: pos.left,
      top: pos.top + h / 2,
      owner: elem
    },

    {
      type: 'v',
      left: pos.left + w / 2,
      top: pos.top,
      owner: elem
    }
  ]
}

$(function () {
  var h = $(window).height() - $('.navbar-inverse').height()
  $('.menu-left,.layout-center,.work_panel,.menu-right').height(h)
  $('.submit').click(() => {
    console.log(mainData)
    // let parentMin = true
    // let childMin = true
    // debugger

    // for (let i = 0; i < zNodes.length; i++) {
    //   let parentMinNums = zNodes[i].limit_comp
    //   let childAppear = []
    //   for (let j = 0; j < zNodes[i].children.length; j++) {
    //     let a = 0
    //     for (let k = 0; k < mainData.length; k++) {
    //       if (zNodes[i].children[j].comp_no === mainData[k].comp_no) {
    //         a++
    //         if (a < zNodes[i].children[j].amount_limit) {
    //           childMin = false
    //           alert(zNodes[i].children[j].name + '节点不得少于' + zNodes[i].children[j].amount_limit + '个')
    //         }
    //       }
    //     }
    //     childAppear.push(a)
    //     // 链接数量限制
    //   }
    //   console.log('childAppear', childAppear)
    // }
    // for (let b = 0; b < array.length; b++) {
    //   const element = array[b];

    // }
    // console.log(zNodes)
  })
})

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

    // draggable.addRefNode()

    // draggable.start(event)
  })
  $(document).on('mousedown', '.ico-click', function (event) {
    event.stopPropagation()
    console.log('this',$(this).parent().parent())
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
        // alert("位置有效")
        core.$tree_node_dragging_elm.remove()
        core.$tree_node_dragging_elm = null

        // 做添加时的判断

        console.log('currtAdd', currtAdd)
        // let minDataNum = currtAdd.limit_comp
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
            core.$tree_node_elm_source.find('.node_name').text(),
            {
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
        // alert("位置无效")
        // 重新归置源节点所处的位置,并且删除消失
        core.$tree_node_dragging_elm.animate(
          {
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
</script>
