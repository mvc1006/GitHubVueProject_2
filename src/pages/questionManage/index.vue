<template>
  <div class="question-container">
    <my-title title="问题反馈"></my-title>
    <div class="header-filters">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search" placeholder="反馈ID/脚本名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.step" placeholder="全部状态">
            <el-option value=""  label="全部"></el-option>
            <el-option v-for="v in stepList" :key="v.value" :value="v.value" :label="v.name"></el-option>
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
          label="反馈ID"
          min-width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="script_name"
          label="问题脚本名称"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="script_id"
          label="脚本ID"
          min-width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="version"
          label="脚本版本号"
          min-width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="问题描述"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="email"
          label="联系邮箱"
          min-width="300"
          align="center">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="反馈时间"
          min-width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="steps"
          label="当前状态"
          min-width="200"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="200"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.step === 1" @click="selectPerson(scope.row)" type="text">分配用户</el-button>
            <el-button @click="handleClick(scope.row)" type="text">查看</el-button>
            <el-button @click="deleteFeedback(scope.row)" type="text">删除</el-button>
          </template>
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
      <!-- 查看弹框 -->
      <el-dialog
        title="问题反馈详情"
        :visible.sync="viewDialog"
        width="50%">
        <el-steps :active="currentStep-1" align-center>
          <el-step v-for="v in currentStepList" :key="v.value" :title="v.name" :description="v.date"></el-step>
        </el-steps>
        <div class="list">
          <el-table :data="listData" style="width: 100%">
            <el-table-column
              prop="id"
              label="反馈ID"
              >
            </el-table-column>
            <el-table-column
              prop="script_name"
              label="问题脚本名称"
              >
            </el-table-column>
            <el-table-column
              prop="script_id"
              label="脚本ID"
              >
            </el-table-column>
            <el-table-column
              prop="version"
              label="脚本版本号"
              >
            </el-table-column>
            <el-table-column
              prop="content"
              label="问题描述"
              >
            </el-table-column>
            <el-table-column
              prop="email"
              label="联系邮箱"
              >
            </el-table-column>
            <el-table-column
              prop="add_time"
              label="反馈时间"
             >
            </el-table-column>
            <el-table-column
              prop="steps"
              label="当前状态"
              >
            </el-table-column>
            <el-table-column
              v-if="listData.step >= 2"
              align="center"
              label="分配用户"
              >
              <template slot-scope="scope">
                {{scope.row.to_user_name}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 分配用户弹框 -->
      <el-dialog
        title="分配用户"
        :visible.sync="selectDialog"
        width="50%">
        <select-table :id="questionId" @cancel="selectDialog = false, refreshData()" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import selectTable from './selectTable'
export default {
  name: 'questionManage',
  components: {
    selectTable
  },
  data() {
    return {
      loading: false,
      viewDialog: false,
      selectDialog: false,
      total: 0,
      query: {
        script_name: '',
        id: '',
        step: '',
        size: 10,
        page: 1
      },
      stepList: [],
      tableData: [],
      listData: [],
      currentStep: null,
      currentStepList: [],
      search: '',
      questionId: '',
      stepObj: {}
    }
  },
  computed: {
    queryString: function () {
      return Object.keys(this.query).filter(key => this.query[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]))
        .join('&')
    }
  },
  async mounted() {
    await this.getSteps()
    this.getDataList()
  },
  methods: {
    refreshData: _.debounce(
      function() {
        this.getDataList()
      },
      800
    ),
    selectPerson(row) {
      this.questionId = row.id
      this.selectDialog = true
    },
    handleClick(row) {
      this.listData = []
      this.currentStepList = []
      this.listData.push(row)
      let dateArr = []
      switch(row.step) {
        case 1:
          dateArr = [row.add_time, '', '']
          break;
        case 2:
          dateArr = [row.add_time, row.to_user_time, '']
          break;
        case 3:
          dateArr = [row.add_time, row.to_user_time, row.reply_time]
          break;
        default:
          dateArr = ['', '', '']
          break;
      }
      this.stepList.map((v, i) => {
        this.currentStepList.push({
          value: v.value,
          name: v.name,
          date: dateArr[i]
        })
      })
      this.currentStep = row.step
      this.viewDialog = true
    },
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
       url:  `/report?${this.queryString}`,
        method: 'GET'
      }).then(res => {
        this.total = res.total
        this.query.page = res.page
        this.query.size = res.size
        res.list.map((v, i) => {
          res.list[i].steps = this.stepObj[v.step]
        })
        this.tableData = res.list
        this.loading = false
      }).catch(() => {
        this.$message.error('服务器通信错误')
      });
    },
    getSteps() {
      this.$http({
       url:  '/report/step',
        method: 'GET'
      }).then(res => {
        this.stepList = res
        if(this.stepList.length > 0) {
          this.stepList.map(v => {
            this.stepObj[v.value] = v.name
          })
        }
      }).catch(() => {
        this.$message.error('服务器通信错误')
      });
    },
    deleteFeedback(row) {
      this.$confirm('确认要删除这条反馈吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
         url:  `/api/report/${row.id}`,
          method: 'DELETE'
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message.error('服务器通信错误')
        });
      }).catch(err => {
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
          this.query.script_name = ''
        } else {
          this.query.script_name = this.search
          this.query.id = ''
        }
        this.refreshData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .question-container {
    .filters {
      margin-top: 20px;
    }
    .list {
      font-size: 14px;
      line-height: 2;
      margin-top: 20px;
    }
    .el-dialog {
      min-width: 888px;
    }
  }
</style>
