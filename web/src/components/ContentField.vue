<!-- 存放公共组件 -->
 <template>
  <div class="container content-field">
    <div class="card">
      <div class="card-body">
        <slot></slot>  
        <!-- slot插槽，表示这里的内容可以被外部传入 -->
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
div.content-field {
  margin-top: 20px;
}
</style>