// ============================================
// 阿晚科技 - 邮件服务 (email-server.js)
// Express + Nodemailer 本地邮件发送服务
// ============================================
var express = require('express');
var nodemailer = require('nodemailer');
var cors = require('cors');
var config = require('./config');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

app.post('/api/contact', async function(req, res) {
  try {
    var data = req.body;
    var name = data.name || '未填写';
    var phone = data.phone || '未填写';
    var email = data.email || '未填写';
    var company = data.company || '未填写';
    var service = data.service || '未选择';
    var message = data.message || '无内容';

    var mailOptions = {
      from: '"' + config.siteName + '" <' + config.smtp.user + '>',
      to: config.notifyEmail,
      subject: '【' + config.siteName + '】新客户留言 - ' + name,
      html: [
        '<h2 style="color:#4a9ede;">新客户留言通知</h2>',
        '<table style="border-collapse:collapse;width:100%;max-width:600px;font-size:14px;">',
        '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;width:100px;">姓名</td><td style="padding:10px;border:1px solid #e2e8f0;">', name, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">电话</td><td style="padding:10px;border:1px solid #e2e8f0;">', phone, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">邮箱</td><td style="padding:10px;border:1px solid #e2e8f0;">', email, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">公司</td><td style="padding:10px;border:1px solid #e2e8f0;">', company, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">需求类型</td><td style="padding:10px;border:1px solid #e2e8f0;">', service, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;">留言内容</td><td style="padding:10px;border:1px solid #e2e8f0;">', message.replace(/\n/g, '<br>'), '</td></tr>',
        '</table>',
        '<p style="color:#94a3b8;font-size:12px;margin-top:16px;">发送时间：', new Date().toLocaleString('zh-CN'), '</p>'
      ].join('')
    };

    var info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
    res.json({ success: true, message: '邮件发送成功' });
  } catch (err) {
    console.error('邮件发送失败:', err);
    res.status(500).json({ success: false, message: '邮件发送失败，请检查SMTP配置' });
  }
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(config.port, function() {
  console.log('========================================');
  console.log('  阿晚科技邮件服务已启动');
  console.log('  端口: ' + config.port);
  console.log('  接口: POST /api/contact');
  console.log('  健康: GET  /api/health');
  console.log('========================================');
});
