// ============================================
// 阿晚科技 - 主JavaScript (main.js)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // 1. 页面加载动画（不等待外部资源，如地图 iframe）
  var ld = document.querySelector('.loader');
  if (ld) {
    ld.classList.add('hide');
    setTimeout(function() { ld.style.display = 'none'; }, 400);
  }

  // 2. 导航滚动效果
  var hdr = document.getElementById('mainHeader');
  if (hdr) {
    window.addEventListener('scroll', function() {
      hdr.classList.toggle('scrl', window.scrollY > 30);
    });
  }

  // 3. 移动端导航
  var ham = document.getElementById('hamburgerBtn');
  var mnav = document.getElementById('mobileNavPanel');
  var mo = document.getElementById('mobileNavOverlay');
  var mcl = document.getElementById('mobileNavClose');
  function openM() { if(mnav) mnav.classList.add('on'); if(mo) mo.classList.add('on'); if(ham) ham.classList.add('on'); document.body.style.overflow='hidden'; }
  function closeM() { if(mnav) mnav.classList.remove('on'); if(mo) mo.classList.remove('on'); if(ham) ham.classList.remove('on'); document.body.style.overflow=''; }
  if(ham) ham.addEventListener('click', function(){ mnav && mnav.classList.contains('on') ? closeM() : openM(); });
  if(mcl) mcl.addEventListener('click', closeM);
  if(mo) mo.addEventListener('click', closeM);
  // 移动端子菜单
  document.querySelectorAll('.mstog').forEach(function(t){
    t.addEventListener('click', function(){
      t.classList.toggle('opn');
      var s = this.nextElementSibling;
      if(s && s.classList.contains('msub')) s.classList.toggle('on');
    });
  });

  // 4. 主题切换
  var tt = document.getElementById('themeToggle');
  var ti = document.getElementById('theme-icon');
  var st = localStorage.getItem('site-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', st);
  if(ti) ti.textContent = st === 'dark' ? '☀' : '☽';
  if(tt) tt.addEventListener('click', function(){
    var c = document.documentElement.getAttribute('data-theme');
    var n = c === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem('site-theme', n);
    if(ti) ti.textContent = n === 'dark' ? '☀' : '☽';
  });

  // 5. 回到顶部
  var btt = document.getElementById('backToTop');
  if(btt) {
    window.addEventListener('scroll', function(){ btt.classList.toggle('show', window.scrollY > 300); });
    btt.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }

  // 6. 搜索弹窗
  var sb = document.getElementById('btnSearch');
  var so = document.getElementById('searchOverlay');
  var scl = document.getElementById('searchClose');
  var si = document.getElementById('searchInput');
  if(sb) sb.addEventListener('click', function(){ if(so){ so.classList.add('on'); setTimeout(function(){if(si)si.focus();},100); }});
  if(so) so.addEventListener('click', function(e){ if(e.target===so) so.classList.remove('on'); });
  if(scl) scl.addEventListener('click', function(){ so && so.classList.remove('on'); });

  // 7. 客服弹窗
  var fcb = document.getElementById('floatingChatBtn');
  var cpo = document.getElementById('chatPopupOverlay');
  var cpc = document.getElementById('chatPopupClose');
  if(fcb) fcb.addEventListener('click', function(){ if(cpo) cpo.classList.add('on'); });
  if(cpo) cpo.addEventListener('click', function(e){ if(e.target===cpo) cpo.classList.remove('on'); });
  if(cpc) cpc.addEventListener('click', function(){ if(cpo) cpo.classList.remove('on'); });
  // 客服渠道
  document.querySelectorAll('.cp-mi').forEach(function(m){
    m.addEventListener('click', function(){
      var ch = this.getAttribute('data-channel');
      if(ch==='phone') window.location.href='tel:6666-6666-6666';
      else if(ch==='wechat') alert('请搜索微信号添加客服');
      else if(ch==='form'){ if(cpo) cpo.classList.remove('on'); window.location.href='pages/contact.html'; }
    });
  });

  // 8. ESC关闭
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){
      if(so) so.classList.remove('on');
      if(cpo) cpo.classList.remove('on');
      closeM();
    }
  });

  // 9. 滚动渐入
  initScrollAnim();

  // 10. 数字增长
  initCountUp();

  // 11. LOGO墙
  var lt = document.querySelector('.ltrack');
  if(lt) lt.innerHTML += lt.innerHTML;

  // 12. 首屏 .fi 元素直接显示（避免轮播切换时布局跳动）
  document.querySelectorAll('.hero .fi').forEach(function(el){
    el.classList.add('show');
  });
});

function initScrollAnim(){
  var els = document.querySelectorAll('.fi,.fil,.fir');
  if(!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('show');}); return; }
  var obs = new IntersectionObserver(function(en){
    en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target); }});
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(e){ obs.observe(e); });
}

function initCountUp(){
  var cs = document.querySelectorAll('.cnt');
  if(cs.length===0 || !('IntersectionObserver' in window)) return;
  var done = false;
  var obs = new IntersectionObserver(function(en){
    en.forEach(function(e){
      if(e.isIntersecting && !done){
        done = true;
        cs.forEach(function(c){
          var t = parseInt(c.getAttribute('data-target'),10);
          var d = parseInt(c.getAttribute('data-duration')||'2000',10);
          var s = Math.ceil(t/(d/16));
          var cur = 0;
          function u(){ cur+=s; if(cur>=t){c.textContent=t;}else{c.textContent=cur;requestAnimationFrame(u);} }
          u();
        });
      }
    });
  },{threshold:0.3});
  if(cs[0]){ var p = cs[0].closest('.stats')||cs[0]; obs.observe(p); }
}
