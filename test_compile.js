// Quick test: Send a compilation request using your actual resume data
const testPayload = {
  formData: {
    header: {
      fullName: "Wan Muhammad Ikmal Bin Wan Mohd Marzuki",
      title: "Computer Science Fresh Graduate",
      location: "Kajang, Selangor",
      email: "wikmal69@gmail.com",
      phone: "+60 149-90 4233",
      linkedin: "www.linkedin.com/in/wanikmalmarzuki",
      github: "https://github.com/Podolskyy",
      targetPosition: "Software Engineer / QA",
      startDate: "2 October 2026"
    },
    experiences: [
      {
        company: "Ant International",
        role: "Software Engineer in Test Internship",
        dateRange: "March 2026 - Present",
        bullets: [
          { text: "Spearheaded the development of a comprehensive Selenium-based automated testing framework across 3 core platforms.", tags: ["qa", "automation"] },
          { text: "Designed and executed 63 functional test cases using Selenium IDE, significantly reducing manual regression testing.", tags: ["qa"] },
          { text: "Transitioned toward full-stack engineering, completing backend development upskilling with Java and Spring.", tags: ["backend"] },
          { text: "Collaborated with cross-functional engineering teams across 4 countries to align testing strategies.", tags: ["qa", "backend"] }
        ]
      }
    ],
    projects: [
      {
        projectName: "JARS - Job Application Response System",
        technologies: "PHP, MySQL, HTML/CSS, JavaScript",
        date: "2025",
        bullets: [
          { text: "Designed and developed a web-based career portal connecting students and employers with real-time application tracking.", tags: ["backend", "frontend"] },
          { text: "Implemented role-based access control and secure authentication using PHP sessions and MySQL.", tags: ["backend"] }
        ]
      },
      {
        projectName: "Smart Bathroom Monitoring System",
        technologies: "Arduino, ESP32, Flutter, Firebase",
        date: "2024",
        bullets: [
          { text: "Built a real-time IoT monitoring dashboard using Flutter and Firebase for occupancy and environment tracking.", tags: ["iot", "mobile"] },
          { text: "Programmed Arduino sensors (DHT11, PIR, Ultrasonic) to capture environmental data.", tags: ["iot"] }
        ]
      }
    ],
    education: {
      institution: "Universiti Utara Malaysia (UUM)",
      location: "Sintok, Kedah",
      degree: "Bachelor of Computer Science with Honours",
      cgpa: "3.67/4.00",
      dates: "October 2022 - October 2026",
      specialisation: "Human-Centred Computing",
      coursework: ["Data Structures & Algorithms", "Software Engineering", "Database Systems", "Web Programming", "Human-Computer Interaction"]
    },
    skills: {
      "Programming Languages": ["Java", "Python", "Javascript", "HTML/CSS", "PHP", "Flutter", "SQL"],
      "Technologies": ["OpenCV", "Firebase", "Selenium", "Cypress", "JIRA", "Docker", "Arduino"],
      "Frameworks": ["NodeJS", "TestNG", "Selenium", "Spring"],
      "AI": ["Claude", "Gemini", "Prompt Engineering", "Agentic Workflows"]
    },
    awards: [
      { title: "Dean's Honour List", details: "Semester 1-6 (2022-2025)" },
      { title: "Gold Medal - FUSION 2025", details: "National innovation competition" },
      { title: "MUET Band 5 (Expert)", details: "Malaysian University English Test" }
    ],
    certifications: [
      { name: "Cisco CCNA: Introduction to Networks", date: "2023", description: "Networking fundamentals, IPv4/IPv6, routing and switching." }
    ],
    languages: ["Malay (Native)", "English (Expert - MUET Band 5)"],
    references: [
      { name: "Dr. Example Supervisor", organization: "Universiti Utara Malaysia", role: "Senior Lecturer", email: "supervisor@uum.edu.my", phone: "+60 12-345 6789" }
    ]
  },
  activeTags: "",
  pageLimit: 2,
  profileName: "Full Profile Test"
};

fetch('http://localhost:3000/api/resume/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
})
.then(r => r.json())
.then(data => {
  console.log('\n=== COMPILATION RESULT ===');
  console.log('Resume ID:', data.resumeId);
  console.log('XSD Status:', data.xsdStatus);
  console.log('Layout Status:', data.layoutStatus);
  console.log('Layout Details:', data.layoutDetails);
  console.log('Actual Pages:', data.actualPages);
  console.log('PDF URL:', data.pdfUrl);
  console.log('Screenshot URL:', data.screenshotUrl);
  if (data.diffUrl) console.log('Diff URL:', data.diffUrl);
})
.catch(err => console.error('Test failed:', err));
