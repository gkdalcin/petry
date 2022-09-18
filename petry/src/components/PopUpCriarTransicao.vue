<template>
  <div class="flex w-full h-full justify-center">
    <div class="absolute z-20 w-full h-full bg-black opacity-50 font-primary"/>
    <div
      class="flex-col absolute bottom-1/2 z-20 p-6 bg-gray-100 rounded-lg space-y-3"
    >
      <div class="flex items-center justify-center space-x-1.5">
        <div>Nome da transição:</div>
        <input
          class="w-32 h-8 bg-stone-300 px-1 text-sm"
          v-model="nome"
        />
      </div>
      <div class="flex justify-center">
        <button
          class="px-2 py-1 bg-black hover:bg-green-400 text-white hover:text-black"
          @click="criarTransicao"
        >
          Criar
        </button>
      </div>
    </div>
  </div> 
</template>

<script>

export default {
  name: 'PopUpCriarTransicao',
  methods: {
    criarTransicao() {
      this.$emit('criarTransicao', this.nome)
    },
  },
  data() {
    return {
      nome: ''
    }
  },
}
</script>
