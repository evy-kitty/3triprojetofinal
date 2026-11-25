-- TABELA CLIENTE

CREATE TABLE cliente
(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(50) NOT NULL,
cpf CHAR(14) NOT NULL UNIQUE,
celular CHAR(14) NOT NULL,
email VARCHAR(50) NOT NULL UNIQUE,
senha VARCHAR(512) NOT NULL
);

DROP TABLE cliente;

INSERT INTO cliente (
nome, cpf, celular, email, senha
) VALUES

("Marina Pacher", "666.777.444-69", "(42)66666-4444", "marina@pacher.arte", "amogatoslisoslindos777"),
("Isadora", "111.222.333-44", "(41)98888-1111", "isadora.silva@email.com", "isadora123"),
("João", "222.333.444-55", "(42)97777-2222", "joao.santos@email.com", "joao456"),
("Mariana", "333.444.555-66", "(43)96666-3333", "mariana.oliveira@email.com", "mariana789"),
("Lucas", "444.555.666-77", "(44)95555-4444", "lucas.almeida@email.com", "lucas321"),
("Ana", "555.666.777-88", "(45)94444-5555", "ana.costa@email.com", "ana987"),
("Pedro", "777.888.999-00", "(46)93333-6666", "pedro.rocha@email.com", "pedro654"),
("Beatriz", "888.999.000-11", "(47)92222-7777", "beatriz.martins@email.com", "bia2026"),
("Gabriel", "999.000.111-22", "(48)91111-8888", "gabriel.lima@email.com", "gabriel111"),
("Larissa", "123.456.789-10", "(49)90000-9999", "larissa.souza@email.com", "larissa555"),
("Rafael", "987.654.321-00", "(40)98888-0000", "rafael.pereira@email.com", "rafael999");


SELECT email, senha FROM cliente;


SELECT email, senha FROM cliente WHERE email = "ana.silva@email.com";


SELECT * FROM cliente


SELECT * FROM cliente WHERE id <= 10 AND LENGTH(senha) > 20;


DELETE FROM cliente WHERE id = 11;


UPDATE cliente SET nome = "Marina Pacher", email = "marina@pacher.arte" WHERE id = 1;

-- TABELA ENDERECO

CREATE TABLE endereco
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    idCliente INT NOT NULL,
    numero INT NOT NULL,
    rua VARCHAR(100) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,

    FOREIGN KEY (idcliente) REFERENCES cliente(id)
);

-- TABELA PRODUTO

CREATE TABLE produto
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    caminho_img VARCHAR(255),
    quantidade_img INT NOT NULL
);

INSERT INTO produto
(nome, descricao, categoria, preco, caminho_img, quantidade_img)
VALUES
('Fone Gatinho', 'Fone de ouvido com orelhinhas de gato e som confortável.', 'Tecnologia', 129.90, 'img/produto-01.png', 3),
('Coelhinha de Pelúcia', 'Coelhinha fofinha com laço rosa para abraçar sempre.', 'Pelúcias', 89.90, 'img/produto-02.png', 5),
('Câmera Instantânea Rosa', 'Câmera instantânea retrô para registrar momentos divertidos.', 'Tecnologia', 349.90, 'img/produto-03.png', 2),
('Copo Boba Tea', 'Copo reutilizável com canudo para o seu bubble tea favorito.', 'Utilidades', 39.90, 'img/produto-04.png', 10),
('Almofada Estrela', 'Almofada macia em formato de estrela sorridente.', 'Decoração', 59.90, 'img/produto-05.png', 6),
('Mochila Lilás', 'Mochila colorida com chaveiro de pelúcia e vários bolsos.', 'Utilidades', 149.90, 'img/produto-06.png', 4),
('Teclado Colorido', 'Teclado mecânico com iluminação em degradê pastel.', 'Tecnologia', 199.90, 'img/produto-07.png', 4),
('Controle Sem Fio', 'Controle sem fio para jogar com os amigos.', 'Tecnologia', 179.90, 'img/produto-08.png', 5),
('Luminária Pote de Estrelas', 'Pote de vidro com estrelinhas iluminadas para decorar.', 'Decoração', 79.90, 'img/produto-09.png', 7),
('Jiboia no Vasinho', 'Plantinha fácil de cuidar no vaso minimalista.', 'Decoração', 49.90, 'img/produto-10.png', 8),
('Gatinho Dorminhoco', 'Gatinho preto de pelúcia descansando sobre livrinhos.', 'Pelúcias', 69.90, 'img/produto-11.png', 6),
('Lava Lamp Rosa', 'Luminária retrô com bolhas coloridas e brilho suave.', 'Decoração', 119.90, 'img/produto-12.png', 3),
('Toca-Discos Retrô', 'Toca-discos rosa com estojo portátil e som nostálgico.', 'Tecnologia', 399.90, 'img/produto-13.png', 2),
('Skate Kawaii', 'Skate estampado com personagens fofos e rodinhas coloridas.', 'Brinquedos', 159.90, 'img/produto-14.png', 5),
('Tênis Chunky Rosa', 'Tênis estiloso com solado alto e detalhes em rosa.', 'Utilidades', 249.90, 'img/produto-15.png', 4),
('Caneca Gatinho Mágico', 'Caneca lilás com gatinho, lua e estrelinhas.', 'Utilidades', 44.90, 'img/produto-16.png', 8),
('Óculos Coração', 'Óculos de sol com lentes em formato de coração.', 'Utilidades', 39.90, 'img/produto-17.png', 9),
('Sapo de Pelúcia', 'Sapo verde de pelúcia macio e sorridente.', 'Pelúcias', 64.90, 'img/produto-18.png', 6),
('Câmera Retrô Mini', 'Câmera compacta com visual retrô e alça rosa.', 'Tecnologia', 129.90, 'img/produto-19.png', 4),
('Kit Marcadores Pastel', 'Estojinho com marcadores coloridos e adesivo de coelho.', 'Papelaria', 34.90, 'img/produto-20.png', 12),
('Óculos Redondos Retrô', 'Óculos de armação fina com estilo vintage.', 'Utilidades', 59.90, 'img/produto-21.png', 5),
('Caderno Galáxia', 'Caderno com capa espacial, elástico e marcador.', 'Papelaria', 39.90, 'img/produto-22.png', 7),
('Luvas Patinha', 'Luvas pretas com almofadinhas rosa para o frio.', 'Utilidades', 29.90, 'img/produto-23.png', 10),
('Donut Squishy', 'Donut de borracha macia com cobertura rosa e confeitos.', 'Brinquedos', 24.90, 'img/produto-24.png', 15),
('Algodão-Doce', 'Algodão-doce cor-de-rosa para deixar o dia mais doce.', 'Utilidades', 12.90, 'img/produto-25.png', 20),
('Corgi de Pelúcia', 'Corgi deitadinho e macio para acompanhar você.', 'Pelúcias', 84.90, 'img/produto-26.png', 4),
('Globo de Neve Casinha', 'Globo de neve com casinha, pinheiros e brilho encantado.', 'Decoração', 89.90, 'img/produto-27.png', 3),
('Laço Rosa Grande', 'Laço de cetim rosa para cabelo, presente ou decoração.', 'Utilidades', 19.90, 'img/produto-28.png', 12),
('Suculenta Fofa', 'Suculenta no vasinho com carinha feliz.', 'Decoração', 34.90, 'img/produto-29.png', 9),
('Vela Bubbly', 'Vela aromática em formato de bolhas cremosas.', 'Decoração', 49.90, 'img/produto-30.png', 6),
('Guarda-Chuva Gatinho', 'Guarda-chuva rosa e preto com estampa de gatinho.', 'Utilidades', 69.90, 'img/produto-31.png', 5),
('Dados Gigantes', 'Par de dados brancos com pintinhas pretas.', 'Brinquedos', 27.90, 'img/produto-32.png', 14),
('Urso Xadrez', 'Urso de pelúcia com laço xadrez e abraço quentinho.', 'Pelúcias', 74.90, 'img/produto-33.png', 5),
('Despertador Retrô', 'Despertador rosa com sinos clássicos e ponteiros.', 'Utilidades', 54.90, 'img/produto-34.png', 6),
('Coração Pixel', 'Luminária em formato de coração pixelado rosa.', 'Decoração', 39.90, 'img/produto-35.png', 8),
('Gatinho Squishy', 'Gatinho amarelinho macio para apertar e relaxar.', 'Brinquedos', 22.90, 'img/produto-36.png', 16);

-- TABELA COMPRA

CREATE TABLE compra
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    idCliente INT NOT NULL,
    idEndereco INT NOT NULL,
    data DATE NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (idcliente) REFERENCES cliente(id),
    FOREIGN KEY (idendereco) REFERENCES endereco(id)
);

-- TABELA PRODUTO COMPRA

CREATE TABLE produtocompra
(
    idproduto INT NOT NULL,
    idcompra INT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (idproduto, idcompra),

    FOREIGN KEY (idproduto) REFERENCES produto(id),
    FOREIGN KEY (idcompra) REFERENCES compra(id)
);
