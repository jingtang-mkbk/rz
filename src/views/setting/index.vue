<template>
  <div class="box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="first">
        <el-button type="primary" size="small" @click="addDialogVisible=true;title='新增'">新增角色</el-button>
        <el-table v-loading="loading" border stripe style="margin-top:20px;" :data="roleList">
          <!-- <el-table-column type="index" label="序号" width="100px" align="center" /> -->
          <el-table-column type="index" label="序号" width="100px" align="center">

            <!-- 假设现在一页是4条
            1 2 3 4
            5 6 7 8  1+4 2+4 3+4 4+4
            9 10 11 12 1+8 2+8 3+8 4+8

            第n页 1+(n-1)*4 -->

            <template #default="{$index}">
              {{ (params.page-1) * params.pagesize + $index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="角色" align="center" prop="name" />
          <el-table-column label="描述" align="center" prop="description" />
          <el-table-column label="操作" align="center">
            <template #default="{row}">
              <el-button icon="el-icon-setting" type="success" size="small" plain>分配权限</el-button>
              <el-button icon="el-icon-edit" type="primary" size="small" plain @click="handleEdit(row)">编辑</el-button>
              &nbsp;&nbsp;
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="handleDelete(row.id)"
              >
                <el-button slot="reference" icon="el-icon-delete" type="danger" size="small" plain>删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:right;margin-top:20px;">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="params.pagesize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="公司信息" name="second">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
          show-icon
          :closable="false"
        />
        <el-form label-width="120px" style="width:500px;margin-top:40px;">
          <el-form-item label="公司名称">
            <el-input v-model="companyInfo.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增对话框 -->
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="50%" @close="handleClose">
      <el-form ref="form" label-width="100px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" autofocus />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button size="small" @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" size="small" @click="add">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, addRole, deleteRole, updateRole } from '@/api/setting'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')
export default {
  name: 'SettingPage',
  data() {
    return {
      activeName: 'first',
      companyInfo: {}, // 如果拿回来的数据是数组 建议初始值是[] 如果拿回来是对象 建议初始值是{} 如果是其他类型 null 不管怎么样，只要是要在模板中使用的数据，一定要初始化 Object.defineProperty必须对data中所有的数据进行处理变成响应式 （数据劫持） 如果是后添加的数据 没有经过vue初始化处理 没有经过Object.defineProperty进行数据劫持 就不是响应式
      // get,delete请求参数是params post,put 请求参数在data中
      params: {
        page: 1,
        pagesize: 4
      },
      total: null, // 数据总条数
      roleList: [],
      loading: false,
      addDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      title: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
    // ...mapState('user',['userInfo']) //不写createNamespacedHelpers 这块必须这样写
  },
  created() {
    this.getCompanyInfo()
    this.getRoleList()
  },
  methods: {
    async getCompanyInfo() {
      console.log(this.userInfo)
      // if (!this.userInfo.companyId) {
      //   // commit -> mutations dispatch actions
      //   // 拿公司相关的信息
      //   await this.$store.dispatch('user/getUserInfo')
      // }
      this.companyInfo = await getCompanyInfo(this.userInfo.companyId)
    },
    async getRoleList() {
      this.loading = true
      const { total, rows } = await getRoleList(this.params)
      this.total = total
      this.roleList = rows
      this.loading = false
    },
    handleCurrentChange(current) {
      this.params.page = current
      this.getRoleList()
    },
    handleClose() {
      // resetFields除了重置数据还会重置校验报错红色效果
      this.$refs.form.resetFields()
      this.form = {}
    },
    async add() {
      try {
        await this.$refs.form.validate()
        if (this.title === '新增') {
          await addRole(this.form)
        } else {
          await updateRole(this.form)
        }
        this.getRoleList()
        this.addDialogVisible = false
      } catch (err) {
        console.log(err)
      }
    },
    async handleDelete(id) {
      try {
        await deleteRole(id)
        this.$message.success('删除成功')
        // 当当前页面只有一条的时候，并且不是第一页的时候，我们把这唯一的这一条删除就直接拿上一页的数据
        if (this.roleList.length === 1 && this.params.page !== 1) {
          this.params.page--
        }
        this.getRoleList()
      } catch (err) {
        console.log(err)
      }
    },
    handleEdit(row) {
      this.title = '编辑'
      // 深拷贝 浅拷贝 对象只有一层
      // 拷贝 copy
      this.form = { ...row }// 表格上的数据和form是二个对象，地址不一样，不会互相影响
      this.addDialogVisible = true
    }
  }

}

// await xxx
</script>

<style scoped lang='scss'>
.box{
  padding:20px;
}
</style>
