<template>
    <div class="flex w-full h-full justify-center">
        <div class="absolute z-20 w-full h-full bg-black opacity-50 font-primary"/>
        <div
          class="flex-col absolute bottom-1/2 z-20 p-6 bg-gray-100 rounded-lg space-y-3"
        >
          <div class="flex-col items-center justify-center">
            <div>Nome do lugar:</div>
            <div class="flex space-x-0.5">
                <div
                    v-for="(item, index) in lugares"
                    :key="index"
                >
                    <button 
                      class="px-2 py-1 rounded-full"
                      :class="lugarSelecionado === item? 'bg-black text-white':'bg-stone-300'"
                      @click="lugarSelecionado = item"
                    >
                        {{ item }}
                    </button>
                </div>
            </div>
          </div>
          <div class="flex-col items-center justify-center">
            <div>Nome da transição:</div>
            <div class="flex space-x-0.5">
                <div
                    v-for="(item, index) in transicoes"
                    :key="index"
                >
                    <button 
                      class="px-2 py-1 rounded-full"
                      :class="transicaoSelecionada === item? 'bg-black text-white':'bg-stone-300'"
                      @click="transicaoSelecionada = item"
                    >
                        {{ item }}
                    </button>
                </div>
            </div>
          </div>
          <div class="flex-col items-center justify-center">
            <div>Sentido da conexão:</div>
            <div class="flex space-x-0.5">
                <div
                    v-for="(item, index) in ['entrada', 'saída']"
                    :key="index"
                >
                    <button 
                      class="px-2 py-1 rounded-full"
                      :class="sentidoSelecionado === item? 'bg-black text-white':'bg-stone-300'"
                      @click="sentidoSelecionado = item"
                    >
                        {{ item }}
                    </button>
                </div>
            </div>
          </div>
          <div class="flex-col items-center justify-center">
            <div>Tipo de conexão:</div>
            <div class="flex space-x-0.5">
                <div
                    v-for="(item, index) in ['normal', 'inibidora', 'reset']"
                    :key="index"
                >
                    <button 
                      class="px-2 py-1 rounded-full"
                      :class="tipoSelecionado === item? 'bg-black text-white':'bg-stone-300'"
                      @click="tipoSelecionado = item"
                    >
                        {{ item }}
                    </button>
                </div>
            </div>
          </div>
          <div class="flex items-center justify-start space-x-1.5">
            <div>Nome do lugar:</div>
            <input
              class="w-12 h-7 bg-stone-300 px-1 text-sm text-center"
              v-model="peso"
              type="number"
            />
          </div>
          <div class="flex justify-center">
            <button
              class="px-2 py-1 bg-black hover:bg-green-400 text-white hover:text-black"
              @click="criarConexao"
            >
                Criar
            </button>
          </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'PopUpCriarConexao',
    props: {
        lugares: {type: Array, required: true},
        transicoes: {type: Array, required: true},
    },
    data() {
      return {
        nome: '',
        lugarSelecionado: '',
        transicaoSelecionada: '',
        sentidoSelecionado: 'entrada',
        tipoSelecionado: 'normal',
        peso: 1
      }
    },
    methods: {
        criarConexao() {
            this.$emit('criarConexao', {'lugar': this.lugarSelecionado, 'transicao': this.transicaoSelecionada, 'sentido': this.sentidoSelecionado, 'tipo': this.tipoSelecionado, 'peso': this.peso})
        },
    },
}
</script>
