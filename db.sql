CREATE DATABASE  IF NOT EXISTS `ihotestdatabase` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ihotestdatabase`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ihotestdatabase
-- ------------------------------------------------------
-- Server version	5.7.16-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`categoryID`),
  KEY `categoryID` (`categoryID`),
  KEY `categoryID_2` (`categoryID`),
  KEY `categoryID_3` (`categoryID`),
  KEY `categoryID_4` (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Uncategorized'),(2,'Uncategorized');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `eventID` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(150) NOT NULL,
  `description` varchar(1500) NOT NULL,
  `earliestDirectEvidence` int(11) NOT NULL,
  `earliestIndirectEvidence` int(11) NOT NULL,
  `boundaryStart` int(11) NOT NULL,
  `boundaryEnd` int(11) NOT NULL,
  `reference` varchar(500) DEFAULT NULL,
  `comments` varchar(1000) DEFAULT NULL,
  `category` int(11) NOT NULL,
  PRIMARY KEY (`eventID`),
  KEY `category` (`category`),
  CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `category` (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (2,'e1','text',1000000,100000000,123,1234,'reference','comments',1),(3,'e2','text',1000000,100000000,123,1234,'reference','comments',1),(4,'e3','text',1000000,100000000,123,1234,'reference','comments',1);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `mediaID` int(11) NOT NULL AUTO_INCREMENT,
  `mediaPath` varchar(150) NOT NULL,
  `mediaDescription` varchar(500) DEFAULT NULL,
  `type` char(1) NOT NULL,
  `eventID` int(11) NOT NULL,
  PRIMARY KEY (`mediaID`),
  KEY `eventID_idx` (`eventID`),
  CONSTRAINT `eventID` FOREIGN KEY (`eventID`) REFERENCES `event` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationships`
--

DROP TABLE IF EXISTS `relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relationships` (
  `relationshipID` int(11) NOT NULL AUTO_INCREMENT,
  `primaryEventID` int(11) NOT NULL,
  `secondaryEventID` int(11) NOT NULL,
  `precondition` char(1) NOT NULL,
  PRIMARY KEY (`relationshipID`),
  KEY `primaryEventID_idx` (`primaryEventID`),
  KEY `secondaryEventID_idx` (`secondaryEventID`),
  CONSTRAINT `primaryEventID` FOREIGN KEY (`primaryEventID`) REFERENCES `event` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `secondaryEventID` FOREIGN KEY (`secondaryEventID`) REFERENCES `event` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationships`
--

LOCK TABLES `relationships` WRITE;
/*!40000 ALTER TABLE `relationships` DISABLE KEYS */;
/*!40000 ALTER TABLE `relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `lastName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `userID` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (27,'Erich','Fisher','iho@asu.edu','$2a$10$xUdg1H3iV4wTC.2R4Vrv4.4kKBLcrfmX4l2Vk428nw3KPx6OlzN.u'),(28,'Travis','Dudzinski','tdudzins@asu.edu','$2a$10$CuQkIgb6kbbr4oe7ZV6q0uUjliOx/3OKG.JEnHiFiru5szd3.Gacq');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-14 15:46:33
