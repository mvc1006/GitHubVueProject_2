<template>
  <div class="client-container">
    <my-title title="客户端管理"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="query.ip" placeholder="IP"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.city" placeholder="省份/位置"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.online" placeholder="全部在线状态">
            <el-option value=""  label="全部"></el-option>
            <el-option value="Y" label="在线"></el-option>
            <el-option value="N" label="离线"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table 
        :data="tableData" 
        style="width: 100%"
        v-loading="loading">
        <el-table-column 
          prop="id" 
          label="客户端ID" 
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          min-width="180"
          align="center">
        </el-table-column>
        <el-table-column 
          prop="province" 
          label="省份" 
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="city"
          label="位置"
          min-width="180">
        </el-table-column>
        <el-table-column 
          prop="update_time" 
          label="最后一次登录时间" 
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本号"
          min-width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="online"
          label="在线状态"
          min-width="180"
          align="center">
          <template slot-scope="scope">
            {{scope.row.online | online}}
          </template>
        </el-table-column>
        <el-table-column
          prop="enable"
          label="启用状态"
          min-width="180"
          align="center">
          <template slot-scope="scope">
            {{scope.row.enable | enable}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.enable==='Y'" type="text"  @click="disableAndEnable(scope.row, 'rejected')">禁用</el-button>
            <el-button v-else type="text" @click="disableAndEnable(scope.row, 'accepted')">启用</el-button>
          </template>
        </el-table-column> -->
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
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'clientManage',
  data() {
    return {
      loading: false,
      total: 0,
      query: {
        ip: '',
        city: '',
        online: '',
        page: 1,
        size: 10
      },
      tableData: []
    }
  },
  mounted() {
    this.getDataList()
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query).filter(key => this.query[key] !== '')
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
    getDataList() {
      this.loading = true
      this.$http({
       url:`/client?${this.queryString}`,
        method: 'GET'
      }).then(res => {
        this.query.page = res.page
        this.query.size = res.size
        this.total = res.total
        this.tableData = res.list
        this.loading = false
      }).catch(() => {
        this.$message.error('服务器通信错误')
      })
    },
    disableAndEnable(scope, status) {
      this.$confirm('确定要禁用此客户端吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          message: '已禁用',
          type: 'success'
        });
      }).catch(() => {
      });
    }
  },
  watch: {
    query: {
      handler: function () {
        this.refreshData()
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .client-container {
    .filters {
      margin-top: 20px;
    }
  }
</style>

