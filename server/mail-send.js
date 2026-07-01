// ============================================
// 阿晚科技 - SMTP 邮件发送服务 (mail-send.js)
// Express + Nodemailer，通过 QQ 邮箱 SMTP 直发
// 无第三方平台中转，收到留言后直接推送到指定邮箱
// ============================================
// 使用前请修改下方 SMTP 配置（搜索「===== 配置区 =====」）
// 启动方式：node mail-send.js （默认监听 3001 端口）
// ============================================
var express = require('express');
var nodemailer = require('nodemailer');
var cors = require('cors');

// ===== 配置区 =====
var CONFIG = {
  port: 3001,
  // SMTP 发件配置（以 QQ 邮箱为例）
  smtp: {
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    user: '158964224@qq.com',
    pass: 'soxdacmoaisnbibe'   // QQ 邮箱 SMTP 授权码
  },
  // 收件邮箱（留言将发送到此地址）
  notifyEmail: '158964224@qq.com',
  siteName: '阿晚科技'
};
// ===== 配置结束 =====

var app = express();
app.use(cors({
  origin: function(origin, cb) {
    // 允许所有来源，包括 null（file:// 协议）和跨域请求
    cb(null, true);
  },
  credentials: true
}));
app.use(express.json());

var transporter = nodemailer.createTransport({
  host: CONFIG.smtp.host,
  port: CONFIG.smtp.port,
  secure: CONFIG.smtp.secure,
  auth: {
    user: CONFIG.smtp.user,
    pass: CONFIG.smtp.pass
  }
});

app.post('/api/contact', function(req, res) {
  var data = req.body || {};
  var name = (data.name || '').trim() || '未填写';
  var phone = (data.phone || '').trim() || '未填写';
  var email = (data.email || '').trim() || '未填写';
  var content = (data.content || '').trim() || '无内容';
  var now = new Date().toLocaleString('zh-CN');

  var mailOptions = {
    from: '"' + CONFIG.siteName + '" <' + CONFIG.smtp.user + '>',
    to: CONFIG.notifyEmail,
    subject: '【' + CONFIG.siteName + '】新客户留言 - ' + name,
    html: [
      '<div style="max-width:600px;font-family:Arial,sans-serif;">',
      '<h2 style="color:#4a9ede;border-bottom:2px solid #4a9ede;padding-bottom:10px;">新客户留言通知</h2>',
      '<table style="border-collapse:collapse;width:100%;font-size:14px;">',
      '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;width:80px;">姓名</td><td style="padding:10px;border:1px solid #e2e8f0;">', name, '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">电话</td><td style="padding:10px;border:1px solid #e2e8f0;">', phone, '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">邮箱</td><td style="padding:10px;border:1px solid #e2e8f0;">', email, '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">留言内容</td><td style="padding:10px;border:1px solid #e2e8f0;">', content.replace(/\n/g, '<br>'), '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">提交时间</td><td style="padding:10px;border:1px solid #e2e8f0;">', now, '</td></tr>',
      '</table>',
      '<p style="color:#94a3b8;font-size:12px;margin-top:16px;">—— 本邮件由阿晚科技官网自动发送，请勿回复 ——</p>',
      '</div>'
    ].join('')
  };

  transporter.sendMail(mailOptions)
    .then(function(info) {
      console.log('[邮件发送成功]', info.messageId, '-', name, phone);
      res.json({ success: true, message: '留言已发送' });
    })
    .catch(function(err) {
      console.error('[邮件发送失败]', err.message);
      res.status(500).json({ success: false, message: '邮件发送失败，请检查 SMTP 配置' });
    });
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(CONFIG.port, function() {
  console.log('========================================');
  console.log('  阿晚科技邮件服务已启动');
  console.log('  端口: ' + CONFIG.port);
  console.log('  接口: POST /api/contact');
  console.log('  收件: ' + CONFIG.notifyEmail);
  console.log('========================================');
  console.log('  使用前请修改 SMTP 授权码：');
  console.log('  server/mail-send.js → CONFIG.smtp.pass');
  console.log('========================================');
});
