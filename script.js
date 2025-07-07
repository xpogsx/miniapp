const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

// Pārbauda, vai lietotājs ir pieslēdzies ar maku
async function sendPaymentData(duration) {
  const wallet = tonConnectUI.wallet;
  if (!wallet || !wallet.account || !wallet.account.address) {
    alert("⚠️ Lūdzu, vispirms pieslēdz savu TON maku.");
    return;
  }

  const address = wallet.account.address;

  console.log("Sūtam uz bota WebApp:", address, duration); // ← Šis palīdz testēt

  // Nosūta uz Telegram WebApp (tavs bots saņems)
  Telegram.WebApp.sendData(JSON.stringify({
    wallet: address,
    duration: duration
  }));

  Telegram.WebApp.close(); // aizver WebApp, ja vēlams
}

// Poga: 24h (3 TON)
document.getElementById("pay24h").onclick = () => {
  sendPaymentData("24h");
};

// Poga: 30d (20 TON)
document.getElementById("pay30d").onclick = () => {
  sendPaymentData("30d");
};
