export function formatUsd(minor: string | bigint): string {
  const value = BigInt(minor);
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  return (negative ? "-$" : "$") + (absolute / 100n).toLocaleString("en-US") + "." + (absolute % 100n).toString().padStart(2, "0");
}
