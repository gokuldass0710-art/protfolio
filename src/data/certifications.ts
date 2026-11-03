export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  badge?: string;
  status: "Completed" | "In Progress" | "Planned";
  type: "certification" | "course" | "informal";
  description?: string;
}

export const certificationsData: {
  emptyStateMessage: string;
  certifications: CertificationItem[];
  courses: CertificationItem[];
  learningPlatforms: {
    platform: string;
    focus: string;
    status: string;
  }[];
} = {
  emptyStateMessage:
    "Currently building foundational knowledge toward my first professional cybersecurity certification.",
  certifications: [
    {
      id: "sec-plus",
      name: "CompTIA Security+",
      issuer: "CompTIA",
      status: "Planned",
      type: "certification",
      description: "Foundational baseline coverage of security principles, network defense, threat analysis, and risk management."
    },
    {
      id: "ejpt",
      name: "eJPT (eLearnSecurity Junior Penetration Tester)",
      issuer: "INE Security",
      status: "Planned",
      type: "certification",
      description: "Hands-on penetration testing methodology, network enumeration, and vulnerability assessment."
    }
  ],
  courses: [
    {
      id: "thm-soc",
      name: "SOC Level 1 Learning Path",
      issuer: "TryHackMe",
      status: "In Progress",
      type: "course",
      description: "Practical modules covering network security, endpoint security, SIEM tooling (Wazuh/Splunk), and incident handling."
    },
    {
      id: "portswigger-academy",
      name: "Web Security Practitioner Path",
      issuer: "PortSwigger Web Security Academy",
      status: "In Progress",
      type: "course",
      description: "Interactive labs covering server-side vulnerabilities, client-side topics, and HTTP manipulation."
    }
  ],
  learningPlatforms: [
    {
      platform: "TryHackMe",
      focus: "Blue Team Defense, SOC Fundamentals, Linux & Windows privilege inspection",
      status: "Active Lab Work"
    },
    {
      platform: "PortSwigger Web Security Academy",
      focus: "HTTP request tampering, Host header attacks, and OWASP Top 10 vulnerabilities",
      status: "Active Lab Work"
    },
    {
      platform: "Self-Hosted Virtualized Cyber Lab",
      focus: "Wazuh SIEM, Sysmon, OpenVPN, Kali Linux, and Windows Server 2022",
      status: "Continuous Lab Environment"
    }
  ]
};

