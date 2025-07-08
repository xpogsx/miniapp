// Initialize TON Connect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

// Amounts in nanograms
const AMOUNTS = {
  "24h": 3n * 10n**9n,    // 3 TON
  "30d": 20n * 10n**9n    // 20 TON
};

async function sendPayment(duration) {
  // If not inside Telegram WebApp, show fallback
  if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
    document.getElementById("fallback").style.display = "block";
    return;
  }

  // 1) Ensure wallet is connected
  const wallet = tonConnectUI.wallet;
  if (!wallet?.account?.address) {
    alert("⚠️ Pieslēdz savu TON maku pirmām kārtām.");
    return;
  }

  // 2) Build TON Connect message
  const amount = AMOUNTS[duration].toString();
  const messages = [{
    type: "org.ton.wallets.pay",
    to: "YOUR_OWNER_ADDRESS",  // ← aizvieto ar savu saimnieka adresi
    amount
  }];

  try {
    // 3) Trigger TON Connect
    const result = await tonConnectUI.sendTransaction({
      messages,
      validUntil: Date.now() + 10 * 60 * 1000  // der 10 minūtes
    });

    // 4) If success, sendData back to bot
    if (result?.transactionHash) {
      Telegram.WebApp.sendData(JSON.stringify({
        wallet: wallet.account.address,
        duration,
        txHash: result.transactionHash
      }));
      Telegram.WebApp.close();
    }
  } catch (err) {
    console.error("TON Connect error:", err);
    alert("❌ Maksājuma kļūda: " + (err.message || err));
  }
}

// Button handlers
document.getElementById("pay24h").onclick = () => sendPayment("24h");
document.getElementById("pay30d").onclick = () => sendPayment("30d");

// Deep‐link fallback back into Telegram
document.getElementById("open-telegram").onclick = () => {
  window.location.href = "tg://resolve?domain=Savejiem_18_pluss_bot&start=web_app";
};
