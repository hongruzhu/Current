-- MySQL dump 10.13  Distrib 8.0.32, for macos13 (arm64)
--
-- Host: localhost    Database: current
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `conf_polls`
--

DROP TABLE IF EXISTS `conf_polls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conf_polls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conferences_id` int NOT NULL,
  `order` int NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `options` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_conf_polls_conferences1_idx` (`conferences_id`),
  CONSTRAINT `fk_conf_polls_conferences1` FOREIGN KEY (`conferences_id`) REFERENCES `conferences` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conf_polls`
--

LOCK TABLES `conf_polls` WRITE;
/*!40000 ALTER TABLE `conf_polls` DISABLE KEYS */;
/*!40000 ALTER TABLE `conf_polls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conf_whiteboard`
--

DROP TABLE IF EXISTS `conf_whiteboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conf_whiteboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conferences_id` int NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_conf_whiteboard_conferences1_idx` (`conferences_id`),
  CONSTRAINT `fk_conf_whiteboard_conferences1` FOREIGN KEY (`conferences_id`) REFERENCES `conferences` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conf_whiteboard`
--

LOCK TABLES `conf_whiteboard` WRITE;
/*!40000 ALTER TABLE `conf_whiteboard` DISABLE KEYS */;
/*!40000 ALTER TABLE `conf_whiteboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conferences`
--

DROP TABLE IF EXISTS `conferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `start` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conferences`
--

LOCK TABLES `conferences` WRITE;
/*!40000 ALTER TABLE `conferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `conferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `member` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poll_details`
--

DROP TABLE IF EXISTS `poll_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poll_details` (
  `conf_polls_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `voter_name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `option` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  KEY `fk_poll_details_conf_polls1_idx` (`conf_polls_id`),
  CONSTRAINT `fk_poll_details_conf_polls1` FOREIGN KEY (`conf_polls_id`) REFERENCES `conf_polls` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poll_details`
--

LOCK TABLES `poll_details` WRITE;
/*!40000 ALTER TABLE `poll_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `poll_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_backgrounds`
--

DROP TABLE IF EXISTS `user_backgrounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_backgrounds` (
  `int` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`int`),
  KEY `fk_user_backgrounds_users1_idx` (`users_id`),
  CONSTRAINT `fk_user_backgrounds_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_backgrounds`
--

LOCK TABLES `user_backgrounds` WRITE;
/*!40000 ALTER TABLE `user_backgrounds` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_backgrounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `groups_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_groups_users1_idx` (`users_id`),
  KEY `fk_user_groups_groups1_idx` (`groups_id`),
  CONSTRAINT `fk_user_groups_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `fk_user_groups_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_transcripts`
--

DROP TABLE IF EXISTS `user_transcripts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_transcripts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `conf_id` int NOT NULL,
  `strat_timestamp` varchar(20) DEFAULT NULL,
  `end_timestamp` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_transcripts_users1_idx` (`users_id`),
  CONSTRAINT `fk_user_transcripts_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_transcripts`
--

LOCK TABLES `user_transcripts` WRITE;
/*!40000 ALTER TABLE `user_transcripts` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_transcripts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_videos`
--

DROP TABLE IF EXISTS `user_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `conf_id` int NOT NULL,
  `start_timestamp` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_videos_users1_idx` (`users_id`),
  CONSTRAINT `fk_user_videos_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_videos`
--

LOCK TABLES `user_videos` WRITE;
/*!40000 ALTER TABLE `user_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_whiteboards`
--

DROP TABLE IF EXISTS `user_whiteboards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_whiteboards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `conf_id` int NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_whiteboards_users1_idx` (`users_id`),
  CONSTRAINT `fk_user_whiteboards_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_whiteboards`
--

LOCK TABLES `user_whiteboards` WRITE;
/*!40000 ALTER TABLE `user_whiteboards` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_whiteboards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` varchar(20) NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'native','admin_test','admin@test.com ','$2b$10$D1WIoyhPZJBmX/037/5.EOcJ/cRvOYdfTRAwfXg0Q0EvPEvbN9JGO',NULL),(2,'native','鴻儒','hongru07@gmail.com ','$2b$10$Nuv.amzs4eFYdt2WTMTxiOIHAIR5wu2ypyZvKTa0d4YrM8cgu9.3C',NULL),(3,'native','admin','admin@gmail.com ','$2b$10$UjshT0uv0EoBb.xrKURBJuqiV8V2pe1NYoQOb0M81IjWngWyR1tP.',NULL),(4,'native','谷哥','google@gmail.com','$2b$10$ClZG2w8ceglMMjsUtqjTIeFhDIAOgeFzT4OIK6V0wLD5pCtY1sLc2',NULL),(5,'native','orin','orin29377053@gmail.com','$2b$10$Qes54SwzcCp9S7YTCS8gMu9qWtfxT.313G9u7t0waCeUkkVKyyA6G',NULL),(6,'native','蔡見昇','see89826@gmail.com','$2b$10$InyG5gJMWVfNnN.O7WiZb.PhZ4yyza73Z5VpRS14gfvocv4kIES.y',NULL),(7,'native','Alison','admin123@gmail.com','$2b$10$ZMX7R0YNJOHzJqKx3kXsp.gxPxCu.nUV0t2b7qCBBqxNc5q5q5GZG',NULL),(8,'native','ashley','ashley@school.appworks.tw','$2b$10$JjRa9YZosc8NnWLuSnlc9OTVpYEup8yktYbO3kHTDMA031maIsvXK',NULL),(9,'native','周憶敏','mindy8987@gmail.com','$2b$10$Cl5rguMDEjQ9J158qFVEKeS9ejNEhlJa6atF.q9OwTSvBU872L5cK',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_conferences`
--

DROP TABLE IF EXISTS `users_conferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_conferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `conferences_id` int NOT NULL,
  `role` varchar(10) DEFAULT NULL,
  `name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_conferences_conferences1_idx` (`conferences_id`),
  KEY `fk_users_conferences_users1_idx` (`users_id`),
  CONSTRAINT `fk_users_conferences_conferences1` FOREIGN KEY (`conferences_id`) REFERENCES `conferences` (`id`),
  CONSTRAINT `fk_users_conferences_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_conferences`
--

LOCK TABLES `users_conferences` WRITE;
/*!40000 ALTER TABLE `users_conferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_conferences` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-07  4:35:08
