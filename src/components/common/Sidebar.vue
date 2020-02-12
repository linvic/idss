<template>
	<div class="sidebar">
		<el-scrollbar>
			<!-- <h1 class="sidebar_logo" @click="linkDataView">
				<img src="../../images/company_logo.png" v-if="isCollapse">
			</h1> -->
			<el-menu class="site-menu" :default-active="$route.path" router unique-opened :collapse="isCollapse">
                <template v-for="item in roleRoutes" v-if="!item.hidden&&item.children">
					
					<router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
											 :key="item.children[0].name">
						<el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
							<i v-if="item.children[0].meta&&item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
							<span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
						</el-menu-item>
					</router-link>
					<el-submenu v-else :index="item.path" :key="item.name">
						<template slot="title">
							<i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
							<span v-if="item.meta&&item.meta.title" slot="title" :to="item.path">{{item.meta.title}}</span>
						</template>

						<template v-for="child in item.children" v-if="!child.hidden">
							<sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

							<router-link v-else :to="child.path" :key="child.name">
								<el-menu-item :index="child.path">
									<i v-if="child.meta&&child.meta.icon" :class="child.meta.icon"></i>
									<span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
								</el-menu-item>
							</router-link>
							
						</template>
					</el-submenu>
				</template>

			</el-menu>
			
		</el-scrollbar>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import {loadMenuResources} from 'service/getData'
	import {  ERR_OK } from 'service/config'
	import router from '../../router/index'
	export default {
		computed: {
			...mapGetters([
				'singer'
			]),
			userView() {
				return this.singer.userView
			}
		},
		props: {
			// isCollapse: {
			// 	type: Boolean
			// },
			isNest: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isCollapse: false,
				routes: router.options.routes,
				roleRoutes: [],
			}
		},
		created() {
			console.log('用户',this.userView);
            this.getMenuResources();
		},
		methods: {
			hasOneShowingChildren(children) {
                const showingChildren = children.filter(item => {
					return !item.hidden
				})
                if (showingChildren.length === 1&& showingChildren[0].name=='index' || showingChildren[0].name=='setCenter') {
					return true
				}
				return false
			},
			linkDataView() { // 新标签页打开
                if(this.isVisibleCatalog('sjksh1')) {
                    const {href} = this.$router.resolve({
                        path: '/dataView'
                    })
                    window.open(href, '_blank')
                }
			},
			//      获取用户菜单权限
			getMenuResources() {
				loadMenuResources({}).then(res => {
					if (res.code == ERR_OK) {
						let menuRoles = [];
						for(let item of res.data) {
							menuRoles.push(item.resourceNo)
						}
						
						let _roleRoutes = router.options.routes;
						for(let j of _roleRoutes) {
							if (j.meta && j.meta.roles&& (menuRoles.indexOf(j.meta.roles) > -1) ) {
								j.hidden = false;
							} else {
								j.hidden = true;
							}
							// userView控制
							if (j.meta && j.meta.userViews && (j.meta.userViews.indexOf(this.userView) > -1) ) {
								j.hidden = false;
							}
							if (j.children && j.children.length > 0) {
								for(let k of j.children) {
									if (k.meta && k.meta.userViews && (k.meta.userViews.indexOf(this.userView) > -1) ) {
										k.hidden = false;
									}
								}
							}
							
						}
						console.log('新路由',_roleRoutes)
						this.$set(this,'roleRoutes',_roleRoutes)
					} else {
						this.$notify.error({
							title: "错误",
							message: res.msg
						});
					}
				});
			},
		},
		watch: {
			'isCollapse' (val) {
				this.isCollapse = val
			},
		}
	}
</script>
<style scoped lang="scss">
	.sidebar /deep/ .el-scrollbar {
		height: calc(100% - 50px);
	}
	.sidebar /deep/ .el-scrollbar__wrap {
		overflow-x: hidden !important;
	}
	.sidebar {
		position: absolute;
		top: 50px;
		bottom: 0;
		left: 0;
		width: 208px;
		background: #ffffff;
		overflow: hidden;
		-webkit-transition: width 0.38s;
    	transition: width 0.38s;
    	box-shadow: 4px 0px 6px 0px rgba(34,0,1,0.04);
    	z-index: 999;
	}
    .isCollapse .sidebar {
		width: 64px;
    }
	.site-menu {
		border: none;
		background: #ffffff;
		color: #a3afb7;
	}
	.site-menu:not(.el-menu--collapse) {
		width: 208px;
		min-height: 100px;
	}
	.sidebar_logo {
		display: inline-block;
		width: 100%;
		text-align: center;
		height: 64px;
		background:linear-gradient(90deg,rgba(0,50,84,1) 0%,rgba(0,33,64,1) 100%);
		box-shadow:2px 0px 6px 0px rgba(0,21,41,0.35);
		cursor: pointer;
	}
	.sidebar_logo img {
		display: inline-block;
	    margin-top: 10px;
	}
	
	/deep/ .el-menu-item,/deep/ .el-submenu__title,/deep/ .el-menu-item i {
		color: rgba(0,0,0,.65);
	}
	/deep/ .el-submenu__title:hover,/deep/ .el-submenu__title:focus,/deep/ .el-menu-item:hover,/deep/ .el-menu-item:focus,/deep/ .el-menu-item.is-active {
		background: #F5F4F4;
		color: #D93538;
	}
	/deep/ .el-submenu__title:hover i,/deep/ .el-submenu__title:focus i,/deep/ .el-menu-item:hover i,/deep/ .el-menu-item:focus i,/deep/ .el-menu-item.is-active.el-menu-item i {
		color: #D93538;
	}
	/deep/ .el-menu {
		background: #ffffff;
	}
	/deep/ .el-submenu .el-menu-item > span {
		padding-left: 10px;
	}
	/deep/ .el-submenu{
		&.is-active .el-submenu__title{
			color: #D93538;
		}
		&.is-opened ul.el-menu {
			background: #F5F4F4;
		}
	}
	/deep/ .el-menu-item,/deep/ .el-submenu__title {
		height: 50px;
		line-height: 50px;
	}
	/deep/ .el-submenu .el-menu-item {
		height: 42px;
		line-height: 42px;
	}
</style>