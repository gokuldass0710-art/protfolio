export type ProjectCategory =
  | "Blue Team / SOC"
  | "Network Security"
  | "Web Application Security"
  | "IoT Security";

export type ProjectStatus = "Completed" | "In Progress" | "Planned";

export interface ProjectResult {
  text: string;
  verified: boolean;
}

export interface ProjectEvidence {
  src: string;
  alt: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  summary: string;
  problem: string;
  objectives: string[];
  environment: string[];
  technologies: string[];
  methodology: string[];
  implemented: string[];
  observed: string[];
  recommended: string[];
  results: ProjectResult[];
  limitations: string[];
  evidence: ProjectEvidence[];
  lessons: string[];
  repoUrl?: string;
  reportUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "endpoint-security-monitoring-sysmon-wazuh",
    title: "Endpoint Security Monitoring with Sysmon & Wazuh",
    category: "Blue Team / SOC",
    status: "In Progress",
    summary:
      "A virtualized detection engineering and log analysis lab exploring endpoint telemetry collection, Windows event analysis, and SIEM alerting against simulated suspicious activities.",
    problem:
      "Modern cyber attacks frequently leverage legitimate system binaries and native management tools (living-off-the-land) that standard Windows auditing fails to capture in granular detail. Without fine-grained process, network, and remote management telemetry, defenders struggle to detect early-stage lateral movement.",
    objectives: [
      "Understand Sysmon telemetry collection and XML configuration rules",
      "Investigate Windows process creation, file integrity, and network connection events",
      "Configure endpoint log collection agents feeding a centralized Wazuh SIEM manager",
      "Analyze security events and correlate telemetry in Wazuh dashboard",
      "Investigate simulated suspicious WinRM-related administrative activity",
      "Establish a baseline detection and triage response workflow"
    ],
    environment: [
      "Windows 10 Enterprise VM (Endpoint Client)",
      "Windows Server 2022 VM (Target Server / Management Host)",
      "Kali Linux VM (Security Testing / Simulation)",
      "Wazuh SIEM Manager & Dashboard 4.x",
      "Microsoft Sysmon v14",
      "VMware Workstation 17 Pro (Host-only virtual network)"
    ],
    technologies: [
      "Wazuh SIEM",
      "Sysmon",
      "Windows Event Logs",
      "WinRM / WMI",
      "PowerShell",
      "VMware Workstation"
    ],
    methodology: [
      "Deployed isolated host-only virtual network in VMware Workstation to ensure contained testing.",
      "Installed and configured Sysmon on Windows endpoints using a tailored modular configuration.",
      "Deployed and registered Wazuh agents on endpoints, configuring ossec.conf for active event channel forwarding.",
      "Simulated suspicious administrative remote execution via WinRM and PowerShell remoting.",
      "Queried Windows Security log (Event IDs 4688, 4624) and Sysmon operational log (Event IDs 1, 3) to trace execution artifacts.",
      "Triage alerts generated within the Wazuh SIEM dashboard and analyzed rule trigger conditions."
    ],
    implemented: [
      "Custom Sysmon v14 XML schema deployed to Windows 10 and Windows Server 2022 endpoints.",
      "Wazuh agent service configured to forward Security, System, and Sysmon event channels via encrypted TLS.",
      "Centralized Wazuh manager receiving real-time log ingestion on an isolated internal subnet."
    ],
    observed: [
      "Sysmon Event ID 1 (Process Creation) recorded command-line arguments and parent-process relationships for WinRM-spawned processes.",
      "Sysmon Event ID 3 (Network Connection) logged remote IP and destination port 5985/5986 during remoting sessions.",
      "Wazuh alert triggered indicating potential lateral movement activity (Rule ID 902010 noted in lab notes; awaiting verified rule catalog confirmation)."
    ],
    recommended: [
      "Enable PowerShell Script Block Logging (Event ID 4104) and Transcription for deep command execution inspection.",
      "Enforce Just Enough Administration (JEA) and Constrained Language Mode to limit WinRM abuse surfaces.",
      "Segment administrative endpoints into dedicated management subnets with strict firewall access control lists."
    ],
    results: [
      {
        text: "Endpoint telemetry pipeline successfully configured with Sysmon and forwarded to Wazuh SIEM manager.",
        verified: true
      },
      {
        text: "Windows Event Logs captured WinRM connection attempts and associated child process spawn hierarchy.",
        verified: true
      },
      {
        text: "Wazuh alert rule ID 902010 lateral movement classification (Rule definition requires final verification before production cataloging).",
        verified: false
      }
    ],
    limitations: [
      "Windows Event Forwarding (WEF) could not be configured due to non-domain (workgroup) environment constraints; local Wazuh agent log collection was utilized instead.",
      "The lab configuration does not detect all lateral movement evasion techniques (e.g., in-memory execution or unhooked API calls)."
    ],
    evidence: [
      {
        src: "/images/projects/sysmon-wazuh-topology.svg",
        alt: "Lab topology diagram showing Wazuh manager and Windows endpoints",
        caption: "Virtual lab network topology showing isolated host-only subnet with Wazuh SIEM and monitored endpoints."
      },
      {
        src: "/images/projects/sysmon-config-sample.svg",
        alt: "Sysmon configuration and event capture visualization",
        caption: "Telemetry flow: Sysmon Event ID 1 capture of process creation arguments forwarded to Wazuh agent."
      }
    ],
    lessons: [
      "Gained deep appreciation for parent-child process relationships when hunting for living-off-the-land attacks.",
      "Learned the architectural differences and operational tradeoffs between native Windows Event Forwarding and third-party agent pipelines.",
      "Understood that log volume must be balanced with detection value to prevent SIEM storage exhaustion."
    ]
  },
  {
    slug: "secure-vpn-remote-access-openvpn",
    title: "Establishing a Secure VPN for Remote Access",
    category: "Network Security",
    status: "In Progress",
    summary:
      "A hands-on network security lab configuring an OpenVPN gateway, managing PKI certificate infrastructure, verifying tunnel encryption, and diagnosing client routing.",
    problem:
      "Remote workers require access to internal network resources over untrusted public networks. Unencrypted communications risk packet sniffing, credential harvesting, and man-in-the-middle attacks, necessitating authenticated, encrypted tunneling.",
    objectives: [
      "Master VPN tunneling fundamentals and cryptographic mechanisms",
      "Build and configure an OpenVPN client-to-site gateway on Linux",
      "Generate and manage a Public Key Infrastructure (PKI) with Easy-RSA",
      "Package and distribute client configuration profiles (.ovpn)",
      "Verify packet encapsulation and cipher strength with Wireshark",
      "Diagnose network routing, IP forwarding, and test MFA integration"
    ],
    environment: [
      "Ubuntu Server 22.04 LTS VM (OpenVPN Gateway Server)",
      "Windows 10 Client VM (Remote Client)",
      "VMware Workstation 17 Pro Virtual Network Editor (Segmented subnets)",
      "Easy-RSA 3.x Certificate Authority",
      "OpenVPN 2.5 Community Edition",
      "Wireshark Network Protocol Analyzer"
    ],
    technologies: [
      "OpenVPN",
      "Easy-RSA / PKI",
      "iptables / NAT",
      "Wireshark",
      "Linux Networking (sysctl, iproute2)",
      "AES-256-GCM / TLS 1.3"
    ],
    methodology: [
      "Designed a two-network virtual environment: an external untrusted subnet (192.168.100.0/24) and an internal protected subnet (10.8.0.0/24).",
      "Initialized Easy-RSA CA and generated server certificate, private key, and Diffie-Hellman parameters.",
      "Configured OpenVPN server daemon specifying TLS cipher suites, TUN interface, and push routes.",
      "Enabled Linux kernel IPv4 forwarding and configured iptables NAT masquerade rules.",
      "Issued a dedicated client certificate, bundled configuration into client.ovpn, and imported into Windows OpenVPN GUI.",
      "Monitored network interfaces with Wireshark to verify that payload traffic was fully encapsulated in encrypted OpenVPN datagrams."
    ],
    implemented: [
      "OpenVPN TUN tunnel with AES-256-GCM data channel cipher and SHA256 digest authentication.",
      "TLS-Auth / TLS-Crypt HMAC packet signing to prevent port scanning and DoS on the VPN listening port.",
      "Automated client configuration generation script bundling CA cert, client cert, and TLS auth key."
    ],
    observed: [
      "Windows 10 client successfully established connection and received virtual IP 10.8.0.6.",
      "Wireshark packet captures confirmed internal communications were entirely payload-encrypted inside UDP 1194 datagrams.",
      "Explored Multi-Factor Authentication via Google Authenticator PAM module; the client connection succeeded via certificate but did not prompt for OTP in GUI."
    ],
    recommended: [
      "Complete client-side MFA integration using challenge-response authentication with OpenVPN 2.6+ auth-token directives.",
      "Enforce network segmentation and microsegmentation behind the VPN gateway to restrict lateral movement.",
      "Implement certificate revocation lists (CRL) checking automatically via cron jobs."
    ],
    results: [
      {
        text: "Encrypted OpenVPN tunnel successfully established between remote Windows client and Linux gateway.",
        verified: true
      },
      {
        text: "Packet encapsulation, TLS handshake, and routing verified via Wireshark and ICMP reachability tests.",
        verified: true
      },
      {
        text: "MFA OTP prompt integration (Attempted with PAM module, but OTP prompt failed to appear in client GUI; listed as attempted / not yet working).",
        verified: false
      }
    ],
    limitations: [
      "MFA OTP authentication did not trigger in the Windows GUI client during initial trials and remains an active troubleshooting task.",
      "Throughput and MTU path discovery tuning under heavy latency was not evaluated."
    ],
    evidence: [
      {
        src: "/images/projects/vpn-architecture.svg",
        alt: "OpenVPN architecture and network routing diagram",
        caption: "VPN gateway topology: client-to-site encrypted tunnel spanning untrusted virtual WAN to secure LAN."
      },
      {
        src: "/images/projects/vpn-wireshark-verification.svg",
        alt: "Wireshark capture showing encrypted OpenVPN UDP packets",
        caption: "Packet inspection: all client traffic is encapsulated within encrypted UDP datagrams over port 1194."
      }
    ],
    lessons: [
      "Learned the critical difference between TAP (Layer 2 Ethernet bridging) and TUN (Layer 3 IP routing) modes.",
      "Understood certificate management lifecycles and why individual client certificates are vital for revoking compromised devices.",
      "Discovered client software dependencies when attempting challenge-response multi-factor workflows."
    ]
  },
  {
    slug: "iot-smart-home-security-assessment",
    title: "IoT Smart Home Security Assessment",
    category: "IoT Security",
    status: "In Progress",
    summary:
      "An architectural evaluation and protocol analysis of consumer smart-home IoT devices, examining network telemetry, cleartext vulnerabilities, and defense-in-depth mitigations.",
    problem:
      "Consumer IoT devices often prioritize low cost and user convenience over security, shipping with hardcoded credentials, unencrypted communication protocols, and unpatched firmware vulnerabilities that expose home and enterprise networks.",
    objectives: [
      "Map smart-home IoT architecture and cloud-to-device communication paths",
      "Capture and analyze local device network traffic using Wireshark",
      "Identify insecure protocols (unencrypted HTTP, cleartext MQTT, SSDP/mDNS)",
      "Assess the impact of compromised IoT devices on local network security",
      "Formulate realistic defense-in-depth hardening recommendations"
    ],
    environment: [
      "Simulated IoT Device Testbed (Embedded services & smart home controllers)",
      "Wireshark Protocol Analyzer",
      "Nmap Security Scanner",
      "Ubuntu Linux Security Audit Host",
      "Segmented VLAN Network Model"
    ],
    technologies: [
      "Wireshark",
      "Nmap",
      "MQTT & MQTTS",
      "mDNS / SSDP",
      "TCP/IP Analysis",
      "Network Segmentation (VLANs)"
    ],
    methodology: [
      "Cataloged device inventory, documented advertised capabilities, and mapped network interfaces.",
      "Executed non-intrusive Nmap service scans to identify exposed listening ports and services.",
      "Established Wireshark port mirroring to capture device initialization and telemetry broadcasts.",
      "Dissected application layer payloads for cleartext credentials, device telemetry, and cloud reporting.",
      "Synthesized findings into an actionable risk assessment report with prioritized remediations."
    ],
    implemented: [
      "Passive network capture filters targeting device MAC addresses and multicast broadcast traffic.",
      "Traffic analysis profile in Wireshark for decoding MQTT publish/subscribe topics and HTTP payloads."
    ],
    observed: [
      "Unencrypted device discovery broadcasts transmitting device hardware MAC, device name, and software build numbers.",
      "Cleartext MQTT telemetry messages published without TLS encryption on standard port 1883.",
      "Frequent outbound cloud synchronization calls lacking certificate pinning."
    ],
    recommended: [
      "Enforce network segmentation by placing all IoT devices on a dedicated, isolated guest/IoT VLAN with no access to private LAN resources.",
      "Disable Universal Plug and Play (UPnP) on edge routers to prevent unauthorized inbound port forwarding.",
      "Advocate for vendor adoption of encrypted MQTTS (port 8883) and cryptographically signed firmware with hardware Secure Boot."
    ],
    results: [
      {
        text: "Identified and documented unencrypted broadcast telemetry and cleartext MQTT messages in testbed traffic.",
        verified: true
      },
      {
        text: "Formulated comprehensive smart-home threat model and network segmentation blueprint.",
        verified: true
      },
      {
        text: "Hardware Secure Boot validation (Documented as proposed control and planned test; requires physical silicon testbed).",
        verified: false
      }
    ],
    limitations: [
      "Hardware-level reverse engineering (JTAG, UART, flash memory dumping) was out of scope.",
      "Firmware integrity signing and Secure Boot are documented as recommended controls rather than experimentally verified."
    ],
    evidence: [
      {
        src: "/images/projects/iot-threat-model.svg",
        alt: "IoT smart home threat model and network segmentation architecture",
        caption: "Threat model diagram highlighting untrusted IoT devices isolated via dedicated VLAN segmentation."
      },
      {
        src: "/images/projects/iot-traffic-analysis.svg",
        alt: "Wireshark packet trace of cleartext MQTT traffic",
        caption: "Traffic inspection revealing unencrypted MQTT payload data transmitted across the local subnet."
      }
    ],
    lessons: [
      "Observed firsthand how consumer IoT devices assume implicit trust in the local network.",
      "Recognized that perimeter network isolation (VLANs) remains the single most effective defense for legacy devices.",
      "Understood the practical challenges of retrofitting cryptographic standards onto resource-constrained microcontrollers."
    ]
  },
  {
    slug: "web-application-security-burp-suite",
    title: "Web Application Security Testing with Burp Suite",
    category: "Web Application Security",
    status: "In Progress",
    summary:
      "Practical web security testing in authorized environments using Burp Suite to intercept HTTP traffic, analyze request structures, and evaluate host-header manipulation behaviors.",
    problem:
      "Web applications frequently place unwarranted trust in incoming HTTP request headers. When applications rely on the HTTP Host header to generate links, reset passwords, or route internal requests, attackers can exploit these assumptions to stage cache poisoning or redirection attacks.",
    objectives: [
      "Master Burp Suite Proxy, Target Scope, and HTTP message analysis",
      "Inspect and manipulate client-server HTTP headers in Burp Repeater",
      "Evaluate application responses to modified and duplicated Host headers",
      "Investigate potential web cache poisoning vectors and link injection",
      "Document reproducible, evidence-based test cases and remediation guidance"
    ],
    environment: [
      "Burp Suite Community Edition",
      "Chromium Browser with Burp CA Root Certificate",
      "PortSwigger Web Security Academy Authorized Practice Labs",
      "Browser Developer Tools (Network & Console)"
    ],
    technologies: [
      "Burp Suite Proxy & Repeater",
      "HTTP/1.1 & HTTP/2 Protocols",
      "Web Cache Mechanics",
      "Host Header Testing",
      "OWASP Web Security Testing Guide"
    ],
    methodology: [
      "Configured browser proxy to route web traffic through Burp Suite on 127.0.0.1:8080 with trusted CA root.",
      "Explored target functionality, building out the target site map and defining strict in-scope URL patterns.",
      "Intercepted HTTP GET and POST requests during account actions and sent them to Burp Repeater.",
      "Modified the `Host` header to arbitrary hostnames and tested duplicate headers (`Host: target` + `Host: attacker`).",
      "Analyzed server response status codes, `Location` headers, and HTML response bodies for reflected host values.",
      "Evaluated whether downstream caching servers cached responses containing manipulated host header artifacts."
    ],
    implemented: [
      "Configured target scope rules in Burp to isolate authorized lab endpoints and prevent noise.",
      "Built structured Repeater tabs categorizing baseline requests, modified host headers, and cache test iterations."
    ],
    observed: [
      "Observed instance where an application reflected the injected `Host` header into generated absolute links in HTML output.",
      "Noted response differences when sending invalid ports or malformed host headers (`Host: target:evil`).",
      "Verified that altering the Host header does not automatically constitute a vulnerability without proven exploit impact."
    ],
    recommended: [
      "Reject any incoming request with an unrecognized Host header by validating against an explicit server allowlist.",
      "Use relative URLs for internal navigation and rely on server configuration rather than client headers for absolute URLs.",
      "Configure front-end reverse proxies to normalize and sanitize the Host header before forwarding to back-end servers."
    ],
    results: [
      {
        text: "Successfully captured, modified, and analyzed HTTP request-response pairs using Burp Suite Repeater.",
        verified: true
      },
      {
        text: "Identified and documented reflected Host header behavior in controlled authorized test lab.",
        verified: true
      },
      {
        text: "Production exploit chaining (Testing was strictly confined to authorized educational lab scope; no out-of-scope targets tested).",
        verified: false
      }
    ],
    limitations: [
      "Testing strictly adhered to ethical boundaries in authorized sandbox labs; no unauthorized testing was performed.",
      "Host header reflections were analyzed in isolation without chaining into multi-step exploitation."
    ],
    evidence: [
      {
        src: "/images/projects/burp-repeater-workflow.svg",
        alt: "Burp Suite Repeater workflow diagram",
        caption: "Burp Suite interception pipeline: modifying Host header parameters and analyzing server response diffs."
      },
      {
        src: "/images/projects/burp-request-diff.svg",
        alt: "HTTP request and response header comparison",
        caption: "Response inspection highlighting reflected host values inside server-generated link attributes."
      }
    ],
    lessons: [
      "Learned that HTTP headers are untrusted user input that requires validation just like form fields or URL query parameters.",
      "Understood the operational architecture of forward vs. reverse web proxies.",
      "Recognized the importance of reproducible documentation in professional penetration testing reporting."
    ]
  },
  {
    slug: "open-redirection-testing-security-headers",
    title: "Open Redirection Testing with Security Headers",
    category: "Web Application Security",
    status: "Planned",
    summary:
      "Methodological framework and laboratory test plan to investigate unvalidated redirection parameters and analyze HTTP response header defenses.",
    problem:
      "Web applications frequently redirect users to login pages, landing pages, or external resources using URL parameters. If the destination URL is not strictly validated on the server, attackers can craft links that redirect victims to malicious phishing pages.",
    objectives: [
      "Understand the mechanics of unvalidated redirects and forwards",
      "Identify common redirect parameter patterns (e.g., ?redirect=, ?next=, ?url=)",
      "Analyze HTTP 301, 302, and 307 response headers and Location directives",
      "Evaluate header defense baselines using automated scanner observations",
      "Formulate server-side validation and allowlist defense patterns"
    ],
    environment: [
      "Authorized Web Application Lab Environment",
      "Burp Suite Community Edition",
      "SecurityHeaders.com & Mozilla Observatory Analysis Tools",
      "Python 3 Scripting Environment"
    ],
    technologies: [
      "HTTP Status Codes (301, 302, 307)",
      "Location Header Analysis",
      "Burp Suite",
      "OWASP Testing Guide (WSTG-CLNT-04)",
      "Defense-in-depth allowlisting"
    ],
    methodology: [
      "Spider target application to discover all forms, login triggers, and logout handlers featuring redirect behavior.",
      "Extract query parameters and form fields associated with redirection workflows.",
      "Submit test payloads including absolute external URLs, protocol-relative URLs (`//example.com`), and URL-encoded strings.",
      "Analyze HTTP response headers to observe whether the `Location` header faithfully mirrors input without validation.",
      "Document remediation architecture including regex allowlists and domain tokenization."
    ],
    implemented: [
      "Structured test methodology matrix detailing standard redirect parameter candidates and bypass test cases.",
      "Audited baseline security headers (Content-Security-Policy, Referrer-Policy) on target testbed."
    ],
    observed: [
      "Security header scanners highlight missing CSP directives as initial observations; full verification requires application-level execution.",
      "Documented parameter handling behavior where relative paths were safely handled but external prefixes required boundary testing."
    ],
    recommended: [
      "Avoid user-controllable destination parameters whenever possible; use indirect tokens (e.g., ?dest_id=1).",
      "If user-supplied redirects are unavoidable, enforce strict server-side allowlists matching only approved relative paths.",
      "Require user confirmation dialogs before redirecting to external domains."
    ],
    results: [
      {
        text: "Formal testing methodology and parameter audit checklist established.",
        verified: true
      },
      {
        text: "Security header analysis workflow verified on sample test endpoints.",
        verified: true
      },
      {
        text: "Application-level vulnerability validation (Planned lab execution phase; marked pending lab testbed setup).",
        verified: false
      }
    ],
    limitations: [
      "Security scanner output provides initial heuristics only; application-level behavioral verification is planned for upcoming lab sessions.",
      "Project is currently classified as Planned on the portfolio roadmap."
    ],
    evidence: [
      {
        src: "/images/projects/open-redirect-flow.svg",
        alt: "Open redirect attack flow and mitigation diagram",
        caption: "Flowchart comparing vulnerable direct URL parameter redirection against server-side allowlist validation."
      }
    ],
    lessons: [
      "Understood that open redirection is frequently undervalued in severity, yet forms the linchpin of convincing phishing campaigns.",
      "Learned that automated scanners frequently emit false positives without manual verification of the execution flow.",
      "Appreciated the simplicity and robustness of indirect reference maps over complex regex parsing."
    ]
  }
];

