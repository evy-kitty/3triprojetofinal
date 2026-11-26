const db = require("./db")

const ESTRUTURA_CLIENTE = `
CREATE TABLE IF NOT EXISTS cliente (
id int NOT NULL AUTO_INCREMENT,
nome varchar(50) NOT NULL,
cpf char(14) NOT NULL,
celular char(14) NOT NULL,
email varchar(50) NOT NULL,
senha varchar(512) NOT NULL,
PRIMARY KEY (id),
UNIQUE KEY cpf (cpf),
UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;`

const DADOS_CLIENTE = `
INSERT INTO cliente VALUES 
(2,'Isadora','111.222.333-44','(41)98888-1111','isadora.silva@email.com','$2b$10$Jd9o4qJlmnPFiR3kcm6dKeWqAvEcL7sCyMs1c4tAX1UmoBcG3KKVm'),(3,'João','222.333.444-55','(42)97777-2222','joao.santos@email.com','$2b$10$2DleROW/gWa4hDrNc8Qo7uEBtVCY1phJ9Rt4PwdGlv.uACjag0Tum'),(4,'Mariana','333.444.555-66','(43)96666-3333','mariana.oliveira@email.com','$2b$10$IQPlX0G.ZTQnoSffWJtyWeuHLIn9WZR3758Xyq6t1S5jZciG7PwOC'),
(5,'Lucas','444.555.666-77','(44)95555-4444','lucas.almeida@email.com','$2b$10$QBcKRuNFNuyTl.JkGeX2S.L/PYhLsECMOoQksUKRNiCDhMwVjWtV6'),(6,'Ana','555.666.777-88','(45)94444-5555','ana.costa@email.com','$2b$10$Xi1iLfhP.CZLMKEc0iKFcufe4AfpMD/jMFklg7CTZZoPHSNtN.16C'),(7,'Pedro','777.888.999-00','(46)93333-6666','pedro.rocha@email.com','$2b$10$jXZXjybukmw9AwzuM7caleLvdzgPS7EdU2LdbvTXIor4pXq7DEU3y'),(8,'Beatriz','888.999.000-11','(47)92222-7777','beatriz.martins@email.com','$2b$10$VS/5TCIC7HzBdDYAOoneQuX1y8uSji6gDMai5nDEhaU33Ks1dGQ0K'),(9,'Gabriel','999.000.111-22','(48)91111-8888','gabriel.lima@email.com','$2b$10$qY3fXpzBGAWQWsnVlcXZ/OoXyNPhzutqCgmPWUWdkUcb1/LqC4jxy'),(10,'Larissa','123.456.789-10','(49)90000-9999','larissa.souza@email.com','$2b$10$Cmf14ct9/Qg2Rn96fBlrZ.OzR87ZLsE85/3tlkqKkC3sJvrTyCrsW'),(12,'Ianzeen','11.322.322-44','(43)98888-1111','ianzeen.isadora@email.com','$2b$10$uHFUXsiHvOsujPziZrkN2.5M0k.yxR3OTHn5ks/SWHmZcm9fts71.');`
 
 const ESTRUTURA_PRODUTO = `
 CREATE TABLE IF NOT EXISTS produto (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    descricao varchar(255) NOT NULL,
    categoria varchar(50) NOT NULL,
    preco decimal(10,2) NOT NULL,
    caminho_img varchar(255) DEFAULT NULL,
    quantidade_img int NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;`

  const DADOS_PRODUTO = `
    INSERT INTO produto VALUES
    (1,'Fone Gatinho','Fone de ouvido com orelhinhas de gato e som confortável.','Tecnologia',129.90,'img/produto-01.png',3),(2,'Coelhinha de Pelúcia','Coelhinha fofinha com laço rosa para abraçar sempre.','Pelúcias',89.90,'img/produto-02.png',5),(3,'Câmera Instantânea Rosa','Câmera instantânea retrô para registrar momentos divertidos.','Tecnologia',349.90,'img/produto-03.png',2),(4,'Copo Boba Tea','Copo reutilizável com canudo para o seu bubble tea favorito.','Utilidades',39.90,'img/produto-04.png',10),(5,'Almofada Estrela','Almofada macia em formato de estrela sorridente.','Decoração',59.90,'img/produto-05.png',6),(6,'Mochila Lilás','Mochila colorida com chaveiro de pelúcia e vários bolsos.','Utilidades',149.90,'img/produto-06.png',4),(7,'Teclado Colorido','Teclado mecânico com iluminação em degradê pastel.','Tecnologia',199.90,'img/produto-07.png',4),(8,'Controle Sem Fio','Controle sem fio para jogar com os amigos.','Tecnologia',179.90,'img/produto-08.png',5),(9,'Luminária Pote de Estrelas','Pote de vidro com estrelinhas iluminadas para decorar.','Decoração',79.90,'img/produto-09.png',7),(10,'Jiboia no Vasinho','Plantinha fácil de cuidar no vaso minimalista.','Decoração',49.90,'img/produto-10.png',8),(11,'Gatinho Dorminhoco','Gatinho preto de pelúcia descansando sobre livrinhos.','Pelúcias',69.90,'img/produto-11.png',6),(12,'Lava Lamp Rosa','Luminária retrô com bolhas coloridas e brilho suave.','Decoração',119.90,'img/produto-12.png',3),(13,'Toca-Discos Retrô','Toca-discos rosa com estojo portátil e som nostálgico.','Tecnologia',399.90,'img/produto-13.png',2),(14,'Skate Kawaii','Skate estampado com personagens fofos e rodinhas coloridas.','Brinquedos',159.90,'img/produto-14.png',5),(15,'Tênis Chunky Rosa','Tênis estiloso com solado alto e detalhes em rosa.','Utilidades',249.90,'img/produto-15.png',4),(16,'Caneca Gatinho Mágico','Caneca lilás com gatinho, lua e estrelinhas.','Utilidades',44.90,'img/produto-16.png',8),(17,'Óculos Coração','Óculos de sol com lentes em formato de coração.','Utilidades',39.90,'img/produto-17.png',9),(18,'Sapo de Pelúcia','Sapo verde de pelúcia macio e sorridente.','Pelúcias',64.90,'img/produto-18.png',6),(19,'Câmera Retrô Mini','Câmera compacta com visual retrô e alça rosa.','Tecnologia',129.90,'img/produto-19.png',4),(20,'Kit Marcadores Pastel','Estojinho com marcadores coloridos e adesivo de coelho.','Papelaria',34.90,'img/produto-20.png',12),(21,'Óculos Redondos Retrô','Óculos de armação fina com estilo vintage.','Utilidades',59.90,'img/produto-21.png',5),(22,'Caderno Galáxia','Caderno com capa espacial, elástico e marcador.','Papelaria',39.90,'img/produto-22.png',7),(23,'Luvas Patinha','Luvas pretas com almofadinhas rosa para o frio.','Utilidades',29.90,'img/produto-23.png',10),(24,'Donut Squishy','Donut de borracha macia com cobertura rosa e confeitos.','Brinquedos',24.90,'img/produto-24.png',15),(25,'Algodão-Doce','Algodão-doce cor-de-rosa para deixar o dia mais doce.','Utilidades',12.90,'img/produto-25.png',20),(26,'Corgi de Pelúcia','Corgi deitadinho e macio para acompanhar você.','Pelúcias',84.90,'img/produto-26.png',4),(27,'Globo de Neve Casinha','Globo de neve com casinha, pinheiros e brilho encantado.','Decoração',89.90,'img/produto-27.png',3),(28,'Laço Rosa Grande','Laço de cetim rosa para cabelo, presente ou decoração.','Utilidades',19.90,'img/produto-28.png',12),(29,'Suculenta Fofa','Suculenta no vasinho com carinha feliz.','Decoração',34.90,'img/produto-29.png',9),(30,'Vela Bubbly','Vela aromática em formato de bolhas cremosas.','Decoração',49.90,'img/produto-30.png',6),(31,'Guarda-Chuva Gatinho','Guarda-chuva rosa e preto com estampa de gatinho.','Utilidades',69.90,'img/produto-31.png',5),(32,'Dados Gigantes','Par de dados brancos com pintinhas pretas.','Brinquedos',27.90,'img/produto-32.png',14),(33,'Urso Xadrez','Urso de pelúcia com laço xadrez e abraço quentinho.','Pelúcias',74.90,'img/produto-33.png',5),(34,'Despertador Retrô','Despertador rosa com sinos clássicos e ponteiros.','Utilidades',54.90,'img/produto-34.png',6),(35,'Coração Pixel','Luminária em formato de coração pixelado rosa.','Decoração',39.90,'img/produto-35.png',8),(36,'Gatinho Squishy','Gatinho amarelinho macio para apertar e relaxar.','Brinquedos',22.90,'img/produto-36.png',16);`

  const ESTRUTURA_COMPRA = `
  CREATE TABLE IF NOT EXISTS compra (
     id int NOT NULL AUTO_INCREMENT,
     idCliente int NOT NULL,
     data date NOT NULL,
     forma_pagamento varchar(50) NOT NULL,
     valor_total decimal(10,2) NOT NULL,
     PRIMARY KEY (id),
     KEY idCliente (idCliente),
     CONSTRAINT compra_ibfk_1 FOREIGN KEY (idCliente) REFERENCES cliente (id)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

   const ESTRUTURA_PRODUTOCOMPRA = `
   CREATE TABLE IF NOT EXISTS produtocompra (
     idproduto int NOT NULL,
     idcompra int NOT NULL,
     quantidade int NOT NULL,
     valor_unitario decimal(10,2) NOT NULL,
     PRIMARY KEY (idproduto, idcompra),
     KEY idcompra (idcompra),
     CONSTRAINT produtocompra_ibfk_1 FOREIGN KEY (idproduto) REFERENCES produto (id),
     CONSTRAINT produtocompra_ibfk_2 FOREIGN KEY (idcompra) REFERENCES compra (id)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

  async function criar_tabelas() {
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insere dados apenas se a tabela estiver vazia (não apaga dados existentes)
        async function inserirSeVazio(tabela, dadosSql) {
            const [linhas] = await connection.query(`SELECT COUNT(*) AS total FROM ${tabela}`);
            if (linhas[0].total === 0) {
                console.log("Inserindo dados iniciais em '" + tabela + "'...");
                await connection.query(dadosSql);
            } else {
                console.log("Tabela '" + tabela + "' já possui dados. Pulando inserção.");
            }
        }

        console.log("Criando tabela 'cliente'...");
        await connection.query(ESTRUTURA_CLIENTE);
        await inserirSeVazio("cliente", DADOS_CLIENTE);

        console.log("Criando tabela 'produto'...");
        await connection.query(ESTRUTURA_PRODUTO);
        await inserirSeVazio("produto", DADOS_PRODUTO);

        console.log("Criando tabelas 'compra' e 'produtocompra'...");
        await connection.query(ESTRUTURA_COMPRA);
        await connection.query(ESTRUTURA_PRODUTOCOMPRA);

        await connection.commit();
        console.log("Migration executada com sucesso!");
        process.exit(0);
    } catch (error) {
        await connection.rollback();
        console.log(error)
        process.exit(1);
    } finally {
        connection.release();
    }
}
criar_tabelas()
