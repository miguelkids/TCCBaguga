CREATE DATABASE IF NOT EXISTS sportcourt;
USE sportcourt;

-- Tabela de Usuários (Donos e Jogadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(128) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nome_usuario VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo ENUM('dono', 'jogador') NOT NULL,
    cpf VARCHAR(20),
    genero VARCHAR(50),
    data_nascimento DATE,
    faturamento_total DECIMAL(10, 2) DEFAULT 0.00,
    foto_perfil_url VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Quadras
CREATE TABLE IF NOT EXISTS quadras (
    id VARCHAR(128) PRIMARY KEY,
    dono_id VARCHAR(128) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    foto_url TEXT,
    horario VARCHAR(255),
    esporte VARCHAR(100) DEFAULT 'Futebol',
    media_avaliacao DECIMAL(3, 2) DEFAULT 0.00,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dono_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id VARCHAR(128) PRIMARY KEY,
    quadra_id VARCHAR(128) NOT NULL,
    jogador_id VARCHAR(128),
    nome_jogador VARCHAR(255) NOT NULL,
    telefone_jogador VARCHAR(50) NOT NULL,
    data_reserva DATE NOT NULL,
    horario_reserva VARCHAR(50) NOT NULL,
    confirmada BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE,
    FOREIGN KEY (jogador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id VARCHAR(128) NOT NULL,
    usuario_id VARCHAR(128) NOT NULL,
    estrelas INT NOT NULL CHECK (estrelas >= 1 AND estrelas <= 5),
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Horários Ocupados / Bloqueados pelo Dono
CREATE TABLE IF NOT EXISTS horarios_ocupados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id VARCHAR(128) NOT NULL,
    data_ocupada DATE NOT NULL,
    horario_ocupado VARCHAR(50) NOT NULL,
    FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE
);

-- Tabela de Datas Inteiramente Ocupadas / Bloqueadas
CREATE TABLE IF NOT EXISTS datas_ocupadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id VARCHAR(128) NOT NULL,
    data_ocupada DATE NOT NULL,
    FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE
);
