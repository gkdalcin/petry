<template>
    <div
      class="botao w-10 h-10 z-0 pt-1.5 text-center text-white"
      :class="status? 'bg-green-400':'bg-stone-400'"
      id="transicao"
      @drag="movingHandler"
      draggable="true"
    >
        <button
          class="absolute top-0 right-1 text-xs"
          @click="$emit('removeTransicao', nome)"
        >
            x
        </button>
        {{ nome }}
    </div>
</template>

<script>

export default {
    name: "Transicao",
    props: {
        nome: {type: String, required: true},
        status: {type: Boolean, required: true},
        posicaoInicial: {type: Array, required: true},
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
    mounted() {
      if (this.posicaoInicial[0] !== 100 || this.posicaoInicial[1] !== 200) {
        this.data_posx = this.posicaoInicial[0]
        this.data_posy = this.posicaoInicial[1]
        this.$emit('atualizaPosicaoLugar', {'nome': this.nome, 'x': this.posicaoInicial[0], 'y': this.posicaoInicial[1]})
      }
    },
    methods: {
        movingHandler(event) {
            if (event.pageX !== 0 && event.pageY !== 0) {
                this.data_posx = event.pageX
                this.data_posy = event.pageY
                this.$emit('atualizaPosicaoTransicao', {'nome': this.nome, 'x': this.data_posx, 'y': this.data_posy})
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