<template>
    <div>

        <div class="category_list_box">
            <div class="category_box" :style="'height:'+ (parseInt(height) + 90) + 'px'">
                <i-tree :data="category" @on-select-change="selectCategory"></i-tree>
            </div>

            <div class="list_box">
                <vuecmf-table
                        ref="vcTable"
                        :server="serverUrl"
                        page="page"
                        :limit="20"
                        @on-add="save"
                        @on-edit="save"
                        @on-del="del"
                        :show-del-btn="true"
                        :show-edit-btn="true"
                        :show-add-btn="true"
                        :operate-width="150"
                        :form-label-width="100"

                        :editor-config="editorConfig"
                        :width="width"
                        :height="height"

                        model-width="80%"
                        model-height="90%"
                ></vuecmf-table>
            </div>
        </div>

    </div>
</template>
<style scoped>
    .category_list_box{ display: flex; align-items:stretch;}
    .category_box, .list_box{ flex: 1; margin-left: 8px; }
    .category_box{ flex: 0 0 150px; margin-left: 0; border: 1px solid #e8eaec; padding: 0 5px; overflow: auto; border-radius: 4px;}

</style>
<script>
    import VuecmfTable from 'vuecmf-table/src/lib/vuecmf-table/table.vue'
    import * as utils from "@/utils/screen.js"
    import { mapState } from 'vuex'
    import '@/plugins/axios'

    export default {
        name: 'list',
        components:{
            'vuecmf-table': VuecmfTable
        },
        data() {
            return {
                category: [],
                height: 300,
                width: 800,
                serverUrl: '',
                editorConfig: {
                    // 你的UEditor资源存放的路径,相对于打包后的index.html
                    UEDITOR_HOME_URL: '/public/NEditor/',
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 300,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 关闭自动保存
                    enableAutoSave: false
                }
            };
        },
        computed: {
            ...mapState({
                sideCollapse: state => state.sideCollapse,
            }),
        },
        watch:{
            sideCollapse: function(value){
                utils.resizeMain(this, value, true)
            }
        },
        created(){
            this.serverUrl = this.$api.getUrl(this.$route.meta.model,this.$route.meta.permission.list)
        },
        mounted(){
            this.title = this.$route.name

            let that = this
            utils.resizeMain(that, this.sideCollapse, true)

            that.$api.request(that.$route.meta.model,that.$route.meta.permission.category,'post').then(function(res){
                if(res.code === 0){
                    that.category = res.data
                }else{
                    that.$Message.error(res.msg);
                }

            })

            //let that = this
            /*this.$nextTick(() => {
                utils.resizeMain(this, this.sideCollapse)
            })*/
            /*let currentWidth = document.documentElement.clientWidth - 220
            let currentHeight = document.documentElement.clientHeight - 240
            that.height = currentHeight
            that.width = currentWidth*/

        },
        /*beforeRouteLeave (to, from, next){
            next({name: to.name})
        },
        watch: {
            '$route' (to, from) {
                this.title = this.$route.name
                console.log(this.$route.name)
                this.routeParams = this.$route.fullPath
            }
        },*/
        /*updated(){
            utils.resizeMain(this, this.sideCollapse)
        },*/
        methods: {
            selectCategory: function(data,current){
                this.$refs.vcTable.filterForm[this.$route.meta.filter_field] = current.id
                this.$refs.vcTable.dataForm[""+this.$route.meta.filter_field+""] = current.id
                this.$refs.vcTable.currentPage = 1
                this.$refs.vcTable.refresh()
            },
            save: function (formData) {
                let that = this
                that.$api.request(that.$route.meta.model,that.$route.meta.permission.save,'post',formData).then(function(res){
                    if(res.code === 0){
                        that.$Message.success(res.msg)
                        that.$refs.vcTable.refresh()
                    }else{
                        that.$Message.error(res.msg);
                    }

                })
            },
            del: function (formData) {
                let that = this
                that.$api.request(that.$route.meta.model,that.$route.meta.permission.del,'post',formData).then(function(res){
                    if(res.code === 0){
                        that.$Message.success(res.msg)
                        that.$refs.vcTable.refresh()
                    }else{
                        that.$Message.error(res.msg);
                    }

                })
            },
        }
    }
</script>
