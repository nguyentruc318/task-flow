import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};
export type ApiError = {
  code: string;
  message: string;
};
export type ApiFailure = {
  success: false;
  data: null;
  error: ApiError;
};
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
export function success<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>(
    { success: true, data, error: null },
    { status },
  );
}
export function failure(code: string, message: string, status = 400) {
  return NextResponse.json<ApiFailure>(
    {
      success: false,
      data: null,
      error: { code, message },
    },
    { status },
  );
}
