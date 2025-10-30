-- Base de données Simulio
-- MySQL Dump

CREATE DATABASE IF NOT EXISTS `simulio` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `simulio`;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `hashed_password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des simulations
CREATE TABLE IF NOT EXISTS `simulations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `client_id` INT DEFAULT NULL,

  -- Paramètres d'entrée
  `prix_bien` FLOAT NOT NULL,
  `travaux` FLOAT DEFAULT 0,
  `frais_agence` FLOAT DEFAULT 0,
  `duree_pret` INT NOT NULL,
  `apport` FLOAT DEFAULT 0,
  `frais_notaire` FLOAT NOT NULL,
  `taux_interet` FLOAT NOT NULL,
  `taux_assurance` FLOAT NOT NULL,
  `revalorisation_bien` FLOAT DEFAULT 0,
  `date_acquisition` VARCHAR(50) NOT NULL,

  -- Résultats
  `mensualite` FLOAT,
  `interets_totaux` FLOAT,
  `assurance_totale` FLOAT,
  `frais_notaire_calcule` FLOAT,
  `garantie_bancaire` FLOAT,
  `frais_agence_calcule` FLOAT,
  `total_financer` FLOAT,
  `salaire_minimum` FLOAT,

  -- Données détaillées (JSON)
  `amortissement_data` JSON,
  `financement_data` JSON,
  `credit_data` JSON,
  `revente_data` JSON,

  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_client_id` (`client_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Utilisateur de test (mot de passe: "password")
-- Hash bcrypt de "password": $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LQv3c1yqBWVHxkd0L
INSERT INTO `users` (`email`, `name`, `hashed_password`) VALUES
('test@simulio.com', 'Utilisateur Test', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LQv3c1yqBWVHxkd0L');

-- Clients de test
INSERT INTO `clients` (`user_id`, `name`, `email`, `phone`) VALUES
(1, 'Jean Dupont', 'jean.dupont@example.com', '0612345678'),
(1, 'Marie Martin', 'marie.martin@example.com', '0698765432');

-- Note: Pour créer un nouvel utilisateur, utilisez l'endpoint /api/auth/register
-- ou générez un hash bcrypt et insérez-le manuellement
