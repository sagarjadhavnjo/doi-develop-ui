export const APIConst = {

	//JPA Scheme Master Entry --ENTRY AND UPDATE SAME API -- Get one and get all same api empty input will return all values 
	DOI_JPA_MASTER_SCHEME_ENTRY: "doi/master-scheme-entry",
	DOI_JPA_MASTER_SCHEME_LISTING: "doi/master-scheme-listing",
	DOI_JPA_MASTER_SCHEME_DROPDOWN_LISTING: "doi/master-schemes",	
	DOI_JPA_MASTER_SCHEME_DELETE: "doi/master-scheme-delete",
	DOI_JPA_MASTER_SCHEME_UPDATE: "doi/master-scheme-update",

	//JPA Master Policy --ENTRY AND UPDATE SAME API -- Get one and get all same api empty input will return all values 
	JPA_SCHEME_MASTER_POLICY_ENTRY: "doi/jpa/jpa-master-policy",
	JPA_SCHEME_MASTER_POLICY_LISTING: "doi/jpa/jpa-master-policy-listing",
	JPA_SCHEME_MASTER_POLICY_DELETE: "doi/jpa/jpa-master-policy-delete",
	JPA_SCHEME_MASTER_POLICY_LISTING_BY_SCHEME_ID: "doi/jpa/jpa-master-policy-listing-by-scheme-id",
	JPA_SCHEME_MASTER_SCHEME_BY_SCHEME_ID: "doi/master-scheme",
	//DROP DOWN
	DOI_MASTER_SCHEME_POLICY_DROPDOWN: 'doi/master-scheme-policy-dropdown',
	DOI_LOSS_OF_CAUSE_DROPDOWN: 'doi/common-lookup-cause-of-loss',
	DOI_REQUIREMENT_LIST_DROPDOWN: 'doi/common-lookup-requirement-list',
	DOI_BANK_LIST: 'doi/common-bank-list',
	DOI_BANK_BRANCH_LIST: 'doi/common-bank-branch-list',
	DOI_ACTIVE_INACTIVE_LIST_DROPDOWN: 'doi/common-lookup-active-inactive-list',
	DOI_POLICY_TYPES_DROPDOWN: 'doi/common-lookup-policy-types-list',
	DOI_POLICY_STATUS_DROPDOWN: 'doi/common-lookup-policy-status-list',
	DOI_YEAR_LIST_DROPDOWN: 'doi/common-lookup-year-list',
	DOI_MONTH_LIST_DROPDOWN: 'doi/common-lookup-month-list',
	JPA_DOI_GET_DISTRICT_LIST_BY_STATE_ID: 'doi/common-district-list-by-state-id',
	JPA_DOI_GET_DISTRICT_LIST_GUJRAT: 'doi/common-district-list-gujrat',
	GET_DOI_STATE_LIST: 'doi/common-state-list',
	GET_DOI_DISTRICT_LIST: 'doi/common-district-list',
	GET_DOI_TALUKA_LIST: 'doi/common-taluka-list-by-districtid',
	GET_DOI_VILLAGE_LIST: 'doi/common-village-list-by-talukaid',
	JPA_LOOKUP_INFO_BASED_ON_CATEGORY: "doi/common-lookup-info-oncategory",
	DOI_CO_INSURANCE_INTIMATION_THROUGH: "CO-INSURANCE_INTIMATION THROUGH",
	DOI_CO_INSURANCE_POLICY_TYPE: "CO-INSURANCE_POLICY_TYPE",
	DOI_CO_INSURANCE_DOI_RESPONSIBILITY: "CO-INSURANCE_DOI_RESPONSIBILITY",
	DOI_CO_INSURANCE_RECEIVED_CLAIM_FROM: "CO-INSURANCE_RECEIVED_CLAIM_FROM",
	DOI_COINS_CLAIM_ENT_RECE_CLAIM_FROM: "COINS_CLAIM_ENT_RECE_CLAIM_FROM",
	DOI_CO_INSURANCE_SURVEYOR_REPORT_RECEIVED: "CO-INSURANCE_SURVEYOR_REPORT_RECEIVED",
	DOI_CO_INSURANCE_WHETHER_UNDER_INSURANCE: "CO-INSURANCE_WHETHER_UNDER_INSURANCE",
	DOI_CO_INSURANCE_WHETHER_CLAIM_HAS_BEEN_LOGED_WITH_THIRED_PARTY: "CO-INSURANCE_WHETHER_CLAIM_HAS_BEEN_LOGED_WITH_THIRED_PARTY",
	DOI_COINS_PRE_MONTH: "COINS_PRE_MONTH",
	DOI_CO_INSURANCE_LEADER_NAME: "CO-INSURANCE_LEADER_NAME",
	DOI_CO_INSURANCE_INSURED_NAME: "CO-INSURANCE_INSURED NAME",
	DOI_COINS_POL_ENTRY_LIST_POLICY_NO: "COINS_POL_ENTRY_LIST_POLICY_NO",
	DOI_RE_RISK_TYPE: "RE_RISK_TYPE",
	DOI_CO_INSURANCE_MAJOR_HEAD: "CO-INSURANCE_MAJOR_HEAD",
	DOI_CO_INSURANCE_MINOR_HEAD: "CO-INSURANCE_MINOR_HEAD",
	DOI_CO_INSURANCE_TRANSACTION_TYPE: "CO-INSURANCE_TRANSACTION_TYPE",
	DOI_RE_INC_COMP_NAME: "RE_INC_COMP_NAME",
	DOI_RE_INC_COMP_LOCATION: "RE_INC_COMP_LOCATION",
	DOI_REINSU_PRI_REGI_INSU_COM_OFF_BRANCH_CODE: "REINSU_PRI_REGI_INSU_COM_OFF_BRANCH_CODE",
	DOI_REINS_PRI_REG_RISK_TYPE: "REINS_PRI_REG_RISK_TYPE",
	DOI_CO_INSURANCE_CLAIM_ID: "CO-INSURANCE_CLAIM_ID",
	DOI_REINSU_POLICY_MASTER_DEPARTMENT: "REINSU_POLICY_MASTER_DEPARTMENT",
	//JPA Document Master
	//JPA Document Master scheme --ENTRY AND UPDATE SAME API -- Get one and get all same api empty input will return all values 
	DOI_JPA_SCHEME_DOCUMENT_LISTING: "doi/jpa/document-master/scheme-document-listing",
	DOI_JPA_SCHEME_DOCUMENT_DELETE: "doi/jpa/document-master/scheme-document-delete",
	DOI_JPA_SCHEME_DOCUMENT_ENTRY: "doi/jpa/document-master/scheme-document-entry",
	//JPA Document Master common --ENTRY AND UPDATE SAME API -- Get one and get all same api empty input will return all values 
	DOI_JPA_COMMON_DOCUMENT_LISTING: "doi/jpa/document-master/common-document-listing",
	DOI_JPA_COMMON_DOCUMENT_DELETE: "doi/jpa/document-master/common-document-delete",
	DOI_JPA_COMMON_DOCUMENT_ENTRY: "doi/jpa/document-master/common-document-entry",
	//JPA Document Master losscause --ENTRY AND UPDATE SAME API -- Get one and get all same api empty input will return all values 
	DOI_JPA_LOSSCAUSE_DOCUMENT_LISTING: "doi/jpa/document-master/loss-cause-document-listing",
	DOI_JPA_LOSSCAUSE_DOCUMENT_DELETE: "doi/jpa/document-master/loss-cause-document-delete",
	DOI_JPA_LOSSCAUSE_DOCUMENT_ENTRY: "doi/jpa/document-master/loss-cause-document-entry",
	DOI_JPA_DOCUMENT_LIST_BY_LOSS_CAUSE_AND_SCHEMEID: "doi/jpa/document-master/document-list-for-claim",

	//JPA Claim Listing
	JPA_CLAIM_ENTERY: "doi/jpa/jpa-claim-entry",
	JPA_CLAIM_ENTERY_LISTING: "doi/jpa/jpa-claim-entry-listing",
	JPA_CLAIM_ENTERY_LISTING_BY_STATUS: "doi/jpa/jpa-claim-entry-listing-by-status",
	JPA_CLAIM_LISTING:"doi/claim-listing-page",
	//CLAIM STATUS
	JPA_CLAIM_ACCEPTED_APPLICATION: "ACCEPTED",
	JPA_CLAIM_RETURN_TO_NODEL_APPLICATION: "RETURN TO NODEL",
	JPA_CLAIM_PENDING_FOR_APPROVAL_APPLICATION: "PENDING FOR APPROVAL",
	JPA_CLAIM_SEND_FOR_PAYMENT_APPLICATION: "SENT FOR PAYMENT",
	JPA_GENDER_TYPES: "Gender Types",
	JPA_MARITAL_TYPES: "Marital Status",
	JPA_PERSON_RELEATION: "Person Relation",
	RECOMMENDATION_LIST: "Recommendation List",
	JPA_DECEASED_PERSON: "Deceased Person",
	VEHICLE_ACCIDENT: "Vehicle Accident",
	JPA_DISABILITY: "Disability",


	//JPA legal
	DOI_JPA_LEGAL_ENTRY: "doi/jpa-legal/entry",
	DOI_JPA_GET_LEGAL_ENTRY_BY_CLIAM_ID: "doi/jpa/jpa-claim-entry/",
	DOI_JPA_LEGAL_ENTRY_LISTING: "doi/jpa-legal/entry-listing",
	DOI_JPA_LEGAL_ENTRY_FOR_REQUEST: "doi/jpa-legal/entry-for-request",
	DOI_JPA_LEGAL_ENTRY_FOR_REQUEST_LISTING: "doi/jpa-legal/entry-for-request-listing",
	DOI_JPA_LEGAL_CLAIM_LISTING: "doi/jpa-legal/claim-listing",
	DOI_JPA_LEGAL_DELETE_ENTRY_FOR_REQUEST: "doi/jpa-legal/delete-entry-for-request/",
	
	//DOI POLICY Listing
	DOI_COINSURANCE_POLICY_ENTRY_LISTING: "co-insurance/policy-entry-listing",
	DOI_COINSURANCE_CLAIM_LISTING: "co-insurance/claim-listing",
	DOI_COINSURANCE_CLAIM_ENTRY: "co-insurance/claim-entry",
	DOI_COINSURANCE_CHECK_REGISTER: "co-insurance/cheque-register",
	DOI_COINSURANCE_CHECK_REGISTER_LISTING: "co-insurance/cheque-register-listing",
	DOI_COINSURANCE_PREMIUM_REFUND_ENTRY: "co-insurance/premium-refund-entry",
	DOI_COINSURANCE_PREMIUM_REFUND_LISTING: "co-insurance/premium-refund-listing",
	DOI_COINSURANCE_PREMIUM_REGISTER: "co-insurance/premium-register",

	DOI_REINSURANCE_PREMIUM_REGISTER: "re-insurance/premium-register",
	DOI_REINSURANCE_POLICY_MASTER: "re-insurance/policy-master",
	DOI_REINSURANCE_CLAIM_RECOVERY_ENTRY: "re-insurance/claim-recovery-entry",
	DOI_GET_DROPDOWN_DATA: "doi/lulookupinfo/objecttype/201",

	//common
	COMMON_DROPDOWN_WITH_NAME: "doi/lulookupinfo/objecttype/201",

	//HBA 
	DOI_HBA_POLICY_PROPOSAL_LISTING: "doi/hba/policy-proposal-listing",

	//common lulookupinfo drodowns
	//LULOOKUPINFO_LIST: 'edp/lulookupinfo/objecttype/201'


}