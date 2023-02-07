<template>
  <div class="box">
    <PageTools>
      <template #before>
        <span>共29条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="danger" @click="exportExcel">普通excel导出</el-button>
        <el-button size="small" type="info">复杂表头excel导出</el-button>
        <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
        <el-button size="small" type="primary" @click="addVisible=true">新增员工</el-button>
      </template>
    </PageTools>
    <el-card>
      <el-table border stripe :data="rows">
        <el-table-column label="序号" width="100px" align="center">
          <template #default="{$index}">
            {{ (params.page-1)*params.size+$index+1 }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" sortable />
        <el-table-column label="头像">
          <template #default="{row}">
            <img v-imgerror="imgSrc" :src="row.staffPhoto" style="width: 80%" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" sortable />
        <el-table-column prop="workNumber" label="工号" />
        <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formOfEmployment" />
        <el-table-column prop="departmentName" label="部门" />
        <el-table-column prop="timeOfEntry" label="入职时间">
          <template #default="{row}">
            <span>{{ row.timeOfEntry | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template>
            <el-switch />
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template #default="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="text-align: right">
      <el-pagination
        :page-size="params.size"
        layout="total, prev, pager, next"
        :total="total"
        :page-sizes="sizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增对话框 -->
    <el-dialog title="新增员工" :visible.sync="addVisible" width="40%" @close="handleClose">
      <el-form ref="addForm" label-width="80px" :rules="rules" :model="formData">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formData.mobile" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment">
            <el-option v-for="item in employees.hireType" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" @focus="getDepartmentList" />
          <el-tree v-if="depts.length>0" :data="depts" default-expand-all :props="{label:'name'}" @node-click="handleNodeClick" />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="formData.correctionTime"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="add">确定</el-button>
        <el-button @click="addVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import PageTools from '@/components/PageTools'
import { list2Tree } from '@/utils'
import { getEmployeeList, addEmployee } from '@/api/employees'
import employees from '@/api/constant/employees'
import { getDepartmentList } from '@/api/department'

export default {
  name: 'EmployeePage',
  components: {
  },
  data() {
    return {
      params: {
        page: 1,
        size: 10
      },
      total: null,
      rows: [],
      imgSrc: require('@/assets/common/head.jpg'),
      addVisible: false,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', max: 11, trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      employees,
      depts: [],
      sizes: [5, 10, 20, 50]
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.params)
      this.rows = rows
      this.total = total
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getEmployeeList()
    },
    formOfEmployment(row) {
      const obj = employees.hireType.find(it => it.id === row.formOfEmployment)
      if (obj) {
        return obj.value
      } else {
        return '未知'
      }
    },
    async getDepartmentList() {
      const res = await getDepartmentList()
      this.depts = list2Tree(res.depts, '')
    },
    handleSizeChange(size) {
      this.params.size = size
      this.getEmployeeList()
    },
    handleNodeClick(node) {
      console.log(node)
      this.formData.departmentName = node.name
      this.depts = []
    },
    handleClose() {
      this.$refs.addForm.resetFields()
    },
    async add() {
      console.log(this.formData)
      try {
        await this.$refs.addForm.validate()
        await addEmployee(this.formData)
        this.getEmployeeList()
        this.addVisible = false
      } catch (err) {
        console.log(err)
      }
    },
    async exportExcel() {
      const { rows } = await getEmployeeList({ page: 1, size: 999999 })
      const data = []
      const obj = {
        id: '',
        mobile: '',
        username: '',
        password: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        correctionTime: '',
        departmentName: '',
        staffPhoto: ''
      }
      rows.forEach(it => {
        data.push(Object.values({ ...obj, ...it }))
      })
      const tHeader = Object.keys(this.rows[0])
      console.log(data)

      // vendor 是第三方但是也不是从npm或yarn下载下来的代码 不是我们写的但是网上npm也下不下来
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  .box{
    padding: 20px;
  }
</style>
