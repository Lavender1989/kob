<template>
    <div class="playground">
        <!-- 这里是PlayGround组件的内容 -->
        <GameMap></GameMap>
    </div>
</template>

<script>
import GameMap from '@/components/GameMap.vue'
export default {
    components: {
        GameMap
    }
}
</script>
<style scoped>
div.playground {
    width: 60vw;
    height: 70vh;
    margin: 40px auto; /* 自动居中 */
    background: lightblue
}
</style>
