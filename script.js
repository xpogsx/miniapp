if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
}

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

// Padarīt “Connect Wallet” pogu redzamu
tonConnectUI.renderButton();

const AMOUNTS = {
  '24h': 3n * 10n**9n,
  '30d': 20n * 10n**9n
};

tonConnectUI.onStatusChange(wallet => {
  console.log("onStatusChange:", wallet);
  const active = wallet?.account?.address;
  document.getElementById('pay24h').disabled = !active;
  document.getElementById('pay30d').disabled = !active;
});

async function handlePayment(duration) {
  if (!Telegram?.WebApp) {
    alert('❗ WebApp API nav pieejams!');
    window.location.href = 'tg://resolve?domain=lsc18plussx_bot&start=web_app';
    return;
  }

  const wallet = tonConnectUI.wallet;
  if (!wallet?.account?.address) {
    alert('⚠️ Lūdzu pieslēdz maku!');
    return;
  }

  const messages = [{
    type: 'org.ton.wallets.pay',
    to: 'UQCBfUETzBux01R0KBdBdAWH6Cl-iHcOKQ1kj8CCo8Hv64h9', // Tava saņēmēja adrese
    amount: AMOUNTS[duration].toString()
  }];

  try {
    const result = await tonConnectUI.sendTransaction({
      messages,
      validUntil: Date.now() + 600000
    });

    if (result?.transactionHash) {
      Telegram.WebApp.sendData(JSON.stringify({
        wallet: wallet.account.address,
        duration,
        txHash: result.transactionHash
      }));
      Telegram.WebApp.close();
    }
  } catch (e) {
    alert('❌ Kļūda maksājuma laikā: ' + (e.message || e));
  }
}

document.getElementById('pay24h').onclick = () => handlePayment('24h');
document.getElementById('pay30d').onclick = () => handlePayment('30d');
