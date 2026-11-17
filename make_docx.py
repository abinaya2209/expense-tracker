import os
import zipfile

def build_docx(output_path):
    content_types_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>'''

    rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''

    doc_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

    styles_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:val="en-US"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="360" w:lineRule="auto" w:after="160"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>'''

    # Helper XML builders
    def p(text="", jc=None, bold=False, italic=False, sz=24, space_after=160, space_before=0, underline=False):
        pPr = '<w:pPr>'
        if jc:
            pPr += f'<w:jc w:val="{jc}"/>'
        if space_after != 160 or space_before != 0:
            pPr += f'<w:spacing w:before="{space_before}" w:after="{space_after}" w:line="360" w:lineRule="auto"/>'
        pPr += '</w:pPr>'

        rPr = '<w:rPr>'
        rPr += '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>'
        if bold:
            rPr += '<w:b/>'
        if italic:
            rPr += '<w:i/>'
        if underline:
            rPr += '<w:u w:val="single"/>'
        if sz != 24:
            rPr += f'<w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>'
        rPr += '</w:rPr>'

        # escape text
        safe_text = (text.replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;"))
        return f'<w:p>{pPr}<w:r>{rPr}<w:t xml:space="preserve">{safe_text}</w:t></w:r></w:p>'

    def page_break():
        return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'

    def table(rows_data, col_widths=[1200, 7000, 1400], is_toc=False):
        tblPr = '''<w:tblPr>
          <w:tblW w:w="0" w:type="auto"/>
          <w:jc w:val="center"/>
          <w:tblBorders>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="333333"/>
            <w:left w:val="none"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="333333"/>
            <w:right w:val="none"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
            <w:insideV w:val="none"/>
          </w:tblBorders>
        </w:tblPr>''' if is_toc else '''<w:tblPr>
          <w:tblW w:w="0" w:type="auto"/>
          <w:jc w:val="center"/>
          <w:tblBorders>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="333333"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="333333"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="333333"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="333333"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
            <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          </w:tblBorders>
        </w:tblPr>'''

        xml = f'<w:tbl>{tblPr}'
        for row_idx, row in enumerate(rows_data):
            xml += '<w:tr>'
            for col_idx, cell in enumerate(row):
                w = col_widths[col_idx] if col_idx < len(col_widths) else 2000
                is_hdr = (row_idx == 0 and not is_toc)
                shd = '<w:shd w:val="clear" w:color="auto" w:fill="F3F4F6"/>' if is_hdr else ''
                valign = '<w:vAlign w:val="center"/>'
                
                safe_cell = (str(cell).replace("&", "&amp;")
                                      .replace("<", "&lt;")
                                      .replace(">", "&gt;"))
                
                bold_flag = is_hdr or (is_toc and str(row[0]).strip().isdigit())
                rPr = f'<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/>{"<w:b/>" if bold_flag else ""}</w:rPr>'
                align = "right" if col_idx == len(row) - 1 and is_toc else "left"
                pPr = f'<w:pPr><w:jc w:val="{align}"/><w:spacing w:before="60" w:after="60"/></w:pPr>'

                xml += f'''<w:tc>
                  <w:tcPr><w:tcW w:w="{w}" w:type="dxa"/>{shd}{valign}</w:tcPr>
                  <w:p>{pPr}<w:r>{rPr}<w:t xml:space="preserve">{safe_cell}</w:t></w:r></w:p>
                </w:tc>'''
            xml += '</w:tr>'
        xml += '</w:tbl>'
        return xml

    body_parts = []

    # ==================== PAGE 1: COVER PAGE ====================
    body_parts.append(p("KINGSTON ENGINEERING COLLEGE", jc="center", bold=True, sz=34, space_before=200, space_after=60))
    body_parts.append(p("Approved by AICTE, New Delhi | Affiliated to Anna University, Chennai", jc="center", bold=True, sz=22, space_after=40))
    body_parts.append(p("Accredited with 'A' Grade by NAAC", jc="center", bold=True, sz=22, space_after=40))
    body_parts.append(p("Chittoor Main Road, Christianpet, Vellore – 632 059", jc="center", sz=22, space_after=600))

    body_parts.append(p("DEPARTMENT OF INFORMATION TECHNOLOGY", jc="center", bold=True, sz=28, space_after=400))
    body_parts.append(p("IT3711 – SUMMER INTERNSHIP REPORT", jc="center", bold=True, sz=28, space_after=800, underline=True))

    body_parts.append(p("Submitted by", jc="center", italic=True, sz=24, space_after=300))
    body_parts.append(p("Name: Abinaya R", jc="center", bold=True, sz=26, space_after=60))
    body_parts.append(p("Register No: 511323205001", jc="center", bold=True, sz=26, space_after=60))
    body_parts.append(p("Semester: VII", jc="center", bold=True, sz=24, space_after=60))
    body_parts.append(p("Department: INFORMATION TECHNOLOGY", jc="center", bold=True, sz=24, space_after=600))

    body_parts.append(p("ACADEMIC YEAR: 2026 - 2027", jc="center", bold=True, sz=24, space_after=0))
    body_parts.append(page_break())

    # ==================== PAGE 2: INNER TITLE PAGE ====================
    body_parts.append(p("Web-Based Expense Tracker and Financial Analytics Platform with Real-Time Currency Intelligence (SpendWise)", jc="center", bold=True, sz=32, space_before=400, space_after=100))
    body_parts.append(p("Developed during the Summer Internship Programme 2026", jc="center", sz=24, space_after=600))

    body_parts.append(p("INTERNSHIP REPORT", jc="center", bold=True, sz=28, space_after=300))
    body_parts.append(p("Submitted by", jc="center", italic=True, sz=22, space_after=200))
    body_parts.append(p("ABINAYA R", jc="center", bold=True, sz=28, space_after=60))
    body_parts.append(p("(511323205001)", jc="center", bold=True, sz=26, space_after=300))

    body_parts.append(p("in partial fulfilment for the award of the degree", jc="center", italic=True, sz=22, space_after=40))
    body_parts.append(p("of", jc="center", italic=True, sz=22, space_after=120))
    body_parts.append(p("BACHELOR OF TECHNOLOGY", jc="center", bold=True, sz=26, space_after=40))
    body_parts.append(p("in", jc="center", italic=True, sz=22, space_after=40))
    body_parts.append(p("INFORMATION TECHNOLOGY", jc="center", bold=True, sz=26, space_after=700))

    body_parts.append(p("KINGSTON ENGINEERING COLLEGE, VELLORE", jc="center", bold=True, sz=26, space_after=60))
    body_parts.append(p("ANNA UNIVERSITY : CHENNAI 600 025", jc="center", bold=True, sz=24, space_after=60))
    body_parts.append(p("[2026 - 2027]", jc="center", bold=True, sz=24, space_after=0))
    body_parts.append(page_break())

    # ==================== PAGE 3: BONAFIDE CERTIFICATE ====================
    body_parts.append(p("KINGSTON ENGINEERING COLLEGE", jc="center", bold=True, sz=30, space_before=200, space_after=40))
    body_parts.append(p("Approved by AICTE, New Delhi | Affiliated to Anna University, Chennai", jc="center", bold=True, sz=20, space_after=30))
    body_parts.append(p("Accredited with 'A' Grade by NAAC", jc="center", bold=True, sz=20, space_after=30))
    body_parts.append(p("Chittoor Main Road, Christianpet, Vellore – 632 059", jc="center", sz=20, space_after=400))

    body_parts.append(p("DEPARTMENT OF INFORMATION TECHNOLOGY", jc="center", bold=True, sz=26, space_after=400))
    body_parts.append(p("BONAFIDE CERTIFICATE", jc="center", bold=True, sz=28, space_after=600, underline=True))

    cert_text = (
        "Certified that this Internship report \"Web-Based Expense Tracker and Financial Analytics "
        "Platform with Real-Time Currency Intelligence (SpendWise)\" is the bonafide work of "
        "\"ABINAYA R (511323205001)\" who carried out the internship work under my supervision "
        "during the academic year 2026-2027."
    )
    body_parts.append(p(cert_text, jc="both", sz=26, space_after=1400))

    # Signatures
    sig_table = [
        ["_________________________________", "_________________________________"],
        ["Signature of Head of the Department", "Signature of the Staff In-charge"],
        ["Mrs. M. Menaka, M.Tech., (Ph.D)", "Dr. M. Vasumathy, MS(SE)., Ph.D"],
        ["Head of the Department, IT", "Associate Professor, IT"]
    ]
    body_parts.append(table(sig_table, col_widths=[4800, 4800], is_toc=True))
    body_parts.append(page_break())

    # ==================== PAGE 4: ACKNOWLEDGEMENT ====================
    body_parts.append(p("ACKNOWLEDGEMENT", jc="center", bold=True, sz=28, space_before=200, space_after=400, underline=True))
    body_parts.append(p("My sincere thanks and profound sense of gratitude go to our respected Chairman Thiru. D.M. Kathir Anand, MBA (USA) for all his relentless efforts in educating me in a premier institution.", jc="both", sz=24))
    body_parts.append(p("I would like to express my sincere gratitude to our respected Principal Dr. U.V. ARIVAZHAGU, M.E., Ph.D., for her invaluable guidance, support, and constant encouragement throughout my academic journey.", jc="both", sz=24))
    body_parts.append(p("I extend my heartfelt thanks to the Head of the Department, Mrs. M. Menaka, M.Tech., (Ph.D.), Department of Information Technology, for her guidance, advice, and motivation all through the internship period.", jc="both", sz=24))
    body_parts.append(p("I convey my sincere and in-depth gratitude to our internal guide Dr. M. Vasumathy, MS(SE)., Ph.D., Associate Professor, for her valuable guidance, constructive critiques, and continuous support throughout the duration of this internship project.", jc="both", sz=24))
    body_parts.append(p("I would also like to thank all faculty members of the Department of Information Technology, friends, and fellow batchmates for their cooperation and assistance during the course of this internship.", jc="both", sz=24))
    body_parts.append(p("I am deeply indebted to my parents and family members whose unwavering moral support, sacrifices, and encouragement enabled me to complete this internship successfully. Above all, I thank the Almighty God for giving me good health, wisdom, and strength to carry out this project without difficulties and to achieve this milestone.", jc="both", sz=24, space_after=600))

    body_parts.append(p("Abinaya R", jc="right", bold=True, sz=24, space_after=20))
    body_parts.append(p("(Register No: 511323205001)", jc="right", bold=True, sz=24, space_after=400))
    body_parts.append(p("i", jc="center", italic=True, sz=22))
    body_parts.append(page_break())

    # ==================== PAGE 5: ABSTRACT ====================
    body_parts.append(p("ABSTRACT", jc="center", bold=True, sz=28, space_before=200, space_after=400, underline=True))
    body_parts.append(p(
        "This report presents the technical design, development, and implementation work carried out "
        "during the eight-week Summer Internship, which commenced on 29 June 2026. The objective of "
        "the internship was to engineer a robust, production-grade Web-Based Expense Tracker and "
        "Financial Analytics Platform, designated SpendWise. The platform addresses the critical "
        "challenge of personal financial management by providing an intuitive, transparent, and "
        "data-driven web portal that enables individuals to log monetary expenditures, categorize "
        "financial streams, monitor multi-month budgets, inspect interactive analytical charts, and "
        "dynamically convert financial values across global currencies.", jc="both", sz=24))

    body_parts.append(p(
        "The system is engineered as an end-to-end full-stack application. The backend is developed "
        "using Node.js and Express.js (v4.21) resting upon an embedded SQLite3 relational database. "
        "The backend employs a modular MVC controller-service architecture, structured parameter "
        "validation, robust SQL aggregations, and RESTful routing exposing endpoints for transaction "
        "lifecycle management, financial summary computations, monthly trend aggregations, category "
        "breakdowns, and category budget enforcement. To deliver reliable multi-currency calculations "
        "without third-party rate limits, the backend integrates with an external open exchange rate API "
        "with a 1-hour in-memory cache and automatic fallback datasets.", jc="both", sz=24))

    body_parts.append(p(
        "The frontend is built using React 18 bundled with Vite, written in modern modular JavaScript "
        "and styled using Tailwind CSS. Data visualization is powered by Recharts, delivering responsive, "
        "interactive monthly income vs. expense comparison charts (switchable between Bar and Area modes) "
        "and category expense distribution Donut charts with custom tooltips. Key functional components "
        "include responsive KPI summary cards (Net Balance, Total Income, Total Expenses, and Savings Rate), "
        "a category-wise monthly budget tracker with automated color-coded alert badges (Safe, Warning, Exceeded), "
        "a live currency converter calculator widget, a multi-parameter transaction filtering engine, instant "
        "CSV export capabilities, and a 1-click realistic demo data seeder.", jc="both", sz=24))

    body_parts.append(p(
        "The report describes the project architecture and the activities of each of the eight weeks, "
        "explains each module in detail, discusses the challenges encountered and their solutions, and "
        "summarises the technical and professional skills gained. The internship provided a strong practical "
        "foundation in full-stack development and in the engineering of a complete, data-driven financial application.", jc="both", sz=24, space_after=400))
    body_parts.append(p("ii", jc="center", italic=True, sz=22))
    body_parts.append(page_break())

    # ==================== PAGE 6 & 7: TABLE OF CONTENTS ====================
    body_parts.append(p("TABLE OF CONTENTS", jc="center", bold=True, sz=28, space_before=200, space_after=400, underline=True))

    toc_data = [
        ["S.NO", "CONTENT", "PG NO"],
        ["1", "INTRODUCTION", "1"],
        ["", "1.1 Background of the Internship", "1"],
        ["", "1.2 Objectives of the Project", "1"],
        ["", "1.3 Problem Statement & Domain Context", "2"],
        ["", "1.4 Scope of the Work", "2"],
        ["", "1.5 Organisation of the Report", "2"],
        ["2", "PROJECT OVERVIEW AND SYSTEM ARCHITECTURE", "3"],
        ["", "2.1 Project Overview", "3"],
        ["", "2.2 System Architecture", "3"],
        ["", "2.3 Technology Stack", "4"],
        ["", "2.4 Database Design and Relational Schema", "4"],
        ["", "2.5 Security and Data Integrity Design", "5"],
        ["3", "WEEK 1 – REQUIREMENT ANALYSIS AND ENVIRONMENT SETUP", "6"],
        ["", "3.1 Domain Study and Workflow Identification", "6"],
        ["", "3.2 Technology Selection and Rationale", "6"],
        ["", "3.3 Development Environment Setup", "7"],
        ["", "3.4 Initial Architecture Blueprint", "7"],
        ["", "3.5 Outcome of Week 1", "7"],
        ["4", "WEEK 2 – DATABASE MODELLING AND REST API FOUNDATION", "8"],
        ["", "4.1 SQLite Relational Schema Implementation", "8"],
        ["", "4.2 Promise-Based Database Layer", "8"],
        ["", "4.3 RESTful Controller-Service Architecture", "8"],
        ["", "4.4 Transaction CRUD Endpoints", "9"],
        ["", "4.5 Outcome of Week 2", "9"],
        ["5", "WEEK 3 – TRANSACTION ENGINE AND CSV EXPORT", "10"],
        ["", "5.1 Advanced Query Filtering and SQL Parameterization", "10"],
        ["", "5.2 Real-Time Keyword Search Implementation", "10"],
        ["", "5.3 Input Validation and Error Sanitization", "11"],
        ["", "5.4 CSV Data Export Endpoint Generation", "11"],
        ["", "5.5 Outcome of Week 3", "11"],
        ["6", "WEEK 4 – FINANCIAL ANALYTICS AND BUDGETING LOGIC", "12"],
        ["", "6.1 Summary Metrics Aggregation Algorithms", "12"],
        ["", "6.2 Multi-Month Cash Flow Trend Calculations", "12"],
        ["", "6.3 Category Breakdown Aggregations", "13"],
        ["", "6.4 Monthly Category Budgeting and Threshold Alerts", "13"],
        ["", "6.5 Mid-Term Review Milestone", "14"],
        ["7", "WEEK 5 – REACT FRONTEND ARCHITECTURE AND KPI METRICS", "15"],
        ["", "7.1 Single Page Application Scaffolding with Vite", "15"],
        ["", "7.2 Tailwind CSS Configuration and Design System", "15"],
        ["", "7.3 Centralized Axios API Service Layer", "16"],
        ["", "7.4 Dynamic KPI Summary Cards Component", "16"],
        ["", "7.5 Outcome of Week 5", "16"],
        ["8", "WEEK 6 – DATA VISUALIZATION AND BUDGET TRACKER UI", "17"],
        ["", "8.1 Recharts Integration for Financial Trends", "17"],
        ["", "8.2 Interactive Donut Chart for Category Distribution", "17"],
        ["", "8.3 Category Budget Progress Tracker Component", "18"],
        ["", "8.4 Add/Edit Transaction Modal Dialog", "18"],
        ["", "8.5 Outcome of Week 6", "19"],
        ["9", "WEEK 7 – CURRENCY EXCHANGE API AND CONVERTER WIDGET", "20"],
        ["", "9.1 Third-Party Exchange Rate API Integration", "20"],
        ["", "9.2 In-Memory Caching Strategy and Offline Fallback", "20"],
        ["", "9.3 Global React Currency Context Provider", "21"],
        ["", "9.4 Interactive Currency Converter Widget", "21"],
        ["", "9.5 Outcome of Week 7", "22"],
        ["10", "WEEK 8 – INTEGRATION, SEEDING, TESTING AND REVIEW", "23"],
        ["", "10.1 Automated Realistic Demo Data Seeder", "23"],
        ["", "10.2 Full-Stack System Integration", "23"],
        ["", "10.3 Comprehensive End-to-End Testing", "24"],
        ["", "10.4 Production Build Optimization", "24"],
        ["", "10.5 Final Review and Documentation", "24"],
        ["11", "MODULE-WISE FUNCTIONAL DESCRIPTION", "25"],
        ["12", "CHALLENGES FACED AND SOLUTIONS ADOPTED", "30"],
        ["13", "LEARNING OUTCOMES AND SKILLS ACQUIRED", "32"],
        ["14", "CONCLUSION AND FUTURE SCOPE", "34"]
    ]
    body_parts.append(table(toc_data, col_widths=[1200, 7200, 1200], is_toc=True))
    body_parts.append(p("iii", jc="center", italic=True, sz=22, space_before=400))
    body_parts.append(page_break())

    # ==================== CHAPTER 1 ====================
    body_parts.append(p("1. INTRODUCTION", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p("1.1 Background of the Internship", bold=True, sz=26, space_after=100))
    body_parts.append(p(
        "In modern technical education, hands-on industrial and project-based experience is essential "
        "to bridge academic theory with real-world software engineering practices. As part of the "
        "Bachelor of Technology in Information Technology curriculum under Anna University at Kingston "
        "Engineering College, the course IT3711 – Summer Internship serves as an intensive practical training "
        "ground. The internship took place over an eight-week duration during the academic period 2026–2027.", jc="both", sz=24))
    body_parts.append(p(
        "The internship assignment focused on conceptualizing, architecting, developing, testing, and "
        "deploying a complete, production-grade web application: SpendWise, a full-stack personal finance and "
        "expense analytics platform. The project provided thorough exposure to the end-to-end software development "
        "lifecycle (SDLC), including requirements gathering, relational database normalization, server-side REST API "
        "development, asynchronous client-side state management, interactive data visualization, and third-party API integration.", jc="both", sz=24))

    body_parts.append(p("1.2 Objectives of the Project", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p("The primary objectives established for the SpendWise platform comprise:", jc="both", sz=24))
    body_parts.append(p("• Accurate Transaction Logging: Enable users to seamlessly record and manage financial transactions with comprehensive metadata, including transaction amount, type (Income or Expense), category, date, payment method, and descriptive notes.", jc="both", sz=24))
    body_parts.append(p("• Visual Financial Analytics: Provide graphical intelligence on cash flows through multi-month trends and category spending distributions using interactive charting libraries.", jc="both", sz=24))
    body_parts.append(p("• Proactive Budget Monitoring: Implement category-specific monthly budget caps accompanied by visual indicators and automated threshold alerts (Safe, Warning, Exceeded) to prevent financial overspending.", jc="both", sz=24))
    body_parts.append(p("• Real-Time Currency Conversion: Integrate external live exchange rate services with an in-memory caching mechanism to enable seamless on-the-fly dashboard currency recalculation.", jc="both", sz=24))
    body_parts.append(p("• Data Portability: Enable instant export of historical transactions into industry-standard CSV format for spreadsheet auditing and personal record keeping.", jc="both", sz=24))
    body_parts.append(p("• Zero-Configuration Relational Persistence: Utilize an embedded, high-performance SQLite relational database to ensure self-contained portability without requiring manual database server configuration.", jc="both", sz=24))

    body_parts.append(p("1.3 Problem Statement & Domain Context", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p(
        "Personal financial stability requires transparent visibility into daily spending patterns. Traditional "
        "expense tracking approaches—such as physical paper diaries, static spreadsheet templates, or complex "
        "commercial banking software—suffer from several significant limitations: high friction, lack of real-time "
        "intelligence, absence of currency versatility, and data clutter. SpendWise eliminates these issues by integrating "
        "logging, automated SQL analytics, interactive visualizations, and live currency rates into a unified single-page web application.", jc="both", sz=24))

    body_parts.append(p("1.4 Scope of the Work", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p(
        "The project scope encompassed designing normalized relational schemas for transactions, budgets, and categories; "
        "building a modular Node.js/Express.js backend with structured REST API endpoints; developing SQL aggregation queries "
        "for financial metrics, monthly cash flows, and category distributions; developing a modern, responsive React 18 single-page "
        "application using Tailwind CSS; implementing Recharts data visualizations; integrating external exchange rate APIs with "
        "caching; creating an automated seeder to load multi-month realistic demo data; and executing unit, integration, and build verification tests.", jc="both", sz=24))

    body_parts.append(p("1.5 Organisation of the Report", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p(
        "The report follows the eight-week development progression. Chapter 2 describes the project architecture. Chapters 3 to 10 "
        "chronicle Weeks 1 to 8 respectively. Chapter 11 details module-wise functional specifications. Chapter 12 discusses challenges "
        "and solutions, Chapter 13 outlines skills acquired, and Chapter 14 concludes the report.", jc="both", sz=24))
    body_parts.append(page_break())

    # ==================== CHAPTER 2 ====================
    body_parts.append(p("2. PROJECT OVERVIEW AND SYSTEM ARCHITECTURE", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p("2.1 Project Overview", bold=True, sz=26, space_after=100))
    body_parts.append(p(
        "SpendWise is architected as an enterprise-patterned full-stack single-page application (SPA). It cleanly decouples "
        "the presentation tier from the backend API services and data persistence tier, ensuring maintainability, testability, "
        "and independent scalability.", jc="both", sz=24))

    body_parts.append(p("2.2 System Architecture", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p(
        "The system architecture follows a clean 4-tier separation:\n"
        "1. Presentation Tier (Frontend): React 18 single-page app bundled with Vite, styled with Tailwind CSS, and visual analytics rendered via Recharts.\n"
        "2. Application Tier (Backend REST API): Node.js with Express.js managing routing, request validation, business logic, and SQL query execution.\n"
        "3. Integration Tier: CurrencyService communicating with the Open Exchange Rates API with an in-memory 1-hour cache and offline fallback.\n"
        "4. Data Persistence Tier: Relational SQLite database stored locally in database.sqlite with foreign key constraints and transactional integrity.", jc="both", sz=24))

    body_parts.append(p("2.3 Technology Stack", bold=True, sz=26, space_before=200, space_after=100))
    tech_table = [
        ["Tier", "Technology", "Version", "Purpose"],
        ["Frontend Framework", "React.js", "18.3.1", "Component-based interactive UI"],
        ["Build Tool", "Vite", "5.4.11", "Ultra-fast bundling & HMR"],
        ["Styling", "Tailwind CSS", "3.4.17", "Utility-first responsive dark theme"],
        ["Data Visualization", "Recharts", "2.13.0", "Declarative SVG/HTML5 charts"],
        ["Iconography", "Lucide React", "1.72.0", "Vector icon library"],
        ["HTTP Client", "Axios", "1.7.9", "Asynchronous API communication"],
        ["Backend Runtime", "Node.js", "22.17.0", "Server-side JavaScript environment"],
        ["Web Framework", "Express.js", "4.21.2", "RESTful routing & middleware"],
        ["Database Engine", "SQLite3", "5.1.7", "Embedded zero-config relational DB"],
        ["External API", "Open Exchange Rates", "v6", "Live currency exchange rates"]
    ]
    body_parts.append(table(tech_table, col_widths=[2200, 2400, 1600, 3400]))

    body_parts.append(p("2.4 Database Design and Relational Schema", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p(
        "The database contains three principal tables:\n"
        "• transactions: id (PK), amount, type ('expense'/'income'), category, date, payment_method, notes, currency, created_at.\n"
        "• budgets: id (PK), category (UNIQUE), monthly_limit, created_at.\n"
        "• categories: id (PK), name (UNIQUE), type ('expense'/'income'/'both'), color, icon.", jc="both", sz=24))

    body_parts.append(p("2.5 Security and Data Integrity Design", bold=True, sz=26, space_before=200, space_after=100))
    body_parts.append(p(
        "All database operations employ parameterized SQL bindings (? placeholders) to completely prevent SQL injection attacks. "
        "Rigorous payload validation guards against NaN values and negative monetary amounts, while controlled CORS middleware protects endpoints.", jc="both", sz=24))
    body_parts.append(page_break())

    # ==================== CHAPTER 3 & 4 ====================
    body_parts.append(p("3. WEEK 1 – REQUIREMENT ANALYSIS AND ENVIRONMENT SETUP", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p(
        "Week 1 (29 June 2026 – 5 July 2026) was dedicated to domain study, requirement specifications, and environment setup. "
        "Key personal finance workflows were modeled, architectural boundaries between client and server were established, and development "
        "tooling (Node.js v22.17.0, npm v10.9.2, Git) was configured on Windows x64. The repository was initialized with an isolated "
        "monorepo structure separating client and server dependencies.", jc="both", sz=24))

    body_parts.append(p("4. WEEK 2 – DATABASE MODELLING AND REST API FOUNDATION", jc="left", bold=True, sz=28, space_before=400, space_after=200))
    body_parts.append(p(
        "Week 2 (6 July 2026 – 12 July 2026) established the data foundation. In server/src/db/database.js, SQLite database initialization "
        "scripts were created. Asynchronous wrapper helpers (dbRun, dbGet, dbAll) were developed to enable clean async/await syntax. "
        "Initial REST endpoints for transactions and health diagnostics were implemented and verified with HTTP client testing.", jc="both", sz=24))
    body_parts.append(page_break())

    # ==================== CHAPTER 5 & 6 ====================
    body_parts.append(p("5. WEEK 3 – TRANSACTION ENGINE AND CSV EXPORT", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p(
        "Week 3 (13 July 2026 – 19 July 2026) expanded the transaction management controller. Dynamic parameterized SQL filtering "
        "was engineered to support real-time text searching across notes, category filters, transaction type toggles (expense/income), "
        "and date range limits. A dedicated CSV export endpoint (GET /api/export/csv) was implemented to stream formatted transaction spreadsheets "
        "directly to the user with standard CSV headers and MIME type text/csv.", jc="both", sz=24))

    body_parts.append(p("6. WEEK 4 – FINANCIAL ANALYTICS AND BUDGETING LOGIC", jc="left", bold=True, sz=28, space_before=400, space_after=200))
    body_parts.append(p(
        "Week 4 (20 July 2026 – 26 July 2026) focused on financial analytics. SQL aggregation queries were developed in analyticsController.js "
        "to compute Net Balance, Savings Rate, and month-over-month percentage changes. Multi-month cash flow trends were grouped using "
        "SQLite's strftime('%Y-%m', date). Category budgeting logic was established to compute percentage consumption and classify statuses "
        "into Safe (<80%), Warning (80%-100%), and Exceeded (>100%). The Mid-Term Review was completed on 26 July 2026 with full verification.", jc="both", sz=24))
    body_parts.append(page_break())

    # ==================== CHAPTER 7 & 8 ====================
    body_parts.append(p("7. WEEK 5 – REACT FRONTEND ARCHITECTURE AND KPI METRICS", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p(
        "Week 5 (27 July 2026 – 2 August 2026) initiated frontend construction. Vite and React 18 were configured with Tailwind CSS. "
        "A centralized Axios service (api.js) was created with internal development proxying. The SummaryCards.jsx component was developed "
        "to display four executive KPI cards (Net Balance, Total Income, Total Expenses, and Savings Rate) with pulse loading states and "
        "month-over-month indicators.", jc="both", sz=24))

    body_parts.append(p("8. WEEK 6 – DATA VISUALIZATION AND BUDGET TRACKER UI", jc="left", bold=True, sz=28, space_before=400, space_after=200))
    body_parts.append(p(
        "Week 6 (3 August 2026 – 9 August 2026) delivered visual analytics. Recharts was integrated in ChartsSection.jsx to render "
        "monthly cash flow trends (toggleable between Bar and Area views) and an interactive category distribution Donut chart. The "
        "BudgetProgress.jsx component was built with color-coded alert indicators and inline budget editing. TransactionModal.jsx was "
        "created for creating and editing records with strict form validation.", jc="both", sz=24))
    body_parts.append(page_break())

    # ==================== CHAPTER 9 & 10 ====================
    body_parts.append(p("9. WEEK 7 – CURRENCY EXCHANGE API AND CONVERTER WIDGET", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p(
        "Week 7 (10 August 2026 – 16 August 2026) implemented multi-currency intelligence. The backend was connected to live exchange "
        "rate APIs with a 1-hour in-memory cache and offline fallback. A global CurrencyContext.jsx provider was built to dynamically "
        "recalculate all dashboard figures across eight world currencies (USD, EUR, GBP, INR, CAD, AUD, JPY, SGD). An interactive "
        "CurrencyConverter.jsx calculator widget was created with instant rate calculation.", jc="both", sz=24))

    body_parts.append(p("10. WEEK 8 – INTEGRATION, SEEDING, TESTING AND REVIEW", jc="left", bold=True, sz=28, space_before=400, space_after=200))
    body_parts.append(p(
        "Week 8 (17 August 2026 – 23 August 2026) finalized the platform. An automated realistic demo data seeder was created with 34 "
        "multi-month transactions. Full-stack integration was completed, and comprehensive end-to-end tests confirmed all endpoints and "
        "calculations. The frontend production build succeeded with zero errors (2,759 modules transformed). The final project demonstration "
        "and submission were completed on 23 August 2026.", jc="both", sz=24))
    body_parts.append(page_break())

    # ==================== CHAPTER 11, 12, 13, 14 ====================
    body_parts.append(p("11. MODULE-WISE FUNCTIONAL DESCRIPTION", jc="left", bold=True, sz=28, space_before=200, space_after=200))
    body_parts.append(p(
        "The completed SpendWise application comprises five core functional modules:\n"
        "1. Transaction Lifecycle Management: Enables adding, editing, deleting, searching, and filtering of expenses and income streams.\n"
        "2. Financial Visual Analytics: Evaluates multi-month cash flow trajectories through Recharts Bar/Area charts and category expense distribution Donut charts.\n"
        "3. Category Budgeting & Alerts: Monitors category limits and displays progress bars with color-coded status badges (Safe, Warning, Exceeded).\n"
        "4. Global Currency Intelligence: Provides real-time currency conversion using live exchange rates, 1-hour server caching, and an interactive conversion calculator.\n"
        "5. Data Portability & Demo Seeder: Supports instant CSV spreadsheet downloads and 1-click realistic demo data generation.", jc="both", sz=24))

    body_parts.append(p("12. CHALLENGES FACED AND SOLUTIONS ADOPTED", jc="left", bold=True, sz=28, space_before=300, space_after=200))
    body_parts.append(p(
        "Key engineering challenges addressed during development included:\n"
        "• CORS Restrictions: Resolved by configuring Vite's internal proxying rules in vite.config.js.\n"
        "• Third-Party API Latency: Mitigated by implementing a 1-hour in-memory cache and resilient fallback rates in currencyService.js.\n"
        "• Multi-Currency Data Normalization: Maintained all raw database amounts in base USD while delegating localized conversions to the client layer.\n"
        "• Dynamic Chart Responsiveness: Utilized Recharts ResponsiveContainer wrappers and responsive CSS Grid structures.", jc="both", sz=24))

    body_parts.append(p("13. LEARNING OUTCOMES AND SKILLS ACQUIRED", jc="left", bold=True, sz=28, space_before=300, space_after=200))
    body_parts.append(p(
        "The internship provided extensive practical proficiencies across modern software engineering:\n"
        "• Frontend: React 18, Vite, Tailwind CSS, Recharts, and React Context state management.\n"
        "• Backend: Node.js, Express.js RESTful API design, controller-service modularity, and error handling middleware.\n"
        "• Database: SQLite3 relational modeling, parameterized queries, and SQL aggregation functions.\n"
        "• Software Quality: Input sanitization, asynchronous programming, build optimization, and technical documentation.", jc="both", sz=24))

    body_parts.append(p("14. CONCLUSION AND FUTURE SCOPE", jc="left", bold=True, sz=28, space_before=300, space_after=200))
    body_parts.append(p(
        "The SpendWise full-stack Expense Tracker & Financial Analytics Platform was successfully engineered, tested, and validated. "
        "It provides a robust, user-friendly, and data-driven solution for personal financial intelligence. Future enhancements include "
        "JWT-based multi-user authentication, automated bank feed integration (Open Banking APIs), OCR receipt scanning, and mobile PWA packaging.", jc="both", sz=24, space_after=400))

    body_parts.append(p("INTERNSHIP REPORT SUBMISSION", jc="center", bold=True, sz=26, space_after=60))
    body_parts.append(p("Student Name: Abinaya R", jc="center", bold=True, sz=24, space_after=30))
    body_parts.append(p("Register Number: 511323205001", jc="center", bold=True, sz=24, space_after=30))
    body_parts.append(p("Department: Department of Information Technology", jc="center", sz=22, space_after=30))
    body_parts.append(p("College: Kingston Engineering College, Vellore", jc="center", bold=True, sz=24, space_after=30))
    body_parts.append(p("Affiliated to: Anna University, Chennai", jc="center", sz=22, space_after=0))

    # Assemble document.xml
    body_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(body_parts)}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1152" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>'''

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as docx:
        docx.writestr('[Content_Types].xml', content_types_xml)
        docx.writestr('_rels/.rels', rels_xml)
        docx.writestr('word/_rels/document.xml.rels', doc_rels_xml)
        docx.writestr('word/styles.xml', styles_xml)
        docx.writestr('word/document.xml', body_xml)

    print(f"Successfully generated DOCX at {output_path}")

if __name__ == '__main__':
    target = os.path.join(os.path.dirname(__file__), 'SpendWise_Internship_Report_Abinaya_R.docx')
    build_docx(target)
