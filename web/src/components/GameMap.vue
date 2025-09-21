<template>
  <div ref="parent" class="gamemap">
    <canvas ref="canvas" tabindex="0"> <!-- tabindex="0"可以输入用户操作 -->
    </canvas>
  </div>
</template>

<script>
import { GameMap } from '../assets/scripts/GameMap';
import { ref, onMounted } from 'vue';
export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);
        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'), parent.value)
        })
        return {
            parent,
            canvas
        }
    }

}
</script>

<style scoped>
div.gamemap {
    /* 和父元素等长 */
    width: 100%;  
    height: 100%;
    display: flex;
    justify-content: center;  /* 水平居中 */
    align-items: center;  /* 垂直居中 */

}
</style>