<template>
  <li>
    <label>
      <input type="checkbox"
             :checked="todo.done"
             @click="changeState" />
      <span v-show="!todo.isEdit">{{todo.title}}</span>
      <input type="text"
             v-show="todo.isEdit"
             :value="todo.title"
             @blur="handleBlur(todo,$event)"
             ref="inputTitle">
    </label>
    <button class="btn btn-danger"
            @click="remove">删除</button>
    <button class="btn btn-edit"
            v-show="!todo.isEdit"
            @click="handleEdit(todo)">编辑</button>
  </li>
</template>

<script>
import pubsub from 'pubsub-js'
export default {
  name: 'TodoItem',
  props: ['todo'],
  methods: {
    changeState () {
      this.$bus.$emit('changeTodo', this.todo.id)
    },
    remove () {
      pubsub.publish('removeTodo', this.todo.id)

    },
    handleEdit (todo) {
      // todo.isEdit = true  //vue 监测不到变化
      if (Object.prototype.hasOwnProperty.call(todo, 'isEdit')) {   //  todo.keys.indexOf('isEdit')  todo.hasOwnProperty('isEdit') eslint报错
        todo.isEdit = true
      } else {
        console.log("@")
        this.$set(todo, 'isEdit', true)  //this是组件实例对象vc，其上有个方法$set可以设置data中数组数据中对象属性值。
      }
      // this.$refs.inputTitle.focus()   //获取焦点 （此时还没有渲染呢，所以还没有input元素呢，不能获取焦点）

      /* 设置定时器实现*/
      // setTimeout(() => {       
      //   this.$refs.inputTitle.focus()
      // }, 200)	
			
      /*所指定的回调函数可以在DOM节点更新后再执行 */
      this.$nextTick(function () {
        this.$refs.inputTitle.focus()
      })


    },
    handleBlur (todo, e) {
      todo.isEdit = false
      if (!e.target.value.trim()) return alert('输入不能为空')
      this.$bus.$emit('updataTodo', todo.id, e.target.value)
    }
  }
}
</script>

<style scoped>
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
li:hover {
  background-color: #ddd;
}
li:hover button {
  display: block;
}
</style>