<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="登录账户设置" name="first">
        <el-form label-width="100px" style="width:500px;">
          <el-form-item label="姓名">
            <el-input />
          </el-form-item>
          <el-form-item label="密码">
            <el-input />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情" name="second">
        <JobInfo />
      </el-tab-pane>
      <el-tab-pane label="岗位信息" name="third">
        <UserInfo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import JobInfo from './cpnt/job-info.vue'
import UserInfo from './cpnt/user-info.vue'

export default {
  components: {
    JobInfo,
    UserInfo
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
