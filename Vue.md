# Vue知识点提要

[TOC]

#  [Vue基础](https://cn.vuejs.org/v2/guide/index.html)

## [实例创建](https://cn.vuejs.org/v2/guide/instance.html)

Vue创建实例对象使用new 接受一个参数称为==配置对象==

```html
<div id="demo">
	<h1>Hello，{{name.toUpperCase()}}，{{address}}</h1>  //Vue模板 
</div>
```

```javascript
let vm = new Vue ({
  el:'#root',
  //data的对象式写法
  data:{   
    name:'zx',
    address:'Hangzhou'
  }
});
```

另一种写法：

```javascript
let vm = new Vue ({
    //data的函数式写法，必须要return一个对象
    data(){   
        return {
            name:'zx',
            address:'Hangzhou'
        }
    }
});
vm.$mount('#root');
```

### `data`与`el`的2种写法
1. `el`有2种写法
	(1). new Vue时候配置`el`属性。
	(2). 先创建Vue实例，随后再通过`vm.$mount('#root')`指定`el`的值。
	
2. `data`有2种写法
	(1). 对象式
	(2). 函数式
	
3. ==一个重要的原则==：由Vue管理的函数，一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例了。

   

## [模板语法](https://cn.vuejs.org/v2/guide/syntax.html)

Vue模板语法主要有两类：插值语法和指令语法

1. 插值语法：

   功能：用于解析**标签体**内容

   写法：`{{xxx}}`，`xxx`是 ***js表达式***  ，并且xxx可以直接读取到实例对象的data对象中的所有属性，不需要写`vm.data`；

   注意区分：js表达式和js代码（语句）

   1. js表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方：
      - 变量：`a`
      - 运算：`a+b`
      - 函数调用：`fun（1）`
      - 条件操作符：`x === y ? 'a' : 'b'`
   2. js代码（语句）
      - `if`语句
      - `for语句` ， `for-in` ，`for-of`
      - `do-while语句`   `while语句`
   
2. 指令语法 ：

	功能：用于解析标签（包括标签属性、标签体内容、绑定事件等）
	
	写法：`v-bind:` , `v-model`, `v-if`...
## 数据绑定
Vue中主要有两种数据绑定：`v-bind` 和 `v-model` ,两者的区别在于`v-bind`实现的是数据的单向绑定，即数据只能从`data`流向页面；`v-model`实现的是数据的双向绑定，data可以在页面和data之间双向流动，改变两者其中任意一个值另一个也会有变化。
**注意：v-model 只能应用在表单类元素上，**

1. 单向数据绑定的写法
```javascript 
<input type='text' v-bind:value='name'> 
//单向数据绑定v-bind的普通写法，value是要绑定的标签属性，name是data对象中的属性，可直接访问。
<input type='text' :value='name'> //单向数据绑定的简写形式，v-bind可以省略
```
2. 双向数据绑定的写法
```javascript
<input type='text' v-model:value='name'> //双向数据绑定的一般写法
<input type='text' v-model='name'>  //简写，因为v-model默认绑定value属性，所以可以省略。
```
## MVVM  模型

[浅谈Vue中的MVVM模型](https://segmentfault.com/a/1190000037430605)

### MVVM模型

<img src="https://cdn.nlark.com/yuque/0/2022/jpeg/1379492/1643097677438-36b4834c-18e8-4cd0-aa8e-c5f154e6bde0.jpeg?x-oss-process=image%2Fresize%2Cw_697%2Climit_0" style="zoom: 67%;" />



## 数据代理
数据代理：通过一个对象代理对另一个对象中的属性的操作（读/写）

### `Object.defineProperty`方法：
```javascript
let number = 18
let person = {
	name:'张三',
	sex:'男',
}
Object.defineProperty(person,'age',{
	// value:18,
	// enumerable:true, //控制属性是否可以枚举，默认值是false
	// writable:true, //控制属性是否可以被修改，默认值是false
	// configurable:true //控制属性是否可以被删除，默认值是false
	
	//当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
	get(){
		console.log('有人读取age属性了')
		return number
	},
	
	//当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
	set(value){
		console.log('有人修改了age属性，且值是',value)
		number = value
	}
})
	// console.log(Object.keys(person))
```

### Vue中的数据代理
[Vue中的数据代理](https://juejin.cn/post/7029511992708694052)

1. Vue中的数据代理通过`vm`对象来代理data对象中的属性。
2. 基本原理：通过`Object.defineProperty()`把`data`对象中的所有属性添加到`vm`对象上，为每一个添加到`vm`对象上的属性都制定一个`getter/setter` ，在`getter``setter`内部去操作`data`中对应的属性。 `vm`对象上存放`data`属性的地方为`_data`.

<img src="https://cdn.nlark.com/yuque/0/2022/png/1379492/1643033436297-5d2d61ec-ed69-4706-a98d-afdbd53b383d.png?x-oss-process=image%2Fresize%2Cw_750%2Climit_0" style="zoom:80%;" />


## [事件处理](https://cn.vuejs.org/v2/guide/events.html)
### 事件的基本使用

1. 使用`v-on:xxx` 或 `@xxx`绑定事件，其中`xxx`就是事件名。
2. 事件的回调需要配置在`methods`对象中，最终会在`vm`实例对象上。
3. `methods`中配置的函数，不要使用箭头函数，否则`this`就不是`vm`了，可能是`window`
4. `methods`中配置的函数，都是被`Vue`所管理的函数，`this`指向就是`vm`或`组件实例对象`
5. `@click="func"`和`@click="func($event)"`效果一致，但后者可以传参。
```html
<body>
  <div id="root">
    <h3>欢迎来看{{name}}的Vue学习笔记</h3>
    <button @click=“showInfo”>点我提示信息</button>
    <button @click=“showInfo2($event,6)”>点我提示信息</button>
  </div>
  <script type="text/javascript">
      new Vue({
       el:'#root',
       data(){
         return {name:'zx'}},
       methods:{
         showInfo(event){
           console.log(event.target.innerText); //点我提示信息
           console.log(this);},   // Vue{}
         showInfo2(event,number){
           console.log(number);}}  //6
     })
  </script>
</body>
```

### 事件修饰符
1. `prevent`：阻止默认事件（常用，链接跳转）；
2. `stop`：阻止事件冒泡（常用）；
3. `once`：事件只触发一次（常用）；
4. `capture`：使用事件的捕获模式：加了`capture`的元素事件在事件捕获阶段执行；
5. `self`：加了`self`的元素，只有当`event.target`是当前操作的元素时才触发事件；（也可以阻止冒泡） ;
6. `passive`：事件的默认行为立即执行，无需等待事件回调函数执行完毕（移动端开发会用到）
```html
<div id="root">
<!-- 阻止默认事件（常用） -->
<a href="http://www.atguigu.com" @click.prevent="showInfo">点我提示信息</a>

 <!-- 阻止事件冒泡（常用） -->
 <div @click="showInfo">
   <button @click.stop="showInfo">点我提示信息</button>
 </div>

 <!-- 阻止默认事件和事件冒泡连用 -->
 <div @click="showInfo">
   <a href="#" @click.prevent.stop="showInfo">点我提示信息</a>
 </div>

 <!-- 事件只触发一次（常用） -->
 <button @click.once="showInfo">点我提示信息</button>

 <!-- 使用事件的捕获模式 (捕获阶段处理事件)-->   
 <div class="box1" @click.capture="showMsg(1)">div1   
   <div class="box2" @click="showMsg(2)">div2
   </div>
 </div>

  <!-- 加了self的元素，只有当event.target是当前操作的元素时才触发事件；（也可以阻止冒泡） -->
  <div @click.self="showInfo">
   <button @click="showInfo">点我提示信息</button>
 </div>

 <!-- 事件的默认行为立即执行，无需等待事件回调执行完毕； -->
 <!-- @scroll：滚动条的滚动事件，@wheel鼠标滚轮滚动事件。-->
 <!-- 不加passive：先执行调用函数，等待调用函数执行完在执行默认行为即滚轮下滑-->
 <!-- 加passive：滚轮立即下滑，无需等待事件回调执行完毕-->
  <ul @wheel.passive="demo" class="list">   
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
  </ul>
</div>

<script>
	new Vue ({
		el:'#root',
		data(){
			return {name: 'zx'}},
		methods: {
			showInfo (event) {
        //event.preventdefault();  //阻止默认事件
        //event.stoppropagation(); //阻止事件冒泡
				console.log(this.name);}},  //zx
    	showMsg (msg) {
        console.log(msg);},
      demo(){
            for (let i = 0; i < 100000; i++) {
              console.log('#')}
            console.log('累坏了')},
	})
</script>
```

### 键盘事件

1. Vue中常用的按键别名：

    ​    回车 => `enter`
    ​	删除 => `delete` (捕获“删除”和“退格”键)
    ​	退出 => `esc`
    ​	空格 => `space`
    ​	换行 => `tab` (特殊，必须配合keydown去使用)
    ​	上 => `up`
    ​	下 => `down`
    ​	左 => `left`
    ​	右 => `right`

2. `Vue`未提供别名的按键，可以使用按键原始的`key`值去绑定，但注意要转为`kebab-case`（短横线命名）

3. 系统修饰键（用法特殊）：`ctrl`、`alt`、`shift`、`meta`
   (1). 配合`keyup`使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
   (2). 配合`keydown`使用：正常触发事件。

4. 也可以使用`keyCode`去指定具体的按键（不推荐）

5. `Vue.config.keyCodes.自定义键名 = 键码`，可以去定制按键别名 .

```html
<body>
   <div id="root">
         <h2>欢迎打开{{name}}笔记</h2>
         <input type="text" placeholder="按下回车提示输入" @keyup.enter="showInfo"><br/>
         <input type="text" placeholder="按下tab提示输入" @keydown.tab="showInfo"><br/>
         <input type="text" placeholder="按下回车提示输入" @keydown.huiche="showInfo"><br/>
   </div>

   <script type="text/javascript">
         Vue.config.productionTip = false	// 阻止 vue 在启动时生成生产提示。
         Vue.config.keyCodes.huiche = 13		// 定义了一个别名按键

         new Vue({
           el: '#root',
           data: {
             name: 'cess'
           },
           methods: {
             showInfo(e) {
               // console.log(e.key,e.keyCode)
               console.log(e.target.value)
             }
           },
         })
   </script>
</body>
```

## [计算属性](https://cn.vuejs.org/v2/guide/computed.html)

### 插值语法实现姓名案例

```html
<div id="root">
    姓：<input type="text" v-model="firstName"> <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    全名：<span>{{firstName}}{{lastName}}</span>
</div>

<script type="text/javascript">
	Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
    new Vue ({
     el:'#root',
     data () {
       return { 
         firstName: 'zhang',
         lastName: 'xin'}}})
</script>
```

### `methods`方法实现姓名案例

```html
<div id="root">
    姓：<input type="text" v-model="firstName" > <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    全名：<span>{{fullName()}}</span>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
    new Vue ({
         el:'#root',
         data () {
             return { 
                 firstName: 'zhang',
                 lastName: 'xin'}},
         methods: {
         	fullName () { // data中的任意一个数据发生变化，Vue模板都会重新解析。当解析到函插值语法中的函数fullname时会重新调用。
            	return this.firstName + ' ' + this.lastName}}
    })
</script>
```

### 计算属性实现姓名案例  

```html
<div id="root">
    姓：<input type="text" v-model="firstName" > <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    全名：<span>{{fullName}}</span>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
    new Vue ({
        el:'#root',
        data () {
             return { 
                 firstName: 'zhang',
                 lastName: 'xin'}},
        <!--计算属性的完整写法 -->
        computed: {  
            fullname: {  
                get () {
                    return this.firstName + '' + this.lastName},
                set (value) {
                    const arr = value.split('')
                    this.firstName = arr[0]
                    this.lastName = arr[1]}}
        }
        <!-- 计算属性的简写-->
        <!--简写的前提是确定该计算属性只需要get（）-->
        computed: {
            fullName () {   //computed中的计算属性表面上看是个函数，但其实是一个对象，当解析的时会先获取getter计算出该属性的值，并将该计算属性作为属性（不是对象）放到vm身上。  属性的key是计算属性，value是getter获取到的值
                return  this.firstName + ' ' + this.lastName}}
    })
</script>
```
#### 计算属性：
1. 属性：`Vue`认为`data`对象里配置的都是属性

2. 定义： 模板中要用的属性不存在，需要通过已有的属性（注意不是变量）计算得来

3. 原理：底层借助了`Object.defineproperty`方法提供的`getter`和`setter`实现。

4. `get`函数什么时候执行？
    - 初次读取时会执行一次。
    - 当依赖的数据发生改变时会被再次调用。
5. 优势： 与`methods`实现相比，内部又缓存机制（复用），效率更高，调试方便
6. **备注**： 

    - 计算属性最终会出现在`vm`上，直接读取即可使用。

    - 如果计算属性要被修改，那必须写`set`函数去相应修改，且`set`函数中要引起计算时**依赖数据**发生改变


## [侦听器](https://cn.vuejs.org/v2/guide/computed.html#%E4%BE%A6%E5%90%AC%E5%99%A8)

### `methods`和`computed`实现天气案例

```html
<div id="root">
    <h3>今天天气很{{info}}</h3>
    <button @click="changeWeather">点击切换天气</button>
    <!-- 绑定事件的时候：@xxx="yyy" yyy可以写一些简单的语句 -->
    <!-- <button @click="isHot = !isHot">点击切换天气</button> -->
</div>

<script type="text/javascript">
    new Vue ({
        el:'#root',
        data () {
            return {
            	isHot : true}},
        computed : {
            info () {
            	return this.isHot ? '炎热' : '凉爽'}},
        methods: {
        	changeWeather () {
        		this.isHot = ! this.isHot}}
    })
</script>
```


### 侦听属性`watch`实现天气案例
```html
<div id="root">
	<h3>今天天气很{{info}}</h3>
	<button @click="changeWeather">点击切换天气</button>
</div>

<script type="text/javascript">
    const vm = new Vue ({
        el: '#root',
        data () {
            return {
                isHot: true,
                info: '炎热'}},
        methods: {
            changeWeather () {
            	this.isHot = !this.isHot }},

        /* watch的第一种写法*/
        watch: {
        	isHot: {
        		immediate: true,  // 初始化的时候让handler调用一下
        		handler (newValue,oldValue) {   // 当isHot发生变化的时候调用
        			console.log(`isHot被改变了 ${oldValue} -> ${newValue}`)
        			this.info = this.isHot ? '炎热' : '凉爽' }},
        /* watch 侦听对象在除了handler没有其他属性的情况下可以简写 */
            isHot (newValue, oldValue) {
            console.log(`isHot被改变了 ${oldValue} -> ${newValue}`)
            this.info = this.isHot ? '炎热' : '凉爽' }
		}
    })

    /* watch的第二种写法 */
    vm.$watch ('isHot', {
        immediate: true,
        handler () {
            console.log(`isHot被改变了 ${oldValue} -> ${newValue}`)
            this.info = this.isHot ? '炎热' : '凉爽' }}}}
    })
    /* 第二种写法的简写 */
    vm.$watch('isHot' (newValue, oldValue) => {
        console.log(`isHot被改变了 ${oldValue} -> ${newValue}`)
        this.info = this.isHot ? '炎热' : '凉爽' }}}}
    })

</script>
```


### 侦听属性`watch`
1. 当被侦听的属性发生变化时，回调函数`handler`自动调用进行相关的操作。
2. 侦听的属性名必须存在才能进行侦听，即可以侦听`data`可以侦听计算属性`computed`
3. 侦听的两种写法：

   - `new Vue`时传入`watch:{}`配置

   - 通过`vm.$watch(属性名，{配置信息})`侦听

4. 配置项属性`immediate`默认值为`false`，改为`true`则初始化时调用一次`handler(newValue,oldValue)`

5. 侦听的作用：记录数据的变化

-   ### 深度侦听

1. `Vue`中的`watch`默认不侦听对象内部的值得改变（只侦听一层）
2. 配置`deep:true`可以侦听对象内部值得改变（可以侦听多层）
3. **注意** ：
     - `Vue`自身可以监测对象内部值得改变，但`Vue`提供的`watch`默认不可以
     - 使用`watch`时根据数据的具体结构决定是否采用深度监视
```html
<div id="root">
    <h3>a的值是：{{number.a}}</h3>
    <button @click="number.a++">点我让a+1</button>
    <h3>b的值是：{{number.b}}</h3>
    <button @click="number.b++">点我让b+1</button>
</div>

<script type="text/javascript">
    new Vue ({
        el: '#root',
        data () {
			return {
				number : {
				a: 1,
				b: 2}}},
        watch: {
			'number.a': {
				handler () {
					console.log('a 的值改变了')}},
			number: {
				deep: true,  //deep是监听numbers属性值是都发生变化，numbers属性值是对象的地址，所以只要地址不变就监听不到。加上deep就是监视地址内部内容的变化
				handler () {
					console.log('number内部的值被改变了')}}}
    })
</script>
```

### 计算属性和监视属性的区别

*`computed`和`watch`之间的区别：*

1.  `computed`属性能完成的功能，`watch`都能完成，`computed`属性更简单些
2.  `watch`能完成的功能，`computed`不一定能完成，例如：`watch`可以进行异步操作的实现。 （`computed`属性在变化时立即执行，不能实现异步）

*两个重要的原则*：

1. 所被`Vue`管理的函数，最好都写成普通函数的形式，这样`this`的指向才是`vm`或`组件实例对象`。
2. 所有不被`Vue`所管理的函数（定时器的回调函数，`ajax`的回调函数，`Promise`的回调函数）写成箭头函数，这样`this`的指向才是`vm` 或 `组件实例对象`。

*`watch`异步操作实现名字案例*

```js
const vm = new Vue({
	el:'#root',
	data:{
		firstName:'张',
		lastName:'三',
		fullName:'张-三'},
	watch:{
		firstName(val){
			setTimeout(()=>{
				console.log(this)
				this.fullName = val + '-' + this.lastName
			},1000); },
		lastName(val){
			this.fullName = this.firstName + '-' + val}
		}
})
```

## [绑定样式](https://cn.vuejs.org/v2/guide/class-and-style.html)
1. `class`样式：
    写法：`:class="xxx"` `xxx`可以是字符串、数组、对象
    - 字符写法串适用场景：类名不确定，要动态获取
    - 对象写法适用场景：要绑定多个样式，样式库的样式个数确定，类名也确定，但动态决定用不用
    - 数组写法适用场景：要绑定多个样式，个数不确定，类名也不确定
2. `style`样式：
    写法：
    - `:style="fontSize:xxx"` 其中`xxx`是动态值。
    - `:style="[a,b]"`其中`a`,`b`是样式对象，样式对象指对象的`key`是存在的

### 绑定样式代码示例

```html
<div id="root">
    <!-- 字符串绑定class样式 -->
    <button class="basic" :class="moods[moodIndex]" @click="changeMood">点击切换类别</button>
    <!-- 数组绑定class样式 -->
    <div class="basic" :class="classArr">数组形式绑定样式</div>
    <!-- 对象绑定class样式 -->
    <div class="basic" :class="classObj">对象形式绑定class样式</div>
    <!-- 对象绑定style样式-->
    <div class="basic" :style="styleObj">对象形式绑定style样式</div>
    <!-- 数组绑定style样式-->
    <div class="basic" :style="styleArr">数组形式绑定style样式</div>
</div>

<script type="text/javascript">
	new Vue ({
        el: '#root',
        data: {
            moodIndex: 0,
            moods: ['happy', 'sad', 'nomal'],
            classArr: ['class1', 'class2', 'class3'], //需要那种样式就写哪种样式
            classObj: {
                class1: true,
                class2: false},
            styleObj: {
                fontSize: '40px',
                color: 'red'
            },
            styleArr: [
                {
                    fontSize: '40px',  //属性转为驼峰命名，属性值以字符串形式表示
                    color: 'blue'},
                {
                    backgroundColor: 'gray'}]
        },
        methods: {
            changeMood () {
                this.moodIndex = Math.floor((this.moodIndex + 1 ) % 3 ) 
            }
        }
    })
</script>
```

## [条件渲染](https://cn.vuejs.org/v2/guide/conditional.html)

### `v-if`条件渲染

1. 写法：
    - `v-if="表达式"`
    - `v-else-if="表达式"`
    - `v-else="表达式"`
2. 适用条件：切换频率较低的场景，因为不展示的`DOM`元素直接被移除
3. 注意：`v-if`可以和`v-else-if`一起使用，但要求结构不能被打断，在使用`v-if`时元素不一定能获取到。


### `v-show`条件渲染

1. 写法： `v-show="表达式"`
2. 适用于：切换频率较高的场景
3. 特点：不展示的`DOM`元素未被移除，仅仅是使用样式隐藏掉，使用`v-show`时元素一定可以获取到

### `template`和`v-if`配合使用

当数个相关元素需要同时显示和隐藏时可以用`template`和`v-if`搭配使用

**注意**：`template`标签不影响`DOM`结构，`html`中不会有此标签，只能时`v-if`不能是`v-show`

代码示例：

```html
<template v-if="true">
	<h2>你好</h2>
	<h2>尚硅谷</h2>
	<h2>北京</h2>
</template>
```

## [列表渲染](https://cn.vuejs.org/v2/guide/list.html)

### 基本列表

`v-for`指令：

1. 用于展示列表数据
2. 语法：`v-for="(item index) in xxx" :key="yyy"`
3. 可遍历：数组、对象、字符串、指定次数

### `key`的原理

<img src="https://cdn.nlark.com/yuque/0/2022/png/1379492/1643033767087-2558e992-b48b-4b54-a9b8-86eb8534bd98.png" style="zoom: 35%;" />

<img src="https://cdn.nlark.com/yuque/0/2022/png/1379492/1643033764359-6a37a493-bb51-4b3b-8b14-822a3df68d6e.png?x-oss-process=image%2Fresize%2Cw_750%2Climit_0" style="zoom:80%;" />

1. 虚拟``DOM`中`key`的作用：
    `key`是虚拟`DOM`对象的标识，当数据发生变化时，`Vue`会根据【新数据】生成【新的虚拟`DOM`】, 随后`Vue`进行【新虚拟`DOM`】与【旧虚拟`DOM`】的差异比较

    比较规则如下：

    (1). 旧虚拟`DOM`中找到了与新虚拟`DOM`相同的`key`：

    -   若虚拟`DOM`中内容没变, 直接使用之前的真实`DOM`！
    -   若虚拟`DOM`中内容变了, 则生成新的真实`DOM`，随后替换掉页面中之前的真实`DOM`。

    (2). 旧虚拟`DOM`中未找到与新虚拟`DOM`相同的`key`：

    - 创建新的真实`DOM`，随后渲染到到页面。

2. 用`index`作为`key`可能会引发的问题：
    1. 若对数据进行逆序添加、逆序删除等破坏顺序操作: 会产生没有必要的真实`DOM`的更新 ==> 界面效果没问题, 但效率低。
    2. 如果结构中还包含输入类的`DOM`：会产生错误`DOM`更新 ==> 界面有问题。

3. 开发中如何选择`key`?:
    1. 最好使用每条数据的唯一标识作为`key`, 比如id、手机号、身份证号、学号等唯一值。
    2. 如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用`index`是没问题的

### 列表过滤和排序

```html
<div id="root">
	<h2>人员列表</h2>
	<input type="text" placeholder="请输入名字" v-model="keyWord">
	<button @click="sortType=2" >年龄升序</button>
	<button @click="sortType=1" >年龄降序</button>
	<button @click="sortType=0" >原顺序</button>
	<ul>
		<li v-for="(p,index) of filPerons" :key="index">{{p.name}}-{{p.age}}-{{p.sex}}</li>
	</ul>
</div>

<script type="text/javascript">
	Vue.config.productionTip = false
	/* 用watch实现 */
	new Vue({
        el:'#root',
        data:{
            keyWord:'',
            persons:[
                {id:'001',name:'马冬梅',age:19,sex:'女'},
                {id:'002',name:'周冬雨',age:20,sex:'女'},
                {id:'003',name:'周杰伦',age:21,sex:'男'},
                {id:'004',name:'温兆伦',age:22,sex:'男'}],
            filPerons:[],
            sortType: 0},
        watch:{
            keyWord:{
                immediate:true,  // 'abd'.indexOf('') === 0 
                handler(val){  
                     const arr = this.persons.filter((p)=>{
                        return p.name.indexOf(val) !== -1
                    })
                    if(this.sortType){
                        arr.sort((p1, p2) => {
                            return this.sortType === 1 ? p2.age - p1.age : p1.age - p2.age
                        })
                    }
                    this.filPersons = arr
                }}}
    }) 
			
	/* 用computed实现 */
    new Vue({
        el:'#root',
        data:{
            keyWord:'',
            persons:[
                {id:'001',name:'马冬梅',age:19,sex:'女'},
                {id:'002',name:'周冬雨',age:20,sex:'女'},
                {id:'003',name:'周杰伦',age:21,sex:'男'},
                {id:'004',name:'温兆伦',age:22,sex:'男'}
            ]},
        computed:{
            filPerons () {
                const arr =  this.persons.filter((p)=>{  //filter不改变原数组，其返回一个挑选的数组
                    return p.name.indexOf(this.keyWord) !== -1
                })
                if(this.sortType){
                        arr.sort((p1, p2) => {
                            return this.sortType === 1 ? p2.age - p1.age : p1.age - p2.age
                        })
                 }
                return arr}}
    }) 
</script>
```



### `Vue`监测数据改变的原理

#### 模拟数据监测
```js
let data = {
	name: 'Tom',
	age: 18
}
let obs = new Observer(data)  //创建一个监视的实例对象，用于监视data中属性的变化

let vm = {}
vm._data = data = obs

function Observer(obj) {
	const keys = Object.keys(obj)
	keys.forEach((k) => {
		Object.defineproprety(this, k, {
			get () {
				return obj[k]
			},
			set (val) {
				console.log(`${k}被修改了，我要重新解析模板，生成虚拟DOM，和旧DOM对比。。。。`) //通过set实现监控
				obj[k] = val
			}
		})
	})
}
```

#### `Vue`如何监测对象中的数据？
- 通过`setter`实现监控，且要在创建`Vue`实例的时候就传入要监测的数据。
- 对象中后追加的属性，`Vue`默认不做响应式处理
- 如需给后添加的属性做响应式，请使用如下API：
    - `Vue.set(target, propertyName/index, value)`
    - `vm.$set(target, propertyName/index, value)`

#### `Vue`如何监测数组中的数据？
- 通过包裹数组更远元素的方法实现，本质是做了两件事：
    - 调用原生对象的方法对数组进行更新。
    - 重新解析模板，进而更新页面

#### 在`Vue`中修改数组中的某个元素一定要用如下方法
1. 使用数组API：`push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`
2. `Vue.set()` 或 `vm.$set()`  ==特别注意这俩不能给vm或vm的根数据对象data添加属性==
#### 数据劫持：
将`data`中的属性添加`getter`和`setter`，让`vue`检测到数据的变化，劫持和代理都是由`Object.definepropety`定义的。

#### `Vue`数据监控总结代码示例
```html
<div id="root">
    <h3>学生信息</h3>
    <h3>姓名：{{student.name}}</h3>
    <h3>年龄：{{student.age}}</h3>
    <h3 v-if="student.sex">性别：{{student.sex}}</h3>
    <h3>爱好：</h3>
    <ul>
        <li v-for="(h,i) of student.hobbys" :key="i">{{h}}</li>
    </ul>
    <h3>朋友们：</h3>
    <ul>
        <li v-for="(f,i) of student.fridens" :key="f.id">{{f.name}}-{{f.age}}</li>
    </ul>
    <button @click="student.age ++ ">年龄加1</button> <br/>
    <button @click="addSex">添加性别属性，默认值是：男</button><br/>
    <button @click="changeSex">修改性别</button><br/>
    <button @click="addFriend">在列表首位添加一位朋友</button><br/>
    <button @click="changeFirstFriendName">修改第一个朋友的名字</button><br/>
    <button @click="addHobby">添加一个爱好</button><br/>
    <button @click="filterHobby">过滤掉爱好中的抽烟</button><br/>
    <button @click="changeFirstHobby">修改第一个爱好为开车</button><br/>
</div>

<script type="text/javascript">
    const vm = new Vue ({
        el: '#root',
        data: {
            school: {
                name: 'HDU',
                address: '杭州'},
            student :{
                name: '李四',
                age: 20,
                hobbys: ['抽烟','喝酒','烫头'],
                fridens: [
                    {id:'1', name:'jerry', age:35},
                    {id:'2', name:'tony', age:36}]}},
        methods: {
            addSex () {
                vm.$set(this.student,'sex','男')
                Vue.set(this.student,'sex','男')},
            changeSex () {
                this.student.sex = '女'},
            addFriend () {
                this.student.fridens.unshift({
                    id:'3', name: 'tom', age:40 })},
            changeFirstFriendName () {
                this.student.fridens[0].name = 'tim'//最终修改的是对象属性，因此可以通过索引查找定位},
            addHobby () {
                this.student.hobbys.push('学习')},
                // 这里的push !== Array.prototype.push ，这里的push是封装好的带有getter和setter的push
            filterHobby () {
                this.student.hobbys = this.student.hobbys.filter((hobby) => {
                     return hobby !== '抽烟'})
                
                this.student.hobbys.splice(this.student.hobbys.indexOf('抽烟'), 1)},
            changeFirstHobby () {
                this.student.hobbys.splice(0, 1, '开车')
                Vue.set(this.student.hobby,0,'开车')
                this.$set(this.student.hobby,0,'开车')}}
    })
</script>
```

## [表单输入绑定](https://cn.vuejs.org/v2/guide/forms.html)
收集表单数据：
- 若：`<input type="text"/>`，则`v-model`收集的是`value`值，用户输入的就是`value`值。
- 若：`<input type="radio"/>`，则`v-model`收集的是`value`值，且要给标签配置`value`值。
- 若：`<input type="checkbox"/>`
	- 没有配置`input`的`value`属性，那么收集的就是`checked`（勾选 or 未勾选，是布尔值）
	- 配置`input`的`value`属性:
		1. `v-model`的初始值是非数组，那么收集的就是`checked`（勾选 or 未勾选，是布尔值）
		2. `v-model`的初始值是数组，那么收集的的就是`value`组成的数组

备注：`v-model`的三个修饰符：

- `lazy`：失去焦点再收集数据 (`textarea`中使用)
- `number`：输入字符串转为有效的数字，收集表单默认为字符串，所以需要数字时需要使用`number`修饰符
- `trim`：输入首尾空格过滤

```html
<div id="root">
    <form @submit.prevent="demo">
        账号：<input type="text" v-model.trim="userInfo.account"> <br/><br/>
        密码：<input type="password" v-model="userInfo.password"> <br/><br/>
        年龄：<input type="number" v-model.number="userInfo.age"> <br/><br/>  
        <!--type中的number是控制表达只能输入数字类型，v-modelnumber是将输入数据转为数字存入vm-->
        性别：
        男<input type="radio" name="sex" v-model="userInfo.sex" value="male">  
        <!--name 控制两个单选框是一组，只能选一个-->
        女<input type="radio" name="sex" v-model="userInfo.sex" value="female"> <br/><br/>
        爱好：
        学习<input type="checkbox" v-model="userInfo.hobby" value="study">
        打游戏<input type="checkbox" v-model="userInfo.hobby" value="game">
        吃饭<input type="checkbox" v-model="userInfo.hobby" value="eat">
        <br/><br/>
        所属校区
        <select v-model="userInfo.city">
            <option value="">请选择校区</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="shenzhen">深圳</option>
            <option value="wuhan">武汉</option>
        </select>
        <br/><br/>
        其他信息：
        <textarea v-model.lazy="userInfo.other"></textarea> <br/><br/>
        <input type="checkbox" v-model="userInfo.agree">阅读并接受<a href="http://www.atguigu.com">《用户协议》</a>
        <button>提交</button>
    </form>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    new Vue({
        el:'#root',
        data:{
            userInfo:{
                account:'',
                password:'',
                age:18,
                sex:'female',
                hobby:[],
                city:'beijing',
                other:'',
                agree:''
            }
        },
        methods: {
            demo(){
                console.log(JSON.stringify(this.userInfo))
            }
        }
    })
</script>
```

## 过滤器
1. 定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）
2. 注册过滤器：
	- 全局过滤器： `Vue.filter(name,callback)`
	- 局部过滤器： `new Vue ({filter:{}})

3. 过滤器的使用：
	- 插值语法：`{{xxx | 过滤器名}}`
	- 属性绑定：`v-bind:属性 = "xxx | 过滤器名"` 

4. 备注：
	- 过滤器可以接收额外参数，多个过滤器之间可以串联
	- 并没有改变原有的数据，而是产生新的对应的数据

```html
<div id="root">
    <h2>显示格式化后的时间</h2>
    <!-- 计算属性实现 -->
    <h3>现在是：{{fmtTime}}</h3>
    <!-- methods实现 -->
    <h3>现在是：{{getFmtTime()}}</h3>
    <!-- 过滤器实现 -->
    <h3>现在是：{{time | timeFormater}}</h3>
    <!-- 过滤器实现（传参） -->
    <h3>现在是：{{time | timeFormater('YYYY_MM_DD') | mySlice}}</h3>
    <h3 :x="msg | mySlice">尚硅谷</h3>  <!-- 属性绑定使用过滤器 -->
</div>

<div id="root2">
    <h2>{{msg | mySlice}}</h2>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false
    //全局过滤器
    Vue.filter('mySlice',function(value){
        return value.slice(0,4)
    })

    new Vue({
        el:'#root',
        data:{
            time:1621561377603, //时间戳
            msg:'你好，尚硅谷'},
        computed: {
            fmtTime(){
                return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')}},
        methods: {
            getFmtTime(){
                return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')}},
        //局部过滤器
        filters:{
            timeFormater(value,str='YYYY年MM月DD日 HH:mm:ss'){
                // console.log('@',value)
                return dayjs(value).format(str)}}
    })

    new Vue({
        el:'#root2',
        data:{
            msg:'hello,atguigu!'}
    })
</script>
```
## 内置指令

### 内置指令

#### 1. 常用指令：

-   `v-bind`  : 单向绑定解析表达式, 可简写为 :xxx

-   `v-model` : 双向数据绑

-   `v-for`  : 遍历数组/对象/字符串

-   `v-on`   : 绑定事件监听, 可简写为@

-   `v-if `    : 条件渲染（动态控制节点是否存存在）

-   `v-else`  : 条件渲染（动态控制节点是否存存在）

-   `v-show`  : 条件渲染 (动态控制节点是否展示)

#### 2. `v-text`

-   作用： 向其所在文本节点中渲染内容

-   与插值语法的区别：`v-text`会替换掉节点中的内容，`{{xxx}}`则不会，更加灵活

```html
<title>v-text指令</title>
<script type="text/javascript" src="../js/vue.js"></script>

<div id="root">
    <div>你好，{{name}}</div>
    <div v-text="name"></div>    <!-- cess -->
    <div v-text="str"></div>   <!-- <h3>你好啊！</h3>-->
</div>

<script type="text/javascript">
    Vue.config.productionTip = false
    new Vue({
        el:'#root',
        data:{
            name:'cess',
            str:'<h3>你好啊！</h3>' 
        }
    })
</script>
```

#### 3. `v-html`

-   作用：向指定节点中渲染包含`html`结构的内容。
-   与插值语法的区别：
    -   `v-html`会替换掉节点中所有的内容，`{{xx}}`则不会。
    -   `v-html`可以识别`html`结构。

-   严重注意：`v-html`有安全性问题！！！！
	-   在网站上动态渲染任意`HTML`是非常危险的，容易导致`XSS`攻击。
	-   一定要在可信的内容上使用`v-html`，永不要用在用户提交的内容上！

#### 4. `v-cloak` 

-    本质是一个特殊属性，没有值，`Vue`实例创建完毕并接管容器后，会删掉`v-cloak`属性。

-    使用`css`配合`v-cloak`可以解决网速慢时页面展示出`{{xxx}}`的问题。

```html
<title>v-cloak指令</title>

<style>
  [v-cloak] {   /*属性选择器，说明v-cloak本质上是属性*/
    display:none;
  }
</style>

<div id="root">
  <h2 v-cloak>{{ name }}</h2>
  <h3>我先出现了</h3>
</div>

// 够延迟5秒收到vue.js
<script type="text/javascript" src="http://localhost:8080/resource/5s/vue.js"></script>

<script type="text/javascript">
  console.log(1)
  Vue.config.productionTip = false
  new Vue({
    el:'#root',
    data:{name:'cess'}
  })
</script>

```

#### 5.`v-once`

-    `v-once`所在节点在初次动态渲染后，就视为静态内容了。
-    以后数据的改变不会引起`v-once`所在结构的更新，可以用于优化性能。
-    注意`v-once`和事件修饰符`once`的区别

```html
<div id="root">
    <h2 v-once>初始化的n值是:{{n}}</h2>
    <h2>当前的n值是:{{n}}</h2>
    <button @click="n++">点我n+1</button>
</div>


<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
    new Vue({
        el:'#root',
        data:{
            n:1
        }
    })
</script>
```

####  6.`v-pre`

-    跳过其所在节点的编译过程。`Vue`不解析该节点
-    可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。

```html
<title>v-pre指令</title>
<script type="text/javascript" src="../js/vue.js"></script>

<div id="root">
  <h2 v-pre>Vue其实很简单</h2>
  <h2 >当前的n值是:{{n}}</h2>
  <button @click="n++">点我n+1</button>
</div>

<script type="text/javascript">
  Vue.config.productionTip = false
  new Vue({ el:'#root', data:{n:1} })
</script>
```


### 自定义指令
1.  定义语法

-   局部指令

```js
new Vue({															
    directives:{ 
        指令名:配置对象 }     //定义多个函数
})

new Vue({															
    directives:{ 
        指令名:回调函数 }   
})

```


  - 全局指令

```js
Vue.directive(指令名, 配置对象)
或
Vue.directive(指令名, 回调函数)

Vue.directive('fbind', {
    // 指令与元素成功绑定时（一上来）
    bind(element, binding) {	// element就是DOM元素，binding就是要绑定的
        element.value = binding.value
    },
    // 指令所在元素被插入页面时
    inserted(element, binding) {
        element.focus()
    },
    // 指令所在的模板被重新解析时
    update(element, binding) {
        element.value = binding.value
    }
})
```



2. 配置对象中的三个回调函数

-  `bind(element, binding)` ：指令与元素成功绑定时调用
-  `inserted(element, binding)`： 指令所在元素被插入页面时调用
-  `update(element, binding)`： 指令所在模板结构被重新解析时调用
其中：`element`就是`DOM`元素，`binding`就是要绑定的对象，它包含以下属性：`name`,`value`,`oldValue`,`expression`,`arg`,`modifiers`
3. 备注

	-  指令定义时不加`v-`，但使用时要加`v-`
	-  指令名如果是多个单词，要使用`kebab-case`命名方式，不要用`camelCase`命名

4. 代码示例
```html
<div id="root">
    <h2>{{name}}</h2>
    <h2>当前的n值是：<span v-text="n"></span> </h2>
    <!-- <h2>放大10倍后的n值是：<span v-big-number="n"></span> </h2> -->
     <!-- v-big 与 v-text 类似。 实现绑定的数据放大10倍</h2> -->
    <h2>放大10倍后的n值是：<span v-big="n"></span> </h2>  
    <button @click="n++">点我n+1</button>
    <hr/>
    <input type="text" v-fbind:value="n">  //
</div>
	
<script type="text/javascript">
    Vue.config.productionTip = false

    //定义全局指令
    /* Vue.directive('fbind',{
			//指令与元素成功绑定时（一上来）
			bind(element,binding){
				element.value = binding.value
			},
			//指令所在元素被插入页面时
			inserted(element,binding){
				element.focus()
			},
			//指令所在的模板被重新解析时
			update(element,binding){
				element.value = binding.value
			}
		}) */

    new Vue({
        el:'#root',
        data:{
            name:'尚硅谷',
            n:1
        },
        directives:{
            //big函数何时会被调用？
            //1.指令与元素成功绑定时（一上来）。只是关系建立起来了，没有放入页面
            //2.指令所在的模板被重新解析时。即数据变化时

            /* 'big-number'(element,binding){
					// console.log('big')
					element.innerText = binding.value * 10
				}, */
            big(element,binding){  //element是真实DOM元素 binding是对象元素
                console.log('big',this) //注意此处的this是window
                // console.log('big')
                element.innerText = binding.value * 10
            },
            fbind:{
                //指令与元素成功绑定时（一上来）
                bind(element,binding){
                    element.value = binding.value
                },
                //指令所在元素被插入页面时
                inserted(element,binding){
                    element.focus()
                },
                //指令所在的模板被重新解析时
                update(element,binding){
                    element.value = binding.value
                }
            }
        }
    })

</script>
```


## [生命周期](https://cn.vuejs.org/v2/guide/instance.html#%E5%AE%9E%E4%BE%8B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)
![](https://cdn.nlark.com/yuque/0/2022/png/1379492/1643297176928-5d5ac765-237c-462d-9188-84935e6c3c69.png?x-oss-process=image%2Fresize%2Cw_750%2Climit_0)

### 生命周期的总结

生命周期：

1.   又名：生命周期回调函数、生命周期函数、**生命周期钩子**。

2.   是什么：`Vue`在关键时刻帮我们调用的一些特殊名称的函数。

3.   生命周期函数的名字不可更改，但函数的具体内容是程序员根据需求编写的。

4.   生命周期函数中的`this`指向是`vm` 或 `组件实例对象`。
5.   常用的生命周期钩子：
     -   `mounted`发送`ajax`请求，启动定时器， 绑定自定义事件，订阅消息等初始化操作。
     -   `beforeDestroy`清除定时器，解绑自定义事件，取药订阅消息等收尾工作
6.   关于销毁`Vue`实例：
     -   销毁后借助`Vue`开发者工具看不到任何信息
     -   销毁后自定义事件会失效，但原生`DOM`事件依然有效
     -   一般不会在`beforeDestroy`操作数据，因为即便操作数据，也不会再触发更新流程

#### 生命周期代码示例

```html
<div id="root">
    <h2 :style="{opacity}">欢迎学习Vue</h2>
    <button @click="opacity = 1">透明度设置为1</button>
    <button @click="stop">点我停止变换</button>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    new Vue({
        el:'#root',
        data:{
            opacity:1
        },
        methods: {
            stop(){
                this.$destroy()
            }
        },
        //Vue完成模板的解析并把初始的真实DOM元素放入页面后（挂载完毕）调用mounted
        mounted(){
            console.log('mounted',this)
            this.timer = setInterval(() => {
                console.log('setInterval')
                this.opacity -= 0.01
                if(this.opacity <= 0) this.opacity = 1
            },16)
        },
        beforeDestroy() {  //不管是自杀还是他杀都会执行
            clearInterval(this.timer)
            console.log('vm即将驾鹤西游了')
        },
    })

</script>
```




## [组件基础](https://cn.vuejs.org/v2/guide/components.html)

### 模块与组件、模块化与组件化
1.  模块
    1. 理解： 向外提供特定功能的js程序，一般就是一个js文件
    2. 为什么用：js文件很多很复杂
    3. 作用：复用js，简化js的编写


2.  模块化

    当应用中的js都已模块来编写，那应用就是模块化的应用

3. 组件

    1. 定义： 实现应用中**<font color="red">局部</font>**功能的*代码*和*资源*的**<font color="red">集合</font>**
    2. 为什么： 一个界面的功能很复杂
    3. 作用：复用编码，简化项目编码，提高运行效率

4. 组件化

    当应用中的功能都是多组件的方式编写的，那应用就是组件化的应用

### 非单文件组件
一个文件中包含有n个组件 ,文件名为`xxx.html`
#### 基本使用 

1. `Vue`中使用组件的三大步骤：

  -   定义组件(创建组件)

      使用`Vue.extend(options)`创建，其中`options`和`new Vue(options)`时传入的那个`options`几乎一样，但也有点区别；

      1.  ​	区别如下：
          -   ​	`el`不要写，为什么？ ——— 最终所有的组件都要经过一个`vm`的管理，由`vm`中的`el`决定服务哪个容器。
          -   `data`必须写成函数，为什么？ ———— 避免组件被复用时，数据存在引用关系。

      2.  备注：使用`template`可以配置组件结构。

  -   ​	注册组件
      1.  局部注册：靠`new Vue`的时候传入`components`选项
      2.  全局注册：靠`Vue.component`('组件名',组件)

  -   使用组件(写组件标签)

      ​	`<school></school>`

2. `Vue`使用代码示例
```html
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <hello></hello>
        <hr/>
        <h3>{{msg}}</h3>
        <hr/>
        <school></school>
        <hr/>
        <student></student>
    </div>

    <div id="root2">
        <hello></hello>
    </div>
</body>

<script type="text/javascript">
    //组件定义
    const hello = Vue.extend({
        template: `
            <div>
            	<h3>你好啊：{{name}}</h3>    
    		</div>`,
        data () {
            return {
                name:'Tom'}}
    })

    const school = Vue.extend({
        template: `
            <div>
                <h3>学校名称：{{name}}</h3>
                <h3>学校地址：{{address}}</h3>
                <button @click="showAddress">点我提示学校名</button>
    		</div>`,
        data () {
            return {
                name: '尚硅谷',
                address: '北京'}},
        methods: {
            showAddress () {
                alert(this.address)}}
    })

    const student = Vue.extend({
        template: `
            <div>
                <h3>学生姓名:{{name}}</h3>
                <h3>学生年龄:{{age}}</h3>
    		</div>`,
        data () {
            return {
                name: '张三',
                age: 18}}
    })

    //全局组件注册
    Vue.component('hello', hello)

    //局部组件注册 ，注册到某个vue实例上，其他实例不可调用
    new Vue ({
        el: '#root',
        data: {
            msg: '你好啊'},
        components: {
            school,
            student}
    })

    new Vue ({
        el: '#root2'
    })
</script>
```

#### 组件注意事项

几个注意点：
1. 关于组件名:
	- 一个单词组成：
		第一种写法(首字母小写)：`school`
		第二种写法(首字母大写)：`School`
	- 多个单词组成：
		第一种写法(kebab-case命名)：`my-school`
		第二种写法(CamelCase命名)：`MySchool` (需要`Vue`脚手架支持)
	- 备注：
		(1). 组件名尽可能回避`HTML`中已有的元素名称，例如：`h2`、`H2`都不行。
		(2). 可以使用`name`配置项指定组件在开发者工具中呈现的名字。 开发者工具显示的名字可根据`name`指定

2. 关于组件标签:
	- 第一种写法：`<school></school>`
	- 第二种写法：`<school/>`
	备注：不用使用脚手架时，`<school/>`会导致后续组件不能渲染。

3. 一个简写方式：
	`const school = Vue.extend(options)`可简写为：`const school = options`  (`options`为配置项)

#### 关于`VueComponent` 
1.  `Vue.extend`创建的组件本质是一个名为`VueComponent`的**构造函数**，且不是程序员定义的。
2.  我们只需要写`<school/>`或`<school></school>`，`Vue`解析时会帮我们创建**组件的实例对象**，即`Vue`帮我们执行的：`new VueComponent(options)`。
3.  **特别注意**：每次调用`Vue.extend`，返回的都是一个全新的`VueComponent`构造函数！！！！即不同组件是不同的对象

  -   `Vue.extend`源码：

```js
Vue.extend = function (extendOptions) {
/*.......*/
var Sub = function VueComponent (options) {
this._init(options)
}
/*.....*/
return Sub
```


4. 关于this指向：
      -   组件配置中： `data`函数、`methods`中的函数、`watch`中的函数、`computed`中的函数 它们的`this`均是**`VueComponent`实例对象**。
      -   `new Vue(options)`配置中：`data`函数、`methods`中的函数、`watch`中的函数、`computed`中的函数 它们的`this`均是**Vue实例对象**。


5. `VueComponent`的实例对象简称`vc`（也可称之为：组件实例对象）,`Vue`的实例对象简称`vm`。

#### 一个重要的内置关系
![](https://cdn.nlark.com/yuque/0/2022/png/1379492/1643034116880-0c7ffd4b-f0ed-47b2-9638-3bb71344c4f1.png?x-oss-process=image%2Fresize%2Cw_750%2Climit_0)
1. 一个重要的内置关系：`VueComponent.prototype.__proto__ === Vue.prototype`
2. 为什么要有这个关系：让组件实例对象`vc`可以访问到` Vue`原型上的属性和方法。

### 单文件组件
一个文件中只包含有1个组件，文件名为`xxx.vue`
一个标准的组件文件包含`template`  `script`  `style`
- School.vue
```vue
<template>
    <div class="dome">
        <h2>学校名称：{{name}}</h2>
		<h2>学校地址：{{address}}</h2>
		<button @click="showName">点我提示学校名</button>
    </div>
</template>

<script>
	export default {// 默认暴露
		name:'School',  //组件名字，开发者插件提供的组件
        data () {
            return {
                name: '尚硅谷',
                address: '北京'}},
        methods: {
            showName(){
				alert(this.name)}}
    }
</script>

<style>
    .demo {
        background-color: orange;
    }
</style>
```

-   Student.vue

```vue
<template>
    <div>
        <h2>学生姓名：{{name}}</h2>
        <h2>学生年龄：{{age}}</h2>
    </div>
</template>

<script>
    export default {
        name:'Student',
        data() {
            return {
                name:'cess',
                age:20
            }
        },
    }
</script>
```

-   App.vue

```vue
<template>
    <div>
        <School></School>
        <Student></Student>
    </div>
</template>

<script>
	import School from './School.vue'
    import Student from './Student.vue'
    
    export default {
        name: 'App',
        components: {
            School,
            Student
        }
    }
</script>
```

-   main.js

```js
import App from './App.vue'

const vm = new Vue ({
    template:`<App></App>`,
    components:{App}
})

vm.$mount('#root')
```

-   index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>单文件组件练习</title>
</head>
<body>
    <div id="root"></div>
    <script src="./vue.js"></script>
    <script src="./main.js"></script> <!--入口文件-->
</body>
</html>
```


# Vue脚手架

