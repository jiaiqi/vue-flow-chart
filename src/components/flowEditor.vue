<template>
  <div class="col-xs-6 col-md-8 flow-editor">
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
      <el-button class="el-button el-button--primary submit" type="primary"
        >提交</el-button
      >
      <div id="guide-h" class="guide"></div>
      <div id="guide-v" class="guide"></div>
    </div>
  </div>
</template>

<script>
import { jsPlumb, jsPlumbToolkit } from 'jsplumb'
export default {
  // 中间编辑区域
  name: 'flowEditor',
  data () {
    return {

    }
  },
  methods: {
    initJsplumb () {
      /* eslint-disable */
      jsPlumb.ready(function () {
        var instance = (window.jsp = jsPlumb.getInstance({
          // default drag options
          DragOptions: {
            cursor: 'move',
            zIndex: 2000
          },
          // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
          // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
          ConnectionOverlays: [
            [
              'Arrow',
              {
                location: 1,
                visible: true,
                width: 11,
                length: 11,
                id: 'ARROW'
                // events: {
                //     click: function () {
                //         alert("you clicked on the arrow overlay");
                //     }
                // }
              }
            ]
          ],
          // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
          Connector: 'Flowchart',
          Anchors: [ 'Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
            'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
          ],
          //
          // 鼠标不能拖动删除线
          ConnectionsDetachable: true,
          // 删除线的时候节点不删除
          DeleteEndpointsOnDetach: false,
          Container: 'work_panel'
        }))

        /* var basicType = {
                connector: "StateMachine",
                paintStyle: {stroke: "red", strokeWidth: 4},
                hoverPaintStyle: {stroke: "blue"},
                overlays: [
                    "Arrow"
                ]
            };
      
            instance.registerConnectionType("basic", basicType); */

        // this is the paint style for the connecting lines..
        var connectorPaintStyle = {
          strokeWidth: 1,
          stroke: '#888'
          /*,
                                  joinstyle: "round",
                                  outlineStroke: "white",
                                  outlineWidth: 2 */
        }
        // .. and this is the hover style.
        var connectorHoverStyle = {
          strokeWidth: 4,
          stroke: '#999'
        }
        var endpointHoverStyle = {
          fill: '#999'
          /*,
                                  stroke: "#216477" */
        }
        // the definition of source endpoints (the small blue ones)
        var sourceEndpoint = {
          endpoint: 'Dot',
          paintStyle: {
            stroke: '#888',
            fill: '#fff',
            radius: 5,
            strokeWidth: 1
          },
          isSource: true,
          isTarget: true,
          anchor: 'AutoDefault',
          // connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
          cssClass: 'source-point',
          // connector: 'Flowchart',
          connectorStyle: connectorPaintStyle,
          hoverPaintStyle: endpointHoverStyle,
          hoverClass: 'source-point-hover-class',
          connectorHoverClass: 'connector-hover-class',
          connectorHoverStyle: connectorHoverStyle,
          dragOptions: {},
          maxConnections: -1,
          overlays: [
            [
              'Label',
              {
                location: [ 0.5, 1.5 ],
                label: 'Drag',
                cssClass: 'endpointSourceLabel',
                visible: false
              }
            ]
          ]
        }
        // the definition of target endpoints (will appear when the user drags a connection)
        var targetEndpoint = {
          endpoint: 'Dot',
          paintStyle: {
            stroke: '#888',
            fill: '#fff',
            radius: 5,
            strokeWidth: 1
          },
          /* hoverPaintStyle: endpointHoverStyle, */
          maxConnections: -1,
          // hoverClass: 'target-point-hover-class',
          cssClass: 'target-point',
          // connector: 'Flowchart',
          dropOptions: {
            hoverClass: 'in-hover',
            activeClass: 'in-hover'
          },
          isTarget: true,
          isSource: true,
          anchor: 'AutoDefault',
          overlays: [
            [
              'Label',
              {
                location: [ 0.5, -0.5 ],
                label: 'Drop',
                cssClass: 'endpointTargetLabel',
                visible: false
              }
            ]
          ],
          events: {
            // connected: function () {
            //     this.setStyle({
            //         'display': 'none'
            //     });
            //     this.setEnabled(false);
            // }
          },
          onMaxConnections: function (info) {
            // alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
          }
        }

        var addNode = (window.addJsplumbNode = function (nodeId, nodeLable, position) {
          var template = $('#node_template').html()
          template = template
            .replace(/\$\{nodeId\}/g, nodeId)
            .replace(/\$\{icon\}/g, 'ico-click')
          template = template.replace(/\$\{text\}/g, nodeLable)
          template = template.replace(/\$\{name\}/g, nodeLable)

          var nd = $(template)
          nd.addClass('draggable')
          nd.css({
            left: position.x,
            top: position.y
          })
          $(instance.getContainer()).append(nd)

          // addMenu(2, '#' + nodeId)

          instance.fire('jsPlumbDemoNodeAdded', nd[ 0 ])

          return $('#' + nodeId)[ 0 ]
        })

        var addPorts = (window.addJsplumbPort = function (node, ports, type) {
          // Assume horizental layout
          var number_of_ports = ports.length
          var i = 0
          var x_offset = 1 / (number_of_ports + 1)
          var x = 0

          for (; i < number_of_ports; i++) {
            var anchor = [ 0, 0, 0, 0 ]
            var paintStyle = {
              radius: 5,
              fill: '#fff',
              stroke: '#999'
            }
            var isSource = false
            var isTarget = false
            // if (type === 'output') {
            //     anchor[1] = 1;
            //     isSource = true;
            // } else {
            isTarget = true
            // }

            anchor[ 0 ] = x + x_offset
            x = anchor[ 0 ]

            var p = instance.addEndpoint(
              node,
              isSource ? sourceEndpoint : targetEndpoint, {
              anchor: anchor,
              uuid: node.getAttribute('id') + '-' + ports[ i ]
            }
            )
          }
        })

        // suspend drawing and initialise.
        instance.batch(function () {
          // var node1 = addNode('node1', '存储过程', {
          //     x: '80px',
          //     y: '20px'
          // });
          // var node2 = addNode('node2', 'SQL脚本', {
          //     x: '180px',
          //     y: '180px'
          // });

          // addPorts(node1, ['out1']);
          // addPorts(node2, ['in']);

          // var conn = instance.connect({
          //     uuids: ["node1-out2", "node2-in1"],
          //     editable: false
          // });

          // listen for new connections; initialise them the same way we initialise the connections at startup.
          instance.bind('connection', function (connInfo, originalEvent) {
            // console.log(connInfo.connection.getConnector().canvas)
            connInfo.targetEndpoint.fire('connected')
            var uid = jsPlumbUtil.uuid()
            $(connInfo.connection.getConnector().canvas)
              .find('path:first')
              .attr('id', uid)
            //   addMenu(3, '#' + uid)
          })

          // make all the window divs draggable
          // instance.draggable(jsPlumb.getSelector(".pane-node-content"));
          // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
          // method, or document.querySelectorAll:
          // jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

          // connect a few up
          // instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
          //

          //
          // listen for clicks on connections, and offer to delete connections on click.
          //
          // instance.bind("click", function (conn, originalEvent) {
          // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
          //   instance.detach(conn);
          //     conn.toggleType("basic");
          // });

          instance.bind('connectionDrag', function (connection) {
            $('.target-point')
              .not('.jtk-endpoint-connected')
              .find('circle')
              .attr({
                'stroke-width': 12,
                stroke: '#008000',
                'stroke-opacity': '0.5',
                'paint-order': 'stroke fill'
              })
          })

          instance.bind('connectionDragStop', function (connection) {
            $('.target-point')
              .not('.jtk-endpoint-connected')
              .find('circle')
              .attr({
                'stroke-width': 1,
                stroke: '#888',
                'stroke-opacity': '1'
              })
          })
          instance.bind('click', (conn, originalEvent) => {
            // this.$confirm("确定删除所点击的线吗?", "提示", {
            //   confirmButtonText: "确定",
            //   cancelButtonText: "取消",
            //   type: "warning"
            // })
            //   .then(() => {
            // instance.deleteConnection(conn);
            //   })
            //   .catch(() => {});
            console.log('点击连线', conn, mainData)
            if (window.confirm('确定删除点击的连线？')) {
              instance.detach(conn)
              let targetIds = conn.targetId
              let sourceIds = conn.sourceId

              mainData.forEach(mai => {
                if (targetIds === mai.instance_no) {
                  for (let i = 0; i < mai.in_instance_no.length; i++) {
                    if (mai.in_instance_no[ i ] === sourceIds) {
                      mai.in_instance_no.splice(i, 1)
                      console.log('删除连线', mainData)
                    }
                  }
                }
              })
            }

            console.log('点击连线', conn, mainData)
          })
          // instance.bind("connectionDetached", evt => {
          //     debugger;
          //     this.deleteLine(evt.sourceId, evt.targetId);
          // });
          instance.bind('beforeDrop', evt => {
            console.log('evt', evt)
            let from = evt.sourceId
            let to = evt.targetId
            if (from === to) {
              alert('不能连接自己')
              return false
            }
            // if (this.hasLine(from, to)) {
            //     alert("不能重复连线");
            //     return false;
            // }
            // if (this.hashOppositeLine(from, to)) {
            //     alert("不能回环");
            //     return false;
            // }

            // this.$message({
            //     message: "连线成功",
            //     type: "success"
            // });
            let currLine = null
            mainData.forEach(mai => {
              debugger

              if (to === mai.instance_no) {
                currLine = mai

                // for (let i = 0; i < mai.in_instance_no.length; i++) {
                //     if (mai.in_instance_no[i] === from) {
                //         mai.in_instance_no.push(to)
                //         console.log("连线成功", mainData)
                //     }
                // }
              }
            })
            if (currLine.in_instance_no.length == 0) {
              currLine.in_instance_no.push(from)
              console.log('连线', mainData)
              return true
            } else {
              let c = currLine.in_instance_no.indexOf(from)
              if (c < 0) {
                currLine.in_instance_no.push(from)
                console.log('连线', mainData)
                return true
              } else {
                alert('不能重复连线')
                console.log('不能重复连线', mainData)
                return false
              }
              // for (let i = 0; i < mai.in_instance_no.length; i++) {

              //     if (mai.in_instance_no[i] === from) {
              //         mai.in_instance_no.push(to)
              //         console.log("连线成功", mainData)
              //     }
              // }
              console.log('连线失败', mainData)
            }
            // return true;
          })

          /* instance.bind("connectionMoved", function (params) {
                       console.log("connection " + params.connection.id + " was moved");
                   }); */
        })

        jsPlumb.bind('jsPlumbDemoLoaded', function (instance) {
          window.$jsPlumbCanvas = $('.jtk-surface-canvas')
          var inter = setInterval(function () {
            if (window.$jsPlumbCanvas.length != 0) {
              clearInterval(inter)
            } else {
              window.$jsPlumbCanvas = $('.jtk-surface-canvas')
              window.$jsPlumbCanvas.append('<div id="guide-h" class="guide"></div>')
              window.$jsPlumbCanvas.append('<div id="guide-v" class="guide"></div>')
              // addMenu(1, '.work_panel')
            }
          }, 100)

          var renderer = (window.renderer = jsPlumbToolkit.Support.ingest({
            jsPlumb: instance,
            renderParams: {
              enableWheelZoom: true,
              miniview: {
                container: $('.miniview')[ 0 ]
              },
              zoomToFitIfNecessary: true
            }
          }))

          // bind to the node added event and tell the renderer to ingest each one

          instance.bind('jsPlumbDemoNodeAdded', function (el) {
            renderer.ingest(el)
          })

          // 适应画布
          renderer.zoomToFit({
            doNotZoomIfVisible: true
          })

          // pan mode/select mode
          jsPlumb.on('.controls', 'tap', '[mode]', function () {
            var mode = this.getAttribute('mode')
            if (mode == 'up') {
              renderer.setZoom(renderer.getZoom() + 0.08)
            } else if (mode == 'down') {
              renderer.setZoom(renderer.getZoom() - 0.08)
            } else {
              renderer.setMode(mode)
            }
          })

          // on home button tap, zoom content to fit.
          jsPlumb.on('.controls', 'tap', '[reset]', function () {
            // renderer.getToolkit().clearSelection();
            renderer.zoomToFit({
              doNotZoomIfVisible: true
            })
          })

          jsPlumb.on('.controls', 'tap', '[realsize]', function () {
            renderer.setZoom(1)
            // renderer.getToolkit().clearSelection();
          })

          //
          // use event delegation to attach event handlers to
          // remove buttons. This callback finds the related Node and
          // then tells the toolkit to delete it.
          //
          /* jsPlumb.on(canvasElement, "tap", ".delete", function (e) {
                      var info = toolkit.getObjectInfo(this);
                      renderer.getToolkit().removeNode(info.obj);
                  }); */
        })

        jsPlumb.fire('jsPlumbDemoLoaded', instance)
      })

    }
  },
  mounted () {
    this.initJsplumb()
  },
}
</script>

<style lang="scss" scoped>
.flow-editor {
  height: 100%;
}
</style>
