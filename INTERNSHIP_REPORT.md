# KINGSTON ENGINEERING COLLEGE
### Approved by AICTE, New Delhi | Affiliated to Anna University, Chennai
### Accredited with 'A' Grade by NAAC
### Chittoor Main Road, Christianpet, Vellore – 632 059

---

# DEPARTMENT OF INFORMATION TECHNOLOGY

## IT3711 – SUMMER INTERNSHIP REPORT

### Submitted by:
**Name:** Abinaya R  
**Register No:** 511323205001  
**Semester:** VII  
**Department:** INFORMATION TECHNOLOGY  

---

<div style="page-break-after: always;"></div>

# Web-Based Expense Tracker and Financial Analytics Platform with Real-Time Currency Intelligence (SpendWise)

### Developed during the Summer Internship Programme 2026

## INTERNSHIP REPORT

Submitted by  
**ABINAYA R**  
**(511323205001)**  

in partial fulfilment for the award of the degree  
of  
**BACHELOR OF TECHNOLOGY**  
in  
**INFORMATION TECHNOLOGY**  

### KINGSTON ENGINEERING COLLEGE, VELLORE
### ANNA UNIVERSITY : CHENNAI 600 025
### [2026 - 2027]

---

<div style="page-break-after: always;"></div>

# DEPARTMENT OF INFORMATION TECHNOLOGY

## BONAFIDE CERTIFICATE

Certified that this Internship report **“Web-Based Expense Tracker and Financial Analytics Platform with Real-Time Currency Intelligence (SpendWise)”** is the bonafide work of **“ABINAYA R (511323205001)”** who carried out the internship work under my supervision during the academic year 2026-2027.

<br><br><br><br>

**Signature of Head of the Department** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Signature of the Staff In-charge**

---

<div style="page-break-after: always;"></div>

# ACKNOWLEDGEMENT

My sincere thanks and profound sense of gratitude go to our respected Chairman **Thiru. D.M. Kathir Anand, MBA (USA)** for all his relentless efforts in educating me in a premier institution.

I would like to express my sincere gratitude to our respected Principal **Dr. U.V. ARIVAZHAGU, M.E., Ph.D.**, for her invaluable guidance, support, and constant encouragement throughout my academic journey.

I extend my heartfelt thanks to the Head of the Department, **Mrs. M. Menaka, M.Tech., (Ph.D.)**, Department of Information Technology, for her guidance, advice, and motivation all through the internship period.

I convey my sincere and in-depth gratitude to our internal guide **Dr. M. Vasumathy, MS(SE)., Ph.D.**, Associate Professor, for her valuable guidance, constructive critiques, and continuous support throughout the duration of this internship project.

I would also like to thank all faculty members of the Department of Information Technology, friends, and fellow batchmates for their cooperation and assistance during the course of this internship.

I am deeply indebted to my parents and family members whose unwavering moral support, sacrifices, and encouragement enabled me to complete this internship successfully. Above all, I thank the Almighty God for giving me good health, wisdom, and strength to carry out this project without difficulties and to achieve this milestone.

<br>
**Abinaya R**  
**(Reg. No: 511323205001)**

---

<div style="page-break-after: always;"></div>

# ABSTRACT

This report presents the technical design, development, and implementation work carried out during the eight-week Summer Internship, which commenced on 29 June 2026. The objective of the internship was to engineer a robust, production-grade **Web-Based Expense Tracker and Financial Analytics Platform**, designated **SpendWise**. The platform addresses the critical challenge of personal financial management by providing an intuitive, transparent, and data-driven web portal that enables individuals to log monetary expenditures, categorize financial streams, monitor multi-month budgets, inspect interactive analytical charts, and dynamically convert financial values across global currencies.

The system is engineered as an end-to-end full-stack application. The backend is developed using **Node.js and Express.js (v4.21)** resting upon an embedded **SQLite3** relational database. The backend employs a modular MVC controller-service architecture, structured parameter validation, robust SQL aggregations, and RESTful routing exposing endpoints for transaction lifecycle management, financial summary computations, monthly trend aggregations, category breakdowns, and category budget enforcement. To deliver reliable multi-currency calculations without third-party rate limits, the backend integrates with an external open exchange rate API with a 1-hour in-memory cache and automatic fallback datasets.

The frontend is built using **React 18** bundled with **Vite**, written in modern modular JavaScript and styled using **Tailwind CSS**. Data visualization is powered by **Recharts**, delivering responsive, interactive monthly income vs. expense comparison charts (switchable between Bar and Area modes) and category expense distribution Donut charts with custom tooltips. Key functional components include responsive KPI summary cards (Net Balance, Total Income, Total Expenses, and Savings Rate), a category-wise monthly budget tracker with automated color-coded alert badges (Safe, Warning, Exceeded), a live currency converter calculator widget, a multi-parameter transaction filtering engine, instant CSV export capabilities, and a 1-click realistic demo data seeder.

This report comprehensively details the system architecture, weekly milestones from Week 1 to Week 8, database schemas, module-wise functional descriptions, technical challenges and adopted solutions, and key professional learning outcomes acquired throughout the development process.

---

<div style="page-break-after: always;"></div>

# TABLE OF CONTENTS

| S.NO | CONTENT | PG NO |
|---|---|:---:|
| **1** | **INTRODUCTION** | **1** |
| | 1.1 Background of the Internship | 1 |
| | 1.2 Objectives of the Project | 1 |
| | 1.3 Problem Statement & Domain Context | 2 |
| | 1.4 Scope of the Work | 2 |
| | 1.5 Organisation of the Report | 2 |
| **2** | **PROJECT OVERVIEW AND SYSTEM ARCHITECTURE** | **3** |
| | 2.1 Project Overview | 3 |
| | 2.2 System Architecture | 3 |
| | 2.3 Technology Stack | 4 |
| | 2.4 Database Design and Relational Schema | 4 |
| | 2.5 Security and Data Integrity Design | 5 |
| **3** | **WEEK 1 – REQUIREMENT ANALYSIS AND ENVIRONMENT SETUP** | **6** |
| | 3.1 Domain Study and Workflow Identification | 6 |
| | 3.2 Technology Selection and Rationale | 6 |
| | 3.3 Development Environment Setup | 7 |
| | 3.4 Initial Architecture Blueprint | 7 |
| | 3.5 Outcome of Week 1 | 7 |
| **4** | **WEEK 2 – DATABASE MODELLING AND REST API FOUNDATION** | **8** |
| | 4.1 SQLite Relational Schema Implementation | 8 |
| | 4.2 Promise-Based Database Layer | 8 |
| | 4.3 RESTful Controller-Service Architecture | 8 |
| | 4.4 Transaction CRUD Endpoints | 9 |
| | 4.5 Outcome of Week 2 | 9 |
| **5** | **WEEK 3 – TRANSACTION MANAGEMENT ENGINE AND CSV EXPORT** | **10** |
| | 5.1 Advanced Query Filtering and SQL Parameterization | 10 |
| | 5.2 Real-Time Keyword Search Implementation | 10 |
| | 5.3 Input Validation and Error Sanitization | 11 |
| | 5.4 CSV Data Export Endpoint Generation | 11 |
| | 5.5 Outcome of Week 3 | 11 |
| **6** | **WEEK 4 – FINANCIAL ANALYTICS AND BUDGETING LOGIC** | **12** |
| | 6.1 Summary Metrics Aggregation Algorithms | 12 |
| | 6.2 Multi-Month Cash Flow Trend Calculations | 12 |
| | 6.3 Category Breakdown Aggregations | 13 |
| | 6.4 Monthly Category Budgeting and Threshold Alerts | 13 |
| | 6.5 Mid-Term Review Milestone | 14 |
| **7** | **WEEK 5 – REACT FRONTEND ARCHITECTURE AND KPI METRICS** | **15** |
| | 7.1 Single Page Application Scaffolding with Vite | 15 |
| | 7.2 Tailwind CSS Configuration and Design System | 15 |
| | 7.3 Centralized Axios API Service Layer | 16 |
| | 7.4 Dynamic KPI Summary Cards Component | 16 |
| | 7.5 Outcome of Week 5 | 16 |
| **8** | **WEEK 6 – DATA VISUALIZATION AND BUDGET TRACKER UI** | **17** |
| | 8.1 Recharts Integration for Financial Trends | 17 |
| | 8.2 Interactive Donut Chart for Category Distribution | 17 |
| | 8.3 Category Budget Progress Tracker Component | 18 |
| | 8.4 Add/Edit Transaction Modal Dialog | 18 |
| | 8.5 Outcome of Week 6 | 19 |
| **9** | **WEEK 7 – CURRENCY EXCHANGE API AND GLOBAL CONVERTER** | **20** |
| | 9.1 Third-Party Exchange Rate API Integration | 20 |
| | 9.2 In-Memory Caching Strategy and Offline Fallback | 20 |
| | 9.3 Global React Currency Context Provider | 21 |
| | 9.4 Interactive Currency Converter Widget | 21 |
| | 9.5 Outcome of Week 7 | 22 |
| **10** | **WEEK 8 – INTEGRATION, SEEDING, TESTING AND REVIEW** | **23** |
| | 10.1 Automated Realistic Demo Data Seeder | 23 |
| | 10.2 Full-Stack System Integration | 23 |
| | 10.3 Comprehensive End-to-End Testing | 24 |
| | 10.4 Production Build Optimization | 24 |
| | 10.5 Final Review and Documentation | 24 |
| **11** | **MODULE-WISE FUNCTIONAL DESCRIPTION** | **25** |
| | 11.1 Transaction Lifecycle Management Module | 25 |
| | 11.2 Financial Visual Analytics Module | 26 |
| | 11.3 Budgeting and Alert Notification Module | 27 |
| | 11.4 Global Currency Conversion Intelligence Module | 28 |
| | 11.5 Data Export and Seeder Utilities Module | 29 |
| **12** | **CHALLENGES FACED AND SOLUTIONS ADOPTED** | **30** |
| | 12.1 Cross-Origin Requests and Dev Proxying | 30 |
| | 12.2 External Currency API Latency and Rate Limiting | 30 |
| | 12.3 Complex Multi-Currency Metric Conversions | 30 |
| | 12.4 Responsive Data Visualization Rendering | 31 |
| **13** | **LEARNING OUTCOMES AND SKILLS ACQUIRED** | **32** |
| | 13.1 Technical Proficiencies | 32 |
| | 13.2 Software Engineering Practices | 32 |
| | 13.3 Problem Solving and Analytical Thinking | 33 |
| **14** | **CONCLUSION AND FUTURE SCOPE** | **34** |
| | 14.1 Conclusion | 34 |
| | 14.2 Future Scope | 34 |

---

<div style="page-break-after: always;"></div>

# LIST OF TABLES AND FIGURES

### List of Tables
- **Table 2.1:** Technology Stack Breakdown
- **Table 2.2:** Database Entity Schema Definitions
- **Table 2.3:** REST API Specification
- **Table 11.1:** Core System Modules and Functional Capabilities
- **Table 13.1:** Technical Skills Acquired

### List of Figures
- **Figure 2.1:** High-Level Layered Architecture of SpendWise
- **Figure 2.2:** Relational Database Schema Model (ER Diagram)
- **Figure 7.1:** Executive KPI Summary Cards Component
- **Figure 8.1:** Recharts Monthly Cash Flow Trend Visualization (Bar vs Area)
- **Figure 8.2:** Recharts Interactive Category Distribution Donut Chart
- **Figure 8.3:** Category Budget Progress Indicators with Threshold Alerts
- **Figure 9.1:** Real-Time Currency Converter Calculator Widget
- **Figure 11.1:** Filterable and Searchable Transaction Management Table
- **Figure 11.2:** Transaction Creation and Editing Modal Dialog

---

<div style="page-break-after: always;"></div>

# 1. INTRODUCTION

## 1.1 Background of the Internship
In modern technical education, hands-on industrial and project-based experience is essential to bridge academic theory with real-world software engineering practices. As part of the **Bachelor of Technology in Information Technology** curriculum under Anna University at Kingston Engineering College, the course **IT3711 – Summer Internship** serves as an intensive practical training ground. The internship took place over an eight-week duration during the academic period 2026–2027.

The internship assignment focused on conceptualizing, architecting, developing, testing, and deploying a complete, production-grade web application: **SpendWise**, a full-stack personal finance and expense analytics platform. The project provided thorough exposure to the end-to-end software development lifecycle (SDLC), including requirements gathering, relational database normalization, server-side REST API development, asynchronous client-side state management, interactive data visualization, and third-party API integration.

## 1.2 Objectives of the Project
The primary objectives established for the SpendWise platform comprise:
1. **Accurate Transaction Logging:** Enable users to seamlessly record and manage financial transactions with comprehensive metadata, including transaction amount, type (Income or Expense), category, date, payment method, and descriptive notes.
2. **Visual Financial Analytics:** Provide graphical intelligence on cash flows through multi-month trends and category spending distributions using interactive charting libraries.
3. **Proactive Budget Monitoring:** Implement category-specific monthly budget caps accompanied by visual indicators and automated threshold alerts (Safe, Warning, Exceeded) to prevent financial overspending.
4. **Real-Time Currency Conversion:** Integrate external live exchange rate services with an in-memory caching mechanism to enable seamless on-the-fly dashboard currency recalculation.
5. **Data Portability:** Enable instant export of historical transactions into industry-standard CSV format for spreadsheet auditing and personal record keeping.
6. **Zero-Configuration Relational Persistence:** Utilize an embedded, high-performance SQLite relational database to ensure self-contained portability without requiring manual database server configuration.

## 1.3 Problem Statement & Domain Context
Personal financial stability requires transparent visibility into daily spending patterns. Traditional expense tracking approaches—such as physical paper diaries, static spreadsheet templates, or complex commercial banking software—suffer from several significant limitations:
- **High Friction:** Manual entry in spreadsheets is cumbersome and prone to formula corruption.
- **Lack of Real-Time Intelligence:** Spreadsheets do not dynamically alert users when a specific expense category nears or breaches its monthly budget limit.
- **Absence of Currency Versatility:** In an increasingly globalized world involving international travel, freelance income, and foreign subscriptions, users frequently transact in multiple currencies but lack instant rate conversions tied directly to their ledger.
- **Data Clutter:** Disconnected receipts fail to provide high-level visual summaries such as net savings rates and month-over-month cash flow trajectories.

SpendWise eliminates these issues by integrating logging, automated SQL analytics, interactive visualizations, and live currency rates into a unified single-page web application.

## 1.4 Scope of the Work
The project scope encompassed:
- Designing normalized relational schemas for transactions, budgets, and categories.
- Building a modular Node.js/Express.js backend with structured REST API endpoints.
- Developing SQL aggregation queries for financial metrics, monthly cash flows, and category distributions.
- Developing a modern, responsive React 18 single-page application using Tailwind CSS.
- Implementing Recharts data visualizations (Bar, Area, and Donut charts).
- Integrating external exchange rate APIs with caching to support multiple world currencies.
- Creating an automated seeder to load multi-month realistic demo data.
- Executing unit, integration, and build verification tests.

## 1.5 Organisation of the Report
This report is organized into fourteen chapters. **Chapter 2** details the system architecture and technology stack. **Chapters 3 through 10** chronicle the week-by-week progress across the eight weeks. **Chapter 11** describes the module-wise functionality. **Chapter 12** discusses challenges encountered and solutions applied. **Chapter 13** outlines the technical and professional skills acquired. Finally, **Chapter 14** concludes the report and discusses avenues for future enhancement.

---

<div style="page-break-after: always;"></div>

# 2. PROJECT OVERVIEW AND SYSTEM ARCHITECTURE

## 2.1 Project Overview
SpendWise is designed as an enterprise-patterned full-stack single-page application (SPA). It decouples the presentation tier from the business and data tier, ensuring maintainability, testability, and independent scalability.

```
+-------------------------------------------------------------------------+
|                              SPENDWISE                                  |
|               Full-Stack Financial Analytics Platform                   |
+-------------------------------------------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                                                 |
[Client Tier: React 18 + Vite]                         [Server Tier: Node.js + Express]
  - Tailwind CSS UI Components                           - RESTful Controller-Service Routing
  - Recharts Visual Analytics                            - SQL Aggregations & Validation
  - CurrencyContext Global State                         - CurrencyService (Cache & API)
  - Interactive Converter Widget                         - CSV Exporter & Demo Seeder
                                                                      |
                                                       [Data Tier: SQLite3 Database]
                                                         - database.sqlite (Relational)
```

## 2.2 System Architecture
The application architecture adheres to a clean layered design:
1. **Presentation Layer (Frontend):** React components communicate with the backend via Axios HTTP requests. Global state such as the active currency and exchange rates is managed through React Context API.
2. **Application Layer (Backend):** Express.js routes incoming requests to designated controllers. Controllers invoke database helper functions or external services, perform business calculations, and return structured JSON responses.
3. **Integration Layer (External Services):** Dedicated currency service interacts with external exchange rate APIs (`open.er-api.com`), maintaining an in-memory cache with fallback data.
4. **Data Persistence Layer:** SQLite3 stores tables locally in `database.sqlite` with foreign key enforcement and transactional safety.

## 2.3 Technology Stack

### Table 2.1: Technology Stack Breakdown
| Tier | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React.js | 18.3.1 | Component-based interactive UI |
| **Build Tool** | Vite | 5.4.11 | Ultra-fast bundling and Hot Module Replacement |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first responsive dark glassmorphism styling |
| **Charting Library** | Recharts | 2.13.0 | Declarative SVG/HTML5 charts |
| **Icons** | Lucide React | 1.72.0 | Consistent iconography |
| **HTTP Client** | Axios | 1.7.9 | Asynchronous API communication |
| **Backend Runtime** | Node.js | 22.17.0 | Server-side JavaScript execution environment |
| **Web Framework** | Express.js | 4.21.2 | RESTful routing and middleware handling |
| **Database** | SQLite3 | 5.1.7 | Self-contained, zero-configuration SQL database |
| **External API** | Open Exchange Rates API | v6 | Real-time foreign currency exchange rates |

## 2.4 Database Design and Relational Schema

### Table 2.2: Database Entity Schema Definitions
1. **`transactions` Table:**
   - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `amount` (REAL, NOT NULL)
   - `type` (TEXT, NOT NULL, CHECK `type IN ('expense', 'income')`)
   - `category` (TEXT, NOT NULL)
   - `date` (TEXT, NOT NULL, ISO 8601 format: YYYY-MM-DD)
   - `payment_method` (TEXT, DEFAULT 'Cash')
   - `notes` (TEXT)
   - `currency` (TEXT, DEFAULT 'USD')
   - `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

2. **`budgets` Table:**
   - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `category` (TEXT, NOT NULL, UNIQUE)
   - `monthly_limit` (REAL, NOT NULL)
   - `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

3. **`categories` Table:**
   - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `name` (TEXT, NOT NULL, UNIQUE)
   - `type` (TEXT, NOT NULL, CHECK `type IN ('expense', 'income', 'both')`)
   - `color` (TEXT, DEFAULT '#64748b')
   - `icon` (TEXT, DEFAULT 'tag')

## 2.5 Security and Data Integrity Design
- **SQL Injection Prevention:** All SQL queries employ parameter binding (`?` placeholders) rather than raw string concatenation.
- **Input Sanitization:** Strict type, positive numerical value, and enumeration checks protect endpoints from malformed payloads.
- **CORS Management:** Strict CORS headers allow controlled client-server interactions.
- **Fail-Safe Currency Handling:** Hardcoded fallback exchange rates ensure application continuity even in offline or rate-limited environments.

---

<div style="page-break-after: always;"></div>

# 3. WEEK 1 – REQUIREMENT ANALYSIS AND ENVIRONMENT SETUP

## 3.1 Domain Study and Workflow Identification
Week 1 (29 June 2026 – 5 July 2026) focused on requirement discovery and technical scoping. Key personal finance workflows were analyzed:
- Recording daily expenditures versus regular income.
- Grouping spending into standardized categories (Food, Housing, Travel, Utilities, Healthcare, Shopping, Entertainment).
- Calculating month-over-month savings and cash flow trajectories.
- Enforcing category budgets to prevent deficit spending.
- Addressing multi-currency financial records.

## 3.2 Technology Selection and Rationale
The full-stack JavaScript environment was selected for its consistency and rapid iteration:
- **React 18 & Vite:** Delivers exceptional client-side performance, fast page updates, and a rich ecosystem for visual analytics.
- **Express.js & Node.js:** High-throughput, non-blocking I/O ideal for RESTful API services.
- **SQLite3:** Zero-configuration, file-based relational database that eliminates external database server setup while retaining full SQL support.

## 3.3 Development Environment Setup
The local environment was configured on Windows x64:
- Node.js v22.17.0 and npm 10.9.2 verified.
- Monorepo folder hierarchy created with isolated `client/` and `server/` structures.
- Git repository initialization and `.gitignore` configuration for secrets and dependencies.

## 3.4 Initial Architecture Blueprint
A two-tier architectural blueprint was established with clear REST API contracts defined before writing implementation code.

## 3.5 Outcome of Week 1
Clear functional specifications document, finalized component diagram, and operational development environments for both backend and frontend.

---

<div style="page-break-after: always;"></div>

# 4. WEEK 2 – DATABASE MODELLING AND REST API FOUNDATION

## 4.1 SQLite Relational Schema Implementation
Week 2 (6 July 2026 – 12 July 2026) established the data foundation. In `server/src/db/database.js`, an automated schema initialization mechanism was engineered using SQLite3. Tables (`transactions`, `budgets`, and `categories`) were defined with strict data type constraints and foreign key activation.

## 4.2 Promise-Based Database Layer
Because native `sqlite3` uses callback-driven methods, asynchronous wrapper functions (`dbRun`, `dbGet`, `dbAll`) were created to enable clean, modern `async/await` syntax throughout controllers.

## 4.3 RESTful Controller-Service Architecture
The server was structured following enterprise separation of concerns:
- `server.js`: Server lifecycle, middleware (CORS, JSON parser, request logger), and port binding.
- `routes/api.js`: Express Router mapping endpoints to controller functions.
- `controllers/`: Pure business logic handling HTTP request/response cycles.

## 4.4 Transaction CRUD Endpoints
Initial endpoints were constructed and verified:
- `GET /api/transactions`: Fetch transaction records.
- `POST /api/transactions`: Insert new records with validation.
- `GET /api/health`: Provide instant uptime and health diagnostics.

## 4.5 Outcome of Week 2
A functioning Express server connected to an initialized SQLite database with verified basic CRUD operations.

---

<div style="page-break-after: always;"></div>

# 5. WEEK 3 – TRANSACTION MANAGEMENT ENGINE AND CSV EXPORT

## 5.1 Advanced Query Filtering and SQL Parameterization
Week 3 (13 July 2026 – 19 July 2026) expanded the transaction engine. The `getTransactions` controller was enhanced to support dynamic multi-condition filtering:
- Keyword search across `notes` and `category` fields using SQL `LIKE`.
- Exact category filtering.
- Transaction type filtering (`expense` vs. `income`).
- Date boundaries (`startDate` and `endDate`).
- Whitelisted dynamic sorting (`date`, `amount`, `category`) to prevent SQL injection.

## 5.2 Real-Time Keyword Search Implementation
Sub-millisecond query execution was achieved by indexing commonly filtered columns and structuring parameterized SQL query fragments.

## 5.3 Input Validation and Error Sanitization
Strict validation rules were added to `createTransaction` and `updateTransaction`:
- Ensuring `amount > 0` and preventing `NaN` entries.
- Requiring valid dates formatted as `YYYY-MM-DD`.
- Rejecting unrecognized transaction types.

## 5.4 CSV Data Export Endpoint Generation
To fulfill the requirement for data portability, the `GET /api/export/csv` endpoint was engineered. It dynamically extracts all database transactions, formats them with proper CSV escaping and headers, and sets HTTP headers:
- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="spendwise-transactions.csv"`

## 5.5 Outcome of Week 3
Full transaction lifecycle management (Create, Read, Update, Delete), multi-criteria filtering, and one-click CSV export ready.

---

<div style="page-break-after: always;"></div>

# 6. WEEK 4 – FINANCIAL ANALYTICS AND BUDGETING LOGIC

## 6.1 Summary Metrics Aggregation Algorithms
Week 4 (20 July 2026 – 26 July 2026) developed the financial intelligence engine in `server/src/controllers/analyticsController.js`.
- Total Income: `SUM(amount)` where `type = 'income'`.
- Total Expenses: `SUM(amount)` where `type = 'expense'`.
- Net Balance: `Total Income - Total Expenses`.
- Savings Rate: `((Total Income - Total Expenses) / Total Income) * 100`.
- Month-over-month percentage changes comparing the active month against the previous calendar month.

## 6.2 Multi-Month Cash Flow Trend Calculations
The `getMonthlyTrends` endpoint aggregates transactions grouped by calendar month using SQLite’s `strftime('%Y-%m', date)`. The raw SQL results are pivoted into structured chronological datasets containing `month`, `income`, `expense`, and `net`.

## 6.3 Category Breakdown Aggregations
The `getCategoryBreakdown` endpoint groups expenses by category, calculates the subtotal and transaction count, and computes the percentage of total monthly spending for each category.

## 6.4 Monthly Category Budgeting and Threshold Alerts
The budgeting engine calculates real-time budget utilization:
- `percentage = (actualSpent / monthly_limit) * 100`
- Status tagging:
  - 🟢 **Safe:** `< 80%`
  - 🟡 **Warning:** `80% - 100%`
  - 🔴 **Exceeded:** `> 100%`

## 6.5 Mid-Term Review Milestone
On 26 July 2026, the Mid-Term Review evaluated the completed backend architecture, database schemas, and analytics calculation consistency. All test cases passed successfully.

---

<div style="page-break-after: always;"></div>

# 7. WEEK 5 – REACT FRONTEND ARCHITECTURE AND KPI METRICS

## 7.1 Single Page Application Scaffolding with Vite
Week 5 (27 July 2026 – 2 August 2026) initiated frontend engineering. Using Vite, a React 18 single-page application was initialized in `client/`.

## 7.2 Tailwind CSS Configuration and Design System
Tailwind CSS was configured with a custom financial dark theme palette (slate-900 background, emerald accents for income/savings, and rose accents for expenses) with sleek customized scrollbar styling.

## 7.3 Centralized Axios API Service Layer
In `client/src/services/api.js`, an Axios client was configured with a base URL of `/api` and automatic reverse proxying defined in `vite.config.js` to eliminate Cross-Origin Resource Sharing (CORS) friction during development.

## 7.4 Dynamic KPI Summary Cards Component
The `SummaryCards.jsx` component was constructed to render four key performance indicator cards: Net Balance, Total Income, Total Expenses, and Savings Rate with dynamic trend indicators and pulse loading animations.

## 7.5 Outcome of Week 5
A responsive frontend shell successfully communicating with backend analytics endpoints and displaying live KPI cards.

---

<div style="page-break-after: always;"></div>

# 8. WEEK 6 – DATA VISUALIZATION AND BUDGET TRACKER UI

## 8.1 Recharts Integration for Financial Trends
Week 6 (3 August 2026 – 9 August 2026) focused on data visualization. In `ChartsSection.jsx`, Recharts was utilized to build an interactive monthly cash flow chart:
- Support for dual display modes: **Grouped Bar Chart** and **Gradient Area Chart**.
- Custom tooltip formatting numbers in the currently active currency.

## 8.2 Interactive Donut Chart for Category Distribution
A Donut Pie Chart was implemented to display category expense percentages with distinct slice colors and an accompanying category summary legend.

## 8.3 Category Budget Progress Tracker Component
`BudgetProgress.jsx` was developed to display category spending limits with progress bars, visual status badges, and an inline limit editing mechanism.

## 8.4 Add/Edit Transaction Modal Dialog
`TransactionModal.jsx` was created with a clean backdrop modal, type toggles (Expense/Income), custom category inputs, date picker, payment method dropdown, and comprehensive client-side form validation.

## 8.5 Outcome of Week 6
Complete visual analytics, budgeting dashboard, and transaction creation interface fully functional.

---

<div style="page-break-after: always;"></div>

# 9. WEEK 7 – CURRENCY EXCHANGE API AND GLOBAL CONVERTER

## 9.1 Third-Party Exchange Rate API Integration
Week 7 (10 August 2026 – 16 August 2026) delivered multi-currency intelligence. The backend was integrated with the open exchange rate API (`https://open.er-api.com/v6/latest/USD`) in `server/src/services/currencyService.js`.

## 9.2 In-Memory Caching Strategy and Offline Fallback
To avoid API rate limits and network latency:
- Live exchange rates are cached in server memory for 1 hour (3,600,000 ms).
- Pre-configured fallback exchange rates ensure seamless operations if the external service is unavailable or offline.

## 9.3 Global React Currency Context Provider
In `client/src/context/CurrencyContext.jsx`, a React Context provider was established to supply global currency state:
- Supported currencies: USD ($), EUR (€), GBP (£), INR (₹), CAD (CA$), AUD (AU$), JPY (¥), SGD (S$).
- Helper methods: `convert(amountUSD, targetCurr)`, `formatAmount(amountUSD)`, and `toUSD(amount, fromCurr)`.
- Instant recalculation across all dashboard cards, charts, budgets, and tables upon changing the navbar selector.

## 9.4 Interactive Currency Converter Widget
`CurrencyConverter.jsx` was built as a dedicated calculator widget featuring input amounts, source/destination dropdowns, a swap button, and live conversion formulas.

## 9.5 Outcome of Week 7
Global multi-currency intelligence and interactive calculator fully integrated with real-time exchange rates.

---

<div style="page-break-after: always;"></div>

# 10. WEEK 8 – INTEGRATION, SEEDING, TESTING AND REVIEW

## 10.1 Automated Realistic Demo Data Seeder
Week 8 (17 August 2026 – 23 August 2026) prepared the platform for portfolio presentation. A demo data seeder (`server/src/db/seed.js`) was engineered containing 34 realistic transactions spanning four months (August to November 2026). A "Seed Demo Data" button was placed in the navbar for 1-click demonstration.

## 10.2 Full-Stack System Integration
All components were assembled into the main application container (`App.jsx`), featuring month selectors, filter states, and notification toasts.

## 10.3 Comprehensive End-to-End Testing
End-to-end automated verification scripts were executed across all REST endpoints:
- Health diagnostics: 200 OK.
- KPI metrics and month-over-month comparisons: verified.
- Category breakdown sums: mathematically validated.
- CSV export: validated with correct formatting.

## 10.4 Production Build Optimization
The frontend was compiled using `npm run build`:
- 2,759 modules transformed into optimized production chunks.
- Zero compilation errors.

## 10.5 Final Review and Documentation
A comprehensive `README.md` and complete project documentation were drafted, concluding the technical deliverables of the internship.

---

<div style="page-break-after: always;"></div>

# 11. MODULE-WISE FUNCTIONAL DESCRIPTION

### Table 11.1: Core System Modules and Functional Capabilities
| Module | Primary Functionality | Key Components / Endpoints |
|---|---|---|
| **Transaction Management** | CRUD operations, search, category/type filtering, sorting | `TransactionList.jsx`, `TransactionModal.jsx`, `/api/transactions` |
| **Financial Visual Analytics** | Net balance, savings rate, monthly trends, category donut breakdown | `SummaryCards.jsx`, `ChartsSection.jsx`, `/api/analytics/*` |
| **Category Budgeting** | Monthly budget caps, spending progress, alert badges | `BudgetProgress.jsx`, `/api/budgets`, `/api/analytics/budget-comparison` |
| **Currency Intelligence** | Live rate fetching, 1-hour cache, dashboard conversion, converter widget | `CurrencyConverter.jsx`, `CurrencyContext.jsx`, `/api/currencies/*` |
| **Data Utilities & Seeding** | CSV file download, 1-click realistic demo data generation | `Navbar.jsx`, `/api/export/csv`, `/api/seed` |

## 11.1 Transaction Lifecycle Management Module
Allows users to record expenses and incomes. Each transaction captures numerical amount, category, date, payment method (Credit Card, Debit Card, Cash, UPI / Bank Transfer, Crypto), and notes. Records can be dynamically edited or deleted with safety confirmation dialogs.

## 11.2 Financial Visual Analytics Module
Translates raw transactions into visual insights. Evaluates cash flow trajectories and category spending allocations through Recharts Bar, Area, and Donut visualizations with responsive tooltips.

## 11.3 Budgeting and Alert Notification Module
Empowers users to set financial boundaries per category. Dynamically computes budget consumption and triggers visual alert badges when spending reaches warning (80%) or exceeded (100%) thresholds.

## 11.4 Global Currency Conversion Intelligence Module
Provides international currency flexibility. Automatically converts stored USD amounts into the selected currency across all dashboard views and provides an interactive bi-directional conversion calculator.

## 11.5 Data Export and Seeder Utilities Module
Generates spreadsheet-ready CSV downloads with proper formatting and allows 1-click seeding of realistic historical data for testing and demonstrations.

---

<div style="page-break-after: always;"></div>

# 12. CHALLENGES FACED AND SOLUTIONS ADOPTED

## 12.1 Cross-Origin Requests and Dev Proxying
**Challenge:** Developing the React client on port 5173 and Express server on port 5000 initially led to browser CORS restrictions.  
**Solution:** Configured Vite's internal development proxy (`server.proxy['/api']`) in `vite.config.js` to route all API calls internally while maintaining CORS middleware on the server.

## 12.2 External Currency API Latency and Rate Limiting
**Challenge:** Calling external exchange rate endpoints on every user action caused latency and risked rate-limiting.  
**Solution:** Engineered an in-memory caching mechanism with a 1-hour time-to-live (TTL) and hardcoded fallback rates to ensure sub-millisecond responses and offline capability.

## 12.3 Complex Multi-Currency Metric Conversions
**Challenge:** Storing transactions in arbitrary user-selected currencies could distort SQL aggregations.  
**Solution:** Adopted a normalized base currency pattern: all transactions are converted and stored in USD base currency in SQLite, while the client dynamically converts them for display.

## 12.4 Responsive Data Visualization Rendering
**Challenge:** Ensuring charts dynamically resize across desktop and mobile screens without distorting aspect ratios.  
**Solution:** Enclosed Recharts components within responsive containers (`<ResponsiveContainer width="100%" height="100%">`) and leveraged CSS Grid layouts.

---

<div style="page-break-after: always;"></div>

# 13. LEARNING OUTCOMES AND SKILLS ACQUIRED

### Table 13.1: Technical Skills Acquired
| Domain | Specific Skills Developed |
|---|---|
| **Frontend Engineering** | React 18, Vite, JSX, Context API, custom hooks, Tailwind CSS |
| **Backend Engineering** | Node.js, Express.js, RESTful API design, controller-service patterns |
| **Database Management** | SQLite3, relational schema design, SQL aggregations (`SUM`, `GROUP BY`, `strftime`) |
| **Data Visualization** | Recharts declarative charting, custom tooltips, bar/area/donut charts |
| **API Integration** | Third-party REST API consumption via Axios, in-memory caching strategies |
| **Software Quality** | Parameterized SQL queries, input validation, production build bundling |

## 13.1 Technical Proficiencies
The internship provided hands-on experience in full-stack architecture, relational database design, data visualization, and third-party API integration.

## 13.2 Software Engineering Practices
Acquired proficiency in modular project organization, separation of concerns, structured error handling, and clean code documentation.

## 13.3 Problem Solving and Analytical Thinking
Strengthened capability to dissect real-world financial tracking requirements, architect clean data flows, and build user-centric web applications.

---

<div style="page-break-after: always;"></div>

# 14. CONCLUSION AND FUTURE SCOPE

## 14.1 Conclusion
The **SpendWise** full-stack Expense Tracker and Financial Analytics Platform was successfully developed, verified, and deployed. Built using Node.js, Express.js, SQLite, React 18, Tailwind CSS, and Recharts, the application provides an intuitive and responsive solution for personal finance management.

By combining transaction CRUD operations, visual cash flow trends, category budget alerts, live currency conversion, and CSV data exports, the platform delivers on all project objectives. The internship served as an invaluable experience in building end-to-end software applications and preparing for professional engineering careers.

## 14.2 Future Scope
Potential enhancements identified for future development include:
1. **User Authentication & Multi-Tenancy:** Adding JWT-based user login and registration to support multiple isolated user accounts.
2. **Automated Bank Feed Integration:** Integrating Open Banking APIs (e.g. Plaid) to automatically import bank account and credit card transactions.
3. **Receipt OCR Scanner:** Integrating computer vision or machine learning APIs to parse receipts from images and extract amounts and dates automatically.
4. **Predictive Budget Forecasting:** Applying time-series machine learning models to forecast end-of-month spending based on mid-month trends.
5. **Progressive Web App (PWA):** Adding service workers and manifest files for offline mobile app installation.

---

### INTERNSHIP REPORT END
**Student Name:** Abinaya R  
**Register Number:** 511323205001  
**Department of Information Technology**  
**Kingston Engineering College, Vellore**
