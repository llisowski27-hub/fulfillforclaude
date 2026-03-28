// ============================================================
// THE LIQUIDATOR — PM2 Ecosystem Config
// ecosystem.config.cjs
// ============================================================
// Uruchomienie: pm2 start ecosystem.config.cjs
// ============================================================

module.exports = {
  apps: [
    {
      name: "liquidator",
      script: ".next/standalone/server.js",
      cwd: "/var/www/liquidator",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 5000,
      // Logging
      error_file: "/var/log/liquidator/error.log",
      out_file: "/var/log/liquidator/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Memory limit — restart jeśli przekroczy
      max_memory_restart: "512M",
    },
  ],
};
