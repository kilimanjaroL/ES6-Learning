/**
 * 1、 let var 的作用域
 * i:全局
 * 
 */

//var
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
console.log(i); //10 注意循环后i还有+1
a[6](); // 10
a[3](); // 10

//let
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6 当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6

//函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域
for (let i = 0; i < 5; i++) {
  let i = 'abc';
  console.log(i);
}
//会输出5次 abc

/**
 * 不存在变量提升
 */

// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;


/**
 * 暂时性死区
 */
var tmp = 123;

if (true) {
  console.log(tmp)
 
  // tmp = 'abc'; 
  let tmp;
  console.log(tmp)
}
console.log(tmp)

function bar(x = y, y = 2) {
  console.log(x,y)
}
bar(); // 报错 参数x默认值等于另一个参数y，而此时y还没有声明，属于”死区“

function bar(x = y, y = x) {
  console.log(x,y)
}
bar(); // 无输出


function bar(x = y = 2) {
  console.log(x,y)
}

bar(); // 2 2

// 不报错
var x = x;

// 报错
let x = x;
// ReferenceError: x is not defined

/**
 * 不允许重复声明
 * let不允许在相同作用域内，重复声明同一个变量
 */

 // 报错
function func() {
  let a = 10;
  var a = 1;
}
func();

// 报错
function func() {
  let a = 10;
  let a = 1;
}
func();

function func() {
  var a = 10;
  var a = 1;
  console.log(a) 
}
func(); //1


/**
 * 2、块级作用域
 */

//(1).内层变量可能会覆盖外层变量
var tmp = new Date();

function f() {
  console.log(tmp); //if里面的变量提升，导致内层的tmp变量覆盖了外层的tmp变量。
  if (false) {
    var tmp = 'hello world';
    // console.log(tmp);
  }
}

f(); // undefined


//(2).用来计数的循环变量泄露为全局变量。
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]); // h e l l o
}

console.log(i); // 5


//let实际上为 JavaScript 新增了块级作用域。
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
    console.log(n); // 10
  }
  console.log(n); // 5
}
f1();

// 情况一
if (true) {
  function f() {}
}

// 情况二
try {
  function f() {}
} catch(e) {
  // ...
}


//ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());

//上面代码在 ES5 中运行，会得到“I am inside!”，因为在if内声明的函数f会被提升到函数头部，实际运行的代码如下。

// ES5 环境
function f() { console.log('I am outside!'); }

(function () {
  function f() { console.log('I am inside!'); }
  if (false) {
  }
  f();
}());

// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function

// 浏览器的 ES6 环境 实际运行状况：
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function


/**
 * 3、const
 */

 //const声明一个只读的常量。一旦声明，常量的值就不能改变。
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.

//const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。
/********************* */

//const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
console.log(foo.prop) // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only


/**
 * 5、顶层对象的属性
 */

window.a = 1;
console.log(a) // 1

a = 2;
console.log(window.a) // 2

//综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};