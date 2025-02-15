import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('authjs.callback-url');
    response.cookies.delete('authjs.session-token');
    console.log("User logged out successfully.");
    return response;
  } catch (error) {
    console.error("Error logging out user:", error);
    return new NextResponse('Error logging out user', { status: 500 });
  }
}