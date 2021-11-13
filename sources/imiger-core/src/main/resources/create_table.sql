use visualization_tool;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Struktura tabulky `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nick` varchar(50) COLLATE utf8_czech_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_czech_ci NOT NULL DEFAULT '',
  `psw` varchar(60) COLLATE utf8_czech_ci NOT NULL,
  `session` varchar(50) COLLATE utf8_czech_ci NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created` datetime NOT NULL,
  `email` varchar(50) COLLATE utf8_czech_ci NOT NULL,
   CONSTRAINT PK_user PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Struktura tabulky `diagram`
--

CREATE TABLE IF NOT EXISTS `diagram` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `created` datetime NOT NULL,
  `last_update` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `graph_json` longtext COLLATE utf8_czech_ci NOT NULL DEFAULT '',
  CONSTRAINT PK_diagram PRIMARY KEY (`id`),
  CONSTRAINT  FK_user_diagram FOREIGN KEY (`user_id`) REFERENCES user(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

