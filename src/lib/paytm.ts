import * as crypto from "crypto";

const PAYTM_MID = process.env.PAYTM_MID!;
const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY!;
const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE ?? "WEBSTAGING";
const PAYTM_CHANNEL_ID = process.env.PAYTM_CHANNEL_ID ?? "WEB";
const PAYTM_INDUSTRY_TYPE_ID = process.env.PAYTM_INDUSTRY_TYPE_ID ?? "Retail";
const PAYTM_CALLBACK_URL = process.env.PAYTM_CALLBACK_URL!;

// Use staging or production endpoint
const IS_PROD = process.env.NODE_ENV === "production" && PAYTM_WEBSITE === "DEFAULT";
const PAYTM_BASE = IS_PROD
  ? "https://securegw.paytm.in"
  : "https://securegw-stage.paytm.in";

export function generateChecksum(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  const hash = crypto
    .createHmac("sha256", PAYTM_MERCHANT_KEY)
    .update(paramStr)
    .digest("hex");
  return hash;
}

export function verifyChecksum(
  params: Record<string, string>,
  checksum: string
): boolean {
  const computed = generateChecksum(params);
  return computed === checksum;
}

export interface PaytmParams {
  orderId: string;
  customerId: string;
  amount: number; // in INR
  email: string;
  phone?: string;
}

export function buildPaytmParams(p: PaytmParams): Record<string, string> {
  const params: Record<string, string> = {
    MID: PAYTM_MID,
    WEBSITE: PAYTM_WEBSITE,
    CHANNEL_ID: PAYTM_CHANNEL_ID,
    INDUSTRY_TYPE_ID: PAYTM_INDUSTRY_TYPE_ID,
    ORDER_ID: p.orderId,
    CUST_ID: p.customerId,
    TXN_AMOUNT: p.amount.toFixed(2),
    CALLBACK_URL: PAYTM_CALLBACK_URL,
    EMAIL: p.email,
    MOBILE_NO: p.phone ?? "9999999999",
  };
  const checksum = generateChecksum(params);
  return { ...params, CHECKSUMHASH: checksum };
}

export function getPaytmTxnUrl(): string {
  return `${PAYTM_BASE}/order/process`;
}

export function getPaytmStatusUrl(): string {
  return `${PAYTM_BASE}/order/status`;
}

export async function verifyPaytmTransaction(
  orderId: string
): Promise<{ success: boolean; txnId?: string; status?: string }> {
  const params = {
    MID: PAYTM_MID,
    ORDER_ID: orderId,
  };
  const checksum = generateChecksum(params);

  const resp = await fetch(getPaytmStatusUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, CHECKSUMHASH: checksum }),
  });

  if (!resp.ok) return { success: false };

  const data = (await resp.json()) as {
    STATUS?: string;
    TXNID?: string;
    RESPCODE?: string;
  };
  const success = data.STATUS === "TXN_SUCCESS" && data.RESPCODE === "01";
  return { success, txnId: data.TXNID, status: data.STATUS };
}
