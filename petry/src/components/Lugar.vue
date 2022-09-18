<template>
    <div
      class="botao flex-col w-20 h-20 z-0 bg-red-300 space-y-1"
      id="lugar"
      @drag="movingHandler"
      draggable="true"
    >
        <div class="text-center font-primary text-xs mt-1">
            {{ nome }}
        </div>
        <div class="text-center font-primary font-bold mt-2">
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
</template>

<script>

export default {
    name: "Lugar",
    props: {
        nome: {type: String, required: true},
        marca: {type: Number, required: true}
    },
    data() {
            return {
                data_posx: 100,
                data_posy: 200,
            }
        },
    computed: {
        comp_posx: {
            get() {
                return this.data_posx.toString() + 'px'
            }
        },
        comp_posy: {
            get() {
                return this.data_posy.toString() + 'px'
            }
        },
    },
    methods: {
        adicionarMarca() {
            this.$emit('adicionaMarca');
        },
        retirarMarca() {
            if (this.marca > 0) { this.$emit('retiraMarca'); }
        },
        movingHandler(event) {
            if (event.pageX !== 0 && event.pageY !== 0) {
                this.data_posx = event.pageX
                this.data_posy = event.pageY
                this.$emit('atualizaPosicaoLugar', {'nome': this.nome, 'x': this.data_posx, 'y': this.data_posy})
            }
        }
    }
}
</script>

<style scoped>
.botao {
    top: v-bind(comp_posy);
    left: v-bind(comp_posx);
    position: absolute;
}
</style>
