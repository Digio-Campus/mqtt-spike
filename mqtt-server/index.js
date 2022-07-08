"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mqtt_1 = __importDefault(require("mqtt"));
const cors_1 = __importDefault(require("@fastify/cors"));
// Conexión del cliente
const host = "localhost"; // api.digiot.teamcamp.ovh
const port = "1883"; // 1883
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // da igual
const connectUrl = `mqtt://${host}:${port}`;
// Creación de un cliente
const client = mqtt_1.default.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});
// Seleccionamos el topic
const topic = "presencia"; // topic = idSensor o algo así
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
let mensajes = [];
// Acciones a realizar cuando reciba un mensaje
client.on("message", (topic, payload) => {
    console.log("Guardamos los datos del topic " + topic + ": ", payload.toString());
    mensajes.push(payload.toString()); // guardar los datos en MONGO
});
//
//
// CONFIGURACIÓN FASTIFY
const server = (0, fastify_1.default)();
// Cors
server.register(cors_1.default, {
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: ["Content-Type"],
});
server.get("/mqttConnect", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        mensajes: mensajes,
    };
    return data;
}));
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
