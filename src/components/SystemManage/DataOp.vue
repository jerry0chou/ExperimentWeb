<template>
  <div>
    <NavBar></NavBar>
    <br>

    <el-col :span="8" :offset="8">
      <el-row>
        <el-col :span="8" :offset="8">
          <el-progress type="circle" :percentage="percent" status="success"></el-progress>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col>
          <el-steps :active="active" finish-status="success">
            <el-step title="初始化数据"></el-step>
            <el-step title="正在进行"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <br>
      <el-card>
        <el-col :span="16">
          <el-button type="warning" @click="backup" :disabled="backupDisabled">开始备份数据</el-button>
        </el-col>
        <!--<el-col :span="4" :offset="4">-->
        <el-button type="danger" @click="recovery" :disabled="recoveryDisabled">开始恢复数据</el-button>
        <!--</el-col>-->
      </el-card>
    </el-col>

  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "DataOp",
    components: {NavBar},
    data()
    {
      return {
        backupDisabled: false,
        recoveryDisabled: false,
        active: -1,
        percent:0
      }
    },
    methods: {
      backup()
      {
        this.recoveryDisabled = true
        this.$notify({
          title: '警告',
          message: '开始数据库备份，请谨慎操作',
          type: 'warning'
        });


        var self = this
        self.active = 0
        self.percent=0
        var interval = setInterval(function ()
        {
          self.active += 1;
          self.percent+=33.3
          if (self.active === 3)
          {
            self.$message.success("数据备份成功")
            self.recoveryDisabled = false
            clearInterval(interval);
          }
        }, Math.random() * 4000 + 2000);

      },
      recovery()
      {
        this.backupDisabled = true
        this.$notify({
          title: '警告',
          message: '开始数据库恢复，请谨慎操作',
          type: 'warning'
        });

        var self = this
        self.active = 0
        self.percent=0
        var interval = setInterval(function ()
        {
          self.active += 1;
          self.percent+=33
          if (self.active === 3)
          {
            self.$message.success("数据恢复成功")
            self.backupDisabled = false
            clearInterval(interval);
          }
        }, Math.random() * 4000 + 2000);
      }
    }
  }
</script>

<style scoped>

</style>
