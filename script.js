// ✅ Pārbauda vai Telegram WebApp API ir pieejams
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
}

// ✅ Inicializē TON Connect UI ar manifestu
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

// ✅ Padara "Savienot maku" pogu redzamu
if (typeof tonConnectUI.renderButton === 'function') {
  tonConnectUI.renderButton();
}

// ✅ TON maksājuma summas nanotonās (1 TON = 1_000_000_000 nanotonas)
const AMOUNTS = {
  '24h': 3n * 10n ** 9n,
  '30d': 20n * 10n ** 9n
};

// ✅ Kad maks ir pievienots, aktivizē pogas
tonConnectUI.onStatusChange(wallet => {
  console.log("🔌 Pieslēgtais maks:", wallet);
  const isConnected = wallet?.account?.address;
  document.getElementById('pay24h').disabled = !isConnected;
  document.getElementById('pay30d').disabled = !isConnected;
});

// ✅ Apmaksas funkcija
async function handlePayment(duration) {
  console.log('💸 Apmaksa sākta:', duration);

  // ❌ Ja nav WebApp, atver Telegram vēlreiz
  if (!Telegram?.WebApp) {
    alert('❗ Telegram WebApp nav pieejams. Atver Telegram vēlreiz!');
    window.location.href = 'tg://resolve?domain=lsc18plussx_bot&start=web_app';
    return;
  }

  const wallet = tonConnectUI.wallet;
  if (!wallet?.account?.address) {
    alert('⚠️ Lūdzu, pieslēdz savu TON maku!');
    return;
  }

  // ✅ Sagatavo maksājuma ziņu
  const messages = [{
    type: 'org.ton.wallets.pay',
    to: 'UQCBfUETzBux01R0KBdBdAWH6Cl-iHcOKQ1kj8CCo8Hv64h9', // ← ŠEIT IR SAŅĒMĒJA ADRESE
    amount: AMOUNTS[duration].toString()
  }];

  try {
    // ✅ Sūta darījumu
    const result = await tonConnectUI.sendTransaction({
      messages,
      validUntil: Date.now() + 10 * 60 * 1000 // 10 minūtes
    });

    console.log('✅ Darījums nosūtīts:', result);

    if (result?.transactionHash) {
      // ✅ Nosūta info botam un aizver WebApp
      Telegram.WebApp.sendData(JSON.stringify({
        wallet: wallet.account.address,
        duration,
        txHash: result.transactionHash
      }));
      Telegram.WebApp.close();
    }
  } catch (e) {
    console.error('❌ Kļūda maksājumā:', e);
    alert('❌ Maksājuma kļūda: ' + (e.message || e));
  }
}

// ✅ Pieslēdz apmaksas pogām funkciju
document.getElementById('pay24h').onclick = () => handlePayment('24h');
document.getElementById('pay30d').onclick = () => handlePayment('30d');
