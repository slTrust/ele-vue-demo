<template>
  <div id="wrapper"  style="-webkit-app-region: drag">
    <system-information/>
    来自主页面的信息
    {{msg}}
    <button @click="goToMain">main</button>
  </div>
</template>

<script>
  import SystemInformation from '@/components/LandingPage/SystemInformation'
  export default {
    name: 'subWindow',
    components: {SystemInformation },
    data(){
      return {
        msg: ''
      }
    },
    methods: {
      goToMain(){
        this.$router.replace({path:'/'})
      }
    },
    mounted() {
      this.$electron.ipcRenderer.send('sub-ready','1');
      this.$electron.ipcRenderer.on('msg',(event, msg)=>{
        console.log(msg)
        this.msg = msg
      })
    },
  }
</script>

<style scoped>
  button{
    -webkit-app-region: no-drag;
  }
</style>
