<template>
  <div id="wrapper">
    <h2>主页面</h2>
    <li v-for="item in stockList">
      <el-button @click="newWindow(item)" :disabled="item.state">{{item.code}}新窗口</el-button>
    </li>
    主页面发广播
    <el-button @click="sendMsg">发消息</el-button>

    系统信息
    <system-information></system-information>
    <!-- <router-view></router-view> -->
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
          isOpened: false,
          stockList:[
              {code:"600001",state:false,},
              {code:"600002",state:false,},
              {code:"600003",state:false,},
              {code:"600004",state:false}
          ]
      }
    },
    methods: {
        sendMsg(){
            this.$electron.ipcRenderer.send('main-to-sub',{msg:'这是来自主窗口的信息'})
        },
      open (link) {
        this.$router
        this.$electron.shell.openExternal(link)
      },
      newWindow(stock){
          stock.state = true;
          this.$electron.ipcRenderer.send('newWindow',{id:stock.code,msg:'这是来自主窗口的信息'})
      }
    },
    mounted(){
      this.$electron.ipcRenderer.on('subwindow-closed',(event,payload)=>{
          console.log('--------')
          console.log(payload);
          console.log('--------')
          let code = payload.id;
          let item = this.stockList.filter(item=>item.code===code)[0];
          item.state = false;
      })

      this.$electron.ipcRenderer.on('router',(event,path)=>{
        this.$router.replace(path)
      })

      this.$electron.ipcRenderer.on('sub-to-main',(event,msg)=>{
          console.log(msg);
      })
    }
  }
</script>

<style lang="scss">
</style>
