<template>
  <div class="article-container">
    <my-title title="文章管理"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="toCreate">新建文章</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="createdAt"
          label="发布日期"
          align="center"
          min-width="180">
          <template slot-scope="scope">
            {{scope.row.created_at | date}}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          align="center"
          min-width="200">
        </el-table-column>
        <el-table-column 
          fixed="right"
          label="操作"
          min-width="100"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editArticle(scope.row)">编辑/查看</el-button>
            <el-button class="del-btn" type="text" @click="deleteArticle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if='total > 0'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageIndex"
        :page-sizes="[10, 20, 30]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'articleManage',
  data () {
    return {
      tableData:[],
      total: 0,
      query: {
        pageSize: 10,
        pageIndex: 1
      }
    }
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query)
      .filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  created: function () {
    this.getArticle()
  },
  methods: {
    refreshData: _.debounce(
      function() {
        this.getArticle()
      },
      800
    ),
    getArticle() {
      this.$http.get(`/article?${this.queryString}`).then(res => {
        console.log(res)
        this.tableData = res.items
        this.total = res.total
        this.query.pageIndex = res.pageIndex
        this.query.pageSize = res.pageSize
      })
    },
    deleteArticle(row) {
      this.$confirm('操特么, 你删个试试?🏹', '🤨', {
        confirmButtonText: '我特么就删了',
        cancelButtonText: '我错了, 不行吗😥?',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: '/article',
          data: {
            id: row.id
          }
        }).then(res => {
          if(res !== false) {
            this.$message.success('删除成功!')
            this.refreshData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '怂不怂? 垃圾?'
        });          
      });

    },
    toCreate() {
      this.$router.push({ path: '/createArticle'})
    },
    editArticle(row) {
      this.$router.push({ path: '/editArticle', query: {
        id: row.id
      }})
    },
    handleSizeChange(val) {
      if (this.loading) {
        return false
      }
      this.query.pageSize = val
    },
    handleCurrentChange(val) {
      if (this.loading) {
        return false
      }
      this.query.pageIndex = val
    },
  },
  watch:{
    query: {
      handler: function() {
        this.refreshData()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.article-container {
 
}
</style>
