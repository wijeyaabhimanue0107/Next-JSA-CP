import { cookies } from 'next/headers';

const USERNAME = 'Admin';
const PASSWORD = 'Admin';
const SESSION_COOKIE = 'jsa_session';
const SESSION_VALUE = 'temporary-demo-admin';

function unavailable() {
  return process.env.NODE_ENV === 'production'
    ? Response.json({ message: 'Temporary demo login is unavailable in production.' }, { status: 404 })
    : null;
}

export async function POST(request) {
  const unavailableResponse = unavailable();
  if (unavailableResponse) return unavailableResponse;

  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return Response.json({ message: 'Invalid login request.' }, { status: 400 });
  }

  const username = typeof credentials?.username === 'string' ? credentials.username.trim() : '';
  if (username !== USERNAME || credentials?.password !== PASSWORD) {
    return Response.json({ message: 'Username or password is incorrect.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ username: USERNAME });
}

export async function GET() {
  const unavailableResponse = unavailable();
  if (unavailableResponse) return unavailableResponse;

  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value !== SESSION_VALUE) {
    return Response.json({ message: 'Admin session is unavailable.' }, { status: 401 });
  }

  return Response.json({ username: USERNAME });
}

export async function DELETE() {
  const unavailableResponse = unavailable();
  if (unavailableResponse) return unavailableResponse;

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return new Response(null, { status: 204 });
}
