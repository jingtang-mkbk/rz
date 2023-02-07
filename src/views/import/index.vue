<template>
  <div class="app-container">
    <UploadExcel :before-upload="beforeUpload" :on-success="handleSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    async handleSuccess({ results, header }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []

      results.forEach(it => {
        const userInfo = {}
        Object.keys(it).forEach(key => {
          if (key === '入职日期' || key === '转正日期') {
            it[key] = this.formatDate(it[key], '/')
          }
          userInfo[userRelations[key]] = it[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr)
      this.$message.success('导入成功')
      this.$router.push('/employees')
    }
  }
}
</script>
