const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const services = [
  { name: "Backend", directory: "backend", args: ["run", "dev"] },
  {
    name: "Public frontend",
    directory: "frontend",
    args: ["run", "dev", "--", "--port", "5173", "--strictPort"],
  },
  {
    name: "Admin portal",
    directory: "admin-frontend",
    args: ["run", "dev", "--", "--port", "5174", "--strictPort"],
  },
];

const npmCli = process.env.npm_execpath;
const npmCommand = npmCli
  ? process.execPath
  : process.platform === "win32"
    ? "npm.cmd"
    : "npm";
const children = [];
let stopping = false;
let forceStopTimer;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;

  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill("SIGTERM");
  }

  forceStopTimer = setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null) child.kill("SIGKILL");
    }
  }, 5000);
  forceStopTimer.unref();
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

for (const service of services) {
  const args = ["--prefix", path.join(root, service.directory), ...service.args];
  const child = spawn(
    npmCommand,
    npmCli ? [npmCli, ...args] : args,
    {
      cwd: root,
      stdio: "inherit",
      shell: !npmCli && process.platform === "win32",
    },
  );

  children.push(child);
  child.on("error", (error) => {
    console.error(`${service.name} could not start: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      const exitCode = code === 0 ? 0 : code || (signal ? 1 : 0);
      console.log(`${service.name} stopped; shutting down the other services.`);
      stop(exitCode);
    }
    if (children.every((processHandle) => processHandle.exitCode !== null)) {
      clearTimeout(forceStopTimer);
    }
  });
}

console.log("Starting Agaaz services. Press Ctrl+C to stop all three.");
