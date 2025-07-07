
import { TonConnectUI } from "@tonconnect/ui";

const tonConnectUI = new TonConnectUI({
    manifestUrl: "https://xpogsx.github.io/miniapp/tonconnect-manifest.json",
    buttonRootId: "connect-button"
});

document.getElementById("buy-24h").addEventListener("click", () => {
    const data = { plan: "24h", amount: "3" };
    Telegram.WebApp.sendData(JSON.stringify(data));
});

document.getElementById("buy-30d").addEventListener("click", () => {
    const data = { plan: "30d", amount: "20" };
    Telegram.WebApp.sendData(JSON.stringify(data));
});
