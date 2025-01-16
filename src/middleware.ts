import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export function middleware(req: { headers: { get: (arg0: string) => any; }; }) {
  return NextResponse.next();
}
