/*
 * シンタックスハイライト部分にタイトルを挿入する
 *
 * タイトルの設定の仕方->
 * ```kt:title.kt
 * ~~~
 * ```
 */

var list = document.body.getElementsByClassName("highlight");

for(i=0; i <= list.length-1; i++) {
  var code = list[i].firstElementChild.firstElementChild
  var codeName =  code ? code.className.split(":")[1] : null;

  if(codeName) {
    var div = document.createElement('div');
    div.textContent = codeName;
    div.classList.add('code-name');
    code.parentNode.insertBefore(div, code);
  }
}
