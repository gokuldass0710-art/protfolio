export type SkillLevel = "Hands-on" | "Learning" | "Fundamentals";

export interface SkillItem {
  name: string;
  level: SkillLevel;
  note?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "blue-team",
    title: "Security Monitoring / Blue Team",
    description: "Endpoint telemetry, log analysis, and SIEM alerting workflows",
    skills: [
      { name: "Wazuh SIEM", level: "Hands-on", note: "Configured agent log collection & rule alerts" },
      { name: "Sysmon", level: "Hands-on", note: "Configured detailed Windows process & network event tracking" },
      { name: "Windows Event Logs", level: "Hands-on", note: "Security, System, and WinRM event log inspection" },
      { name: "Security Event Analysis", level: "Hands-on", note: "Triage and artifact correlation" },
      { name: "Endpoint Telemetry", level: "Hands-on", note: "System activity and telemetry pipeline" },
      { name: "Incident Detection Fundamentals", level: "Fundamentals", note: "Triage workflows and threat containment concepts" }
    ]
  },
  {
    id: "network-security",
    title: "Network Security & Analysis",
    description: "Packet inspection, protocol behavior, and network reconnaissance",
    skills: [
      { name: "Wireshark", level: "Hands-on", note: "PCAP inspection, protocol filtering & packet stream analysis" },
      { name: "Nmap", level: "Hands-on", note: "Host discovery, port scanning, and service versioning" },
      { name: "DNS & HTTP/HTTPS Analysis", level: "Hands-on", note: "Inspecting protocol headers & handshake behavior" },
      { name: "TCP/IP Protocol Suite", level: "Fundamentals", note: "Handshakes, flags, subnetting, and state transitions" },
      { name: "Scapy", level: "Learning", note: "Exploring packet crafting and custom packet injection" },
      { name: "Netcat / Ncat", level: "Learning", note: "Port listener and banner grabbing testing" },
      { name: "Hping3", level: "Learning", note: "Custom TCP/UDP/ICMP probe testing" }
    ]
  },
  {
    id: "web-security",
    title: "Web Application Security",
    description: "HTTP inspection, client-server testing, and OWASP vulnerability analysis",
    skills: [
      { name: "Burp Suite", level: "Hands-on", note: "Proxy interception, target sitemap, and scope setup" },
      { name: "Burp Repeater", level: "Hands-on", note: "Request tampering, header manipulation & response diffing" },
      { name: "HTTP Request Analysis", level: "Hands-on", note: "Verb manipulation, parameter tampering, and status codes" },
      { name: "Host Header Testing", level: "Hands-on", note: "Testing web server routing and caching responses" },
      { name: "OWASP Top 10", level: "Fundamentals", note: "Core application security risks & remediation patterns" },
      { name: "Open Redirection Testing", level: "Learning", note: "Unvalidated redirect parameters and header analysis" },
      { name: "SQLi & XSS Fundamentals", level: "Fundamentals", note: "Input injection risks, encoding, and prepared statements" }
    ]
  },
  {
    id: "os-virtualization",
    title: "OS & Virtualization",
    description: "Lab infrastructure, guest virtualization, and administration",
    skills: [
      { name: "Kali Linux", level: "Hands-on", note: "Security assessment distribution and CLI tools" },
      { name: "Windows 10", level: "Hands-on", note: "Client endpoint administration and event monitoring" },
      { name: "Windows Server 2022", level: "Hands-on", note: "Server roles, WinRM service, and event auditing" },
      { name: "Ubuntu Server", level: "Hands-on", note: "OpenVPN gateway host and Linux services" },
      { name: "VMware Workstation 17 Pro", level: "Hands-on", note: "Host-only and NAT virtual network topologies" },
      { name: "PowerShell & Linux CLI", level: "Fundamentals", note: "Command-line navigation, scripting basics, and process inspection" }
    ]
  },
  {
    id: "vpn-networking",
    title: "VPN & Network Configuration",
    description: "Secure tunnels, remote access topologies, and gateway routing",
    skills: [
      { name: "OpenVPN", level: "Hands-on", note: "Server configuration, client ovpn profiles, and tunnel verification" },
      { name: "VPN Configuration", level: "Hands-on", note: "Cryptographic cipher suite selection and tunnel interface testing" },
      { name: "Network Troubleshooting", level: "Hands-on", note: "Route tables, IP forwarding, and firewall inspection" },
      { name: "Client-to-Site & Site-to-Site", level: "Fundamentals", note: "VPN topologies, gateways, and routing principles" }
    ]
  },
  {
    id: "scripting-languages",
    title: "Scripting & Technical Foundations",
    description: "Automation, web development fundamentals, and data formatting",
    skills: [
      { name: "HTML & CSS", level: "Hands-on", note: "Semantic structure, responsive layouts, and UI development" },
      { name: "JavaScript", level: "Fundamentals", note: "DOM manipulation, asynchronous fetching, and web logic" },
      { name: "Python", level: "Fundamentals", note: "Basic automation scripts, log parsing, and data manipulation" },
      { name: "PowerShell", level: "Fundamentals", note: "Event querying (Get-WinEvent) and Windows administration" },
      { name: "Bash", level: "Learning", note: "Linux command pipelines and automation basics" }
    ]
  }
];

