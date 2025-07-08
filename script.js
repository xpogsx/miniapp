// Inicializē TON Connect UI kā tev jau ir
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

// Poga: 24h abonements
document.getElementById("pay24h").onclick = async () => {
  // 1) pārbauda maku
  const wallet = tonConnectUI.wallet;
  if (!wallet?.account?.address) {
    alert("⚠️ Pieslēdz TON maku vispirms.");
    return;
  }

  // 2) veido darījuma objektu
  const amountNano = (3n * 10n**9n).toString();  // 3 TON
  const messages = [{
    type: "org.ton.wallets.pay",
    to: "TAVS_OWNER_ADDRESS_NO_KOTIRĀCIJAS",
    amount: amountNano
  }];

  try {
    // 3) izsauc TON Connect
    const result = await tonConnectUI.sendTransaction({
      messages,
      validUntil: Date.now() + 10 * 60 * 1000  // der 10 minūtes
    });

    // 4) kad maksājums veiksmīgs, sūta botam
    if (result) {
      Telegram.WebApp.sendData(JSON.stringify({
        wallet: wallet.account.address,
        duration: "24h",
        txHash: result.transactionHash
      }));
      Telegram.WebApp.close();
    }
  } catch (err) {
    console.error("💥 TON Connect kļūda", err);
    alert("❌ Maksājuma kļūda: " + err.message);
  }
};
