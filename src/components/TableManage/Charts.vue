<template>
  <div>
    <NavBar></NavBar>
    <el-row>
      <el-col :span="11" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>每月实验次数</span>
          </div>
          <ve-histogram :data="expCount" :toolbox="toolbox"
                        :loading="expCount.loading"
                        :data-empty="expCount.dataEmpty"
                        :events="expCountEvent"
          >
          </ve-histogram>
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{expDetail.name}}</span>
          </div>
          <ve-histogram :data="expDetail"
                        :loading="expDetail.loading" :data-empty="expDetail.dataEmpty"
                        :data-zoom="dataZoom"
          ></ve-histogram>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>实验数据分析</span>
          </div>
          <ve-line :data="expDataResult" :toolbox="toolbox"
                   :loading="expDataResult.loading"
                   :data-empty="expDataResult.dataEmpty"
                   :settings="expDataResultSettings"
                   :data-zoom="dataZoom"
          ></ve-line>
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "Charts",
    components: {NavBar},
    data: function ()
    {
      this.toolbox =
        {
          feature: {
            magicType: {type: ['bar', 'line']},
            saveAsImage: {}
          }
        }
      this.dataZoom = [
        {
          type: 'slider',
          start: 0,
          end: 100
        }
      ]
      this.expDataResultSettings = {
        //metrics: ['访问用户', '下单用户'],
        dimension: ['包覆含量(%)'],
        xAxisType: 'value'
      }
      var self = this
      this.expCountEvent = {
        click: function (e)
        {
          self.expDetail.name = e.name
          self.getExpDetail()
        }
      }
      return {
        expCount: {
          columns: ['日期', '实验次数'],
          rows: [],
          loading: false,
          dataEmpty: false,
        },
        expDetail: {
          columns: ['包覆含量(%)', '1C首圈放电比容量(mAh/g)', '1C首圈充电比容量(mAh/g)', '首圈效率(%)', '1C循环50圈后放电容量', '容量保持率(%)'],
          rows: [],
          loading: false,
          dataEmpty: false,
          name: '点击左侧柱状图，就可以显示详情数据',
          //expDetailSettings: {type: this.typeArr[this.index]}
        },
        expDataResult: {
          columns: ['包覆含量(%)', '1C首圈放电比容量(mAh/g)', '1C首圈充电比容量(mAh/g)', '首圈效率(%)', '1C循环50圈后放电容量', '容量保持率(%)'],
          rows: [],
          loading: false,
          dataEmpty: false
        }
      }
    },
    methods: {
      async getExpCountByDate()
      {
        this.expCount.loading = true
        let user = JSON.parse(this.$cookie.get('userCookie'))
        let params = {
          uid: user.uid
        }
        const res = await http.post('/getExpCountByDate', params)

        setTimeout(() =>
        {
          this.expCount.rows = res.data
          this.expCount.dataEmpty = !this.expCount.rows.length
          this.expCount.loading = false
        }, 1000)
      },
      async getExpDetail()
      {
        this.expDetail.loading = true
        let user = JSON.parse(this.$cookie.get('userCookie'))
        let params = {
          date: this.expDetail.name,
          uid: user.uid
        }
        const res = await http.post('/getExpDetail', params)
        setTimeout(() =>
        {
          this.expDetail.rows = res.data
          this.expDetail.dataEmpty = !this.expDetail.rows.length
          this.expDetail.loading = false
        }, 1000)
      },
      async getExpDataResult()
      {
        this.expDataResult.loading = true

        let user = JSON.parse(this.$cookie.get('userCookie'))
        let params = {
          uid: user.uid
        }
        const res = await http.post('/getExpDataResult', params)
        setTimeout(() =>
        {
          this.expDataResult.rows = res.data
          this.expDataResult.dataEmpty = !this.expDataResult.rows.length
          this.expDataResult.loading = false
        }, 1000)
      }
    },
    created()
    {

      this.getExpDataResult()
      this.getExpCountByDate()
    }
  }
</script>

<style scoped>

</style>
