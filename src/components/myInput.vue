<template>
<div>
  <el-input :value="current" @input="toArr"></el-input>  
</div>  
</template>
<script>
export default {
  name: 'myInput',
  props: {
    theValue: {
      type: Array
    }
  },
  computed: {
    current: function () {
      return this.theValue.join(',')
    }
  },
  methods: {
    toArr: function(val) {
      this.$emit('input', val.split(','))
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
