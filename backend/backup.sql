-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: centre_formation
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `formation_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `formation_id` (`formation_id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,13,4,'2026-04-27 11:27:37'),(2,14,4,'2026-04-27 11:27:47'),(3,15,5,'2026-04-27 11:27:57'),(4,16,5,'2026-04-27 11:28:02'),(5,13,2,'2026-04-27 12:05:33'),(6,14,3,'2026-04-27 12:05:47'),(7,18,8,'2026-04-27 12:27:49'),(8,18,4,'2026-04-27 12:28:49'),(9,17,7,'2026-04-27 12:37:03'),(10,17,6,'2026-04-27 12:37:13');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formations`
--

DROP TABLE IF EXISTS `formations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `capacity` int DEFAULT '20',
  `trainer_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `formations_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formations`
--

LOCK TABLES `formations` WRITE;
/*!40000 ALTER TABLE `formations` DISABLE KEYS */;
INSERT INTO `formations` VALUES (2,'Développement Web Full Stack','6','HTML, CSS, JavaScript, React, Node.js','2026-04-25 15:31:15',20,6),(3,'Backend Node.js & API REST','3','Node.js, Express, MySQL, JWT','2026-04-25 15:31:15',20,6),(4,'Design UI/UX Professionnel','2','Figma, design centré utilisateur','2026-04-25 15:31:15',20,7),(5,'Marketing Digital','3','SEO, réseaux sociaux, publicité en ligne','2026-04-25 15:31:15',20,7),(6,'Bureautique Excel & Word','1','Excel avancé, Word professionnel','2026-04-25 15:31:15',20,8),(7,'Comptabilité & Gestion','4','Comptabilité générale, fiscalité','2026-04-25 15:31:15',20,9),(8,'Python','3','Maîtrisez le python en seulement 3 mois','2026-04-27 09:17:38',20,10);
/*!40000 ALTER TABLE `formations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','formateur','etudiant') DEFAULT 'etudiant',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Admin Principal','admin@test.com','$2b$10$onDkSZgjnJEBWxPmEeVPI.BF/9bMpxbl99.hV6V0r.vkgkaE5C0wm','admin','2026-04-23 10:14:02',NULL),(6,'Formateur un','formateur1@test.com','$2a$10$s2FleHzmVF2a5bn7I4kK2OPFC5Cg2n8sCTSRxNhCW.BPn1.aJDBfS','formateur','2026-04-24 15:51:04',NULL),(7,'Formateur deux','formateur2@test.com','$2a$10$E73JgZ7p9x.hi.mE40T8me6ARgz7E03jhOI1mP2H7f9uqXzeTYiiu','formateur','2026-04-24 15:51:31',NULL),(8,'Formateur trois','formateur3@test.com','$2a$10$MxQ44OGVMLw2BK8I9wKssegpQHE5232kdqXYi3ykG3c8npEdLJVRW','formateur','2026-04-24 15:51:46',NULL),(9,'Formateur quatre','formateur4@test.com','$2a$10$gWvEF7HY1e8qqQvZj.sci.8LMZ2/zuM4xFZ4gn1NqDUNMpz4bghtG','formateur','2026-04-24 15:52:03',NULL),(10,'Formateur cinq','formateur5@test.com','$2a$10$7fJusxMv8emsLcmKNT/vFeokKoA6XG9cFHPZBmV/qKr8rzhqT48rq','formateur','2026-04-24 15:52:18',NULL),(13,'Liva','liva@test.com','$2a$10$H4y9FQmgPj1j5CrqD2euduMjD//UdGEVoY0w5C0.dNjF5NleJ/X1C','etudiant','2026-04-27 08:38:57','+320000002'),(14,'Stevino','stevino@test.com','$2a$10$dja9aC1MOwRBCBWQsA9zyupbvS3vb8pjgXX7gMwnvcfcS2mgLWifG','etudiant','2026-04-27 09:06:32','+320000001'),(15,'Rodolphe','rodolphe@test.com','$2a$10$F0m785DnbgyqN3jMp1D0BuxS3KeMMfjSWmUq9PiPwznsvLJQL0VVW','etudiant','2026-04-27 09:06:50','+320000003'),(16,'Kevin','kevin@test.com','$2a$10$DPUDRKPys.QbKKCa2ga9gu0xtXbZ6E.X/ADzrVa.xiUUYTsuISEQi','etudiant','2026-04-27 09:07:09','+320000004'),(17,'Chriso','chriso@test.com','$2a$10$OcNo8XESbFirFmq730t29OO4Hddt0xmOLGBzZAjUujItWN9F5jaxi','etudiant','2026-04-27 09:07:23','+320000005'),(18,'Orlandon','orlandon@test.com','$2a$10$SCmyoPrV09Q2gtQnowr./uMU3tNEUwETKKqaeghznUU30RFR7B8hO','etudiant','2026-04-27 09:09:39','+320000006');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28  6:21:35
