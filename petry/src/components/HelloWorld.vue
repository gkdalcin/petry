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

    <button
      class="absolute top-3 mt-2 right-3 mt-1 p-2 bg-black hover:bg-green-300 rounded font-primary text-white hover:text-black text-center"
      @click="criaRedeReferencia()"
    >
      REDE DE REFERÊNCIA
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
        v-if="lugares.length > 0 && lugaresExists[index]"
        :nome="item"
        :marca="marcasLugares[index]"
        :posicaoInicial="posicaoLugares[index]"
        @atualizaPosicaoLugar="atualizaPosicaoLugar($event)"
        @adicionaMarca="adicionaMarca(index, 1)"
        @retiraMarca="removeMarca(index, 1)"
        @removeLugar="removeLugar($event)"
      />
    </div>

    <div
      v-for="(item, index) in transicoes"
      class="w-full h-full"
      :key="index"
    >
      <Transicao
        v-if="transicoes.length > 0 && transicaoExists[index]"
        :nome="item"
        :status="statusTransicoes[index]"
        :posicaoInicial="posicaoTransicoes[index]"
        @atualizaPosicaoTransicao="atualizaPosicaoTransicao($event)"
        @removeTransicao="removeTransicao($event)"
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
      lugaresExists: [],
  
      transicoes: [],
      posicaoTransicoes: [],
      statusTransicoes: [],
      transicaoExists: [],

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
      this.lugaresExists.push(true);
    },

    criarTransicao(nome) {
      this.popUpAtiva = '';
      this.transicoes.push(nome);
      this.posicaoTransicoes.push([100,200]);
      this.statusTransicoes.push(false);
      this.transicaoExists.push(true);
    },

    criarConexao(conexaoInfos) {
      this.popUpAtiva = '';
      let lugarSelecionado = conexaoInfos['lugar']
      let transicaoSelecionada = conexaoInfos['transicao']
      this.conexoes.push([lugarSelecionado, transicaoSelecionada, conexaoInfos['sentido'], conexaoInfos['tipo'], conexaoInfos['peso']])

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
        let fromx;
        let fromy;
        let tox;
        let toy;
        if (this.conexoes[i][2] === 'entrada') {
          fromx = this.posicaoConexoes[i][0][0] + 40;
          fromy = this.posicaoConexoes[i][0][1] + 40;
          tox = this.posicaoConexoes[i][1][0] + 20;
          toy = this.posicaoConexoes[i][1][1] + 20;
        }
        else {
          tox = this.posicaoConexoes[i][0][0] + 40;
          toy = this.posicaoConexoes[i][0][1] + 40;
          fromx = this.posicaoConexoes[i][1][0] + 20;
          fromy = this.posicaoConexoes[i][1][1] + 20;
        }
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.posicaoConexoes[i][0][0] + 40, this.posicaoConexoes[i][0][1] + 40);
        ctx.lineTo(this.posicaoConexoes[i][1][0] + 20, this.posicaoConexoes[i][1][1] + 20);
        ctx.stroke();
        this.canvas_arrow(ctx, fromx, fromy, tox, toy, 7);
        if (this.conexoes[i][3] === 'reset') {
          this.canvas_arrow_reset(ctx, fromx, fromy, tox, toy, 7);
          this.canvas_arrow_resetB(ctx, fromx, fromy, tox, toy, 7);
        }
        if (this.conexoes[i][3] === 'inibidora') {
          ctx.beginPath();
          let angle = Math.atan2(toy-fromy,tox-fromx)
          let x =  tox -30*Math.cos(angle);
          let y =  toy -30*Math.sin(angle);
          ctx.arc(x, y, 6, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'black';
          ctx.fill();
        }
      }
    },

    canvas_arrow(context, fromx, fromy, tox, toy, r) {
      var x_center = (fromx + tox)/2;
      var y_center = (fromy + toy)/2;
      var angle;
      var x;
      var y;
      context.beginPath();
      angle = Math.atan2(toy-fromy,tox-fromx)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.moveTo(x, y);
      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.lineTo(x, y);
      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.lineTo(x, y);
      context.closePath();
      context.fill();
    },

    canvas_arrow_reset(context, fromx, fromy, tox, toy, r) {
      var angle = Math.atan2(toy-fromy,tox-fromx)
      var x_center = tox -30*Math.cos(angle);
      var y_center = toy -30*Math.sin(angle);
      var x;
      var y;
      context.beginPath();
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.moveTo(x, y);
      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.lineTo(x, y);
      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.lineTo(x, y);
      context.closePath();
      context.fill();
    },

    canvas_arrow_resetB(context, fromx, fromy, tox, toy, r) {
      var angle = Math.atan2(toy-fromy,tox-fromx)
      var x_center = tox -40*Math.cos(angle);
      var y_center = toy -40*Math.sin(angle);
      var x;
      var y;
      context.beginPath();
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.moveTo(x, y);
      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.lineTo(x, y);
      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;
      context.lineTo(x, y);
      context.closePath();
      context.fill();
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
            if (this.marcasLugares[indexLugar] < this.conexoes[j][4] && this.conexoes[j][3] === 'normal') {
              this.statusTransicoes[i] = false;
            }
            else if (this.marcasLugares[indexLugar] >= this.conexoes[j][4] && this.conexoes[j][3] === 'inibidora') {
              this.statusTransicoes[i] = false;
            }
            achouLugarConectado = true;
          }
        }
        if (this.statusTransicoes[i] === true && achouLugarConectado === false) {this.statusTransicoes[i] = false;}
      }
    },

    adicionaMarca(index, peso) {
      this.marcasLugares[index] += peso;
      this.verificaTransicoes();
    },

    removeMarca(index, peso) {
      this.marcasLugares[index] -= peso;
      this.verificaTransicoes();
    },

    resetaMarca(index) {
      this.marcasLugares[index] = 0;
      this.verificaTransicoes();
    },

    executaCiclo() {
      let transicaoAnalisada;
      let statusTransicoesCiclo = {...this.statusTransicoes};
      for (let i=0; i < this.transicoes.length; i++) {
        if (statusTransicoesCiclo[i] === true) {
          transicaoAnalisada = this.transicoes[i];
          for (let j=0; j < this.conexoes.length; j++) {
            if (this.conexoes[j][1] === transicaoAnalisada && this.conexoes[j][2] === 'entrada' && this.conexoes[j][3] === 'normal') {
              let indexLugar = this.lugares.indexOf(this.conexoes[j][0]);
              //this.removeMarca(indexLugar, this.conexoes[j][4]);
              if (this.marcasLugares[indexLugar] >= this.conexoes[j][4]) {
                this.marcasLugares[indexLugar] -= this.conexoes[j][4];
              }
            }
            else if (this.conexoes[j][1] === transicaoAnalisada && this.conexoes[j][2] === 'entrada' && this.conexoes[j][3] === 'reset') {
              let indexLugar = this.lugares.indexOf(this.conexoes[j][0]);
              //this.resetaMarca(indexLugar);
              this.marcasLugares[indexLugar] = 0;
            }
            else if (this.conexoes[j][1] === transicaoAnalisada && this.conexoes[j][2] === 'saída') {
              let indexLugar = this.lugares.indexOf(this.conexoes[j][0]);
              this.marcasLugares[indexLugar] += this.conexoes[j][4];
              //this.adicionaMarca(indexLugar, this.conexoes[j][4]);
            }
          }
        }
      }
      this.verificaTransicoes();
    },

    criaRedeReferencia() {
      this.lugares = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10','L11','L12','L13']
      this.posicaoLugares = [
        [250,10], //L1
        [450,10], //L2
        [650,10], //L3
        [250,200], //L4
        [450,200], //L5
        [650,200], //L6
        [130,350], //L7
        [350,350], //L8
        [450,420], //L9
        [550,350], //L10
        [250,550], //L11
        [450,700], //L12
        [650,550]  //L13
      ];
      this.marcasLugares = [0,2,1,0,0,0,10,0,0,0,0,0,0];
      this.transicoes = ['TA','TB','TC','TD','TE','TF','TG'];
      this.posicaoTransicoes = [[270,135],[470,135],[670,135],[270,370],[470,330],[670,370],[470,570]];
      this.statusTransicoes.push(false);
      let conexoesRef = [
        {'lugar': 'L1', 'transicao': 'TA', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L2', 'transicao': 'TB', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L1', 'transicao': 'TB', 'sentido': 'saída', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L3', 'transicao': 'TC', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L2', 'transicao': 'TF', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L4', 'transicao': 'TA', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L5', 'transicao': 'TB', 'sentido': 'saída', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L6', 'transicao': 'TC', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L6', 'transicao': 'TF', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L4', 'transicao': 'TD', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L5', 'transicao': 'TE', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L6', 'transicao': 'TE', 'sentido': 'entrada', 'tipo': 'inibidora', 'peso': 2},
        {'lugar': 'L7', 'transicao': 'TD', 'sentido': 'entrada', 'tipo': 'reset', 'peso': 1},
        {'lugar': 'L8', 'transicao': 'TD', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L8', 'transicao': 'TE', 'sentido': 'saída', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L9', 'transicao': 'TE', 'sentido': 'saída', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L10', 'transicao': 'TE', 'sentido': 'saída', 'tipo': 'normal', 'peso': 2},
        {'lugar': 'L10', 'transicao': 'TF', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L11', 'transicao': 'TD', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L11', 'transicao': 'TG', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L8', 'transicao': 'TG', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L9', 'transicao': 'TG', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L12', 'transicao': 'TG', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L13', 'transicao': 'TG', 'sentido': 'saída', 'tipo': 'normal', 'peso': 1},
        {'lugar': 'L13', 'transicao': 'TF', 'sentido': 'entrada', 'tipo': 'normal', 'peso': 1},
      ];
      for (let i=0; i < conexoesRef.length; i++) {
        this.criarConexao(conexoesRef[i]);
      }
    },

    removeLugar(nomeLugar) {
      var index = this.lugares.indexOf(nomeLugar);
      this.lugaresExists[index] = false;
      for (let j= this.conexoes.length - 1; j >= 0 ; j--) {
        if (this.conexoes[j][0] === nomeLugar) {
          this.conexoes.splice(j, 1);
          this.posicaoConexoes.splice(j, 1);
        }
      }
      this.desenhaLinhas();
      this.verificaTransicoes();
    },

    removeTransicao(nomeTransicao) {
      var index = this.transicoes.indexOf(nomeTransicao);
      this.transicaoExists[index] = false;
      this.statusTransicoes[index] = false;
      for (let j= this.conexoes.length - 1; j >= 0 ; j--) {
        if (this.conexoes[j][1] === nomeTransicao) {
          this.conexoes.splice(j, 1);
          this.posicaoConexoes.splice(j, 1);
        }
      }
      this.desenhaLinhas();
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