<template>
  <div class="col-xs-3 col-md-2 flow-attribute">
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
</template>

<script>
export default {
  // 右侧属性区域
  name: 'flowAttribute',
  data () {
    return {
    }
  },
  props: {
    colData: {
      type: Array,
      default: () => { return [] }
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-attribute {
  height: 100%;
}
</style>
