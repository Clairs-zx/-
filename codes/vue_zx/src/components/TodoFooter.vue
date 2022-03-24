<template>
  <div class="todo-footer"
       v-show="total">
    <label>
      <input type="checkbox"
             v-model="handleCheckd" />
    </label>
    <span>
      <span>已完成{{completed}}</span> / 全部{{total}}
    </span>
    <button class="btn btn-danger"
            @click="clearDone">清除已完成任务</button>
  </div>
</template>

<script>
export default {
  name: 'TodoFooter',
  props: ['todos', 'clearTodo'],
  computed: {
    total () {
      return this.todos.length
    },
    completed () {
      return this.todos.reduce((pre, todo) => pre + (todo.done ? 1 : 0), 0)
    },
    handleCheckd: {
      get () {  //依赖项发生变化时调用get
        return this.completed === this.total  //依赖两个计算属性，两个计算属性变化时调用get重新渲染
      },
      set (val) {  // 点击多选框就是被修改，修改时调用set ，调用函数实现当计算属性发生变化时要做的事情，
        this.$emit('changeDone', val)
      }
    }
  },
  methods: {
    clearDone () {
      this.$emit('clearTodo')
    }
  }
}

</script>

<style>
/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>