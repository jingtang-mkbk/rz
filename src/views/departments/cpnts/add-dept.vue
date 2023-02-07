<template>
  <el-dialog :title="title" :visible="dialogVisible" width="50%" @close="handleClose">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-input v-model="form.manager" /> -->
        <el-select v-model.trim="form.manager" placeholder="请选择负责人">
          <el-option v-for="it in simpleEmployeeList" :key="it.id" :label="it.username" :value="it.username">{{ it.username }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleClick" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDepartments } from '@/api/department'

export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    rawDepts: {
      type: Array,
      default: () => []
    },
    pid: {
      type: String,
      required: true
    },
    simpleEmployeeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validName = (rule, value, callback) => {
      let arr = this.rawDepts.filter(it => it.pid === this.pid)
      if (this.title === '编辑部门') arr = arr.filter(it => it.id !== this.form.id)
      if (arr.some(it => it.name === value)) callback(new Error(`同级部门下已经有${value}这个部门`))
      else callback()
    }

    const validCode = (rule, value, callback) => {
      let arr = this.rawDepts.filter(it => it.code === this.pid)
      if (this.title === '编辑部门') arr = arr.filter(it => it.id !== this.form.id)
      if (arr.some(it => it.name === value)) callback(new Error(`同级部门下已经有${value}这个部门`))
      else callback()
    }

    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在1-50之间', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在1-50之间', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 300, message: '长度在1-300之间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    handleClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    async handleClick() {
      try {
        await this.$refs.form.validate()
        this.form.pid = this.pid
        await addDepartments(this.form)
        this.$message.success('添加部门成功')
        this.$emit('close')
        this.$emit('update')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
