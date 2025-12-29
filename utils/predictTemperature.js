function predictNext10Min(readings) {
  if (!readings || readings.length < 3) {
    return readings?.[0]?.temperature || 0;
  }

  // readings are newest → oldest
  const ordered = [...readings].reverse(); // oldest → newest
  const temps = ordered.map((r) => r.temperature);

  // 🔹 Exponential smoothing (removes noise)
  const alpha = 0.6;
  let smooth = temps[0];

  for (let i = 1; i < temps.length; i++) {
    smooth = alpha * temps[i] + (1 - alpha) * smooth;
  }

  // 🔹 Trend calculation (°C / minute)
  const first = ordered[0];
  const last = ordered[ordered.length - 1];

  const timeDiffMin = (last.createdAt - first.createdAt) / (1000 * 60);

  const trend =
    timeDiffMin > 0 ? (last.temperature - first.temperature) / timeDiffMin : 0;

  // 🔹 Predict 10 minutes ahead
  let predicted = smooth + trend * 10;

  // 🔹 Clamp unrealistic jumps (product safety)
  const MAX_DELTA = 8;
  predicted = Math.max(
    last.temperature - MAX_DELTA,
    Math.min(last.temperature + MAX_DELTA, predicted)
  );

  return Number(predicted.toFixed(1));
}

module.exports = { predictNext10Min };
