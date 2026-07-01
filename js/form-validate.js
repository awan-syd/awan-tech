// ============================================
// 阿晚科技 - 表单验证 + SMTP 邮件直发 (form-validate.js)
// 前端校验后异步请求后端，通过 QQ 邮箱 SMTP 直发
// 无第三方平台中转，无需邮箱激活确认
// ============================================
var API_MAIL_URL = window.location.origin === 'null' || window.location.protocol === 'file:'
  ? 'http://localhost:3001/api/contact'
  : '/api/contact';

document.addEventListener('DOMContentLoaded', function() {
  var f = document.getElementById('contactForm');
  if (!f) return;

  var successEl = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');

  f.addEventListener('submit', function(e) {
    e.preventDefault();
    // 清除旧提示
    if (successEl) { successEl.style.display = 'none'; successEl.textContent = ''; }
    if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
    f.querySelectorAll('.fg').forEach(function(g) { g.classList.remove('err'); });

    // 表单校验
    var ok = true;
    var nEl = document.getElementById('ctName');
    var pEl = document.getElementById('ctPhone');
    var eEl = document.getElementById('ctEmail');
    var mEl = document.getElementById('ctMsg');

    if (!nEl || !nEl.value.trim()) {
      if (nEl) nEl.closest('.fg').classList.add('err');
      ok = false;
    }

    if (!pEl || !pEl.value.trim()) {
      if (pEl) pEl.closest('.fg').classList.add('err');
      ok = false;
    } else if (!/^1[3-9]\d{9}$/.test(pEl.value.trim())) {
      pEl.closest('.fg').classList.add('err');
      ok = false;
    }

    if (eEl && eEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eEl.value.trim())) {
      eEl.closest('.fg').classList.add('err');
      ok = false;
    }

    if (!mEl || !mEl.value.trim()) {
      if (mEl) mEl.closest('.fg').classList.add('err');
      ok = false;
    }

    if (!ok) return;

    // 提交请求
    var btn = f.querySelector('button[type="submit"]');
    var origText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '正在提交留言，请稍候…'; }

    var payload = {
      name: nEl.value.trim(),
      phone: pEl.value.trim(),
      email: eEl ? eEl.value.trim() : '',
      content: mEl.value.trim()
    };

    fetch(API_MAIL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(res) {
      if (res.success) {
        f.reset();
        if (successEl) {
          successEl.textContent = '留言提交成功，我们会尽快联系您！';
          successEl.style.display = 'block';
        }
      } else {
        throw new Error(res.message || '发送失败');
      }
    })
    .catch(function() {
      if (errorEl) {
        errorEl.textContent = '提交失败，请稍后重试或直接拨打客服热线 6666-6666-6666';
        errorEl.style.display = 'block';
      }
    })
    .finally(function() {
      if (btn) { btn.disabled = false; btn.textContent = origText; }
    });
  });

  // 输入时清除错误状态
  f.querySelectorAll('input,textarea').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var g = this.closest('.fg');
      if (g) g.classList.remove('err');
      if (successEl) { successEl.style.display = 'none'; }
      if (errorEl) { errorEl.style.display = 'none'; }
    });
  });
});
