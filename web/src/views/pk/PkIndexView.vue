<template>
  <PlayGround v-if="$store.state.pk.status === 'playing'"></PlayGround>  
  <!-- 状态位playing才展示对战页面 -->
  <MatchGround v-if="$store.state.pk.status === 'matching'"></MatchGround>
  <ResultBoard v-if="$store.state.pk.loser !== 'none'"></ResultBoard>
</template>

<script>
import PlayGround from '@/components/PlayGround.vue'
import MatchGround from '@/components/MatchGround.vue'
import ResultBoard from '@/components/ResultBoard.vue'
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    PlayGround,
    MatchGround,
    ResultBoard,
  },
  setup() {
    const store = useStore();
    store.commit("updateLoser", "none");
    let socket = null;
    const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}`;
    // 当前组件被挂载的时候创建连接（当前页面打开）
    onMounted(() => {
      // 先给一个对手的默认信息
      store.commit("updateOpponent", {
        username: "我的对手",
        photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
      })

      console.log("对手信息:", store.state.pk.opponent_username, store.state.pk.opponent_photo);
      socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log("connected!");
        store.commit("updateSocket", socket);  // 先把socket存到全局变量中
      }

      socket.onmessage = msg => {
        const data = JSON.parse(msg.data);
        console.log(data);
        if (data.event === "start-matching") { // 匹配成功
          store.commit("updateOpponent", 
            {
              username: data.opponent_username,
              photo: data.opponent_photo,
            });
            setTimeout(() => {
              store.commit("updateStatus", "playing");

            }, 200);
            store.commit("updateGame", data.game);
        } else if (data.event === "move") {
          console.log(data);
          const game = store.state.pk.gameObject;
          const [snake0, snake1] = game.snakes;
          snake0.set_direction(data.a_direction);
          snake1.set_direction(data.b_direction);
        } else if (data.event === "result") {
          console.log(data);
          const game = store.state.pk.gameObject;
          const [snake0, snake1] = game.snakes;

          if (data.loser === "all" || data.loser === "A") {
            snake0.status = "die";
          }
          if (data.loser === "all" || data.loser === "B") {
            snake1.status = "die";
          }
          store.commit("updateLoser", data.loser);
        }
      }

      socket.onclose = () => {
        console.log("disconnected!");
      }
    })

    // 当前组件被卸载的时候关闭连接(当前页面关闭)
    onUnmounted(() => {
      socket.close();
      store.commit("updateStatus", "matching");  // 关闭连接后，把socket设为null
    })
  }
}
</script>

<style scoped>
</style>