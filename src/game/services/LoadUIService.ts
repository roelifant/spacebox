import { Ref, ref } from "vue";

class LoadUIService {
    public progress: Ref<number> = ref(0);
}

export default new LoadUIService();