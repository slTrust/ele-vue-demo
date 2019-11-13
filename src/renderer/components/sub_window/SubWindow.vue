<template>
  <div id="wrapper"  style="-webkit-app-region: drag">
    <h2>子窗口</h2>
    <div style="border:1px solid red;">
      <strong>来自主页面的信息</strong>
      <br>
      id:{{payload.id}}
      <br>
      msg:{{payload.msg}}
      <button @click="sendMsg">发消息</button>
      <br>
      收到的消息：{{data}}
      <hr>
      <button @click="goToMain">main</button>
    </div>

    <system-information/>

  </div>
</template>

<script>
  import SystemInformation from '@/components/LandingPage/SystemInformation'
  export default {
    name: 'subWindow',
    components: {SystemInformation },
    data(){
      return {
        payload: '',
          data:null,
      }
    },
    methods: {
        goToMain(){
          this.$router.replace({path:'/'})
        },
        sendMsg(){
            this.$electron.ipcRenderer.send('sub-to-main',{id:this.payload.id,msg:'子页面'+this.payload.id+'的msg'});
        },
        xxx1(event, payload){
            let id = this.$route.params.id;
            if(payload.id===id){
                console.log(payload)
                this.payload = payload
            }
        },
        xxx2(event,payload){
            console.log("main-to-sub")
            console.log(payload)
            this.data = payload
        }
    },
    mounted() {
        let id = this.$route.params.id;
        this.$electron.ipcRenderer.send('sub-ready',id);
        this.$electron.ipcRenderer.on('msg',(event, payload)=>{
            let id = this.$route.params.id;
            if(payload.id===id){
                console.log(payload)
                this.payload = payload
            }
        })
        this.$electron.ipcRenderer.on('main-to-sub',(event,payload)=>{
            console.log("main-to-sub")
            console.log(payload)
            this.data = payload
        });
    }
  }
</script>

<style scoped>
  button{
    -webkit-app-region: no-drag;
  }
</style>
