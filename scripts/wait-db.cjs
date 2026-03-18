const net = require("net");

const url = new URL(process.env.DATABASE_URL);

const host = url.hostname;
const port = url.port || 5432;

function tryConnect() {
  const socket = net.connect(port, host);

  socket.on("connect", () => {
    console.log(`✅ Connected to DB at ${host}:${port}`);
    process.exit(0);
  });

  socket.on("error", () => {
    console.log(`⏳ Waiting for DB at ${host}:${port}...`);
    setTimeout(tryConnect, 2000);
  });
}

tryConnect();