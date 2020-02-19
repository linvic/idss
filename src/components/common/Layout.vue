<template>
    <div class="fillcontain">
        <div v-cloak v-if="!$route.meta.login">
            <tab></tab>
                
        </div>
        <v-sidebar></v-sidebar>
        <div class="content" ref="contentView">
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
        },
        data() {
            return {
            }
        },
        mounted() {
            this.watchScrollTop();
        },
        
        methods: {
            watchScrollTop() {
                let contentView = this.$refs.contentView;
                window.getScrollTop = ()=> {
                    return contentView.scrollTop;
                }
                window.setScrollTop = (t)=> {
                    contentView.scrollTop = t;
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '../../style/public';

    
</style>
