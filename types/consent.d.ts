export interface IConstentDetail {
  consentStart: string;
  consentExpiry: string;
  consentMode: "VIEW" | "STORE" | "QUERY" | "STREAM";
  fetchType: "ONETIME" | "PERIODIC";
  consentTypes: Array<"PROFILE" | "SUMMARY" | "TRANSACTIONS">;
  fiTypes: Array<FITypes>;
  DataConsumer: DataConsumer;
  Customer: Customer;
  Purpose: Purpose;
  FIDataRange: FIDataRange;
  DataLife: DataLife;
  Frequency: Frequency;
  DataFilter: DataFilter[];
}

type FITypes =
  | "DEPOSIT"
  | "TERM_DEPOSIT"
  | "RECURRING_DEPOSIT"
  | "SIP"
  | "CP"
  | "GOVT_SECURITIES"
  | "EQUITIES"
  | "BONDS"
  | "DEBENTURES"
  | "MUTUAL_FUNDS"
  | "ETF"
  | "IDR"
  | "CIS"
  | "AIF"
  | "INSURANCE_POLICIES"
  | "NPS"
  | "INVIT"
  | "REIT"
  | "GSTR1_3B"
  | "OTHER";

interface Customer {
  id: string;
  Identifiers: Identifier[];
}

interface Identifier {
  type: "MOBILE" | "EMAIL" | "OTHERS";
  value: string;
}

interface DataConsumer {
  id: string;
  type: "FIU" | "USER" | "AA";
}

interface DataFilter {
  type: "TRANSACTIONTYPE" | "TRANSACTIONAMOUNT";
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=";
  value: string;
}

interface DataLife {
  unit: "MONTH" | "YEAR" | "DAY" | "INF";
  value: number;
}

interface Frequency {
  unit: "HOUR" | "DAY" | "MONTH" | "YEAR" | "INF";
  value: number;
}

interface FIDataRange {
  from: Date;
  to: Date;
}

interface Purpose {
  code: 101 | 102 | 103 | 104 | 105;
  refUri:
    | "https://api.rebit.org.in/aa/purpose/101.xml"
    | "https://api.rebit.org.in/aa/purpose/102.xml"
    | "https://api.rebit.org.in/aa/purpose/103.xml"
    | "https://api.rebit.org.in/aa/purpose/104.xml"
    | "https://api.rebit.org.in/aa/purpose/105.xml";
  text: string;
  Category: Category;
}

interface Category {
  type:
    | "Personal Finance"
    | "Financial Reporting"
    | "Account Query and Monitoring";
}

export interface IConsentResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  Customer: {
    id: string;
  };
  ConsentHandle: string;
}
