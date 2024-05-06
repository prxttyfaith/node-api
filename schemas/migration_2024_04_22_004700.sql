ALTER TABLE assigned_designation 
  RENAME COLUMN gross_pay TO salary;

ALTER TABLE assigned_designation 
  ADD COLUMN pagibig FLOAT DEFAULT NULL 
  AFTER salary;

ALTER TABLE assigned_designation 
  ADD COLUMN philhealth FLOAT DEFAULT NULL 
  AFTER pagibig;

ALTER TABLE assigned_designation 
  ADD COLUMN sss FLOAT DEFAULT NULL 
  AFTER philhealth;

ALTER TABLE assigned_designation 
  ADD COLUMN wh_tax FLOAT DEFAULT NULL 
  AFTER sss;

DROP TABLE employee_payrolls;

CREATE TABLE `employee_payrolls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `pay_period` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `pay_day` date DEFAULT NULL,
  `basic_pay` float DEFAULT NULL,
  `pagibig` float DEFAULT NULL,
  `philhealth` float DEFAULT NULL,
  `sss` float DEFAULT NULL,
  `wh_tax` float DEFAULT NULL,
  `total_earnings` float DEFAULT NULL,
  `total_deductions` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `employee_payrolls` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1434 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
