


//创建food对象
;(function (window,undefined) {
	//设置变量
	var position = 'absolute';
	var elements = [];
	var document = window.document;
	function Food(x , y , width , height , color){
		//设置food坐标
		this.x = x || 0;
		this.y = y || 0;
		//设置food的大小
		this.width = width || 20;
		this.height = height || 20;
		//设置food的颜色
		this.color = color || '#0f0';
	}
	// 设置food的原型方法，实现随机产生实物对象，并渲染到map
	Food.prototype.render = function(map){
		//移除食物
		remove();
		// 随机食物的位置
		this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
		this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
		//创建食物div元素
		var div = document.createElement('div');
		map.appendChild(div);
		// 设置食物div的样式
		div.style.width = this.width + 'px';
		div.style.height = this.height + 'px';
		div.style.left = this.x + 'px';
		div.style.top = this.y + 'px';
		div.style.backgroundColor = this.color;
		div.style.position = position;
		//将div放入数组
		elements.push(div)
	}
	function remove () {
		for(var i = 0 ; i < elements.length ; i++){
			elements[i].parentNode.removeChild(elements[i]);
			elements.splice(i,1);
		}
	}
	window.Food = Food;
})(window,undefined)

// 测试代码
// var map = document.getElementById('map');
// var food = new Food(0,0);
// food.render(map)

// 创建snake对象
;(function (window,undefined) {
	var document = window.document;
	var position = 'absolute';
	var elements = [];
	function Snake (width , height , direction) {

		//snake每一节的大小
		this.width = width || 20 ; 
		this.height = height || 20;
		//snake的身体，第一个red的是头,每个对象存储坐标和颜色
		this.body = [
			{x: 3 , y: 2 , color: '#f00'},
			{x: 2 , y: 2 , color: '#00f'},
			{x: 1 , y: 2 , color: '#00f'}
		];
		//snake行走的方向
		this.direction = direction || 'right';

	}
	Snake.prototype.render = function (map) {
		// 创建蛇之前先删除原来的蛇
		remove();
		//创建蛇
		for(var i = 0 ; i < this.body.length ; i++){
			var obj = this.body[i];
			//创建body的div
			var div = document.createElement('div');
			map.appendChild(div);
			// 添加样式
			div.style.left = obj.x * this.width + 'px';
			div.style.top = obj.y * this.height + 'px';
			div.style.width = this.width + 'px';
			div.style.height = this.height + 'px';
			div.style.backgroundColor = obj.color;
			div.style.position = position;
			// 将创建的蛇身体的每一个节存入数组
			elements.push(div);
		}
	}
	Snake.prototype.move = function(food , map){
		//蛇每向前移动一步，身体的每节坐标为前一个节的坐标
		for(var i = this.body.length - 1 ; i > 0 ; i--){
			this.body[i].x = this.body[i - 1].x;
			this.body[i].y = this.body[i - 1].y;
		}
		// 根据移动的方向判断蛇头的坐标
		switch(this.direction){
			case 'top' :
				this.body[0].y -= 1;
				break;
			case 'right':
				this.body[0].x += 1;
				break;
			case 'bottom':
				this.body[0].y += 1;
				break;
			case 'left':
				this.body[0].x -= 1;
				break;
		}

		//蛇头位置坐标
		var headX = this.body[0].x * this.width;
		var headY = this.body[0].y * this.height;
		//判断蛇头是否和食物重合（即吃到食物）
		if( headX === food.x && headY === food.y){
			// 记录下蛇尾
			var last = this.body[this.body.length - 1];
			// 创建空对象
			var obj = {};
			// 将蛇尾拷贝给空对象
			extend(last,obj);
			// 将拷贝后的蛇尾添加到蛇身体
			this.body.push(obj);
			//随机生成新食物
			food.render(map);
		}
	}
	// 拷贝函数
	function extend (parent ,child) {
		for(var key in parent){
			if(child[key]){
				continue;
			}
			child[key] = parent[key];
		}
	}
	// 移除蛇的函数
	function remove(){
		for(var i = elements.length - 1 ; i >= 0 ; i--){
			// 删除元素
			elements[i].parentNode.removeChild(elements[i]);
			// 删除数组中的对应元素
			elements.splice(i,1);
		}
	}
	// 暴露构造函数
	window.Snake = Snake;
})(window,undefined)


// 测试代码
// var map = document.getElementById('map');
// var snake = new Snake();
// snake.render(map)


// 创建game对象
;(function(window,undefined){
	// 游戏的构造函数
	var document = window.document;
	var that = null;
	function Game (map) {
		this.food = new Food();
		this.snake = new Snake();
		this.map = map;
		that = this;
	}
	//渲染食物和蛇对象
	Game.prototype.start = function () {
		// 将食物渲染到地图
		this.food.render(this.map);
		// 将蛇渲染到地图
		this.snake.render(this.map);
		//蛇行走
		runSnake(this.snake , this.map)
		// 调用键盘控制蛇移动方向
		bindKey();
	}
	function runSnake(){
		var timerId = setInterval(function(){
			this.snake.move(this.food , this.map);
			// 蛇所能跑的最大距离
			var maxX = this.map.offsetWidth / this.snake.width ;
			var maxY = this.map.offsetHeight / this.snake.height ;
			// 获取蛇头的坐标
			var headX = this.snake.body[0].x;
			var headY = this.snake.body[0].y;
			// 判断是否越界
			if(headX < 0 || headX >= maxX || headY < 0 || headY >= maxY){
				// 越界清空定时器
				alert('game over');
				clearInterval(timerId);
				
				return;
			}
			//当蛇吃到自己时，游戏结束
			for(var i = 1; i < this.snake.body.length ; i++){
				if(headX === this.snake.body[i].x && headY === this.snake.body[i].y){
					clearInterval(timerId);
					alert('game over');
					return;
				}
			}
			//先判断是否撞到边界或者撞到自身，符合要求后再渲染蛇，防止蛇头消失
			this.snake.render(this.map);
		}.bind(that),200)
	}
	//键盘控制蛇移动方向
	function bindKey(){
		document.addEventListener('keydown',function(e){
			switch(e.keyCode){
				case 37: 
					if(this.snake.direction != 'right'){
						this.snake.direction = 'left';
					}
					break;
				case 38:
					if(this.snake.direction != 'bottom'){
						this.snake.direction = 'top';
					}
					break;
				case 39:
					if(this.snake.direction != 'left'){
						this.snake.direction = 'right';
					}
					break;
				case 40: 
					if(this.snake.direction != 'top'){
						this.snake.direction = 'bottom';
					}
					break;
			}

		}.bind(that),false)
	}
	window.Game = Game;
})(window,undefined)


// 启动游戏
;(function (window , undefined) {
	var document = window.document;
	var map = document.getElementById('map');
	// map.style.overflow = 'hidden';
	var game = new Game(map);
	game.start();
})(window , undefined)