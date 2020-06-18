const express = require('express');
const cors = require('cors');
var amqp = require('amqplib/callback_api');
var casual = require('casual');
const leite = require('leite')();


class ExpressConfig {
  constructor() {
    this.express = express();
    this.middlawares();
    this.routes();
    this.exchange = '';
    this.conn = null;
    amqp.connect('', (err, conn) => {
      this.conn = conn;
    });
  }

  gerarDados() {
    return {
      uid: casual.uuid,
      nome: casual.first_name,
      sobrenome: casual.last_name,
      email: leite.pessoa.email(),
      cpf: leite.pessoa.cpf(),
      celular: `5199131${casual.numerify('####')}`,
      dados_motorista: {
        dt_nascimento: leite.pessoa.nascimento({ idade: leite.pessoa.idade({ min: 18, max: 60 }) }),
        endereco: casual.street,
        numero: Number(casual.building_number),
        complemento: null,
        cep: leite.localizacao.cep(),
        bairro: leite.localizacao.bairro(),
        cidade: leite.localizacao.cidade(),
        uf: leite.localizacao.estado(),
        profissao: 'Motorista',
        nome_mae: casual.full_name
      },
      dados_bancarios: {
        agencia: Number(casual.numerify('####')),
        conta: Number(casual.numerify('######')),
        digito: casual.numerify('#'),
        banco_tipo_conta: {
          nome: "Conta Corrente",
          banco: {
            codigo_compencacao: '033',
          }
        }
      }
    }
  }

  middlawares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  routes() {
    this.express.get('/', (req, res) => res.send('<h1>Server rodando</h1>'));

    this.express.post('/update', (req, res) => {
      this.conn.createChannel((err, ch) => {
        ch.publish(this.exchange, '', new Buffer(JSON.stringify('')));
        ch.close();
        res.send('Sucesso');
      });
    });

    this.express.post('/register', (req, res) => {
      this.conn.createChannel((error, ch) => {
        const dado = this.gerarSubSeller();
        console.log('\n\n\dado enviado: ', dado);
        ch.publish(this.exchange, 'register-subseller', new Buffer(JSON.stringify(dado)));
        ch.close();
        res.send('sucesso')
      });
    });

    this.express.post('/deaccredit', (req, res) => {
      this.conn.createChannel((err, ch) => {
        ch.publish(this.exchange, 'deaccredit-subseller', new Buffer(JSON.stringify('')));
        ch.close();
        res.send('sucesso');
      });
    });
  }
}

module.exports = new ExpressConfig().express;