// ============================================
// 阿晚科技 - 产品/案例筛选 (product-filter.js)
// ============================================
document.addEventListener('DOMContentLoaded', function(){
  // 产品筛选
  document.querySelectorAll('.pft button').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('.pft button').forEach(function(b){b.classList.remove('on');});
      this.classList.add('on');
      var f = this.getAttribute('data-filter');
      document.querySelectorAll('.pcd').forEach(function(c){
        c.style.display = (f==='all'||c.getAttribute('data-cat')===f) ? '' : 'none';
      });
    });
  });
  // 案例筛选
  document.querySelectorAll('.cfilt button').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('.cfilt button').forEach(function(b){b.classList.remove('on');});
      this.classList.add('on');
      var f = this.getAttribute('data-filter');
      document.querySelectorAll('.cc').forEach(function(c){
        c.style.display = (f==='all'||c.getAttribute('data-cat')===f) ? '' : 'none';
      });
    });
  });
  // 首页产品Tab
  document.querySelectorAll('.ptab').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('.ptab').forEach(function(b){b.classList.remove('on');});
      this.classList.add('on');
      var f = this.getAttribute('data-filter');
      document.querySelectorAll('[data-cat]').forEach(function(c){
        c.style.display = (f==='all'||c.getAttribute('data-cat')===f) ? '' : 'none';
      });
    });
  });
  // 产品搜索
  var sr = document.getElementById('productSearch');
  if(sr){
    sr.addEventListener('input', function(){
      var k = this.value.toLowerCase().trim();
      document.querySelectorAll('.pcd').forEach(function(c){
        c.style.display = c.textContent.toLowerCase().indexOf(k)!==-1 ? '' : 'none';
      });
    });
  }
});
