<template>
  <div id="wrapper">
    elec-demo
    系统信息
    <system-information></system-information>
    <!-- <router-view></router-view> -->
    <el-button @click="newWindow" :disabled="isOpened">新窗口</el-button>
    <!-- <router-link to="/sub">sub</router-link> -->
    <router-link to="/entry">entry</router-link>
      
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data(){
      return {
        isOpened: false
      }
    },
    methods: {
      open (link) {
        this.$router
        this.$electron.shell.openExternal(link)
      },
      newWindow(){
        this.isOpened = true;
        this.$electron.ipcRenderer.send('newWindow','这是来自主窗口的信息')
      }
    },
    mounted(){
      this.$electron.ipcRenderer.on('subwindow-closed',()=>{
        this.isOpened = false
      })
      this.$electron.ipcRenderer.on('router',(event,path)=>{
        this.$router.replace(path)
      })
    }
  }
</script>

<style lang="scss">
</style>
