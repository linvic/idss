<template>
    <div class="fillcontain">
        <div v-cloak v-if="!$route.meta.login">
            <tab></tab>
        </div>
        <v-sidebar></v-sidebar>
        <div class="content">
            <router-view ></router-view>
        </div>
    </div>
</template>

<script>
    // 注意标签和引入驼峰，可以有区别
    import Tab from 'components/common/tab'
    import vSidebar from "components/common/Sidebar";
    export default {
        components: {
            Tab,
            vSidebar
        }
    }
</script>

<style lang="scss">

    [v-cloak] {display: none !important; }
    
    .content {
        position: absolute;
        left: 208px;
        top: 50px;
        right: 0;
        bottom: 0;
        background: #f0f2f5;
        box-sizing: border-box;
        overflow: auto;
        -webkit-transition: left 0.38s;
        transition: left 0.38s;
    }
    .content > div {
        min-width: 800px;
    }
    .wrapper{
        padding: 0 20px;
    }
    .router-wrapper{
        font-size: 12px;
        color: rgba(80,83,99,0.50);
        margin: 0 auto;
        height:37px;
        line-height: 37px;
    }
    .router-wrapper .child2{
        cursor: pointer;
        color:  #D93437;
    }
    .router-wrapper .child1{
        cursor: pointer;
        color: rgba(80,83,99,0.50);
    }
    
</style>
