const { Parser } = require("json2csv");

exports.generateCSV = (data) => {
  const fields = [
    { label: "Temperature (°C)", value: "temperature" },
    { label: "Battery (%)", value: "battery" },
    { label: "Status", value: "status" },
    { label: "Timestamp", value: "createdAt" },
  ];

  const json2csvParser = new Parser({ fields });
  return json2csvParser.parse(data);
};
