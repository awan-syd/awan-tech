import { connect } from 'cloudflare:sockets';

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const name = (data.name || '').trim() || '未填写';
    const phone = (data.phone || '').trim() || '未填写';
    const email = (data.email || '').trim() || '未填写';
    const content = (data.content || '').trim() || '无内容';
    const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    const smtpUser = '158964224@qq.com';
    const smtpPass = env.SMTP_PASS || 'soxdacmoaisnbibe';
    const notifyEmail = '158964224@qq.com';

    const socket = connect({ host: 'smtp.qq.com', port: 465, tls: true });
    const writer = socket.writable.getWriter();
    const reader = socket.readable.getReader();
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    async function readResp() {
      let buf = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const idx = buf.lastIndexOf('\r\n');
        if (idx >= 0) {
          const complete = buf.substring(0, idx);
          const lines = complete.split('\r\n');
          const lastLine = lines[lines.length - 1].trim();
          if (/^\d{3} /.test(lastLine)) return buf;
        }
      }
      return buf;
    }

    async function cmd(str) {
      await writer.write(enc.encode(str + '\r\n'));
      return readResp();
    }

    await readResp();
    await cmd('EHLO awan-tech.pages.dev');
    await cmd('AUTH LOGIN');
    await cmd(btoa(smtpUser));
    await cmd(btoa(smtpPass));
    await cmd('MAIL FROM:<' + smtpUser + '>');
    await cmd('RCPT TO:<' + notifyEmail + '>');
    await cmd('DATA');

    const subjectBytes = new TextEncoder().encode('【阿晚科技】新客户留言 - ' + name);
    let sb = '';
    for (const b of subjectBytes) sb += String.fromCharCode(b);
    const subject = '=?UTF-8?B?' + btoa(sb) + '?=';

    var htmlBody = [
      '<div style="max-width:600px;font-family:Arial,sans-serif;">',
      '<h2 style="color:#536480;border-bottom:2px solid #536480;padding-bottom:10px;">新客户留言通知</h2>',
      '<table style="border-collapse:collapse;width:100%;font-size:14px;">',
      '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;width:80px;">姓名</td><td style="padding:10px;border:1px solid #dce3ec;">', esc(name), '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">电话</td><td style="padding:10px;border:1px solid #dce3ec;">', esc(phone), '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">邮箱</td><td style="padding:10px;border:1px solid #dce3ec;">', esc(email), '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">留言内容</td><td style="padding:10px;border:1px solid #dce3ec;">', esc(content).replace(/\n/g, '<br>'), '</td></tr>',
      '<tr><td style="padding:10px;border:1px solid #dce3ec;background:#f8fafc;font-weight:bold;">提交时间</td><td style="padding:10px;border:1px solid #dce3ec;">', now, '</td></tr>',
      '</table>',
      '<p style="color:#94a3b8;font-size:12px;margin-top:16px;">—— 本邮件由阿晚科技官网（Cloudflare Pages）自动发送 ——</p>',
      '</div>'
    ].join('');

    await writer.write(enc.encode(
      'From: "阿晚科技官网" <' + smtpUser + '>\r\n' +
      'To: ' + notifyEmail + '\r\n' +
      'Subject: ' + subject + '\r\n' +
      'MIME-Version: 1.0\r\n' +
      'Content-Type: text/html; charset=UTF-8\r\n' +
      '\r\n' +
      htmlBody + '\r\n.'
    ));
    await readResp();

    await cmd('QUIT');
    writer.close();

    return new Response(JSON.stringify({ success: true, message: '留言已发送，我们会尽快联系您！' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: '邮件发送失败，请稍后重试或拨打客服热线 6666-6666-6666' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
