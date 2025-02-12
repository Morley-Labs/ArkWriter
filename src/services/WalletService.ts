import toast from "react-hot-toast";
import { Lucid, fromHex, toHex, C, Blockfrost } from "lucid-cardano/mod.js";

export type Network = 'Mainnet' | 'Preview' | 'Preprod';

export interface WalletInfo {
  name: string;
  address: string;
  network: Network;
}

export interface ScriptDeployment {
  scriptAddress: string;
  txHash: string;
  datum?: string;
}

const NETWORK_CONFIGS = {
  Mainnet: "https://cardano-mainnet.blockfrost.io/api/v0",
  Preview: "https://cardano-preview.blockfrost.io/api/v0",
  Preprod: "https://cardano-preprod.blockfrost.io/api/v0"
};

const NETWORK_API_KEYS = {
  Mainnet: "mainnetBsuP24zhOfuH4xNr94gVbFbJef5LADia",
  Preview: "previewk0TcBSfBODxZZMhibhfDA82QpeNFebnK",
  Preprod: "preprod2peq0yKBshnKDtOwBWmLV3EpUUXLAr1b"
};

const NETWORK_PREFIXES = {
  Mainnet: 1,
  Preview: 0,
  Preprod: 0
};

class WalletService {
  private lucid: Lucid | null = null;
  private walletAddress: string | null = null;
  private walletName: string | null = null;
  private currentNetwork: Network = 'Mainnet';

  async connect(updateUI?: (wallet: WalletInfo) => void): Promise<WalletInfo> {
    try {
      if (!this.currentNetwork) throw new Error("Network not set");

      const apiKey = NETWORK_API_KEYS[this.currentNetwork];
      if (!apiKey) throw new Error(`API key for ${this.currentNetwork} is missing`);

      this.lucid = await Lucid.new(new Blockfrost(NETWORK_CONFIGS[this.currentNetwork], apiKey));

      const availableWallets = this.getAvailableCardanoWallets();
      if (availableWallets.length === 0) throw new Error("No Cardano wallets found.");

      this.walletAddress = null;
      this.walletName = null;

      const walletName = await this.showWalletSelectionModal(availableWallets);
      const selectedWallet = window.cardano[walletName];
      if (!selectedWallet) throw new Error("Selected wallet is not available.");

      await this.lucid.selectWallet(selectedWallet);
      const api = await selectedWallet.enable();
      const networkId = await api.getNetworkId();
      const usedAddresses = typeof api.getUsedAddresses === "function" ? await api.getUsedAddresses() : [];
      const address = usedAddresses.length > 0 ? usedAddresses[0] : await api.getChangeAddress();
      if (!address) throw new Error(`${walletName} failed to provide an address`);

      this.walletAddress = address;
      this.walletName = walletName;
      const walletInfo: WalletInfo = {
        name: walletName,
        address: this.walletAddress,
        network: networkId === 1 ? "Mainnet" : "Preprod"
      };

      toast.success(`${walletName} wallet connected!`);
      if (updateUI) updateUI(walletInfo);
      return walletInfo;
    } catch (error: any) {
      toast.error(`Wallet connection failed: ${error.message || "Unknown error"}`);
      throw new Error(`Wallet connection failed: ${error.message}`);
    }
  }

  private getAvailableCardanoWallets(): string[] {
    return Object.keys(window.cardano || {}).filter(wallet => window.cardano[wallet]?.enable);
  }

  private async showWalletSelectionModal(wallets: string[]): Promise<string> {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: black; padding: 20px;
        border-radius: 8px; color: white;
        box-shadow: 0 4px 10px rgba(255, 102, 0, 0.5);
        text-align: center; z-index: 1000;
      `;
      
      wallets.forEach(wallet => {
        const button = document.createElement("button");
        button.innerText = wallet;
        button.style.cssText = `background: black; color: white; padding: 10px; border: 2px solid white; cursor: pointer; border-radius: 5px; margin: 5px;`;
        button.addEventListener("click", () => {
          modal.remove();
          resolve(wallet);
        });
        modal.appendChild(button);
      });
      
      document.body.appendChild(modal);
    });
  }

  async deployScript(plutusScript: string): Promise<ScriptDeployment> {
    if (!this.lucid || !this.walletAddress) {
      throw new Error('Wallet not connected');
    }
    try {
      const scriptCBOR = this.convertScriptToCBOR(plutusScript);
      const validator = await this.lucid.utils.validatorToAddress(scriptCBOR);
      const minAda = BigInt(2000000);
      
      const tx = await this.lucid
        .newTx()
        .payToContract(validator, { inline: Date.now().toString() }, { lovelace: minAda })
        .attachPlutusScript(scriptCBOR)
        .complete();
      
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      await this.lucid.awaitTx(txHash);
      
      const scriptAddress = this.generateScriptAddress(scriptCBOR);
      
      return {
        scriptAddress,
        txHash,
        datum: Date.now().toString()
      };
    } catch (error: any) {
      throw new Error(`Script deployment failed: ${error.message}`);
    }
  }

  setNetwork(network: Network): void {
    this.currentNetwork = network;
  }
}

export const walletService = new WalletService();
