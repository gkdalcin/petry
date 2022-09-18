<template>
    <div
      class="botao w-10 h-10 z-0 pt-1.5 text-center text-white"
      :class="status? 'bg-green-400':'bg-blue-400'"
      id="transicao"
      @drag="movingHandler"
      draggable="true"
    >
        {{ nome }}
    </div>
</template>

<script>

export default {
    name: "Transicao",
    props: {
        nome: {type: String, required: true},
        status: {type: Boolean, required: true},
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