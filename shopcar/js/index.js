// 思路：封装两个函数，分别是：子选框的状态确定父选框的状态（可利用判断子选框是否被全部选择，如果有违背全部选中则复选框不被选择，若是自选框被全部选中则父选框被选中，添加一个布尔量变量flag，然后判断自选框的checked属性是否有false）；父选框的状态确定子选框的状态（将父选框的checked属性值赋给所有对应的子选框的checked属性）。分别给三层注册事件，调用相应的函数来确定其他两层的状态。

// 选取第一层选择框元素
var checkedThis = document.getElementById('checkedThis');
// 选取第二层选择框元素
var checkAllSon = document.querySelectorAll('.checkAllSon');
//第一层注册点击事件
checkedThis.onclick = function (){
	//遍历第二层
	for(var i = 0 ; i < checkAllSon.length ; i++){
		//根据第一层来确定第二层的状态
		checkAllSon[i].checked = this.checked;
		//根据第二层来确定相应所属的第三层的状态,注意checkAllSon[i]不是第三层的父标签
		checkChildren(checkAllSon[i].parentNode.parentNode);
	}
}
//第二层注册点击事件
for(var i = 0 ; i < checkAllSon.length ; i++){
	checkAllSon[i].onclick = function(){
		//根据第二层来判断第三层的状态
		checkChildren(this.parentNode.parentNode);
		// 根据第二层来判断第一层的状态
		checkAll(checkAllSon,checkedThis,0)
	}
}
//第三层注册点击事件
for(var i = 0 ; i < checkAllSon.length ; i++){
	//选出第二层对应的第二层和第三层所有的input元素
	var elementSon = checkAllSon[i].parentNode.parentNode.getElementsByTagName('input');
	// 遍历每个第二层对应的第三层选框
	for(var j = 1 ; j < elementSon.length ; j++){
		// 注册点击事件
		elementSon[j].onclick = function(){
			// 选出点击选框的对应的dd标签
			var parendDD = findDD(this);
			// 选出dd下面的所有input标签
			var checkAllDD = parendDD.getElementsByTagName('input');
			//根据第三层确定第二层的状态
			checkAll(checkAllDD,checkAllDD[0],1);
			checkAll(checkAllSon,checkedThis,0);
		}
	}
}
// 设置第三层的选择状态，根据父选框的状态来判断子选框的函数
function checkChildren (element) {
	//选出element下面的所有input标签
	var allElement = element.getElementsByTagName('input');
	var flag = false;
	for(var i = 0 ; i < allElement.length ; i++){
		if ( i === 0 ) {
			// 判断对应的第二层的复选框的状态
			flag = allElement[i].checked;
		}else {
			// 根据第二层的确定第三层的状态
			allElement[i].checked = flag;
		}
	}
}
// 根据子选框的状态来判断父选框的状态函数,主要是判断子选框里面是否有未被选中的选框
function checkAll (checkArray,checkElement,stratIndex) {
	var flag = true ; 
	for(var i = stratIndex ; i < checkArray.length ; i++){
		if (!checkArray[i].checked) {
			flag = false ; 
			break;
		}
	}
	checkElement.checked = flag;
}
// 寻找element的 tagname为dd的父元素,利用递归思想
function findDD(element){
	if(element.parentNode.tagName === 'DD'){
		return element.parentNode;
	}else{
		return findDD(element.parentNode);
	}
}
