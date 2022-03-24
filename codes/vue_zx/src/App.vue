<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <TodoHeader @addTodo="addTodo" />
        <!--自定义事件传递数据-->
        <TodoList :todos="todos" />
        <!--数据总线和消息订阅传递数据-->
        <TodoFooter :todos="todos"
                    ref="footer" />
        <!--refs 自定义事件数据传递-->
      </div>
    </div>
  </div>
</template>

<script>
import TodoHeader from './components/TodoHeader'
import TodoList from './components/TodoList'
import TodoFooter from './components/TodoFooter'
import pubsub from 'pubsub-js'

export default {
  name: 'App',
  components: { TodoHeader, TodoList, TodoFooter },
  data () {
    return {
      todos: JSON.parse(localStorage.getItem('todos')) || []
    }
  },
  methods: {
    addTodo (todoObj) {
      this.todos.unshift(todoObj)
    },
    changeTodo (id) {
      this.todos.forEach((todo) => {
        if (todo.id === id) todo.done = !todo.done
      })
    },
    removeTodo (id) {
      this.todos = this.todos.filter((todo) => {
        return todo.id != id
      })
    },
    changeDone (val) {
      this.todos.forEach((todo) => {
        todo.done = val
      })
    },
    clearTodo () {
      this.todos = this.todos.filter((todo) => {
        return todo.done === false
      })
    }
  },
  watch: {
    todos: {
      deep: true,
      handler (newValue) {
        localStorage.setItem('todos', JSON.stringify(newValue))
      }
    }
  },
  mounted () {
    this.$refs.footer.$on('changeDone', this.changeDone)
    this.$refs.footer.$on('clearTodo', this.clearTodo)
    this.$bus.$on('changeTodo', this.changeTodo)
    // pubsub.subscribe('removeTodo', this.removeTodo)
    this.pubId = pubsub.subscribe('removeTodo', (msg, data) => {  //msg表示消息内容'removeTodo'
      this.todos = this.todos.filter((todo) => {
        return todo.id != data
      })
    })
    this.$bus.$on('updataTodo', (id, title) => {
      this.todos.forEach((todo) => {
        if (todo.id === id) todo.title = title
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('changeTodo')
    this.$bus.$off('updataTodo')
    pubsub.unsubscribe(this.pubId) //取消订阅，每次订阅消息的id都不同
  },
}
</script>

<style>
/*base*/
body {
  background: #fff;
}
.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}
.btn-edit {
  color: #fff;
  background-color: skyblue;
  border: 1px solid skyblue;
  margin-right: 5px;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}
.btn:focus {
  outline: none;
}
.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>