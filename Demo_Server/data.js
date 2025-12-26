// Aadhaar Data (7 Users)
const aadhaar_data = [
  {
    ref_id: "70001",
    aadhaar_number: "3234-5678-9012",
    status: "VALID",
    message: "Aadhaar Card Exists",
    share_code: "1234",
    xml_file: "<xml file link with 48hrs expiry>",
    mobile_hash: "hashed_mobile_value",
    personal_info: {
      name: "Amit Sharma",
      dob: "1988-07-15",
      year_of_birth: 1988,
      gender: "M",
      email: "amit.sharma@example.com",
      photo_link: "<base64 encoded image>",
    },
    address_info: {
      care_of: "S/O: Ramesh Sharma",
      full_address: "Flat 12, MG Road, Mumbai, Maharashtra, India",
      split_address: {
        country: "India",
        dist: "Mumbai",
        house: "Flat 12",
        pincode: "400001",
        state: "Maharashtra",
        street: "MG Road",
        vtc: "Mumbai",
      },
    },
  },
  {
    ref_id: "70002",
    aadhaar_number: "4345-6789-0123",
    status: "VALID",
    message: "Aadhaar Card Exists",
    personal_info: {
      name: "Priya Verma",
      dob: "1992-09-20",
      year_of_birth: 1992,
      gender: "F",
      email: "priya.verma@example.com",
    },
    address_info: {
      care_of: "D/O: Suresh Verma",
      full_address: "House 24, Park Street, Delhi, India",
      split_address: {
        country: "India",
        dist: "New Delhi",
        house: "House 24",
        pincode: "110001",
        state: "Delhi",
        street: "Park Street",
        vtc: "Connaught Place",
      },
    },
  },
  {
    ref_id: "70003",
    aadhaar_number: "3456-7890-1234",
    status: "VALID",
    message: "Aadhaar Card Exists",
    personal_info: {
      name: "Rahul Mehta",
      dob: "1990-12-05",
      year_of_birth: 1990,
      gender: "M",
      email: "rahul.mehta@example.com",
    },
    address_info: {
      care_of: "S/O: Anil Mehta",
      full_address: "B-45, Green Avenue, Bangalore, Karnataka, India",
      split_address: {
        country: "India",
        dist: "Bangalore",
        house: "B-45",
        pincode: "560001",
        state: "Karnataka",
        street: "Green Avenue",
        vtc: "Bangalore",
      },
    },
  },
  {
    ref_id: "70004",
    aadhaar_number: "4567-8901-2345",
    status: "VALID",
    message: "Aadhaar Card Exists",
    personal_info: {
      name: "Sandeep Yadav",
      dob: "1985-02-18",
      year_of_birth: 1985,
      gender: "M",
      email: "sandeep.yadav@example.com",
    },
    address_info: {
      care_of: "S/O: Mohan Yadav",
      full_address: "Sector 21, Noida, UP, India",
      split_address: {
        country: "India",
        dist: "Noida",
        house: "Sector 21",
        pincode: "201301",
        state: "Uttar Pradesh",
        street: "Main Road",
        vtc: "Noida",
      },
    },
  },
  {
    ref_id: "70005",
    aadhaar_number: "5678-9012-3456",
    status: "VALID",
    message: "Aadhaar Card Exists",
    personal_info: {
      name: "Neha Kapoor",
      dob: "1995-11-10",
      year_of_birth: 1995,
      gender: "F",
      email: "neha.kapoor@example.com",
    },
    address_info: {
      care_of: "D/O: Raj Kapoor",
      full_address: "Apartment 34, Andheri, Mumbai, India",
      split_address: {
        country: "India",
        dist: "Mumbai",
        house: "Apartment 34",
        pincode: "400053",
        state: "Maharashtra",
        street: "Andheri West",
        vtc: "Mumbai",
      },
    },
  },
];

// PAN Data (7 Users)
const pan_data = [
  {
    verification_id: "test001",
    reference_id: 21637861,
    pan: "AMTSH1234A",
    name: "Amit Sharma",
    dob: "1988-07-15",
    status: "VALID",
  },
  {
    verification_id: "test002",
    reference_id: 21637862,
    pan: "PRYVR1234B",
    name: "Priya Verma",
    dob: "1992-09-20",
    status: "VALID",
  },
  {
    verification_id: "test003",
    reference_id: 21637863,
    pan: "RAHME1234C",
    name: "Rahul Mehta",
    dob: "1990-12-05",
    status: "VALID",
  },
  {
    verification_id: "test004",
    reference_id: 21637864,
    pan: "SANYA1234D",
    name: "Sandeep Yadav",
    dob: "1985-02-18",
    status: "VALID",
  },
  {
    verification_id: "test005",
    reference_id: 21637865,
    pan: "NEHKP1234E",
    name: "Neha Kapoor",
    dob: "1995-11-10",
    status: "VALID",
  },
];

// CIBIL Data (7 Users with multiple accounts and enquiries)
const cibil_data = [
  {
    name: "Amit Sharma",
    dob: "1988-07-15",
    income_tax_id: "AMTSH1234A",
    cibil_score: 750,
    accounts: [
      {
        member_name: "HDFC Bank",
        account_number: "HDFC123456",
        type: "CREDIT CARD",
      },
      {
        member_name: "ICICI Bank",
        account_number: "ICICI789012",
        type: "PERSONAL LOAN",
      },
    ],
    enquiries: [
      {
        member_name: "SBI Bank",
        enquiry_date: "2023-06-14",
        purpose: "HOME LOAN",
      },
      {
        member_name: "Axis Bank",
        enquiry_date: "2024-01-10",
        purpose: "CAR LOAN",
      },
    ],
  },
  {
    name: "Priya Verma",
    dob: "1992-09-20",
    income_tax_id: "PRYVR1234B",
    cibil_score: 720,
    accounts: [
      {
        member_name: "Axis Bank",
        account_number: "AXIS987654",
        type: "HOME LOAN",
      },
      {
        member_name: "SBI Bank",
        account_number: "SBI456789",
        type: "CREDIT CARD",
      },
    ],
    enquiries: [
      {
        member_name: "HDFC Bank",
        enquiry_date: "2023-05-12",
        purpose: "PERSONAL LOAN",
      },
      {
        member_name: "ICICI Bank",
        enquiry_date: "2023-10-22",
        purpose: "BUSINESS LOAN",
      },
    ],
  },
  {
    name: "Rahul Mehta",
    dob: "1990-12-05",
    income_tax_id: "RAHME1234C",
    cibil_score: 690,
    accounts: [
      {
        member_name: "SBI Bank",
        account_number: "SBI654321",
        type: "CREDIT CARD",
      },
      {
        member_name: "ICICI Bank",
        account_number: "ICICI123987",
        type: "CAR LOAN",
      },
    ],
    enquiries: [
      {
        member_name: "Kotak Bank",
        enquiry_date: "2024-02-01",
        purpose: "EDUCATION LOAN",
      },
      {
        member_name: "HDFC Bank",
        enquiry_date: "2023-12-15",
        purpose: "MORTGAGE",
      },
    ],
  },
  {
    name: "Sandeep Yadav",
    dob: "1985-02-18",
    income_tax_id: "SANYA1234D",
    cibil_score: 710,
    accounts: [
      {
        member_name: "Bank of Baroda",
        account_number: "BOB567432",
        type: "CREDIT CARD",
      },
      {
        member_name: "ICICI Bank",
        account_number: "ICICI765321",
        type: "BUSINESS LOAN",
      },
    ],
    enquiries: [
      {
        member_name: "Axis Bank",
        enquiry_date: "2023-08-05",
        purpose: "AUTO LOAN",
      },
      {
        member_name: "SBI Bank",
        enquiry_date: "2023-11-25",
        purpose: "HOME LOAN",
      },
    ],
  },
  {
    name: "Neha Kapoor",
    dob: "1995-11-10",
    income_tax_id: "NEHKP1234E",
    cibil_score: 780,
    accounts: [
      {
        member_name: "Kotak Bank",
        account_number: "KOTAK567890",
        type: "PERSONAL LOAN",
      },
      {
        member_name: "HDFC Bank",
        account_number: "HDFC678901",
        type: "CREDIT CARD",
      },
    ],
    enquiries: [
      {
        member_name: "Axis Bank",
        enquiry_date: "2023-09-20",
        purpose: "EDUCATION LOAN",
      },
      {
        member_name: "ICICI Bank",
        enquiry_date: "2024-02-10",
        purpose: "BUSINESS LOAN",
      },
    ],
  },
];

module.exports = { aadhaar_data, pan_data, cibil_data };
