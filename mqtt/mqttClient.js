const mqtt = require("mqtt");
const TemperatureModel = require("../models/temperature.model");

let client = null; // 🔥 IMPORTANT

const MQTT_BROKER =
  "mqtts://ea343f92c15b4d419f30142f2702ce2e.s1.eu.hivemq.cloud:8883";

const MQTT_TOPIC = "tempguard/+/data";

const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: "mqtts",
  port: 8883,
  reconnectPeriod: 5000,
  rejectUnauthorized: false,
};

function initMQTT(io) {
  if (client) {
    console.log("⚠️ MQTT already initialized");
    return;
  }

  console.log("🔌 Connecting to HiveMQ Cloud...");

  client = mqtt.connect(MQTT_BROKER, options);

  client.on("connect", () => {
    console.log("✅ MQTT connected");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) console.error("❌ MQTT subscribe error:", err);
      else console.log("📡 Subscribed to", MQTT_TOPIC);
    });
  });

  client.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📥 MQTT:", data);

      const saved = await TemperatureModel.create({
        deviceId: data.deviceId,
        temperature: data.temperature,
        battery: data.battery,
      });

      const payload = {
        id: saved._id,
        deviceId: saved.deviceId,
        temperature: saved.temperature,
        battery: saved.battery,
        createdAt: saved.createdAt,
      };

      io.emit("sensor:update", {
        id: saved._id,
        deviceId: saved.deviceId,
        temperature: saved.temperature,
        battery: saved.battery,
        createdAt: saved.createdAt,
      });
    } catch (err) {
      console.error("❌ MQTT message error:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("❌ MQTT error:", err.message);
  });
}

module.exports = initMQTT;
