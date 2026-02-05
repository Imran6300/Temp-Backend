const mqtt = require("mqtt");
const TemperatureModel = require("../models/temperature.model.js")

const MQTT_BROKER = "mqtts://ea343f92c15b4d419f30142f2702ce2e.s1.eu.hivemq.cloud:8883";
const MQTT_TOPIC = "tempguard/+/data";

const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: "mqtts",
  port: 8883,
  reconnectPeriod: 5000,
  rejectUnauthorized: false, // 🔥 VERY IMPORTANT
};

function initMQTT(io) {
  console.log("🔌 Connecting to HiveMQ Cloud...");

  const client = mqtt.connect(MQTT_BROKER, options);

  client.on("connect", () => {
    console.log("✅ MQTT connected");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) console.error("❌ Subscribe error", err);
      else console.log("📡 Subscribed to", MQTT_TOPIC);
    });
  });

  client.on("message", async (topic, message) => {
    try {
      console.log("📥 Raw MQTT:", message.toString());

      const data = JSON.parse(message.toString());

      const saved = await TemperatureModel.create({
        deviceId: data.deviceId,
        temperature: data.temperature,
        battery: data.battery,
      });

      console.log("💾 Saved to DB:", saved._id);
      io.emit("sensor:update", saved);
    } catch (err) {
      console.error("❌ MQTT message error:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("❌ MQTT error:", err.message);
  });
}

module.exports = initMQTT;
