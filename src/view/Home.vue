<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="8" :offset="8">
      <b-card title="电池实验数据管理系统"
              :img-src="imgUrl"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 30rem;"
              class="mb-3">
        <p class="card-text">
           点击上方导航栏，开始体验吧
        </p>
        <b-button  variant="success" @click="goExperiment">去实验管理</b-button>
      </b-card>
    </el-col>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar'
  import imgURl from '@/assets/battery.png'

  export default {

    name: "Home",
    components: {NavBar},
    data()
    {
      return {
        imgUrl: imgURl,
        //currentDate:
      }
    },
    methods:{
      goExperiment()
      {
        this.$router.push("/experiment")
      }
    }
  }
</script>

<style scoped>

</style>
