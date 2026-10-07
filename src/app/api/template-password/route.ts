import { NextResponse } from "next/server";

const passwordEnvironmentVariables = {
  "gold-lp": "GOLD_LP_PASSWORD",
  "area-inspection": "AREA_INSPECTION_PASSWORD",
} as const;

function isCredentialId(
  value: string | null,
): value is keyof typeof passwordEnvironmentVariables {
  return value !== null && Object.hasOwn(passwordEnvironmentVariables, value);
}

export function GET(request: Request) {
  const credentialId = new URL(request.url).searchParams.get("id");
  if (!isCredentialId(credentialId)) {
    return NextResponse.json({ error: "Unknown credential" }, { status: 400 });
  }

  const environmentVariable = passwordEnvironmentVariables[credentialId];
  const password = process.env[environmentVariable];
  if (!password) {
    return NextResponse.json(
      { error: `${environmentVariable} is not configured` },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { password },
    { headers: { "Cache-Control": "no-store" } },
  );
}
