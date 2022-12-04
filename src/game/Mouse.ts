export class Mouse {
    public static x: number;
    public static y: number;

    public static init(){
        Mouse.x = 0;
        Mouse.y = 0;

        window.addEventListener('mousemove', (event: MouseEvent) => {
            Mouse.x = event.clientX;
            Mouse.y = event.clientY;
        });
    }
}
