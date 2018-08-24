<template>
  <div>
    <NavBar></NavBar>
    <el-col>
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item>
            <el-input style="width: 420px" placeholder="请输入内容" v-model="content" class="input-with-select">
              <el-select v-model="selectType" style="width: 120px" slot="append" placeholder="请选择">
                <el-option label="实验名称" value="expname"></el-option>
                <el-option label="实验编号" value="eid"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryContent">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addExpData">添加数据</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-download" circle @click="downloadDialogVisible=true"></el-button>
          </el-form-item>
          <el-form-item>
            <el-upload action="/uploadExpData" :data="getUid"  :show-file-list="false" :on-success="uploadSuccess">
              <el-button type="success" icon="el-icon-upload2" circle></el-button>
            </el-upload>
          </el-form-item>

        </el-form>
        <el-table
          :data="expdatas"
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            label="实验编号"
            width="100"
            prop="eid">
          </el-table-column>
          <el-table-column
            label="实验名称"
            width="100"
            prop="expname">
          </el-table-column>
          <el-table-column
            label="包覆含量(%)"
            prop="encapsulation">
          </el-table-column>

          <el-table-column
            label="放电比容量(mAh/g)"
            prop="discharge">
          </el-table-column>

          <el-table-column
            label="充电比容量(mAh/g)"
            prop="charge">
          </el-table-column>

          <el-table-column
            label="首圈效率(%)"
            prop="eficiency">
          </el-table-column>

          <el-table-column
            label="循环50圈放电容量(mAh/g)"
            prop="loopretention">
          </el-table-column>

          <el-table-column
            label="容量保持率(%)"
            prop="retention">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 20px" v-show="paginationVisible">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="cur_page"
            :page-sizes="[5, 10, 15, 20,50]"
            :page-size="5"
            layout="total,sizes, prev, pager, next"
            :total="count">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <el-dialog :title="dialogname" :visible.sync="DialogFormVisible" @close='cancelDiaglog' center>
      <el-form :model="form">
        <el-form-item label="实验编号" :label-width="formLabelWidth" v-show="eidVisible">
          <el-input style="width: 250px" v-model="form.eid" auto-complete="off" disabled=false></el-input>
        </el-form-item>
        <el-form-item label="实验名称" :label-width="formLabelWidth" v-show="eidVisible">
          <el-input style="width: 250px" v-model="form.expname" auto-complete="off" disabled=false></el-input>
        </el-form-item>

        <el-form-item label="可以添加的实验列表" :label-width="formLabelWidth" v-show="!eidVisible">
          <el-select v-model="form.availExp" placeholder="请选择实验室">
            <template v-for="avail in availableExp">
              <el-option :label="avail.eid+' : '+avail.expname" :value="avail.eid"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="包覆含量(%)" :label-width="formLabelWidth">
          <el-input-number v-model="form.encapsulation" controls-position="right" :precision="2"
                           :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="放电比容量(mAh/g)" :label-width="formLabelWidth">
          <el-input-number v-model="form.discharge" controls-position="right" :precision="2"
                           :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="充电比容量(mAh/g)" :label-width="formLabelWidth">
          <el-input-number v-model="form.charge" controls-position="right" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="首圈效率(%)" :label-width="formLabelWidth">
          <el-input-number v-model="form.eficiency" controls-position="right" :precision="2"
                           :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="循环50圈放电容量(mAh/g)" :label-width="formLabelWidth">
          <el-input-number v-model="form.loopretention" controls-position="right" :precision="2"
                           :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="容量保持率(%)" :label-width="formLabelWidth">
          <el-input-number v-model="form.retention" controls-position="right" :precision="2"
                           :step="0.1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDiaglog">取 消</el-button>
        <el-button type="primary" @click="submitExpDataForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择要下载的实验数据内容" :visible.sync="downloadDialogVisible" center width="30%">
      <el-form>
        <el-form-item label="" label-width="75px">
          <el-radio v-model="userType" label="all" border>全部数据</el-radio>
          <el-radio v-model="userType" :label="currentUid" border>当前用户</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="downloadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="startDownload">开始下载</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'
  import axios from 'axios';
  import qs from 'qs'

  export default {
    name: "ExpData",
    components: {NavBar},
    data()
    {
      return {

        // 搜索
        content: '',
        selectType: 'expname',
        multipleSelection: [],
        queryEnabled: false,

        // 分页
        paginationVisible: true,
        count: 0,
        per_page: 5,
        cur_page: 1,

        // 弹窗属性
        dialogname: "数据编辑",
        eidVisible: true,
        DialogFormVisible: false,
        formLabelWidth: '250px',

        // 下载
        downloadDialogVisible: false,
        userType: 'all',
        currentUid: '',

        form: {
          did: "",
          eid: '',
          expname: "",
          availExp: "",
          encapsulation: "",
          discharge: "",
          charge: "",
          eficiency: "",
          loopretention: "",
          retention: ""
        },

        expdatas: [],
        availableExp: []
      }
    },
    computed:{
      getUid()
      {
        let user = JSON.parse(this.$cookie.get('userCookie'))
        let uidObject={
          uid:user.uid
        }
        return uidObject
      }
    },
    methods: {
      uploadSuccess(response, file, fileList)
      {   alert(response)
          if(response==='success')
          {
            this.$message.success("上传成功")
            this.getExpDatas(1, this.per_page)
          }

          else this.$message.error("上传失败")
      },
      startDownload()
      {
        var params = {
          userType: this.userType,
        }
        axios({
          method: 'post',
          url: '/downExpData',
          data: qs.stringify(params),
          responseType: 'arraybuffer'
        }).then(res =>
        {
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
          let objectUrl = URL.createObjectURL(blob);
          window.location.href = objectUrl;
        })
        this.downloadDialogVisible = false
      },
      cancelDiaglog()
      {
        this.DialogFormVisible = false
        if (this.dialogname === "添加数据")
        {
          this.dialogname = "数据编辑"
          this.eidVisible = true
        }
      },
      async postExpDataEditForm()
      {
        let params = {
          expdata: JSON.stringify(this.form)
        }
        const res = await
          http.post('/submitExpDataEditForm', params)
        if (res.data === "success")
        {
          this.getExpDatas(this.cur_page, this.per_page)
          this.$message.success("修改成功")
          this.DialogFormVisible = false
        }
      },
      async postExpDataAddForm()
      {
        if (this.form.availExp === '')
          this.$message.error("可用实验列表不能为空")
        else
        {
          let params = {
            expdata: JSON.stringify(this.form)
          }
          const res = await
            http.post('/submitExpDataAddForm', params)
          if (res.data === "success")
          {
            this.getExpDatas(this.cur_page, this.per_page)
            this.$message.success("新增数据成功")
            this.DialogFormVisible = false
          }
        }
      },
      submitExpDataForm()
      {
        if (this.dialogname === "添加数据")
        {
          this.postExpDataAddForm()
        }
        else
        {
          this.postExpDataEditForm()
        }
      },
      async postqueryContent(page, per_page)
      {
        let params = {
          selectType: this.selectType,
          content: this.content,
          page: page,
          per_page: per_page
        }
        const res = await
          http.post('/expdataQueryContent', params)
        this.expdatas = res.data.expdatas
        this.count = res.data.count
      },
      queryContent()
      {
        if (this.content === '')
        {
          this.queryEnabled = false
          this.page = 1
          this.getExpDatas(1, this.per_page)
        }
        else
        {
          this.queryEnabled = true
          this.postqueryContent(1, this.per_page)
        }
      },
      addExpData()
      {
        this.form.eid = ''
        this.form.expname = ''
        this.form.encapsulation = ''
        this.form.discharge = ''
        this.form.charge = ''
        this.form.eficiency = ''
        this.form.loopretention = ''
        this.form.retention = ''
        this.eidVisible = false
        this.dialogname = "添加数据"
        this.DialogFormVisible = true
      },
      async batchDelete()
      {
        let didList = []
        this.multipleSelection.forEach(expdata => didList.push(expdata.did))
        console.log(didList)
        let params = {
          didList: JSON.stringify(didList)
        }
        if (didList.length == 0)
        {
          this.$message.error("你什么都没有选择")
        } else
        {
          const res = await
            http.post('/expdataBatchDelete', params)
          if (res.data === "success")
          {
            this.$message.success("批量删除成功")

            if (this.count % this.per_page == 1)
            {
              this.getExpDatas(this.cur_page - 1, this.per_page)
            }
            else
            {
              this.getExpDatas(this.cur_page, this.per_page)
            }
          }
        }
      },
      handleSelectionChange(val)
      {
        this.multipleSelection = val;
      },
      handleEdit(index, row)
      {
        this.form = JSON.parse(JSON.stringify(row)) // 深度拷贝
        this.DialogFormVisible = true
      },
      async removeExpData(did)
      {
        let params = {
          did: did,
        }
        const res = await http.post('/removeExpData', params)
        if (res.data === "success")
        {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          if (this.count % this.per_page == 1)
          {
            this.getExpDatas(this.cur_page - 1, this.per_page)
          }
          else
          {
            this.getExpDatas(this.cur_page, this.per_page)
          }
        }
      },
      handleDelete(index, row)
      {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() =>
        {
          this.removeExpData(row.did)
        })
      },
      handleSizeChange(val)
      {
        this.per_page = val
        if (this.queryEnabled == false)
          this.getExpDatas(this.cur_page, val)
        else
          this.postqueryContent(this.cur_page, val)
      },
      handleCurrentChange(val)
      {
        this.cur_page = val
        if (this.queryEnabled == false)
          this.getExpDatas(val, this.per_page)
        else
          this.postqueryContent(val, this.per_page)
      },
      async getExpDatas(page, per_page)
      {
        let params = {
          page: page,
          per_page: per_page
        }
        const res = await http.post('/getExpDatas', params)
        if (res.data != "error")
        {
          this.expdatas = res.data.expdatas
          this.count = res.data.count
          this.availableExp = res.data.availableExp
        }
      },
    },
    mounted: function ()
    {
      this.getExpDatas(this.cur_page, this.per_page)

      let user = JSON.parse(this.$cookie.get('userCookie'))
      this.currentUid = user.uid
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 35%;
  }
</style>
