export class Keyboard {
    private static state: Map<string, boolean>;
    private static events: Map<string, CallableFunction>;

    public static init() {
        Keyboard.state = new Map<string, boolean>();
        Keyboard.events = new Map<string, CallableFunction>();

        document.addEventListener("keydown", Keyboard.keyDown);
        document.addEventListener("keyup", Keyboard.keyUp);
    }
    private static keyDown(e: KeyboardEvent): void {
        console.log('Input: '+e.code);
        Keyboard.state.set(e.code, true);
    }
    private static keyUp(e: KeyboardEvent): void {
        Keyboard.state.set(e.code, false);

        Keyboard.events.forEach((callback: CallableFunction, code: string) => {
            if(e.code === code) callback();
        });
    }

    public static get(code: string): boolean {
        let keyState = Keyboard.state.get(code);
        if(typeof keyState === 'undefined'){
            return false;
        }
        return keyState;
    }

    public static registerEvent(code: string, callback: CallableFunction) {
        Keyboard.events.set(code, callback);
    }

    public static removeEvent(code: string){
        Keyboard.events.delete(code);
    }
}
