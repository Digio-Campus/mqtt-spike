// PARA INSTALAR EL CONTENEDOR DE DOCKER

// docker run -d --name emqxp -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 emqx

import fastify from "fastify";
import mqtt from "mqtt";
import fastifyCors from "@fastify/cors";

// Conexión del cliente
const host = "localhost"; // api.digiot.teamcamp.ovh
const port = "1883"; // 1883
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // da igual

const connectUrl = `mqtt://${host}:${port}`;

// Creación de un cliente
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

// Seleccionamos el topic
const topic = "presencia"; // topic = idSensor o algo así

// sensorX/presencia/espinardo
// sensorX/#/espinardo

// Acciones a realizar cuando se conecte
client.on("connect", () => {
  console.log("Connected");

  // Suscripción al tópico
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

// Almacenar datos
let z = "";
let mensajes: string[] = [];

// Acciones a realizar cuando reciba un mensaje
client.on("message", (topic, payload) => {
  console.log(
    "Guardamos los datos del topic " + topic + ": ",
    payload.toString()
  );
  mensajes.push(payload.toString()); // guardar los datos en MONGO
});

//

//
// CONFIGURACIÓN FASTIFY

const server = fastify();

// Cors
server.register(fastifyCors, {
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ["Content-Type"],
});

server.get("/mqttConnect", async (request, reply) => {
  const data = {
    mensajes: mensajes,
  };
  return data;
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
