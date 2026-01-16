// Committee Data
import { memberImage } from "./memberData.js";

export const committeeData = {
  title: "Organizing Committee",
  subtitle: "Meet the team behind AAGAAZ",

  coreCommittee: {
    title: "Core Committee",
    members: [
      {
        name: "Aditya Yadav",
        role: "President",
        department: "CSE AI, 3rd Year",
        image: memberImage.aditya
      },
      {
        name: "Himanshu Singh",
        role: "Vice-President",
        department: "CE, 3rd Year",
        image: memberImage.himanshu
      },
      {
        name: "Priyanshu Shukla",
        role: "Secretary",
        department: "ME, 3rd Year",
        image: memberImage.priyanshu
      },
      {
        name: "Anubhav Rathore",
        role: "Joint Secretary",
        department: "CSE AI, 3rd Year",
        image: null
      },
      {
        name: "Vishwas Yadav",
        role: "Treasurer",
        department: "CE, 3rd Year",
        image: memberImage.vishwas
      }
    ]
  },

  webTeam: {
    title: "Web Team",
    members: [{
      name: "Aditya Ranjan",
      role: "Web Developer",
      department: "CSE, 4th Year",
      image: memberImage.adityaRanjan
    },
    {
      name: "Aman Singh Nishad",
      role: "Web Developer",
      department: "CSE, 4th Year",
      image: memberImage.amanSinghNishad
    },

    {
      name: "Ayush Singh",
      role: "Web Developer",
      department: "CSE, 4th Year",
      image: memberImage.ayushSingh
    },
    {
      name: "Aman Chaurasiya",
      role: "Web Developer",
      department: "CSE, 3rd Year",
      image: memberImage.aman
    }
    ]
  },

  executiveCommittee: {
    title: "Executive Committee",
    members: [
      {
        name: "Nilesh Pandey",
        role: "Event & Management Head",
        department: "ECE, 3rd Year",
        image: null
      },
      {
        name: "Om Gupta",
        role: "Event & Management Head",
        department: "EE, 3rd Year",
        image: memberImage.omGupta
      },
      {
        name: "Anup Kumar",
        role: "PR & Outreach Head",
        department: "CSE AI, 3rd Year",
        image: null
      },
      {
        name: "Sagar Singh Patel",
        role: "Social Media Lead",
        department: "CSE, 3rd Year",
        image: memberImage.sagar
      },
      {
        name: "Aman Chaurasiya",
        role: "Discipline In-Charge",
        department: "CSE, 3rd Year",
        image: memberImage.aman
      },
      {
        name: "Amretesh Mishra",
        role: "Discipline In-Charge",
        department: "CSE AI, 3rd Year",
        image: memberImage.amritesh
      }
    ]
  },

  trainingTeam: {
    title: "Training and Skills Team",
    members: [
      {
        name: "Ayushman Kumar",
        role: "Head",
        department: "ECE, 3rd Year",
        image: memberImage.ayushman
      },
      {
        name: "Harshit Kesarwani",
        role: "In-charge",
        department: "CSE, 3rd Year",
        image: memberImage.harshit
      },
      {
        name: "Devansh Dwivedi",
        role: "Team Member",
        department: "BCA, 2nd Year",
        image: memberImage.devansh
      },
      {
        name: "Harsh Gupta",
        role: "Team Member",
        department: "CSE AI, 2nd Year",
        image: memberImage.harshGupta
      },
      {
        name: "Sumit Kushwaha",
        role: "Team Member",
        department: "CSE, 2nd Year",
        image: null
      },
      {
        name: "Yuvraj Singh",
        role: "Team Member",
        department: "ME, 2nd Year",
        image: null
      },
      {
        name: "Rishabh Panday",
        role: "Team Member",
        department: "ME, 3rd Year",
        image: null
      }
    ]
  }
};

export default committeeData;
