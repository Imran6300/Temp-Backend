const Temperature = require("../models/temperature.model");
const { generateCSV } = require("../utils/report.util");

// Simple Linear Regression function (no external library)
function simpleLinearRegression(points) {
  // points = [[x1, y1], [x2, y2], ...]  x = minutes since oldest, y = temperature
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  for (let [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

exports.getDashboardData = async (req, res) => {
  try {
    // Get last 30 readings for better prediction (you can change to 20 or 50)
    const readings = await Temperature.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .select("temperature battery createdAt")
      .lean();

    if (readings.length === 0) {
      return res.json({
        temperature: 0,
        time: "--",
        online: false,
        battery: 0,
        tempprediction: 0,
        lastupdate: 5,
      });
    }

    const latest = readings[0];
    const temperature = latest.temperature;
    const battery = latest.battery || 0;
    const time = latest.createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    let tempprediction = temperature; // fallback

    if (readings.length >= 2) {
      // Use oldest reading as reference time
      const oldestTime = readings[readings.length - 1].createdAt;

      // Build points: chronological order (oldest first)
      const points = readings
        .slice()
        .reverse()
        .map((r) => {
          const minutesSinceOldest = (r.createdAt - oldestTime) / (1000 * 60);
          return [minutesSinceOldest, r.temperature];
        });

      const regression = simpleLinearRegression(points);
      if (regression) {
        const lastX = points[points.length - 1][0];
        const forecastMinutes = 15;
        const predicted =
          regression.intercept + regression.slope * (lastX + forecastMinutes);
        tempprediction = Number(predicted.toFixed(1));
      }
    }

    res.json({
      temperature,
      time,
      online: true,
      battery,
      tempprediction,
      lastupdate: 5,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const data = await Temperature.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    if (!data.length) {
      return res.status(404).json({ message: "No data available" });
    }

    const csv = generateCSV(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=temperature-report-${Date.now()}.csv`
    );

    res.status(200).send(csv);
  } catch (err) {
    console.error("Download Report Error:", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
