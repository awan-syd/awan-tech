// ============================================
// 阿晚科技 - Hero轮播 (slider.js)
// ============================================
function initSlider(){
  var sl = document.querySelectorAll('.hs');
  var dt = document.querySelectorAll('.sd');
  var pv = document.getElementById('sliderPrev');
  var nx = document.getElementById('sliderNext');
  if(sl.length===0) return;
  var cur = 0, iv;
  function go(i){
    // 先移除当前幻灯片的激活状态
    sl[cur].classList.remove('on');
    if(dt[cur]) dt[cur].classList.remove('on');
    // 计算新索引
    cur = ((i % sl.length) + sl.length) % sl.length;
    // 添加新幻灯片的激活状态
    sl[cur].classList.add('on');
    if(dt[cur]) dt[cur].classList.add('on');
  }
  function nxt(){ go(cur + 1); }
  function prv(){ go(cur - 1); }
  function start(){ iv=setInterval(nxt,5000); }
  function stop(){ clearInterval(iv); }
  start();
  dt.forEach(function(d,i){ d.addEventListener('click',function(){stop();go(i);start();}); });
  if(pv) pv.addEventListener('click',function(){stop();prv();start();});
  if(nx) nx.addEventListener('click',function(){stop();nxt();start();});
  var h = document.querySelector('.hero');
  if(h){ h.addEventListener('mouseenter',stop); h.addEventListener('mouseleave',start); }
}

// 页面加载完成后初始化轮播
document.addEventListener('DOMContentLoaded', function(){
  initSlider();
});
