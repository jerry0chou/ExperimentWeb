<template>
  <div id="app">
    <p>{{responseData}}</p>
    <button @click="sendGet">sendGet</button>
    <button @click="sendPost">sendPost</button>
  </div>
</template>

<script>
  import http from '@/api/http'

  export default {
    name: 'HelloWorld',
    data()
    {
      return {
        responseData: ''
      }
    },
    methods: {
      async sendGet()
      {
        let params={}
        const res =await http.get('/hello', params)
        if (res.data)
        {
          alert('请求成功'+res.data)
          this.responseData=res.data
        }
      },
      async sendPost()
      {
          let data={
            username:"jerry",
            password:"123"
          }
        const res =await http.post('/post', data)
        if (res.data)
        {
          alert('请求成功'+res.data)
          this.responseData=res.data
        }
      },
    }
  }
</script>
