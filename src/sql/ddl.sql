CREATE DATABASE IF NOT EXISTS sistema_ponto;
USE sistema_ponto;

CREATE TABLE IF NOT EXISTS Pessoa (
    id_pessoa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(60) NOT NULL,
    telefone VARCHAR(15),
    data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS Administrador (
    id_administrador INT PRIMARY KEY AUTO_INCREMENT,
    id_pessoa INT NOT NULL,
    nivel_acesso INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa)
);

CREATE TABLE IF NOT EXISTS Departamento (
    id_departamento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Setor (
    id_setor INT PRIMARY KEY AUTO_INCREMENT,
    id_departamento INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_departamento) REFERENCES Departamento(id_departamento)
);

CREATE TABLE IF NOT EXISTS Funcionario (
    id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    id_pessoa INT NOT NULL,
    id_administrador INT NOT NULL,
    id_departamento INT NOT NULL,
    id_setor INT NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    data_admissao DATE NOT NULL,
    tipo_contrato VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa),
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador),
    FOREIGN KEY (id_departamento) REFERENCES Departamento(id_departamento),
    FOREIGN KEY (id_setor) REFERENCES Setor(id_setor)
);

CREATE TABLE IF NOT EXISTS RegistroPonto (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT NOT NULL,
    data DATE NOT NULL,
    hora_registro TIME NOT NULL,
    tipo_ponto ENUM('entrada', 'saida') NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario)
);

CREATE TABLE IF NOT EXISTS BancoHoras (
    id_banco INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT NOT NULL,
    horas_credito DECIMAL(5,2) NOT NULL DEFAULT 0,
    horas_debito DECIMAL(5,2) NOT NULL DEFAULT 0,
    saldo DECIMAL(5,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario)
);

CREATE TABLE IF NOT EXISTS RelatorioJornada (
    id_relatorio INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    total_horas DECIMAL(5,2) NOT NULL,
    total_atrasos DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario)
);

CREATE TABLE IF NOT EXISTS Ocorrencia (
    id_ocorrencia INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT NOT NULL,
    id_administrador INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_ocorrencia DATE NOT NULL,
    descricao_ocorrencia TEXT NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario),
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS JustificativaFalta (
    id_justificativa INT PRIMARY KEY AUTO_INCREMENT,
    id_ocorrencia INT NOT NULL,
    descricao_justificativa TEXT NOT NULL,
    documento_comprovante VARCHAR(255) NOT NULL COMMENT 'Caminho do arquivo de documento, para nao pesar banco.',
    FOREIGN KEY (id_ocorrencia) REFERENCES Ocorrencia(id_ocorrencia)
);

CREATE TABLE IF NOT EXISTS SolicitacaoHoraExtra (
    id_solicitacao INT PRIMARY KEY AUTO_INCREMENT,
    id_funcionario INT NOT NULL,
    id_administrador INT NOT NULL,
    horas_trabalhadas DECIMAL(5,2) NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
    data DATE NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario),
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS AjustePonto (
    id_ajuste INT PRIMARY KEY AUTO_INCREMENT,
    id_registro INT NOT NULL,
    id_administrador INT NOT NULL,
    motivo TEXT NOT NULL,
    hora_corrigida TIME NOT NULL,
    data_ajuste DATE NOT NULL,
    FOREIGN KEY (id_registro) REFERENCES RegistroPonto(id_registro),
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS FormatoExportacao (
    id_formato INT PRIMARY KEY AUTO_INCREMENT,
    id_administrador INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_ultima_modificacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS Turno (
    id_turno INT PRIMARY KEY AUTO_INCREMENT,
    id_administrador INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS EscalaTrabalho (
    id_escala INT PRIMARY KEY AUTO_INCREMENT,
    id_turno INT NOT NULL,
    id_administrador INT NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    dias_semana VARCHAR(50) NOT NULL,
    carga_horaria_semanal DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno),
    FOREIGN KEY (id_administrador) REFERENCES Administrador(id_administrador)
);

CREATE TABLE IF NOT EXISTS Calendario (
    data_completa DATE PRIMARY KEY COMMENT 'A data do calendário',
    ano SMALLINT NOT NULL COMMENT 'O ano da data',
    mes TINYINT NOT NULL COMMENT 'O mês da data (1-12)',
    dia TINYINT NOT NULL COMMENT 'O dia do mês da data (1-31)',
    dia_da_semana TINYINT NOT NULL COMMENT 'O dia da semana (1=Domingo, 7=Sábado)',
    is_fim_de_semana TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Flag: 1 se for fim de semana, 0 caso contrário',
    is_feriado TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Flag: 1 se for feriado, 0 caso contrário'
);