import { Ref, ref } from "vue";

class FlightUIService {
    public canLand: Ref<boolean> = ref(false);
}

export default new FlightUIService();