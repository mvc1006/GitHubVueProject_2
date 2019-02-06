<template>
  <div class="control-table">
    <div class="control-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search" placeholder="ID/用户名"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span class="info">将反馈问题分配至以下用户</span>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          label="选择"
          width="55"
          align="center">
          <template slot-scope="scope">
            <el-radio class="radio"  :label="scope.row.id" v-model="select">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="用户ID"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色"
          align="center">
        </el-table-column>
        <el-table-column
          prop="script_count"
          label="当前任务数量"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        v-if='total > 0'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[10, 20, 30]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div class="btn-group">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save()">确定</el-button>
    </div>
  </div>
 
</template>
<script>
import _ from 'lodash'
export default {
  name: 'selectTable',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      tableData:[],
      total: 0,
      query: {
        page: 1,
        size: 10,
        name: '',
        id: '',
        roletype: 3
      },
      search: '',
      select: '',
      roleList: [],
      roleObj: {}
    }
  },
  created() {
    this.getDataList()
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query)
      .filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  methods: {
    refreshData: _.debounce(
      function () {
        this.getDataList()
      },
      800
    ),
    handleSizeChange(val) {
      if (this.loading) {
        return false
      }
      this.query.size = val
    },
    handleCurrentChange(val) {
      if (this.loading) {
        return false
      }
      this.query.page = val
    },
    cancel: function() {
      this.userForm = {}
      this.$emit('cancel')
    },
    async getDataList() {
      this.loading = true
      // 先role
      await this.$http({
       url:  '/user/role',
        method: 'GET'
      }).then(res => {
        this.roleList = res.list
        if(this.roleList.length > 0) {
          this.roleList.map(v => {
            this.roleObj[v.id] = v.role_name
          })
        }
      }).catch(() => {
        this.$message.error('服务器通信错误')
      })
      // 再渲染表格
      this.$http({
        url:`/user?${this.queryString}`,
        method: 'GET'
      }).then(res => {
        this.query.page = res.page
        this.query.size = res.size
        this.total = res.total
        let obj = {}
        console.log(this.roleObj)
        res.list.map((v, i) => {
          res.list[i].role = this.roleObj[v.roletype]
        })
        this.tableData = res.list
        this.loading = false
      }).catch(() => {
        this.$message.error('服务器通信错误')
      });
    },
    save() {
      this.$http({
       url:  '/report/step',
        method: 'POST',
        data: {
          to_user: this.select,
          id: this.id
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '分配成功!'
        })
        this.$emit('cancel')
      }).catch(() => {
        this.$message.error('服务器通信错误')
      })
    }
  },
  watch: {
    query: {
      handler: function () {
        this.refreshData()
      },
      deep: true
    },
    search: {
      handler: function() {
        if(/^[0-9]*$/.test(this.search)) {
          this.query.id = this.search
          this.query.name = ''
        } else {
          this.query.name = this.search
          this.query.id = ''
        }
        this.refreshData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.control-table  {
  .control-filters {
    text-align: left;
  }
  .table {
    margin-top: 10px;
  }
  .btn-group {
    text-align: right;
    margin-top: 20px;
  }
}

</style>