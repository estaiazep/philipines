<script>
  function blockIfNotTelegram() {
    const isTelegram = window.Telegram && window.Telegram.WebApp;
    const isUserAgentTelegram = navigator.userAgent.includes("Telegram");

    if (!isTelegram || !isUserAgentTelegram) {
      window.stop();

      document.open();
      document.write(`
        <html><head>
          <meta charset="UTF-8">
          <style>
            body {
              background: #000;
              color: #fff;
              font-family: sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
          </style>
        </head><body>
          <div>
            <h2>🚫 Доступ запрещён</h2>
            <p>Открой через Telegram-приложение</p>
          </div>
        </body></html>
      `);
      document.close();
    }
  }

  // Подождём чуть-чуть — Telegram WebApp может загружаться с задержкой
  setTimeout(blockIfNotTelegram, 300); // ⏱ 300–500 мс максимум
</script>
