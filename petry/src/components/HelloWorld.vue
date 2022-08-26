<template>
  <div class="w-screen h-screen">
    <button
      class="absolute top-3 left-3 p-2 bg-black hover:bg-green-300 rounded font-primary text-white hover:text-black text-center"
      @click="abrirPopUpCriarLugar"
    >
      CRIAR LUGAR
    </button>

    <PopUpCriarLugar
      v-if="popUpCriarLugar"
      @criarLugar="criarLugar()"
    />

      <div
        v-if="lugares.length > 0"
        class="botao flex-col w-20 h-20 bg-red-300 space-y-2"
        id="lugar"
        draggable="true"
      >
        <div class="text-center font-primary font-bold mt-3">
          {{  marca  }}
        </div>
        <div class="flex items-center text-center justify-around">
          <div
            class="w-4 h-4 bg-red-400 leading-none"
            @click="adicionarMarca()"
          >
            +
          </div>
          <div
            class="w-4 h-4 bg-red-400 leading-none"
            @click="retirarMarca()"
          >
            -
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import PopUpCriarLugar from './PopUpCriarLugar.vue';

export default {
  name: 'HelloWorld',
  components: {
    PopUpCriarLugar,
  },
  data() {
    return {
      lugares: [],
      popUpCriarLugar: false,
      marca: 0,
    }
  },
  mounted() {
    document.addEventListener("drag", (event) => {
      if (event.pageX !== 0 && event.pageY !== 0) {
        document.body.style.setProperty('--posx', event.pageX + 'px');
        document.body.style.setProperty('--posy', event.pageY + 'px');
      }
    });
  },
  methods: {
    abrirPopUpCriarLugar() {
      this.popUpCriarLugar = true;
    },
    criarLugar() {
      this.popUpCriarLugar = false;
      this.lugares = [1];
    },
    adicionarMarca() {
      this.marca += 1;
    },
    retirarMarca() {
      if (this.marca > 0) { this.marca -= 1; }
    },
  }
}
</script>

<style scoped>
.botao {
    top: var(--posy);
    left: var(--posx);
    position: absolute;
}
</style>