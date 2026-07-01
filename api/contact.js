var nodemailer = require('nodemailer');

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') { return res.status(405).json({ success: false, message: 'Method not allowed' }); }

  var data = req.body || {};
  var name = (data.name || '').trim() || '未填写';
  var phone = (data.phone || '').trim() || '未填写';
  var email = (data.email || '').trim() || '未填写';
  var content = (data.content || '').trim() || '无内容';
  var now = new Date().toLocaleString('zh-CN');

  try {
    var transporter = nodemailer.createTransport({
      host: 'smtp.qq.com', port: 465, secure: true,
      auth: {
        user: '158964224@qq.com',
        pass: process.env.SMTP_PASS || 'soxdacmoaisnbibe'
      }
    });

    await transporter.sendMail({
      from: '"阿晚科技官网" <158964224@qq.com>',
      to: '158964224@qq.com',
      subject: '【阿晚科技】新客户留言 - ' + name,
      html: [
        '<div style="max-width:600px;font-family:Arial,sans-serif;">',
        '<h2 style="color:#536480;border-bottom:2px solid #536480;padding-bottom:10px;">新客户留言通知</h2>',
        '<table style="border-collapse:collapse;width:100%;font-size:14px;">',
        '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;width:80px;">姓名</td><td style="padding:10px;border:1px solid #dce3ec;">', name, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">电话</td><td style="padding:10px;border:1px solid #dce3ec;">', phone, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">邮箱</td><td style="padding:10px;border:1px solid #dce3ec;">', email, '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">留言内容</td><td style="padding:10px;border:1px solid #dce3ec;">', content.replace(/\n/g, '<br>'), '</td></tr>',
        '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">提交时间</td><td style="padding:10px;border:1px solid #dce3ec;">', now, '</td></tr>',
        '</table>',
        '<p style="color:#94a3b8;font-size:12px;margin-top:16px;">—— 本邮件由阿晚科技官网（Vercel）自动发送 ——</p>',
        '</div>'
      ].join('')
    });

    console.log('[邮件发送成功]', name, phone);
    return res.json({ success: true, message: '留言已发送，我们会尽快联系您！' });
  } catch (err) {
    console.error('[邮件发送失败]', err.message);
    return res.status(500).json({ success: false, message: '邮件发送失败，请稍后重试或拨打客服热线 6666-6666-6666' });
  }
};
