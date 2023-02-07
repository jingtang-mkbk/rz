<!-- eslint-disable vue/attributes-order -->
<template>
  <div class="box">
    <el-card class="tree-card" v-loading="loding">
      <TreeTools is-title :data="{name: 'xxxx', manager: '负责人'}" @addDept="handleAddDept('')" />
      <el-tree :data="depts" :props="{label:'name'}" default-expand-all node-key="id">
        <template #default="{ data }">
          <TreeTools
            :data="data"
            @delDept="delDeptFn"
            @addDept="handleAddDept(data.id)"
            @editDept="handleEditDept(data)"
          />
        </template>
      </el-tree>
    </el-card>
    <AddDept
      :pid="pid"
      :raw-depts="rawDepts"
      :simple-employee-list="simpleEmployeeList"
      :dialog-visible="dialogVisible"
      @close="dialogVisible=false"
      :title="title"
      @update="getDepartmentList"
    />
  </div>
</template>

<script>
import TreeTools from './cpnts/tree-tools.vue'
import { getDepartmentList, delDepartment, getEmployeeSimple } from '@/api/department'
import { list2Tree } from '@/utils'
import AddDept from './cpnts/add-dept.vue'

export default {
  name: 'DepartmentPage',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      depts: [],
      loding: true,
      dialogVisible: false,
      rawDepts: [],
      pid: '',
      simpleEmployeeList: [],
      title: ''
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      const res = await getDepartmentList()
      this.rawDepts = res.depts
      this.depts = list2Tree(res.depts, '')
      this.loding = false
    },
    async delDeptFn(id) {
      try {
        await this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delDepartment(id)
        // 删除成功说明数据变旧了，所以要重新拿一次数据
        this.getDepartmentList()
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
      }
    },
    async handleAddDept(id) {
      this.title = '新增部门'
      this.pid = id
      this.simpleEmployeeList = await getEmployeeSimple()
      this.$children[1].form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.dialogVisible = true
    },
    async handleEditDept(data) {
      this.dialogVisible = true
      this.title = '修改部门'
      this.pid = data.pid
      this.$children[1].form = { ...data }
      this.simpleEmployeeList = await getEmployeeSimple()
    }
  }
}
</script>

<style scoped lang='scss'>
.box{
  padding:14px;
}
.tree-card {
  font-size:14px;
  min-height:600px;
}

::v-deep .v-leave-active{
  transition: none !important
}
::v-deep .v-enter-active{
  transition: none !important
}
</style>
