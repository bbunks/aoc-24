try {
  Deno.removeSync("log.txt");
} catch (e) {}

let allowLog = false;

export function toggleLogging() {
  allowLog = !allowLog;
}

export function enableLogging() {
  allowLog = true;
}

export function disableLogging() {
  allowLog = false;
}

export function log(...args: unknown[]) {
  if (!allowLog) return;
  const encoder = new TextEncoder();
  const data = encoder.encode(args.join(" ") + "\n");
  Deno.writeFileSync("log.txt", data, { append: true });
}
