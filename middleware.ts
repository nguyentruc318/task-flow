import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage = pathname.startsWith("/dashboard");

  // Người chưa login
  if (!user) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    // Cho phép truy cập auth pages khi chưa login
    return res;
  }

  // Người đã login
  if (user) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
