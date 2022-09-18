<template>
  <div 
    class="w-screen h-screen"
  >
    <canvas id="canvas" class="z-0"></canvas>

    <button
      class="absolute top-3 left-3 p-2 bg-black hover:bg-green-300 rounded font-primary text-white hover:text-black text-center"
      @click="popUpAtiva = 'criarLugar'"
    >
      CRIAR LUGAR
    </button>

    <button
      class="absolute top-16 left-3 p-2 bg-black hover:bg-green-300 rounded font-primary text-white hover:text-black text-center"
      @click="popUpAtiva = 'criarTransicao'"
    >
      CRIAR TRANSIÇÃO
    </button>

    <button
      class="absolute top-28 left-3 mt-1 p-2 bg-black hover:bg-green-300 rounded font-primary text-white hover:text-black text-center"
      @click="popUpAtiva = 'criarConexao'"
    >
      CRIAR CONEXÃO
    </button>

    <button
      class="absolute top-40 mt-2 left-3 mt-1 p-2 bg-black hover:bg-green-300 rounded font-primary text-white hover:text-black text-center"
      @click="executaCiclo()"
    >
      EXECUTA CICLO
    </button>

    <PopUpCriarLugar
      v-if="popUpAtiva === 'criarLugar'"
      @criarLugar="criarLugar($event)"
    />

    <PopUpCriarTransicao
      v-if="popUpAtiva === 'criarTransicao'"
      @criarTransicao="criarTransicao($event)"
    />

    <PopUpCriarConexao
      v-if="popUpAtiva === 'criarConexao'"
      :lugares="lugares"
      :transicoes="transicoes"
      @criarConexao="criarConexao($event)"
    />

    <div
      v-for="(item, index) in lugares"
      class="w-full h-full"
      :key="index"
    >
      <Lugar
        v-if="lugares.length > 0"
        :nome="item"
        :marca="marcasLugares[index]"
        @atualizaPosicaoLugar="atualizaPosicaoLugar($event)"
        @adicionaMarca="adicionaMarca(index)"
        @retiraMarca="removeMarca(index)"
      />
    </div>

    <div
      v-for="(item, index) in transicoes"
      class="w-full h-full"
      :key="index"
    >
      <Transicao
        v-if="transicoes.length > 0"
        :nome="item"
        :status="statusTransicoes[index]"
        @atualizaPosicaoTransicao="atualizaPosicaoTransicao($event)"
      />
    </div>
  </div>
</template>

<script>
import PopUpCriarLugar from './PopUpCriarLugar.vue';
import PopUpCriarTransicao from './PopUpCriarTransicao.vue';
import PopUpCriarConexao from './PopUpCriarConexao.vue';

import Conexao from './Conexao.vue';
import Lugar from './Lugar.vue';
import Transicao from './Transicao.vue';

export default {
  name: 'HelloWorld',
  components: {
    PopUpCriarLugar,
    PopUpCriarTransicao,
    PopUpCriarConexao,
    Lugar,
    Transicao,
    Conexao
  },
  data() {
    return {
      popUpAtiva: '',

      lugares: [],
      posicaoLugares: [],
      marcasLugares: [],
  
      transicoes: [],
      posicaoTransicoes: [],
      statusTransicoes: [],

      conexoes: [],
      posicaoConexoes: [],
    }
  },
  mounted() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  methods: {

    criarLugar(nome) {
      this.popUpAtiva = '';
      this.lugares.push(nome);
      this.posicaoLugares.push([100,200]);
      this.marcasLugares.push(0);
    },

    criarTransicao(nome) {
      this.popUpAtiva = '';
      this.transicoes.push(nome);
      this.posicaoTransicoes.push([100,200]);
      this.statusTransicoes.push(false);
    },

    criarConexao(conexaoInfos) {
      this.popUpAtiva = '';
      let lugarSelecionado = conexaoInfos['lugar']
      let transicaoSelecionada = conexaoInfos['transicao']
      this.conexoes.push([lugarSelecionado, transicaoSelecionada, conexaoInfos['tipo']])

      let indexLugar = this.lugares.indexOf(lugarSelecionado)
      let indexTransicao = this.transicoes.indexOf(transicaoSelecionada)
      let posLugar = this.posicaoLugares[indexLugar]
      let posTransicao = this.posicaoTransicoes[indexTransicao]
      this.posicaoConexoes.push([[posLugar[0], posLugar[1]], [posTransicao[0], posTransicao[1]]])

      this.desenhaLinhas();
      this.verificaTransicoes();
    },

    atualizaPosicaoLugar(posicaoInfos) {
      let index = this.lugares.indexOf(posicaoInfos['nome'])
      this.posicaoLugares[index] = [posicaoInfos['x'], posicaoInfos['y']]

      for (let i=0; i < this.conexoes.length; i++) {
        if (this.conexoes[i][0] === posicaoInfos['nome']) {
          this.posicaoConexoes[i][0] = [posicaoInfos['x'], posicaoInfos['y']]
          this.desenhaLinhas();
        }
      }
    },

    atualizaPosicaoTransicao(posicaoInfos) {
      let index = this.transicoes.indexOf(posicaoInfos['nome'])
      this.posicaoTransicoes[index] = [posicaoInfos['x'], posicaoInfos['y']]

      for (let i=0; i < this.conexoes.length; i++) {
        if (this.conexoes[i][1] === posicaoInfos['nome']) {
          this.posicaoConexoes[i][1] = [posicaoInfos['x'], posicaoInfos['y']]
          this.desenhaLinhas();
        }
      }
    },

    desenhaLinhas() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      for (let i=0; i < this.posicaoConexoes.length; i++) {
        if (this.conexoes[i][2] === 'entrada') { ctx.lineWidth = 5; }
        else { ctx.lineWidth = 2; }
        ctx.beginPath();
        ctx.moveTo(this.posicaoConexoes[i][0][0] + 40, this.posicaoConexoes[i][0][1] + 40);
        ctx.lineTo(this.posicaoConexoes[i][1][0] + 20, this.posicaoConexoes[i][1][1] + 20);
        ctx.stroke();
      }
    },

    verificaTransicoes() {
      let transicaoAnalisada;
      let achouLugarConectado;
      for (let i=0; i < this.transicoes.length; i++) {
        transicaoAnalisada = this.transicoes[i];
        this.statusTransicoes[i] = true;
        achouLugarConectado = false;
        for (let j=0; j < this.conexoes.length; j++) {
          if (this.conexoes[j][1] === transicaoAnalisada && this.conexoes[j][2] === 'entrada') {
            let indexLugar = this.lugares.indexOf(this.conexoes[j][0]);
            if (this.marcasLugares[indexLugar] == 0) { this.statusTransicoes[i] = false;}
            achouLugarConectado = true;
          }
        }
        if (this.statusTransicoes[i] === true && achouLugarConectado === false) {this.statusTransicoes[i] = false;}
      }
    },

    adicionaMarca(index) {
      this.marcasLugares[index] += 1;
      this.verificaTransicoes();
    },

    removeMarca(index) {
      this.marcasLugares[index] -= 1;
      this.verificaTransicoes();
    },

    executaCiclo() {
      let transicaoAnalisada;
      for (let i=0; i < this.transicoes.length; i++) {
        if (this.statusTransicoes[i] === true) {
          transicaoAnalisada = this.transicoes[i];
          for (let j=0; j < this.conexoes.length; j++) {
            if (this.conexoes[j][1] === transicaoAnalisada && this.conexoes[j][2] === 'entrada') {
              let indexLugar = this.lugares.indexOf(this.conexoes[j][0]);
              this.removeMarca(indexLugar);
            }
            else if (this.conexoes[j][1] === transicaoAnalisada && this.conexoes[j][2] === 'saída') {
              let indexLugar = this.lugares.indexOf(this.conexoes[j][0]);
              this.adicionaMarca(indexLugar);
            }
          }
        }
      }
      this.verificaTransicoes();
    },
  }
}
</script>

<style scoped>
  #myCanvas { 
     position: absolute; 
     width: 100%; 
     height: 100%; 
     overflow: hidden
   }
</style>