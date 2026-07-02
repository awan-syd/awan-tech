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

    // Try Resend API first (if key set), fallback to connect()
    if (env.RESEND_API_KEY) {
      var res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: '阿晚科技官网 <onboarding@resend.dev>',
          to: ['158964224@qq.com'],
          subject: '【阿晚科技】新客户留言 - ' + name,
          html: buildHTML(name, phone, email, content, now)
        })
      });
      if (!res.ok) throw new Error('Resend API: ' + res.status + ' ' + (await res.text()));
      return new Response(JSON.stringify({ success: true, message: '留言已发送，我们会尽快联系您！' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fallback: use MAIL_API_URL proxy (user deploys mail-send.js elsewhere)
    if (env.MAIL_API_URL) {
      var res = await fetch(env.MAIL_API_URL + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, phone: phone, email: email, content: content })
      });
      var result = await res.json();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Last fallback: use connect() for raw SMTP
    await sendViaSMTP(name, phone, email, content, now, env);

    return new Response(JSON.stringify({ success: true, message: '留言已发送，我们会尽快联系您！' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function sendViaSMTP(name, phone, email, content, now, env) {
  var smtpUser = '158964224@qq.com';
  var smtpPass = env.SMTP_PASS || 'soxdacmoaisnbibe';
  var notifyEmail = '158964224@qq.com';

  var socket = connect({ host: 'smtp.qq.com', port: 465, tls: true });
  var writer = socket.writable.getWriter();
  var reader = socket.readable.getReader();
  var enc = new TextEncoder();
  var dec = new TextDecoder();

  async function readResp() {
    var buf = '';
    while (true) {
      var result = await reader.read();
      if (result.done) break;
      buf += dec.decode(result.value, { stream: true });
      var idx = buf.lastIndexOf('\r\n');
      if (idx >= 0) {
        var complete = buf.substring(0, idx);
        var lines = complete.split('\r\n');
        var lastLine = lines[lines.length - 1].trim();
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

  var subjectBytes = new TextEncoder().encode('【阿晚科技】新客户留言 - ' + name);
  var sb = '';
  for (var b of subjectBytes) sb += String.fromCharCode(b);
  var subject = '=?UTF-8?B?' + btoa(sb) + '?=';

  var htmlBody = buildHTML(name, phone, email, content, now);

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
}

function buildHTML(name, phone, email, content, now) {
  var esc = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  return [
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
}
