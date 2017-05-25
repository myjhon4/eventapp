-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2017 at 04:06 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 7.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demo`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `demo_getall` ()  BEGIN
    SELECT user_id, name, active FROM users;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `startdate` varchar(48) NOT NULL,
  `enddate` varchar(48) NOT NULL,
  `allDay` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=Active, 0=Block'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `created`, `modified`, `status`) VALUES
(1, 'Internet of Things World Forum', '2015-11-12', '2015-11-09 06:15:17', '2015-11-09 06:15:17', 1),
(2, 'The Future of Money and Technology Summit', '2015-11-26', '2015-11-09 06:15:17', '2015-11-09 06:15:17', 1),
(3, 'Chrome Dev Summit', '2015-11-26', '2015-11-09 06:15:17', '2015-11-09 06:15:17', 1),
(4, 'The Lean Startup Conference', '2015-11-17', '2015-11-09 06:15:17', '2015-11-09 06:15:17', 1),
(5, 'Web Submit for Developers', '2015-11-17', '2015-11-09 06:15:17', '2015-11-09 06:15:17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `img_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `img_order` int(5) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `status` enum('1','0') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `img_name`, `img_order`, `created`, `modified`, `status`) VALUES
(1, 'img1.jpg', 6, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(2, 'img2.jpg', 2, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(3, 'img3.jpg', 3, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(4, 'img4.jpg', 8, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(5, 'img5.jpg', 1, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(6, 'img6.jpg', 7, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(7, 'img7.jpg', 5, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1'),
(8, 'img8.jpg', 4, '2015-04-14 00:00:00', '2015-04-14 00:00:00', '1');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `descount` int(11) NOT NULL COMMENT 'in %',
  `image_url` varchar(100) NOT NULL,
  `status` int(11) NOT NULL COMMENT 'active=1,deavtive=0',
  `user_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `name`, `description`, `price`, `descount`, `image_url`, `status`, `user_id`) VALUES
(2, 'Samsung Galaxy J5 Prime (16GB)', 'RAM:2 GB Screen Size (in cm):12.7 cm (5)	Rear Camera:13 MP Front Camera:5 MP	Internal Memory:16GB	Ba', 14200, 0, 'SDL026310312_1-21ea2.jpg', 1, 2),
(10, 'Asus ZenPad 7.0 16 GB 7 Inch with Wi-Fi+3G  (Metallic)', '2 GB RAM | 16 GB ROM 8 MP Primary Camera | 2 MP Front Android 5.0 (Lollipop) Battery: 3450 mAh, Lith', 7999, 0, 'asus-z370cg-1l033a-original-imaefsmw2ecyyhhz.jpeg', 1, 2),
(12, 'Regentseating Fabric Office Chair  (Black)', 'Frame Material: Fabric Upholstered W x H: 609 mm x 940 mm Delivery Condition: Knock Down', 3299, 0, 'plywood-802meshblack-regentseating-original-imaeq3wauzthyjzb.jpeg', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(110) NOT NULL,
  `active` int(11) NOT NULL,
  `image_url` varchar(100) NOT NULL,
  `user_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `active`, `image_url`, `user_by`) VALUES
(1, 'demo', 'demo@gmail.com', '$2a$10$FTNHZna.ZwqGIYGSHFCNteLgZYlI1Zr18KTgN4gnFy6LVwDhRlBoG', 1, '', 0),
(2, 'demoraj demo', 'demoraj@gmail.com', '$2a$10$8PsFKMUVeLgf/bLKJl3PdudGxc7IpOVG7of/HwiHo6U8Z6LywWytq', 0, '7148article-1354845-0D14F72E000005DC-875_306x423.jpg', 2),
(5, 'rohit', 'rohit@gmail.com', '$2a$10$WbtdGcrBsKuYcXdaPsF5pOhqCTya52b/R0BXbQ2bt8NfCQ/GU74pK', 1, '', 0),
(6, 'demo963', 'demo963@gmail.com', '$2a$10$17OluGACPcd04eE2oTRPc.16gMEqI8IbdT730Uo/9QLHxzkM/CP1S', 1, '', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
