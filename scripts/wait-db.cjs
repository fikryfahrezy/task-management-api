const net = require("net");

const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT || 5432;

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