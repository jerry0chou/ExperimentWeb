<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      chooseRouter()
      {
        let userCookie = this.$cookie.get('userCookie')
        if (userCookie)
        {
          this.$router.push("/")
        }
        else
        {
          this.$router.push("/login")
        }
      }
    },
    mounted: function ()
    {
      this.chooseRouter()
    }
  }
</script>

