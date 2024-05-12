// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract DAppRegistry {
    struct DAppDetails {
        string companyName;
        address dAppAddress;
        string auditReport;
        bool isFraudulent;
        string vulnerabilityReport;
        bool approved; // Indicates if the DApp has been approved
    }
    mapping(address => DAppDetails) public dAppRegistry;
    address[] public allDApps; // Array to hold all registered DApps, approved or not
    address public admin; // Administrator address for approval
    // Event declarations
    event DAppRegistered(address indexed dAppAddress, string companyName);
    event AuditReportUpdated(address indexed dAppAddress, string newAuditReport);
    event FraudReported(address indexed dAppAddress, string report);
    event VulnerabilityReported(address indexed dAppAddress, string report);
    event DAppApproved(address indexed dAppAddress, bool approved);


    constructor() {
        admin = msg.sender; // Set the deployer as the admin
    }
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Function to register a new dApp
    function registerDApp(address _dAppAddress, string memory _companyName, string memory _auditReport) public {
        require(dAppRegistry[_dAppAddress].dAppAddress == address(0), "DApp already registered.");
        dAppRegistry[_dAppAddress] = DAppDetails(_companyName, _dAppAddress, _auditReport, false, "", false);
        allDApps.push(_dAppAddress); // Add to all DApps list upon registration
        emit DAppRegistered(_dAppAddress, _companyName);
    }
    
    // Admin function to approve a DApp
    function approveDApp(address _dAppAddress) public onlyAdmin {
        require(dAppRegistry[_dAppAddress].dAppAddress != address(0), "DApp not registered.");
        require(!dAppRegistry[_dAppAddress].approved, "DApp already approved.");
        dAppRegistry[_dAppAddress].approved = true;
        emit DAppApproved(_dAppAddress, true);
    }
    // Function to update the audit report of a registered dApp
    function updateAuditReport(address _dAppAddress, string memory _newAuditReport) public {
        require(dAppRegistry[_dAppAddress].dAppAddress != address(0), "DApp not registered.");
        dAppRegistry[_dAppAddress].auditReport = _newAuditReport;
        emit AuditReportUpdated(_dAppAddress, _newAuditReport);
    }
    // Function to report fraud activity for a dApp
    function reportFraud(address _dAppAddress, string memory _report) public {
        require(dAppRegistry[_dAppAddress].dAppAddress != address(0), "DApp not registered.");
        dAppRegistry[_dAppAddress].isFraudulent = true;
        emit FraudReported(_dAppAddress, _report);
    }
    // Function to report a vulnerability for a dApp
    function reportVulnerability(address _dAppAddress, string memory _report) public {
        require(dAppRegistry[_dAppAddress].dAppAddress != address(0), "DApp not registered.");
        dAppRegistry[_dAppAddress].vulnerabilityReport = _report;
        emit VulnerabilityReported(_dAppAddress, _report);
    }
    // Function to get the details of a registered dApp
    function getDAppDetails(address _dAppAddress) public view returns (DAppDetails memory) {
        require(dAppRegistry[_dAppAddress].dAppAddress != address(0), "DApp not registered.");
        return dAppRegistry[_dAppAddress];
    }
    // Function to get details of all registered DApps, approved or not
    function getAllDAppsDetails() public view returns (DAppDetails[] memory) {
        DAppDetails[] memory details = new DAppDetails[](allDApps.length);
        for (uint i = 0; i < allDApps.length; i++) {
            details[i] = dAppRegistry[allDApps[i]];
        }
        return details;
    }
}