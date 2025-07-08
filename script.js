// Pārliecināmies, ka Telegram WebApp API ir gatavs
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
}

// Inicializēt TON Connect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});
// Attēlot “Savienot maku” pogu
if (typeof tonConnectUI.renderButton === 'function') {
  tonConnectUI.renderButton();
} else if (typeof tonConnectUI.connectButton === 'function') {
  tonConnectUI.connectButton();
}

// Summas nanotonās
const AMOUNTS = {
  '24h': 3n * 10n**9n,
  '30d': 20n * 10n**9n
};

// Debug: redzam sākotnējo statusu
tonConnectUI.getStatus().then(wallet => {
  console.log("Initial wallet status:", wallet);
});

// Aktivizēt maksājuma pogas, kad maks pievienots
tonConnectUI.onStatusChange(wallet => {
  console.log("onStatusChange:", wallet);
  const ok = wallet && wallet.account && wallet.account.address;
  document.getElementById('pay24h').disabled = !ok;
  document.getElementById('pay30d').disabled = !ok;
});

// Maksājuma apstrāde
async function handlePayment(duration) {
  console.log('handlePayment start:', duration);

  // ja neesi WebApp, deep-link atpakaļ
  if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
    alert('❗ WebApp API nav pieejams, atveru Telegram…');
    window.location.href = 'tg://resolve?domain=lsc18plussx_bot&start=web_app';
    return;
  }

  const wallet = tonConnectUI.wallet;
  console.log('wallet status at click:', wallet);
  if (!wallet || !wallet.account || !wallet.account.address) {
    alert('⚠️ Pieslēdz savu TON maku!');
    return;
  }

  const messages = [{
    type: 'org.ton.wallets.pay',
    to: 'UQCBfUETzBux01R0KBdBdAWH6Cl-iHcOKQ1kj8CCo8Hv64h9',
    amount: AMOUNTS[duration].toString()
  }];

  try {
    const result = await tonConnectUI.sendTransaction({
      messages,
      validUntil: Date.now() + 10 * 60 * 1000
    });
    console.log('sendTransaction result:', result);

    if (result && result.transactionHash) {
      Telegram.WebApp.sendData(JSON.stringify({
        wallet: wallet.account.address,
        duration,
        txHash: result.transactionHash
      }));
      Telegram.WebApp.close();
    }
  } catch (e) {
    console.error('TON Connect error:', e);
    alert('❌ Maksājuma kļūda: ' + (e.message || e));
  }
}

// Piesaistīt pogām
document.getElementById('pay24h').onclick = () => handlePayment('24h');
document.getElementById('pay30d').onclick = () => handlePayment('30d');
