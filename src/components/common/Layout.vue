<template>
    <div class="fillcontain">
        <div v-cloak v-if="!$route.meta.login">
            <tab></tab>
        </div>
        <v-sidebar></v-sidebar>
        <div class="content">
            
            <router-view :key="$route.fullPath"></router-view>
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
    @import '../../style/public';

    
</style>
