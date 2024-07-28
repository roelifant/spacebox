import { Save } from "../objects/Save";

class SaveService {
    private saveSlot: Save|undefined;

    public setSave(name: string) {
        this.saveSlot = new Save(name);
    }

    public load(): void {
        if(!!this.saveSlot?.data) {
            this.saveSlot?.load()
        }
    }

    public save() {
        this.saveSlot?.save();
    }
}

export default new SaveService();