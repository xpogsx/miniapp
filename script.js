const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
  buttonRootId: "ton-connect-button"
});

document.getElementById("pay24h").onclick = () => {
  alert("✅ 3 TON abonements izvēlēts – te būs nākotnē maksājuma funkcija");
};

document.getElementById("pay30d").onclick = () => {
  alert("✅ 20 TON abonements izvēlēts – te būs nākotnē maksājuma funkcija");
};
