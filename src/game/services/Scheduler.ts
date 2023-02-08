import { Manager } from "../Manager";

class ScheduledEvent {

    private callback: CallableFunction;
    private duration: number;
    private executeTime: number = 0;
    private repeat: boolean;

    public done: boolean = false;

    constructor(callback: CallableFunction, duration: number, repeat: boolean, time: number){
        this.callback = callback;
        this.duration = duration;
        this.repeat = repeat;
        this.setExecutionTime(time);
    }

    private setExecutionTime(time: number){
        this.executeTime = this.duration + time;
    }

    public trigger(time: number){
        if(this.done) return;

        if(time > this.executeTime){

            if(!this.repeat) this.done = true;

            this.callback();

            if(this.repeat) this.setExecutionTime(time);
        }
    }
}

export default class Scheduler {
    private events: Array<ScheduledEvent> = [];
    private elapsed: number = 0;

    public set(callback: CallableFunction, seconds: number, repeat: boolean = false){
        this.events.push(new ScheduledEvent(callback, seconds * 1000, repeat, this.elapsed));
    }

    public update(){
        this.elapsed += Manager.time;

        this.events.forEach((event: ScheduledEvent) => event.trigger(this.elapsed));

        this.events = this.events.filter((event: ScheduledEvent) => !event.done);
    }
}