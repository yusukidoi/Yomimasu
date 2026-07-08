import { APP_NAME, type HealthResponse } from "@yomimasu/shared";
import { NextResponse } from "next/server";

export async function GET() {
  const payload: HealthResponse = {
    status: "ok",
    service: "yomimasu-api",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ ...payload, app: APP_NAME });
}
