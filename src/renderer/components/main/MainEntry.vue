<template>
  <div class="main-entry" style="-webkit-app-region: drag">
    <div class="entry" v-for="(item, index) in entries" :key="'entry'+index">
      <el-button>{{item.name}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'main-entry',
    components: {  },
    data(){
      return {
        entries:[
          {
            name:"正常通道",
            key: "normal",
          },
          {
            name:"绿色通道",
            key: "green",
          },
          {
            name:"人工通道",
            key: "manual",
          },
        ]
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
.main-entry{
  padding: 50px;
  text-align: center;
  .entry{
    margin-bottom: 30px;
  }
  button{
    -webkit-app-region: no-drag;
  }
}
</style>
