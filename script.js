const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

// Funkcija, kas nosūta apmaksas rezultātu uz Telegram botu
async function sendPaymentData(duration) {
  const wallet = tonConnectUI.wallet;
  if (!wallet || !wallet.account || !wallet.account.address) {
    alert("⚠️ Lūdzu, vispirms pieslēdz savu TON maku.");
    return;
  }

  const address = wallet.account.address;
  console.log("📤 Sūtam uz Telegram botu:", address, duration);

  // Pārbaude, vai darbojas Telegram WebApp vidē
  if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
    alert("❌ Telegram WebApp nav pieejams. Lūdzu, atver MiniApp caur Telegram.");
    return;
  }

  Telegram.WebApp.sendData(JSON.stringify({
    wallet: address,
    duration: duration
  }));

  Telegram.WebApp.close();
}

// Apstrādā pogas
document.getElementById("pay24h").onclick = () => sendPaymentData("24h");
document.getElementById("pay30d").onclick = () => sendPaymentData("30d");
