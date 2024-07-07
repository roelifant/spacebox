import GameStateService from "../services/GameStateService";

interface IUpgradeConfig {
    key: string
    name: string
    description: string
    requirements?: Array<string>
    icon?: string,
    action?: CallableFunction,
    price: number,
    stackWith?: string;
}

export class Upgrade {
    public key: string;
    public name: string;
    public description: string;
    public icon: string | undefined;
    public requirements: Array<string> | undefined;
    public active: boolean = false;

    private callback: CallableFunction | undefined;
    private stackWith: string | undefined;
    public value: number;

    constructor(config: IUpgradeConfig) {
        this.key = config.key;
        this.name = config.name;
        this.description = config.description;
        this.value = config.price;

        if (config.icon) {
            this.icon = config.icon;
        }

        if (config.requirements) {
            this.requirements = config.requirements;
        }

        if (config.stackWith) {
            this.stackWith = config.stackWith;
        }

        if (config.action) {
            this.callback = config.action;
        }

        GameStateService.upgrades.value.push(this);
    }

    get price() {
        if (this.stackWith) {
            let price = this.value;
            GameStateService.getActiveUpgrades(this.stackWith)
                .forEach(upgrade => price += upgrade.value);

            return price;
        }
        return this.value;
    }

    get unlocked() {
        if (!this.requirements) return true;

        for (const requirement of this.requirements) {
            if (!GameStateService.hasUpgrade(requirement)) {
                return false;
            }
        }

        return true;
    }

    canBuy() {
        return GameStateService.inventory.value.money >= this.price;
    }

    purchase() {
        if (GameStateService.inventory.value.money < this.price) {
            return;
        }

        GameStateService.inventory.value.money -= this.price;
        this.active = true;
        if (this.callback) {
            this.callback();
        }
    }
}