<template>
  <div class="flow-chart">
    <nav class="navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">样本预处理</a>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <flow-menu :menuData="menuData"></flow-menu>
        <flow-editor></flow-editor>
        <flow-attribute :colData="attributeData"></flow-attribute>
      </div>
    </div>
  </div>
</template>

<script>
import flowMenu from '@/components/flowMenu'
import flowEditor from '@/components/flowEditor'
import flowAttribute from '@/components/flowAttribute'

export default {
  name: 'flowChart',
  components: {
    flowMenu,
    flowEditor,
    flowAttribute
  },
  data () {
    return {
      menuData: [],
      attributeData: []
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.flow-chart {
  height: 100%;
  .container-fluid {
    height: 100%;
    .row {
      height: 100%;
    }
  }
}
</style>
