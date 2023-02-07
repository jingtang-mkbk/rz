<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ data.name }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="end">
        <el-col>{{ data.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="handleCmd">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <template v-if="!isTitle">
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="del">删除部门</el-dropdown-item>
              </template>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    isTitle: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({ name: 'xxxx', manager: '负责人' })
    }
  },
  data() {
    return {}
  },
  methods: {
    handleCmd(type) {
      switch (type) {
        case 'add': return this.$emit('addDept')
        case 'edit': return this.$emit('editDept')
        case 'del': return this.$emit('delDept', this.data.id)
        default: break
      }
    }
  }
}
</script>

<style scoped lang='scss'></style>
