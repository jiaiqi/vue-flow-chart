<template>
  <div class="col-xs-3 col-md-2 menu-left">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  // 左侧菜单区域
  name: 'flowMenu',
  data () {
    return {
      treeData: [
        {
          label: '作业',
          children: [
            {
              label: '开始'
            },
            {
              label: '任务'
            } ]
        },
        {
          label: '输入',
          children: [
            {
              label: '数据库'
            },
            {
              label: 'FTP服务'
            } ]
        },
        {
          label: '处理',
          children: [
            {
              label: '过滤'
            },
            {
              label: '转化'
            } ]
        },
        {
          label: '输出',
          children: [
            {
              label: '数据库'
            },
            {
              label: '文件'
            } ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  props: {
    menuData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    }
  },
  mounted () {
    if (this.menuData.length > 0) {
      this.treeData = this.menuData
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-left {
  height: 100%;
}
</style>
