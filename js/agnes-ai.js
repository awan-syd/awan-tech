// ============================================
// 阿晚科技 - 阿晚AI助手聊天组件 (agnes-ai.js)
// 自包含：自动注入CSS，无需额外样式文件
// 功能：对话聊天、按钮自由拖拽
// ============================================
(function() {
  var cfg = window.AGNES_CONFIG || {};
  var apiUrl = cfg.apiUrl || '';

  // ====== 文字配置 ======
  var botName = '阿晚AI助手';
  var welcomeMsg = '您好，我是阿晚AI助手，专注解答建站、电商系统开发、运营方案相关问题，有任何需求都可以向我提问。';

  // ====== 注入CSS ======
  var css = [
    '#agnes-btn { position: fixed; bottom: 100px; right: 24px; width: 52px; height: 52px; border-radius: 50%; background: #4a9ede; color: #fff; border: none; cursor: pointer; font-size: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 9999; display: flex; align-items: center; justify-content: center; user-select: none; -webkit-user-select: none; }',
    '#agnes-btn:hover { transform: scale(1.1); background: #3a8ec8; }',
    '#agnes-btn.dragging { transition: none !important; transform: none !important; cursor: move; }',
    '#agnes-panel { position: fixed; bottom: 162px; right: 24px; width: 360px; max-width: calc(100vw - 48px); height: 480px; max-height: calc(100vh - 200px); background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 9998; display: none; flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0; }',
    '#agnes-panel.on { display: flex; }',
    '#agnes-panel .ap-hd { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #4a9ede; color: #fff; border-radius: 11px 11px 0 0; }',
    '#agnes-panel .ap-hd h3 { font-size: 15px; font-weight: 600; }',
    '#agnes-panel .ap-hd .ap-cl { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; opacity: 0.85; padding: 2px 6px; border-radius: 4px; }',
    '#agnes-panel .ap-hd .ap-cl:hover { opacity: 1; background: rgba(255,255,255,0.15); }',
    '#agnes-panel .ap-bd { flex: 1; overflow-y: auto; padding: 14px 16px; background: #f8fafc; }',
    '#agnes-panel .ap-bd .msg { margin-bottom: 14px; display: flex; flex-direction: column; }',
    '#agnes-panel .ap-bd .msg.bot { align-items: flex-start; }',
    '#agnes-panel .ap-bd .msg.user { align-items: flex-end; }',
    '#agnes-panel .ap-bd .msg .b { max-width: 78%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.6; word-break: break-word; }',
    '#agnes-panel .ap-bd .msg.bot .b { background: #fff; color: #1e293b; border: 1px solid #e2e8f0; border-bottom-left-radius: 4px; }',
    '#agnes-panel .ap-bd .msg.user .b { background: #4a9ede; color: #fff; border-bottom-right-radius: 4px; }',
    '#agnes-panel .ap-bd .msg .t { font-size: 11px; color: #94a3b8; margin-top: 4px; padding: 0 4px; }',
    '#agnes-panel .ap-ft { display: flex; align-items: stretch; gap: 8px; padding: 10px 14px; border-top: 1px solid #e2e8f0; background: #fff; }',
    '#agnes-panel .ap-ft input { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 12px; font-size: 14px; outline: none; background: #f8fafc; color: #1e293b; height: 38px; }',
    '#agnes-panel .ap-ft input:focus { border-color: #4a9ede; }',
    '#agnes-panel .ap-ft button { padding: 0 18px; background: #4a9ede; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; white-space: nowrap; height: 38px; display: flex; align-items: center; justify-content: center; }',
    '#agnes-panel .ap-ft button:hover { background: #3a8ec8; }',
    '#agnes-panel .ap-ft button:disabled { opacity: 0.5; cursor: not-allowed; }',
    '#agnes-panel .typing { display: flex; gap: 4px; padding: 4px 0; }',
    '#agnes-panel .typing span { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: agnes-bounce 1.2s infinite; }',
    '#agnes-panel .typing span:nth-child(2) { animation-delay: 0.2s; }',
    '#agnes-panel .typing span:nth-child(3) { animation-delay: 0.4s; }',
    '@keyframes agnes-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }',
    '@media (max-width: 480px) {',
    '  #agnes-btn { bottom: 90px; right: 16px; width: 46px; height: 46px; font-size: 20px; }',
    '  #agnes-panel { right: 8px; bottom: 146px; width: calc(100vw - 16px); height: 420px; }',
    '}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ====== 创建HTML结构 ======
  var panel = document.createElement('div');
  panel.id = 'agnes-panel';
  panel.innerHTML = [
    '<div class="ap-hd">',
    '  <h3>' + botName + '</h3>',
    '  <button class="ap-cl" id="agnesClose">&#10005;</button>',
    '</div>',
    '<div class="ap-bd" id="agnesMessages"></div>',
    '<div class="ap-ft">',
    '  <input type="text" id="agnesInput" placeholder="输入您的问题..." autocomplete="off">',
    '  <button id="agnesSend">发送</button>',
    '</div>'
  ].join('');

  var btn = document.createElement('button');
  btn.id = 'agnes-btn';
  btn.title = '打开AI助手';
  btn.innerHTML = '&#129302;';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ====== DOM引用 ======
  var messagesEl = document.getElementById('agnesMessages');
  var inputEl = document.getElementById('agnesInput');
  var sendBtn = document.getElementById('agnesSend');
  var closeBtn = document.getElementById('agnesClose');
  var msgCount = 0;

  // ====== 添加消息 ======
  function addMsg(text, role) {
    var div = document.createElement('div');
    div.className = 'msg ' + (role || 'bot');
    var bubble = document.createElement('div');
    bubble.className = 'b';
    bubble.textContent = text;
    div.appendChild(bubble);
    var time = document.createElement('div');
    time.className = 't';
    time.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    div.appendChild(time);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ====== 显示输入中 ======
  function showTyping() {
    var div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'agnesTyping';
    div.innerHTML = '<div class="b"><div class="typing"><span></span><span></span><span></span></div></div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('agnesTyping');
    if (el) el.remove();
  }

  function setLoading(v) {
    sendBtn.disabled = v;
    inputEl.disabled = v;
  }

  // ====== 发送消息 ======
  function send() {
    var text = inputEl.value.trim();
    if (!text || sendBtn.disabled) return;

    addMsg(text, 'user');
    inputEl.value = '';
    msgCount++;

    if (apiUrl) {
      setLoading(true);
      showTyping();

      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: msgCount })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        hideTyping();
        var reply = data.reply || data.message || data.response || data.text || '抱歉，我没有理解您的意思，请换个说法试试。';
        addMsg(reply, 'bot');
      })
      .catch(function() {
        hideTyping();
        addMsg('暂时无法连接到AI服务，请稍后再试。您也可以拨打客服热线 6666-6666-6666。', 'bot');
      })
      .finally(function() {
        setLoading(false);
      });
    } else {
      setTimeout(function() {
        var replies = [
          '感谢您的咨询！我们的电商SaaS系统支持多店铺管理、全渠道营销和数据分析，欢迎了解。',
          '好的，我已记录您的问题。我们的专属客服将在24小时内与您联系。',
          '您可以访问"产品中心"页面查看各产品的详细功能和方案。',
          '建议您拨打客服热线 6666-6666-6666 获得更详细的解答。',
          '我们提供电商商城SaaS、直播带货系统、私域小程序和仓储管理系统。',
          '感谢您的关注！如需紧急帮助，请直接电话联系我们。'
        ];
        var reply = replies[Math.floor(Math.random() * replies.length)];
        addMsg(reply, 'bot');
        setLoading(false);
      }, 800);
    }
  }

  // ====== 事件：发送 ======
  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') send();
  });

  // ====== 事件：关闭弹窗 ======
  closeBtn.addEventListener('click', function() {
    panel.classList.remove('on');
  });

  // ============================================================
  //  拖拽逻辑：长按AI按钮在可视区内自由拖动
  //  拖拽时不触发点击弹窗，松开鼠标按钮停在拖拽位置
  //  刷新页面回到默认右下角
  // ============================================================
  (function initDrag() {
    var isDragging = false;
    var startX, startY, originLeft, originTop;
    var threshold = 6; // 像素阈值：超过此值视为拖拽而非点击

    function onMouseDown(e) {
      // 记录拖拽起始信息
      var rect = btn.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      originLeft = rect.left;
      originTop = rect.top;

      btn.classList.add('dragging');

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      // 防止文本选择
      e.preventDefault();
    }

    function onMouseMove(e) {
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        isDragging = true;
      }

      if (!isDragging) return;

      // 计算新位置，限制在可视窗口内
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var bw = btn.offsetWidth;
      var bh = btn.offsetHeight;

      var newLeft = Math.max(0, Math.min(vw - bw, originLeft + dx));
      var newTop = Math.max(0, Math.min(vh - bh, originTop + dy));

      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      btn.classList.remove('dragging');

      if (!isDragging) {
        // 没有拖动，视为点击：切换弹窗
        panel.classList.toggle('on');
        if (panel.classList.contains('on')) {
          setTimeout(function() { inputEl.focus(); }, 100);
        }
      }

      isDragging = false;
    }

    // 移动端触屏支持
    function onTouchStart(e) {
      var touch = e.touches[0];
      var rect = btn.getBoundingClientRect();
      startX = touch.clientX;
      startY = touch.clientY;
      originLeft = rect.left;
      originTop = rect.top;

      btn.classList.add('dragging');

      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    function onTouchMove(e) {
      e.preventDefault();
      var touch = e.touches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        isDragging = true;
      }

      if (!isDragging) return;

      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var bw = btn.offsetWidth;
      var bh = btn.offsetHeight;

      var newLeft = Math.max(0, Math.min(vw - bw, originLeft + dx));
      var newTop = Math.max(0, Math.min(vh - bh, originTop + dy));

      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    }

    function onTouchEnd() {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      btn.classList.remove('dragging');

      if (!isDragging) {
        panel.classList.toggle('on');
        if (panel.classList.contains('on')) {
          setTimeout(function() { inputEl.focus(); }, 100);
        }
      }

      isDragging = false;
    }

    btn.addEventListener('mousedown', onMouseDown);
    btn.addEventListener('touchstart', onTouchStart, { passive: true });
  })();

  // ====== 欢迎消息 ======
  addMsg(welcomeMsg, 'bot');

  console.log('阿晚AI助手已加载');
})();
