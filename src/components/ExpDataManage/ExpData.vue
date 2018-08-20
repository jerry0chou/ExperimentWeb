<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="20" :offset="2">
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item>
            <el-input style="width: 420px" placeholder="请输入内容" v-model="content" class="input-with-select">
              <el-select v-model="selectType" style="width: 120px" slot="append" placeholder="请选择">
                <el-option label="实验名称" value="expname"></el-option>
                <el-option label="实验时间" value="date"></el-option>
                <el-option label="用户编号" value="uid"></el-option>
                <el-option label="用户名称" value="username"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryContent">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addExperiment">新增实验</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-form-item>

          <el-form-item>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button type="success" icon="el-icon-upload2" circle></el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-download" circle></el-button>
          </el-form-item>

        </el-form>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "ExpData",
    components: {NavBar},
  }
</script>

<style scoped>

</style>
