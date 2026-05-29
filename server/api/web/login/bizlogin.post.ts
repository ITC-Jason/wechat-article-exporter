import dayjs from 'dayjs';
import { request } from '#shared/utils/request';
import { getCookieFromResponse, getCookiesFromRequest } from '~/server/utils/CookieStore';
import { proxyMpRequest } from '~/server/utils/proxy-request';

function getCookieNames(response: Response): string[] {
  return response.headers
    .getSetCookie()
    .map(cookie => cookie.split(';')[0]?.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name));
}

export default defineEventHandler(async event => {
  const cookie = getCookiesFromRequest(event);

  const payload: Record<string, string | number> = {
    userlang: 'zh_CN',
    redirect_url: '',
    cookie_forbidden: 0,
    cookie_cleaned: 0,
    plugin_used: 0,
    login_type: 3,
    token: '',
    lang: 'zh_CN',
    f: 'json',
    ajax: 1,
  };

  const response: Response = await proxyMpRequest({
    event: event,
    method: 'POST',
    endpoint: 'https://mp.weixin.qq.com/cgi-bin/bizlogin',
    query: {
      action: 'login',
    },
    body: payload,
    cookie: cookie,
    action: 'login', // 有这个标志就会把微信原始响应中的所有 set-cookie 存储在 CookieStore 中，并返回给客户端一个唯一的cookie: auth-key=xxx
  });

  // 从响应中取出唯一的 set-cookie (即上一步 `action=login` 标志所设置的 auth-key=xxx)
  const authKey = getCookieFromResponse('auth-key', response);
  if (!authKey) {
    let responseBody = '';
    try {
      responseBody = await response.clone().text();
    } catch (error) {
      responseBody = `读取响应体失败: ${error instanceof Error ? error.message : String(error)}`;
    }

    console.error('[bizlogin] auth-key cookie not found:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      cookieNames: getCookieNames(response),
      setCookieCount: response.headers.getSetCookie().length,
      responseBody,
    });

    return {
      err: '登录失败，请稍后重试',
    };
  }

  const { nick_name, head_img } = await request(`/api/web/mp/info`, {
    headers: {
      Cookie: `auth-key=${authKey}`,
    },
  });
  if (!nick_name) {
    return {
      err: '获取公众号昵称失败，请稍后重试',
    };
  }

  const body = JSON.stringify({
    nickname: nick_name,
    avatar: head_img,
    expires: dayjs().add(4, 'days').toString(),
  });
  const headers = new Headers(response.headers);
  headers.set('Content-Length', new TextEncoder().encode(body).length.toString());
  return new Response(body, { headers: headers });
});
