import GameStateService from "../services/GameStateService";

interface IUpgradeConfig {
    key: string
    name: string
    description: string
    requirements?: Array<string>
    icon?: string,
    action?: CallableFunction,
    price: number,
    stackPrices?: boolean;
}

export class Upgrade {
    public key: string;
    public name: string;
    public description: string;
    public icon: string|undefined;
    public requirements: Array<string>|undefined;
    public active: boolean = false;

    private callback: CallableFunction|undefined;
    private stackPrices: boolean = false;
    private value: number;

    constructor(config: IUpgradeConfig){
        this.key = config.key;
        this.name = config.name;
        this.description = config.description;
        this.value = config.price;

        if(config.icon){
            this.icon = config.icon;
        }

        if(config.requirements){
            this.requirements = config.requirements;
        }

        if(config.stackPrices){
            this.stackPrices = true;
        }

        if(config.action){
            this.callback = config.action;
        }

        GameStateService.upgrades.value.push(this);
    }

    get price(){
        if(this.stackPrices){
            // TODO: do something here to add sum of this upgrade's price + price of its requirements
            return this.value;
        }
        return this.value;
    }

    canBuy(){
        return GameStateService.inventory.value.money >= this.price;
    }

    purchase(){
        if(GameStateService.inventory.value.money < this.price){
            return;
        }

        GameStateService.inventory.value.money -= this.price;
        this.active = true;
        if(this.callback){
            this.callback();
        }
    }
}