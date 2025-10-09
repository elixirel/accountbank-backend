export const parseExpiresInToSeconds = (expiresInStr) => {
  const match = expiresInStr.match(/^(\d+)([smhdw])$/);
  if (!match) throw new Error(`Invalid expiresIn format: ${expiresInStr}`);

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value; // 초
    case "m":
      return value * 60; // 분 → 초
    case "h":
      return value * 60 * 60; // 시 → 초
    case "d":
      return value * 60 * 60 * 24; // 일 → 초
    case "w":
      return value * 60 * 60 * 24 * 7; // 주 -> 초
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
};
